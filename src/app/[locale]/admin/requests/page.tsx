'use client';

/**
 * Admin Requests Management Page
 *
 * Features:
 * - "Pending Approval" tab — shows unapproved user-submitted requests
 * - "All Requests" tab — full list with status filter
 * - Approve ✅ / Reject ❌ actions with optional reason dialog
 * - Live pending count badge
 * - Bilingual (AR/EN, RTL/LTR)
 */

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { FileText, Search, Eye, CheckCircle, XCircle, Clock, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageSkeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/composite';
import { Input } from '@/components/ui/input';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';

type Tab = 'pending' | 'all';

export default function AdminRequestsPage() {
  const locale = useLocale();
  const t = useTranslations('admin');
  const isAr = locale === 'ar';
  const d = (en: string, ar: string) => (isAr ? ar : en);

  // ── State ──────────────────────────────────────────────────────────────────
  const [tab, setTab] = useState<Tab>('pending');
  const [requests, setRequests] = useState<any[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [rejectDialogId, setRejectDialogId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // ── Fetch helpers ──────────────────────────────────────────────────────────
  const fetchPendingCount = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/requests/pending');
      const json = await res.json();
      setPendingCount(json.count ?? 0);
    } catch {/* non-critical */ }
  }, []);

  const fetchRequests = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (tab === 'pending') {
        params.set('status', 'PENDING');
      } else {
        if (statusFilter) params.set('status', statusFilter);
      }
      if (search) params.set('search', search);

      const res = await fetch(`/api/admin/requests?${params}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setRequests(data.requests || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotal(data.pagination?.total || 0);
    } catch {
      toast.error(d('Failed to load requests', 'فشل تحميل الطلبات'));
    } finally {
      setIsLoading(false);
    }
  }, [page, search, statusFilter, tab]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);
  useEffect(() => { fetchPendingCount(); }, [fetchPendingCount]);

  // ── Actions ────────────────────────────────────────────────────────────────
  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/requests/${id}/approve`, { method: 'PUT' });
      if (!res.ok) throw new Error();
      toast.success(d('Request approved successfully', 'تمت الموافقة على الطلب'));
      fetchRequests();
      fetchPendingCount();
    } catch {
      toast.error(d('Failed to approve request', 'فشل في الموافقة على الطلب'));
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!rejectDialogId) return;
    setActionLoading(rejectDialogId);
    try {
      const res = await fetch(`/api/admin/requests/${rejectDialogId}/reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectReason }),
      });
      if (!res.ok) throw new Error();
      toast.success(d('Request rejected', 'تم رفض الطلب'));
      setRejectDialogId(null);
      setRejectReason('');
      fetchRequests();
      fetchPendingCount();
    } catch {
      toast.error(d('Failed to reject request', 'فشل في رفض الطلب'));
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(d('Are you sure you want to delete this project? This will also withdraw all pending offers.', 'هل أنت متأكد من حذف هذا المشروع؟ سيتم أيضاً سحب جميع العروض المعلقة.'))) return;
    setActionLoading(id);
    try {
      const res = await fetch(`/api/requests/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error');
      toast.success(d('Request deleted successfully', 'تم حذف الطلب بنجاح'));
      fetchRequests();
      fetchPendingCount();
    } catch (err: any) {
      toast.error(err.message || d('Failed to delete request', 'فشل في حذف الطلب'));
    } finally {
      setActionLoading(null);
    }
  };

  // ── Helpers ────────────────────────────────────────────────────────────────
  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      ACTIVE: 'open', IN_PROGRESS: 'warning', COMPLETED: 'completed',
      CANCELLED: 'cancelled', PENDING: 'neutral',
    };
    return <StatusBadge variant={variants[status] || 'neutral'}>{status.replace('_', ' ')}</StatusBadge>;
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FileText className="h-8 w-8" />
          {d('Project Requests', 'طلبات المشاريع')}
        </h1>
        <p className="text-muted-foreground mt-1">
          {d(`Manage service requests (${total} total)`, `إدارة الطلبات (${total} إجمالي)`)}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b">
        <button
          onClick={() => { setTab('pending'); setPage(1); }}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === 'pending'
            ? 'border-primary text-primary'
            : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
        >
          <Clock className="h-4 w-4" />
          {d('Pending Approval', 'بانتظار الموافقة')}
          {pendingCount > 0 && (
            <Badge variant="destructive" className="text-[10px] h-4 px-1.5">{pendingCount}</Badge>
          )}
        </button>
        <button
          onClick={() => { setTab('all'); setPage(1); setStatusFilter(''); }}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === 'all'
            ? 'border-primary text-primary'
            : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
        >
          <FileText className="h-4 w-4" />
          {d('All Requests', 'جميع الطلبات')}
        </button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={d('Search requests...', 'ابحث في الطلبات...')}
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="ps-9"
              />
            </div>
            {tab === 'all' && (
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="border rounded-md px-3 py-2 text-sm bg-background"
              >
                <option value="">{d('All Status', 'جميع الحالات')}</option>
                <option value="PENDING">{d('Pending', 'معلق')}</option>
                <option value="ACTIVE">{d('Active', 'نشط')}</option>
                <option value="CANCELLED">{d('Cancelled', 'ملغي')}</option>
                <option value="IN_PROGRESS">{d('In Progress', 'قيد التنفيذ')}</option>
                <option value="COMPLETED">{d('Completed', 'مكتمل')}</option>
              </select>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <PageSkeleton />
          ) : requests.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Clock className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p>
                {tab === 'pending'
                  ? d('No requests pending approval 🎉', 'لا توجد طلبات بانتظار الموافقة 🎉')
                  : d('No requests found', 'لا توجد طلبات')}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-start p-3 font-medium">{d('Title', 'العنوان')}</th>
                    <th className="text-start p-3 font-medium">{d('User', 'المستخدم')}</th>
                    <th className="text-start p-3 font-medium">{d('Category', 'الفئة')}</th>
                    <th className="text-start p-3 font-medium">{d('Status', 'الحالة')}</th>
                    <th className="text-start p-3 font-medium">{d('Submitted', 'تاريخ الإرسال')}</th>
                    <th className="text-start p-3 font-medium">{d('Actions', 'الإجراءات')}</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr key={req.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-medium max-w-xs truncate">{req.title}</td>
                      <td className="p-3 text-muted-foreground">{req.user?.name || req.user?.email || '—'}</td>
                      <td className="p-3 text-muted-foreground">{isAr ? req.category?.nameAr : req.category?.nameEn || '—'}</td>
                      <td className="p-3">{getStatusBadge(req.status)}</td>
                      <td className="p-3 text-muted-foreground">{new Date(req.createdAt).toLocaleDateString(locale)}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <Link href={`/${locale}/requests/${req.id}`}>
                            <Button variant="ghost" size="sm" title={d('View', 'عرض')}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          {req.status === 'PENDING' && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => handleApprove(req.id)}
                                disabled={actionLoading === req.id}
                                title={d('Approve', 'موافقة')}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => { setRejectDialogId(req.id); setRejectReason(''); }}
                                disabled={actionLoading === req.id}
                                title={d('Reject', 'رفض')}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleDelete(req.id)}
                            disabled={actionLoading === req.id}
                            title={d('Delete', 'حذف')}
                          >
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {d(`Page ${page} of ${totalPages}`, `صفحة ${page} من ${totalPages}`)}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage(p => p - 1)} disabled={page <= 1}>
              {d('Previous', 'السابق')}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}>
              {d('Next', 'التالي')}
            </Button>
          </div>
        </div>
      )}

      {/* Reject Reason Dialog */}
      {rejectDialogId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-background rounded-xl shadow-2xl w-full max-w-md p-6 space-y-4" dir={isAr ? 'rtl' : 'ltr'}>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              {d('Reject Request', 'رفض الطلب')}
            </h3>
            <p className="text-sm text-muted-foreground">
              {d('Optionally provide a reason that will be emailed to the user.', 'يمكنك تقديم سبب سيتم إرساله للمستخدم عبر البريد الإلكتروني.')}
            </p>
            <textarea
              className="w-full border rounded-lg p-3 text-sm bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
              placeholder={d('Reason for rejection (optional)...', 'سبب الرفض (اختياري)...')}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              maxLength={1000}
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setRejectDialogId(null)}>
                {d('Cancel', 'إلغاء')}
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={!!actionLoading}
              >
                {d('Confirm Reject', 'تأكيد الرفض')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
