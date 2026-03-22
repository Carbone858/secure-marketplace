'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Building2, CheckCircle, XCircle, ArrowLeft, Mail, Phone, MapPin, Globe, FileText, Check, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/composite';
import { useLocale, useTranslations } from 'next-intl';
import { PageSkeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/components/providers/AuthProvider';
import { hasPermission } from '@/lib/permissions';
import { useRouter } from 'next/navigation';

export default function AdminCompanyDetailsPage({ params }: { params: { locale: string; id: string } }) {
  const locale = useLocale();
  const t = useTranslations('admin');
  const router = useRouter();
  const { user: currentUser } = useAuth();
  
  const [company, setCompany] = useState<any>(null);
  const [recentOffers, setRecentOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/companies/${params.id}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCompany(data.company);
      setRecentOffers(data.recentOffers || []);
    } catch {
      toast.error('Failed to load company details');
      router.push(`/${locale}/admin/companies`);
    } finally {
      setIsLoading(false);
    }
  }, [params.id, locale, router]);

  useEffect(() => { fetchDetails(); }, [fetchDetails]);

  const updateStatus = async (status: string) => {
    try {
      const res = await fetch(`/api/admin/companies`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: params.id, verificationStatus: status }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to update');
      }
      toast.success(`Company status updated to ${status}`);
      fetchDetails();
    } catch (err: any) {
      toast.error(err.message || 'Error updating status');
    }
  };

  if (isLoading) return <div className="p-6"><PageSkeleton /></div>;
  if (!company) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.push(`/${locale}/admin/companies`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to List
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" />
            {company.name}
            {company.verificationStatus === 'VERIFIED' && <CheckCircle className="h-6 w-6 text-success" />}
          </h1>
          <p className="text-muted-foreground mt-1">Owner: {company.user?.name} ({company.user?.email})</p>
        </div>

        <div className="flex gap-2">
          {company.verificationStatus !== 'VERIFIED' && hasPermission(currentUser?.permissions, 'manage_verifications', currentUser?.role, currentUser?.isStaff) && (
            <Button
              variant="default"
              className="bg-success hover:bg-success/90"
              onClick={() => updateStatus('VERIFIED')}
            >
              <CheckCircle className="h-4 w-4 mr-2" /> Verify Company
            </Button>
          )}
          {company.verificationStatus !== 'REJECTED' && hasPermission(currentUser?.permissions, 'manage_verifications', currentUser?.role, currentUser?.isStaff) && (
            <Button
              variant="destructive"
              onClick={() => updateStatus('REJECTED')}
            >
              <XCircle className="h-4 w-4 mr-2" /> Reject
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <Badge variant={company.verificationStatus === 'VERIFIED' ? 'default' : 'secondary'}>
                  {company.verificationStatus}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Plan</p>
                <Badge variant="outline">{company.currentPlan}</Badge>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t">
              {company.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{company.email}</span>
                </div>
              )}
              {company.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{company.phone}</span>
                </div>
              )}
              {company.website && (
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a href={company.website} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                    {company.website}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>
                  {company.city?.nameEn || company.address || 'Address not provided'}
                  {company.country?.nameEn ? `, ${company.country.nameEn}` : ''}
                </span>
              </div>
            </div>
            
            {company.description && (
              <div className="pt-4 border-t">
                <p className="text-sm font-semibold mb-2">About</p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{company.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Rating</span>
                <span className="font-semibold flex items-center gap-1">
                  <Star className="h-4 w-4 fill-warning text-warning" /> {company.rating} ({company.reviewCount})
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Active Services</span>
                <span className="font-semibold">{company._count?.services || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Projects</span>
                <span className="font-semibold">{company._count?.projects || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Offers</span>
                <span className="font-semibold">{company._count?.offers || 0}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Verification Documents</CardTitle>
            </CardHeader>
            <CardContent>
              {company.documents?.length > 0 ? (
                <ul className="space-y-3">
                  {company.documents.map((doc: any) => (
                    <li key={doc.id} className="flex items-center justify-between p-2 border rounded-md">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="text-sm font-medium hover:underline">
                          {doc.type.replace('_', ' ')}
                        </a>
                      </div>
                      <Badge variant="outline" className="text-xs">{doc.status}</Badge>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No documents uploaded.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
