'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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

interface Request {
  id: string;
  title: string;
  description: string;
  budgetMin: number | null;
  budgetMax: number | null;
  currency: string;
  urgency: string;
  category: {
    name: string;
  };
  user: {
    name: string | null;
  };
}

export default function SubmitOfferPage() {
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('requests.offer');
  const { user, isLoading: authLoading } = useAuth();
  
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
  } = useForm<CreateOfferInput>({
    resolver: zodResolver(createOfferSchema),
    defaultValues: {
      currency: 'USD',
    },
  });

  const currency = watch('currency');

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
      setRequest(data.request);
      setValue('currency', data.request.currency);
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

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit offer');
      }

      toast.success(t('success.title'), {
        description: t('success.message'),
      });

      router.push(`/${locale}/requests/${params.id}`);
    } catch (err: any) {
      toast.error(t('errors.general'), {
        description: err.message,
      });
    } finally {
      setIsSubmitting(false);
    }
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
        onClick={() => router.push(`/${locale}/requests/${params.id}`)}
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
                  {request.category.name}
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
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">{t('fields.price')} *</Label>
                    <div className="flex gap-2">
                      <Input
                        id="price"
                        type="number"
                        {...register('price', { valueAsNumber: true })}
                        placeholder="0.00"
                        className="flex-1"
                      />
                      <select
                        {...register('currency')}
                        className="w-24 px-3 py-2 border rounded-md"
                        value={currency}
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="SAR">SAR</option>
                        <option value="AED">AED</option>
                      </select>
                    </div>
                    {errors.price && (
                      <p className="text-sm text-destructive">{errors.price.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeline">{t('fields.timeline')}</Label>
                    <Input
                      id="timeline"
                      {...register('timeline')}
                      placeholder={t('fields.timelinePlaceholder')}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">{t('fields.description')} *</Label>
                  <Textarea
                    id="description"
                    {...register('description')}
                    placeholder={t('fields.descriptionPlaceholder')}
                    rows={6}
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive">{errors.description.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="attachments">{t('fields.attachments')}</Label>
                  <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {t('fields.attachmentsHint')}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push(`/${locale}/requests/${params.id}`)}
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
