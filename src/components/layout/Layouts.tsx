import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';
import { DynamicBreadcrumbs } from '@/components/ui/DynamicBreadcrumbs';

/* ──────────────────────────────────────────────────────
   PageContainer
   
   Standard page wrapper with max-width and padding.
   Use for all top-level page content.
   ────────────────────────────────────────────────────── */

interface PageContainerProps {
  children: ReactNode;
  /** Container width variant */
  size?: 'narrow' | 'default' | 'wide' | 'full';
  /** Additional class names */
  className?: string;
  /** HTML element to render as */
  as?: 'div' | 'section' | 'article' | 'main';
}

const sizeClasses = {
  narrow: 'max-w-3xl',
  default: 'max-w-7xl',
  wide: 'max-w-[1400px]',
  full: 'max-w-full',
} as const;

export function PageContainer({
  children,
  size = 'default',
  className,
  as: Component = 'div',
}: PageContainerProps) {
  return (
    <Component
      className={cn(
        'mx-auto w-full px-4 sm:px-6 lg:px-8',
        sizeClasses[size],
        className,
      )}
    >
      {children}
    </Component>
  );
}

/* ──────────────────────────────────────────────────────
   Section
   
   Consistent section spacing for page sections.
   ────────────────────────────────────────────────────── */

interface SectionProps {
  children: ReactNode;
  /** Spacing variant */
  spacing?: 'sm' | 'md' | 'lg' | 'none';
  /** Background variant */
  variant?: 'default' | 'muted' | 'primary' | 'card';
  className?: string;
  id?: string;
}

const spacingClasses = {
  none: '',
  sm: 'py-8 md:py-12',
  md: 'py-12 md:py-16 lg:py-20',
  lg: 'py-16 md:py-20 lg:py-24',
} as const;

const variantClasses = {
  default: '',
  muted: 'bg-muted/30',
  primary: 'bg-primary text-primary-foreground',
  card: 'bg-card',
} as const;

export function Section({
  children,
  spacing = 'md',
  variant = 'default',
  className,
  id,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(spacingClasses[spacing], variantClasses[variant], className)}
    >
      {children}
    </section>
  );
}

/* ──────────────────────────────────────────────────────
   SectionHeader
   
   Standard section header with title + optional subtitle.
   ────────────────────────────────────────────────────── */

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  align = 'center',
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'mb-8 md:mb-12',
        align === 'center' && 'text-center',
        className,
      )}
    >
      <h2 className="heading-2 mb-4">{title}</h2>
      {subtitle && (
        <p
          className={cn(
            'text-muted-foreground text-lg',
            align === 'center' && 'max-w-2xl mx-auto',
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────
   GridLayout
   
   Responsive grid with configurable columns.
   Uses static class maps (Tailwind-safe) instead of
   string interpolation, so all classes are purge-safe.
   ────────────────────────────────────────────────────── */

interface GridLayoutProps {
  children: ReactNode;
  /** Number of columns at each breakpoint */
  cols?: {
    sm?: 1 | 2 | 3 | 4;
    md?: 1 | 2 | 3 | 4 | 6;
    lg?: 1 | 2 | 3 | 4 | 5 | 6;
  };
  /** Gap between items */
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

const gapClasses = {
  sm: 'gap-3',
  md: 'gap-6',
  lg: 'gap-8',
} as const;

/* Static maps — every class Tailwind could ever see is in source */
const smColClasses: Record<number, string> = {
  1: 'sm:grid-cols-1',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
  4: 'sm:grid-cols-4',
};
const mdColClasses: Record<number, string> = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
  6: 'md:grid-cols-6',
};
const lgColClasses: Record<number, string> = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
  6: 'lg:grid-cols-6',
};

export function GridLayout({
  children,
  cols = { sm: 1, md: 2, lg: 4 },
  gap = 'md',
  className,
}: GridLayoutProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1',
        cols.sm && smColClasses[cols.sm],
        cols.md && mdColClasses[cols.md],
        cols.lg && lgColClasses[cols.lg],
        gapClasses[gap],
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ──────────────────────────────────────────────────────
   DashboardShell
   
   Two-column layout for dashboard pages (sidebar + content).
   Sidebar position, width, and content density are
   configurable via props or inherited from LayoutProvider.
   ────────────────────────────────────────────────────── */

interface DashboardShellProps {
  children: ReactNode;
  sidebar: ReactNode;
  /** Override sidebar position (default: 'start' — left in LTR, right in RTL) */
  sidebarPosition?: 'start' | 'end';
  /** Override sidebar width class */
  sidebarWidth?: string;
  className?: string;
}

export function DashboardShell({
  children,
  sidebar,
  sidebarPosition = 'start',
  sidebarWidth = 'md:w-64 lg:w-72',
  className,
}: DashboardShellProps) {
  const isEnd = sidebarPosition === 'end';

  const sidebarEl = (
    <aside
      className={cn(
        'hidden md:flex flex-col bg-sidebar',
        sidebarWidth,
        isEnd ? 'border-s' : 'border-e',
      )}
    >
      {sidebar}
    </aside>
  );

  return (
    <div className={cn('flex min-h-[calc(100vh-4rem)]', className)}>
      {!isEnd && sidebarEl}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-7xl p-4 md:p-6 lg:p-8">
          <DynamicBreadcrumbs className="mb-6" />
          {children}
        </div>
      </div>
      {isEnd && sidebarEl}
    </div>
  );
}
