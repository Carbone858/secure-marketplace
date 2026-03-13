import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
    const t = await getTranslations({ locale, namespace: 'privacy' });
    return {
        title: t('meta.title'),
        description: t('meta.description'),
    };
}

export default function PrivacyPage() {
    const t = useTranslations('privacy');

    return (
        <div className="min-h-screen bg-background py-16 px-4">
            <div className="container mx-auto max-w-3xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
                    <p className="text-muted-foreground">{t('lastUpdated')}</p>
                </div>

                <div className="prose prose-lg dark:prose-invert max-w-none">
                    <p>{t('intro')}</p>

                    <h2>{t('sections.collection.title')}</h2>
                    <p>
                        {t('sections.collection.content')}
                    </p>

                    <h2>{t('sections.usage.title')}</h2>
                    <p>
                        {t('sections.usage.content')}
                        <ul className="list-disc ml-6 mt-2">
                            {(t.raw('sections.usage.points') as string[]).map((point, index) => (
                                <li key={index}>{point}</li>
                            ))}
                        </ul>
                    </p>

                    <h2>{t('sections.sharing.title')}</h2>
                    <p>
                        {t('sections.sharing.content')}
                    </p>

                    <h2>{t('sections.cookies.title')}</h2>
                    <p>
                        {t('sections.cookies.content')}
                    </p>

                    <h2>{t('sections.security.title')}</h2>
                    <p>
                        {t('sections.security.content')}
                    </p>

                    <h2>{t('sections.rights.title')}</h2>
                    <p>
                        {t('sections.rights.content')}
                    </p>

                    <h2>{t('sections.updates.title')}</h2>
                    <p>
                        {t('sections.updates.content')}
                    </p>
                </div>
            </div>
        </div>
    );
}
