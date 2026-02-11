'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { FileText, Search, Loader2, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/composite';
import { Input } from '@/components/ui/input';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';

export default function AdminRequestsPage() {
  const locale = useLocale();
  const t = useTranslations('admin');
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchRequests = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      const res = await fetch(`/api/admin/requests?${params}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setRequests(data.requests || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotal(data.pagination?.total || 0);
    } catch {
      toast.error('Failed to load requests');
    } finally {
      setIsLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      OPEN: 'open',
      IN_PROGRESS: 'warning',
      COMPLETED: 'completed',
      CANCELLED: 'cancelled',
      CLOSED: 'closed',
    };
    return <StatusBadge variant={variants[status] || 'neutral'}>{status.replace('_', ' ')}</StatusBadge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FileText className="h-8 w-8" />
          {t('sidebar.requests')}
        </h1>
        <p className="text-muted-foreground mt-1">Manage service requests ({total} total)</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search requests..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-9"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="border rounded-md px-3 py-2 text-sm bg-background"
            >
              <option value="">All Status</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No requests found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-start p-3 font-medium">Title</th>
                    <th className="text-start p-3 font-medium">User</th>
                    <th className="text-start p-3 font-medium">Category</th>
                    <th className="text-start p-3 font-medium">Status</th>
                    <th className="text-start p-3 font-medium">Budget</th>
                    <th className="text-start p-3 font-medium">Created</th>
                    <th className="text-start p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr key={req.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-medium max-w-xs truncate">{req.title}</td>
                      <td className="p-3 text-muted-foreground">{req.user?.name || req.user?.email || '—'}</td>
                      <td className="p-3 text-muted-foreground">{req.category?.nameEn || '—'}</td>
                      <td className="p-3">{getStatusBadge(req.status)}</td>
                      <td className="p-3">{req.budget ? `$${req.budget}` : '—'}</td>
                      <td className="p-3 text-muted-foreground">{new Date(req.createdAt).toLocaleDateString()}</td>
                      <td className="p-3">
                        <Link href={`/${locale}/requests/${req.id}`}>
                          <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                        </Link>
                      </td>
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
