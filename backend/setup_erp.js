require('dotenv').config({ path: '../backend/.env' }); // Adjust path if needed
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function setupDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'rrdch_db',
  });

  try {
    console.log('Starting Database ERP Setup...');

    // 1. Modify Users Table ENUM
    console.log('Altering users table roles ENUM...');
    await connection.query(`
      ALTER TABLE users 
      MODIFY COLUMN role ENUM('patient', 'student', 'doctor', 'staff', 'hod', 'admin', 'super_admin') DEFAULT 'patient'
    `);

    // 2. Add user_id and department_id to Users Table
    console.log('Adding user_id and department_id to users...');
    try {
      await connection.query(`ALTER TABLE users ADD COLUMN user_id VARCHAR(50) UNIQUE`);
    } catch (e) { if (e.code !== 'ER_DUP_FIELDNAME') throw e; }
    
    try {
      await connection.query(`ALTER TABLE users ADD COLUMN department_id INT NULL`);
    } catch (e) { if (e.code !== 'ER_DUP_FIELDNAME') throw e; }

    try {
      await connection.query(`ALTER TABLE users ADD COLUMN force_password_change BOOLEAN DEFAULT FALSE`);
    } catch (e) { if (e.code !== 'ER_DUP_FIELDNAME') throw e; }

    try {
      await connection.query(`ALTER TABLE users ADD FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL`);
    } catch (e) { /* Ignore if constraint already exists */ }

    // 3. Add doctor_id to appointments
    console.log('Adding doctor_id to appointments...');
    try {
      await connection.query(`ALTER TABLE appointments ADD COLUMN doctor_id INT NULL`);
    } catch (e) { if (e.code !== 'ER_DUP_FIELDNAME') throw e; }

    try {
      await connection.query(`ALTER TABLE appointments ADD FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE SET NULL`);
    } catch (e) { /* Ignore if constraint already exists */ }

    // 4. Create Super Admin
    console.log('Creating Super Admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const [existing] = await connection.query(`SELECT id FROM users WHERE user_id = 'mohan'`);
    if (existing.length === 0) {
      await connection.query(`
        INSERT INTO users (role, user_id, password_hash, name, force_password_change, phone) 
        VALUES ('super_admin', 'mohan', ?, 'Super Admin Mohan', TRUE, '0000000000')
      `, [hashedPassword]);
      console.log('Super Admin "mohan" created successfully.');
    } else {
      console.log('Super Admin "mohan" already exists.');
    }

    console.log('✅ ERP Database setup complete!');
  } catch (err) {
    console.error('Error setting up DB:', err);
  } finally {
    await connection.end();
  }
}

setupDatabase();
