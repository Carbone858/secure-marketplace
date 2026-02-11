import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { VerifyEmail } from '@/components/auth/VerifyEmail';
import { notFound } from 'next/navigation';

interface VerifyEmailPageProps {
  params: {
    locale: string;
    token: string;
  };
}

export async function generateMetadata({
  params: { locale },
}: VerifyEmailPageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'auth.verifyEmail' });

  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

export default function VerifyEmailPage({ params }: VerifyEmailPageProps) {
  const { token, locale } = params;

  // Validate token format (should be 64 hex characters)
  if (!token || !/^[a-f0-9]{64}$/i.test(token)) {
    notFound();
  }

  const isRTL = locale === 'ar';

  return (
    <div className="bg-card rounded-2xl shadow-xl p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {isRTL ? 'تأكيد البريد الإلكتروني' : 'Email Verification'}
        </h1>
        <p className="text-muted-foreground">
          {isRTL
            ? 'نحن نتحقق من بريدك الإلكتروني، يرجى الانتظار...'
            : 'We are verifying your email, please wait...'}
        </p>
      </div>

      {/* Verification Component */}
      <VerifyEmail token={token} />
    </div>
  );
}
