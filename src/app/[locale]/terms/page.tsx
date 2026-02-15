import { useTranslations } from 'next-intl';

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

                    <h2>1. Introduction</h2>
                    <p>
                        Welcome to Secure Service Marketplace. By using our website and services, you agree to these Terms of Service.
                        Please read them carefully.
                    </p>

                    <h2>2. User Accounts</h2>
                    <p>
                        To access certain features, you must create an account. You represent that the information you provide is accurate
                        and that you will keep your password secure.
                    </p>

                    <h2>3. Service Requests & Offers</h2>
                    <p>
                        Customers may post service requests, and Service Providers may submit offers. All transactions are solely between
                        the Customer and the Service Provider. We do not guarantee the quality or safety of services provided.
                    </p>

                    <h2>4. Verification</h2>
                    <p>
                        We verify companies to the best of our ability, but this does not constitute an endorsement. Users should always
                        exercise due diligence.
                    </p>

                    <h2>5. Prohibited Conduct</h2>
                    <p>
                        You agree not to use the platform for any illegal purpose, to harass others, or to post false or misleading information.
                    </p>

                    <h2>6. Limitation of Liability</h2>
                    <p>
                        Secure Service Marketplace is not liable for any damages arising from your use of the platform or any services
                        procured through it.
                    </p>

                    <h2>7. Changes to Terms</h2>
                    <p>
                        We may modify these terms at any time. Your continued use of the platform constitutes agreement to the updated terms.
                    </p>

                    <h2>8. Contact</h2>
                    <p>
                        If you have any questions about these Terms, please contact us.
                    </p>
                </div>
            </div>
        </div>
    );
}
