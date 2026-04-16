const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Basic route for health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'RRDCH Backend is running' });
});

// Import and mount routes
const departmentRoutes = require('./routes/departments');
const eventRoutes = require('./routes/events');
const appointmentRoutes = require('./routes/appointments');
const complaintRoutes = require('./routes/complaints');
const feedbackRoutes = require('./routes/feedback');
const academicsRoutes = require('./routes/academics');

app.use('/api/departments', departmentRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/academics', academicsRoutes);

module.exports = app;
