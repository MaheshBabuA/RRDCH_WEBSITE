const db = require('./db');

function seed() {
  console.log('🚀 Starting SQLite Demo Data Injection...');
  
  db.serialize(() => {
    // 1. Add Historical Records to medical_history
    const historyStmt = db.prepare("INSERT INTO medical_history (patient_phone, patient_id, visit_date, doctor_name, diagnosis, treatment_plan) VALUES (?, ?, ?, ?, ?, ?)");
    historyStmt.run("9972680044", "P-DEMO", "2026-03-10", "Dr. Smith", "Grade 2 Cavity", "Composite Filling");
    historyStmt.run("9972680044", "P-DEMO", "2026-04-05", "Dr. Vani Sree", "Gingivitis Checkup", "Scaling and Polishing");
    historyStmt.finalize();
    console.log('✅ Historical Records Added to SQLite');

    // 2. Add Active Appointment
    const aptStmt = db.prepare("INSERT INTO appointments (id, patient_phone, patient_name, dept, doctor_id, date, time_slot, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    aptStmt.run("APT-DEMO-001", "9972680044", "Sample Patient", "Prosthodontics", "DOC-101", new Date().toISOString().split('T')[0], "11:00 AM", "Pending");
    aptStmt.finalize();
    console.log('✅ Active Appointment Added to SQLite');

    console.log('✨ SQLite Demo Data Injected Successfully!');
    // Close db after a small delay to ensure completion
    setTimeout(() => {
        db.close();
        process.exit(0);
    }, 1000);
  });
}

seed();
