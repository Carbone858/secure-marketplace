import { ReactNode } from 'react';
import { getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import Link from 'next/link';
import { Building2, Quote } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
  params: { locale: string };
}

export default async function AuthLayout({
  children,
  params: { locale },
}: AuthLayoutProps) {
  let messages;
  try {
    messages = await getMessages();
  } catch (error) {
    messages = {};
  }

  const isRTL = locale === 'ar';

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Branding Side (Desktop Only) */}
      <div className="hidden lg:flex flex-col justify-between bg-muted/30 border-r border-border p-10 relative overflow-hidden text-foreground">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-primary/5">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(var(--foreground)/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(var(--foreground)/0.05)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/10 opacity-40 blur-[100px]"></div>
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2 text-lg font-bold">
          <Building2 className="h-6 w-6 text-primary" />
          <span>{isRTL ? 'سوق الخدمات' : 'Service Marketplace'}</span>
        </div>

        {/* Quote/Content */}
        <div className="relative z-10 max-w-md">
          <Quote className="h-8 w-8 text-primary mb-4 opacity-50" />
          <blockquote className="text-2xl font-medium leading-relaxed italic text-foreground/90">
            {isRTL
              ? "المنصة الأكثر موثوقية للعثور على محترفين لجميع خدماتك المنزلية والتجارية."
              : "The most trusted platform to find professionals for all your home and business services."}
          </blockquote>
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-1 w-12 bg-primary rounded-full"></div>
            <span>{isRTL ? 'موثوق وآمن' : 'Trusted & Secure'}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-sm text-muted-foreground/80">
          <p>{isRTL ? '© 2024 جميع الحقوق محفوظة' : '© 2024 All rights reserved'}</p>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6 lg:p-8">
        <div className="w-full max-w-sm sm:max-w-md space-y-6">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center text-foreground font-bold text-xl">
            <Building2 className="h-6 w-6 text-primary" />
            <span>{isRTL ? 'سوق الخدمات' : 'Service Marketplace'}</span>
          </div>

          {/* Back Code / Navigation (Optional) */}
          <div className="absolute top-4 right-4 lg:top-8 lg:right-8">
            <Link
              href={`/${locale}`}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {isRTL ? '← العودة للرئيسية' : 'Back to Home'}
            </Link>
          </div>

          <NextIntlClientProvider messages={messages} locale={locale}>
            {children}
          </NextIntlClientProvider>

          {/* Terms Footer */}
          <p className="px-8 text-center text-sm text-muted-foreground mt-4">
            {isRTL ? 'باستمرارك فأنت توافق على ' : 'By clicking continue, you agree to our '}
            <Link href={`/${locale}/terms`} className="underline underline-offset-4 hover:text-primary">
              {isRTL ? 'شروط الخدمة' : 'Terms of Service'}
            </Link>
            {isRTL ? ' و ' : ' and '}
            <Link href={`/${locale}/privacy`} className="underline underline-offset-4 hover:text-primary">
              {isRTL ? 'سياسة الخصوصية' : 'Privacy Policy'}
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
