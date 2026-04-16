const express = require('express');
const router = express.Router();
const academicsController = require('../controllers/academicsController');

router.get('/', academicsController.getAcademicsData);

module.exports = router;
