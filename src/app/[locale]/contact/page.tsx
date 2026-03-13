import { getTranslations } from 'next-intl/server';
import ContactPageContent from '@/components/contact/ContactPageContent';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
    const t = await getTranslations({ locale, namespace: 'contact' });
    return {
        title: t('meta.title'),
        description: t('meta.description'),
    };
}

export default function ContactPage() {
    return <ContactPageContent />;
}
