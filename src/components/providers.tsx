'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { ThemeProvider, BrandTheme } from '@/components/providers/ThemeProvider';
import { LayoutProvider } from '@/components/providers/LayoutProvider';

const emeraldTheme: BrandTheme = {
  name: 'emerald',
  label: 'Emerald Professional',
  overrides: {
    '--primary': '163 94% 24%',
    '--primary-foreground': '0 0% 100%',
    '--secondary': '164 86% 16%',
    '--secondary-foreground': '0 0% 100%',
    '--accent': '160 84% 39%',
    '--accent-foreground': '0 0% 100%',
    '--background': '138 76% 97%',
    '--foreground': '164 86% 16%',
    '--card': '0 0% 100%',
    '--card-foreground': '164 86% 16%',
    '--popover': '0 0% 100%',
    '--popover-foreground': '164 86% 16%',
    '--muted': '138 76% 95%',
    '--muted-foreground': '215 14% 34%',
    '--border': '149 80% 90%',
    '--input': '149 80% 90%',
    '--ring': '163 94% 24%',
  }
};

import { Toaster } from 'sonner';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider defaultBrandThemes={[emeraldTheme]}>
      <LayoutProvider>
        <AuthProvider>
          {children}
          <Toaster position="top-center" richColors />
        </AuthProvider>
      </LayoutProvider>
    </ThemeProvider>
  );
}
