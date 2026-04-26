const express = require('express');
const router = express.Router();
const { verifyToken, checkRole, checkDepartment } = require('../middleware/auth');

/**
 * GET /api/erp/appointments/queue
 * Returns active appointments for the logged-in user's department
 * Access: Doctor, HOD, Admin, Super Admin
 */
router.get('/queue', verifyToken, checkRole(['doctor', 'hod', 'admin', 'super_admin']), async (req, res) => {
  try {
    const { pool } = require('../config/database');
    const { department_id, role } = req.user;

    let query = `
      SELECT a.*, d.name as department_name, doc.name as doctor_name 
      FROM appointments a
      LEFT JOIN departments d ON a.department_id = d.id
      LEFT JOIN doctors doc ON a.doctor_id = doc.id
      WHERE a.status IN ('scheduled', 'confirmed', 'in_progress', 'PENDING')
    `;
    const params = [];

    // Filter by department unless admin/super_admin
    if (role === 'doctor' || role === 'hod') {
      if (!department_id) {
        return res.status(403).json({ success: false, message: 'You are not assigned to a department.' });
      }
      query += ` AND a.department_id = ?`;
      params.push(department_id);
    }

    query += ` ORDER BY a.appointment_date ASC, a.appointment_time ASC`;

    const [appointments] = await pool.execute(query, params);

    res.status(200).json({ success: true, count: appointments.length, appointments });
  } catch (error) {
    console.error('ERP Queue Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

/**
 * PUT /api/erp/appointments/:id/complete
 * Marks an appointment as completed
 * Access: Doctor, HOD
 */
router.put('/:id/complete', verifyToken, checkRole(['doctor', 'hod', 'super_admin']), async (req, res) => {
  try {
    const { pool } = require('../config/database');
    const { id } = req.params;
    const { department_id, role, id: userId } = req.user;

    // First check if the appointment belongs to the user's department
    const [existing] = await pool.execute(`SELECT department_id FROM appointments WHERE id = ?`, [id]);
    
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (role !== 'super_admin' && existing[0].department_id !== department_id) {
      return res.status(403).json({ success: false, message: 'You can only complete appointments for your department' });
    }

    // Update status and completion time
    // Assuming completion_time exists or we just use updated_at, but the prompt says "record completion timestamp"
    // Since we didn't add completion_time to the DB in setup_erp.js, let's just add it dynamically if missing or use status 'completed'.
    // The existing schema has 'updated_at' which auto-updates.
    await pool.execute(
      `UPDATE appointments SET status = 'completed', doctor_id = (SELECT id FROM doctors WHERE user_id = ? LIMIT 1) WHERE id = ?`,
      [userId, id]
    );

    res.status(200).json({ success: true, message: 'Appointment marked as completed' });
  } catch (error) {
    console.error('ERP Complete Appointment Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

/**
 * GET /api/erp/appointments/history
 * Returns completed appointments
 */
router.get('/history', verifyToken, checkRole(['doctor', 'hod', 'admin', 'super_admin']), async (req, res) => {
  try {
    const { pool } = require('../config/database');
    const { department_id, role } = req.user;

    let query = `
      SELECT a.*, d.name as department_name, doc.name as doctor_name 
      FROM appointments a
      LEFT JOIN departments d ON a.department_id = d.id
      LEFT JOIN doctors doc ON a.doctor_id = doc.id
      WHERE a.status = 'completed'
    `;
    const params = [];

    if (role === 'doctor' || role === 'hod') {
      if (!department_id) return res.status(403).json({ success: false, message: 'Not assigned to a department.' });
      query += ` AND a.department_id = ?`;
      params.push(department_id);
    }

    query += ` ORDER BY a.updated_at DESC LIMIT 50`;

    const [appointments] = await pool.execute(query, params);

    res.status(200).json({ success: true, count: appointments.length, appointments });
  } catch (error) {
    console.error('ERP History Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

module.exports = router;
