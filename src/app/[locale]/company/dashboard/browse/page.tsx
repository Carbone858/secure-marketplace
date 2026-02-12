'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Search, Loader2, MapPin, Calendar, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';

export default function BrowseRequestsPage() {
  const locale = useLocale();
  const t = useTranslations('company_dashboard');
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchRequests = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '12',
        status: 'ACTIVE',
      });
      if (search) params.set('search', search);
      const res = await fetch(`/api/requests?${params}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setRequests(data.requests || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch {
      toast.error(t('browse.noResults'));
    } finally {
      setIsLoading(false);
    }
  }, [page, search, t]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('browse.title')}</h1>
        <p className="text-muted-foreground mt-1">{t('browse.subtitle')}</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('browse.searchPlaceholder')}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="ps-9"
            />
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : requests.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">{t('browse.noResults')}</h3>
            <p className="text-muted-foreground mt-1">{t('browse.noResultsDesc')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {requests.map((req) => (
            <Card key={req.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-2">{req.title}</CardTitle>
                  <Badge variant="secondary" className="flex-shrink-0 ms-2">{t(`status.${req.status}`)}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-3">{req.description}</p>
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                  {req.budgetMax && (
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />{req.budgetMin ? `${req.budgetMin}-` : ''}{req.budgetMax} {req.currency}
                    </span>
                  )}
                  {req.city && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />{locale === 'ar' && req.city.nameAr ? req.city.nameAr : req.city.nameEn}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />{new Date(req.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {req.category && (
                  <Badge variant="outline">{locale === 'ar' && req.category.nameAr ? req.category.nameAr : req.category.nameEn}</Badge>
                )}
                <Link href={`/${locale}/requests/${req.id}`}>
                  <Button className="w-full mt-2">{t('browse.viewDetails')}</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" onClick={() => setPage(p => p - 1)} disabled={page <= 1}>{t('browse.previous')}</Button>
          <span className="text-sm text-muted-foreground">{t('browse.pageOf', { page, total: totalPages })}</span>
          <Button variant="outline" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}>{t('browse.next')}</Button>
        </div>
      )}
    </div>
  );
}
