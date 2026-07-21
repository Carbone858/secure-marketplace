import React from 'react';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { CANONICAL_DOMAIN } from '@/lib/config/site';
import { JsonLd } from '@/components/seo/JsonLd';

interface LayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export async function generateMetadata({ params: { locale } }: LayoutProps): Promise<Metadata> {
  const isAr = locale === 'ar';
  const t = await getTranslations({ locale, namespace: 'faq' });
  const title = `${t('title')} | ${isAr ? 'وسيط' : 'Wassitt'}`;
  const description = t('subtitle');
  const canonicalUrl = `${CANONICAL_DOMAIN}/${locale}/faq`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ar: `${CANONICAL_DOMAIN}/ar/faq`,
        en: `${CANONICAL_DOMAIN}/en/faq`,
        'x-default': `${CANONICAL_DOMAIN}/ar/faq`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

export default async function FaqLayout({ children, params: { locale } }: LayoutProps) {
  const t = await getTranslations({ locale, namespace: 'faq' });

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: t('questions.q1.question'),
        acceptedAnswer: {
          '@type': 'Answer',
          text: t('questions.q1.answer'),
        },
      },
      {
        '@type': 'Question',
        name: t('questions.q2.question'),
        acceptedAnswer: {
          '@type': 'Answer',
          text: t('questions.q2.answer'),
        },
      },
      {
        '@type': 'Question',
        name: t('questions.q5.question'),
        acceptedAnswer: {
          '@type': 'Answer',
          text: t('questions.q5.answer'),
        },
      },
      {
        '@type': 'Question',
        name: t('questions.q7.question'),
        acceptedAnswer: {
          '@type': 'Answer',
          text: t('questions.q7.answer'),
        },
      },
    ],
  };

  return (
    <>
      <JsonLd data={faqSchema} />
      {children}
    </>
  );
}
