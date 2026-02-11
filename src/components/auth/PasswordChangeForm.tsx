'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Eye, EyeOff, Loader2, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { PasswordStrength } from './PasswordStrength';

export function PasswordChangeForm() {
  const t = useTranslations('auth.profile.password');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [errors, setErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    setMessage(null);
  };

  const validateForm = (): boolean => {
    const newErrors: {
      currentPassword?: string;
      newPassword?: string;
      confirmPassword?: string;
    } = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = t('errors.currentPassword.required');
    }

    if (!formData.newPassword) {
      newErrors.newPassword = t('errors.newPassword.required');
    } else {
      if (formData.newPassword.length < 12) {
        newErrors.newPassword = t('errors.newPassword.minLength');
      } else if (!/[A-Z]/.test(formData.newPassword)) {
        newErrors.newPassword = t('errors.newPassword.uppercase');
      } else if (!/[a-z]/.test(formData.newPassword)) {
        newErrors.newPassword = t('errors.newPassword.lowercase');
      } else if (!/[0-9]/.test(formData.newPassword)) {
        newErrors.newPassword = t('errors.newPassword.number');
      } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.newPassword)) {
        newErrors.newPassword = t('errors.newPassword.specialChar');
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('errors.confirmPassword.required');
    } else if (formData.newPassword !== formData.confirmPassword) {
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
    setMessage(null);

    try {
      const response = await fetch('/api/user/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({ type: 'error', text: data.message || t('errors.general') });
        return;
      }

      setMessage({ type: 'success', text: data.message || t('success.passwordChanged') });
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Password change error:', error);
      setMessage({ type: 'error', text: t('errors.general') });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-lg flex items-start gap-3 ${
            message.type === 'success'
              ? 'bg-success/10 border border-success/30'
              : 'bg-destructive/10 border border-destructive/30'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          )}
          <p className={message.type === 'success' ? 'text-success' : 'text-destructive'}>
            {message.text}
          </p>
        </div>
      )}

      {/* Current Password */}
      <div className="space-y-2">
        <label htmlFor="currentPassword" className="block text-sm font-medium text-foreground">
          {t('fields.currentPassword.label')} <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/60" />
          <input
            type={showPasswords.current ? 'text' : 'password'}
            id="currentPassword"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            placeholder={t('fields.currentPassword.placeholder')}
            className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring transition-colors ${
              errors.currentPassword ? 'border-destructive' : 'border-input'
            }`}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('current')}
            className="absolute inset-y-0 right-0 px-3 flex items-center text-muted-foreground hover:text-foreground"
            tabIndex={-1}
          >
            {showPasswords.current ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors.currentPassword && (
          <p className="text-destructive text-sm">{errors.currentPassword}</p>
        )}
      </div>

      {/* New Password */}
      <div className="space-y-2">
        <label htmlFor="newPassword" className="block text-sm font-medium text-foreground">
          {t('fields.newPassword.label')} <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/60" />
          <input
            type={showPasswords.new ? 'text' : 'password'}
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder={t('fields.newPassword.placeholder')}
            className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring transition-colors ${
              errors.newPassword ? 'border-destructive' : 'border-input'
            }`}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('new')}
            className="absolute inset-y-0 right-0 px-3 flex items-center text-muted-foreground hover:text-foreground"
            tabIndex={-1}
          >
            {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.newPassword && <p className="text-destructive text-sm">{errors.newPassword}</p>}

        {/* Password strength */}
        <PasswordStrength password={formData.newPassword} locale={locale} />
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
          {t('fields.confirmPassword.label')} <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/60" />
          <input
            type={showPasswords.confirm ? 'text' : 'password'}
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder={t('fields.confirmPassword.placeholder')}
            className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring transition-colors ${
              errors.confirmPassword ? 'border-destructive' : 'border-input'
            }`}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('confirm')}
            className="absolute inset-y-0 right-0 px-3 flex items-center text-muted-foreground hover:text-foreground"
            tabIndex={-1}
          >
            {showPasswords.confirm ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-destructive text-sm">{errors.confirmPassword}</p>
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
    </form>
  );
}
