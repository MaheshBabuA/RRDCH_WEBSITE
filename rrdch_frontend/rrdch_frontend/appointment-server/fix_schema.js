const db = require('./db');

db.serialize(() => {
    db.run("ALTER TABLE appointments ADD COLUMN doctor_id TEXT", (err) => {
        if (err) console.log("Column doctor_id already exists or error:", err.message);
        else console.log("Column doctor_id added.");
    });
    
    db.run("ALTER TABLE medical_history ADD COLUMN treatment TEXT", (err) => {
        if (err) console.log("Column treatment already exists or error:", err.message);
        else console.log("Column treatment added.");
    });

    setTimeout(() => {
        db.close();
        process.exit(0);
    }, 1000);
});
