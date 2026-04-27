const db = require('./db');

db.all("PRAGMA table_info(appointments)", (err, rows) => {
    if (err) console.error(err);
    else {
        console.log("Columns in appointments:");
        rows.forEach(row => console.log(row.name));
    }
    db.close();
});
