import { test, expect } from '@playwright/test';
import { loginViaApi } from './fixtures/auth';
import { expectNoMissingTranslations } from './fixtures/helpers';

const BASE = process.env.BASE_URL || 'http://localhost:3000';

// ─── 1. HTML DIR ATTRIBUTE ────────────────────────────────────────────────────
test.describe('HTML Dir Attribute', () => {
  test('Arabic pages have dir="rtl"', async ({ page }) => {
    await page.goto(`${BASE}/ar`);
    await page.waitForLoadState('networkidle');
    const dir = await page.locator('html').getAttribute('dir');
    expect(dir).toBe('rtl');
  });

  test('English pages have dir="ltr"', async ({ page }) => {
    await page.goto(`${BASE}/en`);
    await page.waitForLoadState('networkidle');
    const dir = await page.locator('html').getAttribute('dir');
    expect(dir).toBe('ltr');
  });

  test('Arabic login page has dir="rtl"', async ({ page }) => {
    await page.goto(`${BASE}/ar/auth/login`);
    await page.waitForLoadState('networkidle');
    const dir = await page.locator('html').getAttribute('dir');
    expect(dir).toBe('rtl');
  });

  test('English login page has dir="ltr"', async ({ page }) => {
    await page.goto(`${BASE}/en/auth/login`);
    await page.waitForLoadState('networkidle');
    const dir = await page.locator('html').getAttribute('dir');
    expect(dir).toBe('ltr');
  });
});

// ─── 2. ARABIC CONTENT ────────────────────────────────────────────────────────
test.describe('Arabic Content', () => {
  test('AR home page contains Arabic Unicode characters', async ({ page }) => {
    await page.goto(`${BASE}/ar`);
    await page.waitForLoadState('networkidle');
    const body = await page.locator('body').innerText();
    expect(/[\u0600-\u06FF]/.test(body)).toBe(true);
  });

  test('AR login page contains Arabic Unicode characters', async ({ page }) => {
    await page.goto(`${BASE}/ar/auth/login`);
    await page.waitForLoadState('networkidle');
    const body = await page.locator('body').innerText();
    expect(/[\u0600-\u06FF]/.test(body)).toBe(true);
  });

  test('AR register page contains Arabic Unicode characters', async ({ page }) => {
    await page.goto(`${BASE}/ar/auth/register`);
    await page.waitForLoadState('networkidle');
    const body = await page.locator('body').innerText();
    expect(/[\u0600-\u06FF]/.test(body)).toBe(true);
  });

  test('AR companies page contains Arabic text', async ({ page }) => {
    await page.goto(`${BASE}/ar/companies`);
    await page.waitForLoadState('networkidle');
    const body = await page.locator('body').innerText();
    expect(/[\u0600-\u06FF]/.test(body)).toBe(true);
  });
});

// ─── 3. ENGLISH CONTENT ───────────────────────────────────────────────────────
test.describe('English Content', () => {
  test('EN login page contains English keywords', async ({ page }) => {
    await page.goto(`${BASE}/en/auth/login`);
    await page.waitForLoadState('networkidle');
    const body = await page.locator('body').innerText().then((t) => t.toLowerCase());
    expect(body).toMatch(/login|sign\s*in|email|password/);
  });

  test('EN register page contains English keywords', async ({ page }) => {
    await page.goto(`${BASE}/en/auth/register`);
    await page.waitForLoadState('networkidle');
    const body = await page.locator('body').innerText().then((t) => t.toLowerCase());
    expect(body).toMatch(/register|sign\s*up|create account|email|password/);
  });
});

// ─── 4. NO MISSING TRANSLATION KEYS ──────────────────────────────────────────
test.describe('Translation Key Integrity', () => {
  const pagesToCheck = [
    { path: '/en', label: 'EN Home' },
    { path: '/ar', label: 'AR Home' },
    { path: '/en/auth/login', label: 'EN Login' },
    { path: '/ar/auth/login', label: 'AR Login' },
    { path: '/en/auth/register', label: 'EN Register' },
    { path: '/en/companies', label: 'EN Companies' },
  ];

  for (const { path, label } of pagesToCheck) {
    test(`${label} has no raw translation key artifacts`, async ({ page }) => {
      await page.goto(`${BASE}${path}`);
      await page.waitForLoadState('networkidle');
      await expectNoMissingTranslations(page);
    });
  }
});

// ─── 5. LANGUAGE SWITCHER ─────────────────────────────────────────────────────
test.describe('Language Switcher', () => {
  test('lang switcher on auth pages changes URL locale', async ({ page }) => {
    await page.goto(`${BASE}/en/auth/login`);
    await page.waitForLoadState('networkidle');

    await page.goto(`${BASE}/ar/auth/login`);
    await expect(page).toHaveURL(/\/ar\/auth\/login/);
  });
});

// ─── 6. DASHBOARD RTL (authenticated) ─────────────────────────────────────────
test.describe('Dashboard i18n', () => {
  test('AR user dashboard has dir=rtl', async ({ page }) => {
    await loginViaApi(page, 'user', 'ar');
    await page.goto(`${BASE}/ar/dashboard`);
    await page.waitForLoadState('networkidle');
    const dir = await page.locator('html').getAttribute('dir');
    expect(dir).toBe('rtl');
  });

  test('EN user dashboard has dir=ltr', async ({ page }) => {
    await loginViaApi(page, 'user', 'en');
    await page.goto(`${BASE}/en/dashboard`);
    await page.waitForLoadState('networkidle');
    const dir = await page.locator('html').getAttribute('dir');
    expect(dir).toBe('ltr');
  });
});
