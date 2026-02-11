import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { RegisterForm } from '@/components/auth/RegisterForm';

interface RegisterPageProps {
  params: { locale: string };
}

export async function generateMetadata({
  params: { locale },
}: RegisterPageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'auth.register' });

  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

export default function RegisterPage({ params: { locale } }: RegisterPageProps) {
  const isRTL = locale === 'ar';

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isRTL ? 'إنشاء حساب جديد' : 'Create Your Account'}
        </h1>
        <p className="text-gray-600">
          {isRTL
            ? 'انضم إلى سوق الخدمات واحصل على عروض أسعار من أفضل الشركات'
            : 'Join Service Marketplace and get quotes from top companies'}
        </p>
      </div>

      {/* Registration Form */}
      <RegisterForm />

      {/* Trust badges */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <span>{isRTL ? 'آمن 100%' : '100% Secure'}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span>{isRTL ? 'مشفّر' : 'Encrypted'}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>{isRTL ? 'مجاني' : 'Free'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
