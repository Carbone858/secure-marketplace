'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Flag, Loader2, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useLocale, useTranslations } from 'next-intl';

export default function AdminFeatureFlagsPage() {
  const locale = useLocale();
  const t = useTranslations('admin');
  const [flags, setFlags] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newFlag, setNewFlag] = useState({ key: '', value: false, description: '', category: '' });

  const fetchFlags = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/feature-flags');
      if (!res.ok) throw new Error();
      const data = await res.json();
      setFlags(data.flags || []);
    } catch {
      toast.error('Failed to load feature flags');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchFlags(); }, [fetchFlags]);

  const toggleFlag = async (flag: any) => {
    const newValue = !flag.value;
    try {
      const res = await fetch('/api/admin/feature-flags', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: flag.id, value: newValue }),
      });
      if (!res.ok) throw new Error();
      toast.success(`${flag.key} ${newValue ? 'enabled' : 'disabled'}`);
      fetchFlags();
    } catch {
      toast.error('Failed to toggle flag');
    }
  };

  const createFlag = async () => {
    try {
      const res = await fetch('/api/admin/feature-flags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFlag),
      });
      if (!res.ok) throw new Error();
      toast.success('Flag created');
      setShowCreate(false);
      setNewFlag({ key: '', value: false, description: '', category: '' });
      fetchFlags();
    } catch {
      toast.error('Failed to create flag');
    }
  };

  // Group flags by category
  const grouped = flags.reduce((acc: Record<string, any[]>, flag) => {
    const cat = flag.category || 'other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(flag);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Flag className="h-8 w-8" />
            Feature Flags
          </h1>
          <p className="text-muted-foreground mt-1">Control platform features and Phase 2 capabilities</p>
        </div>
        <Button onClick={() => setShowCreate(!showCreate)}>
          <Plus className="h-4 w-4 mr-2" /> New Flag
        </Button>
      </div>

      {showCreate && (
        <Card>
          <CardHeader><CardTitle>Create Feature Flag</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="Key (e.g. isFeatureEnabled)" value={newFlag.key} onChange={(e) => setNewFlag({ ...newFlag, key: e.target.value })} />
              <select
                value={newFlag.value ? 'true' : 'false'}
                onChange={(e) => setNewFlag({ ...newFlag, value: e.target.value === 'true' })}
                className="border rounded-md px-3 py-2 text-sm bg-background"
              >
                <option value="false">Disabled (false)</option>
                <option value="true">Enabled (true)</option>
              </select>
              <Input placeholder="Category" value={newFlag.category} onChange={(e) => setNewFlag({ ...newFlag, category: e.target.value })} />
              <Input placeholder="Description" value={newFlag.description} onChange={(e) => setNewFlag({ ...newFlag, description: e.target.value })} />
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={createFlag}>Create</Button>
              <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        Object.entries(grouped).map(([category, categoryFlags]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="text-lg capitalize">{category}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {categoryFlags.map((flag: any) => (
                <div key={flag.id} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono bg-muted px-2 py-0.5 rounded">{flag.key}</code>
                      <Badge variant={flag.value ? 'default' : 'secondary'}>
                        {flag.value ? 'ON' : 'OFF'}
                      </Badge>
                    </div>
                    {flag.description && (
                      <p className="text-sm text-muted-foreground">{flag.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => toggleFlag(flag)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      flag.value ? 'bg-success' : 'bg-muted'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-background shadow-sm transition-transform ${
                        flag.value ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
