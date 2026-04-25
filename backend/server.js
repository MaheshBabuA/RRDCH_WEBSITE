require('dotenv').config(); // Ensure env variables are loaded (for DB connection)
const express = require('express');
const cors = require('cors');

// Import all route modules
const appointmentsRouter = require('./routes/appointments');
const complaintsRouter = require('./routes/complaints');
const departmentsRouter = require('./routes/departments');
const eventsRouter = require('./routes/events');
const feedbackRouter = require('./routes/feedback');
const doctorsRouter = require('./routes/doctors');

const app = express();
const PORT = process.env.PORT || 5000;

// Setup CORS configuration as requested
const corsOptions = {
  origin: 'http://localhost:5173', // specific frontend URL constraint
  credentials: true, // allow sending cookies/auth headers
  optionsSuccessStatus: 200
};

// Application-level middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register routes
app.use('/api/appointments', appointmentsRouter);
app.use('/api/complaints', complaintsRouter);
app.use('/api/departments', departmentsRouter);
app.use('/api/events', eventsRouter);
app.use('/api/feedback', feedbackRouter);
app.use('/api/doctors', doctorsRouter);

// Base health check endpoint
app.get('/api', (req, res) => {
  res.status(200).json({ success: true, message: 'API is operational' });
});

/**
 * Endpoint: GET /api/get-patient-appointments
 * Retrieves appointments for a specific patient using a phone number.
 * Uses a JOIN between patients, appointments, and doctors tables.
 */
app.get('/api/get-patient-appointments', async (req, res) => {
  const { phone_number } = req.query;
  
  if (!phone_number) {
    return res.status(400).json({ 
      success: false, 
      message: 'phone_number query parameter is required' 
    });
  }

  try {
    const { pool } = require('./config/database');
    
    // Updated query to include patient_id and appointment_id
    const query = `
      SELECT 
        a.appointment_id,
        p.patient_id,
        a.status, 
        d.doctor_name, 
        a.appointment_date AS time_slot
      FROM appointments a
      JOIN patients p ON a.patient_phone = p.patient_phone
      JOIN doctors d ON a.doctor_id = d.doctor_id
      WHERE p.patient_phone = ?
      ORDER BY a.appointment_date DESC
    `;

    const [rows] = await pool.execute(query, [phone_number]);

    const formattedAppointments = rows.map(app => {
      let displayStatus = app.status;
      if (displayStatus.toUpperCase() === 'PENDING') displayStatus = 'Pending';
      if (displayStatus.toUpperCase() === 'CONFIRMED') displayStatus = 'Confirmed';
      if (displayStatus.toUpperCase() === 'COMPLETED') displayStatus = 'Completed';
      
      return {
        ...app,
        status: displayStatus
      };
    });

    res.status(200).json({
      success: true,
      count: formattedAppointments.length,
      appointments: formattedAppointments
    });

  } catch (error) {
    console.error('Error in /api/get-patient-appointments:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve patient appointments'
    });
  }
});

/**
 * Endpoint: POST /api/scan-appointment
 * Triggered when a QR code is scanned.
 * Retrieves current appointment details and past medical history.
 */
app.post('/api/scan-appointment', async (req, res) => {
  const { patient_id, appointment_id } = req.body;

  if (!patient_id || !appointment_id) {
    return res.status(400).json({ 
      success: false, 
      message: 'patient_id and appointment_id are required' 
    });
  }

  try {
    const { pool } = require('./config/database');

    // 1. Get Current Appointment Details
    const [appointment] = await pool.execute(
      `SELECT a.*, d.doctor_name 
       FROM appointments a 
       LEFT JOIN doctors d ON a.doctor_id = d.doctor_id 
       WHERE a.appointment_id = ?`,
      [appointment_id]
    );

    // 2. Get Past Dental Records (Last 3 Visits)
    const [history] = await pool.execute(
      `SELECT * FROM medical_history 
       WHERE patient_id = ? 
       ORDER BY visit_date DESC 
       LIMIT 3`,
      [patient_id]
    );

    res.status(200).json({
      success: true,
      appointment: appointment[0] || null,
      history: history
    });

  } catch (error) {
    console.error('Error in /api/scan-appointment:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve patient data from scan'
    });
  }
});

// 404 Handler for unknown routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API Route Not Found - [${req.method}] ${req.originalUrl}`
  });
});

// Global Error Handler middleware (try-catch safety net)
app.use((err, req, res, next) => {
  console.error('--- Global Error Handler Invoked ---');
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'An unexpected server error occurred',
    // Only send raw error strings dynamically in dev environments
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

// Start the server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server successfully started on http://localhost:${PORT}`);
    console.log('✅ Connected endpoints via routing architecture');
  });
}

module.exports = app;
