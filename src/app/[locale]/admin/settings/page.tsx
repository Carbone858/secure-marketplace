'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Settings, Save, Globe, Mail, Shield, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageSkeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { useLocale, useTranslations } from 'next-intl';

export default function AdminSettingsPage() {
  const locale = useLocale();
  const t = useTranslations('admin');
  const [flags, setFlags] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/admin/feature-flags?category=system');
        if (!res.ok) throw new Error();
        const data = await res.json();
        setFlags(data.flags || []);
      } catch {
        // Settings load from feature flags
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const toggleMaintenance = async () => {
    const maintenanceFlag = flags.find(f => f.key === 'isMaintenanceMode');
    if (!maintenanceFlag) return;
    
    try {
      const res = await fetch('/api/admin/feature-flags', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: maintenanceFlag.id,
          value: !maintenanceFlag.value,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success(t('settings_mgmt.toasts.maintenanceUpdated'));
      // Refresh
      const data = await (await fetch('/api/admin/feature-flags?category=system')).json();
      setFlags(data.flags || []);
    } catch {
      toast.error(t('settings_mgmt.toasts.updateFailed'));
    }
  };

  const isMaintenanceOn = flags.find(f => f.key === 'isMaintenanceMode')?.value === true;

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

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {t('settings_mgmt.securityMaintenance')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium">{t('settings_mgmt.maintenanceMode')}</p>
                  <p className="text-sm text-muted-foreground">
                    {isMaintenanceOn 
                      ? t('settings_mgmt.maintenanceModeOn')
                      : t('settings_mgmt.maintenanceModeOff')
                    }
                  </p>
                </div>
                <Button
                  variant={isMaintenanceOn ? 'destructive' : 'outline'}
                  onClick={toggleMaintenance}
                >
                  {isMaintenanceOn ? t('settings_mgmt.disableMaintenance') : t('settings_mgmt.enableMaintenance')}
                </Button>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium">{t('settings_mgmt.reviewModeration')}</p>
                  <p className="text-sm text-muted-foreground">{t('settings_mgmt.reviewModerationDesc')}</p>
                </div>
                <Button variant="outline" disabled>{t('common.enabled')}</Button>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">{t('settings_mgmt.emailVerification')}</p>
                  <p className="text-sm text-muted-foreground">{t('settings_mgmt.emailVerificationDesc')}</p>
                </div>
                <Button variant="outline" disabled>{t('common.required')}</Button>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                {t('settings_mgmt.notifications')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium">{t('settings_mgmt.adminNotifications')}</p>
                  <p className="text-sm text-muted-foreground">{t('settings_mgmt.adminNotificationsDesc')}</p>
                </div>
                <Button variant="outline" disabled>{t('common.enabled')}</Button>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">{t('settings_mgmt.emailReports')}</p>
                  <p className="text-sm text-muted-foreground">{t('settings_mgmt.emailReportsDesc')}</p>
                </div>
                <Button variant="outline" disabled>{t('common.disabled')}</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
