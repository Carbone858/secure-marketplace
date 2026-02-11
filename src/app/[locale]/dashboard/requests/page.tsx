'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { toast } from 'sonner';
import { Loader2, Plus, FileText, MessageSquare, Eye, Edit, Trash2 } from 'lucide-react';
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
  COMPLETED: 'bg-success',
  CANCELLED: 'bg-destructive',
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
  const { user, isLoading: authLoading } = useAuth();
  
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
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
      setRequests(data.requests);
    } catch (err) {
      toast.error('Failed to load requests');
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

      toast.success('Request deleted successfully');
      setRequests(requests.filter(r => r.id !== requestToDelete));
      setDeleteDialogOpen(false);
      setRequestToDelete(null);
    } catch (err) {
      toast.error('Failed to delete request');
    }
  };

  const filteredRequests = requests.filter(request => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') {
      return ['PENDING', 'ACTIVE', 'MATCHING', 'REVIEWING_OFFERS', 'ACCEPTED', 'IN_PROGRESS'].includes(request.status);
    }
    if (activeTab === 'completed') return request.status === 'COMPLETED';
    if (activeTab === 'cancelled') return ['CANCELLED', 'EXPIRED'].includes(request.status);
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <Button onClick={() => router.push(`/${locale}/requests/new`)}>
          <Plus className="h-4 w-4 mr-2" />
          {t('createNew')}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">{t('tabs.all')}</TabsTrigger>
          <TabsTrigger value="active">{t('tabs.active')}</TabsTrigger>
          <TabsTrigger value="completed">{t('tabs.completed')}</TabsTrigger>
          <TabsTrigger value="cancelled">{t('tabs.cancelled')}</TabsTrigger>
        </TabsList>

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
                  <Plus className="h-4 w-4 mr-2" />
                  {t('createNew')}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <Card key={request.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge className={statusColors[request.status]}>
                            {request.status}
                          </Badge>
                          <Badge className={urgencyColors[request.urgency]}>
                            {request.urgency}
                          </Badge>
                        </div>
                        <h3 className="text-lg font-semibold mb-1">{request.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {request.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span>
                            {(request.budgetMin || request.budgetMax) && (
                              <>
                                {request.budgetMin?.toLocaleString()} - {request.budgetMax?.toLocaleString()} {request.currency}
                              </>
                            )}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            {request._count.offers} offers
                          </span>
                          <span>
                            {new Date(request.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/${locale}/requests/${request.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        {['DRAFT', 'PENDING', 'ACTIVE'].includes(request.status) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/${locale}/requests/${request.id}/edit`)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        )}
                        {['DRAFT', 'PENDING'].includes(request.status) && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => {
                              setRequestToDelete(request.id);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
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
            <DialogTitle>Delete Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this request? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
