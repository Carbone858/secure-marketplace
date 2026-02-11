'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { LayoutProvider } from '@/components/providers/LayoutProvider';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LayoutProvider>
        <AuthProvider>{children}</AuthProvider>
      </LayoutProvider>
    </ThemeProvider>
  );
}
