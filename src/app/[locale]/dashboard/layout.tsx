import { ReactNode } from 'react';
import { getMessages, getTranslations } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { getSession } from '@/lib/auth-session/session';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { DynamicBreadcrumbs } from '@/components/ui/DynamicBreadcrumbs';
import { DashboardMobileNav } from '@/components/dashboard/DashboardMobileNav';

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

  // Admins and super admins do not have a user dashboard — redirect them to their admin panel
  if (session.user?.role === 'ADMIN' || session.user?.role === 'SUPER_ADMIN') {
    redirect(`/${locale}/admin`);
  }

  let messages;
  try {
    messages = await getMessages();
  } catch (error) {
    messages = {};
  }

  const isRTL = locale === 'ar';
  const t = await getTranslations({ locale, namespace: 'nav' });

  const companyNavItems = [
    { href: `/${locale}/company/dashboard`, label: t('companyMenu.dashboard') },
    { href: `/${locale}/company/dashboard/browse`, label: t('companyMenu.browse') },
    { href: `/${locale}/company/dashboard/offers`, label: t('companyMenu.offers') },
    { href: `/${locale}/company/dashboard/projects`, label: t('companyMenu.projects') },
    { href: `/${locale}/dashboard/messages`, label: t('userMenu.messages') },
  ];

  const userNavItems = [
    { href: `/${locale}/dashboard`, label: t('userMenu.dashboard') },
    { href: `/${locale}/dashboard/requests`, label: t('userMenu.requests') },
    { href: `/${locale}/dashboard/messages`, label: t('userMenu.messages') },
    { href: `/${locale}/dashboard/profile`, label: t('userMenu.profile') },
    { href: `/${locale}/dashboard/settings`, label: t('userMenu.settings') },
  ];

  const navItems = session.user?.role === 'COMPANY' ? companyNavItems : userNavItems;

  return (
    <div className="min-h-screen bg-muted/30" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Dashboard Header */}
      <header className="bg-card shadow-sm border-b dashboard-layout-header">
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
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="hidden sm:inline text-sm text-muted-foreground max-w-[120px] truncate">
                {session.user?.name || session.user?.email}
              </span>
              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-destructive flex items-center gap-1.5 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  {t('userMenu.logout')}
                </button>
              </form>
            </div>
          </div>

          {/* Mobile navigation — visible on small screens */}
          <DashboardMobileNav items={navItems} />
        </div>
      </header>

      {/* Main Content */}
      <div className="py-4 sm:py-6 lg:py-8">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 dashboard-breadcrumbs-container">
            <DynamicBreadcrumbs />
          </div>
          {children}
        </NextIntlClientProvider>
      </div>
    </div>
  );
}
