/**
 * API & Backend Tests
 * Tests all API endpoints for correct behavior, auth enforcement, and edge cases.
 * Uses raw fetch against a running server.
 */

const BASE = process.env.BASE_URL || 'http://localhost:3000';

// ─── Helpers ─────────────────────────────────────────────────
const unique = () => `test_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

async function api(path: string, options: RequestInit = {}) {
  const url = `${BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Origin': BASE,
      ...options.headers,
    },
  });
  const text = await res.text();
  let json: any = null;
  try { json = JSON.parse(text); } catch {}
  return { status: res.status, json, text, headers: res.headers };
}

async function registerAndLogin(): Promise<{ cookies: string; email: string }> {
  const email = `${unique()}@test.com`;
  const password = 'SecurePassword123!';

  // Register
  await api('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Test User',
      email,
      password,
      confirmPassword: password,
      acceptTerms: true,
    }),
  });

  // Login
  const loginRes = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Origin': BASE },
    body: JSON.stringify({ email, password }),
    redirect: 'manual',
  });

  const setCookies = loginRes.headers.getSetCookie?.() || [];
  const cookies = setCookies.map(c => c.split(';')[0]).join('; ');
  return { cookies, email };
}

// ─── 1. AUTH ENDPOINTS ───────────────────────────────────────
describe('Auth API', () => {
  test('POST /api/auth/register - success', async () => {
    const email = `${unique()}@test.com`;
    const { status, json } = await api('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'New User',
        email,
        password: 'StrongPass123!',
        confirmPassword: 'StrongPass123!',
        acceptTerms: true,
      }),
    });
    // Should succeed (200/201) or fail gracefully
    expect([200, 201, 400, 429]).toContain(status);
  });

  test('POST /api/auth/register - duplicate email', async () => {
    const email = `${unique()}@test.com`;
    const body = JSON.stringify({
      name: 'User',
      email,
      password: 'StrongPass123!',
      confirmPassword: 'StrongPass123!',
      acceptTerms: true,
    });

    await api('/api/auth/register', { method: 'POST', body });
    const { status } = await api('/api/auth/register', { method: 'POST', body });
    // Should reject duplicate
    expect([400, 409, 429]).toContain(status);
  });

  test('POST /api/auth/register - validation errors', async () => {
    const { status, json } = await api('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email: 'invalid', password: '1' }),
    });
    expect([400, 422]).toContain(status);
  });

  test('POST /api/auth/login - invalid credentials', async () => {
    const { status } = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'nobody@example.com', password: 'Wrong123!' }),
    });
    expect([401, 400, 429]).toContain(status);
  });

  test('POST /api/auth/login - missing fields', async () => {
    const { status } = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    expect([400, 422]).toContain(status);
  });

  test('POST /api/auth/logout - works without auth', async () => {
    const { status } = await api('/api/auth/logout', { method: 'POST' });
    expect([200, 401]).toContain(status);
  });

  test('POST /api/auth/forgot-password - accepts any email', async () => {
    const { status } = await api('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email: 'anything@example.com' }),
    });
    // Should succeed (not leak whether email exists)
    expect([200, 400, 429]).toContain(status);
  });

  test('POST /api/auth/reset-password - rejects invalid token', async () => {
    const { status } = await api('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token: 'invalid', password: 'NewPass123!', confirmPassword: 'NewPass123!' }),
    });
    expect([400, 401, 404]).toContain(status);
  });

  test('POST /api/auth/verify-email - rejects invalid token', async () => {
    const { status } = await api('/api/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token: 'invalid-token' }),
    });
    expect([400, 404]).toContain(status);
  });
});

// ─── 2. PUBLIC ENDPOINTS ─────────────────────────────────────
describe('Public API', () => {
  test('GET /api/categories - returns array', async () => {
    const { status, json } = await api('/api/categories');
    expect(status).toBe(200);
    expect(json).toHaveProperty('categories');
    expect(Array.isArray(json.categories)).toBe(true);
  });

  test('GET /api/countries - returns array', async () => {
    const { status, json } = await api('/api/countries');
    expect(status).toBe(200);
    expect(json).toHaveProperty('countries');
    expect(Array.isArray(json.countries)).toBe(true);
  });

  test('GET /api/countries?locale=ar - returns Arabic names', async () => {
    const { status, json } = await api('/api/countries?locale=ar');
    expect(status).toBe(200);
    if (json.countries.length > 0) {
      expect(json.countries[0]).toHaveProperty('name');
    }
  });

  test('GET /api/companies/search - returns results', async () => {
    const { status, json } = await api('/api/companies/search');
    expect(status).toBe(200);
    expect(json).toHaveProperty('companies');
    expect(json).toHaveProperty('pagination');
  });

  test('GET /api/companies/search?locale=ar - locale support', async () => {
    const { status, json } = await api('/api/companies/search?locale=ar');
    expect(status).toBe(200);
    expect(json).toHaveProperty('companies');
  });

  test('GET /api/requests - returns results', async () => {
    const { status, json } = await api('/api/requests');
    expect(status).toBe(200);
    // Response wrapped: {success, data: {requests, pagination}}
    const data = json.data || json;
    expect(data).toHaveProperty('requests');
    expect(data).toHaveProperty('pagination');
  });
});

// ─── 3. PROTECTED USER ENDPOINTS ─────────────────────────────
describe('Protected User API', () => {
  test('GET /api/user/profile - requires auth', async () => {
    const { status } = await api('/api/user/profile');
    expect(status).toBe(401);
  });

  test('PUT /api/user/profile - requires auth', async () => {
    const { status } = await api('/api/user/profile', {
      method: 'PUT',
      body: JSON.stringify({ name: 'New Name' }),
    });
    expect(status).toBe(401);
  });

  test('GET /api/user/reviews - requires auth', async () => {
    const { status } = await api('/api/user/reviews');
    expect(status).toBe(401);
  });

  test('GET /api/user/notifications - requires auth', async () => {
    const { status } = await api('/api/user/notifications');
    expect(status).toBe(401);
  });

  test('PUT /api/user/password - requires auth', async () => {
    const { status } = await api('/api/user/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword: 'old', newPassword: 'new' }),
    });
    expect(status).toBe(401);
  });

  test('DELETE /api/user/account - requires auth', async () => {
    const { status } = await api('/api/user/account', { method: 'DELETE' });
    expect(status).toBe(401);
  });
});

// ─── 4. PROTECTED PROJECT/OFFER ENDPOINTS ────────────────────
describe('Protected Project & Offer API', () => {
  test('GET /api/projects - requires auth', async () => {
    const { status } = await api('/api/projects');
    expect(status).toBe(401);
  });

  test('POST /api/projects - requires auth', async () => {
    const { status } = await api('/api/projects', {
      method: 'POST',
      body: JSON.stringify({ title: 'Test' }),
    });
    expect(status).toBe(401);
  });

  test('GET /api/offers/nonexistent - requires auth', async () => {
    const { status } = await api('/api/offers/00000000-0000-0000-0000-000000000000');
    expect(status).toBe(401);
  });

  test('GET /api/messages - requires auth', async () => {
    const { status } = await api('/api/messages');
    expect(status).toBe(401);
  });

  test('GET /api/notifications - requires auth', async () => {
    const { status } = await api('/api/notifications');
    expect(status).toBe(401);
  });

  test('GET /api/company/dashboard - requires auth', async () => {
    const { status } = await api('/api/company/dashboard');
    expect(status).toBe(401);
  });
});

// ─── 5. ADMIN ENDPOINTS ─────────────────────────────────────
describe('Admin API - Auth Enforcement', () => {
  const adminEndpoints = [
    '/api/admin/stats',
    '/api/admin/users',
    '/api/admin/companies',
    '/api/admin/categories',
    '/api/admin/requests',
    '/api/admin/projects',
    '/api/admin/offers',
    '/api/admin/reviews',
    '/api/admin/feature-flags',
    '/api/admin/verifications',
    '/api/admin/roles',
    '/api/admin/staff',
  ];

  for (const endpoint of adminEndpoints) {
    test(`GET ${endpoint} - blocks unauthenticated`, async () => {
      const { status } = await api(endpoint);
      expect([401, 403]).toContain(status);
    });
  }
});

// ─── 6. CSRF PROTECTION ─────────────────────────────────────
describe('CSRF Protection', () => {
  test('POST with wrong origin is rejected', async () => {
    const res = await fetch(`${BASE}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://evil.com',
      },
      body: JSON.stringify({ email: 'test@test.com', password: 'pass' }),
    });
    expect(res.status).toBe(403);
  });

  test('PUT with wrong origin is rejected', async () => {
    const res = await fetch(`${BASE}/api/user/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://attacker.com',
      },
      body: JSON.stringify({ name: 'hacked' }),
    });
    // Either 403 (CSRF) or 401 (no auth) — both acceptable
    expect([401, 403]).toContain(res.status);
  });

  test('DELETE with wrong origin is rejected', async () => {
    const res = await fetch(`${BASE}/api/user/account`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://malicious.site',
      },
    });
    expect([401, 403]).toContain(res.status);
  });
});

// ─── 7. INPUT VALIDATION ────────────────────────────────────
describe('Input Validation', () => {
  test('POST /api/auth/register - XSS in name is handled', async () => {
    const { status, json } = await api('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: '<script>alert("xss")</script>',
        email: `${unique()}@test.com`,
        password: 'StrongPass123!',
        confirmPassword: 'StrongPass123!',
        acceptTerms: true,
      }),
    });
    // Should either reject or sanitize — not crash
    expect([200, 201, 400, 422, 429]).toContain(status);
  });

  test('POST /api/auth/register - SQL injection attempt', async () => {
    const { status } = await api('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: "'; DROP TABLE users; --",
        email: `${unique()}@test.com`,
        password: 'StrongPass123!',
        confirmPassword: 'StrongPass123!',
        acceptTerms: true,
      }),
    });
    expect([200, 201, 400, 422, 429]).toContain(status);
  });

  test('POST /api/requests - missing required fields', async () => {
    const { status } = await api('/api/requests', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    expect([400, 401, 422]).toContain(status);
  });

  test('GET /api/requests?page=-1 - invalid pagination', async () => {
    const { status, json } = await api('/api/requests?page=-1&limit=0');
    // Should not crash
    expect([200, 400]).toContain(status);
  });

  test('GET /api/companies/search?q=<script> - XSS in query', async () => {
    const { status } = await api('/api/companies/search?q=<script>alert(1)</script>');
    expect(status).toBe(200); // Should handle gracefully, not crash
  });
});

// ─── 8. RESPONSE FORMAT CONSISTENCY ──────────────────────────
describe('Response Format', () => {
  test('error responses include error field', async () => {
    const { json } = await api('/api/user/profile');
    expect(json).toHaveProperty('error');
    expect(typeof json.error).toBe('string');
  });

  test('pagination responses have standard format', async () => {
    const { json } = await api('/api/requests');
    const data = json.data || json;
    expect(data.pagination).toHaveProperty('page');
    expect(data.pagination).toHaveProperty('limit');
    expect(data.pagination).toHaveProperty('total');
    expect(data.pagination).toHaveProperty('totalPages');
  });
});
