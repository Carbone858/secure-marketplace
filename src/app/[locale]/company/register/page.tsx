import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getSession } from '@/lib/auth-session/session';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db/client';
import { CompanyRegistrationWizard } from '@/components/company/CompanyRegistrationWizard';

interface CompanyRegisterPageProps {
  params: { locale: string };
}

export async function generateMetadata({
  params: { locale },
}: CompanyRegisterPageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'company.registration' });

  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

async function getCountries() {
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
      name: country.nameEn,
      code: country.code,
    }));
  } catch (error) {
    console.error('Failed to load countries:', error);
    return [];
  }
}

export default async function CompanyRegisterPage({ params: { locale } }: CompanyRegisterPageProps) {
  const session = await getSession();

  if (!session.isAuthenticated) {
    redirect(`/${locale}/auth/login?redirect=company/register`);
  }

  // Check if user already has a company
  const existingCompany = await prisma.company.findUnique({
    where: { userId: session.user!.id },
  });

  if (existingCompany) {
    redirect(`/${locale}/dashboard/company`);
  }

  const isRTL = locale === 'ar';
  const countries = await getCountries();

  return (
    <div className="min-h-screen bg-gray-50 py-12" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isRTL ? 'تسجيل شركة جديدة' : 'Register Your Company'}
          </h1>
          <p className="text-gray-600">
            {isRTL
              ? 'أضف شركتك إلى منصتنا وابدأ في تلقي طلبات الخدمة'
              : 'Add your company to our platform and start receiving service requests'}
          </p>
        </div>

        {/* Wizard */}
        <CompanyRegistrationWizard countries={countries} />
      </div>
    </div>
  );
}
