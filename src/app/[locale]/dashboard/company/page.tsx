import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getSession } from '@/lib/auth-session/session';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db/client';
import Link from 'next/link';
import { Building2, FileText, Star, TrendingUp, Edit, Upload, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface CompanyDashboardPageProps {
  params: { locale: string };
}

export async function generateMetadata({
  params: { locale },
}: CompanyDashboardPageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'company.dashboard' });

  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

export default async function CompanyDashboardPage({ params: { locale } }: CompanyDashboardPageProps) {
  const session = await getSession();

  if (!session.isAuthenticated) {
    redirect(`/${locale}/auth/login`);
  }

  // Get user's company
  const company = await prisma.company.findUnique({
    where: { userId: session.user!.id },
    include: {
      documents: {
        orderBy: { uploadedAt: 'desc' },
      },
      services: {
        where: { isActive: true },
      },
      _count: {
        select: {
          services: true,
        },
      },
    },
  });

  // If no company, redirect to registration
  if (!company) {
    redirect(`/${locale}/company/register`);
  }

  const isRTL = locale === 'ar';

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-success/10 text-success rounded-full text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            {isRTL ? 'موثق' : 'Verified'}
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-warning/10 text-warning rounded-full text-sm font-medium">
            <Clock className="w-4 h-4" />
            {isRTL ? 'قيد المراجعة' : 'Under Review'}
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-destructive/10 text-destructive rounded-full text-sm font-medium">
            <AlertCircle className="w-4 h-4" />
            {isRTL ? 'مرفوض' : 'Rejected'}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm font-medium">
            <Clock className="w-4 h-4" />
            {isRTL ? 'معلق' : 'Pending'}
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isRTL ? 'لوحة تحكم الشركة' : 'Company Dashboard'}
          </h1>
          <p className="text-muted-foreground mt-1">{company.name}</p>
        </div>
        <div className="flex items-center gap-4">
          {getStatusBadge(company.verificationStatus)}
          <Link
            href={`/${locale}/company/${company.slug}`}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            {isRTL ? 'عرض الملف' : 'View Profile'}
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-card rounded-xl shadow p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-primary" />
            </div>
            <span className="text-muted-foreground">{isRTL ? 'التقييم' : 'Rating'}</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {company.rating.toFixed(1)} / 5.0
          </div>
        </div>
        <div className="bg-card rounded-xl shadow p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <span className="text-muted-foreground">{isRTL ? 'المراجعات' : 'Reviews'}</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{company.reviewCount}</div>
        </div>
        <div className="bg-card rounded-xl shadow p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-accent" />
            </div>
            <span className="text-muted-foreground">{isRTL ? 'الخدمات' : 'Services'}</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{company._count.services}</div>
        </div>
        <div className="bg-card rounded-xl shadow p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-warning" />
            </div>
            <span className="text-muted-foreground">{isRTL ? 'المستندات' : 'Documents'}</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{company.documents.length}</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-card rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            {isRTL ? 'إدارة الشركة' : 'Company Management'}
          </h2>
          <div className="space-y-3">
            <Link
              href={`/${locale}/dashboard/company/edit`}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Edit className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">{isRTL ? 'تعديل المعلومات' : 'Edit Information'}</p>
                <p className="text-sm text-muted-foreground">{isRTL ? 'تحديث تفاصيل شركتك' : 'Update your company details'}</p>
              </div>
            </Link>
            <Link
              href={`/${locale}/company/${company.id}/documents`}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors"
            >
              <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                <Upload className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="font-medium text-foreground">{isRTL ? 'رفع المستندات' : 'Upload Documents'}</p>
                <p className="text-sm text-muted-foreground">{isRTL ? 'رفع مستندات التحقق' : 'Upload verification documents'}</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Verification Status */}
        <div className="bg-card rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            {isRTL ? 'حالة التحقق' : 'Verification Status'}
          </h2>
          {company.verificationStatus === 'PENDING' && (
            <div className="bg-warning/10 border border-warning/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-warning font-medium">{isRTL ? 'التحقق معلق' : 'Verification Pending'}</p>
                  <p className="text-sm text-warning mt-1">
                    {isRTL
                      ? 'يرجى رفع مستندات التحقق لإكمال عملية التسجيل'
                      : 'Please upload verification documents to complete registration'}
                  </p>
                </div>
              </div>
            </div>
          )}
          {company.verificationStatus === 'UNDER_REVIEW' && (
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-primary font-medium">{isRTL ? 'قيد المراجعة' : 'Under Review'}</p>
                  <p className="text-sm text-primary mt-1">
                    {isRTL
                      ? 'مستنداتك قيد المراجعة. سنتواصل معك قريباً'
                      : 'Your documents are being reviewed. We will contact you soon'}
                  </p>
                </div>
              </div>
            </div>
          )}
          {company.verificationStatus === 'VERIFIED' && (
            <div className="bg-success/10 border border-success/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-success font-medium">{isRTL ? 'تم التحقق' : 'Verified'}</p>
                  <p className="text-sm text-success mt-1">
                    {isRTL
                      ? 'تهانينا! شركتك موثقة ويمكنك الآن تلقي الطلبات'
                      : 'Congratulations! Your company is verified and can now receive requests'}
                  </p>
                </div>
              </div>
            </div>
          )}
          {company.verificationStatus === 'REJECTED' && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-destructive font-medium">{isRTL ? 'تم الرفض' : 'Rejected'}</p>
                  <p className="text-sm text-destructive mt-1">
                    {isRTL
                      ? 'تم رفض طلب التحقق. يرجى مراجعة المستندات والمحاولة مرة أخرى'
                      : 'Verification request was rejected. Please review documents and try again'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
