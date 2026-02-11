import * as React from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant =
  | 'default'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'destructive'
  | 'link';

type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

const baseClasses =
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ' +
  'disabled:opacity-50 disabled:pointer-events-none ring-offset-background';

const variantClasses: Record<ButtonVariant, string> = {
  default: 'bg-primary text-white hover:bg-primary/90',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  link: 'text-primary underline-offset-4 hover:underline',
};

const sizeClasses: Record<ButtonSize, string> = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 px-3',
  lg: 'h-11 px-8',
  icon: 'h-10 w-10',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, children, type, ...props }, ref) => {
    const classes = cn(baseClasses, variantClasses[variant], sizeClasses[size], className);

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
        ...props,
        className: cn((children.props as { className?: string }).className, classes),
      });
    }

    return (
      <button ref={ref} className={classes} type={type ?? 'button'} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
