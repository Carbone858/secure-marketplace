'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';

/* ============================================================
   LAYOUT CONFIGURATION CONTEXT

   Centralised control over the platform's structural design.
   Change any of these values — at runtime — and every page
   that reads the context will re-render with the new layout.

   This is what makes the platform "fully redesign-ready":
   swapping sidebar position, navigation style, card density,
   or content width without touching page-level code.
   ============================================================ */

/* ──────── Types ──────── */

export type NavigationStyle = 'topbar' | 'sidebar';
export type SidebarPosition = 'start' | 'end';
export type ContentDensity = 'compact' | 'default' | 'spacious';
export type CardStyle = 'flat' | 'bordered' | 'elevated';
export type ButtonShape = 'sharp' | 'rounded' | 'pill';
export type ContainerWidth = 'narrow' | 'default' | 'wide' | 'full';

export interface LayoutConfig {
  /** Top navbar vs. sidebar navigation */
  navigationStyle: NavigationStyle;
  /** Which logical side the sidebar appears on (start = left in LTR) */
  sidebarPosition: SidebarPosition;
  /** Controls spacing / padding multiplier across all components */
  contentDensity: ContentDensity;
  /** Visual style of cards */
  cardStyle: CardStyle;
  /** Global shape override for buttons */
  buttonShape: ButtonShape;
  /** Default max-width for page content */
  containerWidth: ContainerWidth;
  /** Sidebar width in rems (when using sidebar navigation) */
  sidebarWidth: number;
  /** Whether sidebar is collapsed */
  sidebarCollapsed: boolean;
}

interface LayoutContextValue extends LayoutConfig {
  /** Update one or more layout config values */
  updateLayout: (partial: Partial<LayoutConfig>) => void;
  /** Reset to default config */
  resetLayout: () => void;
  /** Toggle sidebar collapse */
  toggleSidebar: () => void;
}

/* ──────── Defaults ──────── */

const STORAGE_KEY = 'layout-config';

export const DEFAULT_LAYOUT: LayoutConfig = {
  navigationStyle: 'topbar',
  sidebarPosition: 'start',
  contentDensity: 'default',
  cardStyle: 'bordered',
  buttonShape: 'rounded',
  containerWidth: 'default',
  sidebarWidth: 16, // 16rem = 256px
  sidebarCollapsed: false,
};

/* ──────── CSS class maps ──────── */

export const DENSITY_CLASSES: Record<ContentDensity, { page: string; card: string; gap: string }> = {
  compact: { page: 'p-3 md:p-4', card: 'p-3', gap: 'gap-3' },
  default: { page: 'p-4 md:p-6 lg:p-8', card: 'p-4 md:p-6', gap: 'gap-4 md:gap-6' },
  spacious: { page: 'p-6 md:p-8 lg:p-10', card: 'p-6 md:p-8', gap: 'gap-6 md:gap-8' },
};

export const CARD_STYLE_CLASSES: Record<CardStyle, string> = {
  flat: 'bg-card rounded-lg',
  bordered: 'bg-card border border-border rounded-lg',
  elevated: 'bg-card rounded-lg shadow-md',
};

export const BUTTON_SHAPE_CLASSES: Record<ButtonShape, string> = {
  sharp: 'rounded-sm',
  rounded: 'rounded-md',
  pill: 'rounded-full',
};

export const CONTAINER_WIDTH_CLASSES: Record<ContainerWidth, string> = {
  narrow: 'max-w-3xl',
  default: 'max-w-7xl',
  wide: 'max-w-[1400px]',
  full: 'max-w-full',
};

/* ──────── Context ──────── */

const LayoutContext = createContext<LayoutContextValue | undefined>(undefined);

/* ──────── Provider ──────── */

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<LayoutConfig>(() => {
    if (typeof window === 'undefined') return DEFAULT_LAYOUT;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? { ...DEFAULT_LAYOUT, ...JSON.parse(stored) } : DEFAULT_LAYOUT;
    } catch {
      return DEFAULT_LAYOUT;
    }
  });

  const persist = useCallback((next: LayoutConfig) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch { /* SSR / quota */ }
  }, []);

  const updateLayout = useCallback(
    (partial: Partial<LayoutConfig>) => {
      setConfig((prev) => {
        const next = { ...prev, ...partial };
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const resetLayout = useCallback(() => {
    setConfig(DEFAULT_LAYOUT);
    persist(DEFAULT_LAYOUT);
  }, [persist]);

  const toggleSidebar = useCallback(() => {
    setConfig((prev) => {
      const next = { ...prev, sidebarCollapsed: !prev.sidebarCollapsed };
      persist(next);
      return next;
    });
  }, [persist]);

  return (
    <LayoutContext.Provider
      value={{
        ...config,
        updateLayout,
        resetLayout,
        toggleSidebar,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

/* ──────── Hook ──────── */

export function useLayout() {
  const ctx = useContext(LayoutContext);
  if (!ctx) throw new Error('useLayout must be used within a LayoutProvider');
  return ctx;
}

/**
 * Convenience hook — returns only the CSS helper class maps
 * resolved for the current config, so components don't need
 * to import the constant maps separately.
 */
export function useLayoutClasses() {
  const { contentDensity, cardStyle, buttonShape, containerWidth } = useLayout();
  return {
    density: DENSITY_CLASSES[contentDensity],
    card: CARD_STYLE_CLASSES[cardStyle],
    button: BUTTON_SHAPE_CLASSES[buttonShape],
    container: CONTAINER_WIDTH_CLASSES[containerWidth],
  };
}
