'use client';

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
  X
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
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

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

interface Country {
  id: string;
  name: string;
  nameAr: string | null;
}

interface Category {
  id: string;
  name: string;
  nameAr: string | null;
}

const sortOptions = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest' },
  { value: 'projects', label: 'Most Projects' },
];

export default function CompaniesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const t = useTranslations();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // Filters
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [selectedCountry, setSelectedCountry] = useState(searchParams.get('countryId') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('categoryId') || '');
  const [verifiedOnly, setVerifiedOnly] = useState(searchParams.get('verifiedOnly') === 'true');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'relevance');

  useEffect(() => {
    fetchFilters();
    fetchCompanies();
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [currentPage, sortBy]);

  const fetchFilters = async () => {
    try {
      const [countriesRes, categoriesRes] = await Promise.all([
        fetch('/api/countries'),
        fetch('/api/categories'),
      ]);

      if (countriesRes.ok) {
        const data = await countriesRes.json();
        setCountries(data.countries);
      }

      if (categoriesRes.ok) {
        const data = await categoriesRes.json();
        setCategories(data.categories);
      }
    } catch (err) {
      console.error('Failed to fetch filters');
    }
  };

  const fetchCompanies = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (selectedCountry) params.set('countryId', selectedCountry);
      if (selectedCategory) params.set('categoryId', selectedCategory);
      if (verifiedOnly) params.set('verifiedOnly', 'true');
      params.set('sortBy', sortBy);
      params.set('page', currentPage.toString());

      const response = await fetch(`/api/companies/search?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch companies');

      const data = await response.json();
      setCompanies(data.companies);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      toast.error('Failed to load companies');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCompanies();
  };

  const handleFilterChange = () => {
    setCurrentPage(1);
    fetchCompanies();
  };

  const clearFilters = () => {
    setQuery('');
    setSelectedCountry('');
    setSelectedCategory('');
    setVerifiedOnly(false);
    setSortBy('relevance');
    setCurrentPage(1);
    fetchCompanies();
  };

  const hasActiveFilters = query || selectedCountry || selectedCategory || verifiedOnly;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Company Directory</h1>
        <p className="text-muted-foreground">
          Find verified companies for your projects
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search companies, services..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>

        <div className="flex flex-wrap items-center gap-2">
          {/* Mobile Filter Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="space-y-6 mt-6">
                {/* Country Filter */}
                <div className="space-y-2">
                  <Label>Country</Label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => {
                      setSelectedCountry(e.target.value);
                      handleFilterChange();
                    }}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">All Countries</option>
                    {countries.map((country) => (
                      <option key={country.id} value={country.id}>
                        {locale === 'ar' && country.nameAr ? country.nameAr : country.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category Filter */}
                <div className="space-y-2">
                  <Label>Category</Label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      handleFilterChange();
                    }}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {locale === 'ar' && category.nameAr ? category.nameAr : category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Verified Filter */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="verified-mobile"
                    checked={verifiedOnly}
                    onCheckedChange={(checked) => {
                      setVerifiedOnly(checked as boolean);
                      handleFilterChange();
                    }}
                  />
                  <Label htmlFor="verified-mobile">Verified companies only</Label>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop Filters */}
          <div className="hidden lg:flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <MapPin className="h-4 w-4 mr-2" />
                  {selectedCountry
                    ? countries.find((c) => c.id === selectedCountry)?.name
                    : 'All Countries'}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem onClick={() => { setSelectedCountry(''); handleFilterChange(); }}>
                  All Countries
                </DropdownMenuItem>
                {countries.map((country) => (
                  <DropdownMenuItem
                    key={country.id}
                    onClick={() => { setSelectedCountry(country.id); handleFilterChange(); }}
                  >
                    {country.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Building2 className="h-4 w-4 mr-2" />
                  {selectedCategory
                    ? categories.find((c) => c.id === selectedCategory)?.name
                    : 'All Categories'}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem onClick={() => { setSelectedCategory(''); handleFilterChange(); }}>
                  All Categories
                </DropdownMenuItem>
                {categories.map((category) => (
                  <DropdownMenuItem
                    key={category.id}
                    onClick={() => { setSelectedCategory(category.id); handleFilterChange(); }}
                  >
                    {category.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant={verifiedOnly ? 'default' : 'outline'}
              onClick={() => { setVerifiedOnly(!verifiedOnly); handleFilterChange(); }}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Verified Only
            </Button>
          </div>

          <div className="flex-1" />

          {/* Sort */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Sort: {sortOptions.find((o) => o.value === sortBy)?.label}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => { setSortBy(option.value); handleFilterChange(); }}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {hasActiveFilters && (
            <Button variant="ghost" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : companies.length === 0 ? (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No companies found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <Card
                key={company.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => router.push(`/${locale}/companies/${company.slug}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      {company.logo ? (
                        <img
                          src={company.logo}
                          alt={company.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Building2 className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold truncate">{company.name}</h3>
                        {company.verificationStatus === 'VERIFIED' && (
                          <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">
                          {locale === 'ar' && company.city?.nameAr
                            ? company.city.nameAr
                            : company.city?.name},{' '}
                          {locale === 'ar' && company.country?.nameAr
                            ? company.country.nameAr
                            : company.country?.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  {company.description && (
                    <p className="text-sm text-muted-foreground mt-4 line-clamp-2">
                      {company.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 mt-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">{company.averageRating || 'N/A'}</span>
                      <span className="text-muted-foreground">({company.reviewCount})</span>
                    </div>
                    <div className="text-muted-foreground">
                      {company.completedProjectsCount} projects
                    </div>
                  </div>

                  {company.services.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-4">
                      {company.services.slice(0, 3).map((service, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {service.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              <span className="flex items-center px-4">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
