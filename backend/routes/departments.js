const express = require('express');
const router = express.Router();
const departmentModel = require('../models/departmentModel');

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
 * 1. GET /api/departments 
 * Returns all 11 departments with details
 */
router.get('/', async (req, res) => {
  try {
    const result = await departmentModel.getAllDepartments();
    if (result.success) {
      return res.status(200).json({ success: true, departments: result.data || [] });
    }
    return res.status(500).json({ success: false, message: result.error });
  } catch (error) {
    console.error('Unhandled Route Error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

/**
 * 2. GET /api/departments/:id
 * Returns single department
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await departmentModel.getDepartmentById(id);
    if (result.success) {
      if (result.data) {
        return res.status(200).json({ success: true, department: result.data });
      } else {
        return res.status(404).json({ success: false, message: 'Department not found' });
      }
    }
    return res.status(500).json({ success: false, message: result.error });
  } catch (error) {
    console.error('Unhandled Route Error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

module.exports = router;
