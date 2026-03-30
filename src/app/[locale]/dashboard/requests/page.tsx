'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { toast } from 'sonner';
import { Loader2, Plus, FileText, MessageSquare, Eye, Edit, Trash2, DollarSign, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/components/providers/AuthProvider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Request {
  id: string;
  title: string;
  description: string;
  status: string;
  urgency: string;
  budgetMin: number | null;
  budgetMax: number | null;
  currency: string;
  createdAt: string;
  rejectionReason?: string | null;
  _count: {
    offers: number;
  };
}

const statusColors: Record<string, string> = {
  DRAFT: 'bg-muted-foreground',
  PENDING: 'bg-warning',
  ACTIVE: 'bg-info',
  MATCHING: 'bg-primary',
  REVIEWING_OFFERS: 'bg-warning',
  ACCEPTED: 'bg-success',
  IN_PROGRESS: 'bg-info',
  DELIVERED: 'bg-purple-600',
  UNDER_REVIEW: 'bg-orange-500',
  COMPLETED: 'bg-success',
  CANCELLED: 'bg-destructive',
  REJECTED: 'bg-destructive',
  EXPIRED: 'bg-muted-foreground',
};

const urgencyColors: Record<string, string> = {
  LOW: 'bg-success',
  MEDIUM: 'bg-warning',
  HIGH: 'bg-warning',
  URGENT: 'bg-destructive',
};

export default function MyRequestsPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('requests.myRequests');
  const td = useTranslations('dashboard_pages.requests');
  const { user, isLoading: authLoading } = useAuth();

  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [fadeClass, setFadeClass] = useState('scroll-fade-right');

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isAtStart = target.scrollLeft <= 10;
    const isAtEnd = target.scrollLeft + target.clientWidth >= target.scrollWidth - 10;

    if (isAtStart && isAtEnd) setFadeClass('');
    else if (isAtStart) setFadeClass('scroll-fade-right');
    else if (isAtEnd) setFadeClass('scroll-fade-left');
    else setFadeClass('scroll-fade-right scroll-fade-left');
  };

  useEffect(() => {
    const checkScroll = () => {
      const el = document.getElementById('dashboard-tabs-container');
      if (el) {
        const isAtStart = el.scrollLeft <= 5;
        const isAtEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 5;
        if (isAtStart && isAtEnd) setFadeClass('');
        else if (isAtStart) setFadeClass('scroll-fade-right');
        else if (isAtEnd) setFadeClass('scroll-fade-left');
        else setFadeClass('scroll-fade-right scroll-fade-left');
      }
    };
    const timer = setTimeout(checkScroll, 100);
    window.addEventListener('resize', checkScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkScroll);
    };
  }, [requests, isLoading, authLoading]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/${locale}/auth/login?redirect=${encodeURIComponent(`/${locale}/dashboard/requests`)}`);
      return;
    }

    if (user) {
      fetchRequests();
    }
  }, [user, authLoading, locale, router]);

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/requests?userOnly=true');
      if (!response.ok) throw new Error('Failed to fetch requests');
      const data = await response.json();
      setRequests(data.data?.requests ?? data.requests ?? []);
    } catch (err) {
      toast.error(td('toasts.loadFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!requestToDelete) return;

    try {
      const response = await fetch(`/api/requests/${requestToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete request');

      toast.success(td('toasts.deleted'));
      setRequests(requests.filter(r => r.id !== requestToDelete));
      setDeleteDialogOpen(false);
      setRequestToDelete(null);
    } catch (err) {
      toast.error(td('toasts.deleteFailed'));
    }
  };

  const filteredRequests = requests.filter(request => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') {
      return ['PENDING', 'ACTIVE', 'MATCHING', 'REVIEWING_OFFERS', 'ACCEPTED', 'IN_PROGRESS', 'DELIVERED', 'UNDER_REVIEW'].includes(request.status);
    }
    if (activeTab === 'needsReview') return request.status === 'UNDER_REVIEW';
    if (activeTab === 'completed') return request.status === 'COMPLETED';
    if (activeTab === 'cancelled') return ['CANCELLED', 'REJECTED', 'EXPIRED'].includes(request.status);
    if (activeTab === 'hasOffers') return request._count.offers > 0;
    return true;
  });

  if (isLoading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{t('title')}</h1>
        <Button onClick={() => router.push(`/${locale}/requests/new`)} className="w-full sm:w-auto shadow-sm">
          <Plus className="h-4 w-4 me-2" />
          {t('createNew')}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="relative">
          <div 
            id="dashboard-tabs-container"
            className={`overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 transition-opacity duration-300 ${fadeClass}`}
            onScroll={handleScroll}
          >
            <TabsList className="inline-flex h-11 w-full sm:w-auto justify-start bg-muted/50 p-1 mb-2">
              <TabsTrigger value="all" className="px-4 py-2 text-xs font-bold uppercase tracking-wider">{t('tabs.all')}</TabsTrigger>
              <TabsTrigger value="active" className="px-4 py-2 text-xs font-bold uppercase tracking-wider">{t('tabs.active')}</TabsTrigger>
              {requests.some(r => r.status === 'UNDER_REVIEW') && (
                <TabsTrigger value="needsReview" className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-orange-600">
                  <span className="flex items-center gap-1.5">
                    {td('status.UNDER_REVIEW')}
                    <Badge variant="secondary" className="h-4.5 min-w-[18px] justify-center px-1 bg-orange-100 text-orange-700 border-orange-200 text-[10px]">
                      {requests.filter(r => r.status === 'UNDER_REVIEW').length}
                    </Badge>
                  </span>
                </TabsTrigger>
              )}
              <TabsTrigger value="hasOffers" className="px-4 py-2 text-xs font-bold uppercase tracking-wider">{t('tabs.hasOffers')}</TabsTrigger>
              <TabsTrigger value="completed" className="px-4 py-2 text-xs font-bold uppercase tracking-wider">{t('tabs.completed')}</TabsTrigger>
              <TabsTrigger value="cancelled" className="px-4 py-2 text-xs font-bold uppercase tracking-wider">{t('tabs.cancelled')}</TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value={activeTab}>
          {filteredRequests.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">{t('noRequests')}</h3>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                  {t('noRequestsDesc')}
                </p>
                <Button onClick={() => router.push(`/${locale}/requests/new`)}>
                  <Plus className="h-4 w-4 me-2" />
                  {t('createNew')}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <Card key={request.id} className="hover:shadow-md transition-shadow overflow-hidden border-border/50">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <Badge className={`${statusColors[request.status]} px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider`}>
                            {td(`status.${request.status}`)}
                          </Badge>
                          <Badge className={`${urgencyColors[request.urgency]} px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-opacity-10 text-current border-current/20`}>
                            {td(`urgency.${request.urgency}`)}
                          </Badge>
                        </div>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{request.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                          {request.description}
                        </p>
                        
                        {/* Rejection reason banner */}
                        {request.status === 'REJECTED' && request.rejectionReason && (
                          <div className="flex items-start gap-2 bg-destructive/5 border border-destructive/10 rounded-lg px-3 py-2.5 mb-4">
                            <span className="text-destructive text-[10px] font-bold uppercase tracking-tight mt-0.5">Admin Note:</span>
                            <p className="text-xs text-destructive/90 italic font-medium">{request.rejectionReason}</p>
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2 bg-muted/30 px-2.5 py-1 rounded-full border border-border/50 font-semibold text-foreground/80">
                            <DollarSign className="h-3.5 w-3.5" />
                            <span>
                              {(request.budgetMin || request.budgetMax) && (
                                <>
                                  {request.budgetMin?.toLocaleString()} - {request.budgetMax?.toLocaleString()} {request.currency}
                                </>
                              )}
                            </span>
                          </div>

                          <div className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-all ${
                            request._count.offers > 0 
                              ? 'bg-primary/5 text-primary border-primary/20 font-bold' 
                              : 'bg-muted/20 text-muted-foreground border-transparent'
                          }`}>
                            <MessageSquare className={`h-3.5 w-3.5 ${request._count.offers > 0 ? 'fill-current' : ''}`} />
                            <span className="text-xs uppercase tracking-tight">
                              {request._count.offers > 0 
                                ? `${request._count.offers} ${td('offers')}` 
                                : td('noOffers')
                              }
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 px-1 py-1 text-[11px] font-medium opacity-60">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(request.createdAt).toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full lg:w-auto shrink-0 pt-4 lg:pt-0 border-t lg:border-0 border-border/50">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/${locale}/requests/${request.id}`)}
                          className="flex-1 lg:flex-none h-10 font-bold shadow-sm"
                        >
                          <Eye className="h-4 w-4 me-2" />
                          {t('view')}
                        </Button>
                        
                        {request.status === 'UNDER_REVIEW' && (
                          <Button
                            variant="default"
                            size="sm"
                            className="flex-1 lg:flex-none h-10 bg-orange-600 hover:bg-orange-700 text-white font-bold shadow-md shadow-orange-100"
                            onClick={() => router.push(`/${locale}/requests/${request.id}`)}
                          >
                            {td('completion.actions.reviewConfirm')}
                          </Button>
                        )}
                        
                        {['DRAFT', 'PENDING', 'ACTIVE', 'CANCELLED', 'REJECTED'].includes(request.status) && (
                          <Button
                            variant={request.status === 'REJECTED' ? 'default' : 'outline'}
                            size="sm"
                            className={`flex-1 lg:flex-none h-10 font-bold ${request.status === 'REJECTED' ? 'bg-primary shadow-md' : 'shadow-sm'}`}
                            onClick={() => router.push(`/${locale}/requests/${request.id}/edit`)}
                          >
                            <Edit className="h-4 w-4 me-2" />
                            {request.status === 'REJECTED' ? 'Edit & Resubmit' : t('edit')}
                          </Button>
                        )}
                        
                        {['DRAFT', 'PENDING'].includes(request.status) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-10 px-3 text-destructive hover:bg-destructive/10 lg:flex-none"
                            onClick={() => {
                              setRequestToDelete(request.id);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sm:hidden ms-2 font-bold">{t('delete')}</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{td('deleteRequest')}</DialogTitle>
            <DialogDescription>
              {td('deleteConfirm')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              {t('cancel')}
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              {t('delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
