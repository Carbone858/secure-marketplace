
const http = require('http');

const url = 'http://localhost:3000/api/requests?status=ACTIVE&page=1&limit=5';

console.log(`Fetching ${url}...`);

http.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
        console.log('Response body preview:', data.substring(0, 200));
        try {
            const json = JSON.parse(data);
            console.log('Requests found:', json.data?.requests?.length || 0);
        } catch (e) {
            console.log('Not JSON');
        }
    });
}).on('error', (e) => {
    console.error('Error:', e.message);
});
