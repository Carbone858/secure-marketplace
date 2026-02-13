'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Loader2, AlertTriangle, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';

export function DeleteAccountForm() {
  const router = useRouter();
  const t = useTranslations('auth.profile.deleteAccount');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (confirmation !== 'DELETE') {
      setMessage({ type: 'error', text: t('errors.confirmation') });
      return;
    }

    if (!password) {
      setMessage({ type: 'error', text: t('errors.password.required') });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/user/account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password,
          confirmation,
          reason: reason || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({ type: 'error', text: data.message || t('errors.general') });
        return;
      }

      setMessage({ type: 'success', text: data.message || t('success.deleted') });
      
      // Redirect to home after successful deletion
      setTimeout(() => {
        router.push(`/${locale}`);
        router.refresh();
      }, 2000);
    } catch (error) {
      console.error('Account deletion error:', error);
      setMessage({ type: 'error', text: t('errors.general') });
    } finally {
      setIsLoading(false);
    }
  };

  if (!showConfirmation) {
    return (
      <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-8 h-8 text-destructive flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-destructive mb-2">
                {t('warning.title')}
              </h3>
              <ul className="space-y-2 text-destructive">
                <li>{t('warning.point1')}</li>
                <li>{t('warning.point2')}</li>
                <li>{t('warning.point3')}</li>
                <li>{t('warning.point4')}</li>
              </ul>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowConfirmation(true)}
          className="w-full bg-destructive text-white py-3 px-4 rounded-lg font-medium hover:bg-destructive focus:ring-4 focus:ring-destructive/50 transition-colors"
        >
          {t('continueButton')}
        </button>
      </div>
    );
  }

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

      {/* Warning */}
      <div className="bg-warning/10 border border-warning/30 rounded-lg p-4">
        <p className="text-warning text-sm">{t('finalWarning')}</p>
      </div>

      {/* Password */}
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-foreground">
          {t('fields.password.label')} <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('fields.password.placeholder')}
            className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-destructive focus:border-destructive transition-colors"
            disabled={isLoading}
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
      </div>

      {/* Reason (optional) */}
      <div className="space-y-2">
        <label htmlFor="reason" className="block text-sm font-medium text-foreground">
          {t('fields.reason.label')}
        </label>
        <textarea
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder={t('fields.reason.placeholder')}
          rows={3}
          className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-destructive focus:border-destructive transition-colors resize-none"
          disabled={isLoading}
          maxLength={500}
        />
        <p className="text-xs text-muted-foreground">{t('fields.reason.optional')}</p>
      </div>

      {/* Confirmation */}
      <div className="space-y-2">
        <label htmlFor="confirmation" className="block text-sm font-medium text-foreground">
          {t('fields.confirmation.label')} <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          id="confirmation"
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
          placeholder="DELETE"
          className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-destructive focus:border-destructive transition-colors"
          disabled={isLoading}
        />
        <p className="text-sm text-muted-foreground">{t('fields.confirmation.hint')}</p>
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => setShowConfirmation(false)}
          disabled={isLoading}
          className="flex-1 bg-muted text-foreground py-3 px-4 rounded-lg font-medium hover:bg-muted transition-colors"
        >
          {t('cancelButton')}
        </button>
        <button
          type="submit"
          disabled={isLoading || confirmation !== 'DELETE' || !password}
          className="flex-1 bg-destructive text-white py-3 px-4 rounded-lg font-medium hover:bg-destructive focus:ring-4 focus:ring-destructive/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
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
      </div>
    </form>
  );
}
