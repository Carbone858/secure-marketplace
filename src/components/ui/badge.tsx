import * as React from 'react';
import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'secondary' | 'outline' | 'destructive';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-primary text-white',
  secondary: 'bg-secondary text-secondary-foreground',
  outline: 'border border-input',
  destructive: 'bg-destructive text-destructive-foreground',
};

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
