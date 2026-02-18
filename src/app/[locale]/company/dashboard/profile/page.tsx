'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import {
  Building2, Loader2, Save, Globe, Phone, MapPin, Mail,
  Plus, Trash2, Pencil, X, Check, Tag, Briefcase, DollarSign,
  Facebook, Twitter, Instagram, Linkedin, Youtube, ChevronDown, ChevronUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useLocale } from 'next-intl';

interface Category {
  id: string;
  nameEn: string;
  nameAr: string;
  icon?: string;
}

interface CompanyService {
  id: string;
  name: string;
  description?: string;
  priceFrom?: number;
  priceTo?: number;
  tags: string[];
}

interface SocialLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
}

interface Company {
  id: string;
  name: string;
  description?: string;
  phone?: string;
  website?: string;
  address?: string;
  email?: string;
  skills: string[]; // stores categoryIds
  verificationStatus: string;
  services: CompanyService[];
  socialLinks?: SocialLinks;
}

export default function CompanyProfilePage() {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const [company, setCompany] = useState<Company | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Basic info form
  const [form, setForm] = useState({
    name: '', description: '', phone: '', website: '', address: '', email: '',
  });

  // Social links
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({});
  const [showSocial, setShowSocial] = useState(false);

  // Categories (stored in skills[])
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

  // Services
  const [services, setServices] = useState<CompanyService[]>([]);
  const [editingService, setEditingService] = useState<CompanyService | null>(null);
  const [newService, setNewService] = useState({ name: '', description: '', priceFrom: '', priceTo: '' });
  const [showAddService, setShowAddService] = useState(false);
  const [savingService, setSavingService] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [profileRes, categoriesRes] = await Promise.all([
        fetch('/api/company/profile'),
        fetch('/api/categories'),
      ]);
      if (!profileRes.ok) throw new Error('Failed to load profile');
      const profileData = await profileRes.json();
      const catData = categoriesRes.ok ? await categoriesRes.json() : { categories: [] };

      const c = profileData.company;
      setCompany(c);
      setForm({
        name: c.name || '',
        description: c.description || '',
        phone: c.phone || '',
        website: c.website || '',
        address: c.address || '',
        email: c.email || '',
      });
      setSelectedCategoryIds(c.skills || []);
      setServices(c.services || []);
      setSocialLinks(c.socialLinks || {});
      setCategories(catData.categories || catData.data?.categories || []);
    } catch {
      toast.error(isRTL ? 'فشل تحميل الملف الشخصي' : 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  }, [isRTL]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSaveProfile = async () => {
    if (!company) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/company/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, categoryIds: selectedCategoryIds, socialLinks }),
      });
      if (!res.ok) throw new Error();
      toast.success(isRTL ? 'تم حفظ الملف الشخصي بنجاح' : 'Profile saved successfully');
    } catch {
      toast.error(isRTL ? 'فشل حفظ الملف الشخصي' : 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleCategory = (id: string) => {
    setSelectedCategoryIds(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleAddService = async () => {
    if (!newService.name.trim()) {
      toast.error(isRTL ? 'اسم الخدمة مطلوب' : 'Service name is required');
      return;
    }
    setSavingService(true);
    try {
      const res = await fetch('/api/company/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newService),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setServices(prev => [...prev, data.service]);
      setNewService({ name: '', description: '', priceFrom: '', priceTo: '' });
      setShowAddService(false);
      toast.success(isRTL ? 'تمت إضافة الخدمة' : 'Service added');
    } catch {
      toast.error(isRTL ? 'فشل إضافة الخدمة' : 'Failed to add service');
    } finally {
      setSavingService(false);
    }
  };

  const handleUpdateService = async () => {
    if (!editingService) return;
    setSavingService(true);
    try {
      const res = await fetch('/api/company/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editingService,
          priceFrom: editingService.priceFrom ? String(editingService.priceFrom) : '',
          priceTo: editingService.priceTo ? String(editingService.priceTo) : '',
        }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setServices(prev => prev.map(s => s.id === data.service.id ? data.service : s));
      setEditingService(null);
      toast.success(isRTL ? 'تم تحديث الخدمة' : 'Service updated');
    } catch {
      toast.error(isRTL ? 'فشل تحديث الخدمة' : 'Failed to update service');
    } finally {
      setSavingService(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm(isRTL ? 'هل أنت متأكد من حذف هذه الخدمة؟' : 'Delete this service?')) return;
    try {
      const res = await fetch(`/api/company/services?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setServices(prev => prev.filter(s => s.id !== id));
      toast.success(isRTL ? 'تم حذف الخدمة' : 'Service deleted');
    } catch {
      toast.error(isRTL ? 'فشل حذف الخدمة' : 'Failed to delete service');
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
    <div className="container mx-auto px-4 py-8 space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Building2 className="h-8 w-8" />
            {isRTL ? 'الملف الشخصي للشركة' : 'Company Profile'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isRTL ? 'إدارة معلومات شركتك وخدماتها' : 'Manage your company information and services'}
          </p>
        </div>
        {company && (
          <Badge className={company.verificationStatus === 'VERIFIED' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}>
            {company.verificationStatus === 'VERIFIED'
              ? (isRTL ? 'موثّق' : 'Verified')
              : company.verificationStatus === 'PENDING'
                ? (isRTL ? 'قيد المراجعة' : 'Pending Review')
                : company.verificationStatus}
          </Badge>
        )}
      </div>

      {/* ── Basic Info ── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {isRTL ? 'المعلومات الأساسية' : 'Basic Information'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{isRTL ? 'اسم الشركة' : 'Company Name'}</label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1"><Mail className="h-3 w-3" /> {isRTL ? 'البريد الإلكتروني' : 'Email'}</label>
              <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{isRTL ? 'نبذة عن الشركة' : 'Company Description'}</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full border rounded-md px-3 py-2 text-sm min-h-[120px] bg-background resize-none"
              placeholder={isRTL ? 'اكتب نبذة عن شركتك وخدماتها...' : 'Describe your company and services...'}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1"><Phone className="h-3 w-3" /> {isRTL ? 'رقم الهاتف' : 'Phone'}</label>
              <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1"><Globe className="h-3 w-3" /> {isRTL ? 'الموقع الإلكتروني' : 'Website'}</label>
              <Input value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} placeholder="https://" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1"><MapPin className="h-3 w-3" /> {isRTL ? 'العنوان' : 'Address'}</label>
            <Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
          </div>
        </CardContent>
      </Card>

      {/* ── Categories ── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            {isRTL ? 'تخصصات الشركة' : 'Company Categories'}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {isRTL
              ? 'اختر المجالات التي تعمل فيها شركتك — ستظهر لك طلبات الخدمة المتعلقة بها فقط'
              : 'Select the industries your company serves — you\'ll only see matching service requests'}
          </p>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <p className="text-sm text-muted-foreground">{isRTL ? 'لا توجد تصنيفات متاحة' : 'No categories available'}</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => {
                const selected = selectedCategoryIds.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${selected
                        ? 'bg-primary text-white border-primary'
                        : 'bg-background border-border hover:border-primary hover:text-primary'
                      }`}
                  >
                    {selected && <Check className="inline h-3 w-3 me-1" />}
                    {isRTL ? cat.nameAr : cat.nameEn}
                  </button>
                );
              })}
            </div>
          )}
          {selectedCategoryIds.length > 0 && (
            <p className="text-xs text-muted-foreground mt-3">
              {isRTL
                ? `${selectedCategoryIds.length} تخصص محدد`
                : `${selectedCategoryIds.length} categor${selectedCategoryIds.length === 1 ? 'y' : 'ies'} selected`}
            </p>
          )}
        </CardContent>
      </Card>

      {/* ── Services ── */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              {isRTL ? 'الخدمات المقدَّمة' : 'Services Offered'}
            </CardTitle>
            <Button size="sm" onClick={() => { setShowAddService(true); setEditingService(null); }}>
              <Plus className="h-4 w-4 me-1" />
              {isRTL ? 'إضافة خدمة' : 'Add Service'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add service form */}
          {showAddService && (
            <div className="border rounded-lg p-4 space-y-3 bg-muted/30">
              <h4 className="font-medium text-sm">{isRTL ? 'خدمة جديدة' : 'New Service'}</h4>
              <Input
                placeholder={isRTL ? 'اسم الخدمة *' : 'Service name *'}
                value={newService.name}
                onChange={e => setNewService({ ...newService, name: e.target.value })}
              />
              <textarea
                placeholder={isRTL ? 'وصف الخدمة (اختياري)' : 'Service description (optional)'}
                value={newService.description}
                onChange={e => setNewService({ ...newService, description: e.target.value })}
                className="w-full border rounded-md px-3 py-2 text-sm min-h-[80px] bg-background resize-none"
              />
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground flex items-center gap-1"><DollarSign className="h-3 w-3" />{isRTL ? 'السعر من' : 'Price from'}</label>
                  <Input type="number" placeholder="0" value={newService.priceFrom} onChange={e => setNewService({ ...newService, priceFrom: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground flex items-center gap-1"><DollarSign className="h-3 w-3" />{isRTL ? 'السعر إلى' : 'Price to'}</label>
                  <Input type="number" placeholder="0" value={newService.priceTo} onChange={e => setNewService({ ...newService, priceTo: e.target.value })} />
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddService} disabled={savingService}>
                  {savingService ? <Loader2 className="h-4 w-4 animate-spin me-1" /> : <Check className="h-4 w-4 me-1" />}
                  {isRTL ? 'حفظ' : 'Save'}
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowAddService(false)}>
                  <X className="h-4 w-4 me-1" />{isRTL ? 'إلغاء' : 'Cancel'}
                </Button>
              </div>
            </div>
          )}

          {/* Services list */}
          {services.length === 0 && !showAddService ? (
            <div className="text-center py-8 text-muted-foreground">
              <Briefcase className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">{isRTL ? 'لم تُضف أي خدمات بعد' : 'No services added yet'}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {services.map(service => (
                <div key={service.id} className="border rounded-lg p-4">
                  {editingService?.id === service.id ? (
                    <div className="space-y-3">
                      <Input
                        value={editingService.name}
                        onChange={e => setEditingService({ ...editingService, name: e.target.value })}
                      />
                      <textarea
                        value={editingService.description || ''}
                        onChange={e => setEditingService({ ...editingService, description: e.target.value })}
                        className="w-full border rounded-md px-3 py-2 text-sm min-h-[80px] bg-background resize-none"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          type="number"
                          placeholder={isRTL ? 'السعر من' : 'Price from'}
                          value={editingService.priceFrom || ''}
                          onChange={e => setEditingService({ ...editingService, priceFrom: parseFloat(e.target.value) || undefined })}
                        />
                        <Input
                          type="number"
                          placeholder={isRTL ? 'السعر إلى' : 'Price to'}
                          value={editingService.priceTo || ''}
                          onChange={e => setEditingService({ ...editingService, priceTo: parseFloat(e.target.value) || undefined })}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleUpdateService} disabled={savingService}>
                          {savingService ? <Loader2 className="h-4 w-4 animate-spin me-1" /> : <Check className="h-4 w-4 me-1" />}
                          {isRTL ? 'حفظ' : 'Save'}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingService(null)}>
                          <X className="h-4 w-4 me-1" />{isRTL ? 'إلغاء' : 'Cancel'}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium">{service.name}</h4>
                        {service.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{service.description}</p>
                        )}
                        {(service.priceFrom || service.priceTo) && (
                          <p className="text-sm text-primary mt-1 flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            {service.priceFrom && service.priceTo
                              ? `${service.priceFrom} – ${service.priceTo}`
                              : service.priceFrom || service.priceTo}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setEditingService(service)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDeleteService(service.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Social Links ── */}
      <Card>
        <CardHeader>
          <button
            className="flex items-center justify-between w-full text-start"
            onClick={() => setShowSocial(!showSocial)}
          >
            <CardTitle className="flex items-center gap-2 text-base">
              <Globe className="h-5 w-5" />
              {isRTL ? 'روابط التواصل الاجتماعي' : 'Social Media Links'}
            </CardTitle>
            {showSocial ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </CardHeader>
        {showSocial && (
          <CardContent className="space-y-3">
            {[
              { key: 'facebook', icon: Facebook, placeholder: 'https://facebook.com/...' },
              { key: 'twitter', icon: Twitter, placeholder: 'https://twitter.com/...' },
              { key: 'instagram', icon: Instagram, placeholder: 'https://instagram.com/...' },
              { key: 'linkedin', icon: Linkedin, placeholder: 'https://linkedin.com/company/...' },
              { key: 'youtube', icon: Youtube, placeholder: 'https://youtube.com/...' },
            ].map(({ key, icon: Icon, placeholder }) => (
              <div key={key} className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <Input
                  placeholder={placeholder}
                  value={(socialLinks as any)[key] || ''}
                  onChange={e => setSocialLinks({ ...socialLinks, [key]: e.target.value })}
                />
              </div>
            ))}
          </CardContent>
        )}
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSaveProfile} disabled={isSaving} size="lg">
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin me-2" /> : <Save className="h-4 w-4 me-2" />}
          {isRTL ? 'حفظ جميع التغييرات' : 'Save All Changes'}
        </Button>
      </div>
    </div>
  );
}
