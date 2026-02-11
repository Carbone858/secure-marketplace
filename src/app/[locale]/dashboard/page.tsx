import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getSession } from '@/lib/auth-session/session';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { User, Settings, FileText, MessageSquare, Briefcase } from 'lucide-react';

interface DashboardPageProps {
  params: { locale: string };
}

export async function generateMetadata({
  params: { locale },
}: DashboardPageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'dashboard' });

  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

export default async function DashboardPage({ params: { locale } }: DashboardPageProps) {
  const session = await getSession();

  if (!session.isAuthenticated) {
    redirect(`/${locale}/auth/login`);
  }

  const isRTL = locale === 'ar';
  const t = await getTranslations({ locale, namespace: 'dashboard' });

  const menuItems = [
    {
      title: t('menu.profile'),
      description: t('menu.profileDesc'),
      href: `/${locale}/dashboard/profile`,
      icon: User,
      color: 'bg-blue-500',
    },
    {
      title: t('menu.settings'),
      description: t('menu.settingsDesc'),
      href: `/${locale}/dashboard/settings`,
      icon: Settings,
      color: 'bg-green-500',
    },
    {
      title: t('menu.requests'),
      description: t('menu.requestsDesc'),
      href: `/${locale}/dashboard/requests`,
      icon: FileText,
      color: 'bg-purple-500',
    },
    {
      title: t('menu.messages'),
      description: t('menu.messagesDesc'),
      href: `/${locale}/dashboard/messages`,
      icon: MessageSquare,
      color: 'bg-orange-500',
    },
    {
      title: t('menu.company'),
      description: t('menu.companyDesc'),
      href: `/${locale}/dashboard/company`,
      icon: Briefcase,
      color: 'bg-pink-500',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {t('welcome', { name: session.user?.name || session.user?.email })}
        </h1>
        <p className="text-gray-600 mt-2">{t('subtitle')}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="text-3xl font-bold text-blue-600">0</div>
          <div className="text-gray-600 mt-1">{t('stats.activeRequests')}</div>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <div className="text-3xl font-bold text-green-600">0</div>
          <div className="text-gray-600 mt-1">{t('stats.offers')}</div>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <div className="text-3xl font-bold text-purple-600">0</div>
          <div className="text-gray-600 mt-1">{t('stats.messages')}</div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow p-6 group"
          >
            <div className="flex items-start gap-4">
              <div className={`${item.color} p-3 rounded-lg text-white`}>
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm mt-1">{item.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
