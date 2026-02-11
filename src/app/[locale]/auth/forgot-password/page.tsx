import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

interface ForgotPasswordPageProps {
  params: { locale: string };
}

export async function generateMetadata({
  params: { locale },
}: ForgotPasswordPageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'auth.forgotPassword' });

  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

export default function ForgotPasswordPage({ params: { locale } }: ForgotPasswordPageProps) {
  const isRTL = locale === 'ar';

  return (
    <div className="bg-card rounded-2xl shadow-xl p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {isRTL ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
        </h1>
        <p className="text-muted-foreground">
          {isRTL
            ? 'لا تقلق، سنساعدك في استعادة حسابك'
            : "Don't worry, we'll help you recover your account"}
        </p>
      </div>

      {/* Forgot Password Form */}
      <ForgotPasswordForm />
    </div>
  );
}
