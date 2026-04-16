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
