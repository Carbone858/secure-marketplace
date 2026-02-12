'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { CheckCircle, XCircle, FileCheck, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageSkeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useLocale, useTranslations } from 'next-intl';

export default function AdminVerificationsPage() {
  const locale = useLocale();
  const t = useTranslations('admin');
  const [companies, setCompanies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPending = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/companies?status=PENDING&limit=50');
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCompanies(data.companies || []);
    } catch {
      toast.error('Failed to load pending verifications');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchPending(); }, [fetchPending]);

  const handleAction = async (id: string, status: 'VERIFIED' | 'REJECTED') => {
    try {
      const res = await fetch('/api/admin/companies', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, verificationStatus: status }),
      });
      if (!res.ok) throw new Error();
      toast.success(`Company ${status.toLowerCase()}`);
      fetchPending();
    } catch {
      toast.error('Action failed');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FileCheck className="h-8 w-8" />
          {t('sidebar.verifications')}
        </h1>
        <p className="text-muted-foreground mt-1">
          {companies.length} companies awaiting verification
        </p>
      </div>

      {isLoading ? (
        <PageSkeleton />
      ) : companies.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <CheckCircle className="h-12 w-12 mx-auto text-success mb-4" />
            <h3 className="text-lg font-medium">All caught up!</h3>
            <p className="text-muted-foreground mt-1">{t('verifications_mgmt.noPending')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {companies.map((company) => (
            <Card key={company.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">{company.name}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span>Email: {company.email}</span>
                      {company.phone && <span>Phone: {company.phone}</span>}
                      {company.city && <span>City: {company.city.nameEn}</span>}
                    </div>
                    {company.description && (
                      <p className="text-sm mt-2 max-w-2xl">{company.description}</p>
                    )}
                    <div className="flex gap-2 mt-2">
                      {company.documents?.map((doc: any, i: number) => (
                        <Badge key={i} variant="outline" className="gap-1">
                          <ExternalLink className="h-3 w-3" />
                          {doc.type || `Document ${i + 1}`}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Applied: {new Date(company.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      className="bg-success hover:bg-success/90 text-success-foreground"
                      onClick={() => handleAction(company.id, 'VERIFIED')}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" /> Verify
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleAction(company.id, 'REJECTED')}
                    >
                      <XCircle className="h-4 w-4 mr-2" /> Reject
                    </Button>
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
