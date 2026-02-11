import { ReactNode } from 'react';
import { getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { getSession } from '@/lib/auth-session/session';
import { redirect } from 'next/navigation';
import Link from 'next/link';

interface DashboardLayoutProps {
  children: ReactNode;
  params: { locale: string };
}

export default async function DashboardLayout({
  children,
  params: { locale },
}: DashboardLayoutProps) {
  const session = await getSession();

  if (!session.isAuthenticated) {
    redirect(`/${locale}/auth/login`);
  }

  let messages;
  try {
    messages = await getMessages();
  } catch (error) {
    messages = {};
  }

  const isRTL = locale === 'ar';

  return (
    <div className="min-h-screen bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Dashboard Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href={`/${locale}`}
              className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              {isRTL ? 'سوق الخدمات' : 'Service Marketplace'}
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-6">
              <Link
                href={`/${locale}/dashboard`}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {isRTL ? 'لوحة التحكم' : 'Dashboard'}
              </Link>
              <Link
                href={`/${locale}/dashboard/profile`}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {isRTL ? 'الملف الشخصي' : 'Profile'}
              </Link>
              <Link
                href={`/${locale}/dashboard/settings`}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {isRTL ? 'الإعدادات' : 'Settings'}
              </Link>
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {session.user?.name || session.user?.email}
              </span>
              <form action={`/${locale}/api/auth/logout`} method="POST">
                <button
                  type="submit"
                  className="text-sm text-red-600 hover:text-red-800 transition-colors"
                >
                  {isRTL ? 'تسجيل الخروج' : 'Logout'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8">
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
        </NextIntlClientProvider>
      </main>
    </div>
  );
}
