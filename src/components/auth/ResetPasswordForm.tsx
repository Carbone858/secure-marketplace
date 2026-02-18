'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle, Lock, ArrowLeft } from 'lucide-react';
import { PasswordStrength } from './PasswordStrength';
import Link from 'next/link';

interface ResetPasswordFormProps {
  token: string;
}

interface FormErrors {
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const t = useTranslations('auth.resetPassword');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!password) {
      newErrors.password = t('errors.password.required');
    } else {
      if (password.length < 12) {
        newErrors.password = t('errors.password.minLength');
      } else if (!/[A-Z]/.test(password)) {
        newErrors.password = t('errors.password.uppercase');
      } else if (!/[a-z]/.test(password)) {
        newErrors.password = t('errors.password.lowercase');
      } else if (!/[0-9]/.test(password)) {
        newErrors.password = t('errors.password.number');
      } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        newErrors.password = t('errors.password.specialChar');
      }
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = t('errors.confirmPassword.required');
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = t('errors.confirmPassword.mismatch');
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

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const serverErrors: FormErrors = {};
          Object.entries(data.errors).forEach(([key, value]) => {
            if (Array.isArray(value) && value.length > 0) {
              serverErrors[key as keyof FormErrors] = String(value[0]);
            }
          });
          setErrors(serverErrors);
        } else {
          setErrors({ general: data.message || t('errors.general') });
        }
        return;
      }

      setIsSuccess(true);
    } catch (error) {
      console.error('Reset password error:', error);
      setErrors({ general: t('errors.general') });
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
        <div className="bg-success/10 border border-success/30 rounded-lg p-8 text-center">
          <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-success mb-2">
            {t('success.title')}
          </h2>
          <p className="text-success mb-6">
            {t('success.message')}
          </p>
          <Link
            href={`/${locale}/auth/login`}
            className="inline-block bg-success text-white px-6 py-2 rounded-lg hover:bg-success/90 transition-colors"
          >
            {t('success.loginButton')}
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
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-destructive text-sm">{errors.general}</p>
        </div>
      )}

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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('fields.password.placeholder')}
            className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring transition-colors ${errors.password ? 'border-destructive' : 'border-input'
              }`}
            disabled={isLoading}
            autoComplete="new-password"
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

        {/* Password strength indicator */}
        <PasswordStrength password={password} locale={locale} />
      </div>

      {/* Confirm Password field */}
      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
          {t('fields.confirmPassword.label')} <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/60" />
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={t('fields.confirmPassword.placeholder')}
            className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring transition-colors ${errors.confirmPassword || (confirmPassword && password !== confirmPassword) ? 'border-destructive' : 'border-input'
              }`}
            disabled={isLoading}
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 px-3 flex items-center text-muted-foreground hover:text-foreground"
            tabIndex={-1}
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {(errors.confirmPassword || (confirmPassword && password !== confirmPassword)) && (
          <p className="text-destructive text-sm">{errors.confirmPassword || t('errors.confirmPassword.mismatch')}</p>
        )}
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

      {/* Back to login link */}
      <p className="text-center text-sm text-muted-foreground">
        <Link
          href={`/${locale}/auth/login`}
          className="inline-flex items-center gap-2 text-primary hover:text-primary font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('backToLogin')}
        </Link>
      </p>
    </form>
  );
}
