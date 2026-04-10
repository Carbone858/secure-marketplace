import { Metadata } from 'next';
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { getSession } from '@/lib/auth-session/session';
import { prisma } from '@/lib/db/client';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Briefcase, Clock, DollarSign, Calendar, User, Building2, CheckCircle, AlertCircle, Edit, Trash2, Shield } from 'lucide-react';
import { SendOfferButton } from '@/components/requests/SendOfferButton';
import { RequestOwnerActions } from '@/components/requests/RequestOwnerActions';
import { OfferActions } from '@/components/requests/OfferActions';
import { BackButton } from '@/components/ui/BackButton';
import { StatusBadge } from '@/components/ui/composite';
import { AdminRequestActions } from '@/components/admin/AdminRequestActions';
import { RequestDeliveryBanner } from '@/components/requests/RequestDeliveryBanner';

interface RequestDetailPageProps {
  params: { locale: string; id: string };
  searchParams?: { from?: string };
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

export default async function RequestDetailPage({ params: { locale, id }, searchParams }: RequestDetailPageProps) {
  const session = await getSession();
  const isRTL = locale === 'ar';
  const t = await getTranslations({ locale, namespace: 'requests' });
  const td = await getTranslations({ locale, namespace: 'dashboard_pages.requests' });

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
        select: {
          id: true,
          status: true,
          deliveredAt: true,
          reviewDeadline: true,
          completedAt: true,
          isAutoCompleted: true,
          company: {
            select: {
              id: true,
              userId: true,
              name: true
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

  // Sealed Bidding implementation
  const visibleOffers = request.offers.filter(offer => {
    if (isOwner || isAdmin) return true;
    if (userCompanyId && offer.company.id === userCompanyId) return true;
    return false;
  });

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'URGENT':
        return 'bg-destructive/10 text-destructive';
      case 'HIGH':
        return 'bg-warning/10 text-warning';
      case 'MEDIUM':
        return 'bg-primary/10 text-primary';
      default:
        return 'bg-success/10 text-success';
    }
  };

  return (
    <div className="min-h-screen bg-muted/50 py-6 lg:py-10" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Back Link */}
        <Suspense fallback={<div className="mb-6 h-6" />}>
          <BackButton
            fallbackHref={
              isAdmin
                ? `/${locale}/admin/requests`
                : isOwner
                ? `/${locale}/dashboard/requests`
                : searchParams?.from === 'company-browse'
                ? `/${locale}/company/dashboard/browse`
                : searchParams?.from === 'company-projects'
                ? `/${locale}/company/dashboard/projects`
                : `/${locale}/requests`
            }
            label={t('detail.backToList')}
          />
        </Suspense>

        {/* Project Delivery Banner */}
        {isOwner && request.status === 'UNDER_REVIEW' && project && (
          <RequestDeliveryBanner 
            requestId={id} 
            deliveredAt={project.deliveredAt} 
            reviewDeadline={project.reviewDeadline}
            isAutoCompleted={project.isAutoCompleted}
          />
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Column (Left) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-xl shadow-sm border overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <StatusBadge variant={request.status.toLowerCase()}>
                        {td(`status.${request.status}`)}
                      </StatusBadge>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tight ${getUrgencyColor(request.urgency)}`}>
                        {t(`urgency.${request.urgency.toLowerCase()}`)}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(request.createdAt).toLocaleDateString(locale)}
                      </span>
                    </div>
                    <h1 className="text-2xl font-bold text-foreground mb-4 break-words leading-tight">{request.title}</h1>
                    
                    {request.status === 'REJECTED' && (request as any).rejectionReason && (
                      <div className="flex items-start gap-2 bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3 mb-2 max-w-xl animate-in fade-in slide-in-from-top-4 duration-500">
                        <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-secondary-foreground font-bold block mb-0.5 text-sm">{isRTL ? 'سبب الرفض من الإدارة:' : 'Admin Rejection Reason:'}</span>
                          <p className="text-sm text-destructive font-medium">{(request as any).rejectionReason}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {canSendOffer && <SendOfferButton requestId={id} variant="page" />}
                    {hasAlreadyOffered && request.status === 'ACCEPTED' && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-600 rounded-lg border border-emerald-500/20">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-bold text-sm tracking-tight">{isRTL ? 'تم قبول عرضك' : 'Offer Accepted'}</span>
                      </div>
                    )}
                    {isOwner && (
                      <RequestOwnerActions
                        requestId={id}
                        status={request.status}
                        deleteLabel={isRTL ? 'حذف' : 'Delete'}
                        editHref={['CANCELLED', 'REJECTED', 'EXPIRED'].includes(request.status) ? `/${locale}/requests/new?clone=${id}` : `/${locale}/requests/${id}/edit`}
                        editLabel={isRTL ? 'تعديل' : 'Edit'}
                        repostLabel={isRTL ? 'إعادة نشر' : 'Repost / Duplicate'}
                      />
                    )}
                    {isAdmin && (
                      <AdminRequestActions requestId={id} status={request.status} />
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-8">
                {/* Description */}
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60 mb-3">{t('detail.description')}</h2>
                  <p className="text-foreground text-lg leading-relaxed whitespace-pre-wrap break-words overflow-wrap-anywhere">{request.description}</p>
                </div>

                {/* Images */}
                {Array.isArray(request.images) && request.images.length > 0 && (
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60 mb-3">{t('detail.images')}</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {(request.images as string[]).map((image, index) => (
                        <div key={index} className="aspect-square relative overflow-hidden rounded-xl border border-border/50 group cursor-pointer">
                          <img
                            src={image}
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {request.tags.filter(tag => !tag.startsWith('lang:')).length > 0 && (
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60 mb-3">{t('detail.tags')}</h2>
                    <div className="flex flex-wrap gap-2">
                      {request.tags.filter(tag => !tag.startsWith('lang:')).map((tag) => (
                        <span key={tag} className="px-4 py-1.5 bg-secondary text-secondary-foreground rounded-full text-xs font-bold tracking-tight">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Offers Section (In Main Col) */}
            <div className="bg-card rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold tracking-tight">
                  {t('detail.offers')} ({request._count.offers})
                </h2>
                {canSendOffer && <SendOfferButton requestId={id} variant="page" />}
              </div>

              {request._count.offers === 0 ? (
                <div className="text-center py-10 bg-muted/30 rounded-xl border border-dashed">
                  <Building2 className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
                  <p className="text-muted-foreground font-medium">{t('detail.noOffers')}</p>
                </div>
              ) : visibleOffers.length === 0 ? (
                <div className="text-center py-12 bg-muted/30 rounded-xl border border-dashed">
                  <Shield className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="font-bold text-lg text-foreground">{isRTL ? 'العروض مخفية' : 'Offers are hidden'}</p>
                  <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto leading-relaxed">
                    {isRTL ? 'حفاظاً على الخصوصية والمنافسة العادلة، يمكن لصاحب الطلب فقط رؤية تفاصيل العروض.' : 'To maintain privacy and fair competition, only the request owner can see the offer details.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {visibleOffers.map((offer) => (
                    <div key={offer.id} className="border border-border/60 bg-card rounded-xl p-5 hover:border-primary/30 transition-all duration-300">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-primary/5 rounded-xl border border-primary/10 flex items-center justify-center overflow-hidden shrink-0">
                            {offer.company.logo ? (
                              <img src={offer.company.logo} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <Building2 className="w-7 h-7 text-primary/40" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-foreground text-lg tracking-tight">{offer.company.name}</p>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1 font-medium">
                              <span className="flex items-center gap-1">
                                <span className="text-warning text-lg leading-none">★</span> {offer.company.rating.toFixed(1)}
                              </span>
                              <span className="opacity-40">|</span>
                              <span>{offer.company.reviewCount} {t('detail.reviews')}</span>
                              {offer.company.verificationStatus === 'VERIFIED' && (
                                <>
                                  <span className="opacity-40">|</span>
                                  <span className="text-emerald-600 flex items-center gap-1">
                                    <CheckCircle className="w-4 h-4 fill-emerald-500/10" /> {t('detail.verified')}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right sm:pt-1">
                          <div className="text-2xl font-black text-primary leading-none">
                            {offer.price.toLocaleString()} <span className="text-sm font-bold uppercase tracking-widest">{offer.currency}</span>
                          </div>
                          {offer.estimatedDays && (
                            <p className="text-xs font-bold text-muted-foreground/70 mt-1 uppercase tracking-widest">
                              {t('detail.estimatedDays', { days: offer.estimatedDays })}
                            </p>
                          )}
                        </div>
                      </div>
                      {offer.description && (
                        <div className="mt-4 p-4 bg-muted/20 rounded-lg border border-border/30">
                          <p className="text-foreground/80 leading-relaxed break-words overflow-wrap-anywhere whitespace-pre-wrap">{offer.description}</p>
                        </div>
                      )}
                      
                      {/* Offer Attachments */}
                      {Array.isArray(offer.attachments) && offer.attachments.length > 0 && (
                        <div className="mt-4">
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-2">{t('detail.images')}</p>
                          <div className="flex flex-wrap gap-2">
                            {(offer.attachments as string[]).map((url, i) => (
                              <div key={i} className="w-16 h-16 relative rounded-lg border border-border/50 overflow-hidden cursor-pointer group">
                                <img 
                                  src={url} 
                                  alt="" 
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                  onClick={() => window.open(url, '_blank')}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {isOwner && offer.status === 'PENDING' && (
                        <div className="mt-5 pt-5 border-t border-border/40">
                          <OfferActions
                            offerId={offer.id}
                            requestId={id}
                            acceptLabel={isRTL ? 'قبول العرض' : 'Accept Offer'}
                            rejectLabel={isRTL ? 'رفض العرض' : 'Reject Offer'}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Column (Right) */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Details Sidebar Card */}
            <div className="bg-card rounded-xl shadow-sm border p-6 sticky top-24">
              <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60 mb-5">{t('detail.details')}</h2>
              
              <div className="space-y-5">
                {/* Category */}
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/5 rounded-lg text-primary shrink-0">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-0.5">{t('detail.category')}</p>
                    <p className="font-bold text-sm">
                      {isRTL ? request.category?.nameAr : request.category?.nameEn}
                    </p>
                    {request.subcategory && (
                      <p className="text-xs text-muted-foreground font-medium">
                        {isRTL ? request.subcategory.nameAr : request.subcategory.nameEn}
                      </p>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-accent/10 rounded-lg text-accent-foreground shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-0.5">{t('detail.location')}</p>
                    <p className="font-bold text-sm">
                      {isRTL ? request.city?.nameAr : request.city?.nameEn}
                    </p>
                    <p className="text-xs text-muted-foreground font-medium">
                      {isRTL ? request.country?.nameAr : request.country?.nameEn}
                      {request.area && `, ${isRTL ? request.area.nameAr : request.area.nameEn}`}
                    </p>
                  </div>
                </div>

                {/* Budget */}
                {(request.budgetMin || request.budgetMax) && (
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-600 shrink-0">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-0.5">{t('detail.budget')}</p>
                      <p className="font-black text-lg text-foreground">
                        {request.budgetMin && request.budgetMax
                          ? `${request.budgetMin.toLocaleString()} - ${request.budgetMax.toLocaleString()}`
                          : request.budgetMin
                            ? `${t('detail.budgetFrom')} ${request.budgetMin.toLocaleString()}`
                            : `${t('detail.budgetUpTo')} ${request.budgetMax?.toLocaleString()}`}
                        <span className="text-xs ms-1 font-bold uppercase tracking-widest text-muted-foreground">{request.currency}</span>
                      </p>
                    </div>
                  </div>
                )}

                {/* Deadline */}
                {request.deadline && (
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-orange-500/10 rounded-lg text-orange-600 shrink-0">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-0.5">{t('detail.deadline')}</p>
                      <p className="font-bold text-sm">
                        {new Date(request.deadline).toLocaleDateString(locale, { dateStyle: 'long' })}
                      </p>
                    </div>
                  </div>
                )}

                {/* Remote Support */}
                {request.allowRemote && (
                  <div className="flex items-start gap-4 p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="font-bold text-sm text-emerald-700 leading-tight">{t('detail.remoteReady')}</p>
                      <p className="text-[10px] text-emerald-600/80 font-bold uppercase tracking-tight mt-0.5">{t('detail.remoteAllowed')}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Poster Info (Part of Sidebar) */}
              <div className="mt-10 pt-8 border-t">
                <h2 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-4">{t('detail.postedBy')}</h2>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-foreground rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                    {request.user.name?.[0]?.toUpperCase() || <User className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-foreground">{request.user.name}</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">{t('detail.memberSince')} {new Date(request.createdAt).getFullYear()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
