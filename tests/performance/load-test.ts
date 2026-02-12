/**
 * Performance & Load Test Script (k6)
 * 
 * Install k6: https://k6.io/docs/getting-started/installation/
 * Run: k6 run tests/performance/load-test.js
 * 
 * Or use Node.js fetch-based alternative below.
 */

// ═══════════════════════════════════════════════════════════
// K6 SCRIPT (save as .js, run with k6)
// ═══════════════════════════════════════════════════════════
/*
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 },  // Ramp up to 10 users
    { duration: '1m', target: 50 },   // Ramp up to 50 users
    { duration: '30s', target: 100 }, // Peak at 100 users
    { duration: '30s', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests under 2s
    http_req_failed: ['rate<0.05'],    // Less than 5% failure rate
  },
};

const BASE = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  // Public endpoints
  let res = http.get(`${BASE}/api/categories`);
  check(res, { 'categories 200': (r) => r.status === 200 });

  res = http.get(`${BASE}/api/countries`);
  check(res, { 'countries 200': (r) => r.status === 200 });

  res = http.get(`${BASE}/api/companies/search`);
  check(res, { 'search 200': (r) => r.status === 200 });

  res = http.get(`${BASE}/api/requests`);
  check(res, { 'requests 200': (r) => r.status === 200 });

  sleep(1);
}
*/

// ═══════════════════════════════════════════════════════════
// NODE.JS ALTERNATIVE (run with: node tests/performance/load-test.js)
// ═══════════════════════════════════════════════════════════

const BASE = process.env.BASE_URL || 'http://localhost:3000';

const ENDPOINTS = [
  { name: 'GET /api/categories', path: '/api/categories' },
  { name: 'GET /api/countries', path: '/api/countries' },
  { name: 'GET /api/companies/search', path: '/api/companies/search' },
  { name: 'GET /api/requests', path: '/api/requests' },
  { name: 'GET /api/requests?page=1&limit=10', path: '/api/requests?page=1&limit=10' },
  { name: 'GET /api/companies/search?q=test', path: '/api/companies/search?q=test' },
  { name: 'GET /en (home page)', path: '/en' },
];

const CONCURRENCY = parseInt(process.env.CONCURRENCY || '10');
const DURATION_MS = parseInt(process.env.DURATION || '30000');

interface Result {
  endpoint: string;
  totalRequests: number;
  successCount: number;
  failCount: number;
  avgMs: number;
  p50Ms: number;
  p95Ms: number;
  p99Ms: number;
  maxMs: number;
  minMs: number;
  rps: number;
}

async function measureEndpoint(endpoint: { name: string; path: string }): Promise<Result> {
  const times: number[] = [];
  let success = 0;
  let fail = 0;
  const startTime = Date.now();

  while (Date.now() - startTime < DURATION_MS) {
    const promises = Array.from({ length: CONCURRENCY }, async () => {
      const t0 = performance.now();
      try {
        const res = await fetch(`${BASE}${endpoint.path}`);
        const t1 = performance.now();
        times.push(t1 - t0);
        if (res.ok) success++;
        else fail++;
      } catch {
        times.push(performance.now() - t0);
        fail++;
      }
    });
    await Promise.all(promises);
  }

  times.sort((a, b) => a - b);
  const totalTime = (Date.now() - startTime) / 1000;

  return {
    endpoint: endpoint.name,
    totalRequests: times.length,
    successCount: success,
    failCount: fail,
    avgMs: Math.round(times.reduce((a, b) => a + b, 0) / times.length),
    p50Ms: Math.round(times[Math.floor(times.length * 0.5)] || 0),
    p95Ms: Math.round(times[Math.floor(times.length * 0.95)] || 0),
    p99Ms: Math.round(times[Math.floor(times.length * 0.99)] || 0),
    maxMs: Math.round(times[times.length - 1] || 0),
    minMs: Math.round(times[0] || 0),
    rps: Math.round(times.length / totalTime),
  };
}

async function main() {
  console.log(`\n🚀 Load Test - ${CONCURRENCY} concurrent users, ${DURATION_MS / 1000}s per endpoint\n`);
  console.log(`Target: ${BASE}\n`);
  console.log('─'.repeat(100));
  console.log(
    'Endpoint'.padEnd(40) +
    'Reqs'.padStart(8) +
    'OK'.padStart(8) +
    'Fail'.padStart(8) +
    'Avg(ms)'.padStart(10) +
    'P50'.padStart(8) +
    'P95'.padStart(8) +
    'P99'.padStart(8) +
    'RPS'.padStart(8)
  );
  console.log('─'.repeat(100));

  const results: Result[] = [];
  for (const endpoint of ENDPOINTS) {
    const result = await measureEndpoint(endpoint);
    results.push(result);
    console.log(
      result.endpoint.padEnd(40) +
      String(result.totalRequests).padStart(8) +
      String(result.successCount).padStart(8) +
      String(result.failCount).padStart(8) +
      String(result.avgMs).padStart(10) +
      String(result.p50Ms).padStart(8) +
      String(result.p95Ms).padStart(8) +
      String(result.p99Ms).padStart(8) +
      String(result.rps).padStart(8)
    );
  }

  console.log('─'.repeat(100));

  // Summary
  const totalReqs = results.reduce((a, r) => a + r.totalRequests, 0);
  const totalFail = results.reduce((a, r) => a + r.failCount, 0);
  const avgP95 = Math.round(results.reduce((a, r) => a + r.p95Ms, 0) / results.length);

  console.log(`\n📊 Summary:`);
  console.log(`   Total Requests: ${totalReqs}`);
  console.log(`   Total Failures: ${totalFail} (${((totalFail / totalReqs) * 100).toFixed(1)}%)`);
  console.log(`   Average P95:    ${avgP95}ms`);
  console.log(`   Pass Criteria:  P95 < 2000ms, Failure Rate < 5%`);

  const passed = avgP95 < 2000 && (totalFail / totalReqs) < 0.05;
  console.log(`   Result:         ${passed ? '✅ PASS' : '❌ FAIL'}\n`);

  process.exit(passed ? 0 : 1);
}

main().catch(console.error);
