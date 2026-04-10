'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Search, Loader2, MapPin, Calendar, DollarSign, Filter, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useLocale, useTranslations } from 'next-intl';
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
  const tb = useTranslations('company_dashboard.browse');

  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMetadataLoading, setIsMetadataLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filter state
  const [companyCategories, setCompanyCategories] = useState<string[]>([]);
  const [filterByCategories, setFilterByCategories] = useState(true);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [allCities, setAllCities] = useState<any[]>([]);

  // Manual filters
  const [selectedParentId, setSelectedParentId] = useState<string>('');
  const [selectedSubId, setSelectedSubId] = useState<string>('');
  const [selectedCityId, setSelectedCityId] = useState<string>('');

  // Initial load: get Company Profile (for categories) + All Categories + Cities
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [profileRes, catsRes, countriesRes] = await Promise.all([
          fetch('/api/company/profile'),
          fetch('/api/categories'),
          fetch('/api/countries?includeCities=true&locale=' + locale)
        ]);

        if (profileRes.ok) {
          const profileResult = await profileRes.json();
          const skills = profileResult.company?.skills || [];
          setCompanyCategories(skills);
          // If no skills found, default to All Projects mode
          if (skills.length === 0) {
            setFilterByCategories(false);
          }
        }

        if (catsRes.ok) {
          const catsData = await catsRes.json();
          setAllCategories(catsData.categories || catsData.data?.categories || []);
        }

        if (countriesRes.ok) {
          const countriesData = await countriesRes.json();
          const countries = countriesData.countries || [];
          // Flatten cities from all countries
          const cities = countries.flatMap((c: any) => c.cities || []);
          setAllCities(cities);
        }
      } catch (e) {
        console.error('Failed to load metadata', e);
      } finally {
        setIsMetadataLoading(false);
      }
    };
    fetchMetadata();
  }, [locale]);

  // Fetch Requests when filters change
  const fetchRequests = useCallback(async () => {
    // Don't fetch until we know if we're in Related or All mode (based on profile)
    if (isMetadataLoading) return;

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
        // "Related Projects" Mode
        params.set('categoryIds', companyCategories.join(','));
      } else if (!filterByCategories) {
        // "Manual / All Projects" Mode
        if (selectedSubId) {
          params.set('categoryIds', selectedSubId);
        } else if (selectedParentId) {
          const parent = allCategories.find(c => c.id === selectedParentId);
          if (parent && parent.subcategories && parent.subcategories.length > 0) {
            const subIds = parent.subcategories.map((s: any) => s.id).join(',');
            params.set('categoryIds', subIds);
          } else {
            params.set('categoryIds', selectedParentId);
          }
        }
      }

      if (selectedCityId) {
        params.set('cityId', selectedCityId);
      }

      const res = await fetch(`/api/requests?${params}`, { cache: 'no-store' });
      if (!res.ok) throw new Error();
      const responseData = await res.json();

      const data = responseData.data || {};
      setRequests(data.requests || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch {
      toast.error(isRTL ? 'فشل تحميل الطلبات' : 'Failed to load requests');
    } finally {
      setIsLoading(false);
    }
  }, [page, search, filterByCategories, companyCategories, selectedParentId, selectedSubId, selectedCityId, allCategories, isRTL, locale, isMetadataLoading]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const getCategoryName = (id: string) => {
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
        <h1 className="text-3xl font-bold">{tb('title')}</h1>
        <p className="text-muted-foreground mt-1">{tb('subtitle')}</p>
      </div>

      {/* Filters & Search */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col gap-4">
            <div className="relative flex-1">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={tb('searchPlaceholder')}
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="ps-9"
              />
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between border-t pt-4">
              {/* Tabs approach */}
              {isMetadataLoading ? (
                <div className="flex gap-2 h-10 w-64 bg-muted animate-pulse rounded-md" />
              ) : companyCategories.length > 0 ? (
                <div className="flex p-1 bg-muted rounded-lg shrink-0">
                  <button
                    onClick={() => { setFilterByCategories(true); setPage(1); }}
                    className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${
                      filterByCategories 
                        ? 'bg-background text-foreground shadow-sm' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tb('relatedProjects')}
                  </button>
                  <button
                    onClick={() => { setFilterByCategories(false); setPage(1); }}
                    className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${
                      !filterByCategories 
                        ? 'bg-background text-foreground shadow-sm' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tb('allProjects')}
                  </button>
                </div>
              ) : (
                <Badge variant="outline" className="py-1.5 text-xs font-bold uppercase tracking-wide">
                  {tb('allProjects')}
                </Badge>
              )}

              {/* Manual Dropdowns (Visible if All Projects selected or no skills) */}
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

              {/* City Filter (Always Visible) */}
              <div className="flex w-full md:w-auto">
                <select
                  className="flex h-10 w-full md:w-48 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  value={selectedCityId}
                  onChange={(e) => { setSelectedCityId(e.target.value); setPage(1); }}
                >
                  <option value="">{isRTL ? 'كل المدن' : 'All Cities'}</option>
                  {allCities.map(city => (
                    <option key={city.id} value={city.id}>
                      {city.name || (isRTL ? city.nameAr : city.nameEn)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Active Categories Display (only in Related mode) */}
          {filterByCategories && companyCategories.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t text-sm">
              <span className="text-xs font-bold uppercase tracking-tight text-muted-foreground">{isRTL ? 'تخصصاتك:' : 'Your Specializations:'}</span>
              {companyCategories.map(catId => (
                <Badge key={catId} variant="secondary" className="font-semibold text-[10px] px-2 py-0.5 bg-primary/5 text-primary border-primary/20">
                  {getCategoryName(catId)}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : requests.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center">
            <Search className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium tracking-tight">{isRTL ? 'لا توجد نتائج' : 'No requests found'}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {filterByCategories && companyCategories.length > 0
                ? (isRTL ? 'لم يتم العثور على طلبات في تخصصاتك. جرب إيقاف التصفية لعرض كل المشاريع.' : 'No requests match your company categories. Try turning off the filter to see all projects.')
                : (isRTL ? 'جرب البحث بكلمات مختلفة' : 'Try searching with different keywords')}
            </p>
            {filterByCategories && companyCategories.length > 0 && (
              <Button variant="outline" className="mt-6 w-full sm:w-auto" onClick={() => setFilterByCategories(false)}>
                {isRTL ? 'عرض جميع المشاريع' : 'Show All Projects'}
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {requests.map((req) => (
            <Card key={req.id} className="card-interactive overflow-hidden flex flex-col h-full">
              <CardHeader className="pb-3 border-b border-border/50">
                <div className="flex items-start justify-between gap-4">
                  <CardTitle className="text-base sm:text-lg tracking-tight line-clamp-2 leading-snug">{req.title}</CardTitle>
                  <Badge className={`flex-shrink-0 w-fit px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${req.status === 'ACTIVE' ? 'bg-success/10 text-success border-success/20' : 'bg-muted/50'}`}>
                    {req.status === 'ACTIVE' ? (isRTL ? 'نشط' : 'Active') : req.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{req.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-muted-foreground">
                    {req.budgetMax && (
                      <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50">
                        <DollarSign className="h-3.5 w-3.5 text-primary" />
                        {req.budgetMin ? `${req.budgetMin}-` : ''}{req.budgetMax} {req.currency}
                      </span>
                    )}
                    {req.city && (
                      <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        {isRTL && req.city.nameAr ? req.city.nameAr : req.city.nameEn}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50 ms-auto">
                      <Calendar className="h-3.5 w-3.5 text-primary opacity-70" />
                      <span className="opacity-70">{new Date(req.createdAt).toLocaleDateString()}</span>
                    </span>
                  </div>
                  
                  {req.category && (
                    <div className="pt-2">
                       <Badge variant="secondary" className="font-medium text-xs rounded-md">
                         {isRTL && req.category.nameAr ? req.category.nameAr : req.category.nameEn}
                       </Badge>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-border/50 mt-auto">
                  <Link href={`/${locale}/requests/${req.id}?from=company-browse`} className="block w-full">
                    <Button variant="outline" className="w-full text-xs h-9">
                      {isRTL ? 'عرض التفاصيل' : 'View Details'}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 mt-6 border-t border-border/50">
          <span className="text-sm font-medium text-muted-foreground order-2 sm:order-none">
            {isRTL ? `صفحة ${page} من ${totalPages}` : `Page ${page} of ${totalPages}`}
          </span>
          <div className="flex items-center gap-2 order-1 sm:order-none w-full sm:w-auto">
            <Button variant="outline" className="flex-1 sm:flex-none" onClick={() => setPage(p => p - 1)} disabled={page <= 1}>
              {isRTL ? 'السابق' : 'Previous'}
            </Button>
            <Button variant="outline" className="flex-1 sm:flex-none bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}>
              {isRTL ? 'التالي' : 'Next'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
