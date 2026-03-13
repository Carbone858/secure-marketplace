import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
    const t = await getTranslations({ locale, namespace: 'terms' });
    return {
        title: t('meta.title'),
        description: t('meta.description'),
    };
}

export default function TermsPage() {
    const t = useTranslations('terms');

    return (
        <div className="min-h-screen bg-background py-16 px-4">
            <div className="container mx-auto max-w-3xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
                    <p className="text-muted-foreground">{t('lastUpdated')}</p>
                </div>

                <div className="prose prose-lg dark:prose-invert max-w-none">
                    <p>{t('intro')}</p>

                    <h2>{t('sections.intro.title')}</h2>
                    <p>
                        {t('sections.intro.content')}
                    </p>

                    <h2>{t('sections.accounts.title')}</h2>
                    <p>
                        {t('sections.accounts.content')}
                    </p>

                    <h2>{t('sections.requests.title')}</h2>
                    <p>
                        {t('sections.requests.content')}
                    </p>

                    <h2>{t('sections.verification.title')}</h2>
                    <p>
                        {t('sections.verification.content')}
                    </p>

                    <h2>{t('sections.conduct.title')}</h2>
                    <p>
                        {t('sections.conduct.content')}
                    </p>

                    <h2>{t('sections.liability.title')}</h2>
                    <p>
                        {t('sections.liability.content')}
                    </p>

                    <h2>{t('sections.changes.title')}</h2>
                    <p>
                        {t('sections.changes.content')}
                    </p>

                    <h2>{t('sections.contact.title')}</h2>
                    <p>
                        {t('sections.contact.content')}
                    </p>
                </div>
            </div>
        </div>
    );
}
