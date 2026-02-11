import * as React from 'react';
import { cn } from '@/lib/utils';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onCheckedChange, checked, defaultChecked, ...props }, ref) => (
    <input
      ref={ref}
      type="checkbox"
      className={cn(
        'h-4 w-4 rounded border border-input text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className
      )}
      checked={checked}
      defaultChecked={defaultChecked}
      onChange={(event) => onCheckedChange?.(event.target.checked)}
      {...props}
    />
  )
);

Checkbox.displayName = 'Checkbox';
