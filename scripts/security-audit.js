const http = require('http');

async function post(path, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: JSON.parse(body),
        });
      });
    });

    req.on('error', (e) => reject(e));
    req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('--- STARTING SECURITY AUDIT ---');

  // Test 1: Registration with invalid data
  console.log('\n[Test 1] Registration with invalid password...');
  const res1 = await post('/api/auth/register', {
    name: 'Bad User',
    email: 'bad@example.com',
    password: '123',
    confirmPassword: '123',
    phone: '123',
    termsAccepted: true
  });
  console.log('Status:', res1.status);
  console.log('Error:', res1.data.error);

  // Test 2: Role Escalation Attempt (No session)
  console.log('\n[Test 2] Accessing Admin API without session...');
  const res2 = await post('/api/admin/feature-flags', {});
  console.log('Status:', res2.status); // Should be 401
  console.log('Error:', res2.data.error);

  // Test 3: Rate Limiting on registration
  console.log('\n[Test 3] Rapid registration attempts...');
  for (let i = 0; i < 5; i++) {
    const res = await post('/api/auth/register', { email: `test${i}@spam.com` });
    console.log(`Attempt ${i+1}:`, res.status);
    if (res.status === 429) {
      console.log('SUCCESS: Rate limit triggered');
      break;
    }
  }

  console.log('\n--- SECURITY AUDIT COMPLETE ---');
}

runTests().catch(console.error);
