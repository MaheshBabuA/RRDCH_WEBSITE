const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'appointments.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to SQLite database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        
        // Initialize the table
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS appointments (
                id TEXT PRIMARY KEY,
                patient_phone TEXT,
                patient_name TEXT,
                dept TEXT,
                date TEXT,
                time_slot TEXT,
                status TEXT,
                qr_string TEXT,
                token_no TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `;
        db.run(createTableQuery, (err) => {
            if (err) {
                console.error('Error creating table:', err.message);
            } else {
                console.log('Appointments table ready.');
            }
        });
    }
});

module.exports = db;
