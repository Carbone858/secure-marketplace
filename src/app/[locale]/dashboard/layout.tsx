import { ReactNode } from 'react';
import { getMessages, getTranslations } from 'next-intl/server';
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
  const t = await getTranslations({ locale, namespace: 'nav' });

  return (
    <div className="min-h-screen bg-muted/30" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Dashboard Header */}
      <header className="bg-card shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href={`/${locale}`}
              className="text-lg sm:text-xl font-bold text-primary hover:text-primary transition-colors truncate"
            >
              {t('brand')}
            </Link>

            {/* Navigation — hidden on mobile */}
            <nav className="hidden sm:flex items-center gap-4 md:gap-6">
              <Link
                href={`/${locale}/dashboard`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('userMenu.dashboard')}
              </Link>
              <Link
                href={`/${locale}/dashboard/requests`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('userMenu.requests')}
              </Link>
              <Link
                href={`/${locale}/dashboard/messages`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('userMenu.messages')}
              </Link>
              <Link
                href={`/${locale}/dashboard/profile`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('userMenu.profile')}
              </Link>
              <Link
                href={`/${locale}/dashboard/settings`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('userMenu.settings')}
              </Link>
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="hidden sm:inline text-sm text-muted-foreground max-w-[120px] truncate">
                {session.user?.name || session.user?.email}
              </span>
              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="text-sm text-destructive hover:text-destructive transition-colors"
                >
                  {t('userMenu.logout')}
                </button>
              </form>
            </div>
          </div>

          {/* Mobile navigation — visible on small screens */}
          <nav className="sm:hidden flex items-center gap-4 pb-3 overflow-x-auto">
            <Link
              href={`/${locale}/dashboard`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
            >
              {t('userMenu.dashboard')}
            </Link>
            <Link
              href={`/${locale}/dashboard/requests`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
            >
              {t('userMenu.requests')}
            </Link>
            <Link
              href={`/${locale}/dashboard/messages`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
            >
              {t('userMenu.messages')}
            </Link>
            <Link
              href={`/${locale}/dashboard/profile`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
            >
              {t('userMenu.profile')}
            </Link>
            <Link
              href={`/${locale}/dashboard/settings`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
            >
              {t('userMenu.settings')}
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-4 sm:py-6 lg:py-8">
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
        </NextIntlClientProvider>
      </main>
    </div>
  );
}
