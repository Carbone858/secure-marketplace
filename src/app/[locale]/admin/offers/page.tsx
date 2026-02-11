'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { DollarSign, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/composite';
import { useLocale, useTranslations } from 'next-intl';

export default function AdminOffersPage() {
  const locale = useLocale();
  const t = useTranslations('admin');
  const [offers, setOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchOffers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      const res = await fetch(`/api/admin/offers?${params}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setOffers(data.offers || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotal(data.pagination?.total || 0);
    } catch {
      toast.error('Failed to load offers');
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchOffers(); }, [fetchOffers]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      PENDING: 'pending',
      ACCEPTED: 'success',
      REJECTED: 'rejected',
      WITHDRAWN: 'neutral',
      EXPIRED: 'warning',
    };
    return <StatusBadge variant={variants[status] || 'neutral'}>{status}</StatusBadge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <DollarSign className="h-8 w-8" />
          Offers
        </h1>
        <p className="text-muted-foreground mt-1">Monitor company offers ({total} total)</p>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : offers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No offers found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-start p-3 font-medium">Request</th>
                    <th className="text-start p-3 font-medium">Company</th>
                    <th className="text-start p-3 font-medium">Amount</th>
                    <th className="text-start p-3 font-medium">Status</th>
                    <th className="text-start p-3 font-medium">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {offers.map((offer) => (
                    <tr key={offer.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-medium max-w-xs truncate">{offer.request?.title || '—'}</td>
                      <td className="p-3 text-muted-foreground">{offer.company?.name || '—'}</td>
                      <td className="p-3">{offer.amount ? `$${offer.amount}` : '—'}</td>
                      <td className="p-3">{getStatusBadge(offer.status)}</td>
                      <td className="p-3 text-muted-foreground">{new Date(offer.createdAt).toLocaleDateString()}</td>
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
