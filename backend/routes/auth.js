const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');

// Unified Login Endpoint
router.post('/login', async (req, res) => {
  const { user_id, password } = req.body;

  if (!user_id || !password) {
    return res.status(400).json({ success: false, message: 'User ID and password are required.' });
  }

  try {
    const { pool } = require('../config/database');
    
    // Check if user exists
    const [users] = await pool.execute(
      `SELECT id, user_id, password_hash, role, department_id, name, force_password_change 
       FROM users WHERE user_id = ?`,
      [user_id]
    );

    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const user = users[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    // Generate JWT payload
    const payload = {
      id: user.id,
      user_id: user.user_id,
      role: user.role,
      department_id: user.department_id,
      name: user.name
    };

    // Sign Token
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

    // Determine dashboard redirect based on role
    let dashboardPath = '/student-portal';
    switch (user.role) {
      case 'super_admin':
      case 'admin':
        dashboardPath = '/staff/reception-dashboard'; // Or a dedicated admin dashboard
        break;
      case 'doctor':
      case 'hod':
        dashboardPath = '/staff/doctor-dashboard';
        break;
      case 'patient':
        dashboardPath = '/patient-portal';
        break;
      case 'student':
        dashboardPath = '/student-portal';
        break;
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: payload,
      force_password_change: !!user.force_password_change,
      redirectUrl: dashboardPath
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error during login.' });
  }
});

// Update Password Endpoint (for force change)
router.post('/change-password', async (req, res) => {
  const { user_id, oldPassword, newPassword } = req.body;
  // Implementation... (simplified for now to save space, but basic logic below)
  try {
    const { pool } = require('../config/database');
    const [users] = await pool.execute(`SELECT id, password_hash FROM users WHERE user_id = ?`, [user_id]);
    if (users.length === 0) return res.status(404).json({ success: false, message: 'User not found' });
    
    const isValid = await bcrypt.compare(oldPassword, users[0].password_hash);
    if (!isValid) return res.status(401).json({ success: false, message: 'Incorrect old password' });
    
    const newHash = await bcrypt.hash(newPassword, 10);
    await pool.execute(`UPDATE users SET password_hash = ?, force_password_change = FALSE WHERE id = ?`, [newHash, users[0].id]);
    
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
