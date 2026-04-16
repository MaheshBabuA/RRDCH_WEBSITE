const express = require('express');
const router = express.Router();
const feedbackModel = require('../models/feedbackModel');

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
 * Validates payload for inserting feedback
 */
const validateFeedback = (req, res, next) => {
  const { user_name, rating, feedback_text, category } = req.body;

  if (!user_name || !rating || !feedback_text || !category) {
    return res.status(400).json({ 
      success: false, 
      message: 'Missing required configuration: user_name, rating, feedback_text, category.' 
    });
  }
  
  if (rating < 1 || rating > 5) {
     return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5.' });
  }

  next();
};

/**
 * 1. POST /api/feedback
 */
router.post('/', validateFeedback, async (req, res) => {
  try {
    // We map user_email directly onto the userPhone field due to constraints in older model struct
    const payloadBuffer = {
      userPhone: req.body.user_email || 'anonymous',
      category: req.body.category,
      rating: req.body.rating,
      comments: req.body.feedback_text
    };

    const result = await feedbackModel.submitFeedback(payloadBuffer);

    if (result.success) {
      return res.status(201).json({ 
        success: true, 
        feedbackId: result.data.feedbackId 
      });
    }
    
    return res.status(500).json({ success: false, message: result.error });
  } catch (error) {
    console.error('Unhandled Route Error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

/**
 * 2. GET /api/feedback
 * Currently public, but configured functionally for admin usage per requirements.
 */
router.get('/', async (req, res) => {
  try {
    const result = await feedbackModel.getAllFeedback();
    if (result.success) {
      return res.status(200).json({ success: true, feedback: result.data || [] });
    }
    return res.status(500).json({ success: false, message: result.error });
  } catch (error) {
    console.error('Unhandled Route Error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

module.exports = router;
