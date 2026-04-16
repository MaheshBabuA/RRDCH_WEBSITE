const express = require('express');
const router = express.Router();
const appointmentsController = require('../controllers/appointmentsController');

router.get('/', appointmentsController.getAllAppointments);
router.post('/', appointmentsController.createAppointment);
router.get('/phone/:phone', appointmentsController.getAppointmentsByPhone);
router.put('/:id', appointmentsController.updateAppointmentStatus);

module.exports = router;
