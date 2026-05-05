import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'privacy' });
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

export default async function PrivacyPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'privacy' });

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">{t('title')}</h1>
      <p className="text-muted-foreground mb-8">{t('lastUpdated')}</p>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">{t('sections.collection.title')}</h2>
          <p>{t('sections.collection.content')}</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">{t('sections.usage.title')}</h2>
          <p>{t('sections.usage.content')}</p>
          <ul className="list-disc pl-6 space-y-2">
            {(t.raw('sections.usage.points') as string[]).map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">{t('sections.sharing.title')}</h2>
          <p>{t('sections.sharing.content')}</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">{t('sections.security.title')}</h2>
          <p>{t('sections.security.content')}</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">{t('sections.rights.title')}</h2>
          <p>{t('sections.rights.content')}</p>
        </section>
      </div>
    </div>
  );
}
