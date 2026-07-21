import React from 'react';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { CANONICAL_DOMAIN } from '@/lib/config/site';
import { JsonLd } from '@/components/seo/JsonLd';

interface LayoutProps {
  children: React.ReactNode;
  params: { locale: string; slug: string };
}

export async function generateMetadata({ params: { locale, slug } }: LayoutProps): Promise<Metadata> {
  const isAr = locale === 'ar';
  const company = await prisma.company.findUnique({
    where: { slug },
    select: {
      name: true,
      description: true,
      logo: true,
      city: { select: { nameEn: true, nameAr: true } },
      country: { select: { nameEn: true, nameAr: true } },
    },
  });

  if (!company) {
    return {
      title: isAr ? 'الشركة غير موجودة' : 'Company Not Found',
    };
  }

  const title = `${company.name} | ${isAr ? 'وسيط' : 'Wassitt'}`;
  const locationText = company.city 
    ? `${isAr ? company.city.nameAr || company.city.nameEn : company.city.nameEn}`
    : '';
  const description = company.description 
    ? company.description.slice(0, 160)
    : `${isAr ? 'احصل على خدمات وترخيص من' : 'Services and company profile for'} ${company.name} ${locationText ? `في ${locationText}` : ''}`;

  const canonicalUrl = `${CANONICAL_DOMAIN}/${locale}/companies/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ar: `${CANONICAL_DOMAIN}/ar/companies/${slug}`,
        en: `${CANONICAL_DOMAIN}/en/companies/${slug}`,
        'x-default': `${CANONICAL_DOMAIN}/ar/companies/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'profile',
      images: company.logo ? [{ url: company.logo }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: company.logo ? [company.logo] : undefined,
    },
  };
}

export default async function CompanyLayout({ children, params: { locale, slug } }: LayoutProps) {
  const isAr = locale === 'ar';
  const company = await prisma.company.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      description: true,
      logo: true,
      phone: true,
      email: true,
      website: true,
      address: true,
      rating: true,
      reviewCount: true,
      city: { select: { nameEn: true, nameAr: true } },
      country: { select: { nameEn: true, nameAr: true } },
    },
  });

  let schemas: Record<string, any>[] = [];

  if (company) {
    const cityName = isAr ? company.city?.nameAr || company.city?.nameEn : company.city?.nameEn;
    const countryName = isAr ? company.country?.nameAr || company.country?.nameEn : company.country?.nameEn;


    const localBusinessSchema = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: company.name,
      image: company.logo || `${CANONICAL_DOMAIN}/apple-touch-icon.png`,
      description: company.description || undefined,
      url: `${CANONICAL_DOMAIN}/${locale}/companies/${slug}`,
      telephone: company.phone || undefined,
      email: company.email || undefined,
      address: {
        '@type': 'PostalAddress',
        streetAddress: company.address || undefined,
        addressLocality: cityName || undefined,
        addressCountry: countryName || undefined,
      },
      aggregateRating: company.reviewCount > 0 ? {
        '@type': 'AggregateRating',
        ratingValue: company.rating,
        reviewCount: company.reviewCount,
      } : undefined,
    };

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: isAr ? 'الرئيسية' : 'Home',
          item: `${CANONICAL_DOMAIN}/${locale}`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: isAr ? 'الشركات' : 'Companies',
          item: `${CANONICAL_DOMAIN}/${locale}/companies`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: company.name,
          item: `${CANONICAL_DOMAIN}/${locale}/companies/${slug}`,
        },
      ],
    };

    schemas = [localBusinessSchema, breadcrumbSchema];
  }

  return (
    <>
      {schemas.length > 0 && <JsonLd data={schemas} />}
      {children}
    </>
  );
}
