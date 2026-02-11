'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { PasswordStrength } from './PasswordStrength';
import Link from 'next/link';

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone: string;
  termsAccepted: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  name?: string;
  phone?: string;
  termsAccepted?: string;
  general?: string;
}

// reCAPTCHA v3 hook
function useRecaptcha() {
  const executeRecaptcha = useCallback(async (action: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !(window as unknown as { grecaptcha?: { ready: (cb: () => void) => void; execute: (key: string, options: { action: string }) => Promise<string> } }).grecaptcha) {
        reject(new Error('reCAPTCHA not loaded'));
        return;
      }

      const grecaptcha = (window as unknown as { grecaptcha: { ready: (cb: () => void) => void; execute: (key: string, options: { action: string }) => Promise<string> } }).grecaptcha;
      const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';
      if (!siteKey) {
        reject(new Error('reCAPTCHA site key not configured'));
        return;
      }

      grecaptcha.ready(() => {
        grecaptcha.execute(siteKey, { action })
          .then((token: string) => resolve(token))
          .catch((err: Error) => reject(err));
      });
    });
  }, []);

  return { executeRecaptcha };
}

export function RegisterForm() {
  const router = useRouter();
  const t = useTranslations('auth.register');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const { executeRecaptcha } = useRecaptcha();

  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    termsAccepted: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = t('errors.email.required');
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      newErrors.email = t('errors.email.invalid');
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = t('errors.password.required');
    } else {
      if (formData.password.length < 12) {
        newErrors.password = t('errors.password.minLength');
      } else if (!/[A-Z]/.test(formData.password)) {
        newErrors.password = t('errors.password.uppercase');
      } else if (!/[a-z]/.test(formData.password)) {
        newErrors.password = t('errors.password.lowercase');
      } else if (!/[0-9]/.test(formData.password)) {
        newErrors.password = t('errors.password.number');
      } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password)) {
        newErrors.password = t('errors.password.specialChar');
      }
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('errors.confirmPassword.required');
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('errors.confirmPassword.mismatch');
    }

    // Name validation
    if (!formData.name) {
      newErrors.name = t('errors.name.required');
    } else if (formData.name.length < 2) {
      newErrors.name = t('errors.name.minLength');
    }

    // Phone validation
    if (!formData.phone) {
      newErrors.phone = t('errors.phone.required');
    } else if (!/^\+[1-9]\d{1,14}$/.test(formData.phone)) {
      newErrors.phone = t('errors.phone.invalid');
    }

    // Terms validation
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = t('errors.terms.required');
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
      // Execute reCAPTCHA
      let recaptchaToken = '';
      try {
        recaptchaToken = await executeRecaptcha('register');
      } catch (error) {
        console.warn('reCAPTCHA failed, continuing without:', error);
        // In development, continue without reCAPTCHA
        if (process.env.NODE_ENV === 'production') {
          setErrors({ general: t('errors.recaptcha') });
          setIsLoading(false);
          return;
        }
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': locale,
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          name: formData.name,
          phone: formData.phone,
          termsAccepted: formData.termsAccepted,
          recaptchaToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          // Map server errors to form fields
          const serverErrors: FormErrors = {};
          Object.entries(data.errors).forEach(([key, value]) => {
            if (Array.isArray(value) && value.length > 0) {
              serverErrors[key as keyof FormErrors] = t(`errors.${key}.${value[0]}`) || String(value[0]);
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
      console.error('Registration error:', error);
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

  if (isSuccess) {
    return (
      <div className="w-full max-w-md mx-auto p-6">
        <div className="bg-success/10 border border-success/30 rounded-lg p-6 text-center">
          <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-success mb-2">
            {t('success.title')}
          </h2>
          <p className="text-success mb-4">{t('success.message')}</p>
          <p className="text-sm text-success mb-6">
            {t('success.checkEmail', { email: formData.email })}
          </p>
          <Link
            href={`/${locale}/auth/login`}
            className="inline-block bg-success text-white px-6 py-2 rounded-lg hover:bg-success/90 transition-colors"
          >
            {t('success.goToLogin')}
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

      {/* Name field */}
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium text-foreground">
          {t('fields.name.label')} <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder={t('fields.name.placeholder')}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring transition-colors ${
            errors.name ? 'border-destructive' : 'border-input'
          }`}
          disabled={isLoading}
        />
        {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
      </div>

      {/* Email field */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-foreground">
          {t('fields.email.label')} <span className="text-destructive">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder={t('fields.email.placeholder')}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring transition-colors ${
            errors.email ? 'border-destructive' : 'border-input'
          }`}
          disabled={isLoading}
          autoComplete="email"
        />
        {errors.email && <p className="text-destructive text-sm">{errors.email}</p>}
      </div>

      {/* Phone field */}
      <div className="space-y-2">
        <label htmlFor="phone" className="block text-sm font-medium text-foreground">
          {t('fields.phone.label')} <span className="text-destructive">*</span>
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder={t('fields.phone.placeholder')}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring transition-colors ${
            errors.phone ? 'border-destructive' : 'border-input'
          }`}
          disabled={isLoading}
          autoComplete="tel"
        />
        {errors.phone && <p className="text-destructive text-sm">{errors.phone}</p>}
        <p className="text-xs text-muted-foreground">{t('fields.phone.hint')}</p>
      </div>

      {/* Password field */}
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-foreground">
          {t('fields.password.label')} <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder={t('fields.password.placeholder')}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring transition-colors ${
              errors.password ? 'border-destructive' : 'border-input'
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
        <PasswordStrength password={formData.password} locale={locale} />
      </div>

      {/* Confirm Password field */}
      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
          {t('fields.confirmPassword.label')} <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder={t('fields.confirmPassword.placeholder')}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring transition-colors ${
              errors.confirmPassword ? 'border-destructive' : 'border-input'
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
        {errors.confirmPassword && (
          <p className="text-destructive text-sm">{errors.confirmPassword}</p>
        )}
      </div>

      {/* Terms checkbox */}
      <div className="space-y-2">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="termsAccepted"
            checked={formData.termsAccepted}
            onChange={handleChange}
            className="mt-1 w-4 h-4 text-primary border-input rounded focus:ring-ring"
            disabled={isLoading}
          />
          <span className="text-sm text-foreground">
            {t('fields.terms.label')}{' '}
            <Link
              href={`/${locale}/terms`}
              className="text-primary hover:text-primary underline"
              target="_blank"
            >
              {t('fields.terms.link')}
            </Link>{' '}
            {t('fields.terms.and')}{' '}
            <Link
              href={`/${locale}/privacy`}
              className="text-primary hover:text-primary underline"
              target="_blank"
            >
              {t('fields.terms.privacyLink')}
            </Link>
          </span>
        </label>
        {errors.termsAccepted && (
          <p className="text-destructive text-sm">{errors.termsAccepted}</p>
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

      {/* Login link */}
      <p className="text-center text-sm text-muted-foreground">
        {t('haveAccount')}{' '}
        <Link
          href={`/${locale}/auth/login`}
          className="text-primary hover:text-primary font-medium"
        >
          {t('loginLink')}
        </Link>
      </p>
    </form>
  );
}
