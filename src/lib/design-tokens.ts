/* ============================================================
   DESIGN TOKENS REFERENCE
   ============================================================
   
   This file provides TypeScript constants that mirror the CSS 
   custom properties defined in globals.css. Use these for:
   
   1. Programmatic access to token names
   2. Type-safe token references
   3. Documentation of available tokens
   
   The actual values live in globals.css as CSS custom properties.
   To change the theme, edit globals.css — NOT this file.
   ============================================================ */

/**
 * All available semantic color token names.
 * These map to CSS variables: `--{name}` and `--{name}-foreground`
 */
export const COLOR_TOKENS = {
  primary: 'primary',
  secondary: 'secondary',
  accent: 'accent',
  destructive: 'destructive',
  success: 'success',
  warning: 'warning',
  info: 'info',
  muted: 'muted',
  card: 'card',
  popover: 'popover',
  background: 'background',
  foreground: 'foreground',
} as const;

/**
 * Status-specific color tokens.
 * Use these with StatusBadge component or directly as Tailwind classes.
 * 
 * @example
 * // Using StatusBadge component (preferred)
 * <StatusBadge variant="verified">Verified</StatusBadge>
 * 
 * // Using Tailwind classes directly
 * className="bg-status-verified/10 text-status-verified"
 */
export const STATUS_TOKENS = {
  verified: 'status-verified',
  pending: 'status-pending',
  rejected: 'status-rejected',
  open: 'status-open',
  closed: 'status-closed',
  active: 'status-active',
  cancelled: 'status-cancelled',
  completed: 'status-completed',
} as const;

/**
 * Border radius tokens available via Tailwind.
 * 
 * @example
 * className="rounded-sm"  // var(--radius-sm) = 0.25rem
 * className="rounded-md"  // var(--radius-md) = 0.5rem
 * className="rounded-lg"  // var(--radius-lg) = 0.75rem
 * className="rounded-xl"  // var(--radius-xl) = 1rem
 */
export const RADIUS_TOKENS = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
} as const;

/**
 * Font family tokens.
 * 
 * @example
 * className="font-sans"    // Inter (Latin)
 * className="font-arabic"  // Noto Sans Arabic
 */
export const FONT_TOKENS = {
  sans: 'font-sans',
  arabic: 'font-arabic',
} as const;

/**
 * Z-index scale tokens — use these for consistent stacking.
 * Maps to CSS custom properties defined in globals.css.
 */
export const Z_INDEX_TOKENS = {
  sticky: 'var(--z-sticky)',    // 40
  dropdown: 'var(--z-dropdown)', // 50
  overlay: 'var(--z-overlay)',   // 60
  modal: 'var(--z-modal)',       // 70
  toast: 'var(--z-toast)',       // 80
} as const;

/**
 * Motion / transition tokens.
 * Maps to CSS custom properties for consistent animation timing.
 *
 * @example
 * style={{ transitionDuration: 'var(--duration-fast)' }}
 * className="transition-all duration-normal"  // via Tailwind extend
 */
export const MOTION_TOKENS = {
  durationFast: 'var(--duration-fast)',     // 150ms
  durationNormal: 'var(--duration-normal)', // 200ms
  durationSlow: 'var(--duration-slow)',     // 300ms
  easeDefault: 'var(--ease-default)',
  easeIn: 'var(--ease-in)',
  easeOut: 'var(--ease-out)',
} as const;

/**
 * Content density options.
 * Used by LayoutProvider to control spacing globally.
 */
export const DENSITY_OPTIONS = ['compact', 'default', 'spacious'] as const;
export type ContentDensity = typeof DENSITY_OPTIONS[number];

/**
 * Mapping of common status values to StatusBadge variants.
 * Use this to convert API enum values to badge variants.
 * 
 * @example
 * const variant = STATUS_VARIANT_MAP[company.verificationStatus];
 * <StatusBadge variant={variant}>{company.verificationStatus}</StatusBadge>
 */
export const STATUS_VARIANT_MAP: Record<string, string> = {
  // Verification statuses
  VERIFIED: 'verified',
  PENDING: 'pending',
  REJECTED: 'rejected',
  
  // Request statuses
  OPEN: 'open',
  IN_PROGRESS: 'warning',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  CLOSED: 'closed',
  
  // Project statuses
  ACTIVE: 'active',
  
  // Offer statuses
  ACCEPTED: 'success',
  WITHDRAWN: 'neutral',
  
  // Priority levels
  HIGH: 'error',
  MEDIUM: 'warning',
  LOW: 'success',
  
  // User roles
  SUPER_ADMIN: 'error',
  ADMIN: 'warning',
  COMPANY: 'info',
  USER: 'neutral',
} as const;

export type ColorToken = typeof COLOR_TOKENS[keyof typeof COLOR_TOKENS];
export type StatusToken = typeof STATUS_TOKENS[keyof typeof STATUS_TOKENS];
