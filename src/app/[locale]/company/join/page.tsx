import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/db/client';
import { CompanyJoinForm } from '@/components/company/CompanyJoinForm';
import { getSession } from '@/lib/auth-session/session';
import { redirect } from 'next/navigation';

interface CompanyJoinPageProps {
    params: { locale: string };
}

export async function generateMetadata({
    params: { locale },
}: CompanyJoinPageProps): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: 'company.registration' });

    return {
        title: locale === 'ar' ? 'انضم كشريك - سوق الخدمات' : 'Join as Partner - Service Marketplace',
        description: t('meta.description'),
    };
}

async function getCountries(locale: string) {
    try {
        const countries = await prisma.country.findMany({
            select: {
                id: true,
                nameEn: true,
                nameAr: true,
                code: true,
            },
            orderBy: {
                nameEn: 'asc',
            },
        });

        return countries.map((country) => ({
            id: country.id,
            name: locale === 'ar' ? country.nameAr : country.nameEn,
            code: country.code,
        }));
    } catch (error) {
        console.error('Failed to load countries:', error);
        return [];
    }
}

export default async function CompanyJoinPage({ params: { locale } }: CompanyJoinPageProps) {
    const session = await getSession();

    // If already logged in:
    if (session.isAuthenticated) {
        const user = await prisma.user.findUnique({
            where: { id: session.user!.id },
            include: { company: true }
        });

        // If has company, go to dashboard
        if (user?.company) {
            redirect(`/${locale}/company/dashboard`);
        }

        // If user but no company, go to wizard
        redirect(`/${locale}/company/register`);
    }

    const countries = await getCountries(locale);
    const isRTL = locale === 'ar';

    const tJoin = await getTranslations({ locale, namespace: 'company.join' });

    return (
        <div className="min-h-screen bg-muted/30 py-12" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="container max-w-5xl mx-auto px-4">
                <div className="text-center mb-10 max-w-2xl mx-auto">
                    <h1 className="text-4xl font-bold text-foreground mb-4">
                        {tJoin('title')}
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        {tJoin('subtitle')}
                    </p>
                </div>

                <CompanyJoinForm countries={countries} />
            </div>
        </div>
    );
}
