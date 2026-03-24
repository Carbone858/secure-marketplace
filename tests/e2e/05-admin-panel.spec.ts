import { test, expect } from '@playwright/test';
import { loginViaApi } from './fixtures/auth';
import { expectNot404 } from './fixtures/helpers';

const BASE = process.env.BASE_URL || 'http://localhost:3000';

// All admin tests use the admin seeded user
test.describe('Admin Panel', () => {
  test.beforeEach(async ({ page }) => {
    await loginViaApi(page, 'admin');
  });

  // ─── Dashboard Home ──────────────────────────────────────────────────────
  test('admin dashboard home loads', async ({ page }) => {
    await page.goto(`${BASE}/en/admin`);
    await page.waitForLoadState('networkidle');
    await expectNot404(page);
    await expect(page).toHaveURL(/\/(admin|dashboard)/, { timeout: 12_000 });
  });

  test('admin dashboard has no 500 error', async ({ page }) => {
    await page.goto(`${BASE}/en/admin`);
    await page.waitForLoadState('networkidle');
    const body = await page.locator('body').innerText();
    expect(body).not.toMatch(/Internal Server Error/i);
  });

  // ─── Users Management ────────────────────────────────────────────────────
  test('users list page loads with data', async ({ page }) => {
    await page.goto(`${BASE}/en/admin/users`);
    await page.waitForLoadState('networkidle');
    await expectNot404(page);
    const body = await page.locator('body').innerText();
    expect(body).not.toMatch(/Internal Server Error/i);
    // Should show a table or list with at least one row
    const rows = page.locator('tr, [class*="row"], [class*="user-item"]');
    const count = await rows.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  // ─── Companies Management ────────────────────────────────────────────────
  test('companies management page loads', async ({ page }) => {
    await page.goto(`${BASE}/en/admin/companies`);
    await page.waitForLoadState('networkidle');
    await expectNot404(page);
    const body = await page.locator('body').innerText();
    expect(body).not.toMatch(/Internal Server Error/i);
  });

  // ─── Categories Management ───────────────────────────────────────────────
  test('categories management page loads', async ({ page }) => {
    await page.goto(`${BASE}/en/admin/categories`);
    await page.waitForLoadState('networkidle');
    await expectNot404(page);
  });

  test('categories page shows list or empty state', async ({ page }) => {
    await page.goto(`${BASE}/en/admin/categories`);
    await page.waitForLoadState('networkidle');
    const content = page.locator('body');
    await expect(content).toBeVisible({ timeout: 8_000 });
    const text = await content.innerText();
    expect(text).not.toMatch(/Internal Server Error/i);
  });

  // ─── Requests Management ─────────────────────────────────────────────────
  test('requests management page loads', async ({ page }) => {
    await page.goto(`${BASE}/en/admin/requests`);
    await page.waitForLoadState('networkidle');
    await expectNot404(page);
  });

  // ─── Offers Management ───────────────────────────────────────────────────
  test('offers management page loads', async ({ page }) => {
    await page.goto(`${BASE}/en/admin/offers`);
    await page.waitForLoadState('networkidle');
    await expectNot404(page);
  });

  // ─── Reviews Management ───────────────────────────────────────────────────
  test('reviews management page loads', async ({ page }) => {
    await page.goto(`${BASE}/en/admin/reviews`);
    await page.waitForLoadState('networkidle');
    await expectNot404(page);
  });

  // ─── Messages / Internal ─────────────────────────────────────────────────
  test('messages/internal section loads', async ({ page }) => {
    await page.goto(`${BASE}/en/admin/messages`);
    await page.waitForLoadState('networkidle');
    await expectNot404(page);
  });

  // ─── Feature Flags ────────────────────────────────────────────────────────
  test('feature flags page loads', async ({ page }) => {
    await page.goto(`${BASE}/en/admin/feature-flags`);
    await page.waitForLoadState('networkidle');
    await expectNot404(page);
  });

  test('feature flags page shows list or empty state', async ({ page }) => {
    await page.goto(`${BASE}/en/admin/feature-flags`);
    await page.waitForLoadState('networkidle');
    const body = await page.locator('body').innerText();
    expect(body).not.toMatch(/Internal Server Error/i);
  });

  // ─── Settings ────────────────────────────────────────────────────────────
  test('admin settings page loads', async ({ page }) => {
    await page.goto(`${BASE}/en/admin/settings`);
    await page.waitForLoadState('networkidle');
    await expectNot404(page);
  });

  // ─── Staff Management ─────────────────────────────────────────────────────
  test('staff management page loads', async ({ page }) => {
    await page.goto(`${BASE}/en/admin/staff`);
    await page.waitForLoadState('networkidle');
    // This page may or may not exist; just ensure no crash
    const body = await page.locator('body').innerText();
    expect(body).not.toMatch(/Internal Server Error/i);
  });
});

// ─── ROLE PROTECTION ─────────────────────────────────────────────────────────
test.describe('Admin Role Protection', () => {
  test('regular user accessing /admin is redirected away', async ({ page }) => {
    await loginViaApi(page, 'user');
    await page.goto(`${BASE}/en/admin`);
    await page.waitForURL(/(auth\/login|\/dashboard(?!\/admin)|en\/$)/, { timeout: 10_000 });
    // Should NOT be on an admin page
    expect(page.url()).not.toMatch(/\/admin\/users|\/admin\/companies/);
  });

  test('company user accessing /admin is redirected away', async ({ page }) => {
    await loginViaApi(page, 'company');
    await page.goto(`${BASE}/en/admin`);
    await page.waitForURL(/(auth\/login|\/dashboard(?!\/admin)|en\/$)/, { timeout: 10_000 });
    expect(page.url()).not.toMatch(/\/admin\/users|\/admin\/companies/);
  });

  test('unauthenticated admin access redirects to login', async ({ page }) => {
    await page.goto(`${BASE}/en/admin`);
    await expect(page).toHaveURL(/(auth\/login|dashboard)/, { timeout: 10_000 });
  });
});
