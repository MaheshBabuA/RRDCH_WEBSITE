const express = require('express');
const router = express.Router();
const doctorModel = require('../models/doctorModel');

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
 * 1. GET /api/doctors
 * Returns all doctors with availability
 */
router.get('/', async (req, res) => {
  try {
    const result = await doctorModel.getAllDoctors();
    if (result.success) {
      return res.status(200).json({ success: true, doctors: result.data || [] });
    }
    return res.status(500).json({ success: false, message: result.error });
  } catch (error) {
    console.error('Unhandled Route Error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

/**
 * 2. GET /api/doctors/:departmentId
 * Returns doctors in department
 */
router.get('/:departmentId', async (req, res) => {
  try {
    const { departmentId } = req.params;
    const result = await doctorModel.getDoctorsByDepartment(departmentId);
    if (result.success) {
      return res.status(200).json({ success: true, doctors: result.data || [] });
    }
    return res.status(500).json({ success: false, message: result.error });
  } catch (error) {
    console.error('Unhandled Route Error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

/**
 * 3. PUT /api/doctors/:doctorId/queue
 * Update patient queue count
 */
router.put('/:doctorId/queue', async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { patientCount } = req.body;

    if (patientCount === undefined || typeof patientCount !== 'number') {
      return res.status(400).json({ success: false, message: 'A valid numeric patientCount is required in the body' });
    }

    const result = await doctorModel.updateDoctorQueue(doctorId, patientCount);
    
    if (result.success) {
      return res.status(200).json({ success: true, updated: true });
    } else {
      const isNotFound = result.error.includes('found');
      return res.status(isNotFound ? 404 : 500).json({ success: false, message: result.error });
    }
  } catch (error) {
    console.error('Unhandled Route Error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

module.exports = router;
