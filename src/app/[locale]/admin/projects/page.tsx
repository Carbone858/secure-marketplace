'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Briefcase, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageSkeleton } from '@/components/ui/skeleton';
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
            <PageSkeleton />
          ) : projects.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">{t('projects_mgmt.noProjects')}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-start p-3 font-medium">{t('projects_mgmt.tableHeaders.title')}</th>
                    <th className="text-start p-3 font-medium">{t('projects_mgmt.tableHeaders.user')}</th>
                    <th className="text-start p-3 font-medium">{t('projects_mgmt.tableHeaders.company')}</th>
                    <th className="text-start p-3 font-medium">{t('projects_mgmt.tableHeaders.status')}</th>
                    <th className="text-start p-3 font-medium">{t('projects_mgmt.tableHeaders.messages')}</th>
                    <th className="text-start p-3 font-medium">{t('projects_mgmt.tableHeaders.created')}</th>
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
            <Button variant="outline" size="sm" onClick={() => setPage(p => p - 1)} disabled={page <= 1}>{t('common.previous')}</Button>
            <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}>{t('common.next')}</Button>
          </div>
        </div>
      )}
    </div>
  );
}
