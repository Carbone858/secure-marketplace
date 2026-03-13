'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Clock, ArrowLeft } from 'lucide-react';

interface ComingSoonProps {
  pageName: string;
}

export function ComingSoon({ pageName }: ComingSoonProps) {
  const t = useTranslations('coming_soon');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  return (
    <div
      className="min-h-screen bg-background flex flex-col items-center justify-center px-4"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Decorative background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl" />
      </div>

      <div className="relative text-center max-w-lg">
        {/* Animated icon */}
        <div className="mx-auto mb-8 w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center ring-8 ring-primary/5">
          <Clock className="w-12 h-12 text-primary animate-pulse" />
        </div>

        {/* Badge */}
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold bg-primary/10 text-primary mb-6">
          {t('badge')}
        </span>

        {/* Page name */}
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
          {pageName}
        </h1>

        {/* Message */}
        <p className="text-lg text-muted-foreground mb-2 font-semibold">
          {t('heading')}
        </p>
        <p className="text-muted-foreground mb-10">
          {t('description')}
        </p>

        {/* Back home */}
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('backHome')}
        </Link>
      </div>
    </div>
  );
}
