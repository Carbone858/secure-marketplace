import { useTranslations } from 'next-intl';
import ContactPageContent from '@/components/contact/ContactPageContent';

export const metadata = {
    title: 'Contact Us | Service Marketplace',
    description: 'Get in touch with our team for support, questions, or feedback.',
};

export default function ContactPage() {
    return <ContactPageContent />;
}
