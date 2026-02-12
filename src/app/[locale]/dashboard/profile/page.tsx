import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getSession } from '@/lib/auth-session/session';
import { redirect } from 'next/navigation';
import { ProfileForm } from '@/components/auth/ProfileForm';
import { PasswordChangeForm } from '@/components/auth/PasswordChangeForm';
import { prisma } from '@/lib/db/client';

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

  // Fetch user profile directly from database (server component has session access)
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user!.id },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      avatar: true,
      emailVerified: true,
      createdAt: true,
    },
  });

  const user = dbUser || session.user;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <h1 className="text-3xl font-bold text-foreground mb-8">
        {t('title')}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Information */}
        <div className="bg-card rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-semibold mb-6">
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
        <div className="bg-card rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-semibold mb-6">
            {t('sections.password')}
          </h2>
          <PasswordChangeForm />
        </div>
      </div>
    </div>
  );
}
