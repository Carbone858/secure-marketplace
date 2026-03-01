'use client';

/**
 * Admin Feature Flags Page — Fully Dynamic
 *
 * Features:
 * - Dynamic 🟢 vs Developer-Only 🟡 visual separation
 * - Bilingual labels (EN/AR) with RTL support
 * - Search + Category filter
 * - Audit log panel with filter by flag / date
 * - Confirmation on developer-only flag attempt
 * - Live toggle with instant cache propagation
 */

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Flag, Plus, Lock, RefreshCw, Search, History, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useLocale, useTranslations } from 'next-intl';
import { PageSkeleton } from '@/components/ui/skeleton';

type FeatureFlag = {
  id: string;
  key: string;
  value: boolean;
  nameEn?: string;
  nameAr?: string;
  description?: string;
  descriptionAr?: string;
  category: string;
  isDynamic: boolean;
  sortOrder: number;
  updatedAt: string;
};

type AuditEntry = {
  id: string;
  flagKey: string;
  adminName?: string;
  prevValue: boolean;
  newValue: boolean;
  createdAt: string;
};

export default function AdminFeatureFlagsPage() {
  const locale = useLocale();
  const isAr = locale === 'ar';
  const d = (en: string, ar: string) => (isAr ? ar : en);

  // ── State ──────────────────────────────────────────────────────────────────
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showAudit, setShowAudit] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditFlagFilter, setAuditFlagFilter] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [newFlag, setNewFlag] = useState({ key: '', value: false, nameEn: '', nameAr: '', description: '', descriptionAr: '', category: 'General', isDynamic: true });
  const [toggling, setToggling] = useState<string | null>(null);

  // ── Fetch flags ──────────────────────────────────────────────────────────────
  const fetchFlags = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (categoryFilter) params.set('category', categoryFilter);
      if (search) params.set('search', search);
      const res = await fetch(`/api/admin/feature-flags?${params}`);
      const data = await res.json();
      setFlags(data.flags || []);
      setCategories(data.categories || []);
    } catch {
      toast.error(d('Failed to load flags', 'فشل تحميل الخواص'));
    } finally {
      setIsLoading(false);
    }
  }, [categoryFilter, search]);

  useEffect(() => { fetchFlags(); }, [fetchFlags]);

  // ── Fetch audit log ──────────────────────────────────────────────────────────
  const fetchAudit = useCallback(async () => {
    setAuditLoading(true);
    try {
      const params = new URLSearchParams({ limit: '50' });
      if (auditFlagFilter) params.set('flagKey', auditFlagFilter);
      const res = await fetch(`/api/admin/feature-flags/audit?${params}`);
      const data = await res.json();
      setAuditLogs(data.logs || []);
    } catch {
      toast.error(d('Failed to load audit log', 'فشل تحميل سجل التدقيق'));
    } finally {
      setAuditLoading(false);
    }
  }, [auditFlagFilter]);

  useEffect(() => { if (showAudit) fetchAudit(); }, [showAudit, fetchAudit]);

  // ── Toggle ────────────────────────────────────────────────────────────────────
  const toggleFlag = async (flag: FeatureFlag) => {
    if (toggling) return;
    setToggling(flag.id);
    try {
      const res = await fetch('/api/admin/feature-flags', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: flag.id, value: !flag.value }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || d('Failed to toggle flag', 'فشل تبديل الخاصية'));
        return;
      }
      const label = isAr ? (flag.nameAr || flag.key) : (flag.nameEn || flag.key);
      toast.success(`${label} — ${!flag.value ? d('Enabled', 'مفعّل') : d('Disabled', 'معطّل')}`);
      fetchFlags();
      if (showAudit) fetchAudit();
    } catch {
      toast.error(d('Error toggling flag', 'خطأ في تبديل الخاصية'));
    } finally {
      setToggling(null);
    }
  };

  // ── Create ────────────────────────────────────────────────────────────────────
  const createFlag = async () => {
    try {
      const res = await fetch('/api/admin/feature-flags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFlag),
      });
      if (!res.ok) {
        const d2 = await res.json();
        toast.error(d2.error || 'Error');
        return;
      }
      toast.success(d('Flag created', 'تم إنشاء الخاصية'));
      setShowCreate(false);
      setNewFlag({ key: '', value: false, nameEn: '', nameAr: '', description: '', descriptionAr: '', category: 'General', isDynamic: true });
      fetchFlags();
    } catch {
      toast.error(d('Failed to create flag', 'فشل إنشاء الخاصية'));
    }
  };

  // ── Split flags ────────────────────────────────────────────────────────────────
  const dynamicFlags = flags.filter(f => f.isDynamic);
  const developerFlags = flags.filter(f => !f.isDynamic);

  const groupByCategory = (arr: FeatureFlag[]) =>
    arr.reduce((acc: Record<string, FeatureFlag[]>, f) => {
      (acc[f.category] = acc[f.category] || []).push(f);
      return acc;
    }, {});

  const dynGroups = groupByCategory(dynamicFlags);
  const devGroups = groupByCategory(developerFlags);

  // ── Toggle switch component ──────────────────────────────────────────────────
  const ToggleSwitch = ({ flag }: { flag: FeatureFlag }) => (
    <button
      onClick={() => toggleFlag(flag)}
      disabled={!!toggling || !flag.isDynamic}
      title={!flag.isDynamic ? d('Developer-only flag: requires a code deploy to change safely.', 'خاصية للمطورين فقط: تتطلب نشر كود لتغييرها بأمان.') : undefined}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
        ${flag.value ? 'bg-emerald-500' : 'bg-muted'}
        ${!flag.isDynamic ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:opacity-90'}
        ${toggling === flag.id ? 'animate-pulse' : ''}
      `}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform
        ${flag.value ? 'ltr:translate-x-6 rtl:-translate-x-6' : 'ltr:translate-x-1 rtl:-translate-x-1'}
      `} />
    </button>
  );

  // ── Flag row ─────────────────────────────────────────────────────────────────
  const FlagRow = ({ flag }: { flag: FeatureFlag }) => {
    const name = isAr ? (flag.nameAr || flag.key) : (flag.nameEn || flag.key);
    const desc = isAr ? (flag.descriptionAr || flag.description || '') : (flag.description || '');
    return (
      <div className="flex items-start justify-between py-4 border-b last:border-0 gap-4">
        <div className="space-y-1 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-sm">{name}</span>
            <code className="text-[11px] font-mono bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
              {flag.key}
            </code>
            {flag.isDynamic ? (
              <Badge className="text-[10px] px-1.5 bg-emerald-100 text-emerald-700 border-emerald-200">
                🟢 {d('Dynamic', 'ديناميكي')}
              </Badge>
            ) : (
              <Badge className="text-[10px] px-1.5 bg-amber-100 text-amber-700 border-amber-200">
                <Lock className="h-2.5 w-2.5 me-1" />
                {d('Dev-Only', 'مطورون فقط')}
              </Badge>
            )}
            <Badge variant={flag.value ? 'default' : 'secondary'} className="text-[10px] px-1.5">
              {flag.value ? d('ON', 'مفعّل') : d('OFF', 'معطّل')}
            </Badge>
          </div>
          {desc && <p className="text-xs text-muted-foreground">{desc}</p>}
          {!flag.isDynamic && (
            <p className="text-xs text-amber-600/80 italic">
              ⚠️ {d('Requires code change to activate safely.', 'يتطلب تغيير في الكود ليعمل بأمان.')}
            </p>
          )}
        </div>
        <ToggleSwitch flag={flag} />
      </div>
    );
  };

  // ── Category section ──────────────────────────────────────────────────────────
  const CategorySection = ({ title, groups, emptyMsg }: { title: string; groups: Record<string, FeatureFlag[]>; emptyMsg: string }) => (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">{title}</h2>
      {Object.keys(groups).length === 0 ? (
        <p className="text-muted-foreground text-sm">{emptyMsg}</p>
      ) : (
        Object.entries(groups).map(([cat, catFlags]) => (
          <Card key={cat}>
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{cat}</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-2">
              {catFlags.map(f => <FlagRow key={f.id} flag={f} />)}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );

  // ── Render ─────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Flag className="h-8 w-8" />
            {d('Feature Flags', 'خواص المنصة')}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {d('Control platform features in real-time. Dynamic flags take effect within 60 seconds.', 'تحكم في ميزات المنصة في الوقت الفعلي. تأثير التغييرات الديناميكية خلال ٦٠ ثانية.')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchFlags}>
            <RefreshCw className="h-4 w-4 me-1" /> {d('Refresh', 'تحديث')}
          </Button>
          <Button size="sm" onClick={() => setShowCreate(!showCreate)}>
            <Plus className="h-4 w-4 me-1" /> {d('New Flag', 'خاصية جديدة')}
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-xs text-muted-foreground flex-wrap">
        <span className="flex items-center gap-1">🟢 {d('Dynamic — toggles instantly from this dashboard', 'ديناميكي — يتفعل فورًا من لوحة التحكم')}</span>
        <span className="flex items-center gap-1"><Lock className="h-3 w-3" /> {d("Developer-Only — requires code changes (SUPER_ADMIN can override)", "للمطورين — يتطلب تغيير كود (يمكن للـ SUPER_ADMIN تجاوزه)")}</span>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={d('Search flags...', 'ابحث في الخواص...')}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="ps-9 h-8 text-sm"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="border rounded-md px-3 py-1.5 text-sm bg-background h-8 min-w-[140px]"
            >
              <option value="">{d('All Categories', 'جميع الفئات')}</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Create Form */}
      {showCreate && (
        <Card className="border-primary/30">
          <CardHeader><CardTitle className="text-base">{d('Create New Flag', 'إنشاء خاصية جديدة')}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input placeholder={d('Key (camelCase, e.g. isFeatureEnabled)', 'المفتاح (camelCase)')} value={newFlag.key} onChange={e => setNewFlag({ ...newFlag, key: e.target.value })} />
              <Input placeholder={d('English Name', 'الاسم بالإنجليزية')} value={newFlag.nameEn} onChange={e => setNewFlag({ ...newFlag, nameEn: e.target.value })} />
              <Input placeholder={d('Arabic Name', 'الاسم بالعربية')} value={newFlag.nameAr} onChange={e => setNewFlag({ ...newFlag, nameAr: e.target.value })} />
              <Input placeholder={d('Category', 'الفئة')} value={newFlag.category} onChange={e => setNewFlag({ ...newFlag, category: e.target.value })} />
              <Input placeholder={d('Description (English)', 'الوصف بالإنجليزية')} value={newFlag.description} onChange={e => setNewFlag({ ...newFlag, description: e.target.value })} />
              <Input placeholder={d('Description (Arabic)', 'الوصف بالعربية')} value={newFlag.descriptionAr} onChange={e => setNewFlag({ ...newFlag, descriptionAr: e.target.value })} />
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={newFlag.isDynamic} onChange={e => setNewFlag({ ...newFlag, isDynamic: e.target.checked })} />
                {d('Dynamic (admin can toggle)', 'ديناميكي (يمكن للمشرف تبديله)')}
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                {d('Default:', ' القيمة الافتراضية:')}
                <select value={newFlag.value ? 'true' : 'false'} onChange={e => setNewFlag({ ...newFlag, value: e.target.value === 'true' })} className="border rounded px-2 py-0.5 text-sm bg-background">
                  <option value="false">OFF</option>
                  <option value="true">ON</option>
                </select>
              </label>
            </div>
            <div className="flex gap-2">
              <Button onClick={createFlag} size="sm">{d('Create', 'إنشاء')}</Button>
              <Button variant="outline" size="sm" onClick={() => setShowCreate(false)}>{d('Cancel', 'إلغاء')}</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Flag Lists */}
      {isLoading ? <PageSkeleton /> : (
        <div className="space-y-8">
          <CategorySection
            title={`🟢 ${d('Dynamic Flags', 'الخواص الديناميكية')} (${dynamicFlags.length})`}
            groups={dynGroups}
            emptyMsg={d('No dynamic flags found.', 'لا توجد خواص ديناميكية.')}
          />
          <CategorySection
            title={`🟡 ${d('Developer-Only Flags', 'خواص المطورين')} (${developerFlags.length})`}
            groups={devGroups}
            emptyMsg={d('No developer-only flags found.', 'لا توجد خواص للمطورين.')}
          />
        </div>
      )}

      {/* Audit Log Panel */}
      <Card>
        <CardHeader className="cursor-pointer pb-3" onClick={() => setShowAudit(v => !v)}>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <History className="h-4 w-4" />
              {d('Audit Log', 'سجل التغييرات')}
            </CardTitle>
            {showAudit ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </CardHeader>
        {showAudit && (
          <CardContent className="space-y-3">
            <div className="flex gap-3">
              <select
                value={auditFlagFilter}
                onChange={e => setAuditFlagFilter(e.target.value)}
                className="border rounded-md px-3 py-1.5 text-sm bg-background flex-1"
              >
                <option value="">{d('All Flags', 'جميع الخواص')}</option>
                {flags.map(f => <option key={f.key} value={f.key}>{isAr ? (f.nameAr || f.key) : (f.nameEn || f.key)}</option>)}
              </select>
              <Button variant="outline" size="sm" onClick={fetchAudit}>
                <RefreshCw className="h-3 w-3 me-1" /> {d('Refresh', 'تحديث')}
              </Button>
            </div>
            {auditLoading ? (
              <p className="text-sm text-muted-foreground">{d('Loading...', 'جاري التحميل...')}</p>
            ) : auditLogs.length === 0 ? (
              <p className="text-sm text-muted-foreground">{d('No audit entries yet.', 'لا توجد سجلات بعد.')}</p>
            ) : (
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-start p-2 font-medium">{d('Flag', 'الخاصية')}</th>
                      <th className="text-start p-2 font-medium">{d('Admin', 'المشرف')}</th>
                      <th className="text-start p-2 font-medium">{d('Change', 'التغيير')}</th>
                      <th className="text-start p-2 font-medium">{d('Time', 'الوقت')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map(log => (
                      <tr key={log.id} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="p-2 font-mono">{log.flagKey}</td>
                        <td className="p-2 text-muted-foreground">{log.adminName || '—'}</td>
                        <td className="p-2">
                          <span className={log.prevValue ? 'text-red-500' : 'text-muted-foreground'}>
                            {log.prevValue ? 'ON' : 'OFF'}
                          </span>
                          {' → '}
                          <span className={log.newValue ? 'text-emerald-600' : 'text-muted-foreground'}>
                            {log.newValue ? 'ON' : 'OFF'}
                          </span>
                        </td>
                        <td className="p-2 text-muted-foreground">
                          {new Date(log.createdAt).toLocaleString(locale)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
