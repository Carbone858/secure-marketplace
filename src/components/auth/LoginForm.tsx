'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle, Lock, Mail } from 'lucide-react';
import Link from 'next/link';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export function LoginForm() {
  const router = useRouter();
  const t = useTranslations('auth.login');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [lockInfo, setLockInfo] = useState<{ remainingMinutes: number } | null>(null);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const [resendStatus, setResendStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = t('errors.email.required');
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      newErrors.email = t('errors.email.invalid');
    }

    if (!formData.password) {
      newErrors.password = t('errors.password.required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});
    setIsLocked(false);
    setNeedsVerification(false);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': locale,
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          rememberMe: formData.rememberMe,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error cases
        if (data.error === 'account.locked') {
          setIsLocked(true);
          setLockInfo(data.data);
        } else if (data.error === 'email.notVerified') {
          setNeedsVerification(true);
          setUnverifiedEmail(data.data?.email || formData.email);
        } else {
          setErrors({ general: data.message || t('errors.invalid') });
        }
        return;
      }

      // Login successful - redirect to dashboard
      router.push(`/${locale}/dashboard`);
      router.refresh();
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: t('errors.general') });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Show account locked message
  if (isLocked && lockInfo) {
    return (
      <div
        className="w-full max-w-md mx-auto p-6"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-8 text-center">
          <Lock className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-destructive mb-2">
            {t('locked.title')}
          </h2>
          <p className="text-destructive mb-4">
            {t('locked.message', { minutes: lockInfo.remainingMinutes })}
          </p>
          <p className="text-sm text-destructive">
            {t('locked.help')}
          </p>
        </div>
      </div>
    );
  }

  // Handle resend verification email
  const handleResendVerification = async () => {
    setResendStatus('loading');
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': locale,
        },
        body: JSON.stringify({
          email: unverifiedEmail,
          recaptchaToken: '',
        }),
      });

      if (response.ok) {
        setResendStatus('sent');
      } else {
        setResendStatus('error');
      }
    } catch {
      setResendStatus('error');
    }
  };

  // Show email verification needed message
  if (needsVerification) {
    return (
      <div
        className="w-full max-w-md mx-auto p-6"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="bg-warning/10 border border-warning/30 rounded-lg p-8 text-center">
          <Mail className="w-16 h-16 text-warning mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-warning mb-2">
            {t('verify.title')}
          </h2>
          <p className="text-warning mb-4">
            {t('verify.message', { email: unverifiedEmail })}
          </p>

          {resendStatus === 'sent' ? (
            <div className="flex items-center justify-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span>{isRTL ? 'تم إرسال رابط التحقق!' : 'Verification email sent!'}</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleResendVerification}
              disabled={resendStatus === 'loading'}
              className="inline-block bg-warning text-white px-6 py-2 rounded-lg hover:bg-warning/90 transition-colors disabled:opacity-50"
            >
              {resendStatus === 'loading' ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isRTL ? 'جاري الإرسال...' : 'Sending...'}
                </span>
              ) : resendStatus === 'error' ? (
                isRTL ? 'حدث خطأ، حاول مجدداً' : 'Error, try again'
              ) : (
                t('verify.resend')
              )}
            </button>
          )}

          <div className="mt-4">
            <button
              type="button"
              onClick={() => { setNeedsVerification(false); setResendStatus('idle'); }}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {isRTL ? '← العودة لتسجيل الدخول' : '← Back to login'}
            </button>
          </div>
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
      {/* General error */}
      {errors.general && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-destructive text-sm">{errors.general}</p>
        </div>
      )}

      {/* Email field */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-foreground">
          {t('fields.email.label')} <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/60" />
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={t('fields.email.placeholder')}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring transition-colors ${
              errors.email ? 'border-destructive' : 'border-input'
            }`}
            disabled={isLoading}
            autoComplete="email"
          />
        </div>
        {errors.email && <p className="text-destructive text-sm">{errors.email}</p>}
      </div>

      {/* Password field */}
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-foreground">
          {t('fields.password.label')} <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/60" />
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder={t('fields.password.placeholder')}
            className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring transition-colors ${
              errors.password ? 'border-destructive' : 'border-input'
            }`}
            disabled={isLoading}
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 px-3 flex items-center text-muted-foreground hover:text-foreground"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.password && <p className="text-destructive text-sm">{errors.password}</p>}
      </div>

      {/* Remember me & Forgot password */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
            className="w-4 h-4 text-primary border-input rounded focus:ring-ring"
            disabled={isLoading}
          />
          <span className="text-sm text-foreground">{t('fields.rememberMe.label')}</span>
        </label>
        <Link
          href={`/${locale}/auth/forgot-password`}
          className="text-sm text-primary hover:text-primary font-medium"
        >
          {t('fields.forgotPassword.link')}
        </Link>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary/90 focus:ring-4 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
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

      {/* Register link */}
      <p className="text-center text-sm text-muted-foreground">
        {t('noAccount')}{' '}
        <Link
          href={`/${locale}/auth/register`}
          className="text-primary hover:text-primary font-medium"
        >
          {t('registerLink')}
        </Link>
      </p>
    </form>
  );
}
