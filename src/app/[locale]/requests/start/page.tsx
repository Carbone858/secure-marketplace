import { Metadata } from 'next';
import { getTranslations, getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { prisma } from '@/lib/db/client';
import { RequestFormSPA } from '@/components/requests/RequestFormSPA';

interface StartRequestPageProps {
  params: { locale: string };
}

export async function generateMetadata({
  params: { locale },
}: StartRequestPageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'requests' });

  return {
    title: t('new.meta.title'),
    description: t('new.meta.description'),
  };
}

async function getCategories() {
  return prisma.category.findMany({
    where: { isActive: true, parentId: null },
    select: { id: true, nameEn: true, nameAr: true, icon: true },
    orderBy: { sortOrder: 'asc' },
  });
}

async function getCountries() {
  return prisma.country.findMany({
    select: { id: true, nameEn: true, nameAr: true, code: true },
    orderBy: { nameEn: 'asc' },
  });
}

export default async function StartRequestPage({ params: { locale } }: StartRequestPageProps) {
  const isRTL = locale === 'ar';
  const t = await getTranslations({ locale, namespace: 'requests' });
  const [categories, countries] = await Promise.all([getCategories(), getCountries()]);

  let messages;
  try {
    messages = await getMessages();
  } catch {
    messages = {};
  }

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <div className="min-h-screen bg-muted/50 py-8 sm:py-12" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-3xl mx-auto px-4">
          <div className="mb-6 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{t('new.startTitle')}</h1>
            <p className="text-muted-foreground">{t('new.startSubtitle')}</p>
          </div>

          <RequestFormSPA categories={categories} countries={countries} mode="guest" />
        </div>
      </div>
    </NextIntlClientProvider>
  );
}
