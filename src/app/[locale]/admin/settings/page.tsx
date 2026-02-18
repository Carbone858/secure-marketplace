'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Settings, Globe, Shield, Bell, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageSkeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { useTranslations } from 'next-intl';

interface FeatureFlag {
  id: string;
  key: string;
  value: boolean;
  description: string | null;
  category: string | null;
}

// Map flag keys to their categories
const FLAG_KEYS = {
  maintenance: 'isMaintenanceMode',
  reviewModeration: 'enableReviewModeration',
  emailVerification: 'requireEmailVerification',
  adminNotifications: 'enableAdminNotifications',
  emailReports: 'enableEmailReports',
};

export default function AdminSettingsPage() {
  const t = useTranslations('admin');
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [togglingKey, setTogglingKey] = useState<string | null>(null);

  const fetchFlags = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/feature-flags');
      if (!res.ok) throw new Error();
      const data = await res.json();
      setFlags(data.flags || []);
    } catch {
      toast.error('Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchFlags(); }, [fetchFlags]);

  const getFlag = (key: string): FeatureFlag | undefined =>
    flags.find(f => f.key === key);

  const toggleFlag = async (key: string) => {
    const flag = getFlag(key);
    const newValue = flag ? !flag.value : true;
    setTogglingKey(key);

    try {
      let res: Response;
      if (flag) {
        // Update existing flag
        res = await fetch('/api/admin/feature-flags', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: flag.id, value: newValue }),
        });
      } else {
        // Create flag if it doesn't exist yet
        res = await fetch('/api/admin/feature-flags', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, value: newValue, category: 'system' }),
        });
      }
      if (!res.ok) throw new Error();
      toast.success('Setting updated');
      await fetchFlags();
    } catch {
      toast.error('Failed to update setting');
    } finally {
      setTogglingKey(null);
    }
  };

  const ToggleButton = ({ flagKey, label, description }: { flagKey: string; label: string; description: string }) => {
    const flag = getFlag(flagKey);
    const isOn = flag?.value === true;
    const isToggling = togglingKey === flagKey;

    return (
      <div className="flex items-center justify-between py-3">
        <div>
          <p className="font-medium">{label}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Button
          variant={isOn ? 'default' : 'outline'}
          onClick={() => toggleFlag(flagKey)}
          disabled={isToggling}
          className="min-w-[100px]"
        >
          {isToggling ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            isOn ? t('common.enabled') : t('common.disabled')
          )}
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Settings className="h-8 w-8" />
          {t('sidebar.settings')}
        </h1>
        <p className="text-muted-foreground mt-1">{t('settings_mgmt.subtitle')}</p>
      </div>

      {isLoading ? (
        <PageSkeleton />
      ) : (
        <div className="grid gap-6">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                {t('settings_mgmt.general')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium">{t('settings_mgmt.platformName')}</p>
                  <p className="text-sm text-muted-foreground">{t('settings_mgmt.platformNameDesc')}</p>
                </div>
                <Input defaultValue="ServiceMarket" className="max-w-xs" disabled />
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium">{t('settings_mgmt.defaultLanguage')}</p>
                  <p className="text-sm text-muted-foreground">{t('settings_mgmt.defaultLanguageDesc')}</p>
                </div>
                <Input defaultValue="Arabic (ar)" className="max-w-xs" disabled />
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">{t('settings_mgmt.defaultCountry')}</p>
                  <p className="text-sm text-muted-foreground">{t('settings_mgmt.defaultCountryDesc')}</p>
                </div>
                <Input defaultValue="Syria" className="max-w-xs" disabled />
              </div>
            </CardContent>
          </Card>

          {/* Security & Maintenance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {t('settings_mgmt.securityMaintenance')}
              </CardTitle>
            </CardHeader>
            <CardContent className="divide-y">
              <ToggleButton
                flagKey={FLAG_KEYS.maintenance}
                label={t('settings_mgmt.maintenanceMode')}
                description={
                  getFlag(FLAG_KEYS.maintenance)?.value
                    ? t('settings_mgmt.maintenanceModeOn')
                    : t('settings_mgmt.maintenanceModeOff')
                }
              />
              <ToggleButton
                flagKey={FLAG_KEYS.reviewModeration}
                label={t('settings_mgmt.reviewModeration')}
                description={t('settings_mgmt.reviewModerationDesc')}
              />
              <ToggleButton
                flagKey={FLAG_KEYS.emailVerification}
                label={t('settings_mgmt.emailVerification')}
                description={t('settings_mgmt.emailVerificationDesc')}
              />
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                {t('settings_mgmt.notifications')}
              </CardTitle>
            </CardHeader>
            <CardContent className="divide-y">
              <ToggleButton
                flagKey={FLAG_KEYS.adminNotifications}
                label={t('settings_mgmt.adminNotifications')}
                description={t('settings_mgmt.adminNotificationsDesc')}
              />
              <ToggleButton
                flagKey={FLAG_KEYS.emailReports}
                label={t('settings_mgmt.emailReports')}
                description={t('settings_mgmt.emailReportsDesc')}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
