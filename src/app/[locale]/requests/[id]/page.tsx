import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getSession } from '@/lib/auth-session/session';
import { prisma } from '@/lib/db/client';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Briefcase, Clock, DollarSign, Calendar, User, Building2, CheckCircle, AlertCircle, Edit, Trash2 } from 'lucide-react';

interface RequestDetailPageProps {
  params: { locale: string; id: string };
}

export async function generateMetadata({
  params: { locale, id },
}: RequestDetailPageProps): Promise<Metadata> {
  const request = await prisma.serviceRequest.findUnique({
    where: { id },
    select: { title: true },
  });

  return {
    title: request?.title || 'Request Not Found',
  };
}

export default async function RequestDetailPage({ params: { locale, id } }: RequestDetailPageProps) {
  const session = await getSession();
  const isRTL = locale === 'ar';
  const t = await getTranslations({ locale, namespace: 'requests' });

  const request = await prisma.serviceRequest.findUnique({
    where: { id, isActive: true },
    include: {
      user: {
        select: {
          id: true,
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
      subcategory: {
        select: {
          nameEn: true,
          nameAr: true,
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
      area: {
        select: {
          nameEn: true,
          nameAr: true,
        },
      },
      offers: {
        where: { status: { in: ['PENDING', 'ACCEPTED'] } },
        include: {
          company: {
            select: {
              id: true,
              name: true,
              logo: true,
              rating: true,
              reviewCount: true,
              verificationStatus: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
      _count: {
        select: {
          offers: true,
        },
      },
    },
  });

  if (!request) {
    redirect(`/${locale}/requests`);
  }

  const isOwner = session.isAuthenticated && session.user?.id === request.userId;
  const canSubmitOffer = session.isAuthenticated && !isOwner;

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'URGENT':
        return 'bg-red-100 text-red-700';
      case 'HIGH':
        return 'bg-orange-100 text-orange-700';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-green-100 text-green-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Link */}
        <Link
          href={`/${locale}/requests`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          ← {t('detail.backToList')}
        </Link>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getUrgencyColor(request.urgency)}`}>
                    {t(`urgency.${request.urgency.toLowerCase()}`)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">{request.title}</h1>
              </div>
              {isOwner && (
                <div className="flex gap-2">
                  <Link
                    href={`/${locale}/requests/${id}/edit`}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    <Edit className="w-5 h-5" />
                  </Link>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Description */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">{t('detail.description')}</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{request.description}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">{t('detail.details')}</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">{isRTL ? request.category?.nameAr : request.category?.nameEn}</span>
                    {request.subcategory && (
                      <span className="text-gray-400">› {isRTL ? request.subcategory.nameAr : request.subcategory.nameEn}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">
                      {isRTL ? request.city?.nameAr : request.city?.nameEn}, {isRTL ? request.country?.nameAr : request.country?.nameEn}
                    </span>
                  </div>
                  {(request.budgetMin || request.budgetMax) && (
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">
                        {request.budgetMin && request.budgetMax
                          ? `${request.budgetMin} - ${request.budgetMax} ${request.currency}`
                          : request.budgetMin
                          ? `${t('detail.budgetFrom')} ${request.budgetMin} ${request.currency}`
                          : `${t('detail.budgetUpTo')} ${request.budgetMax} ${request.currency}`}
                      </span>
                    </div>
                  )}
                  {request.deadline && (
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">
                        {t('detail.deadline')}: {new Date(request.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {request.allowRemote && (
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-green-600">{t('detail.remoteAllowed')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Posted By */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">{t('detail.postedBy')}</h2>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{request.user.name}</p>
                    <p className="text-sm text-gray-500">{t('detail.memberSince')} {new Date(request.createdAt).getFullYear()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Images */}
            {request.images.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">{t('detail.images')}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {request.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt=""
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {request.tags.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">{t('detail.tags')}</h2>
                <div className="flex flex-wrap gap-2">
                  {request.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Offers Section */}
          <div className="border-t p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {t('detail.offers')} ({request._count.offers})
              </h2>
              {canSubmitOffer && (
                <Link
                  href={`/${locale}/requests/${id}/offer`}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t('detail.submitOffer')}
                </Link>
              )}
            </div>

            {request.offers.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">{t('detail.noOffers')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {request.offers.map((offer) => (
                  <div key={offer.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          {offer.company.logo ? (
                            <img src={offer.company.logo} alt="" className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <Building2 className="w-6 h-6 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{offer.company.name}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <span className="text-yellow-500">★</span> {offer.company.rating.toFixed(1)}
                            </span>
                            <span>({offer.company.reviewCount} {t('detail.reviews')})</span>
                            {offer.company.verificationStatus === 'VERIFIED' && (
                              <span className="text-green-600 flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" /> {t('detail.verified')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">
                          {offer.price} {offer.currency}
                        </p>
                        {offer.estimatedDays && (
                          <p className="text-sm text-gray-500">
                            {t('detail.estimatedDays', { days: offer.estimatedDays })}
                          </p>
                        )}
                      </div>
                    </div>
                    {offer.description && (
                      <p className="mt-3 text-gray-600">{offer.description}</p>
                    )}
                    {isOwner && offer.status === 'PENDING' && (
                      <div className="mt-4 flex gap-3">
                        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                          {t('detail.accept')}
                        </button>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                          {t('detail.reject')}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
