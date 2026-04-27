require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import all route modules
const appointmentsRouter = require('./routes/appointments');
const complaintsRouter = require('./routes/complaints');
const departmentsRouter = require('./routes/departments');
const eventsRouter = require('./routes/events');
const feedbackRouter = require('./routes/feedback');
const doctorsRouter = require('./routes/doctors');
const receptionRouter = require('./routes/reception');
const portalRouter = require('./routes/portal');
const symptomCheckerRouter = require('./routes/symptomChecker');
const authRouter = require('./routes/auth');
const erpAppointmentsRouter = require('./routes/erp_appointments');

const http = require('http');
const { Server } = require('socket.io');

const doctorRoutes = require('./routes/doctor');

const app = express();
const server = http.createServer(app);

const ALLOWED_ORIGINS = ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'];

const io = new Server(server, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ['GET', 'POST']
  }
});

// Expose 'io' for routes to use
app.set('io', io);

const PORT = process.env.PORT || 5000;

// Socket.io Logic
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('next-patient-called', (data) => {
    console.log('Next patient called:', data);
    io.emit('live-ticker-update', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Setup CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || ALLOWED_ORIGINS.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
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
app.use('/api/reception', receptionRouter);
app.use('/api/portal', portalRouter);
app.use('/api/symptomChecker', symptomCheckerRouter);
app.use('/api/doctor', doctorRoutes);
app.use('/api/auth', authRouter);
app.use('/api/erp/appointments', erpAppointmentsRouter);

// Base health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is operational' });
});

app.get('/api', (req, res) => {
  res.status(200).json({ success: true, message: 'API is operational' });
});

/**
 * Endpoint: GET /api/get-patient-appointments
 */
app.get('/api/get-patient-appointments', async (req, res) => {
  const { phone_number } = req.query;
  if (!phone_number) return res.status(400).json({ success: false, message: 'phone_number required' });
  try {
    const { pool } = require('./config/database');
    const query = `
      SELECT a.appointment_id, p.patient_id, a.status, d.doctor_name, a.appointment_date AS time_slot
      FROM appointments a
      LEFT JOIN patients p ON a.patient_phone = p.patient_phone
      LEFT JOIN doctors d ON a.doctor_id = d.doctor_id
      WHERE a.patient_phone = ?
      ORDER BY a.appointment_date DESC
    `;
    const [rows] = await pool.execute(query, [phone_number]);
    res.status(200).json({ success: true, count: rows.length, appointments: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve appointments' });
  }
});

/**
 * Endpoint: POST /api/scan-appointment
 */
app.post('/api/scan-appointment', async (req, res) => {
  const { patient_id, appointment_id } = req.body;
  if (!patient_id || !appointment_id) return res.status(400).json({ success: false, message: 'patient_id and appointment_id required' });
  try {
    const { pool } = require('./config/database');
    const [appointment] = await pool.execute(`SELECT a.*, d.doctor_name FROM appointments a LEFT JOIN doctors d ON a.doctor_id = d.doctor_id WHERE a.appointment_id = ?`, [appointment_id]);
    const [history] = await pool.execute(`SELECT * FROM medical_history WHERE patient_id = ? ORDER BY visit_date DESC LIMIT 3`, [patient_id]);
    res.status(200).json({ success: true, appointment: appointment[0] || null, history: history });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve patient data' });
  }
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: `API Route Not Found` });
});

// Start the server
if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Server successfully started on http://localhost:${PORT}`);
    console.log('✅ Socket.io initialized');
  });
}

module.exports = app;
