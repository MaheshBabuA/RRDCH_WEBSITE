const http = require('http');

// Step 1: Login to get token
const loginData = JSON.stringify({ user_id: 'mohan', password: 'admin123' });

const loginOptions = {
  hostname: '127.0.0.1', port: 5000, path: '/api/auth/login',
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(loginData) }
};

const loginReq = http.request(loginOptions, (loginRes) => {
  let body = '';
  loginRes.on('data', chunk => body += chunk);
  loginRes.on('end', () => {
    const parsed = JSON.parse(body);
    console.log('LOGIN STATUS:', loginRes.statusCode, '| Token:', parsed.token ? parsed.token.substring(0,30)+'...' : 'NONE');
    if (!parsed.token) { console.error('Login failed:', body); return; }

    // Step 2: Call queue endpoint
    const queueOptions = {
      hostname: '127.0.0.1', port: 5000,
      path: '/api/erp/appointments/department/' + encodeURIComponent('Oral Medicine & Radiology'),
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + parsed.token }
    };
    const queueReq = http.request(queueOptions, (queueRes) => {
      let qBody = '';
      queueRes.on('data', chunk => qBody += chunk);
      queueRes.on('end', () => {
        console.log('\nQUEUE STATUS:', queueRes.statusCode);
        console.log('QUEUE BODY:', qBody);
      });
    });
    queueReq.on('error', e => console.error('Queue error:', e.message));
    queueReq.end();
  });
});
loginReq.on('error', e => console.error('Login error:', e.message));
loginReq.write(loginData);
loginReq.end();
