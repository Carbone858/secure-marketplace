import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getSession } from '@/lib/auth-session/session';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { User, Settings, FileText, MessageSquare, Briefcase, Star } from 'lucide-react';
import { prisma } from '@/lib/db/client';

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

  // Fetch real stats for the user
  const userId = session.user!.id;
  const [activeRequests, offersCount, messagesCount] = await Promise.all([
    prisma.serviceRequest.count({ where: { userId, status: { in: ['ACTIVE', 'IN_PROGRESS', 'MATCHING'] } } }),
    prisma.offer.count({ where: { request: { userId } } }),
    prisma.message.count({ where: { OR: [{ senderId: userId }, { recipientId: userId }] } }),
  ]);

  const menuItems = [
    {
      title: t('menu.profile'),
      description: t('menu.profileDesc'),
      href: `/${locale}/dashboard/profile`,
      icon: User,
      color: 'bg-primary',
    },
    {
      title: t('menu.settings'),
      description: t('menu.settingsDesc'),
      href: `/${locale}/dashboard/settings`,
      icon: Settings,
      color: 'bg-success',
    },
    {
      title: t('menu.requests'),
      description: t('menu.requestsDesc'),
      href: `/${locale}/dashboard/requests`,
      icon: FileText,
      color: 'bg-accent',
    },
    {
      title: t('menu.messages'),
      description: t('menu.messagesDesc'),
      href: `/${locale}/dashboard/messages`,
      icon: MessageSquare,
      color: 'bg-warning',
    },
    {
      title: t('menu.company'),
      description: t('menu.companyDesc'),
      href: `/${locale}/dashboard/company`,
      icon: Briefcase,
      color: 'bg-destructive',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          {t('welcome', { name: session.user?.name || session.user?.email })}
        </h1>
        <p className="text-muted-foreground mt-2">{t('subtitle')}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card rounded-xl shadow p-6">
          <div className="text-3xl font-bold text-primary">{activeRequests}</div>
          <div className="text-muted-foreground mt-1">{t('stats.activeRequests')}</div>
        </div>
        <div className="bg-card rounded-xl shadow p-6">
          <div className="text-3xl font-bold text-success">{offersCount}</div>
          <div className="text-muted-foreground mt-1">{t('stats.offers')}</div>
        </div>
        <div className="bg-card rounded-xl shadow p-6">
          <div className="text-3xl font-bold text-info">{messagesCount}</div>
          <div className="text-muted-foreground mt-1">{t('stats.messages')}</div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="bg-card rounded-xl shadow hover:shadow-lg transition-shadow p-6 group"
          >
            <div className="flex items-start gap-4">
              <div className={`${item.color} p-3 rounded-lg text-white`}>
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm mt-1">{item.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
