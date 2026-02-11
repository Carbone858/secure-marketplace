import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import { notFound } from 'next/navigation';

interface ResetPasswordPageProps {
  params: {
    locale: string;
    token: string;
  };
}

export async function generateMetadata({
  params: { locale },
}: ResetPasswordPageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'auth.resetPassword' });

  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

export default function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  const { token, locale } = params;

  // Validate token format (should be 128 hex characters for 64 bytes)
  if (!token || !/^[a-f0-9]{128}$/i.test(token)) {
    notFound();
  }

  const isRTL = locale === 'ar';

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isRTL ? 'إعادة تعيين كلمة المرور' : 'Reset Password'}
        </h1>
        <p className="text-gray-600">
          {isRTL
            ? 'أدخل كلمة مرور جديدة لحسابك'
            : 'Enter a new password for your account'}
        </p>
      </div>

      {/* Reset Password Form */}
      <ResetPasswordForm token={token} />
    </div>
  );
}
