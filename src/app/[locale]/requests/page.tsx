import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/db/client';
import RequestsClient from './RequestsClient';

interface RequestsPageProps {
  params: { locale: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

import { CANONICAL_DOMAIN } from '@/lib/config/site';
import { JsonLd } from '@/components/seo/JsonLd';

export async function generateMetadata({
  params: { locale },
}: RequestsPageProps): Promise<Metadata> {
  const isAr = locale === 'ar';
  const t = await getTranslations({ locale, namespace: 'requests' });
  const title = `${t('list.meta.title')} | ${isAr ? 'وسيط' : 'Wassitt'}`;
  const description = t('list.meta.description');
  const canonicalUrl = `${CANONICAL_DOMAIN}/${locale}/requests`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ar: `${CANONICAL_DOMAIN}/ar/requests`,
        en: `${CANONICAL_DOMAIN}/en/requests`,
        'x-default': `${CANONICAL_DOMAIN}/ar/requests`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}


export default async function RequestsPage({ params: { locale } }: RequestsPageProps) {
  const [categories, countries, allCities, syriaCountry] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      select: { id: true, nameEn: true, nameAr: true, parentId: true },
    }),
    prisma.country.findMany({
      select: { id: true, nameEn: true, nameAr: true },
    }),
    prisma.city.findMany({
      where: { isActive: true },
      select: { id: true, nameEn: true, nameAr: true, countryId: true },
      orderBy: { nameEn: 'asc' },
    }),
    prisma.country.findFirst({
      where: { code: 'SY' },
      select: { id: true },
    }),
  ]);

  return (
    <RequestsClient
      categories={categories}
      countries={countries}
      allCities={allCities}
      defaultCountryId={syriaCountry?.id}
    />
  );
}
