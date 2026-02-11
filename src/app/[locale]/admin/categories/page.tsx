'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Tags, Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useLocale, useTranslations } from 'next-intl';

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
      toast.error('Failed to load categories');
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
      toast.success(editId ? 'Category updated' : 'Category created');
      setShowForm(false);
      setEditId(null);
      setForm({ nameEn: '', nameAr: '', slug: '', icon: '' });
      fetchCategories();
    } catch {
      toast.error('Failed to save category');
    }
  };

  const handleEdit = (cat: any) => {
    setEditId(cat.id);
    setForm({ nameEn: cat.nameEn || '', nameAr: cat.nameAr || '', slug: cat.slug || '', icon: cat.icon || '' });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed');
      }
      toast.success('Category deleted');
      fetchCategories();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Tags className="h-8 w-8" />
            Categories
          </h1>
          <p className="text-muted-foreground mt-1">Manage service categories</p>
        </div>
        <Button onClick={() => { setShowForm(true); setEditId(null); setForm({ nameEn: '', nameAr: '', slug: '', icon: '' }); }}>
          <Plus className="h-4 w-4 mr-2" /> Add Category
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editId ? 'Edit Category' : 'New Category'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="Name (English)" value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} />
              <Input placeholder="Name (Arabic)" value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} />
              <Input placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
              <Input placeholder="Icon name" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleSubmit}>{editId ? 'Update' : 'Create'}</Button>
              <Button variant="outline" onClick={() => { setShowForm(false); setEditId(null); }}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No categories found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-start p-3 font-medium">Name (EN)</th>
                    <th className="text-start p-3 font-medium">Name (AR)</th>
                    <th className="text-start p-3 font-medium">Slug</th>
                    <th className="text-start p-3 font-medium">Requests</th>
                    <th className="text-start p-3 font-medium">Actions</th>
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
