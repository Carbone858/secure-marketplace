import { getTranslations } from 'next-intl/server';

import { CANONICAL_DOMAIN } from '@/lib/config/site';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const isAr = locale === 'ar';
  const t = await getTranslations({ locale, namespace: 'terms' });
  const title = `${t('meta.title')} | ${isAr ? 'وسيط' : 'Wassitt'}`;
  const description = t('meta.description');
  const canonicalUrl = `${CANONICAL_DOMAIN}/${locale}/terms`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ar: `${CANONICAL_DOMAIN}/ar/terms`,
        en: `${CANONICAL_DOMAIN}/en/terms`,
        'x-default': `${CANONICAL_DOMAIN}/ar/terms`,
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


export default async function TermsPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'terms' });

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">{t('title')}</h1>
      <p className="text-muted-foreground mb-8">{t('lastUpdated')}</p>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">{t('sections.intro.title')}</h2>
          <p>{t('sections.intro.content')}</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">{t('sections.accounts.title')}</h2>
          <p>{t('sections.accounts.content')}</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">{t('sections.requests.title')}</h2>
          <p>{t('sections.requests.content')}</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">{t('sections.verification.title')}</h2>
          <p>{t('sections.verification.content')}</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">{t('sections.conduct.title')}</h2>
          <p>{t('sections.conduct.content')}</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">{t('sections.liability.title')}</h2>
          <p>{t('sections.liability.content')}</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">{t('sections.changes.title')}</h2>
          <p>{t('sections.changes.content')}</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">{t('sections.contact.title')}</h2>
          <p>{t('sections.contact.content')}</p>
        </section>
      </div>
    </div>
  );
}
