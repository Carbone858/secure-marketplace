'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Loader2, Mail, Bell, Smartphone, CheckCircle, AlertCircle } from 'lucide-react';

interface NotificationSettings {
  // Email
  emailNewOffers: boolean;
  emailRequestUpdates: boolean;
  emailMessages: boolean;
  emailMarketing: boolean;
  emailSecurityAlerts: boolean;
  // Push
  pushNewOffers: boolean;
  pushRequestUpdates: boolean;
  pushMessages: boolean;
  // SMS
  smsSecurityAlerts: boolean;
  smsMarketing: boolean;
}

const defaultSettings: NotificationSettings = {
  emailNewOffers: true,
  emailRequestUpdates: true,
  emailMessages: true,
  emailMarketing: false,
  emailSecurityAlerts: true,
  pushNewOffers: true,
  pushRequestUpdates: true,
  pushMessages: true,
  smsSecurityAlerts: true,
  smsMarketing: false,
};

export function NotificationSettingsForm() {
  const t = useTranslations('auth.profile.notifications');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/notifications');
      const data = await response.json();

      if (response.ok && data.data?.settings) {
        setSettings(data.data.settings);
      }
    } catch (error) {
      console.error('Failed to load notification settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = (key: keyof NotificationSettings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/user/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({ type: 'error', text: data.message || t('errors.general') });
        return;
      }

      setMessage({ type: 'success', text: t('success.saved') });
    } catch (error) {
      console.error('Save settings error:', error);
      setMessage({ type: 'error', text: t('errors.general') });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
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

      {/* Email Notifications */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 pb-2 border-b">
          <Mail className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">{t('sections.email.title')}</h3>
        </div>
        <div className="space-y-3">
          <ToggleItem
            label={t('sections.email.newOffers')}
            description={t('sections.email.newOffersDesc')}
            checked={settings.emailNewOffers}
            onChange={() => handleToggle('emailNewOffers')}
          />
          <ToggleItem
            label={t('sections.email.requestUpdates')}
            description={t('sections.email.requestUpdatesDesc')}
            checked={settings.emailRequestUpdates}
            onChange={() => handleToggle('emailRequestUpdates')}
          />
          <ToggleItem
            label={t('sections.email.messages')}
            description={t('sections.email.messagesDesc')}
            checked={settings.emailMessages}
            onChange={() => handleToggle('emailMessages')}
          />
          <ToggleItem
            label={t('sections.email.securityAlerts')}
            description={t('sections.email.securityAlertsDesc')}
            checked={settings.emailSecurityAlerts}
            onChange={() => handleToggle('emailSecurityAlerts')}
            important
          />
          <ToggleItem
            label={t('sections.email.marketing')}
            description={t('sections.email.marketingDesc')}
            checked={settings.emailMarketing}
            onChange={() => handleToggle('emailMarketing')}
          />
        </div>
      </div>

      {/* Push Notifications */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 pb-2 border-b">
          <Bell className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">{t('sections.push.title')}</h3>
        </div>
        <div className="space-y-3">
          <ToggleItem
            label={t('sections.push.newOffers')}
            description={t('sections.push.newOffersDesc')}
            checked={settings.pushNewOffers}
            onChange={() => handleToggle('pushNewOffers')}
          />
          <ToggleItem
            label={t('sections.push.requestUpdates')}
            description={t('sections.push.requestUpdatesDesc')}
            checked={settings.pushRequestUpdates}
            onChange={() => handleToggle('pushRequestUpdates')}
          />
          <ToggleItem
            label={t('sections.push.messages')}
            description={t('sections.push.messagesDesc')}
            checked={settings.pushMessages}
            onChange={() => handleToggle('pushMessages')}
          />
        </div>
      </div>

      {/* SMS Notifications */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 pb-2 border-b">
          <Smartphone className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">{t('sections.sms.title')}</h3>
        </div>
        <div className="space-y-3">
          <ToggleItem
            label={t('sections.sms.securityAlerts')}
            description={t('sections.sms.securityAlertsDesc')}
            checked={settings.smsSecurityAlerts}
            onChange={() => handleToggle('smsSecurityAlerts')}
            important
          />
          <ToggleItem
            label={t('sections.sms.marketing')}
            description={t('sections.sms.marketingDesc')}
            checked={settings.smsMarketing}
            onChange={() => handleToggle('smsMarketing')}
          />
        </div>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isSaving}
        className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary/90 focus:ring-4 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {isSaving ? (
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

interface ToggleItemProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
  important?: boolean;
}

function ToggleItem({ label, description, checked, onChange, important }: ToggleItemProps) {
  return (
    <div className="flex items-start justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex-1 pr-4">
        <div className="flex items-center gap-2">
          <span className="font-medium">{label}</span>
          {important && (
            <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">
              Recommended
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
      <button
        type="button"
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
          checked ? 'bg-primary' : 'bg-muted'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-card transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}
