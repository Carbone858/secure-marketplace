import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getSession } from '@/lib/auth-session/session';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db/client';
import { RequestForm } from '@/components/requests/RequestForm';

interface NewRequestPageProps {
  params: { locale: string };
}

export async function generateMetadata({
  params: { locale },
}: NewRequestPageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'requests' });

  return {
    title: t('new.meta.title'),
    description: t('new.meta.description'),
  };
}

async function getCategories() {
  return prisma.category.findMany({
    where: { isActive: true, parentId: null },
    select: {
      id: true,
      nameEn: true,
      nameAr: true,
      icon: true,
    },
    orderBy: { sortOrder: 'asc' },
  });
}

async function getCountries() {
  return prisma.country.findMany({
    select: {
      id: true,
      nameEn: true,
      nameAr: true,
      code: true,
    },
    orderBy: { nameEn: 'asc' },
  });
}

export default async function NewRequestPage({ params: { locale } }: NewRequestPageProps) {
  const session = await getSession();

  if (!session.isAuthenticated) {
    redirect(`/${locale}/auth/login?redirect=requests/new`);
  }

  const isRTL = locale === 'ar';
  const t = await getTranslations({ locale, namespace: 'requests' });
  const [categories, countries] = await Promise.all([getCategories(), getCountries()]);

  return (
    <div className="min-h-screen bg-muted/50 py-12" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{t('new.title')}</h1>
          <p className="text-muted-foreground">{t('new.subtitle')}</p>
        </div>

        <div className="bg-card rounded-xl shadow-lg p-8">
          <RequestForm categories={categories} countries={countries} />
        </div>
      </div>
    </div>
  );
}
