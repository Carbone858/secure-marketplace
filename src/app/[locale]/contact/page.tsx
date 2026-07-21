import { getTranslations } from 'next-intl/server';
import ContactPageContent from '@/components/contact/ContactPageContent';

import { CANONICAL_DOMAIN } from '@/lib/config/site';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
    const isAr = locale === 'ar';
    const t = await getTranslations({ locale, namespace: 'contact' });
    const title = `${t('meta.title')} | ${isAr ? 'وسيط' : 'Wassitt'}`;
    const description = t('meta.description');
    const canonicalUrl = `${CANONICAL_DOMAIN}/${locale}/contact`;

    return {
        title,
        description,
        alternates: {
            canonical: canonicalUrl,
            languages: {
                ar: `${CANONICAL_DOMAIN}/ar/contact`,
                en: `${CANONICAL_DOMAIN}/en/contact`,
                'x-default': `${CANONICAL_DOMAIN}/ar/contact`,
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


export default function ContactPage() {
    return <ContactPageContent />;
}
