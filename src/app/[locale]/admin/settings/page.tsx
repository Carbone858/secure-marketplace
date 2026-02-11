'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Settings, Loader2, Save, Globe, Mail, Shield, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
      toast.success('Maintenance mode updated');
      // Refresh
      const data = await (await fetch('/api/admin/feature-flags?category=system')).json();
      setFlags(data.flags || []);
    } catch {
      toast.error('Failed to update');
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
        <p className="text-muted-foreground mt-1">Platform configuration and settings</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-6">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium">Platform Name</p>
                  <p className="text-sm text-muted-foreground">The display name of the marketplace</p>
                </div>
                <Input defaultValue="ServiceMarket" className="max-w-xs" disabled />
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium">Default Language</p>
                  <p className="text-sm text-muted-foreground">Primary language for the platform</p>
                </div>
                <Input defaultValue="Arabic (ar)" className="max-w-xs" disabled />
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">Default Country</p>
                  <p className="text-sm text-muted-foreground">Primary operating country</p>
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
                Security & Maintenance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium">Maintenance Mode</p>
                  <p className="text-sm text-muted-foreground">
                    {isMaintenanceOn 
                      ? 'Platform is in maintenance mode — users cannot access the site'
                      : 'Platform is running normally'
                    }
                  </p>
                </div>
                <Button
                  variant={isMaintenanceOn ? 'destructive' : 'outline'}
                  onClick={toggleMaintenance}
                >
                  {isMaintenanceOn ? 'Disable Maintenance' : 'Enable Maintenance'}
                </Button>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium">Review Moderation</p>
                  <p className="text-sm text-muted-foreground">Reviews require admin approval before publishing</p>
                </div>
                <Button variant="outline" disabled>Enabled</Button>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">Email Verification</p>
                  <p className="text-sm text-muted-foreground">Require email verification for new accounts</p>
                </div>
                <Button variant="outline" disabled>Required</Button>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium">Admin Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive notifications for new registrations and verifications</p>
                </div>
                <Button variant="outline" disabled>Enabled</Button>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">Email Reports</p>
                  <p className="text-sm text-muted-foreground">Receive weekly email reports</p>
                </div>
                <Button variant="outline" disabled>Disabled</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
