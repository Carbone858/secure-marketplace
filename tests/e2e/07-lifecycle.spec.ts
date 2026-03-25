import { test, expect } from '@playwright/test';
import { loginViaUI, TEST_USERS } from './fixtures/auth';
import { adminApproveRequest, submitOffer, acceptOffer, markComplete, sendMessage, apiRequest, createRequest } from './fixtures/api';

const BASE = process.env.BASE_URL || 'http://localhost:3000';

test.describe('Service Lifecycle E2E (UI + API)', () => {
  // Shared state across the sequential tests
  let requestId = '';
  let offerId = '';
  let companyUserId = '';
  let standardUserId = '';

  test('Block A: Request Creation, State, and Admin Approval', async ({ page }) => {
    // 1. Login as User (UI)
    await loginViaUI(page, 'user');
    
    // Get user ID from profile
    const profileRes = await apiRequest(page, 'GET', '/api/user/profile');
    standardUserId = profileRes.user.id;

    // Fetch required dropdown data to create a valid request
    const catsRes = await apiRequest(page, 'GET', '/api/categories');
    const categories = catsRes.categories || [];
    const locRes = await apiRequest(page, 'GET', '/api/countries?includeCities=true');
    const locations = locRes.countries || [];
    
    if (categories.length === 0 || locations.length === 0) {
      throw new Error('Seed data missing: No categories or locations found.');
    }

    // Find specific category by slug for reliability
    const category = categories.find((c: any) => c.slug === 'ac') || categories[0];
    const categoryId = category.id;
    
    // Find specific country (Syria is common in this seed)
    const country = locations.find((l: any) => l.code === 'SY') || locations[0];
    const countryId = country.id;
    
    // EXTREMELY IMPORTANT: cityId MUST be from the cities table, NOT the country table.
    if (!country.cities || country.cities.length === 0) {
      throw new Error(`Country ${country.code} has no cities in API response.`);
    }

    const cityId = country.cities[0].id;

    const createRes = await createRequest(page, {
      title: 'E2E Lifecycle Test Request',
      description: 'Testing the full lifecycle through API.',
      categoryId,
      countryId,
      cityId,
      budgetMin: 100,
      budgetMax: 500,
      currency: 'SAR',
      urgency: 'MEDIUM',
      visibility: 'PUBLIC'
    });
    
    expect(createRes.success).toBeTruthy();
    requestId = createRes.data.request.id;
    expect(createRes.data.request.status).toBe('PENDING');

    // 2. Verify it's not on the public browse page yet
    await page.goto(`${BASE}/en/browse`);
    await page.waitForLoadState('networkidle');
    await expect(page.getByText('E2E Lifecycle Test Request')).not.toBeVisible();

    // 3. Login as Admin and Approve
    await loginViaUI(page, 'admin');
    const approveRes = await adminApproveRequest(page, requestId);
    expect(approveRes.success).toBeTruthy();
    expect(approveRes.data.request.status).toBe('ACTIVE');

    // 4. Verify it's now public
    await page.goto(`${BASE}/en/browse`);
    await page.waitForLoadState('networkidle');
    await expect(page.getByText('E2E Lifecycle Test Request').first()).toBeVisible({ timeout: 15000 });
  });

  test('Block B: Offer Submission and Acceptance', async ({ page }) => {
    // 1. Login as Company (UI)
    await loginViaUI(page, 'company');
    
    const profileRes = await apiRequest(page, 'GET', '/api/user/profile');
    companyUserId = profileRes.user.id;
    expect(companyUserId).toBeTruthy();

    // 2. Submit Offer
    const offerRes = await submitOffer(page, requestId);
    expect(offerRes.success).toBeTruthy();
    offerId = offerRes.data.offer.id;

    // 3. Verify request is REVIEWING_OFFERS
    const reqData = await apiRequest(page, 'GET', `/api/requests/${requestId}`);
    expect(reqData.data.request.status).toBe('REVIEWING_OFFERS');

    // 4. Login as User and Accept Offer
    await loginViaUI(page, 'user');
    const acceptRes = await acceptOffer(page, offerId);
    expect(acceptRes.success).toBeTruthy();
    
    // 5. Verify Project created and Request is ACCEPTED
    expect(acceptRes.data.project).toBeDefined();
    expect(acceptRes.data.project.status).toBe('ACTIVE');
    
    const reqData2 = await apiRequest(page, 'GET', `/api/requests/${requestId}`);
    expect(reqData2.data.request.status).toBe('ACCEPTED');

    // 6. Negative test: Accept again
    try {
      await acceptOffer(page, offerId);
      throw new Error('Should have failed');
    } catch (e: any) {
      expect(e.message).toContain('409');
    }
  });

  test('Block C: Communication Gating and Dual-Sided Completion', async ({ page }) => {
    // 1. Login as User, send message
    await loginViaUI(page, 'user');
    const msgResUser = await sendMessage(page, companyUserId, 'Hello Company!');
    expect(msgResUser.ok).toBeTruthy();

    // 2. User marks complete
    const compUser = await markComplete(page, requestId);
    expect(compUser.success).toBeTruthy();
    expect(compUser.data.project.completedByUser).toBe(true);

    // Verify UI reflects "Waiting on Company"
    await page.goto(`${BASE}/en/dashboard/projects`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('button', { hasText: /Waiting on Company|في انتظار/ }).first()).toBeVisible({ timeout: 10000 });

    // 3. Login as Company
    await loginViaUI(page, 'company');
    
    // Company can still send messages
    const msgResComp = await sendMessage(page, standardUserId, 'We are finishing up!');
    expect(msgResComp.ok).toBeTruthy();

    // Company marks complete
    const compCompany = await markComplete(page, requestId);
    expect(compCompany.success).toBeTruthy();
    expect(compCompany.data.project.status).toBe('COMPLETED');

    // 4. Verify Read-Only Comms Gating
    const msgResFail = await sendMessage(page, standardUserId, 'This should fail');
    expect(msgResFail.ok).toBeFalsy();
    expect(msgResFail.error).toContain('403');

    // 5. Verify UI Status is Completed
    await page.goto(`${BASE}/en/company/dashboard/projects`);
    await page.waitForLoadState('networkidle');
    const badge = page.locator('.bg-primary, .bg-success, [class*="badge"]').filter({ hasText: /Completed|مكتمل/i }).first();
    await expect(badge).toBeVisible({ timeout: 10000 });
  });
});
