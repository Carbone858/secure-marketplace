'use client';

import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme, type ThemeMode } from '@/components/providers/ThemeProvider';
import { cn } from '@/lib/utils';

/**
 * Theme toggle button — cycles through light → dark → system.
 * Can also be used as a simple light/dark toggle.
 */
export function ThemeToggle({
  showSystem = false,
  className,
}: {
  /** Whether to include "system" as a third option */
  showSystem?: boolean;
  className?: string;
}) {
  const { mode, resolvedTheme, setMode, toggleTheme } = useTheme();

  if (!showSystem) {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={cn(
          'inline-flex items-center justify-center rounded-md p-2',
          'text-muted-foreground hover:text-foreground hover:bg-accent',
          'transition-colors focus-ring',
          className,
        )}
        aria-label={resolvedTheme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      >
        {resolvedTheme === 'light' ? (
          <Moon className="h-5 w-5" />
        ) : (
          <Sun className="h-5 w-5" />
        )}
      </button>
    );
  }

  const modes: { value: ThemeMode; icon: typeof Sun; label: string }[] = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' },
  ];

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-lg bg-muted p-1',
        className,
      )}
      role="radiogroup"
      aria-label="Theme"
    >
      {modes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={mode === value}
          onClick={() => setMode(value)}
          className={cn(
            'inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm',
            'transition-colors',
            mode === value
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          <Icon className="h-4 w-4 ltr:mr-1.5 rtl:ml-1.5" />
          <span className="sr-only sm:not-sr-only">{label}</span>
        </button>
      ))}
    </div>
  );
}
