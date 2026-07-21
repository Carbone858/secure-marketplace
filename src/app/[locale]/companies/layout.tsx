import React from 'react';
import type { Metadata } from 'next';
import { CANONICAL_DOMAIN } from '@/lib/config/site';
import { JsonLd } from '@/components/seo/JsonLd';

interface LayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export async function generateMetadata({ params: { locale } }: LayoutProps): Promise<Metadata> {
  const isAr = locale === 'ar';
  const title = `${isAr ? 'دليل الشركات ومزودي الخدمات الموثوقين' : 'Directory of Verified Companies & Service Providers'} | ${isAr ? 'وسيط' : 'Wassitt'}`;
  const description = isAr 
    ? 'تصفح قائمة الشركات ومزودي الخدمات الموثوقين في مختلف التخصصات بالعالم العربي.'
    : 'Browse verified companies and professional service providers across various industries in the Arab world.';
  const canonicalUrl = `${CANONICAL_DOMAIN}/${locale}/companies`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ar: `${CANONICAL_DOMAIN}/ar/companies`,
        en: `${CANONICAL_DOMAIN}/en/companies`,
        'x-default': `${CANONICAL_DOMAIN}/ar/companies`,
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

export default function CompaniesDirectoryLayout({ children, params: { locale } }: LayoutProps) {
  const isAr = locale === 'ar';
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
        name: isAr ? 'دليل الشركات' : 'Companies Directory',
        item: `${CANONICAL_DOMAIN}/${locale}/companies`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      {children}
    </>
  );
}
