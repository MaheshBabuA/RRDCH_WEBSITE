const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');
const db = require('./db');

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

    const id = `APT-${uuidv4().substring(0, 8).toUpperCase()}`;
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
