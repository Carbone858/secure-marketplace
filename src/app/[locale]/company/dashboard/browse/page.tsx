'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Search, Loader2, MapPin, Calendar, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/ui/composite';
import { useLocale } from 'next-intl';
import Link from 'next/link';

export default function BrowseRequestsPage() {
  const locale = useLocale();
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchRequests = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '12', status: 'OPEN' });
      if (search) params.set('search', search);
      const res = await fetch(`/api/requests?${params}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setRequests(data.requests || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch {
      toast.error('Failed to load requests');
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Browse Requests</h1>
        <p className="text-muted-foreground mt-1">Find service requests to submit offers</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search requests by title, description..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9"
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
            <h3 className="text-lg font-medium">No open requests found</h3>
            <p className="text-muted-foreground mt-1">Check back later for new opportunities</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {requests.map((req) => (
            <Card key={req.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-2">{req.title}</CardTitle>
                  <StatusBadge variant="open" className="flex-shrink-0 ml-2">OPEN</StatusBadge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-3">{req.description}</p>
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                  {req.budget && (
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />${req.budget}
                    </span>
                  )}
                  {req.city && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />{req.city.nameEn || req.city.nameAr}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />{new Date(req.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {req.category && (
                  <Badge variant="outline">{req.category.nameEn || req.category.nameAr}</Badge>
                )}
                <Link href={`/${locale}/requests/${req.id}`}>
                  <Button className="w-full mt-2">View Details & Submit Offer</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" onClick={() => setPage(p => p - 1)} disabled={page <= 1}>Previous</Button>
          <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
          <Button variant="outline" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}>Next</Button>
        </div>
      )}
    </div>
  );
}
