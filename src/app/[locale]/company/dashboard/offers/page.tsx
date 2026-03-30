'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { DollarSign, Loader2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';

export default function CompanyOffersPage() {
  const locale = useLocale();
  const t = useTranslations('company_dashboard');
  const [offers, setOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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
      toast.error(t('offers.loadFailed'));
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, t]);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (el) {
      const isAtStart = el.scrollLeft <= 10;
      const isAtEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 10;
      setShowLeftArrow(!isAtStart);
      setShowRightArrow(!isAtEnd && el.scrollWidth > el.clientWidth);
    }
  };

  useEffect(() => { fetchOffers(); }, [fetchOffers]);

  useEffect(() => {
    const timer = setTimeout(checkScroll, 100);
    window.addEventListener('resize', checkScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
            <DollarSign className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            {t('offers.title')}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{t('offers.subtitle')}</p>
        </div>
      </div>

      <div className="relative group">
        {/* Left Arrow Indicator */}
        <div 
          className={`absolute left-0 top-0 bottom-0 z-10 w-8 flex items-center justify-start bg-gradient-to-r from-background to-transparent pointer-events-none transition-opacity duration-300 ${showLeftArrow ? 'opacity-100' : 'opacity-0'}`}
        >
          <ChevronLeft className="h-4 w-4 text-primary animate-pulse" />
        </div>

        <div 
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-2 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth"
        >
          {['', 'PENDING', 'ACCEPTED', 'REJECTED'].map((s) => (
            <Button
              key={s}
              variant={statusFilter === s ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(s)}
              className="whitespace-nowrap rounded-full px-4 flex-shrink-0"
            >
              {s ? t(`status.${s}`) : t('offers.all')}
            </Button>
          ))}
        </div>

        {/* Right Arrow Indicator */}
        <div 
          className={`absolute right-0 top-0 bottom-0 z-10 w-8 flex items-center justify-end bg-gradient-to-l from-background to-transparent pointer-events-none transition-opacity duration-300 ${showRightArrow ? 'opacity-100' : 'opacity-0'}`}
        >
          <ChevronRight className="h-4 w-4 text-primary animate-pulse" />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : offers.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center">
            <DollarSign className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium tracking-tight">{t('offers.noOffers')}</h3>
            <p className="text-sm text-muted-foreground mt-1">{t('offers.noOffersDesc')}</p>
            <Link href={`/${locale}/company/dashboard/browse`}>
              <Button className="mt-6 w-full sm:w-auto">{t('offers.browseRequests')}</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {offers.map((offer: any) => (
            <Card key={offer.id} className="card-interactive overflow-hidden">
              <CardContent className="p-4 md:p-6 text-start">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold tracking-tight">{offer.request?.title || t('offers.untitledRequest')}</h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-muted-foreground mt-2">
                      <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50">
                        {t('offers.amount', { amount: offer.amount || '—' })}
                      </span>
                      <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50">
                        {t('offers.duration', { days: offer.duration || '—' })}
                      </span>
                      <span className="opacity-70">{new Date(offer.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between w-full sm:w-auto gap-4 pt-4 sm:pt-0 border-t border-border/50 sm:border-0 mt-2 sm:mt-0">
                    <Badge className={`w-fit px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      offer.status === 'ACCEPTED' ? 'bg-success/10 text-success border-success/20' : 
                      offer.status === 'PENDING' ? 'bg-warning/10 text-warning border-warning/20' : 
                      'bg-destructive/10 text-destructive border-destructive/20'
                    }`}>
                      {t(`status.${offer.status}`)}
                    </Badge>
                    <Link href={`/${locale}/requests/${offer.requestId}`}>
                      <Button variant="outline" size="sm" className="h-9">
                        <Eye className="h-4 w-4 sm:me-2" />
                        <span className="hidden sm:inline">{t('offers.viewRequest')}</span>
                      </Button>
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
