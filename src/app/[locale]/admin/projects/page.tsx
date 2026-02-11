'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Briefcase, Search, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/composite';
import { Input } from '@/components/ui/input';
import { useLocale, useTranslations } from 'next-intl';

export default function AdminProjectsPage() {
  const locale = useLocale();
  const t = useTranslations('admin');
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      const res = await fetch(`/api/admin/projects?${params}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProjects(data.projects || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotal(data.pagination?.total || 0);
    } catch {
      toast.error('Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      ACTIVE: 'active',
      PENDING: 'pending',
      COMPLETED: 'completed',
      CANCELLED: 'cancelled',
      ON_HOLD: 'warning',
    };
    return <StatusBadge variant={variants[status] || 'neutral'}>{status.replace('_', ' ')}</StatusBadge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Briefcase className="h-8 w-8" />
          {t('sidebar.projects')}
        </h1>
        <p className="text-muted-foreground mt-1">Monitor all projects ({total} total)</p>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No projects found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-start p-3 font-medium">Title</th>
                    <th className="text-start p-3 font-medium">User</th>
                    <th className="text-start p-3 font-medium">Company</th>
                    <th className="text-start p-3 font-medium">Status</th>
                    <th className="text-start p-3 font-medium">Messages</th>
                    <th className="text-start p-3 font-medium">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-medium">{project.title || '—'}</td>
                      <td className="p-3 text-muted-foreground">{project.user?.name || project.user?.email || '—'}</td>
                      <td className="p-3 text-muted-foreground">{project.company?.name || '—'}</td>
                      <td className="p-3">{getStatusBadge(project.status)}</td>
                      <td className="p-3 text-muted-foreground">{project._count?.messages || 0}</td>
                      <td className="p-3 text-muted-foreground">{new Date(project.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage(p => p - 1)} disabled={page <= 1}>Previous</Button>
            <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}>Next</Button>
          </div>
        </div>
      )}
    </div>
  );
}
