import { useTranslations } from 'next-intl';

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

                    <h2>1. Information We Collect</h2>
                    <p>
                        We collect personal information such as your name, email, phone number, and location when you register or use our services.
                        We may also collect documents for verification purposes.
                    </p>

                    <h2>2. How We Use Your Information</h2>
                    <p>
                        We use your data to:
                        <ul className="list-disc ml-6 mt-2">
                            <li>Facilitate connections between customers and service providers.</li>
                            <li>Verify accounts and enhance platform security.</li>
                            <li>Send notifications about your requests and offers.</li>
                            <li>Improve our services and user experience.</li>
                        </ul>
                    </p>

                    <h2>3. Data Sharing</h2>
                    <p>
                        We share necessary information (like service request details) with service providers so they can send offers.
                        We do not sell your personal data to third parties.
                    </p>

                    <h2>4. Cookies & Tracking</h2>
                    <p>
                        We use cookies to analyze site traffic and personalize your experience. You can control cookie preferences in your browser.
                    </p>

                    <h2>5. Security</h2>
                    <p>
                        We implement reasonable security measures to protect your data, but no method of transmission is 100% secure.
                    </p>

                    <h2>6. Your Rights</h2>
                    <p>
                        You have the right to access, update, or delete your personal information. Contact support for assistance.
                    </p>

                    <h2>7. Updates</h2>
                    <p>
                        We may update this policy periodically. We will notify you of significant changes.
                    </p>
                </div>
            </div>
        </div>
    );
}
