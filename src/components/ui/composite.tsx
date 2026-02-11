import { cn } from '@/lib/utils';
import { type ReactNode, type ElementType } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

/* ──────────────────────────────────────────────────────
   PageHeader
   
   Consistent header with title, subtitle, and optional actions.
   ────────────────────────────────────────────────────── */

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6 md:mb-8', className)}>
      <div>
        <h1 className="heading-3">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

/* ──────────────────────────────────────────────────────
   StatCard
   
   Reusable stats display card with icon, label, and value.
   ────────────────────────────────────────────────────── */

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  description?: string;
  trend?: {
    value: string;
    positive?: boolean;
  };
  className?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  className,
}: StatCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || trend) && (
          <p className="text-xs text-muted-foreground mt-1">
            {trend && (
              <span
                className={cn(
                  'font-medium',
                  trend.positive ? 'text-success' : 'text-destructive',
                )}
              >
                {trend.value}{' '}
              </span>
            )}
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

/* ──────────────────────────────────────────────────────
   EmptyState
   
   Consistent empty/no-data display with icon + message.
   ────────────────────────────────────────────────────── */

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className,
      )}
    >
      {Icon && (
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
      )}
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      {description && (
        <p className="text-muted-foreground max-w-sm mb-4">{description}</p>
      )}
      {action}
    </div>
  );
}

/* ──────────────────────────────────────────────────────
   StatusBadge
   
   Semantic status badge that uses theme tokens
   instead of hard-coded colors.
   ────────────────────────────────────────────────────── */

type StatusVariant =
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'neutral'
  | 'verified'
  | 'pending'
  | 'rejected'
  | 'open'
  | 'closed'
  | 'active'
  | 'cancelled'
  | 'completed';

interface StatusBadgeProps {
  variant: StatusVariant | (string & {});
  children: ReactNode;
  className?: string;
}

const statusBadgeVariants: Record<string, string> = {
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  error: 'bg-destructive/10 text-destructive border-destructive/20',
  info: 'bg-info/10 text-info border-info/20',
  neutral: 'bg-muted text-muted-foreground border-border',
  verified: 'bg-success/10 text-success border-success/20',
  pending: 'bg-warning/10 text-warning border-warning/20',
  rejected: 'bg-destructive/10 text-destructive border-destructive/20',
  open: 'bg-info/10 text-info border-info/20',
  closed: 'bg-muted text-muted-foreground border-border',
  active: 'bg-success/10 text-success border-success/20',
  cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
  completed: 'bg-primary/10 text-primary border-primary/20',
};

export function StatusBadge({
  variant,
  children,
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        statusBadgeVariants[variant] || statusBadgeVariants.neutral,
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ──────────────────────────────────────────────────────
   IconBox
   
   Consistent icon container with background.
   ────────────────────────────────────────────────────── */

interface IconBoxProps {
  icon: LucideIcon;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'muted' | 'success' | 'warning' | 'destructive';
  className?: string;
}

const iconBoxSizes = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
} as const;

const iconSizes = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
} as const;

const iconBoxVariants = {
  primary: 'bg-primary/10 text-primary',
  muted: 'bg-muted text-muted-foreground',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  destructive: 'bg-destructive/10 text-destructive',
} as const;

export function IconBox({
  icon: Icon,
  size = 'md',
  variant = 'primary',
  className,
}: IconBoxProps) {
  return (
    <div
      className={cn(
        'rounded-lg flex items-center justify-center',
        iconBoxSizes[size],
        iconBoxVariants[variant],
        className,
      )}
    >
      <Icon className={iconSizes[size]} />
    </div>
  );
}

/* ──────────────────────────────────────────────────────
   LoadingState
   
   Consistent loading display.
   ────────────────────────────────────────────────────── */

interface LoadingStateProps {
  text?: string;
  className?: string;
}

export function LoadingState({ text, className }: LoadingStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4',
        className,
      )}
    >
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
      {text && (
        <p className="text-muted-foreground mt-4 text-sm">{text}</p>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────
   StarRating
   
   Reusable star rating display.
   ────────────────────────────────────────────────────── */

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const starSizes = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
} as const;

export function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  className,
}: StarRatingProps) {
  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {Array.from({ length: maxRating }, (_, i) => (
        <svg
          key={i}
          className={cn(
            starSizes[size],
            i < rating
              ? 'fill-warning text-warning'
              : 'fill-none text-muted-foreground/30',
          )}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </div>
  );
}
