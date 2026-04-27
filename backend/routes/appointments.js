const express = require('express');
const router = express.Router();
const appointmentModel = require('../models/appointmentModel');
const { pool } = require('../config/database');

/**
 * 0. GET /api/appointments/queue
 * Get live queue for doctors
 */
router.get('/queue', async (req, res) => {
  try {
    const { doctor_id } = req.query;
    // Filter for 'PENDING' or 'confirmed' status as a base
    const query = `
      SELECT * FROM appointments 
      WHERE status IN ('PENDING', 'confirmed', 'With Doctor') 
      ${doctor_id ? 'AND doctor_id = ?' : ''} 
      ORDER BY appointment_date ASC
    `;
    const params = doctor_id ? [doctor_id] : [];
    const [rows] = await pool.execute(query, params);
    res.status(200).json({ success: true, queue: rows });
  } catch (error) {
    console.error('Queue Fetch Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch queue' });
  }
});

/**
 * Middleware: Log all requests and add CORS headers
 */
router.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  
  // CORS Headers
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

/**
 * Middleware: Input validation for creating an appointment
 */
const validateCreateAppointment = (req, res, next) => {
  const { patient_name, patient_phone, department_id, appointment_date, appointment_time } = req.body;

  // 1. Validate required fields
  if (!patient_name || !patient_phone || !department_id || !appointment_date || !appointment_time) {
    return res.status(400).json({ 
      success: false, 
      message: 'Missing required fields: patient_name, patient_phone, department_id, appointment_date, appointment_time are required.' 
    });
  }

  // 2. Validate phone format (allowing numbers, spaces, +, -, and parentheses for universal formats)
  const phoneRegex = /^[\d\s\+\-\(\)]{7,15}$/;
  if (!phoneRegex.test(patient_phone)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid phone format.' 
    });
  }

  // 3. Validate date is in the future
  const appointmentDateTimeStr = `${appointment_date}T${appointment_time}`;
  const appointmentDateTime = new Date(appointmentDateTimeStr);
  const now = new Date();

  if (isNaN(appointmentDateTime.getTime())) {
    return res.status(400).json({ success: false, message: 'Invalid date or time format.' });
  }

  if (appointmentDateTime < now) {
    return res.status(400).json({ success: false, message: 'Appointment date must be in the future.' });
  }

  next();
};

/**
 * 1. POST /api/appointments
 * Create a new appointment
 */
router.post('/', validateCreateAppointment, async (req, res) => {
  try {
    // Map REST payload to Model format
    const patientData = {
      patientName: req.body.patient_name,
      patientPhone: req.body.patient_phone,
      patientEmail: req.body.patient_email || null,
      departmentId: req.body.department_id,
      appointmentDate: req.body.appointment_date,
      appointmentTime: req.body.appointment_time + ':00',
      reason: req.body.notes || 'Routine Checkup'
    };

    const result = await appointmentModel.createAppointment(patientData);

    if (result.success) {
      // Lead: Emit 'appointment_update' for reactive frontend updates
      const io = req.app.get('io');
      io.emit('appointment_update', { 
        type: 'NEW_BOOKING', 
        appointmentId: result.appointmentId,
        patientName: req.body.patient_name
      });

      return res.status(201).json({
        success: true,
        appointmentId: result.appointmentId,
        confirmationNumber: result.confirmationNumber,
        patientId: result.patientId,
        message: 'Appointment successfully created.'
      });
    } else {

      return res.status(500).json({ success: false, message: result.error });
    }
  } catch (error) {
    console.error('Unhandled POST Error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

/**
 * 2. GET /api/appointments/:patientPhone
 * Get all appointments for a patient by phone number
 */
router.get('/:patientPhone', async (req, res) => {
  try {
    const { patientPhone } = req.params;
    
    // To prevent the :patientPhone param from absorbing '123/status' paths, 
    // we can do a quick check, although next() is usually better if mixed endpoints.
    if (patientPhone.includes('status')) return next();

    const result = await appointmentModel.getAppointmentByPatient(patientPhone);

    if (result.success) {
      if (result.data && result.data.length > 0) {
        return res.status(200).json({ success: true, appointments: result.data });
      } else {
        return res.status(404).json({ success: false, message: 'No appointments found for this phone number.' });
      }
    } else {
      return res.status(500).json({ success: false, message: result.error });
    }
  } catch (error) {
    console.error('Unhandled GET Phone Error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

/**
 * 3. GET /api/appointments/:appointmentId/status
 * Get a single appointment with current status
 */
router.get('/:appointmentId/status', async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const result = await appointmentModel.getAppointmentById(appointmentId);

    if (result.success) {
      if (result.data) {
        return res.status(200).json({ success: true, appointment: result.data });
      } else {
        return res.status(404).json({ success: false, message: 'Appointment not found.' });
      }
    } else {
      return res.status(500).json({ success: false, message: result.error });
    }
  } catch (error) {
    console.error('Unhandled GET Status Error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

/**
 * 4. PUT /api/appointments/:appointmentId
 * Update appointment status (for real-time updates)
 */
router.put('/:appointmentId', async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;

    const validStatuses = ['confirmed', 'in_progress', 'completed', 'cancelled', 'PENDING'];
    
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid status required. Options: ' + validStatuses.join(', ') 
      });
    }

    const result = await appointmentModel.updateAppointmentStatus(appointmentId, status);

    if (result.success) {
      // Lead: Emit 'appointment_update' for status changes (e.g., Doctor Console -> Patient Portal)
      const io = req.app.get('io');
      io.emit('appointment_update', { 
        type: 'STATUS_CHANGE', 
        appointmentId, 
        status 
      });

      return res.status(200).json({ success: true, updated: true });
    } else {
      // Could be 404 if not found or 500 for db errors
      const isNotFound = result.error.includes('found');
      return res.status(isNotFound ? 404 : 500).json({ success: false, message: result.error });
    }

  } catch (error) {
    console.error('Unhandled PUT Error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

module.exports = router;
