const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

/**
 * Endpoint: GET /api/reception/check-in
 * Fetches current appointment and historical records via phone number.
 */
router.get('/check-in', async (req, res) => {
  const { phone } = req.query;

  if (!phone) {
    return res.status(400).json({ success: false, message: 'Phone number is required' });
  }

  try {
    // Lead: Fetch current active appointment (Scheduled/Confirmed)
    const [appointmentRows] = await pool.execute(`
      SELECT 
        a.appointment_id as id,
        a.patient_name,
        a.doctor_name as doctor,
        a.department_name as department,
        a.appointment_time as time,
        a.appointment_date as date,
        a.reason
      FROM appointments a
      WHERE a.patient_phone = ? AND a.status IN ('scheduled', 'confirmed', 'PENDING')
      ORDER BY a.appointment_date ASC
      LIMIT 1
    `, [phone]);

    const appointment = appointmentRows[0] || null;

    // Lead: Fetch historical records using a LEFT JOIN between appointments and patient_records
    const [historyRows] = await pool.execute(`
      SELECT 
        a.appointment_date as past_visit_date,
        a.department_name as dept,
        a.doctor_name as doctor_id,
        pr.diagnosis,
        pr.notes as history_notes
      FROM appointments a
      LEFT JOIN patient_records pr ON a.patient_id = pr.patient_id
      WHERE a.patient_phone = ? AND a.status = 'completed'
      ORDER BY a.appointment_date DESC
      LIMIT 5
    `, [phone]);

    res.status(200).json({
      success: true,
      appointment,
      history: historyRows || []
    });

  } catch (error) {
    console.error('Check-in Error:', error);
    res.status(500).json({ success: false, message: 'Database error during check-in' });
  }
});


/**
 * Endpoint: GET /api/reception/patient-profile
 */
router.get('/patient-profile', async (req, res) => {
  const { id } = req.query;
  if (!id) return res.status(400).json({ success: false, message: 'Patient ID is required' });

  try {
    const profileQuery = `
      SELECT 
        a.appointment_id,
        a.appointment_time as current_time,
        a.doctor_name as current_doctor,
        a.department_name as current_dept,
        pr.visit_date as past_visit_date,
        pr.diagnosis,
        pr.treatment,
        pr.notes as past_notes
      FROM appointments a
      LEFT JOIN patient_records pr ON a.patient_id = pr.patient_id
      WHERE a.patient_id = ? 
      ORDER BY a.appointment_date DESC, pr.visit_date DESC
    `;
    const [rows] = await pool.execute(profileQuery, [id]);

    if (rows.length === 0) {
      return res.status(200).json({ success: true, message: 'New Patient Profile', data: [] });
    }

    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error retrieving profile' });
  }
});

/**
 * Endpoint: PATCH /api/reception/confirm-arrival/:id
 */
router.patch('/confirm-arrival/:id', async (req, res) => {
  const { id } = req.params;
  const status = 'in_progress'; // Yellow/Waiting on UI

  try {
    const [result] = await pool.execute(
      'UPDATE appointments SET status = ? WHERE appointment_id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    const [aptRows] = await pool.execute('SELECT patient_name FROM appointments WHERE appointment_id = ?', [id]);
    const patient_name = aptRows[0]?.patient_name;

    const io = req.app.get('io');
    io.emit('PATIENT_ARRIVED', { id, patient_name, status });

    res.json({ success: true, message: 'Arrival confirmed', appointment: { id, patient_name, status } });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
