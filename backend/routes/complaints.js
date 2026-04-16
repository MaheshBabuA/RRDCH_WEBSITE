const express = require('express');
const router = express.Router();
const complaintModel = require('../models/complaintModel');

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

const validCategories = ['maintenance', 'food', 'hygiene', 'noise', 'other'];

/**
 * Middleware: Input validation for creating a complaint
 */
const validateCreateComplaint = (req, res, next) => {
  const { student_name, student_phone, student_email, complaint_category, complaint_text } = req.body;

  if (!student_name || !student_phone || !student_email || !complaint_category || !complaint_text) {
    return res.status(400).json({ 
      success: false, 
      message: 'Missing required fields: student_name, student_phone, student_email, complaint_category, complaint_text' 
    });
  }

  if (!validCategories.includes(complaint_category.toLowerCase())) {
    return res.status(400).json({ 
      success: false, 
      message: `Invalid category. Allowed values: ${validCategories.join(', ')}` 
    });
  }

  next();
};

/**
 * 1. POST /api/complaints
 * Apply the validation middleware and utilize the database model
 */
router.post('/', validateCreateComplaint, async (req, res) => {
  try {
    const complaintData = {
      studentName: req.body.student_name,
      studentPhone: req.body.student_phone,
      studentEmail: req.body.student_email, 
      roomNumber: req.body.room_number || null, 
      issue: req.body.complaint_text,
      category: req.body.complaint_category.toLowerCase()
    };

    const result = await complaintModel.createComplaint(complaintData);

    if (result.success) {
      return res.status(201).json({
        success: true,
        complaintId: result.data.complaintId,
        message: "Complaint registered"
      });
    } else {
      return res.status(500).json({ success: false, message: result.error });
    }
  } catch (error) {
    console.error('Error creating complaint:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

/**
 * 2. GET /api/complaints/:studentPhone
 */
router.get('/:studentPhone', async (req, res, next) => {
  try {
    const { studentPhone } = req.params;
    
    // Quick guard to not ingest paths going implicitly to complaint details
    if (studentPhone.includes('details')) return next();

    const result = await complaintModel.getComplaintsByStudent(studentPhone);

    if (result.success) {
      return res.status(200).json({ success: true, complaints: result.data || [] });
    } else {
      return res.status(500).json({ success: false, message: result.error });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

/**
 * 4. GET /api/complaints/:complaintId/details
 */
router.get('/:complaintId/details', async (req, res) => {
  try {
    const { complaintId } = req.params;
    const result = await complaintModel.getComplaintById(complaintId);

    if (result.success) {
      if (result.data) {
        return res.status(200).json({ success: true, complaint: result.data });
      } else {
        return res.status(404).json({ success: false, message: 'Complaint not found.' });
      }
    } else {
      return res.status(500).json({ success: false, message: result.error });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

/**
 * 3. PUT /api/complaints/:complaintId
 */
router.put('/:complaintId', async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['open', 'in_progress', 'resolved'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Valid statuses are: ${validStatuses.join(', ')}` });
    }

    const result = await complaintModel.updateComplaintStatus(complaintId, status);

    if (result.success) {
      return res.status(200).json({ success: true, updated: true });
    } else {
      const isNotFound = result.error.includes('found');
      return res.status(isNotFound ? 404 : 500).json({ success: false, message: result.error });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

module.exports = router;
