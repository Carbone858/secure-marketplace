/**
 * Regression Tests
 * Verifies all previously fixed issues remain resolved.
 * Maps to QA Report findings and ensures no regressions.
 */

import { readFileSync } from 'fs';
import { join } from 'path';

const ROOT = join(__dirname, '..', '..');

// ─── C1: JSON Translation Files ─────────────────────────────
describe('C1: Translation files are valid JSON', () => {
  test('en.json parses without error', () => {
    const content = readFileSync(join(ROOT, 'messages', 'en.json'), 'utf-8');
    expect(() => JSON.parse(content)).not.toThrow();
  });

  test('ar.json parses without error', () => {
    const content = readFileSync(join(ROOT, 'messages', 'ar.json'), 'utf-8');
    expect(() => JSON.parse(content)).not.toThrow();
  });

  test('no duplicate closing braces causing parse errors', () => {
    const en = readFileSync(join(ROOT, 'messages', 'en.json'), 'utf-8');
    // The original bug was an extra `}` at the end that broke JSON parsing
    // Verify the JSON parses cleanly (no trailing garbage)
    const parsed = JSON.parse(en);
    const roundTrip = JSON.stringify(parsed);
    expect(roundTrip.length).toBeGreaterThan(0);
    // Re-serialize and re-parse should produce identical data
    expect(JSON.parse(roundTrip)).toEqual(parsed);
  });
});

// ─── C2: /api/user/reviews exists ────────────────────────────
describe('C2: User reviews endpoint', () => {
  test('endpoint file exists', () => {
    const content = readFileSync(join(ROOT, 'src', 'app', 'api', 'user', 'reviews', 'route.ts'), 'utf-8');
    expect(content).toContain('GET');
    expect(content).toContain('prisma.review.findMany');
    expect(content).toContain('getSession');
  });
});

// ─── C3: userOnly filter ─────────────────────────────────────
describe('C3: userOnly filter on /api/requests', () => {
  test('requests route supports userOnly parameter', () => {
    const content = readFileSync(join(ROOT, 'src', 'app', 'api', 'requests', 'route.ts'), 'utf-8');
    expect(content).toContain('userOnly');
  });
});

// ─── C4: Profile page auth fix ───────────────────────────────
describe('C4: Profile page uses secure auth', () => {
  test('profile page uses direct Prisma query (not insecure fetch)', () => {
    const content = readFileSync(join(ROOT, 'src', 'app', '[locale]', 'dashboard', 'profile', 'page.tsx'), 'utf-8');
    expect(content).toContain('prisma');
    // Should NOT use fetch with user ID as token
    expect(content).not.toContain('Cookie: access_token=${session.user');
  });
});

// ─── C5: Company dashboard i18n ──────────────────────────────
describe('C5: Company dashboard pages use i18n', () => {
  const pages = [
    'src/app/[locale]/company/dashboard/page.tsx',
    'src/app/[locale]/company/dashboard/browse/page.tsx',
    'src/app/[locale]/company/dashboard/offers/page.tsx',
    'src/app/[locale]/company/dashboard/projects/page.tsx',
    'src/app/[locale]/company/dashboard/reviews/page.tsx',
    'src/app/[locale]/company/dashboard/profile/page.tsx',
  ];

  for (const page of pages) {
    test(`${page} uses useTranslations`, () => {
      const content = readFileSync(join(ROOT, page), 'utf-8');
      expect(content).toContain("useTranslations('company_dashboard')");
    });
  }

  test('company_dashboard namespace exists in en.json', () => {
    const en = JSON.parse(readFileSync(join(ROOT, 'messages', 'en.json'), 'utf-8'));
    expect(en).toHaveProperty('company_dashboard');
    expect(en.company_dashboard).toHaveProperty('title');
    expect(en.company_dashboard).toHaveProperty('membership');
    expect(en.company_dashboard).toHaveProperty('stats');
    expect(en.company_dashboard).toHaveProperty('browse');
    expect(en.company_dashboard).toHaveProperty('offers');
    expect(en.company_dashboard).toHaveProperty('projects');
    expect(en.company_dashboard).toHaveProperty('reviews');
    expect(en.company_dashboard).toHaveProperty('profile');
    expect(en.company_dashboard).toHaveProperty('status');
  });

  test('company_dashboard namespace exists in ar.json', () => {
    const ar = JSON.parse(readFileSync(join(ROOT, 'messages', 'ar.json'), 'utf-8'));
    expect(ar).toHaveProperty('company_dashboard');
    expect(ar.company_dashboard).toHaveProperty('title');
  });
});

// ─── C6: Navigation links fixed ──────────────────────────────
describe('C6: Company dashboard nav links', () => {
  test('main dashboard uses correct paths', () => {
    const content = readFileSync(join(ROOT, 'src', 'app', '[locale]', 'company', 'dashboard', 'page.tsx'), 'utf-8');
    // Should use /company/dashboard/projects, not /company/projects
    expect(content).toContain('company/dashboard/projects');
    expect(content).toContain('company/dashboard/offers');
    expect(content).toContain('company/dashboard/profile');
    // Should NOT have old broken paths
    expect(content).not.toMatch(/\$\{locale\}\/company\/projects['")`]/);
    expect(content).not.toMatch(/\$\{locale\}\/company\/offers['")`]/);
  });
});

// ─── C7: Status enum fix ─────────────────────────────────────
describe('C7: Browse page uses valid status enum', () => {
  test('no OPEN status in browse page', () => {
    const content = readFileSync(join(ROOT, 'src', 'app', '[locale]', 'company', 'dashboard', 'browse', 'page.tsx'), 'utf-8');
    expect(content).not.toContain("status: 'OPEN'");
    // Should use ACTIVE or PENDING
    expect(content).toContain('ACTIVE');
  });
});

// ─── C8: Category filter ─────────────────────────────────────
describe('C8: Category filter in company search', () => {
  test('category filter is wired (not commented out)', () => {
    const content = readFileSync(join(ROOT, 'src', 'app', 'api', 'companies', 'search', 'route.ts'), 'utf-8');
    expect(content).not.toContain('Category filtering not supported');
    expect(content).toContain('categoryId');
    // Should use offers or projects relation
    expect(content).toMatch(/offers|projects/);
  });
});

// ─── M: RTL fixes ────────────────────────────────────────────
describe('M: Home page RTL fixes', () => {
  test('uses RTL-safe classes', () => {
    const content = readFileSync(join(ROOT, 'src', 'app', '[locale]', 'page.tsx'), 'utf-8');
    // Should use start-3, not left-3
    expect(content).toContain('start-3');
    expect(content).not.toContain('left-3');
    // Should use ps-12, not pl-12
    expect(content).toContain('ps-12');
    expect(content).not.toContain('pl-12');
    // Should use ms-2, not ml-2
    expect(content).toContain('ms-2');
    expect(content).not.toContain('ml-2');
  });
});

// ─── M: LanguageSwitcher RTL ─────────────────────────────────
describe('M: LanguageSwitcher RTL', () => {
  test('uses me-2 instead of mr-2', () => {
    const content = readFileSync(join(ROOT, 'src', 'components', 'layout', 'LanguageSwitcher.tsx'), 'utf-8');
    expect(content).toContain('me-2');
    expect(content).not.toContain('mr-2');
  });
});

// ─── M: Countries API locale ─────────────────────────────────
describe('M: Countries API locale support', () => {
  test('supports locale parameter', () => {
    const content = readFileSync(join(ROOT, 'src', 'app', 'api', 'countries', 'route.ts'), 'utf-8');
    expect(content).toContain('locale');
    expect(content).toContain('nameAr');
    expect(content).toContain('nameEn');
  });
});

// ─── M: Status translations in dashboard ─────────────────────
describe('M: Dashboard request status translations', () => {
  test('status badges use translation calls', () => {
    const content = readFileSync(join(ROOT, 'src', 'app', '[locale]', 'dashboard', 'requests', 'page.tsx'), 'utf-8');
    expect(content).toContain('td(`status.');
    expect(content).toContain('td(`urgency.');
  });
});

// ─── Security: Headers ───────────────────────────────────────
describe('Security: Headers configured', () => {
  test('CSP in next.config.js', () => {
    const content = readFileSync(join(ROOT, 'next.config.js'), 'utf-8');
    expect(content).toContain('Content-Security-Policy');
  });

  test('Permissions-Policy in next.config.js', () => {
    const content = readFileSync(join(ROOT, 'next.config.js'), 'utf-8');
    expect(content).toContain('Permissions-Policy');
  });
});

// ─── Dead code removed ───────────────────────────────────────
describe('Dead code cleanup', () => {
  test('HeroSection.tsx is removed', () => {
    expect(() => 
      readFileSync(join(ROOT, 'src', 'app', '[locale]', 'HeroSection.tsx'), 'utf-8')
    ).toThrow();
  });

  test('AvailableProjects.tsx is removed', () => {
    expect(() => 
      readFileSync(join(ROOT, 'src', 'app', '[locale]', 'AvailableProjects.tsx'), 'utf-8')
    ).toThrow();
  });
});

// ─── Feature flags ───────────────────────────────────────────
describe('Feature flags', () => {
  test('isMilestoneTrackingEnabled exists', () => {
    const content = readFileSync(join(ROOT, 'src', 'lib', 'feature-flags.ts'), 'utf-8');
    expect(content).toContain('isMilestoneTrackingEnabled');
  });

  test('all Phase 2 flags are defined', () => {
    const content = readFileSync(join(ROOT, 'src', 'lib', 'feature-flags.ts'), 'utf-8');
    expect(content).toContain('isRequestLimitEnabled');
    expect(content).toContain('isCompanyPaidPlanActive');
    expect(content).toContain('isYellowPagesFeatured');
    expect(content).toContain('isMilestoneTrackingEnabled');
  });
});
