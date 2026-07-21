import React from 'react';
import type { Metadata } from 'next';
import { categories } from '@/lib/services-data';
import { CANONICAL_DOMAIN } from '@/lib/config/site';
import { JsonLd } from '@/components/seo/JsonLd';

interface LayoutProps {
  children: React.ReactNode;
  params: { locale: string; category: string };
}

export async function generateMetadata({ params: { locale, category: categoryId } }: LayoutProps): Promise<Metadata> {
  const isAr = locale === 'ar';
  const category = categories.find((c) => c.id === categoryId);

  if (!category) {
    return {
      title: isAr ? 'التصنيف غير موجود' : 'Category Not Found',
    };
  }

  const catName = isAr ? category.label.ar : category.label.en;
  const catDesc = isAr ? category.description.ar : category.description.en;
  const title = `${catName} | ${isAr ? 'وسيط' : 'Wassitt'}`;
  const description = `${catDesc} - ${isAr ? 'تصفح أفضل الشركات والخدمات في' : 'Find top-rated companies and service providers in'} ${catName}`;
  const canonicalUrl = `${CANONICAL_DOMAIN}/${locale}/services/${categoryId}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ar: `${CANONICAL_DOMAIN}/ar/services/${categoryId}`,
        en: `${CANONICAL_DOMAIN}/en/services/${categoryId}`,
        'x-default': `${CANONICAL_DOMAIN}/ar/services/${categoryId}`,
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

export default function CategoryLayout({ children, params: { locale, category: categoryId } }: LayoutProps) {
  const isAr = locale === 'ar';
  const category = categories.find((c) => c.id === categoryId);

  let breadcrumbSchema = null;
  if (category) {
    const catName = isAr ? category.label.ar : category.label.en;
    breadcrumbSchema = {
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
          name: isAr ? 'الخدمات والتصنيفات' : 'Services & Categories',
          item: `${CANONICAL_DOMAIN}/${locale}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: catName,
          item: `${CANONICAL_DOMAIN}/${locale}/services/${categoryId}`,
        },
      ],
    };
  }

  return (
    <>
      {breadcrumbSchema && <JsonLd data={breadcrumbSchema} />}
      {children}
    </>
  );
}
