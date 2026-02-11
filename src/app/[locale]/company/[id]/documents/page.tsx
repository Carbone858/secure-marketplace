import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getSession } from '@/lib/auth-session/session';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db/client';
import { DocumentUpload } from '@/components/company/DocumentUpload';
import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';

interface CompanyDocumentsPageProps {
  params: { locale: string; id: string };
}

export async function generateMetadata({
  params: { locale },
}: CompanyDocumentsPageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'company.documents' });

  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

export default async function CompanyDocumentsPage({ params: { locale, id } }: CompanyDocumentsPageProps) {
  const session = await getSession();

  if (!session.isAuthenticated) {
    redirect(`/${locale}/auth/login`);
  }

  // Find company
  const company = await prisma.company.findFirst({
    where: {
      OR: [{ slug: id }, { id }],
    },
    include: {
      documents: {
        orderBy: { uploadedAt: 'desc' },
      },
    },
  });

  if (!company) {
    redirect(`/${locale}/dashboard`);
  }

  // Check ownership
  if (company.userId !== session.user?.id && session.user?.role !== 'ADMIN' && session.user?.role !== 'SUPER_ADMIN') {
    redirect(`/${locale}/dashboard`);
  }

  const isRTL = locale === 'ar';

  return (
    <div className="min-h-screen bg-gray-50 py-12" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isRTL ? 'تم التسجيل بنجاح!' : 'Registration Successful!'}
          </h1>
          <p className="text-gray-600">
            {isRTL
              ? 'الآن، يرجى رفع المستندات المطلوبة للتحقق من شركتك'
              : 'Now, please upload the required documents to verify your company'}
          </p>
        </div>

        {/* Document Upload */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <DocumentUpload
            companyId={company.id}
            existingDocuments={company.documents.map((d) => ({
              id: d.id,
              type: d.type,
              fileName: d.fileName,
              status: d.status,
              uploadedAt: d.uploadedAt.toISOString(),
            }))}
          />
        </div>

        {/* Skip/Continue */}
        <div className="flex justify-center">
          <Link
            href={`/${locale}/dashboard/company`}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            {isRTL ? 'الذهاب إلى لوحة تحكم الشركة' : 'Go to Company Dashboard'}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
