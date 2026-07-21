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
import { SmartAppBanner } from '@/components/layout/SmartAppBanner';
import { authOptions } from '@/lib/next-auth-options';
import { CANONICAL_DOMAIN, SITE_CONFIG } from '@/lib/config/site';
import { JsonLd } from '@/components/seo/JsonLd';

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
  metadataBase: new URL(CANONICAL_DOMAIN),
  title: {
    default: SITE_CONFIG.name.ar,
    template: '%s | وسيط',
  },
  description: SITE_CONFIG.description.ar,
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: SITE_CONFIG.shortName,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: CANONICAL_DOMAIN,
    languages: {
      ar: `${CANONICAL_DOMAIN}/ar`,
      en: `${CANONICAL_DOMAIN}/en`,
      'x-default': `${CANONICAL_DOMAIN}/ar`,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    alternateLocale: ['en_US'],
    url: CANONICAL_DOMAIN,
    siteName: 'وسيط Wassitt',
    title: SITE_CONFIG.name.ar,
    description: SITE_CONFIG.description.ar,
    images: [
      {
        url: `${CANONICAL_DOMAIN}/apple-touch-icon.png`,
        width: 512,
        height: 512,
        alt: 'وسيط Wassitt Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.name.ar,
    description: SITE_CONFIG.description.ar,
    images: [`${CANONICAL_DOMAIN}/apple-touch-icon.png`],
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

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Wassitt',
    url: CANONICAL_DOMAIN,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${CANONICAL_DOMAIN}/ar/companies?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Wassitt',
    url: CANONICAL_DOMAIN,
    logo: `${CANONICAL_DOMAIN}/apple-touch-icon.png`,
    description: SITE_CONFIG.description.ar,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: SITE_CONFIG.contact.email,
    },
  };

  return (
    <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.google.com" />
        <link rel="dns-prefetch" href="https://www.gstatic.com" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <JsonLd data={[websiteSchema, organizationSchema]} />
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
