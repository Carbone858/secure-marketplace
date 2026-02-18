import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/db/client';
import RequestsClient from './RequestsClient';

interface RequestsPageProps {
  params: { locale: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({
  params: { locale },
}: RequestsPageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'requests' });
  return {
    title: t('list.meta.title'),
    description: t('list.meta.description'),
  };
}

export default async function RequestsPage({ params: { locale } }: RequestsPageProps) {
  const [categories, countries, allCities, syriaCountry] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true, parentId: null },
      select: { id: true, nameEn: true, nameAr: true },
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
