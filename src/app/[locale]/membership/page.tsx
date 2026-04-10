'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from '@/i18n/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Sparkles, Gift } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';

export default function MembershipPage() {
  const t = useTranslations('membership');
  const router = useRouter();
  const locale = useLocale();
  const { user } = useAuth();
  const isRTL = locale === 'ar';
  const isCompany = user?.role === 'COMPANY';

  return (
    <div
      className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-16"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative text-center max-w-2xl mx-auto">
        {/* Icon */}
        <div className="mx-auto mb-8 w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center ring-8 ring-green-50 dark:ring-green-900/20">
          <Gift className="w-12 h-12 text-green-600 dark:text-green-400" />
        </div>

        {/* Badge */}
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300 mb-6">
          <Sparkles className="w-4 h-4" />
          {t('badge')}
        </span>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
          {t('heading')}
        </h1>

        <p className="text-xl text-muted-foreground mb-3 font-medium">
          {t('subheading')}
        </p>

        <p className="text-muted-foreground mb-10">
          {t('description')}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isCompany ? (
            <Button size="lg" onClick={() => router.push('/requests')}>
              {t('browseRequests')}
            </Button>
          ) : (
            <Button size="lg" onClick={() => router.push('/requests/new')}>
              {t('postRequest')}
            </Button>
          )}
          <Button size="lg" variant="outline" onClick={() => router.push('/contact')}>
            {t('contactUs')}
          </Button>
        </div>
      </div>
    </div>
  );
}
