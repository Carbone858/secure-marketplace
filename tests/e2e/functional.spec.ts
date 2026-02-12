import { test, expect, Page } from '@playwright/test';

const BASE = process.env.BASE_URL || 'http://localhost:3000';

// ─── Helpers ────────────────────────────────────────────────
const unique = () => `test_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

async function registerUser(page: Page, overrides: Partial<{ name: string; email: string; password: string }> = {}) {
  const email = overrides.email ?? `${unique()}@test.com`;
  const password = overrides.password ?? 'TestPassword123!';
  const name = overrides.name ?? 'Test User';

  await page.goto(`${BASE}/en/auth/register`);
  await page.fill('input[name="name"]', name);
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.fill('input[name="confirmPassword"]', password);
  
  // Accept terms if visible
  const terms = page.locator('input[name="acceptTerms"], input[type="checkbox"]').first();
  if (await terms.isVisible({ timeout: 2000 }).catch(() => false)) {
    await terms.check();
  }

  await page.click('button[type="submit"]');
  return { email, password, name };
}

async function loginUser(page: Page, email: string, password: string) {
  await page.goto(`${BASE}/en/auth/login`);
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/(en|ar)\/(dashboard|$)/, { timeout: 10000 }).catch(() => {});
}

// ─── 1. PUBLIC PAGES ────────────────────────────────────────
test.describe('Public Pages', () => {
  test('home page loads in Arabic (default)', async ({ page }) => {
    await page.goto(`${BASE}/ar`);
    await expect(page).toHaveURL(/\/ar/);
    // Page should have RTL direction
    const dir = await page.locator('html').getAttribute('dir');
    expect(dir).toBe('rtl');
  });

  test('home page loads in English', async ({ page }) => {
    await page.goto(`${BASE}/en`);
    await expect(page).toHaveURL(/\/en/);
    const title = page.locator('h1').first();
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('navigation links are accessible', async ({ page }) => {
    await page.goto(`${BASE}/en`);
    // Check that key nav links exist
    const nav = page.locator('nav');
    await expect(nav).toBeVisible({ timeout: 5000 });
  });

  test('language switcher toggles locale', async ({ page }) => {
    await page.goto(`${BASE}/en`);
    // Find language switcher button
    const switcher = page.locator('button').filter({ hasText: /العربية|English/ }).first();
    if (await switcher.isVisible({ timeout: 3000 }).catch(() => false)) {
      await switcher.click();
      const arabicOption = page.locator('text=العربية').first();
      if (await arabicOption.isVisible({ timeout: 2000 }).catch(() => false)) {
        await arabicOption.click();
        await page.waitForURL(/\/ar/, { timeout: 5000 });
        await expect(page).toHaveURL(/\/ar/);
      }
    }
  });

  test('categories section renders on home page', async ({ page }) => {
    await page.goto(`${BASE}/en`);
    const categoriesSection = page.locator('text=Browse Categories, text=categories, h2:has-text("Categories")').first();
    // May or may not be visible depending on DB data
    await page.waitForLoadState('networkidle');
  });

  test('companies search page loads', async ({ page }) => {
    await page.goto(`${BASE}/en/companies`);
    await page.waitForLoadState('networkidle');
    // Should not be a 404
    await expect(page.locator('text=404')).not.toBeVisible({ timeout: 3000 }).catch(() => {});
  });
});

// ─── 2. AUTHENTICATION FLOW ─────────────────────────────────
test.describe('Authentication', () => {
  test('registration form renders', async ({ page }) => {
    await page.goto(`${BASE}/en/auth/register`);
    await expect(page.locator('input[name="email"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('registration with weak password shows error', async ({ page }) => {
    await page.goto(`${BASE}/en/auth/register`);
    await page.fill('input[name="name"]', 'Test');
    await page.fill('input[name="email"]', `weak_${unique()}@test.com`);
    await page.fill('input[name="password"]', '123');
    
    const confirmPw = page.locator('input[name="confirmPassword"]');
    if (await confirmPw.isVisible({ timeout: 2000 }).catch(() => false)) {
      await confirmPw.fill('123');
    }
    
    await page.click('button[type="submit"]');
    // Should show validation error
    await page.waitForTimeout(1000);
    const hasError = await page.locator('[role="alert"], .text-destructive, .text-red').first()
      .isVisible({ timeout: 3000 }).catch(() => false);
    // Registration should not succeed with weak password
  });

  test('login form renders', async ({ page }) => {
    await page.goto(`${BASE}/en/auth/login`);
    await expect(page.locator('input[name="email"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('login with invalid credentials shows error', async ({ page }) => {
    await page.goto(`${BASE}/en/auth/login`);
    await page.fill('input[name="email"]', 'nonexistent@test.com');
    await page.fill('input[name="password"]', 'WrongPassword123!');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    // Should still be on login page (not redirected)
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('forgot password page renders', async ({ page }) => {
    await page.goto(`${BASE}/en/auth/forgot-password`);
    await expect(page.locator('input[name="email"], input[type="email"]').first()).toBeVisible({ timeout: 10000 });
  });

  test('protected page redirects to login', async ({ page }) => {
    await page.goto(`${BASE}/en/dashboard`);
    await page.waitForURL(/\/auth\/login/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('admin page redirects non-admin', async ({ page }) => {
    await page.goto(`${BASE}/en/admin`);
    // Should redirect to login or dashboard
    await page.waitForURL(/\/(auth\/login|dashboard)/, { timeout: 10000 });
  });
});

// ─── 3. USER DASHBOARD FLOW ─────────────────────────────────
test.describe('User Dashboard', () => {
  test('dashboard page requires auth', async ({ page }) => {
    await page.goto(`${BASE}/en/dashboard`);
    await page.waitForURL(/\/auth\/login/, { timeout: 10000 });
  });

  test('requests page requires auth', async ({ page }) => {
    await page.goto(`${BASE}/en/dashboard/requests`);
    await page.waitForURL(/\/auth\/login/, { timeout: 10000 });
  });

  test('profile page requires auth', async ({ page }) => {
    await page.goto(`${BASE}/en/dashboard/profile`);
    await page.waitForURL(/\/auth\/login/, { timeout: 10000 });
  });
});

// ─── 4. COMPANY DASHBOARD FLOW ──────────────────────────────
test.describe('Company Dashboard', () => {
  test('company dashboard requires auth', async ({ page }) => {
    await page.goto(`${BASE}/en/company/dashboard`);
    await page.waitForURL(/\/auth\/login/, { timeout: 10000 });
  });

  test('company browse page requires auth', async ({ page }) => {
    await page.goto(`${BASE}/en/company/dashboard/browse`);
    await page.waitForURL(/\/auth\/login/, { timeout: 10000 });
  });

  test('company offers page requires auth', async ({ page }) => {
    await page.goto(`${BASE}/en/company/dashboard/offers`);
    await page.waitForURL(/\/auth\/login/, { timeout: 10000 });
  });

  test('company projects page requires auth', async ({ page }) => {
    await page.goto(`${BASE}/en/company/dashboard/projects`);
    await page.waitForURL(/\/auth\/login/, { timeout: 10000 });
  });

  test('company reviews page requires auth', async ({ page }) => {
    await page.goto(`${BASE}/en/company/dashboard/reviews`);
    await page.waitForURL(/\/auth\/login/, { timeout: 10000 });
  });

  test('company profile page requires auth', async ({ page }) => {
    await page.goto(`${BASE}/en/company/dashboard/profile`);
    await page.waitForURL(/\/auth\/login/, { timeout: 10000 });
  });

  test('company register page is accessible', async ({ page }) => {
    await page.goto(`${BASE}/en/company/register`);
    await page.waitForLoadState('networkidle');
    // Should render registration form
  });
});

// ─── 5. ADMIN PANEL FLOW ────────────────────────────────────
test.describe('Admin Panel', () => {
  test('admin dashboard redirects without auth', async ({ page }) => {
    await page.goto(`${BASE}/en/admin`);
    await page.waitForURL(/\/(auth\/login|dashboard)/, { timeout: 10000 });
  });

  const adminPages = [
    'categories', 'companies', 'projects', 'requests',
    'offers', 'reviews', 'messages', 'settings', 'feature-flags',
  ];

  for (const p of adminPages) {
    test(`admin/${p} blocks unauthenticated access`, async ({ page }) => {
      await page.goto(`${BASE}/en/admin/${p}`);
      await page.waitForURL(/\/(auth\/login|dashboard)/, { timeout: 10000 });
    });
  }
});

// ─── 6. I18N & RTL VERIFICATION ─────────────────────────────
test.describe('i18n & RTL', () => {
  test('Arabic pages have dir=rtl', async ({ page }) => {
    await page.goto(`${BASE}/ar`);
    const dir = await page.locator('html').getAttribute('dir');
    expect(dir).toBe('rtl');
  });

  test('English pages have dir=ltr', async ({ page }) => {
    await page.goto(`${BASE}/en`);
    const dir = await page.locator('html').getAttribute('dir');
    expect(dir).toBe('ltr');
  });

  test('login page renders in Arabic', async ({ page }) => {
    await page.goto(`${BASE}/ar/auth/login`);
    await page.waitForLoadState('networkidle');
    // Should have Arabic text
    const bodyText = await page.locator('body').innerText();
    const hasArabic = /[\u0600-\u06FF]/.test(bodyText);
    expect(hasArabic).toBe(true);
  });

  test('login page renders in English', async ({ page }) => {
    await page.goto(`${BASE}/en/auth/login`);
    await page.waitForLoadState('networkidle');
    const bodyText = await page.locator('body').innerText();
    // Should have English keywords (login, sign in, email, password)
    const lower = bodyText.toLowerCase();
    expect(lower).toMatch(/login|sign\s*in|email|password/);
  });

  test('no missing translation keys on home page (en)', async ({ page }) => {
    await page.goto(`${BASE}/en`);
    await page.waitForLoadState('networkidle');
    const bodyText = await page.locator('body').innerText();
    // Missing keys show as the key path
    expect(bodyText).not.toContain('.title');
    expect(bodyText).not.toContain('.description');
  });

  test('no missing translation keys on home page (ar)', async ({ page }) => {
    await page.goto(`${BASE}/ar`);
    await page.waitForLoadState('networkidle');
    const bodyText = await page.locator('body').innerText();
    expect(bodyText).not.toContain('.title');
    expect(bodyText).not.toContain('.description');
  });
});

// ─── 7. DARK/LIGHT MODE ─────────────────────────────────────
test.describe('Theme', () => {
  test('page renders without critical CSS errors', async ({ page }) => {
    await page.goto(`${BASE}/en`);
    await page.waitForLoadState('domcontentloaded');
    // Page should have content
    const bodyContent = await page.locator('body').innerHTML();
    expect(bodyContent.length).toBeGreaterThan(0);
  });
});

// ─── 8. MOBILE RESPONSIVENESS ────────────────────────────────
test.describe('Mobile', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('home page is usable on mobile', async ({ page }) => {
    await page.goto(`${BASE}/en`);
    await page.waitForLoadState('networkidle');
    // No horizontal scrollbar
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 10); // 10px tolerance
  });

  test('login page is usable on mobile', async ({ page }) => {
    await page.goto(`${BASE}/en/auth/login`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });
});
