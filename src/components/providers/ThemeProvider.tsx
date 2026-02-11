'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';

/* ============================================================
   Theme System
   
   Supports:
   - light / dark / system mode switching (runtime)
   - Custom brand themes via CSS variable overrides
   - Full persistence to localStorage
   ============================================================ */

export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * A brand theme is a named set of CSS custom-property overrides.
 * Only include the variables you want to override — the rest
 * fall through to the base light/dark definitions in globals.css.
 *
 * @example
 * const earthTones: BrandTheme = {
 *   name: 'earth',
 *   label: 'Earth Tones',
 *   overrides: {
 *     '--primary': '30 65% 45%',
 *     '--primary-foreground': '0 0% 100%',
 *     '--accent': '45 50% 90%',
 *   },
 * };
 */
export interface BrandTheme {
  /** Unique key — also used as CSS class on <html> */
  name: string;
  /** Human-readable label */
  label: string;
  /** CSS custom-property overrides (HSL values without `hsl()`) */
  overrides: Record<string, string>;
}

interface ThemeContextValue {
  /** Current setting: light | dark | system */
  mode: ThemeMode;
  /** Resolved actual theme after system preference is evaluated */
  resolvedTheme: 'light' | 'dark';
  /** Currently active brand theme (null = default) */
  brandTheme: BrandTheme | null;
  /** All registered brand themes */
  brandThemes: BrandTheme[];
  /** Change theme mode */
  setMode: (mode: ThemeMode) => void;
  /** Toggle between light ↔ dark (ignores system) */
  toggleTheme: () => void;
  /** Apply a brand theme by name (null to clear) */
  setBrandTheme: (name: string | null) => void;
  /** Register a new brand theme at runtime */
  registerBrandTheme: (theme: BrandTheme) => void;
}

const MODE_STORAGE_KEY = 'theme-mode';
const BRAND_STORAGE_KEY = 'theme-brand';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/* ──────────────────────────────────────────────────────
   Provider
   ────────────────────────────────────────────────────── */

interface ThemeProviderProps {
  children: ReactNode;
  /** Pre-register brand themes at mount time */
  defaultBrandThemes?: BrandTheme[];
}

export function ThemeProvider({
  children,
  defaultBrandThemes = [],
}: ThemeProviderProps) {
  const [mode, setModeState] = useState<ThemeMode>('light');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [brandThemes, setBrandThemes] = useState<BrandTheme[]>(defaultBrandThemes);
  const [activeBrand, setActiveBrand] = useState<BrandTheme | null>(null);

  /* Resolve system preference */
  const getSystemTheme = useCallback((): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }, []);

  /* Apply CSS variable overrides from a brand theme */
  const applyBrandOverrides = useCallback((theme: BrandTheme | null) => {
    const root = document.documentElement;
    // Remove any previous brand overrides
    root.removeAttribute('data-brand');
    const existing = root.style.cssText
      .split(';')
      .filter((s) => !s.trim().startsWith('--'))
      .join(';');
    root.style.cssText = existing;

    if (theme) {
      root.setAttribute('data-brand', theme.name);
      Object.entries(theme.overrides).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
    }
  }, []);

  /* Apply the resolved theme to <html> */
  const applyTheme = useCallback(
    (m: ThemeMode) => {
      const resolved = m === 'system' ? getSystemTheme() : m;
      setResolvedTheme(resolved);

      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(resolved);
    },
    [getSystemTheme],
  );

  /* Initialize from localStorage on mount */
  useEffect(() => {
    const storedMode = localStorage.getItem(MODE_STORAGE_KEY) as ThemeMode | null;
    const initialMode = storedMode ?? 'light';
    setModeState(initialMode);
    applyTheme(initialMode);

    // Restore brand theme
    const storedBrand = localStorage.getItem(BRAND_STORAGE_KEY);
    if (storedBrand) {
      const found = defaultBrandThemes.find((t) => t.name === storedBrand);
      if (found) {
        setActiveBrand(found);
        applyBrandOverrides(found);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Listen for system preference changes when mode is "system" */
  useEffect(() => {
    if (mode !== 'system') return;

    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyTheme('system');
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [mode, applyTheme]);

  /* Public setters */
  const setMode = useCallback(
    (m: ThemeMode) => {
      setModeState(m);
      localStorage.setItem(MODE_STORAGE_KEY, m);
      applyTheme(m);
    },
    [applyTheme],
  );

  const toggleTheme = useCallback(() => {
    setMode(resolvedTheme === 'light' ? 'dark' : 'light');
  }, [resolvedTheme, setMode]);

  const setBrandTheme = useCallback(
    (name: string | null) => {
      if (!name) {
        setActiveBrand(null);
        localStorage.removeItem(BRAND_STORAGE_KEY);
        applyBrandOverrides(null);
        return;
      }
      const found = brandThemes.find((t) => t.name === name);
      if (found) {
        setActiveBrand(found);
        localStorage.setItem(BRAND_STORAGE_KEY, name);
        applyBrandOverrides(found);
      }
    },
    [brandThemes, applyBrandOverrides],
  );

  const registerBrandTheme = useCallback((theme: BrandTheme) => {
    setBrandThemes((prev) => {
      if (prev.some((t) => t.name === theme.name)) return prev;
      return [...prev, theme];
    });
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        mode,
        resolvedTheme,
        brandTheme: activeBrand,
        brandThemes,
        setMode,
        toggleTheme,
        setBrandTheme,
        registerBrandTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

/* ──────────────────────────────────────────────────────
   Hook
   ────────────────────────────────────────────────────── */

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
