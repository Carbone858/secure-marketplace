'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { Search, MapPin, Briefcase, Clock, DollarSign, Plus, Loader2, ChevronDown, X } from 'lucide-react';
import { SendOfferButton } from '@/components/requests/SendOfferButton';

interface Category { id: string; nameEn: string; nameAr: string; }
interface Country { id: string; nameEn: string; nameAr: string; }
interface City { id: string; nameEn: string; nameAr: string; countryId: string; }

interface Request {
    id: string;
    title: string;
    description: string;
    urgency: string;
    createdAt: string;
    budgetMin: number | null;
    budgetMax: number | null;
    currency: string;
    deadline: string | null;
    category: { nameEn: string; nameAr: string } | null;
    country: { nameEn: string; nameAr: string } | null;
    city: { nameEn: string; nameAr: string } | null;
    _count: { offers: number };
}

interface Props {
    categories: Category[];
    countries: Country[];
    allCities: City[];
    defaultCountryId: string | undefined;
}

// ── Inline select dropdown (no Radix, no scroll-close issues) ─────────────────
function FilterSelect({ label, value, onChange, children }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    children: { id: string; label: string }[];
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const close = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        const closeScroll = (e: Event) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', close);
        document.addEventListener('scroll', closeScroll, true);
        return () => {
            document.removeEventListener('mousedown', close);
            document.removeEventListener('scroll', closeScroll, true);
        };
    }, [open]);

    const selected = children.find(c => c.id === value);

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify-between px-4 py-3 border border-input rounded-lg bg-background hover:bg-muted/50 transition-colors text-sm"
            >
                <span className="truncate text-left">{selected?.label ?? label}</span>
                <ChevronDown className={`h-4 w-4 ml-2 flex-shrink-0 opacity-50 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && (
                <div
                    className="absolute top-full mt-1 z-50 w-full bg-popover border border-border rounded-md shadow-lg max-h-[260px] overflow-y-auto py-1"
                    onMouseDown={e => e.stopPropagation()}
                >
                    <button
                        type="button"
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors ${!value ? 'font-semibold text-primary' : ''}`}
                        onMouseDown={e => { e.preventDefault(); onChange(''); setOpen(false); }}
                    >
                        {label}
                    </button>
                    <div className="h-px bg-border my-1" />
                    {children.map(opt => (
                        <button
                            key={opt.id}
                            type="button"
                            className={`w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors ${value === opt.id ? 'font-semibold text-primary' : ''}`}
                            onMouseDown={e => { e.preventDefault(); onChange(opt.id); setOpen(false); }}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function RequestsClient({ categories, countries, allCities, defaultCountryId }: Props) {
    const locale = useLocale();
    const t = useTranslations('requests');
    const isAr = locale === 'ar';

    const [requests, setRequests] = useState<Request[]>([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    // Filters
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [country, setCountry] = useState(defaultCountryId ?? '');
    const [city, setCity] = useState('');

    // Cities scoped to selected country
    const activeCities = country ? allCities.filter(c => c.countryId === country) : allCities;

    const getUrgencyColor = (urgency: string) => {
        switch (urgency) {
            case 'URGENT': return 'bg-destructive/10 text-destructive';
            case 'HIGH': return 'bg-warning/10 text-warning';
            case 'MEDIUM': return 'bg-warning/10 text-warning';
            default: return 'bg-success/10 text-success';
        }
    };

    const fetchRequests = useCallback(async (page = 1) => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            params.set('page', page.toString());
            params.set('limit', '10');
            params.set('locale', locale);
            if (search) params.set('search', search);
            if (category) params.set('categoryId', category);
            if (country) params.set('countryId', country);
            if (city) params.set('cityId', city);

            const res = await fetch(`/api/requests?${params}`);
            if (!res.ok) throw new Error('Failed');
            const data = await res.json();
            setRequests(data.requests ?? data.data?.requests ?? []);
            const pagination = data.pagination ?? data.data?.pagination;
            setTotal(pagination?.total ?? 0);
            setTotalPages(pagination?.totalPages ?? 1);
            setCurrentPage(page);
        } catch {
            setRequests([]);
        } finally {
            setIsLoading(false);
        }
    }, [locale, search, category, country, city]);

    // Re-fetch whenever filters change (reset to page 1)
    useEffect(() => {
        setCurrentPage(1);
        fetchRequests(1);
    }, [category, country, city]);

    // Search: debounce 400ms
    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentPage(1);
            fetchRequests(1);
        }, 400);
        return () => clearTimeout(timer);
    }, [search]);

    // When country changes, reset city
    const handleCountryChange = (v: string) => {
        setCountry(v);
        setCity('');
    };

    const hasFilters = !!(search || category || (country && country !== defaultCountryId) || city);

    const clearFilters = () => {
        setSearch('');
        setCategory('');
        setCountry(defaultCountryId ?? '');
        setCity('');
    };

    return (
        <div className="min-h-screen bg-muted/50 py-8" dir={isAr ? 'rtl' : 'ltr'}>
            <div className="max-w-7xl mx-auto px-4">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">{t('list.title')}</h1>
                        <p className="text-muted-foreground mt-1">{t('list.subtitle', { count: total })}</p>
                    </div>
                    <Link
                        href={`/${locale}/requests/new`}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        {t('list.newRequest')}
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-card rounded-xl shadow-sm p-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                        {/* Search */}
                        <div className="relative lg:col-span-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 pointer-events-none" />
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder={t('list.searchPlaceholder')}
                                className="w-full pl-9 pr-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring text-sm bg-background"
                            />
                        </div>

                        {/* Category */}
                        <FilterSelect
                            label={t('list.allCategories')}
                            value={category}
                            onChange={setCategory}
                        >
                            {categories.map(c => ({ id: c.id, label: isAr ? c.nameAr : c.nameEn }))}
                        </FilterSelect>

                        {/* Country */}
                        <FilterSelect
                            label={t('list.allCountries')}
                            value={country}
                            onChange={handleCountryChange}
                        >
                            {countries.map(c => ({ id: c.id, label: isAr ? c.nameAr : c.nameEn }))}
                        </FilterSelect>

                        {/* City */}
                        <FilterSelect
                            label={isAr ? 'كل المدن' : 'All Cities'}
                            value={city}
                            onChange={setCity}
                        >
                            {activeCities.map(c => ({ id: c.id, label: isAr ? c.nameAr : c.nameEn }))}
                        </FilterSelect>

                        {/* Clear */}
                        {hasFilters ? (
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="flex items-center justify-center gap-2 px-4 py-3 border border-destructive/40 text-destructive rounded-lg hover:bg-destructive/10 transition-colors text-sm"
                            >
                                <X className="w-4 h-4" />
                                {isAr ? 'مسح الفلاتر' : 'Clear Filters'}
                            </button>
                        ) : (
                            <div /> // placeholder to keep grid alignment
                        )}
                    </div>
                </div>

                {/* Results */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : requests.length === 0 ? (
                    <div className="text-center py-12 bg-card rounded-xl">
                        <Briefcase className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-2">{t('list.noRequests')}</h3>
                        <p className="text-muted-foreground">{t('list.noRequestsDesc')}</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {requests.map((request) => (
                            <Link
                                key={request.id}
                                href={`/${locale}/requests/${request.id}`}
                                className="block bg-card rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(request.urgency)}`}>
                                                {t(`urgency.${request.urgency.toLowerCase()}`)}
                                            </span>
                                            <span className="text-sm text-muted-foreground">
                                                {new Date(request.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-semibold text-foreground mb-2 hover:text-primary">
                                            {request.title}
                                        </h3>
                                        <p className="text-muted-foreground line-clamp-2 mb-4">{request.description}</p>
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                            {request.category && (
                                                <span className="flex items-center gap-1">
                                                    <Briefcase className="w-4 h-4" />
                                                    {isAr ? request.category.nameAr : request.category.nameEn}
                                                </span>
                                            )}
                                            {(request.city || request.country) && (
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-4 h-4" />
                                                    {[
                                                        isAr ? request.city?.nameAr : request.city?.nameEn,
                                                        isAr ? request.country?.nameAr : request.country?.nameEn,
                                                    ].filter(Boolean).join(', ')}
                                                </span>
                                            )}
                                            {(request.budgetMin || request.budgetMax) && (
                                                <span className="flex items-center gap-1">
                                                    <DollarSign className="w-4 h-4" />
                                                    {request.budgetMin && request.budgetMax
                                                        ? `${request.budgetMin} - ${request.budgetMax} ${request.currency}`
                                                        : request.budgetMin
                                                            ? `From ${request.budgetMin} ${request.currency}`
                                                            : `Up to ${request.budgetMax} ${request.currency}`}
                                                </span>
                                            )}
                                            {request.deadline && (
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {new Date(request.deadline).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="ml-4 text-center flex-shrink-0 flex flex-col items-center gap-2">
                                        <div className="text-2xl font-bold text-primary">{request._count.offers}</div>
                                        <div className="text-sm text-muted-foreground">{t('list.offers')}</div>
                                        <SendOfferButton requestId={request.id} variant="card" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                        <button
                            type="button"
                            onClick={() => fetchRequests(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-2 rounded-lg border border-input bg-card hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                        >
                            {isAr ? '→ السابق' : '← Prev'}
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
                            .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                                if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('...');
                                acc.push(p);
                                return acc;
                            }, [])
                            .map((p, i) =>
                                p === '...' ? (
                                    <span key={`e-${i}`} className="px-2 text-muted-foreground">…</span>
                                ) : (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => fetchRequests(p as number)}
                                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${currentPage === p
                                            ? 'bg-primary text-white'
                                            : 'bg-card border border-input hover:bg-muted'
                                            }`}
                                    >
                                        {p}
                                    </button>
                                )
                            )}
                        <button
                            type="button"
                            onClick={() => fetchRequests(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-2 rounded-lg border border-input bg-card hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                        >
                            {isAr ? 'التالي ←' : 'Next →'}
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}
