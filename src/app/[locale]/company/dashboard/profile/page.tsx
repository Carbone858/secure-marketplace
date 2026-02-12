'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Building2, Loader2, Save, Globe, Phone, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useLocale, useTranslations } from 'next-intl';

export default function CompanyProfilePage() {
  const locale = useLocale();
  const t = useTranslations('company_dashboard');
  const [company, setCompany] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    phone: '',
    website: '',
    address: '',
  });

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await fetch('/api/company/dashboard');
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (data.company) {
          setCompany(data.company);
          setForm({
            name: data.company.name || '',
            description: data.company.description || '',
            phone: data.company.phone || '',
            website: data.company.website || '',
            address: data.company.address || '',
          });
        }
      } catch {
        toast.error(t('profile.loadFailed'));
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompany();
  }, [t]);

  const handleSave = async () => {
    if (!company) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/companies/${company.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success(t('profile.updateSuccess'));
    } catch {
      toast.error(t('profile.updateFailed'));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Building2 className="h-8 w-8" />
            {t('profile.title')}
          </h1>
          <p className="text-muted-foreground mt-1">{t('profile.subtitle')}</p>
        </div>
        {company && (
          <Badge className={company.verificationStatus === 'VERIFIED' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}>
            {t(`status.${company.verificationStatus}`)}
          </Badge>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('profile.basicInfo')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                <Building2 className="h-3 w-3" /> {t('profile.companyNameEn')}
              </label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                <Building2 className="h-3 w-3" /> {t('profile.companyName')}
              </label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t('profile.description')}</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border rounded-md px-3 py-2 text-sm min-h-[100px] bg-background"
              placeholder={t('profile.descriptionPlaceholder')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                <Phone className="h-3 w-3" /> {t('profile.phone')}
              </label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                <Globe className="h-3 w-3" /> {t('profile.website')}
              </label>
              <Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {t('profile.address')}
            </label>
            <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>

          <Button onClick={handleSave} disabled={isSaving} className="mt-4">
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin me-2" /> : <Save className="h-4 w-4 me-2" />}
            {t('profile.saveChanges')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
