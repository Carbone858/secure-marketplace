'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Tags, Plus, Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useLocale, useTranslations } from 'next-intl';
import { PageSkeleton } from '@/components/ui/skeleton';

export default function AdminCategoriesPage() {
  const locale = useLocale();
  const t = useTranslations('admin');
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ nameEn: '', nameAr: '', slug: '', icon: '' });

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/categories');
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCategories(data.categories || []);
    } catch {
      toast.error(t('categories_mgmt.toasts.loadFailed'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const handleSubmit = async () => {
    try {
      const url = editId ? `/api/admin/categories/${editId}` : '/api/admin/categories';
      const method = editId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success(editId ? t('categories_mgmt.toasts.updated') : t('categories_mgmt.toasts.created'));
      setShowForm(false);
      setEditId(null);
      setForm({ nameEn: '', nameAr: '', slug: '', icon: '' });
      fetchCategories();
    } catch {
      toast.error(t('categories_mgmt.toasts.saveFailed'));
    }
  };

  const handleEdit = (cat: any) => {
    setEditId(cat.id);
    setForm({ nameEn: cat.nameEn || '', nameAr: cat.nameAr || '', slug: cat.slug || '', icon: cat.icon || '' });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('categories_mgmt.confirmDelete'))) return;
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed');
      }
      toast.success(t('categories_mgmt.toasts.deleted'));
      fetchCategories();
    } catch (err: any) {
      toast.error(err.message || t('categories_mgmt.toasts.deleteFailed'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Tags className="h-8 w-8" />
            {t('categories_mgmt.title')}
          </h1>
          <p className="text-muted-foreground mt-1">{t('categories_mgmt.subtitle')}</p>
        </div>
        <Button onClick={() => { setShowForm(true); setEditId(null); setForm({ nameEn: '', nameAr: '', slug: '', icon: '' }); }}>
          <Plus className="h-4 w-4 me-2" /> {t('categories_mgmt.addCategory')}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editId ? t('categories_mgmt.editCategory') : t('categories_mgmt.newCategory')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder={t('categories_mgmt.nameEn')} value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} />
              <Input placeholder={t('categories_mgmt.nameAr')} value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} />
              <Input placeholder={t('categories_mgmt.slug')} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
              <Input placeholder={t('categories_mgmt.iconName')} value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleSubmit}>{editId ? t('common.save') : t('common.create')}</Button>
              <Button variant="outline" onClick={() => { setShowForm(false); setEditId(null); }}>{t('common.cancel')}</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <PageSkeleton />
          ) : categories.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">{t('categories_mgmt.noCategories')}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-start p-3 font-medium">{t('categories_mgmt.tableHeaders.nameEn')}</th>
                    <th className="text-start p-3 font-medium">{t('categories_mgmt.tableHeaders.nameAr')}</th>
                    <th className="text-start p-3 font-medium">{t('categories_mgmt.tableHeaders.slug')}</th>
                    <th className="text-start p-3 font-medium">{t('categories_mgmt.tableHeaders.requests')}</th>
                    <th className="text-start p-3 font-medium">{t('categories_mgmt.tableHeaders.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-medium">{cat.nameEn}</td>
                      <td className="p-3">{cat.nameAr || '—'}</td>
                      <td className="p-3 text-muted-foreground">{cat.slug}</td>
                      <td className="p-3">
                        <Badge variant="secondary">{cat._count?.requests || 0}</Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(cat)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive/80" onClick={() => handleDelete(cat.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
