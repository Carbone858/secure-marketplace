'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, FileText, DollarSign, Clock, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { createOfferSchema, type CreateOfferInput } from '@/lib/validations/request';
import { useAuth } from '@/components/providers/AuthProvider';
import dynamic from 'next/dynamic';

const FileUpload = dynamic(() => import('@/components/ui/FileUpload').then(mod => mod.FileUpload), {
  ssr: false, 
  loading: () => (
    <div className="border border-dashed rounded-xl p-8 flex flex-col items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mb-2" />
      <p className="text-sm text-muted-foreground">Loading uploader...</p>
    </div>
  )
});

interface Request {
  id: string;
  title: string;
  description: string;
  budgetMin: number | null;
  budgetMax: number | null;
  currency: string;
  urgency: string;
  category: {
    nameEn: string;
    nameAr: string;
  };
  user: {
    name: string | null;
  };
}

export default function SubmitOfferPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const t = useTranslations('requests.offer');
  const { user, isLoading: authLoading } = useAuth();
  
  const [fromParam, setFromParam] = useState<string>('');

  useEffect(() => {
    const from = searchParams?.get('from');
    if (from) setFromParam(from);
  }, [searchParams]);

  const [request, setRequest] = useState<Request | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CreateOfferInput>({
    resolver: zodResolver(createOfferSchema),
    defaultValues: {
      currency: 'USD',
      requestId: params.id as string,  // required by offerSchema
      attachments: [],
    },
  });

  const currency = watch('currency');
  const formValues = watch();

  const DRAFT_TTL = 48 * 60 * 60 * 1000; // 48 hours

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`marketplace_offer_draft_${params.id}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed?.content && parsed?.timestamp) {
            const now = Date.now();
            if (now - parsed.timestamp < DRAFT_TTL) {
              reset({ ...parsed.content, requestId: params.id as string });
              toast.success(t('progressRestored') || 'Progress Restored', {
                description: t('progressRestoredDesc') || 'We have loaded your last draft.',
                duration: 5000,
              });
            } else {
              localStorage.removeItem(`marketplace_offer_draft_${params.id}`);
            }
          } else {
            // legacy format fallback or invalid
            localStorage.removeItem(`marketplace_offer_draft_${params.id}`);
          }
        } catch {}
      }
    }
    // eslint-disable-next-deps
  }, [params.id, reset, t]);

  useEffect(() => {
    if (typeof window !== 'undefined' && Object.keys(formValues).length > 2) { // check >2 so we don't save default empty state loop
      localStorage.setItem(`marketplace_offer_draft_${params.id}`, JSON.stringify({
        content: formValues,
        timestamp: Date.now()
      }));
    }
  }, [formValues, params.id]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/${locale}/auth/login?redirect=${encodeURIComponent(`/${locale}/requests/${params.id}/offer`)}`);
      return;
    }

    if (user?.role !== 'COMPANY') {
      toast.error('Only companies can submit offers');
      router.push(`/${locale}/requests/${params.id}`);
      return;
    }

    fetchRequest();
  }, [user, authLoading, params.id, locale, router]);

  const fetchRequest = async () => {
    try {
      const response = await fetch(`/api/requests/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch request');
      const data = await response.json();
      // API wraps response as: { success, data: { request } }
      const req = data.data?.request ?? data.request ?? data;
      setRequest(req);
      setValue('currency', req.currency);
    } catch (err) {
      setError(t('errors.general'));
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: CreateOfferInput) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/requests/${params.id}/offers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || result.error || 'Failed to submit offer');
      }

      toast.success(t('success.title'), {
        description: t('success.message'),
      });

      if (typeof window !== 'undefined') {
        localStorage.removeItem(`marketplace_offer_draft_${params.id}`);
      }

      const queryString = fromParam ? `?from=${fromParam}` : '';
      router.push(`/${locale}/requests/${params.id}${queryString}`);
    } catch (err: any) {
      toast.error(t('errors.general'), {
        description: err.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Called when Zod validation fails BEFORE submit — show user what's wrong
  const onInvalid = (errs: any) => {
    const firstMsg = Object.values(errs)[0] as any;
    toast.error('Please fix the form errors', {
      description: firstMsg?.message || 'Check all required fields',
    });
  };

  if (isLoading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>{error || t('errors.general')}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => {
          const queryString = fromParam ? `?from=${fromParam}` : '';
          router.push(`/${locale}/requests/${params.id}${queryString}`);
        }}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        {t('common.back')}
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Request Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('requestInfo')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{request.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {locale === 'ar' ? request.category.nameAr : request.category.nameEn}
                </p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {request.budgetMin && request.budgetMax
                      ? `${request.budgetMin.toLocaleString()} - ${request.budgetMax.toLocaleString()} ${request.currency}`
                      : request.budgetMin
                        ? `From ${request.budgetMin.toLocaleString()} ${request.currency}`
                        : request.budgetMax
                          ? `Up to ${request.budgetMax.toLocaleString()} ${request.currency}`
                          : 'Budget not specified'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="capitalize">{request.urgency.toLowerCase()}</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground line-clamp-4">
                  {request.description}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Offer Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="price">{t('fields.price')} *</Label>
                    <div className="group flex items-center bg-card border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all shadow-sm">
                      <div className="px-3 border-e bg-muted/30 text-muted-foreground flex items-center justify-center">
                        <DollarSign className="w-4 h-4" />
                      </div>
                      <Input
                        id="price"
                        type="number"
                        {...register('price', { valueAsNumber: true })}
                        placeholder="0.00"
                        className="flex-1 border-none focus-visible:ring-0 shadow-none h-11"
                      />
                      <div className="px-1 border-s bg-muted/10 h-11 flex items-center">
                        <select
                          {...register('currency')}
                          className="bg-transparent px-3 py-2 text-sm font-medium border-none focus:ring-0 outline-none h-full cursor-pointer"
                          value={currency}
                        >
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                          <option value="GBP">GBP</option>
                          <option value="SAR">SAR</option>
                          <option value="AED">AED</option>
                        </select>
                      </div>
                    </div>
                    {errors.price && (
                      <p className="text-sm text-destructive">{errors.price.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estimatedDays">{t('fields.timeline')}</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="estimatedDays"
                        type="number"
                        min={1}
                        {...register('estimatedDays', { valueAsNumber: true })}
                        placeholder="e.g. 14"
                        className="pl-10 h-11 rounded-xl"
                      />
                    </div>
                    {errors.estimatedDays && (
                      <p className="text-sm text-destructive">{errors.estimatedDays.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">{t('fields.description')} *</Label>
                  <Textarea
                    id="description"
                    {...register('description')}
                    placeholder={t('fields.descriptionPlaceholder')}
                    rows={6}
                    className="rounded-xl resize-none"
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive">{errors.description.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <FileUpload
                    label={t('fields.attachments')}
                    helperText={t('fields.attachmentsHint')}
                    onUploadComplete={(url: string) => {
                      const current = watch('attachments') || [];
                      setValue('attachments', [...current, url]);
                    }}
                    onRemove={(url: string) => {
                      const current = watch('attachments') || [];
                      setValue('attachments', current.filter((f: string) => f !== url));
                    }}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const queryString = fromParam ? `?from=${fromParam}` : '';
                      router.push(`/${locale}/requests/${params.id}${queryString}`);
                    }}
                  >
                    {t('common.cancel')}
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="flex-1">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {t('submit.loading')}
                      </>
                    ) : (
                      t('submit.button')
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
