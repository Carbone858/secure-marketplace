import { Page, expect } from '@playwright/test';

const BASE = process.env.BASE_URL || 'http://localhost:3000';

// ─── Navigation ───────────────────────────────────────────────────────────────

/** Assert the page did NOT land on a 404. */
export async function expectNot404(page: Page) {
  const bodyText = await page.locator('body').innerText();
  expect(bodyText).not.toMatch(/404|not found/i);
}

/** Navigate and wait for networkidle + assert not 404. */
export async function goto(page: Page, path: string) {
  await page.goto(`${BASE}${path}`);
  await page.waitForLoadState('networkidle');
  await expectNot404(page);
}

// ─── Form helpers ─────────────────────────────────────────────────────────────

/** Fill the user registration form with valid defaults (overrides optional). */
export async function fillRegisterForm(
  page: Page,
  overrides: {
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
    acceptTerms?: boolean;
  } = {}
) {
  const unique = () => `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

  const name = overrides.name ?? 'E2E Test User';
  const email = overrides.email ?? `e2e_${unique()}@test.example`;
  const phone = overrides.phone ?? '+966512345678';
  const password = overrides.password ?? 'E2eTestPass1!';
  const confirmPassword = overrides.confirmPassword ?? password;
  const acceptTerms = overrides.acceptTerms !== false; // default true

  await page.fill('input[name="name"]', name);
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="phone"]', phone);
  await page.fill('input[name="password"]', password);
  await page.fill('input[name="confirmPassword"]', confirmPassword);

  if (acceptTerms) {
    const termsBox = page.locator('input[name="termsAccepted"]');
    if (await termsBox.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await termsBox.check();
    }
  }

  return { name, email, phone, password };
}

// ─── Assertions ──────────────────────────────────────────────────────────────

/** Wait for a sonner / toast notification containing text. */
export async function waitForToast(page: Page, text: string | RegExp, timeout = 8_000) {
  await expect(
    page.locator('[data-sonner-toast], [role="status"], [class*="toast"]').filter({ hasText: text })
  ).toBeVisible({ timeout });
}

/** Assert at least one visible element matches the selector. */
export async function expectVisible(page: Page, selector: string) {
  await expect(page.locator(selector).first()).toBeVisible({ timeout: 10_000 });
}

/** Assert the page URL matches a pattern. */
export async function expectURL(page: Page, pattern: RegExp) {
  await expect(page).toHaveURL(pattern, { timeout: 15_000 });
}

/** Check body text does not contain raw i18n key artifacts like ".title". */
export async function expectNoMissingTranslations(page: Page) {
  const body = await page.locator('body').innerText();
  // Translation keys look like "auth.login.title" — the dot is the giveaway
  expect(body).not.toMatch(/(?<!\w)\w+\.\w+\.(?:title|description|label|placeholder|button|message)(?!\w)/);
}

/** Confirm we are on a dashboard page (any role). */
export async function expectDashboard(page: Page) {
  await expect(page).toHaveURL(/(dashboard|admin|company\/dashboard)/, { timeout: 15_000 });
}
