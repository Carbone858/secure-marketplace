'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { DollarSign, Loader2, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/composite';
import { useLocale } from 'next-intl';
import Link from 'next/link';

export default function CompanyOffersPage() {
  const locale = useLocale();
  const [offers, setOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchOffers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      const res = await fetch(`/api/offers?${params}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setOffers(data.offers || []);
    } catch {
      toast.error('Failed to load offers');
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { fetchOffers(); }, [fetchOffers]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      PENDING: 'pending',
      ACCEPTED: 'success',
      REJECTED: 'rejected',
      WITHDRAWN: 'neutral',
    };
    return <StatusBadge variant={variants[status] || 'neutral'}>{status}</StatusBadge>;
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <DollarSign className="h-8 w-8" />
          My Offers
        </h1>
        <p className="text-muted-foreground mt-1">Track your submitted offers</p>
      </div>

      <div className="flex gap-2">
        {['', 'PENDING', 'ACCEPTED', 'REJECTED'].map((s) => (
          <Button
            key={s}
            variant={statusFilter === s ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter(s)}
          >
            {s || 'All'}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : offers.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No offers yet</h3>
            <p className="text-muted-foreground mt-1">Browse requests to start submitting offers</p>
            <Link href={`/${locale}/company/dashboard/browse`}>
              <Button className="mt-4">Browse Requests</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {offers.map((offer) => (
            <Card key={offer.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-medium">{offer.request?.title || 'Untitled Request'}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>Amount: ${offer.amount || '—'}</span>
                      <span>Duration: {offer.duration || '—'} days</span>
                      <span>{new Date(offer.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(offer.status)}
                    <Link href={`/${locale}/requests/${offer.requestId}`}>
                      <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
