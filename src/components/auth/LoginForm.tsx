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
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <Lock className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-800 mb-2">
            {t('locked.title')}
          </h2>
          <p className="text-red-700 mb-4">
            {t('locked.message', { minutes: lockInfo.remainingMinutes })}
          </p>
          <p className="text-sm text-red-600">
            {t('locked.help')}
          </p>
        </div>
      </div>
    );
  }

  // Show email verification needed message
  if (needsVerification) {
    return (
      <div
        className="w-full max-w-md mx-auto p-6"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
          <Mail className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-yellow-800 mb-2">
            {t('verify.title')}
          </h2>
          <p className="text-yellow-700 mb-4">
            {t('verify.message', { email: unverifiedEmail })}
          </p>
          <Link
            href={`/${locale}/auth/verify-email/resend?email=${encodeURIComponent(unverifiedEmail)}`}
            className="inline-block bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
          >
            {t('verify.resend')}
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
      {/* General error */}
      {errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{errors.general}</p>
        </div>
      )}

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
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={t('fields.email.placeholder')}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isLoading}
            autoComplete="email"
          />
        </div>
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>

      {/* Password field */}
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          {t('fields.password.label')} <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder={t('fields.password.placeholder')}
            className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isLoading}
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
      </div>

      {/* Remember me & Forgot password */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            disabled={isLoading}
          />
          <span className="text-sm text-gray-700">{t('fields.rememberMe.label')}</span>
        </label>
        <Link
          href={`/${locale}/auth/forgot-password`}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          {t('fields.forgotPassword.link')}
        </Link>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isLoading}
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

      {/* Register link */}
      <p className="text-center text-sm text-gray-600">
        {t('noAccount')}{' '}
        <Link
          href={`/${locale}/auth/register`}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          {t('registerLink')}
        </Link>
      </p>
    </form>
  );
}
