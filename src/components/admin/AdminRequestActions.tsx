'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocale } from 'next-intl';

interface AdminRequestActionsProps {
  requestId: string;
  status: string;
}

export function AdminRequestActions({ requestId, status }: AdminRequestActionsProps) {
  const locale = useLocale();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const handleApprove = async () => {
    setIsLoading('approve');
    try {
      const res = await fetch(`/api/admin/requests/${requestId}/approve`, { method: 'PUT' });
      if (!res.ok) throw new Error();
      toast.success('Request approved successfully');
      router.refresh(); // Refresh the server component data
    } catch {
      toast.error('Failed to approve request');
    } finally {
      setIsLoading(null);
    }
  };

  const handleReject = async () => {
    setIsLoading('reject');
    try {
      const res = await fetch(`/api/admin/requests/${requestId}/reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectReason }),
      });
      if (!res.ok) throw new Error();
      toast.success('Request rejected');
      setShowRejectDialog(false);
      router.refresh();
    } catch {
      toast.error('Failed to reject request');
    } finally {
      setIsLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this project? This will also withdraw all pending offers.')) return;
    setIsLoading('delete');
    try {
      const res = await fetch(`/api/requests/${requestId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast.success('Request deleted successfully');
      router.push(`/${locale}/admin/requests`);
    } catch {
      toast.error('Failed to delete request');
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="flex items-center gap-2 border-l ps-4 ml-4">
      {status === 'PENDING' && (
        <>
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white gap-2"
            onClick={handleApprove}
            disabled={!!isLoading}
          >
            {isLoading === 'approve' ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
            Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-red-600 border-red-200 hover:bg-red-50 gap-2"
            onClick={() => setShowRejectDialog(true)}
            disabled={!!isLoading}
          >
            <XCircle className="h-4 w-4" />
            Reject
          </Button>
        </>
      )}
      <Button
        size="sm"
        variant="ghost"
        className="text-muted-foreground hover:text-red-600 hover:bg-red-50"
        onClick={handleDelete}
        disabled={!!isLoading}
        title="Delete Request"
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      {/* Reject Reason Dialog */}
      {showRejectDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-background rounded-xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              Reject Request
            </h3>
            <p className="text-sm text-muted-foreground">
              Optionally provide a reason that will be emailed to the user.
            </p>
            <textarea
              className="w-full border rounded-lg p-3 text-sm bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
              placeholder="Reason for rejection (optional)..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              maxLength={1000}
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={!!isLoading}
              >
                {isLoading === 'reject' ? 'Processing...' : 'Confirm Reject'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
