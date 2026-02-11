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
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                {t('warning.title')}
              </h3>
              <ul className="space-y-2 text-red-700">
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
          className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 focus:ring-4 focus:ring-red-300 transition-colors"
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
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          )}
          <p className={message.type === 'success' ? 'text-green-700' : 'text-red-700'}>
            {message.text}
          </p>
        </div>
      )}

      {/* Warning */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800 text-sm">{t('finalWarning')}</p>
      </div>

      {/* Password */}
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          {t('fields.password.label')} <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('fields.password.placeholder')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
            disabled={isLoading}
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
      </div>

      {/* Reason (optional) */}
      <div className="space-y-2">
        <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
          {t('fields.reason.label')}
        </label>
        <textarea
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder={t('fields.reason.placeholder')}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors resize-none"
          disabled={isLoading}
          maxLength={500}
        />
        <p className="text-xs text-gray-500">{t('fields.reason.optional')}</p>
      </div>

      {/* Confirmation */}
      <div className="space-y-2">
        <label htmlFor="confirmation" className="block text-sm font-medium text-gray-700">
          {t('fields.confirmation.label')} <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="confirmation"
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
          placeholder="DELETE"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors uppercase"
          disabled={isLoading}
        />
        <p className="text-sm text-gray-500">{t('fields.confirmation.hint')}</p>
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => setShowConfirmation(false)}
          disabled={isLoading}
          className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
        >
          {t('cancelButton')}
        </button>
        <button
          type="submit"
          disabled={isLoading || confirmation !== 'DELETE' || !password}
          className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 focus:ring-4 focus:ring-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
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
