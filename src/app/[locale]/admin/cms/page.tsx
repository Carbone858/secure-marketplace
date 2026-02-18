'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/components/providers/AuthProvider';
import { FileText, Plus, Edit, Trash2, Eye, EyeOff, Globe, LayoutGrid } from 'lucide-react';

interface CMSPage {
  id: string;
  title: string;
  titleAr: string | null;
  slug: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CMSSection {
  id: string;
  name: string;
  identifier: string;
  page: string;
  content: any;
  isActive: boolean;
  createdAt: string;
}

export default function AdminCMSPage() {
  const t = useTranslations('admin');
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'pages' | 'sections'>('pages');
  const [pages, setPages] = useState<CMSPage[]>([]);
  const [sections, setSections] = useState<CMSSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPage, setEditingPage] = useState<CMSPage | null>(null);
  const [editingSection, setEditingSection] = useState<CMSSection | null>(null);

  // Page form state
  const [pageForm, setPageForm] = useState({
    title: '', titleAr: '', slug: '', content: '', contentAr: '',
    metaDescription: '', isPublished: true,
  });

  // Section form state
  const [sectionForm, setSectionForm] = useState({
    name: '', identifier: '', page: 'home', content: '{}', isActive: true,
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  async function fetchData() {
    setLoading(true);
    try {
      if (activeTab === 'pages') {
        const res = await fetch('/api/cms/pages?publishedOnly=false');
        const data = await res.json();
        setPages(Array.isArray(data.pages) ? data.pages : data.page ? [data.page] : []);
      } else {
        const res = await fetch('/api/cms/sections');
        const data = await res.json();
        setSections(data.sections || []);
      }
    } catch (err) {
      console.error('Fetch CMS data error:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSavePage(e: React.FormEvent) {
    e.preventDefault();
    try {
      const url = editingPage ? `/api/cms/pages/${editingPage.id}` : '/api/cms/pages';
      const method = editingPage ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pageForm),
      });
      if (res.ok) {
        setShowForm(false);
        setEditingPage(null);
        setPageForm({ title: '', titleAr: '', slug: '', content: '', contentAr: '', metaDescription: '', isPublished: true });
        fetchData();
      }
    } catch (err) {
      console.error('Save page error:', err);
    }
  }

  async function handleSaveSection(e: React.FormEvent) {
    e.preventDefault();
    try {
      let contentJson: any;
      try {
        contentJson = JSON.parse(sectionForm.content);
      } catch {
        alert('Invalid JSON content');
        return;
      }

      const url = editingSection ? `/api/cms/sections/${editingSection.id}` : '/api/cms/sections';
      const method = editingSection ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...sectionForm,
          content: contentJson,
        }),
      });
      if (res.ok) {
        setShowForm(false);
        setEditingSection(null);
        setSectionForm({ name: '', identifier: '', page: 'home', content: '{}', isActive: true });
        fetchData();
      }
    } catch (err) {
      console.error('Save section error:', err);
    }
  }

  async function handleDeletePage(id: string) {
    if (!confirm('Delete this page?')) return;
    await fetch(`/api/cms/pages/${id}`, { method: 'DELETE' });
    fetchData();
  }

  async function handleDeleteSection(id: string) {
    if (!confirm('Delete this section?')) return;
    await fetch(`/api/cms/sections/${id}`, { method: 'DELETE' });
    fetchData();
  }

  function startEditPage(page: CMSPage) {
    setEditingPage(page);
    setPageForm({
      title: page.title,
      titleAr: page.titleAr || '',
      slug: page.slug,
      content: '',
      contentAr: '',
      metaDescription: '',
      isPublished: page.isPublished,
    });
    setShowForm(true);
  }

  function startEditSection(section: CMSSection) {
    setEditingSection(section);
    setSectionForm({
      name: section.name,
      identifier: section.identifier,
      page: section.page,
      content: JSON.stringify(section.content, null, 2),
      isActive: section.isActive,
    });
    setShowForm(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="w-6 h-6" /> {t('cms') || 'Content Management'}
        </h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingPage(null);
            setEditingSection(null);
            setPageForm({ title: '', titleAr: '', slug: '', content: '', contentAr: '', metaDescription: '', isPublished: true });
            setSectionForm({ name: '', identifier: '', page: 'home', content: '{}', isActive: true });
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" /> {activeTab === 'pages' ? 'New Page' : 'New Section'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => { setActiveTab('pages'); setShowForm(false); }}
          className={`px-4 py-2 -mb-px ${activeTab === 'pages' ? 'border-b-2 border-primary text-primary font-medium' : 'text-muted-foreground'}`}
        >
          <Globe className="w-4 h-4 inline mr-2" />Pages
        </button>
        <button
          onClick={() => { setActiveTab('sections'); setShowForm(false); }}
          className={`px-4 py-2 -mb-px ${activeTab === 'sections' ? 'border-b-2 border-primary text-primary font-medium' : 'text-muted-foreground'}`}
        >
          <LayoutGrid className="w-4 h-4 inline mr-2" />Sections
        </button>
      </div>

      {/* Form */}
      {showForm && activeTab === 'pages' && (
        <form onSubmit={handleSavePage} className="bg-card p-6 rounded-xl border space-y-4">
          <h2 className="text-lg font-medium">{editingPage ? 'Edit Page' : 'Create Page'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Title (EN)" value={pageForm.title} onChange={e => setPageForm(p => ({ ...p, title: e.target.value }))} className="w-full px-3 py-2 border rounded-lg bg-background" required />
            <input placeholder="Title (AR)" value={pageForm.titleAr} onChange={e => setPageForm(p => ({ ...p, titleAr: e.target.value }))} className="w-full px-3 py-2 border rounded-lg bg-background" />
            <input placeholder="Slug (e.g., about-us)" value={pageForm.slug} onChange={e => setPageForm(p => ({ ...p, slug: e.target.value }))} className="w-full px-3 py-2 border rounded-lg bg-background" required />
            <input placeholder="Meta description" value={pageForm.metaDescription} onChange={e => setPageForm(p => ({ ...p, metaDescription: e.target.value }))} className="w-full px-3 py-2 border rounded-lg bg-background" />
          </div>
          <textarea placeholder="Content (EN)" value={pageForm.content} onChange={e => setPageForm(p => ({ ...p, content: e.target.value }))} className="w-full px-3 py-2 border rounded-lg bg-background min-h-[120px]" required />
          <textarea placeholder="Content (AR)" value={pageForm.contentAr} onChange={e => setPageForm(p => ({ ...p, contentAr: e.target.value }))} className="w-full px-3 py-2 border rounded-lg bg-background min-h-[120px]" />
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={pageForm.isPublished} onChange={e => setPageForm(p => ({ ...p, isPublished: e.target.checked }))} />
            Published
          </label>
          <div className="flex gap-3">
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">Save</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg hover:bg-muted">Cancel</button>
          </div>
        </form>
      )}

      {showForm && activeTab === 'sections' && (
        <form onSubmit={handleSaveSection} className="bg-card p-6 rounded-xl border space-y-4">
          <h2 className="text-lg font-medium">{editingSection ? 'Edit Section' : 'Create Section'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input placeholder="Name" value={sectionForm.name} onChange={e => setSectionForm(p => ({ ...p, name: e.target.value }))} className="w-full px-3 py-2 border rounded-lg bg-background" required />
            <div>
              <input
                placeholder="Identifier (e.g., hero_banner)"
                value={sectionForm.identifier}
                onChange={e => {
                  // Auto-format: lowercase, replace spaces/special chars with underscores
                  const formatted = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '_').replace(/__+/g, '_');
                  setSectionForm(p => ({ ...p, identifier: formatted }));
                }}
                className={`w-full px-3 py-2 border rounded-lg bg-background ${sectionForm.identifier && !/^[a-z0-9_-]+$/.test(sectionForm.identifier)
                    ? 'border-destructive'
                    : ''
                  }`}
                required
                disabled={!!editingSection}
              />
              {sectionForm.identifier && !/^[a-z0-9_-]+$/.test(sectionForm.identifier) && (
                <p className="text-xs text-destructive mt-1">Only lowercase letters, numbers, underscores, hyphens</p>
              )}
            </div>
            <input placeholder="Page (e.g., home)" value={sectionForm.page} onChange={e => setSectionForm(p => ({ ...p, page: e.target.value }))} className="w-full px-3 py-2 border rounded-lg bg-background" />
          </div>
          <textarea placeholder='Content JSON (e.g., {"heading": "Welcome", "headingAr": "مرحبا"})' value={sectionForm.content} onChange={e => setSectionForm(p => ({ ...p, content: e.target.value }))} className="w-full px-3 py-2 border rounded-lg bg-background min-h-[160px] font-mono text-sm" required />
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={sectionForm.isActive} onChange={e => setSectionForm(p => ({ ...p, isActive: e.target.checked }))} />
            Active
          </label>
          <div className="flex gap-3">
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">Save</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg hover:bg-muted">Cancel</button>
          </div>
        </form>
      )}

      {/* Data Tables */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : activeTab === 'pages' ? (
        <div className="bg-card rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-start p-3 font-medium">Title</th>
                <th className="text-start p-3 font-medium">Slug</th>
                <th className="text-start p-3 font-medium">Status</th>
                <th className="text-start p-3 font-medium">Updated</th>
                <th className="text-end p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {pages.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No pages yet</td></tr>
              ) : pages.map(page => (
                <tr key={page.id} className="hover:bg-muted/30">
                  <td className="p-3">
                    <div className="font-medium">{page.title}</div>
                    {page.titleAr && <div className="text-xs text-muted-foreground" dir="rtl">{page.titleAr}</div>}
                  </td>
                  <td className="p-3 text-muted-foreground">/{page.slug}</td>
                  <td className="p-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${page.isPublished ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                      {page.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {page.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground">{new Date(page.updatedAt).toLocaleDateString()}</td>
                  <td className="p-3 text-end">
                    <button onClick={() => startEditPage(page)} className="p-1.5 rounded hover:bg-muted"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDeletePage(page.id)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-card rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-start p-3 font-medium">Name</th>
                <th className="text-start p-3 font-medium">Identifier</th>
                <th className="text-start p-3 font-medium">Page</th>
                <th className="text-start p-3 font-medium">Status</th>
                <th className="text-end p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {sections.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No sections yet</td></tr>
              ) : sections.map(section => (
                <tr key={section.id} className="hover:bg-muted/30">
                  <td className="p-3 font-medium">{section.name}</td>
                  <td className="p-3 text-muted-foreground font-mono text-xs">{section.identifier}</td>
                  <td className="p-3 text-muted-foreground">{section.page}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${section.isActive ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                      {section.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-3 text-end">
                    <button onClick={() => startEditSection(section)} className="p-1.5 rounded hover:bg-muted"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteSection(section.id)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
