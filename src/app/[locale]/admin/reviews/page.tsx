'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Star, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageSkeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useLocale, useTranslations } from 'next-intl';

export default function AdminReviewsPage() {
  const locale = useLocale();
  const t = useTranslations('admin');
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      const res = await fetch(`/api/admin/reviews?${params}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setReviews(data.reviews || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotal(data.pagination?.total || 0);
    } catch {
      toast.error('Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    try {
      const res = await fetch(`/api/admin/reviews?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast.success('Review deleted');
      fetchReviews();
    } catch {
      toast.error('Failed to delete review');
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i <= rating ? 'fill-warning text-warning' : 'text-muted-foreground/30'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Star className="h-8 w-8" />
          Reviews
        </h1>
        <p className="text-muted-foreground mt-1">Moderate platform reviews ({total} total)</p>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <PageSkeleton />
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">{t('reviews_mgmt.noReviews')}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-start p-3 font-medium">{t('reviews_mgmt.tableHeaders.user')}</th>
                    <th className="text-start p-3 font-medium">{t('reviews_mgmt.tableHeaders.company')}</th>
                    <th className="text-start p-3 font-medium">{t('reviews_mgmt.tableHeaders.rating')}</th>
                    <th className="text-start p-3 font-medium">{t('reviews_mgmt.tableHeaders.comment')}</th>
                    <th className="text-start p-3 font-medium">{t('reviews_mgmt.tableHeaders.date')}</th>
                    <th className="text-start p-3 font-medium">{t('reviews_mgmt.tableHeaders.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((review) => (
                    <tr key={review.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-medium">{review.user?.name || review.user?.email || '—'}</td>
                      <td className="p-3 text-muted-foreground">{review.company?.name || '—'}</td>
                      <td className="p-3">{renderStars(review.rating)}</td>
                      <td className="p-3 max-w-xs truncate text-muted-foreground">{review.comment || '—'}</td>
                      <td className="p-3 text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</td>
                      <td className="p-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive/80"
                          onClick={() => handleDelete(review.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
            <Button variant="outline" size="sm" onClick={() => setPage(p => p - 1)} disabled={page <= 1}>{t('common.previous')}</Button>
            <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}>{t('common.next')}</Button>
          </div>
        </div>
      )}
    </div>
  );
}
