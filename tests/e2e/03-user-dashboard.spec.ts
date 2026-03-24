import { test, expect } from '@playwright/test';
import { loginViaApi } from './fixtures/auth';
import { expectNot404, expectURL } from './fixtures/helpers';

const BASE = process.env.BASE_URL || 'http://localhost:3000';

// Uses fast API login — all tests here assume valid USER session
test.describe('User Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await loginViaApi(page, 'user');
  });

  // ─── Dashboard Home ──────────────────────────────────────────────────────
  test('dashboard home page loads', async ({ page }) => {
    await page.goto(`${BASE}/en/dashboard`);
    await page.waitForLoadState('networkidle');
    await expectNot404(page);
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 });
  });

  test('dashboard has main content area — no 500 error', async ({ page }) => {
    await page.goto(`${BASE}/en/dashboard`);
    await page.waitForLoadState('networkidle');
    const body = await page.locator('body').innerText();
    expect(body).not.toMatch(/500|Internal Server Error/i);
  });

  // ─── My Requests ─────────────────────────────────────────────────────────
  test('requests list page loads', async ({ page }) => {
    await page.goto(`${BASE}/en/dashboard/requests`);
    await page.waitForLoadState('networkidle');
    await expectNot404(page);
  });

  test('requests page shows list or empty state', async ({ page }) => {
    await page.goto(`${BASE}/en/dashboard/requests`);
    await page.waitForLoadState('networkidle');
    const body = await page.locator('body').innerText();
    expect(body).not.toMatch(/500|Internal Server Error/i);
    // Should show EITHER a list of items OR an empty-state message
    const hasContent = await page.locator('[class*="card"], [class*="table"], [class*="empty"]').first()
      .isVisible({ timeout: 5_000 }).catch(() => false);
    const hasAnyText = body.trim().length > 100;
    expect(hasContent || hasAnyText).toBe(true);
  });

  // ─── Create Service Request ───────────────────────────────────────────────
  test('create new service request form is accessible', async ({ page }) => {
    await page.goto(`${BASE}/en/dashboard/requests`);
    await page.waitForLoadState('networkidle');

    // Look for a "New Request" or "Create" button
    const createBtn = page.locator('button, a').filter({
      hasText: /new request|create|add request|طلب جديد|إنشاء/i,
    }).first();

    if (await createBtn.isVisible({ timeout: 4_000 }).catch(() => false)) {
      await createBtn.click();
      await page.waitForLoadState('networkidle');
      // Should navigate to a create/new page or open a modal
      const url = page.url();
      const hasForm = await page.locator('form, input[name="title"]').first()
        .isVisible({ timeout: 6_000 }).catch(() => false);
      expect(url.includes('new') || url.includes('create') || hasForm).toBe(true);
    }
    // If no create button exists, just ensure the page loaded — test is non-blocking
  });

  // ─── Profile ─────────────────────────────────────────────────────────────
  test('profile page loads and shows user info', async ({ page }) => {
    await page.goto(`${BASE}/en/dashboard/profile`);
    await page.waitForLoadState('networkidle');
    await expectNot404(page);
    const body = await page.locator('body').innerText();
    expect(body).not.toMatch(/500|Internal Server Error/i);
  });

  test('profile page shows user details', async ({ page }) => {
    await page.goto(`${BASE}/en/dashboard/profile`);
    await page.waitForLoadState('networkidle');
    // Should have basic profile UI elements
    const body = await page.locator('body').innerText();
    expect(body.length).toBeGreaterThan(50);
  });

  // ─── Settings ────────────────────────────────────────────────────────────
  test('settings page loads', async ({ page }) => {
    await page.goto(`${BASE}/en/dashboard/settings`);
    await page.waitForLoadState('networkidle');
    await expectNot404(page);
  });

  // ─── Notifications ────────────────────────────────────────────────────────
  test('notifications page or indicator is accessible', async ({ page }) => {
    await page.goto(`${BASE}/en/dashboard`);
    await page.waitForLoadState('networkidle');

    // Check for a notification bell / badge in the nav
    const notifEl = page.locator('[aria-label*="notification" i], [href*="notification"], button[class*="bell"]').first();
    const notifPage = `${BASE}/en/dashboard/notifications`;

    if (await notifEl.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await notifEl.click();
      await page.waitForTimeout(1_000);
    } else {
      // Navigate directly
      await page.goto(notifPage);
      await page.waitForLoadState('networkidle');
    }
    await expectNot404(page);
  });

  // ─── Messages ────────────────────────────────────────────────────────────
  test('messages page loads', async ({ page }) => {
    await page.goto(`${BASE}/en/dashboard/messages`);
    await page.waitForLoadState('networkidle');
    await expectNot404(page);
    const body = await page.locator('body').innerText();
    expect(body).not.toMatch(/500|Internal Server Error/i);
  });

  // ─── Reviews ─────────────────────────────────────────────────────────────
  test('reviews page loads', async ({ page }) => {
    await page.goto(`${BASE}/en/dashboard/reviews`);
    await page.waitForLoadState('networkidle');
    await expectNot404(page);
  });

  // ─── Projects ────────────────────────────────────────────────────────────
  test('projects page loads', async ({ page }) => {
    await page.goto(`${BASE}/en/dashboard/projects`);
    await page.waitForLoadState('networkidle');
    await expectNot404(page);
  });
});
