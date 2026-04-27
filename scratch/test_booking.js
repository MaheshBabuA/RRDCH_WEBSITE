const http = require('http');

const data = JSON.stringify({
  patient_name: "John Doe",
  patient_phone: "9876543210",
  patient_email: "john@example.com",
  department_id: 1, // Oral Medicine & Radiology
  appointment_date: "2026-05-01",
  appointment_time: "10:30",
  notes: "Test booking"
});

const options = {
  hostname: '127.0.0.1',
  port: 5000,
  path: '/api/appointments',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
