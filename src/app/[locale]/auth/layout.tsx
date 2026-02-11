import { ReactNode } from 'react';
import { getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';

interface AuthLayoutProps {
  children: ReactNode;
  params: { locale: string };
}

export default async function AuthLayout({
  children,
  params: { locale },
}: AuthLayoutProps) {
  let messages;
  try {
    messages = await getMessages();
  } catch (error) {
    messages = {};
  }

  const isRTL = locale === 'ar';

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <a
            href={`/${locale}`}
            className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            {isRTL ? 'سوق الخدمات' : 'Service Marketplace'}
          </a>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-lg">
          <NextIntlClientProvider messages={messages} locale={locale}>
            {children}
          </NextIntlClientProvider>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            {isRTL
              ? '© 2024 سوق الخدمات. جميع الحقوق محفوظة.'
              : '© 2024 Service Marketplace. All rights reserved.'}
          </p>
        </div>
      </footer>

      {/* reCAPTCHA v3 script */}
      <script
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
        async
        defer
      />
    </div>
  );
}
