import { Page } from '@playwright/test';

// ─── Seeded test credentials (from prisma/create-test-users.ts) ──────────────
export const TEST_USERS = {
  user: {
    email: 'user@secure-marketplace.com',
    password: 'Test123456!@',
    name: 'Standard User',
    role: 'USER',
  },
  company: {
    email: 'company@secure-marketplace.com',
    password: 'Test123456!@',
    name: 'Verified Company',
    role: 'COMPANY',
  },
  pending: {
    email: 'pending@secure-marketplace.com',
    password: 'Test123456!@',
    name: 'Pending Company',
    role: 'COMPANY',
  },
  admin: {
    email: 'admin@secure-marketplace.com',
    password: 'Test123456!@',
    name: 'System Admin',
    role: 'ADMIN',
  },
  owner: {
    email: 'owner@secure-marketplace.com',
    password: 'Test123456!@',
    name: 'Website Owner',
    role: 'SUPER_ADMIN',
  },
} as const;

export type TestUserKey = keyof typeof TEST_USERS;

const BASE = process.env.BASE_URL || 'http://localhost:3000';

// ─── UI Login (full browser flow — use to test the login journey itself) ─────
export async function loginViaUI(
  page: Page,
  userKey: TestUserKey,
  locale = 'en'
) {
  const { email, password } = TEST_USERS[userKey];
  await page.goto(`${BASE}/${locale}/auth/login`);
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  // Wait for redirect away from login page
  await page.waitForURL(
    (url) => !url.pathname.includes('/auth/login'),
    { timeout: 15_000 }
  );
}

// ─── API Login (fast-path — injects session cookie without UI overhead) ───────
// Use this for tests that DON'T test the login journey itself but need auth.
export async function loginViaApi(
  page: Page,
  userKey: TestUserKey,
  locale = 'en'
) {
  const { email, password } = TEST_USERS[userKey];

  const response = await page.request.post(`${BASE}/api/auth/login`, {
    data: { email, password },
    headers: {
      'Content-Type': 'application/json',
      'Accept-Language': locale,
      // Playwright shares the browser context so cookies from the response
      // are automatically stored and sent with subsequent page navigations.
    },
  });

  // Fall back to UI login if the API fast-path doesn't work
  if (!response.ok()) {
    await loginViaUI(page, userKey, locale);
  }
}

// ─── Logout (navigate to the logout endpoint or click the logout button) ──────
export async function logout(page: Page, locale = 'en') {
  // Try a direct API call first (most reliable)
  await page.request.post(`${BASE}/api/auth/logout`).catch(() => null);
  // Then navigate to login to confirm session is gone
  await page.goto(`${BASE}/${locale}/auth/login`);
}
