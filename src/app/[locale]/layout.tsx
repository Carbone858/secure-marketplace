import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { Inter, Noto_Sans_Arabic } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';
import { getFeatureFlag, FEATURE_FLAG_KEYS } from '@/lib/feature-flags';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { IOSInstallPrompt } from '@/components/layout/IOSInstallPrompt';
import { SmartAppBanner } from '@/components/layout/SmartAppBanner';
import { authOptions } from '@/lib/next-auth-options';


const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  variable: '--font-arabic',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://secure-marketplace.com'),
  title: 'Service Marketplace',
  description: 'Leading service marketplace platform in the Arab world',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Secure Marketplace',
  },
};

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  let messages;
  try {
    messages = await getMessages();
  } catch (error) {
    messages = {};
  }

  const isRTL = locale === 'ar';

  // Maintenance Mode Check
  const isMaintenanceMode = await getFeatureFlag(FEATURE_FLAG_KEYS.isMaintenanceMode);
  if (isMaintenanceMode) {
    const pathname = headers().get('x-pathname') || '';
    const isAdminPath = pathname.includes('/admin');
    const isMaintenancePath = pathname.includes('/maintenance');
    const isAuthPath = pathname.includes('/auth/');

    if (!isAdminPath && !isMaintenancePath && !isAuthPath) {
      const session = await getServerSession(authOptions);
      const isUserAdmin = (session?.user as any)?.role === 'ADMIN' || (session?.user as any)?.role === 'SUPER_ADMIN';

      if (!isUserAdmin) {
        redirect(`/${locale}/maintenance`);
      }
    }
  }

  return (
    <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <head>
        {/* Preconnect to speed up Google Fonts & reCAPTCHA */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.google.com" />
        <link rel="dns-prefetch" href="https://www.gstatic.com" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body
        className={`${inter.variable} ${notoSansArabic.variable} ${isRTL ? 'font-arabic' : 'font-sans'} min-h-screen flex flex-col antialiased`}
      >
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Providers>
            <SmartAppBanner />
            <Navbar />
            <MobileNav />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
