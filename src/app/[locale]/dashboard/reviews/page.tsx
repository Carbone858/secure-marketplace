'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Star, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLocale } from 'next-intl';

export default function UserReviewsPage() {
  const locale = useLocale();
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch('/api/user/reviews');
        if (!res.ok) throw new Error();
        const data = await res.json();
        setReviews(data.reviews || []);
      } catch {
        // Endpoint may not exist yet
        setReviews([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i <= rating ? 'fill-warning text-warning' : 'text-muted-foreground/30'}`}
        />
      ))}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Star className="h-8 w-8" />
          My Reviews
        </h1>
        <p className="text-muted-foreground mt-1">Reviews you have given to companies</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : reviews.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No reviews yet</h3>
            <p className="text-muted-foreground mt-1">
              You can leave reviews after completing projects with companies
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <p className="font-medium">{review.company?.nameEn || review.company?.nameAr || 'Company'}</p>
                      {renderStars(review.rating)}
                    </div>
                    {review.comment && (
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                    )}
                    {review.project && (
                      <Badge variant="outline">Project: {review.project.title}</Badge>
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
