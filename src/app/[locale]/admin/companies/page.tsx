'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Building2, Search, Loader2, CheckCircle, XCircle, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/composite';
import { Input } from '@/components/ui/input';
import { useLocale, useTranslations } from 'next-intl';

export default function AdminCompaniesPage() {
  const locale = useLocale();
  const t = useTranslations('admin');
  const [companies, setCompanies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchCompanies = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      const res = await fetch(`/api/admin/companies?${params}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCompanies(data.companies || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotal(data.pagination?.total || 0);
    } catch {
      toast.error('Failed to load companies');
    } finally {
      setIsLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => { fetchCompanies(); }, [fetchCompanies]);

  const updateCompany = async (id: string, updates: any) => {
    try {
      const res = await fetch('/api/admin/companies', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });
      if (!res.ok) throw new Error();
      toast.success('Company updated');
      fetchCompanies();
    } catch {
      toast.error('Failed to update company');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      VERIFIED: 'verified',
      PENDING: 'pending',
      REJECTED: 'rejected',
    };
    return <StatusBadge variant={variants[status] || 'neutral'}>{status}</StatusBadge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Building2 className="h-8 w-8" />
          {t('sidebar.companies')}
        </h1>
        <p className="text-muted-foreground mt-1">Manage registered companies ({total} total)</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search companies..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-9"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="border rounded-md px-3 py-2 text-sm bg-background"
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="VERIFIED">Verified</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : companies.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No companies found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-start p-3 font-medium">Company</th>
                    <th className="text-start p-3 font-medium">Email</th>
                    <th className="text-start p-3 font-medium">Status</th>
                    <th className="text-start p-3 font-medium">Plan</th>
                    <th className="text-start p-3 font-medium">Featured</th>
                    <th className="text-start p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map((company) => (
                    <tr key={company.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-3">
                        <div>
                          <p className="font-medium">{company.name}</p>
                          {company.city && (
                            <p className="text-xs text-muted-foreground">{company.city.nameEn}</p>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-muted-foreground">{company.email}</td>
                      <td className="p-3">{getStatusBadge(company.verificationStatus)}</td>
                      <td className="p-3">
                        <Badge variant="outline">{company.subscriptionPlan || 'FREE'}</Badge>
                      </td>
                      <td className="p-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateCompany(company.id, { isFeatured: !company.isFeatured })}
                        >
                          <Star className={`h-4 w-4 ${company.isFeatured ? 'fill-warning text-warning' : 'text-muted-foreground'}`} />
                        </Button>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-1">
                          {company.verificationStatus !== 'VERIFIED' && (
                            <Button
                              size="sm"
                              variant="default"
                              className="bg-success hover:bg-success/90 text-success-foreground"
                              onClick={() => updateCompany(company.id, { verificationStatus: 'VERIFIED' })}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" /> Verify
                            </Button>
                          )}
                          {company.verificationStatus !== 'REJECTED' && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => updateCompany(company.id, { verificationStatus: 'REJECTED' })}
                            >
                              <XCircle className="h-3 w-3 mr-1" /> Reject
                            </Button>
                          )}
                        </div>
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
            <Button variant="outline" size="sm" onClick={() => setPage(p => p - 1)} disabled={page <= 1}>Previous</Button>
            <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}>Next</Button>
          </div>
        </div>
      )}
    </div>
  );
}
