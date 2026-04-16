const express = require('express');
const router = express.Router();
const departmentsController = require('../controllers/departmentsController');

router.get('/', departmentsController.getAllDepartments);
router.get('/:id', departmentsController.getDepartmentById);

module.exports = router;
