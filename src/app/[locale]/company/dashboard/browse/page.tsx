'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Search, Loader2, MapPin, Calendar, DollarSign, Filter, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useLocale } from 'next-intl';
import Link from 'next/link';

interface Category {
  id: string;
  nameEn: string;
  nameAr: string;
  subcategories?: Category[];
}

export default function BrowseRequestsPage() {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filter state
  const [companyCategories, setCompanyCategories] = useState<string[]>([]);
  const [filterByCategories, setFilterByCategories] = useState(false); // Default to false
  const [allCategories, setAllCategories] = useState<Category[]>([]);

  // Manual filters
  const [selectedParentId, setSelectedParentId] = useState<string>('');
  const [selectedSubId, setSelectedSubId] = useState<string>('');

  // Initial load: get Company Profile (for categories) + All Categories
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [profileRes, catsRes] = await Promise.all([
          fetch('/api/company/profile'),
          fetch('/api/categories')
        ]);

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          const skills = profileData.company?.skills || [];
          setCompanyCategories(skills);
          if (skills.length > 0) setFilterByCategories(true);
        }

        if (catsRes.ok) {
          const catsData = await catsRes.json();
          setAllCategories(catsData.categories || catsData.data?.categories || []);
        }
      } catch (e) {
        console.error('Failed to load metadata', e);
      }
    };
    fetchMetadata();
  }, []);

  // Fetch Requests when filters change
  const fetchRequests = useCallback(async () => {
    if (isLoading && page === 1 && requests.length > 0) return;

    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '12',
        status: 'ACTIVE',
        locale: locale,
      });

      if (search) params.set('search', search);

      // Filter Logic
      if (filterByCategories && companyCategories.length > 0) {
        // "My Categories" Mode
        params.set('categoryIds', companyCategories.join(','));
      } else {
        // "Manual Search" Mode
        if (selectedSubId) {
          params.set('categoryIds', selectedSubId);
        } else if (selectedParentId) {
          // If parent selected, find all subcategories to filter by them
          const parent = allCategories.find(c => c.id === selectedParentId);
          if (parent && parent.subcategories && parent.subcategories.length > 0) {
            const subIds = parent.subcategories.map((s: any) => s.id).join(',');
            params.set('categoryIds', subIds);
          } else {
            // Fallback if no subs found or flat structure
            params.set('categoryIds', selectedParentId);
          }
        }
      }

      console.log('Fetching requests for locale:', locale);
      const res = await fetch(`/api/requests?${params}`, { cache: 'no-store' });
      if (!res.ok) throw new Error();
      const responseData = await res.json();

      const data = responseData.data || {};
      let fetchedRequests = data.requests || [];

      setRequests(fetchedRequests);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch {
      toast.error(isRTL ? 'فشل تحميل الطلبات' : 'Failed to load requests');
    } finally {
      setIsLoading(false);
    }
  }, [page, search, filterByCategories, companyCategories, selectedParentId, selectedSubId, allCategories, isRTL, locale]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const getCategoryName = (id: string) => {
    // Search in main categories and subcategories
    for (const cat of allCategories) {
      if (cat.id === id) return isRTL ? cat.nameAr : cat.nameEn;
      if (cat.subcategories) {
        const sub = cat.subcategories.find((s: any) => s.id === id);
        if (sub) return isRTL ? sub.nameAr : sub.nameEn;
      }
    }
    return id;
  };

  const getSubcategories = () => {
    if (!selectedParentId) return [];
    const parent = allCategories.find(c => c.id === selectedParentId);
    return parent?.subcategories || [];
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{isRTL ? 'تصفح المشاريع' : 'Browse Requests'}</h1>
        <p className="text-muted-foreground mt-1">
          {isRTL ? 'اعثر على طلبات خدمة تناسب تخصص شركتك' : 'Find service requests matching your company expertise'}
        </p>
      </div>

      {/* Filters & Search */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col gap-4">
            <div className="relative flex-1">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={isRTL ? 'بحث عن مشاريع...' : 'Search requests...'}
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="ps-9"
              />
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between border-t pt-4">
              {/* Toggle for My Categories */}
              {companyCategories.length > 0 && (
                <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-muted/20 self-start">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{isRTL ? 'تصفية حسب تخصصي:' : 'Filter by my categories:'}</span>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant={filterByCategories ? 'default' : 'outline'}
                      onClick={() => { setFilterByCategories(true); setPage(1); }}
                      className="h-7 text-xs"
                    >
                      {isRTL ? 'مفعل' : 'On'}
                    </Button>
                    <Button
                      size="sm"
                      variant={!filterByCategories ? 'default' : 'outline'}
                      onClick={() => { setFilterByCategories(false); setPage(1); }}
                      className="h-7 text-xs"
                    >
                      {isRTL ? 'عرض الكل / يدوي' : 'Manual / Show All'}
                    </Button>
                  </div>
                </div>
              )}

              {/* Manual Dropdowns (Visible if Filter OFF) */}
              {!filterByCategories && (
                <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto animate-in fade-in slide-in-from-top-2 duration-300">
                  <select
                    className="flex h-10 w-full md:w-48 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={selectedParentId}
                    onChange={(e) => {
                      setSelectedParentId(e.target.value);
                      setSelectedSubId('');
                      setPage(1);
                    }}
                  >
                    <option value="">{isRTL ? 'كل الفئات' : 'All Categories'}</option>
                    {allCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {isRTL ? cat.nameAr : cat.nameEn}
                      </option>
                    ))}
                  </select>

                  <select
                    className="flex h-10 w-full md:w-48 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={selectedSubId}
                    onChange={(e) => { setSelectedSubId(e.target.value); setPage(1); }}
                    disabled={!selectedParentId}
                  >
                    <option value="">{isRTL ? 'كل التخصصات' : 'All Subcategories'}</option>
                    {getSubcategories().map((sub: any) => (
                      <option key={sub.id} value={sub.id}>
                        {isRTL ? sub.nameAr : sub.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Active Filters Display */}
          {filterByCategories && companyCategories.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t text-sm">
              <span className="text-muted-foreground">{isRTL ? 'يتم عرض الطلبات في:' : 'Showing requests in:'}</span>
              {companyCategories.map(catId => (
                <Badge key={catId} variant="secondary" className="font-normal">
                  {getCategoryName(catId)}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : requests.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">{isRTL ? 'لا توجد نتائج' : 'No requests found'}</h3>
            <p className="text-muted-foreground mt-1">
              {filterByCategories && companyCategories.length > 0
                ? (isRTL ? 'لم يتم العثور على طلبات في تخصصاتك. جرب إيقاف التصفية لعرض كل المشاريع.' : 'No requests match your company categories. Try turning off the filter to see all projects.')
                : (isRTL ? 'جرب البحث بكلمات مختلفة' : 'Try searching with different keywords')}
            </p>
            {filterByCategories && companyCategories.length > 0 && (
              <Button variant="outline" className="mt-4" onClick={() => setFilterByCategories(false)}>
                {isRTL ? 'عرض جميع المشاريع' : 'Show All Projects'}
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {requests.map((req) => (
            <Card key={req.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-2">{req.title}</CardTitle>
                  <Badge variant="secondary" className="flex-shrink-0 ms-2">
                    {req.status === 'ACTIVE' ? (isRTL ? 'نشط' : 'Active') : req.status}
                  </Badge>
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
                      <MapPin className="h-3 w-3" />{isRTL && req.city.nameAr ? req.city.nameAr : req.city.nameEn}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />{new Date(req.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {req.category && (
                  <Badge variant="outline">{isRTL && req.category.nameAr ? req.category.nameAr : req.category.nameEn}</Badge>
                )}
                <Link href={`/${locale}/requests/${req.id}`}>
                  <Button className="w-full mt-2">{isRTL ? 'عرض التفاصيل' : 'View Details'}</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" onClick={() => setPage(p => p - 1)} disabled={page <= 1}>{isRTL ? 'السابق' : 'Previous'}</Button>
          <span className="text-sm text-muted-foreground">
            {isRTL ? `صفحة ${page} من ${totalPages}` : `Page ${page} of ${totalPages}`}
          </span>
          <Button variant="outline" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}>{isRTL ? 'التالي' : 'Next'}</Button>
        </div>
      )}
    </div>
  );
}
