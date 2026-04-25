const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

/**
 * Endpoint: GET /api/reception/check-in
 * Triggered when a QR code is scanned by the receptionist.
 * Retrieves current appointment details (Doctor, Department, Time) 
 * and the patient's last 3 dental records from medical_history.
 */
router.get('/check-in', async (req, res) => {
  const { patient_id, apt_id } = req.query;

  if (!patient_id || !apt_id) {
    return res.status(400).json({ 
      success: false, 
      message: 'patient_id and apt_id (appointment_id) are required as query parameters' 
    });
  }

  try {
    // 1. Fetch Current Appointment Details (Doctor, Department, Time)
    const appointmentQuery = `
      SELECT 
        a.appointment_id,
        a.patient_id,
        a.patient_name,
        a.appointment_date,
        a.appointment_time,
        a.status,
        a.reason,
        a.doctor_name,
        d.name as department_name
      FROM appointments a
      LEFT JOIN departments d ON a.department_id = d.id
      WHERE a.appointment_id = ? AND a.patient_id = ?
    `;
    
    const [appointmentRows] = await pool.execute(appointmentQuery, [apt_id, patient_id]);
    const appointment = appointmentRows[0] || null;

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'No matching appointment found for the provided IDs.'
      });
    }

    // 2. Fetch Patient's Last 3 Medical History Records
    const historyQuery = `
      SELECT 
        visit_date,
        treatment_type,
        notes,
        doctor_name
      FROM medical_history 
      WHERE patient_id = ? 
      ORDER BY visit_date DESC 
      LIMIT 3
    `;
    
    const [historyRows] = await pool.execute(historyQuery, [patient_id]);

    res.status(200).json({
      success: true,
      appointment: {
        id: appointment.appointment_id,
        patient_name: appointment.patient_name,
        doctor: appointment.doctor_name,
        department: appointment.department_name,
        time: appointment.appointment_time,
        date: appointment.appointment_date,
        status: appointment.status,
        reason: appointment.reason
      },
      medical_history: historyRows || []
    });

  } catch (error) {
    console.error('Error in /api/reception/check-in:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to process check-in data.' 
    });
  }
});

module.exports = router;
