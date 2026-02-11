import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind CSS classes with proper conflict resolution.
 * Uses clsx for conditional classes + tailwind-merge to deduplicate.
 *
 * @example
 *   cn('px-4 py-2', isActive && 'bg-primary', className)
 *   cn('text-red-500', 'text-blue-500') // → 'text-blue-500' (last wins)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
