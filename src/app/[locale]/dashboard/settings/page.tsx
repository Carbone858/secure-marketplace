import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getSession } from '@/lib/auth-session/session';
import { redirect } from 'next/navigation';
import { NotificationSettingsForm } from '@/components/auth/NotificationSettingsForm';
import { DeleteAccountForm } from '@/components/auth/DeleteAccountForm';

interface SettingsPageProps {
  params: { locale: string };
}

export async function generateMetadata({
  params: { locale },
}: SettingsPageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'auth.profile' });

  return {
    title: t('settings.meta.title'),
    description: t('settings.meta.description'),
  };
}

export default async function SettingsPage({ params: { locale } }: SettingsPageProps) {
  const session = await getSession();

  if (!session.isAuthenticated) {
    redirect(`/${locale}/auth/login`);
  }

  const isRTL = locale === 'ar';
  const t = await getTranslations({ locale, namespace: 'auth.profile' });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {t('settings.title')}
      </h1>

      <div className="space-y-8">
        {/* Notification Settings */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {t('settings.sections.notifications')}
          </h2>
          <NotificationSettingsForm />
        </div>

        {/* Delete Account */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-red-100">
          <h2 className="text-xl font-semibold text-red-800 mb-6">
            {t('settings.sections.deleteAccount')}
          </h2>
          <DeleteAccountForm />
        </div>
      </div>
    </div>
  );
}
