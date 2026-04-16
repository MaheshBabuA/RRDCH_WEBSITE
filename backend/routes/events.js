const express = require('express');
const router = express.Router();
const eventModel = require('../models/eventModel');
const { pool } = require('../config/database');

/**
 * Middleware: Log all requests and add CORS headers
 */
router.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === 'OPTIONS') return res.status(200).end();
  next();
});

/**
 * 1. GET /api/events
 * Returns all upcoming events
 */
router.get('/', async (req, res) => {
  try {
    const result = await eventModel.getUpcomingEvents();
    if (result.success) {
      return res.status(200).json({ success: true, events: result.data || [] });
    }
    return res.status(500).json({ success: false, message: result.error });
  } catch (error) {
    console.error('Unhandled Route Error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

/**
 * 3. GET /api/events/month/:monthYear
 * Returns events for specific month
 */
router.get('/month/:monthYear', async (req, res) => {
  try {
    const { monthYear } = req.params;
    const result = await eventModel.getEventsByMonth(monthYear);
    if (result.success) {
      return res.status(200).json({ success: true, events: result.data || [] });
    }
    return res.status(500).json({ success: false, message: result.error });
  } catch (error) {
    console.error('Unhandled Route Error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

/**
 * 2. GET /api/events/:id
 * Returns single event
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Model doesn't explicitly have getEventById, so querying directly
    const [rows] = await pool.execute('SELECT * FROM events WHERE event_id = ?', [id]);
    
    if (rows.length > 0) {
      return res.status(200).json({ success: true, event: rows[0] });
    } else {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
  } catch (error) {
    console.error('Unhandled Route Error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

module.exports = router;
