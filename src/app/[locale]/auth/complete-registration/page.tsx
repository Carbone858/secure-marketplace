'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { CheckCircle, Eye, EyeOff, Loader2, AlertCircle, Lock } from 'lucide-react';

export default function CompleteRegistrationPage() {
  const router = useRouter();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const t = useTranslations('auth.completeRegistration');
  const isRTL = locale === 'ar';

  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Password strength calculation
  const getStrength = (): { score: number; label: string; color: string } => {
    let score = 0;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;

    if (score <= 2) return { score, label: t('strength.weak'), color: 'bg-destructive' };
    if (score <= 3) return { score, label: t('strength.fair'), color: 'bg-warning' };
    if (score <= 4) return { score, label: t('strength.strong'), color: 'bg-success' };
    return { score, label: t('strength.veryStrong'), color: 'bg-success' };
  };

  const strength = getStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 12) {
      setError(t('errors.minLength'));
      return;
    }
    if (password !== confirmPassword) {
      setError(t('errors.mismatch'));
      return;
    }
    if (strength.score < 4) {
      setError(t('errors.tooWeak'));
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/complete-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password, confirmPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || t('errors.general'));
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push(`/${locale}/auth/login`), 3000);
    } catch {
      setError(t('errors.general'));
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/50 px-4" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-md w-full bg-card rounded-2xl shadow-lg p-8 text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">{t('invalidToken')}</h1>
          <p className="text-muted-foreground">{t('invalidTokenDesc')}</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/50 px-4" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-md w-full bg-card rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <h1 className="text-xl font-bold mb-2">{t('successTitle')}</h1>
          <p className="text-muted-foreground">{t('successDesc')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 px-4 py-12" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-md w-full bg-card rounded-2xl shadow-lg p-8">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <Lock className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground mt-1">{t('subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1.5">{t('passwordLabel')}</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pe-12 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring text-base"
                placeholder={t('passwordPlaceholder')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {/* Strength bar */}
            {password.length > 0 && (
              <div className="mt-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= strength.score ? strength.color : 'bg-muted'}`} />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{strength.label}</p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">{t('confirmLabel')}</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring text-base ${
                confirmPassword && password !== confirmPassword ? 'border-destructive' : 'border-input'
              }`}
              placeholder={t('confirmPlaceholder')}
            />
            {confirmPassword && password !== confirmPassword && (
              <p className="text-sm text-destructive mt-1">{t('errors.mismatch')}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {t('submitting')}
              </>
            ) : (
              t('submitButton')
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
