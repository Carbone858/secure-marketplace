import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getSession } from '@/lib/auth-session/session';
import { prisma } from '@/lib/db/client';
import { redirect } from 'next/navigation';
import { RequestFormSPA } from '@/components/requests/RequestFormSPA';

interface EditRequestPageProps {
    params: { locale: string; id: string };
}

export async function generateMetadata({
    params: { locale, id },
}: EditRequestPageProps): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: 'requests' });
    const request = await prisma.serviceRequest.findUnique({
        where: { id },
        select: { title: true },
    });

    return {
        title: request ? `${t('edit.title')}: ${request.title}` : 'Edit Request',
    };
}

async function getCategories() {
    return prisma.category.findMany({
        where: { isActive: true, parentId: null },
        select: { id: true, nameEn: true, nameAr: true, icon: true },
        orderBy: { sortOrder: 'asc' },
    });
}

async function getCountries() {
    return prisma.country.findMany({
        select: { id: true, nameEn: true, nameAr: true, code: true },
        orderBy: { nameEn: 'asc' },
    });
}

export default async function EditRequestPage({ params: { locale, id } }: EditRequestPageProps) {
    const session = await getSession();
    const isRTL = locale === 'ar';
    const t = await getTranslations({ locale, namespace: 'requests' });

    if (!session.isAuthenticated || !session.user) {
        redirect(`/${locale}/auth/login?redirect=${encodeURIComponent(`/${locale}/requests/${id}/edit`)}`);
    }

    const request = await prisma.serviceRequest.findUnique({
        where: { id, isActive: true },
    });

    if (!request) {
        redirect(`/${locale}/requests`);
    }

    // Check ownership
    if (request.userId !== session.user.id && session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
        redirect(`/${locale}/requests/${id}`);
    }

    // Check if editable
    if (!['DRAFT', 'PENDING', 'ACTIVE'].includes(request.status)) {
        redirect(`/${locale}/requests/${id}`);
    }

    const [categories, countries] = await Promise.all([getCategories(), getCountries()]);

    return (
        <div className="min-h-screen bg-muted/50 py-8 sm:py-12" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="max-w-3xl mx-auto px-4">
                <RequestFormSPA
                    categories={categories}
                    countries={countries}
                    initialData={request}
                    requestId={id}
                    mode="authenticated"
                >
                    <div className="mb-6">
                        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">{t('edit.title')}</h1>
                    </div>
                </RequestFormSPA>
            </div>
        </div>
    );
}
