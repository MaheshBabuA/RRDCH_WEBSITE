const express = require('express');
const router = express.Router();
const complaintsController = require('../controllers/complaintsController');

router.get('/', complaintsController.getAllComplaints);
router.post('/', complaintsController.createComplaint);
router.get('/phone/:phone', complaintsController.getComplaintsByPhone);
router.put('/:id', complaintsController.updateComplaintStatus);

module.exports = router;
