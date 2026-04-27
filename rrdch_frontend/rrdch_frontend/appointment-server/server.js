const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { randomUUID } = require('crypto');
const QRCode = require('qrcode');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db');

const JWT_SECRET = process.env.JWT_SECRET || 'rrdch_super_secret_key_2026';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST", "PUT", "PATCH"]
    }
});

app.use(cors());
app.use(express.json());

// --- REST Endpoints ---

// --- Auth Middleware ---
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'No token provided.' });
    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch (e) {
        return res.status(403).json({ success: false, message: 'Invalid or expired token.' });
    }
};

// --- Auth Endpoints ---

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
    const { user_id, password } = req.body;
    if (!user_id || !password) {
        return res.status(400).json({ success: false, message: 'User ID and password are required.' });
    }
    db.get('SELECT * FROM users WHERE user_id = ?', [user_id], async (err, user) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error.' });
        if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials.' });

        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) return res.status(401).json({ success: false, message: 'Invalid credentials.' });

        const payload = { id: user.id, user_id: user.user_id, role: user.role, department_id: user.department_id, name: user.name };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

        let redirectUrl = '/student-portal';
        if (user.role === 'super_admin' || user.role === 'admin') redirectUrl = '/staff/reception-dashboard';
        else if (user.role === 'doctor' || user.role === 'hod') redirectUrl = '/staff/doctor-dashboard';

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: payload,
            force_password_change: !!user.force_password_change,
            redirectUrl
        });
    });
});

// POST /api/auth/change-password
app.post('/api/auth/change-password', (req, res) => {
    const { user_id, oldPassword, newPassword } = req.body;
    db.get('SELECT * FROM users WHERE user_id = ?', [user_id], async (err, user) => {
        if (err || !user) return res.status(404).json({ success: false, message: 'User not found.' });
        const isValid = await bcrypt.compare(oldPassword, user.password_hash);
        if (!isValid) return res.status(401).json({ success: false, message: 'Incorrect old password.' });
        const newHash = await bcrypt.hash(newPassword, 10);
        db.run('UPDATE users SET password_hash = ?, force_password_change = 0 WHERE user_id = ?', [newHash, user_id], (e) => {
            if (e) return res.status(500).json({ success: false, message: 'Failed to update password.' });
            res.json({ success: true, message: 'Password updated.' });
        });
    });
});

// POST /api/auth/register-staff  (super_admin only)
app.post('/api/auth/register-staff', verifyToken, async (req, res) => {
    if (req.user.role !== 'super_admin' && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Access denied.' });
    }
    const { user_id, password, role, department_id, name } = req.body;
    if (!user_id || !password || !role) {
        return res.status(400).json({ success: false, message: 'user_id, password, role required.' });
    }
    db.get('SELECT id FROM users WHERE user_id = ?', [user_id], async (err, existing) => {
        if (existing) return res.status(400).json({ success: false, message: 'User ID already exists.' });
        const hash = await bcrypt.hash(password, 10);
        db.run(
            'INSERT INTO users (user_id, password_hash, role, department_id, name, force_password_change) VALUES (?, ?, ?, ?, ?, 1)',
            [user_id, hash, role, department_id || null, name || user_id],
            (insertErr) => {
                if (insertErr) return res.status(500).json({ success: false, message: 'Failed to register.' });
                res.status(201).json({ success: true, message: 'Staff member registered.' });
            }
        );
    });
});

// GET /api/erp/appointments/queue  (all active appointments)
app.get('/api/erp/appointments/queue', verifyToken, (req, res) => {
    const query = `SELECT * FROM appointments WHERE status IN ('Booked','With Doctor','in_progress','scheduled','confirmed') ORDER BY date ASC, time_slot ASC`;
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error' });
        res.json({ success: true, count: rows.length, appointments: rows });
    });
});

// GET /api/erp/appointments/department/:deptName
app.get('/api/erp/appointments/department/:deptName', verifyToken, (req, res) => {
    const { deptName } = req.params;
    const query = `SELECT * FROM appointments WHERE status IN ('Booked','With Doctor','in_progress','scheduled','confirmed','PENDING') AND dept = ? ORDER BY date ASC, time_slot ASC`;
    db.all(query, [deptName], (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error' });
        res.json({ success: true, count: rows.length, appointments: rows });
    });
});

// PUT /api/erp/appointments/:id/complete
app.put('/api/erp/appointments/:id/complete', verifyToken, (req, res) => {
    const { id } = req.params;
    db.run(`UPDATE appointments SET status = 'completed' WHERE id = ?`, [id], function(err) {
        if (err) return res.status(500).json({ success: false, message: 'Database error' });
        if (this.changes === 0) return res.status(404).json({ success: false, message: 'Appointment not found' });
        res.json({ success: true, message: 'Appointment marked as completed' });
    });
});

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'RRDCH Clinical Backend Active' });
});

// 1. Unified Book an appointment
app.post('/api/book-appointment', async (req, res) => {
    const { patient_phone, patient_name, dept, doctor_id, date, time_slot } = req.body;
    
    if (!patient_phone || !patient_name || !dept || !date || !time_slot) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const id = `APT-${randomUUID().substring(0, 8).toUpperCase()}`;
    const status = 'Booked';
    const token_no = `T-${Math.floor(Math.random() * 900) + 100}`;
    
    try {
        const appointmentData = { 
            appointment_id: id, 
            patient_name, 
            patient_phone,
            dept, 
            doctor_id: doctor_id || 'DOC-101',
            date, 
            time_slot, 
            token_no,
            status 
        };

        const qr_string = await QRCode.toDataURL(JSON.stringify(appointmentData));

        const insertQuery = `
            INSERT INTO appointments (id, patient_phone, patient_name, dept, doctor_id, date, time_slot, status, qr_string, token_no)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        db.run(insertQuery, [id, patient_phone, patient_name, dept, doctor_id || 'DOC-101', date, time_slot, status, qr_string, token_no], function(err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database error' });
            }
            console.log('✅ Appointment created:', id);
            io.emit('appointment_created', { 
                ...appointmentData, 
                appointmentId: id, // for backward compatibility or matching user's suggestion
                timestamp: new Date().toISOString() 
            });
            console.log('✅ Socket emitted: appointment_created');
            res.status(201).json({ ...appointmentData, qr_string });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Critical booking failure' });
    }
});

// 2. Portal Status (with history)
app.get('/api/portal/my-appointments', (req, res) => {
    const { phone } = req.query;
    if (!phone) return res.status(400).json({ error: 'Phone is required' });

    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

    const query = `
        SELECT a.*, mh.visit_date as history_date, mh.diagnosis as history_diagnosis, mh.treatment_plan as history_treatment
        FROM appointments a
        LEFT JOIN medical_history mh ON a.patient_phone = mh.patient_phone
        WHERE a.patient_phone = ?
        ORDER BY a.created_at DESC, mh.visit_date DESC
    `;

    db.all(query, [phone], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        
        const appointments = [];
        const history = [];
        const seenApt = new Set();
        const seenHistory = new Set();

        rows.forEach(row => {
            if (row.id && !seenApt.has(row.id)) {
                appointments.push(row);
                seenApt.add(row.id);
            }
            if (row.history_date && !seenHistory.has(`${row.history_date}-${row.history_diagnosis}`)) {
                history.push({
                    date: row.history_date,
                    diagnosis: row.history_diagnosis,
                    treatment: row.history_treatment
                });
                seenHistory.add(`${row.history_date}-${row.history_diagnosis}`);
            }
        });

        res.json({
            success: true,
            appointments,
            history,
            patient_name: appointments.length > 0 ? appointments[0].patient_name : (phone === '9972680044' ? 'Sample Patient' : 'Patient')
        });
    });
});

// 3. Doctor Endpoints
app.get('/api/doctor/appointments', (req, res) => {
    const { doctor_id } = req.query;
    const query = `SELECT * FROM appointments WHERE (status = 'Booked' OR status = 'With Doctor') ${doctor_id ? 'AND doctor_id = ?' : ''} ORDER BY date ASC, time_slot ASC`;
    db.all(query, doctor_id ? [doctor_id] : [], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ success: true, appointments: rows });
    });
});

app.patch('/api/doctor/call-next/:id', (req, res) => {
    const { id } = req.params;
    const status = 'in_progress';

    db.run(`UPDATE appointments SET status = ? WHERE id = ?`, [status, id], function(err) {
        if (err) return res.status(500).json({ error: 'Database error' });

        db.get(`SELECT * FROM appointments WHERE id = ?`, [id], (err, row) => {
            if (!err && row) {
                // Emit specific event for Patient Portal
                io.emit('CALL_PATIENT', {
                    appointment_id: row.id,
                    patient_name: row.patient_name,
                    doctor_id: row.doctor_id,
                    doctor_name: 'Dr. Sarah (Oral Surgery)' // Static for demo
                });
                // General update
                io.emit('appointment_update', row);
                io.emit('update', row);
                res.json({ success: true, appointment: row });
            } else {
                res.status(404).json({ error: 'Apt not found' });
            }
        });
    });
});

app.get('/api/doctor/duty-schedule', (req, res) => {
    res.json({
        success: true,
        schedule: [
            { id: 'DOC-101', doctor: 'Dr. Sarah', dept: 'Oral Surgery', status: 'Available' },
            { id: 'DOC-102', doctor: 'Dr. Mahesh Babu', dept: 'Prosthodontics', status: 'In Consultation' },
            { id: 'DOC-103', doctor: 'Dr. Smith', dept: 'Radiology', status: 'Available' }
        ]
    });
});

// --- Test Endpoint ---
app.get('/api/test-socket', (req, res) => {
    io.emit('test_event', { message: 'Hello from RRDCH Server', timestamp: new Date().toISOString() });
    res.json({ success: true, message: 'Test event emitted' });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 RRDCH Clinical Server 100% Operational on Port ${PORT}`);
});
