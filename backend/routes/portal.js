const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

/**
 * Endpoint: GET /api/portal/my-appointments
 * Retrieves all appointments associated with a specific phone number.
 */
router.get('/my-appointments', async (req, res) => {
  const { phone } = req.query;

  if (!phone) {
    return res.status(400).json({ 
      success: false, 
      message: 'Phone number is required' 
    });
  }

  try {
    const query = `
      SELECT * FROM appointments 
      WHERE patient_phone = ? 
      ORDER BY date DESC
    `;

    
    const [rows] = await pool.execute(query, [phone]);

    res.status(200).json({
      success: true,
      appointments: rows
    });

  } catch (error) {
    console.error('Error in /api/portal/my-appointments:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve appointments.' 
    });
  }
});

module.exports = router;
