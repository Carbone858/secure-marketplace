'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';
import Link from 'next/link';

interface VerifyEmailProps {
  token: string;
}

// reCAPTCHA v3 hook
function useRecaptcha() {
  const executeRecaptcha = async (action: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !(window as unknown as { grecaptcha?: { ready: (cb: () => void) => void; execute: (key: string, options: { action: string }) => Promise<string> } }).grecaptcha) {
        reject(new Error('reCAPTCHA not loaded'));
        return;
      }

      const grecaptcha = (window as unknown as { grecaptcha: { ready: (cb: () => void) => void; execute: (key: string, options: { action: string }) => Promise<string> } }).grecaptcha;
      grecaptcha.ready(() => {
        const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';
        grecaptcha.execute(siteKey, { action })
          .then((token: string) => resolve(token))
          .catch((err: Error) => reject(err));
      });
    });
  };

  return { executeRecaptcha };
}

export function VerifyEmail({ token }: VerifyEmailProps) {
  const router = useRouter();
  const t = useTranslations('auth.verifyEmail');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const { executeRecaptcha } = useRecaptcha();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    verifyToken();
  }, [token]);

  useEffect(() => {
    if (status === 'success' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (status === 'success' && countdown === 0) {
      router.push(`/${locale}/auth/login`);
    }
  }, [status, countdown, router, locale]);

  const verifyToken = async () => {
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage(data.message || t('errors.invalid'));
      }
    } catch (error) {
      console.error('Verification error:', error);
      setStatus('error');
      setErrorMessage(t('errors.general'));
    }
  };

  if (status === 'loading') {
    return (
      <div
        className="w-full max-w-md mx-auto p-6 text-center"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="bg-primary/10 border border-primary/30 rounded-lg p-8">
          <Loader2 className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
          <h2 className="text-xl font-semibold text-primary mb-2">
            {t('loading.title')}
          </h2>
          <p className="text-primary">{t('loading.message')}</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div
        className="w-full max-w-md mx-auto p-6"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="bg-success/10 border border-success/30 rounded-lg p-8 text-center">
          <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-success mb-2">
            {t('success.title')}
          </h2>
          <p className="text-success mb-4">{t('success.message')}</p>
          <p className="text-sm text-success mb-6">
            {t('success.redirect', { seconds: countdown })}
          </p>
          <Link
            href={`/${locale}/auth/login`}
            className="inline-block bg-success text-white px-6 py-2 rounded-lg hover:bg-success/90 transition-colors"
          >
            {t('success.loginNow')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full max-w-md mx-auto p-6"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-8 text-center">
        <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-destructive mb-2">
          {t('error.title')}
        </h2>
        <p className="text-destructive mb-6">{errorMessage}</p>
        
        <ResendVerificationForm />
        
        <div className="mt-6 pt-6 border-t border-destructive/30">
          <Link
            href={`/${locale}/auth/login`}
            className="text-destructive hover:text-destructive font-medium"
          >
            {t('error.goToLogin')}
          </Link>
        </div>
      </div>
    </div>
  );
}

function ResendVerificationForm() {
  const t = useTranslations('auth.verifyEmail.resend');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const { executeRecaptcha } = useRecaptcha();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Execute reCAPTCHA
      let recaptchaToken = '';
      try {
        recaptchaToken = await executeRecaptcha('resend_verification');
      } catch (error) {
        console.warn('reCAPTCHA failed, continuing without:', error);
        if (process.env.NODE_ENV === 'production') {
          setError(t('errors.recaptcha'));
          setIsLoading(false);
          return;
        }
      }

      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, recaptchaToken }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSent(true);
      } else {
        setError(data.message || t('errors.failed'));
      }
    } catch (error) {
      console.error('Resend error:', error);
      setError(t('errors.general'));
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Mail className="w-6 h-6 text-primary" />
          <div>
            <p className="text-primary font-medium">{t('success.title')}</p>
            <p className="text-primary text-sm">{t('success.message')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-destructive text-sm">{t('description')}</p>
      
      {error && (
        <p className="text-destructive text-sm">{error}</p>
      )}
      
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('placeholder')}
          className="flex-1 px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring"
          required
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !email}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            t('button')
          )}
        </button>
      </div>
    </form>
  );
}
