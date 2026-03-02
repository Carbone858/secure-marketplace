import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getSession } from '@/lib/auth-session/session';
import { prisma } from '@/lib/db/client';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Briefcase, Clock, DollarSign, Calendar, User, Building2, CheckCircle, AlertCircle, Edit, Trash2 } from 'lucide-react';
import { SendOfferButton } from '@/components/requests/SendOfferButton';
import { RequestOwnerActions } from '@/components/requests/RequestOwnerActions';
import { OfferActions } from '@/components/requests/OfferActions';
import { BackButton } from '@/components/ui/BackButton';

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

  // Fetch the request — no isActive filter here; we check permissions below
  const request = await prisma.serviceRequest.findUnique({
    where: { id },
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
      projects: {
        include: {
          company: {
            select: {
              userId: true
            }
          }
        }
      },
    },
  });

  if (!request) {
    redirect(`/${locale}/requests`);
  }

  // Extract the primary project if it exists
  const project = (request as any).projects?.[0] || null;

  const isOwner = session.isAuthenticated && session.user?.id === request.userId;

  // Visibility gate:
  // - Owner can always see their own project (even PENDING/CANCELLED)
  // - Admins can see everything
  // - Everyone else requires isActive=true
  const isAdmin = session.isAuthenticated &&
    (session.user?.role === 'ADMIN' || session.user?.role === 'SUPER_ADMIN');

  // Check if the current user is a company that has already submitted an offer
  let userCompanyId: string | null = null;
  let hasAlreadyOffered = false;
  if (session.isAuthenticated && session.user?.role === 'COMPANY') {
    const company = await prisma.company.findUnique({
      where: { userId: session.user.id },
      select: { id: true }
    });
    if (company) {
      userCompanyId = company.id;
      hasAlreadyOffered = request.offers.some(o => o.company.id === company.id);
    }
  }

  const canSeeRequest = request.isActive || isOwner || isAdmin || hasAlreadyOffered;

  if (!canSeeRequest) {
    redirect(`/${locale}/requests`);
  }

  // Offer gating logic: 
  // 1. Not the owner
  // 2. Is a company
  // 3. Haven't offered yet (non-withdrawn)
  // 4. Request status is ACTIVE or PENDING/MATCHING (not yet ACCEPTED/COMPLETED)
  const canSendOffer = !isOwner &&
    session.user?.role === 'COMPANY' &&
    !hasAlreadyOffered &&
    ['ACTIVE', 'PENDING', 'MATCHING', 'REVIEWING_OFFERS'].includes(request.status);

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
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Link */}
        <BackButton fallbackHref={`/${locale}/requests`} label={t('detail.backToList')} />

        {/* Pending Approval Banner — visible only to owner while project awaits admin review */}
        {isOwner && request.status === 'PENDING' && (
          <div className={`mb-4 flex items-center gap-3 px-4 py-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800`}>
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-500" />
            <div>
              <p className="font-medium text-sm">
                {isRTL ? 'طلبك قيد المراجعة من قِبل الإدارة' : 'Your project is pending admin approval'}
              </p>
              <p className="text-xs text-amber-700 mt-0.5">
                {isRTL ? 'سيصبح مرئياً للشركات بعد الموافقة عليه' : 'It will become visible to companies after it is approved.'}
              </p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-card rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getUrgencyColor(request.urgency)}`}>
                    {t(`urgency.${request.urgency.toLowerCase()}`)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-foreground">{request.title}</h1>
              </div>
              <div className="flex items-center gap-2">
                {canSendOffer && <SendOfferButton requestId={id} variant="page" />}
                {hasAlreadyOffered && request.status === 'ACCEPTED' && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-success/10 text-success rounded-lg border border-success/20">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">{isRTL ? 'تم قبول عرضك' : 'Offer Accepted'}</span>
                  </div>
                )}
                {isOwner && (
                  <RequestOwnerActions
                    requestId={id}
                    deleteLabel={isRTL ? 'حذف' : 'Delete'}
                    editHref={`/${locale}/requests/${id}/edit`}
                    editLabel={isRTL ? 'تعديل' : 'Edit'}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Description */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-3">{t('detail.description')}</h2>
              <p className="text-foreground whitespace-pre-wrap">{request.description}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-3">{t('detail.details')}</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-muted-foreground/60" />
                    <span className="text-muted-foreground">{isRTL ? request.category?.nameAr : request.category?.nameEn}</span>
                    {request.subcategory && (
                      <span className="text-muted-foreground/60">› {isRTL ? request.subcategory.nameAr : request.subcategory.nameEn}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground/60" />
                    <span className="text-muted-foreground">
                      {isRTL ? request.city?.nameAr : request.city?.nameEn}, {isRTL ? request.country?.nameAr : request.country?.nameEn}
                    </span>
                  </div>
                  {(request.budgetMin || request.budgetMax) && (
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-muted-foreground/60" />
                      <span className="text-muted-foreground">
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
                      <Calendar className="w-5 h-5 text-muted-foreground/60" />
                      <span className="text-muted-foreground">
                        {t('detail.deadline')}: {new Date(request.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {request.allowRemote && (
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-success" />
                      <span className="text-success">{t('detail.remoteAllowed')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Posted By */}
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-3">{t('detail.postedBy')}</h2>
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{request.user.name}</p>
                    <p className="text-sm text-muted-foreground">{t('detail.memberSince')} {new Date(request.createdAt).getFullYear()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Images */}
            {Array.isArray(request.images) && request.images.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-foreground mb-3">{t('detail.images')}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(request.images as string[]).map((image, index) => (
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
            {request.tags.filter(tag => !tag.startsWith('lang:')).length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-foreground mb-3">{t('detail.tags')}</h2>
                <div className="flex flex-wrap gap-2">
                  {request.tags.filter(tag => !tag.startsWith('lang:')).map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-muted text-foreground rounded-full text-sm">
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
              <h2 className="text-xl font-semibold text-foreground">
                {t('detail.offers')} ({request._count.offers})
              </h2>
              {canSendOffer && <SendOfferButton requestId={id} variant="page" />}
            </div>

            {request.offers.length === 0 ? (
              <div className="text-center py-8 bg-muted/50 rounded-lg">
                <Building2 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">{t('detail.noOffers')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {request.offers.map((offer) => (
                  <div key={offer.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          {offer.company.logo ? (
                            <img src={offer.company.logo} alt="" className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <Building2 className="w-6 h-6 text-primary" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{offer.company.name}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <span className="text-warning">★</span> {offer.company.rating.toFixed(1)}
                            </span>
                            <span>({offer.company.reviewCount} {t('detail.reviews')})</span>
                            {offer.company.verificationStatus === 'VERIFIED' && (
                              <span className="text-success flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" /> {t('detail.verified')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">
                          {offer.price} {offer.currency}
                        </p>
                        {offer.estimatedDays && (
                          <p className="text-sm text-muted-foreground">
                            {t('detail.estimatedDays', { days: offer.estimatedDays })}
                          </p>
                        )}
                      </div>
                    </div>
                    {offer.description && (
                      <p className="mt-3 text-muted-foreground">{offer.description}</p>
                    )}
                    {isOwner && offer.status === 'PENDING' && (
                      <OfferActions
                        offerId={offer.id}
                        requestId={id}
                        acceptLabel={isRTL ? 'قبول العرض' : 'Accept Offer'}
                        rejectLabel={isRTL ? 'رفض العرض' : 'Reject Offer'}
                      />
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
