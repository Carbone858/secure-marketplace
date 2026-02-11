import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getSession } from '@/lib/auth-session/session';
import { redirect } from 'next/navigation';
import { ProfileForm } from '@/components/auth/ProfileForm';
import { PasswordChangeForm } from '@/components/auth/PasswordChangeForm';

interface ProfilePageProps {
  params: { locale: string };
}

export async function generateMetadata({
  params: { locale },
}: ProfilePageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'auth.profile' });

  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

export default async function ProfilePage({ params: { locale } }: ProfilePageProps) {
  const session = await getSession();

  if (!session.isAuthenticated) {
    redirect(`/${locale}/auth/login`);
  }

  const isRTL = locale === 'ar';
  const t = await getTranslations({ locale, namespace: 'auth.profile' });

  // Fetch user profile data
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/user/profile`, {
    headers: {
      Cookie: `access_token=${session.user?.id}`, // This is a workaround - in production use proper auth
    },
    cache: 'no-store',
  });

  let user = session.user;
  if (response.ok) {
    const data = await response.json();
    user = data.data.user;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {t('title')}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Information */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {t('sections.profileInfo')}
          </h2>
          <ProfileForm user={user as {
            id: string;
            email: string;
            name: string | null;
            phone: string | null;
            role: string;
            avatar: string | null;
            emailVerified: string | null;
            createdAt: string;
          }} />
        </div>

        {/* Password Change */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {t('sections.password')}
          </h2>
          <PasswordChangeForm />
        </div>
      </div>
    </div>
  );
}
