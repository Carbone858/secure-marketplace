const http = require('http');

async function get(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'GET',
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(body),
          });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.end();
  });
}

async function testIDOR() {
  console.log('\n[Test 4] Attempting IDOR on Projects API...');
  // Use a random UUID to check if it returns 401/403 or 404
  // If it returns 401/403, security is working.
  // If it returns 404, it might be leaking that the project doesn't exist (lesser issue but still).
  const res = await get('/api/projects/550e8400-e29b-41d4-a716-446655440000');
  console.log('Status:', res.status);
  console.log('Body:', res.data);
}

testIDOR().catch(console.error);
