"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { toast } from 'sonner';
import {
  Loader2,
  Search,
  MapPin,
  Star,
  Building2,
  CheckCircle,
  Filter,
  ChevronDown,
  X,
  ListFilter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { categories as serviceCategories, getSubcategories } from '@/lib/services-data';

interface Company {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  verificationStatus: string;
  averageRating: number;
  reviewCount: number;
  completedProjectsCount: number;
  country: { name: string; nameAr: string | null };
  city: { name: string; nameAr: string | null };
  services: { name: string }[];
}

// Mock Location Data (Syria only per user request)
const countries = [
  { id: "sy", name: { en: "Syria", ar: "سوريا" } },
];

const cities = {
  sy: [
    { id: "damascus", en: "Damascus", ar: "دمشق" },
    { id: "aleppo", en: "Aleppo", ar: "حلب" },
    { id: "homs", en: "Homs", ar: "حمص" },
    { id: "latakia", en: "Latakia", ar: "اللاذقية" },
    { id: "hama", en: "Hama", ar: "حماة" },
    { id: "tartus", en: "Tartus", ar: "طرطوس" },
    { id: "rif-dimashq", en: "Rif Dimashq", ar: "ريف دمشق" },
    { id: "daraa", en: "Daraa", ar: "درعا" },
    { id: "suwayda", en: "As-Suwayda", ar: "السويداء" },
    { id: "hasakah", en: "Al-Hasakah", ar: "الحسكة" },
    { id: "deir-ez-zor", en: "Deir ez-Zor", ar: "دير الزور" },
    { id: "raqqa", en: "Raqqa", ar: "الرقة" },
    { id: "idlib", en: "Idlib", ar: "إدلب" },
    { id: "quneitra", en: "Quneitra", ar: "القنيطرة" },
  ],
};

const sortOptions = [
  { value: 'relevance', labelKey: 'sort.relevance' },
  { value: 'rating', labelKey: 'sort.rating' },
  { value: 'newest', labelKey: 'sort.newest' },
  { value: 'projects', labelKey: 'sort.projects' },
  { value: 'reviews', labelKey: 'sort.reviews' },
];

export default function CompaniesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const isAr = locale === 'ar';
  const t = useTranslations('companies');

  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // Filters
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [selectedCountry, setSelectedCountry] = useState(searchParams.get('country') || 'sy'); // Default Syria
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedSubcategory, setSelectedSubcategory] = useState(searchParams.get('subcategory') || '');
  const [verifiedOnly, setVerifiedOnly] = useState(searchParams.get('verifiedOnly') === 'true');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'relevance');

  // Derived Data
  const activeCities = selectedCountry ? (cities as any)[selectedCountry] : [];
  const activeSubcategories = selectedCategory ? getSubcategories(selectedCategory) : [];

  useEffect(() => {
    fetchCompanies();
  }, [currentPage, sortBy, selectedCountry, selectedCity, selectedCategory, selectedSubcategory, verifiedOnly]);

  const fetchCompanies = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', currentPage.toString());
      params.set('limit', '12');
      if (query) params.set('q', query);
      if (selectedCountry) params.set('country', selectedCountry);
      if (selectedCity) params.set('city', selectedCity);
      if (selectedCategory) params.set('category', selectedCategory);
      if (selectedSubcategory) params.set('subcategory', selectedSubcategory);
      if (verifiedOnly) params.set('verified', 'true');
      if (sortBy) params.set('sortBy', sortBy);

      const response = await fetch(`/api/companies/search?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setCompanies(data.companies);
        setTotalPages(data.pagination.totalPages || 1);
      } else {
        toast.error(t('errors.fetchFailed'));
      }
    } catch (error) {
      console.error(error);
      toast.error(t('errors.fetchFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCompanies();
  };

  const clearFilters = () => {
    setQuery('');
    setSelectedCountry('sy');
    setSelectedCity('');
    setSelectedCategory('');
    setSelectedSubcategory('');
    setVerifiedOnly(false);
    setSortBy('relevance');
    setCurrentPage(1);
    router.push(`/${locale}/companies`);
  };

  const hasActiveFilters = query || selectedCity || selectedCategory || selectedSubcategory || verifiedOnly;

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 pb-20">
      {/* Header / Search Bar */}
      <div className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <form onSubmit={handleSearch} className="flex gap-2 max-w-4xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t('searchPlaceholder')}
                className="pl-10 h-12 text-lg"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Button type="button" size="lg" className="h-12 px-8 font-bold hidden md:flex" onClick={fetchCompanies}>
              {t('searchButton')}
            </Button>
            {/* Mobile Filter Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="lg" className="h-12 px-4 lg:hidden">
                  <Filter className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side={isAr ? "right" : "left"} className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>{t('filters.title')}</SheetTitle>
                </SheetHeader>
                <div className="space-y-6 mt-6">
                  {/* Country Select */}
                  <div className="space-y-2">
                    <Label>{t('filters.country')}</Label>
                    <select
                      className="w-full p-2 border rounded-md bg-transparent"
                      value={selectedCountry}
                      onChange={(e) => { setSelectedCountry(e.target.value); setSelectedCity(''); }}
                    >
                      <option value="">{t('filters.allCountries')}</option>
                      {countries.map(c => <option key={c.id} value={c.id}>{isAr ? c.name.ar : c.name.en}</option>)}
                    </select>
                  </div>
                  {/* City Select */}
                  {selectedCountry && (
                    <div className="space-y-2">
                      <Label>{t('filters.city')}</Label>
                      <select
                        className="w-full p-2 border rounded-md bg-transparent"
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                      >
                        <option value="">{t('filters.allCities')}</option>
                        {activeCities?.map((c: any) => <option key={c.id} value={c.id}>{isAr ? c.ar : c.en}</option>)}
                      </select>
                    </div>
                  )}
                  {/* Category Select */}
                  <div className="space-y-2">
                    <Label>{t('filters.category')}</Label>
                    <select
                      className="w-full p-2 border rounded-md bg-transparent"
                      value={selectedCategory}
                      onChange={(e) => { setSelectedCategory(e.target.value); setSelectedSubcategory(''); }}
                    >
                      <option value="">{t('filters.allCategories')}</option>
                      {serviceCategories.map(c => <option key={c.id} value={c.id}>{isAr ? c.label.ar : c.label.en}</option>)}
                    </select>
                  </div>
                  {/* Subcategory Select */}
                  {selectedCategory && (
                    <div className="space-y-2">
                      <Label>{isAr ? "الخدمة الفرعية" : "Service Type"}</Label>
                      <select
                        className="w-full p-2 border rounded-md bg-transparent"
                        value={selectedSubcategory}
                        onChange={(e) => setSelectedSubcategory(e.target.value)}
                      >
                        <option value="">{isAr ? "الكل" : "All"}</option>
                        {activeSubcategories.map((s: any) => <option key={s.id} value={s.id}>{isAr ? s.title.ar : s.title.en}</option>)}
                      </select>
                    </div>
                  )}

                  <div className="flex items-center space-x-2 pt-4">
                    <Checkbox id="verified-mobile" checked={verifiedOnly} onCheckedChange={(c) => setVerifiedOnly(!!c)} />
                    <Label htmlFor="verified-mobile" className="mx-2">{t('filters.verifiedOnly')}</Label>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </form>

          {/* Filters Bar (Desktop) */}
          <div className="hidden lg:flex flex-wrap items-center gap-3 mt-4 animate-in fade-in slide-in-from-top-1">
            {/* Country */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-9 min-w-[120px] justify-between">
                  <span className="flex items-center truncate">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
                    <span className="truncate max-w-[150px]">
                      {selectedCountry ? countries.find(c => c.id === selectedCountry)?.name[isAr ? 'ar' : 'en'] : t('filters.country')}
                    </span>
                  </span>
                  <ChevronDown className="h-4 w-4 ml-2 opacity-50 flex-shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[200px]">
                <DropdownMenuItem className="font-semibold" onClick={() => { setSelectedCountry(''); setSelectedCity(''); }}>
                  {t('filters.allCountries')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {countries.map(c => (
                  <DropdownMenuItem key={c.id} onClick={() => { setSelectedCountry(c.id); setSelectedCity(''); }}>
                    {isAr ? c.name.ar : c.name.en}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* City */}
            {selectedCountry && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-9 min-w-[120px] justify-between">
                    <span className="flex items-center truncate">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
                      <span className="truncate max-w-[150px]">
                        {selectedCity ? activeCities.find((c: any) => c.id === selectedCity)?.[isAr ? 'ar' : 'en'] : t('filters.city')}
                      </span>
                    </span>
                    <ChevronDown className="h-4 w-4 ml-2 opacity-50 flex-shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="max-h-[300px] overflow-y-auto w-[200px]">
                  <DropdownMenuItem className="font-semibold" onClick={() => setSelectedCity('')}>{t('filters.allCities')}</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {activeCities?.map((c: any) => (
                    <DropdownMenuItem key={c.id} onClick={() => setSelectedCity(c.id)}>
                      {isAr ? c.ar : c.en}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Category */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-9 min-w-[120px] justify-between">
                  <span className="flex items-center truncate">
                    <Building2 className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
                    <span className="truncate max-w-[150px]">
                      {selectedCategory ? serviceCategories.find(c => c.id === selectedCategory)?.label[isAr ? 'ar' : 'en'] : t('filters.category')}
                    </span>
                  </span>
                  <ChevronDown className="h-4 w-4 ml-2 opacity-50 flex-shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="max-h-[300px] overflow-y-auto w-[200px]">
                <DropdownMenuItem className="font-semibold" onClick={() => { setSelectedCategory(''); setSelectedSubcategory(''); }}>{t('filters.allCategories')}</DropdownMenuItem>
                <DropdownMenuSeparator />
                {serviceCategories.map(c => (
                  <DropdownMenuItem key={c.id} onClick={() => { setSelectedCategory(c.id); setSelectedSubcategory(''); }}>
                    {isAr ? c.label.ar : c.label.en}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Subcategory - Only if Category Selected */}
            {selectedCategory && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-9 min-w-[120px] justify-between">
                    <span className="flex items-center truncate">
                      <ListFilter className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
                      <span className="truncate max-w-[150px]">
                        {selectedSubcategory
                          ? activeSubcategories.find((s: any) => s.id === selectedSubcategory)?.title[isAr ? 'ar' : 'en']
                          : (isAr ? "كل الخدمات" : "All Services")}
                      </span>
                    </span>
                    <ChevronDown className="h-4 w-4 ml-2 opacity-50 flex-shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="max-h-[300px] overflow-y-auto w-[250px]">
                  <DropdownMenuItem className="font-semibold" onClick={() => setSelectedSubcategory('')}>{isAr ? "الكل" : "All Services"}</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {activeSubcategories.map((s: any) => (
                    <DropdownMenuItem key={s.id} onClick={() => setSelectedSubcategory(s.id)}>
                      {isAr ? s.title.ar : s.title.en}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Button
              variant={verifiedOnly ? 'secondary' : 'ghost'}
              className="h-9"
              onClick={() => setVerifiedOnly(!verifiedOnly)}
            >
              <CheckCircle className={`h-4 w-4 mr-2 ${verifiedOnly ? 'text-primary' : 'text-muted-foreground'}`} />
              {t('filters.verifiedOnlyShort')}
            </Button>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-destructive h-9 hover:bg-destructive/10">
                <X className="h-4 w-4 mr-2" />
                {t('filters.clear')}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">{t('loading')}</p>
          </div>
        ) : companies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {companies.map((company) => (
              <Card key={company.id} className="hover:shadow-lg transition-all duration-300 group cursor-pointer" onClick={() => router.push(`/${locale}/companies/${company.slug}`)}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden border border-gray-200 dark:border-gray-700">
                      {company.logo ? (
                        <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
                      ) : (
                        <Building2 className="w-8 h-8 text-gray-400 m-4" />
                      )}
                    </div>
                    {company.verificationStatus === 'VERIFIED' && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {t('verified')}
                      </Badge>
                    )}
                  </div>

                  <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors line-clamp-1">{company.name}</h3>
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span className="line-clamp-1">
                      {company.city && (isAr && company.city.nameAr ? company.city.nameAr : company.city.name)}
                      {company.city && company.country && ', '}
                      {company.country && (isAr && company.country.nameAr ? company.country.nameAr : company.country.name)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="font-bold">{company.averageRating.toFixed(1)}</span>
                    <span className="text-gray-400 text-xs">({company.reviewCount})</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-auto">
                    {company.services.slice(0, 3).map((s, i) => (
                      <Badge key={i} variant="outline" className="text-xs font-normal">
                        {s.name}
                      </Badge>
                    ))}
                    {company.services.length > 3 && (
                      <Badge variant="outline" className="text-xs text-muted-foreground">+{company.services.length - 3}</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-dashed">
            <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2">{t('noResults')}</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">{t('noResultsDesc')}</p>
            <Button variant="outline" onClick={clearFilters}>{t('filters.clear')}</Button>
          </div>
        )}
      </div>
    </div>
  );
}
