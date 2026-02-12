'use client';

import { useState, useEffect } from 'react';
import { Star, Loader2, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLocale, useTranslations } from 'next-intl';

export default function CompanyReviewsPage() {
  const locale = useLocale();
  const t = useTranslations('company_dashboard');
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [avgRating, setAvgRating] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch('/api/company/dashboard');
        if (!res.ok) throw new Error();
        const data = await res.json();
        setAvgRating(data.stats?.averageRating || 0);
        if (data.company?.id) {
          const reviewsRes = await fetch(`/api/companies/${data.company.id}/reviews`);
          if (reviewsRes.ok) {
            const reviewsData = await reviewsRes.json();
            setReviews(reviewsData.reviews || []);
          }
        }
      } catch {
        // Reviews may not be available
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`h-4 w-4 ${i <= rating ? 'fill-warning text-warning' : 'text-muted-foreground/30'}`} />
      ))}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Star className="h-8 w-8" />
          {t('reviews.title')}
        </h1>
        <p className="text-muted-foreground mt-1">{t('reviews.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 mx-auto text-warning mb-2" />
            <p className="text-3xl font-bold">{avgRating.toFixed(1)}</p>
            <p className="text-sm text-muted-foreground">{t('reviews.averageRating')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Star className="h-8 w-8 mx-auto text-info mb-2" />
            <p className="text-3xl font-bold">{reviews.length}</p>
            <p className="text-sm text-muted-foreground">{t('reviews.totalReviews')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Star className="h-8 w-8 mx-auto text-success mb-2" />
            <p className="text-3xl font-bold">{reviews.filter((r: any) => r.rating >= 4).length}</p>
            <p className="text-sm text-muted-foreground">{t('reviews.positiveReviews')}</p>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : reviews.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">{t('reviews.noReviews')}</h3>
            <p className="text-muted-foreground mt-1">{t('reviews.noReviewsDesc')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {reviews.map((review: any) => (
            <Card key={review.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <p className="font-medium">{review.user?.name || t('reviews.anonymous')}</p>
                      {renderStars(review.rating)}
                    </div>
                    {review.comment && (
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                    )}
                    {review.project && (
                      <Badge variant="outline">{t('reviews.project', { title: review.project.title })}</Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
