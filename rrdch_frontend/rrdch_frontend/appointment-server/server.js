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
        origin: "*", // allow all for dev
        methods: ["GET", "POST", "PUT"]
    }
});

app.use(cors());
app.use(express.json());

// --- REST Endpoints ---

// 1. Book an appointment
app.post('/api/appointments', async (req, res) => {
    const { patient_phone, patient_name, dept, date, time_slot } = req.body;
    
    if (!patient_phone || !patient_name || !dept || !date || !time_slot) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const id = `APT-${uuidv4().substring(0, 8).toUpperCase()}`;
    const status = 'scheduled'; // scheduled -> confirmed -> in_queue -> treatment
    const token_no = `T-${Math.floor(Math.random() * 900) + 100}`;
    
    try {
        // Generate QR code data (contains basic apt info)
        const qrData = JSON.stringify({ id, patient_name, dept, date, time_slot, token_no });
        const qr_string = await QRCode.toDataURL(qrData);

        const insertQuery = `
            INSERT INTO appointments (id, patient_phone, patient_name, dept, date, time_slot, status, qr_string, token_no)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        db.run(insertQuery, [id, patient_phone, patient_name, dept, date, time_slot, status, qr_string, token_no], function(err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database error' });
            }
            
            const newAppointment = { id, patient_phone, patient_name, dept, date, time_slot, status, qr_string, token_no };
            
            // Emit via socket.io to the specific department room
            io.to(dept).emit('new_appointment', newAppointment);
            
            res.status(201).json(newAppointment);
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error generating QR or saving to DB' });
    }
});

// 2. Get status for Patient Portal
app.get('/api/appointments/status/:phone', (req, res) => {
    const phone = req.params.phone;
    
    const selectQuery = `SELECT * FROM appointments WHERE patient_phone = ? ORDER BY created_at DESC`;
    db.all(selectQuery, [phone], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(rows);
    });
});

// 3. Get department appointments for Doctor Dashboard
app.get('/api/appointments/department/:dept', (req, res) => {
    const dept = req.params.dept;
    
    const selectQuery = `SELECT * FROM appointments WHERE dept = ? AND date >= date('now') ORDER BY date ASC, time_slot ASC`;
    db.all(selectQuery, [dept], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(rows);
    });
});

// 4. Update appointment status (from Doctor Dashboard)
app.put('/api/appointments/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) return res.status(400).json({ error: 'Status is required' });

    const updateQuery = `UPDATE appointments SET status = ? WHERE id = ?`;
    db.run(updateQuery, [status, id], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        
        // We need the department to emit to the correct room. Let's fetch it.
        db.get(`SELECT dept FROM appointments WHERE id = ?`, [id], (err, row) => {
            if (!err && row) {
                io.to(row.dept).emit('status_update', { id, status });
            }
        });
        
        res.json({ success: true, id, status });
    });
});

// --- Socket.io Logic ---
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Doctor joins a department room to receive live updates
    socket.on('join_department', (dept) => {
        socket.join(dept);
        console.log(`Socket ${socket.id} joined department: ${dept}`);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Appointment Server running on port ${PORT}`);
});
