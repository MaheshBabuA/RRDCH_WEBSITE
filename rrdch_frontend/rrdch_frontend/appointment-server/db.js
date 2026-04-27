const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

const dbPath = path.resolve(__dirname, 'appointments.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to SQLite database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        
        // Initialize the tables
        const createAppointmentsTable = `
            CREATE TABLE IF NOT EXISTS appointments (
                id TEXT PRIMARY KEY,
                patient_phone TEXT,
                patient_name TEXT,
                dept TEXT,
                doctor_id TEXT,
                date TEXT,
                time_slot TEXT,
                status TEXT,
                qr_string TEXT,
                token_no TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `;

        const createHistoryTable = `
            CREATE TABLE IF NOT EXISTS medical_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                patient_phone TEXT,
                patient_id TEXT,
                visit_date TEXT,
                doctor_name TEXT,
                diagnosis TEXT,
                treatment_plan TEXT,
                notes TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `;

        const createUsersTable = `
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                name TEXT,
                role TEXT DEFAULT 'staff',
                department_id INTEGER,
                force_password_change INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `;

        db.serialize(() => {
            db.run(createAppointmentsTable, (err) => {
                if (err) console.error('Error creating appointments table:', err.message);
                else console.log('Appointments table ready.');
            });

            db.run(createHistoryTable, (err) => {
                if (err) console.error('Error creating history table:', err.message);
                else {
                    console.log('Medical history table ready.');
                    db.get("SELECT COUNT(*) as count FROM medical_history", (err, row) => {
                        if (!err && row.count === 0) {
                            console.log("Seeding medical history data...");
                            const stmt = db.prepare("INSERT INTO medical_history (patient_phone, patient_id, visit_date, doctor_name, diagnosis, treatment_plan, notes) VALUES (?, ?, ?, ?, ?, ?, ?)");
                            stmt.run("9972680044", "P-1001", "2026-03-15", "Dr. Mahesh Babu", "Deep Dental Cavity (Molar)", "Root Canal Treatment + Zirconia Crown", "Patient reported sensitivity to cold.");
                            stmt.run("9972680044", "P-1001", "2026-01-10", "Dr. Sarah", "Gingivitis", "Scaling and Polishing", "Improved oral hygiene instructions given.");
                            stmt.finalize();
                        }
                    });
                }
            });

            db.run(createUsersTable, (err) => {
                if (err) console.error('Error creating users table:', err.message);
                else {
                    console.log('Users table ready.');
                    // Seed super_admin 'mohan' if not already present
                    db.get("SELECT id FROM users WHERE user_id = 'mohan'", (err, row) => {
                        if (!err && !row) {
                            bcrypt.hash('admin123', 10, (hashErr, hash) => {
                                if (hashErr) return console.error('Bcrypt error:', hashErr);
                                db.run(
                                    "INSERT INTO users (user_id, password_hash, name, role, force_password_change) VALUES (?, ?, ?, ?, ?)",
                                    ['mohan', hash, 'Super Admin Mohan', 'super_admin', 1],
                                    (insertErr) => {
                                        if (insertErr) console.error('Error seeding mohan:', insertErr.message);
                                        else console.log('✅ Super Admin "mohan" seeded.');
                                    }
                                );
                            });
                        }
                    });
                }
            });
        });
    }
});

module.exports = db;
