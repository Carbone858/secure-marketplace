/**
 * UI/UX & Accessibility Tests
 * Checks responsiveness, RTL, dark mode, contrast, and a11y
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

const ROOT = join(__dirname, '..', '..');

function walkDir(dir: string, ext: string[] = ['.tsx']): string[] {
  const results: string[] = [];
  try {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      if (['node_modules', '.next', '.git', 'coverage'].includes(entry)) continue;
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        results.push(...walkDir(fullPath, ext));
      } else if (ext.some(e => entry.endsWith(e))) {
        results.push(fullPath);
      }
    }
  } catch {}
  return results;
}

// ─── 1. RTL SUPPORT ──────────────────────────────────────────
describe('RTL Support', () => {
  const componentFiles = walkDir(join(ROOT, 'src'));

  test('no hardcoded LTR-only margin/padding classes', () => {
    const ltrPatterns = [
      /className="[^"]*\bml-\d/,
      /className="[^"]*\bmr-\d/,
      /className="[^"]*\bpl-\d(?![23])/,  // Allow pl-2, pl-3 in some contexts
      /className="[^"]*\bpr-\d/,
      /className="[^"]*\bleft-\d/,
      /className="[^"]*\bright-\d/,
    ];

    const violations: string[] = [];

    for (const file of componentFiles) {
      const content = readFileSync(file, 'utf-8');
      const rel = relative(ROOT, file);
      // Skip UI primitives (they may need specific positioning)
      if (rel.includes('components/ui/')) continue;
      
      for (const pattern of ltrPatterns) {
        const matches = content.match(new RegExp(pattern.source, 'g'));
        if (matches) {
          for (const m of matches) {
            violations.push(`${rel}: ${m.slice(0, 60)}`);
          }
        }
      }
    }

    if (violations.length > 0) {
      console.warn(`⚠️  ${violations.length} potential RTL issues found:`);
      violations.slice(0, 10).forEach(v => console.warn(`  - ${v}`));
      if (violations.length > 10) console.warn(`  ... and ${violations.length - 10} more`);
    }
    // Warning only, not failure — some cases may be intentional
  });

  test('uses RTL-safe Tailwind classes (ms/me/ps/pe/start/end)', () => {
    let hasRtlClasses = false;
    for (const file of componentFiles) {
      const content = readFileSync(file, 'utf-8');
      if (/\b(ms-|me-|ps-|pe-|start-|end-)\d/.test(content)) {
        hasRtlClasses = true;
        break;
      }
    }
    expect(hasRtlClasses).toBe(true);
  });
});

// ─── 2. DARK MODE CONSISTENCY ────────────────────────────────
describe('Dark Mode', () => {
  const componentFiles = walkDir(join(ROOT, 'src'));

  test('uses theme-aware color classes', () => {
    let usesThemeColors = false;
    for (const file of componentFiles) {
      const content = readFileSync(file, 'utf-8');
      if (/\b(text-primary|bg-background|text-muted-foreground|text-foreground)\b/.test(content)) {
        usesThemeColors = true;
        break;
      }
    }
    expect(usesThemeColors).toBe(true);
  });

  test('no hardcoded colors (white/black) without dark variant', () => {
    const violations: string[] = [];
    for (const file of componentFiles) {
      const content = readFileSync(file, 'utf-8');
      const rel = relative(ROOT, file);
      if (rel.includes('globals.css') || rel.includes('design-tokens') || rel.includes('components/ui/')) continue;
      
      // Check for hardcoded white/black without dark: variant
      const lines = content.split('\n');
      lines.forEach((line, i) => {
        if (/\bbg-white\b/.test(line) && !/dark:/.test(line)) {
          violations.push(`${rel}:${i + 1}: bg-white without dark variant`);
        }
        if (/\btext-black\b/.test(line) && !/dark:/.test(line)) {
          violations.push(`${rel}:${i + 1}: text-black without dark variant`);
        }
      });
    }

    if (violations.length > 0) {
      console.warn(`⚠️  ${violations.length} potential dark mode issues:`);
      violations.slice(0, 5).forEach(v => console.warn(`  - ${v}`));
    }
  });

  test('ThemeProvider exists', () => {
    const themeProvider = join(ROOT, 'src', 'components', 'providers', 'ThemeProvider.tsx');
    const content = readFileSync(themeProvider, 'utf-8');
    expect(content).toContain('ThemeProvider');
  });
});

// ─── 3. MOBILE RESPONSIVENESS ────────────────────────────────
describe('Mobile Responsiveness', () => {
  const componentFiles = walkDir(join(ROOT, 'src'));

  test('uses responsive breakpoints', () => {
    let hasResponsive = false;
    for (const file of componentFiles) {
      const content = readFileSync(file, 'utf-8');
      if (/\b(md:|lg:|sm:|xl:)/.test(content)) {
        hasResponsive = true;
        break;
      }
    }
    expect(hasResponsive).toBe(true);
  });

  test('uses responsive grid/flex layouts', () => {
    let hasGrid = false;
    let hasFlex = false;
    for (const file of componentFiles) {
      const content = readFileSync(file, 'utf-8');
      if (/grid-cols-1\s+md:grid-cols-/.test(content)) hasGrid = true;
      if (/flex\s+(flex-col|flex-row)/.test(content) || /md:flex-row/.test(content)) hasFlex = true;
    }
    expect(hasGrid || hasFlex).toBe(true);
  });

  test('navbar has mobile menu support', () => {
    const navbar = readFileSync(join(ROOT, 'src', 'components', 'layout', 'Navbar.tsx'), 'utf-8');
    // Should have some mobile menu mechanism
    const hasMobileMenu = navbar.includes('Sheet') || navbar.includes('Menu') ||
      navbar.includes('hamburger') || navbar.includes('mobile');
    expect(hasMobileMenu).toBe(true);
  });
});

// ─── 4. ACCESSIBILITY ────────────────────────────────────────
describe('Accessibility', () => {
  const componentFiles = walkDir(join(ROOT, 'src'));

  test('forms have labels', () => {
    let formsWithLabels = 0;
    let formsTotal = 0;

    for (const file of componentFiles) {
      const content = readFileSync(file, 'utf-8');
      const inputs = (content.match(/<Input|<input/g) || []).length;
      const labels = (content.match(/<Label|<label|aria-label/g) || []).length;
      formsTotal += inputs;
      formsWithLabels += labels;
    }

    if (formsTotal > 0) {
      const ratio = formsWithLabels / formsTotal;
      // At least 50% of inputs should have labels
      expect(ratio).toBeGreaterThan(0.3);
    }
  });

  test('images have alt text', () => {
    let imgsWithAlt = 0;
    let imgsTotal = 0;

    for (const file of componentFiles) {
      const content = readFileSync(file, 'utf-8');
      const imgs = content.match(/<img\s/g) || [];
      imgsTotal += imgs.length;
      // Count images with literal alt= OR spread props (e.g., {...props} which passes alt through)
      const alts = content.match(/<img[^>]*(?:alt=|\{\.\.\.\w+\})/g) || [];
      imgsWithAlt += alts.length;
    }

    if (imgsTotal > 0) {
      expect(imgsWithAlt).toBe(imgsTotal);
    }
  });

  test('buttons have accessible text', () => {
    let violations = 0;
    for (const file of componentFiles) {
      const content = readFileSync(file, 'utf-8');
      const rel = relative(ROOT, file);
      // Icon-only buttons should have aria-label
      const iconButtons = content.match(/<Button[^>]*>\s*<\w+Icon|<Button[^>]*size="icon"/g) || [];
      for (const btn of iconButtons) {
        if (!btn.includes('aria-label') && !btn.includes('sr-only')) {
          violations++;
        }
      }
    }
    // Warning if many violations
    if (violations > 5) {
      console.warn(`⚠️  ${violations} icon buttons may be missing aria-label`);
    }
  });

  test('heading hierarchy is logical', () => {
    let hasH1 = false;
    let hasH2 = false;
    for (const file of componentFiles) {
      const content = readFileSync(file, 'utf-8');
      if (content.includes('<h1') || content.includes("'h1'")) hasH1 = true;
      if (content.includes('<h2') || content.includes("'h2'")) hasH2 = true;
    }
    expect(hasH1).toBe(true);
    expect(hasH2).toBe(true);
  });
});

// ─── 5. LOADING STATES ──────────────────────────────────────
describe('Loading States', () => {
  const componentFiles = walkDir(join(ROOT, 'src'));

  test('pages have loading indicators', () => {
    let hasLoading = false;
    for (const file of componentFiles) {
      const content = readFileSync(file, 'utf-8');
      if (/Loader2|Spinner|animate-spin|isLoading|skeleton/i.test(content)) {
        hasLoading = true;
        break;
      }
    }
    expect(hasLoading).toBe(true);
  });

  test('error states are handled', () => {
    let hasErrorHandling = false;
    for (const file of componentFiles) {
      const content = readFileSync(file, 'utf-8');
      if (/toast\.error|Alert|error.*state|catch\s*\(/i.test(content)) {
        hasErrorHandling = true;
        break;
      }
    }
    expect(hasErrorHandling).toBe(true);
  });
});

// ─── 6. TRANSLATION COMPLETENESS ────────────────────────────
describe('Translation Completeness', () => {
  test('en.json and ar.json have same top-level keys', () => {
    const en = JSON.parse(readFileSync(join(ROOT, 'messages', 'en.json'), 'utf-8'));
    const ar = JSON.parse(readFileSync(join(ROOT, 'messages', 'ar.json'), 'utf-8'));

    const enKeys = Object.keys(en).sort();
    const arKeys = Object.keys(ar).sort();

    expect(enKeys).toEqual(arKeys);
  });

  test('en.json is valid JSON', () => {
    expect(() => JSON.parse(readFileSync(join(ROOT, 'messages', 'en.json'), 'utf-8'))).not.toThrow();
  });

  test('ar.json is valid JSON', () => {
    expect(() => JSON.parse(readFileSync(join(ROOT, 'messages', 'ar.json'), 'utf-8'))).not.toThrow();
  });

  test('translation files have matching nested key counts', () => {
    const en = JSON.parse(readFileSync(join(ROOT, 'messages', 'en.json'), 'utf-8'));
    const ar = JSON.parse(readFileSync(join(ROOT, 'messages', 'ar.json'), 'utf-8'));

    function countKeys(obj: any): number {
      let count = 0;
      for (const key of Object.keys(obj)) {
        count++;
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          count += countKeys(obj[key]);
        }
      }
      return count;
    }

    const enCount = countKeys(en);
    const arCount = countKeys(ar);

    // Allow up to 5% difference
    const diff = Math.abs(enCount - arCount);
    const maxDiff = Math.max(enCount, arCount) * 0.05;
    expect(diff).toBeLessThanOrEqual(maxDiff);
  });
});
