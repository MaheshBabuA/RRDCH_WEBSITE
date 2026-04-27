const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

/**
 * GET /api/doctor/appointments
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
 */
router.get('/duty-schedule', async (req, res) => {
  const schedule = [
    { id: 1, doctor: 'Dr. Rahul (PG)', dept: 'Orthodontics', status: 'Available' },
    { id: 2, doctor: 'Dr. Sneha (PG)', dept: 'Periodontics', status: 'In-Surgery' },
    { id: 3, doctor: 'Dr. Amit (PG)', dept: 'Pedodontics', status: 'Available' },
    { id: 4, doctor: 'Dr. Kavita (PG)', dept: 'Oral Surgery', status: 'On-Call' }
  ];
  res.json({ success: true, schedule });
});

/**
 * PATCH /api/doctor/call-next/:id
 */
router.patch('/call-next/:id', async (req, res) => {
  const { id } = req.params;
  const status = 'confirmed'; // Green/Ready on UI

  try {
    const [result] = await pool.execute(
      'UPDATE appointments SET status = ? WHERE appointment_id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    const io = req.app.get('io');
    io.emit('CALL_PATIENT', { appointment_id: id, status: 'In-Consultation' });

    res.json({ success: true, message: 'Patient called', status });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
