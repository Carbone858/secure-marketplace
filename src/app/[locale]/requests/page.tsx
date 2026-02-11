import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/db/client';
import Link from 'next/link';
import { Search, MapPin, Briefcase, Clock, DollarSign, Filter, Plus } from 'lucide-react';

interface RequestsPageProps {
  params: { locale: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({
  params: { locale },
}: RequestsPageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'requests' });

  return {
    title: t('list.meta.title'),
    description: t('list.meta.description'),
  };
}

async function getRequests(searchParams: RequestsPageProps['searchParams']) {
  const page = parseInt((searchParams.page as string) || '1');
  const limit = 10;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {
    isActive: true,
    status: { in: ['PENDING', 'ACTIVE', 'MATCHING', 'REVIEWING_OFFERS'] },
  };

  if (searchParams.category) {
    where.categoryId = searchParams.category;
  }
  if (searchParams.country) {
    where.countryId = searchParams.country;
  }
  if (searchParams.city) {
    where.cityId = searchParams.city;
  }
  if (searchParams.search) {
    where.OR = [
      { title: { contains: searchParams.search as string, mode: 'insensitive' } },
      { description: { contains: searchParams.search as string, mode: 'insensitive' } },
    ];
  }

  const [requests, total] = await Promise.all([
    prisma.serviceRequest.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
          },
        },
        category: {
          select: {
            nameEn: true,
            nameAr: true,
            icon: true,
          },
        },
        country: {
          select: {
            nameEn: true,
            nameAr: true,
          },
        },
        city: {
          select: {
            nameEn: true,
            nameAr: true,
          },
        },
        _count: {
          select: {
            offers: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.serviceRequest.count({ where }),
  ]);

  return { requests, total, totalPages: Math.ceil(total / limit), page };
}

async function getCategories() {
  return prisma.category.findMany({
    where: { isActive: true, parentId: null },
    select: { id: true, nameEn: true, nameAr: true },
  });
}

async function getCountries() {
  return prisma.country.findMany({
    select: { id: true, nameEn: true, nameAr: true },
  });
}

export default async function RequestsPage({ params: { locale }, searchParams }: RequestsPageProps) {
  const isRTL = locale === 'ar';
  const t = await getTranslations({ locale, namespace: 'requests' });
  const [{ requests, total, totalPages, page }, categories, countries] = await Promise.all([
    getRequests(searchParams),
    getCategories(),
    getCountries(),
  ]);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'URGENT':
        return 'bg-destructive/10 text-destructive';
      case 'HIGH':
        return 'bg-warning/10 text-warning';
      case 'MEDIUM':
        return 'bg-warning/10 text-warning';
      default:
        return 'bg-success/10 text-success';
    }
  };

  return (
    <div className="min-h-screen bg-muted/50 py-8" dir={isRTL ? 'rtl' : 'ltr'}>
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
          <form className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/60" />
              <input
                type="text"
                name="search"
                defaultValue={searchParams.search as string}
                placeholder={t('list.searchPlaceholder')}
                className="w-full pl-10 pr-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring"
              />
            </div>
            <select
              name="category"
              defaultValue={searchParams.category as string}
              className="px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring"
            >
              <option value="">{t('list.allCategories')}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {isRTL ? cat.nameAr : cat.nameEn}
                </option>
              ))}
            </select>
            <select
              name="country"
              defaultValue={searchParams.country as string}
              className="px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring"
            >
              <option value="">{t('list.allCountries')}</option>
              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {isRTL ? country.nameAr : country.nameEn}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="px-6 py-3 bg-foreground text-white rounded-lg hover:bg-foreground/90 flex items-center justify-center gap-2"
            >
              <Filter className="w-5 h-5" />
              {t('list.filter')}
            </button>
          </form>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-xl">
              <Briefcase className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">{t('list.noRequests')}</h3>
              <p className="text-muted-foreground">{t('list.noRequestsDesc')}</p>
            </div>
          ) : (
            requests.map((request) => (
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
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {isRTL ? request.category?.nameAr : request.category?.nameEn}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {isRTL ? request.city?.nameAr : request.city?.nameEn}, {isRTL ? request.country?.nameAr : request.country?.nameEn}
                      </span>
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
                  <div className="ml-4 text-center">
                    <div className="text-2xl font-bold text-primary">{request._count.offers}</div>
                    <div className="text-sm text-muted-foreground">{t('list.offers')}</div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/${locale}/requests?page=${p}`}
                className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium ${
                  p === page ? 'bg-primary text-white' : 'bg-card text-foreground hover:bg-muted'
                }`}
              >
                {p}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
