const { pool } = require('./config/database');

async function seed() {
  console.log('🚀 Starting Demo Data Injection...');
  try {
    // 1. Create the Patient Record
    await pool.execute(`
      INSERT INTO patients (patient_phone, patient_name, patient_email, patient_age) 
      VALUES ('9972680044', 'Sample Patient', 'sample@rrdch.edu.in', 28)
      ON DUPLICATE KEY UPDATE patient_name='Sample Patient'
    `);
    console.log('✅ Patient Record Created');

    // 2. Add Historical Records
    // Using department_id 1 and 3 as requested
    const historyQueries = [
      ['9972680044', 1, 'Dr. Smith', '2026-03-10 10:00:00', 'Completed', 'Grade 2 Cavity', 'Composite Filling'],
      ['9972680044', 3, 'Dr. Vani Sree', '2026-04-05 11:30:00', 'Completed', 'Gingivitis Checkup', 'Scaling and Polishing']
    ];

    for (const q of historyQueries) {
      await pool.execute(`
        INSERT INTO appointments (patient_phone, department_id, doctor_name, appointment_date, status, diagnosis, treatment)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, q);
    }
    console.log('✅ Historical Records Added');

    // 3. Add the Active Appointment
    await pool.execute(`
      INSERT INTO appointments (patient_phone, department_id, doctor_name, appointment_date, status)
      VALUES ('9972680044', 2, 'Dr. Mahesh Babu', NOW(), 'Pending')
    `);
    console.log('✅ Active Appointment Added');

    console.log('✨ Demo Data Injected Successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Injection Failed:', err);
    process.exit(1);
  }
}

seed();
