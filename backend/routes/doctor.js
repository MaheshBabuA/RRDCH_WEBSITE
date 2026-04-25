const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

/**
 * GET /api/doctor/appointments?doctor_id=...
 * Fetches today's live appointments for a specific doctor.
 */
router.get('/appointments', async (req, res) => {
  const { doctor_id } = req.query;
  if (!doctor_id) return res.status(400).json({ success: false, message: 'doctor_id required' });

  try {
    const query = `
      SELECT 
        a.appointment_id as id,
        a.patient_name,
        a.appointment_time as time,
        a.status
      FROM appointments a
      WHERE a.doctor_id = ? AND a.appointment_date = CURDATE()
      ORDER BY a.appointment_time ASC
    `;
    const [rows] = await pool.execute(query, [doctor_id]);
    res.json({ success: true, appointments: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * GET /api/doctor/duty-schedule
 * Returns mock duty schedule for PG doctors.
 */
router.get('/duty-schedule', async (req, res) => {
  // Normally this would be a DB query
  const schedule = [
    { id: 1, doctor: 'Dr. Rahul (PG)', dept: 'Orthodontics', status: 'Available' },
    { id: 2, doctor: 'Dr. Sneha (PG)', dept: 'Periodontics', status: 'In-Surgery' },
    { id: 3, doctor: 'Dr. Amit (PG)', dept: 'Pedodontics', status: 'Available' },
    { id: 4, doctor: 'Dr. Kavita (PG)', dept: 'Oral Surgery', status: 'On-Call' }
  ];
  res.json({ success: true, schedule });
});

module.exports = router;
