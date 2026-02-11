'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Loader2, AlertCircle, CheckCircle, Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

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

export function ForgotPasswordForm() {
  const t = useTranslations('auth.forgotPassword');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const { executeRecaptcha } = useRecaptcha();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Execute reCAPTCHA
      let recaptchaToken = '';
      try {
        recaptchaToken = await executeRecaptcha('forgot_password');
      } catch (error) {
        console.warn('reCAPTCHA failed, continuing without:', error);
        if (process.env.NODE_ENV === 'production') {
          setError(t('errors.recaptcha'));
          setIsLoading(false);
          return;
        }
      }

      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, recaptchaToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || t('errors.general'));
        return;
      }

      setIsSuccess(true);
    } catch (error) {
      console.error('Forgot password error:', error);
      setError(t('errors.general'));
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div
        className="w-full max-w-md mx-auto p-6"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-800 mb-2">
            {t('success.title')}
          </h2>
          <p className="text-green-700 mb-6">
            {t('success.message', { email })}
          </p>
          <Link
            href={`/${locale}/auth/login`}
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-800 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('success.backToLogin')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto space-y-6"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Description */}
      <p className="text-gray-600 text-center">
        {t('description')}
      </p>

      {/* Email field */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          {t('fields.email.label')} <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('fields.email.placeholder')}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            disabled={isLoading}
            required
            autoComplete="email"
          />
        </div>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isLoading || !email}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {t('submit.loading')}
          </>
        ) : (
          t('submit.button')
        )}
      </button>

      {/* Back to login link */}
      <p className="text-center text-sm text-gray-600">
        <Link
          href={`/${locale}/auth/login`}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('backToLogin')}
        </Link>
      </p>
    </form>
  );
}
