'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Star, Loader2, AlertTriangle, CheckCircle2, MessageSquare } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ReviewConfirmModalProps {
  requestId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ReviewConfirmModal({ requestId, isOpen, onClose, onSuccess }: ReviewConfirmModalProps) {
  const router = useRouter();
  const t = useTranslations('requests.completion');
  
  const [mode, setMode] = useState<'CONFIRM' | 'REQUEST_CHANGES'>('CONFIRM');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (action: 'APPROVE' | 'REJECT') => {
    if (action === 'APPROVE' && rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (action === 'REJECT' && !feedback.trim()) {
      toast.error('Please describe what changes are needed');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/requests/${requestId}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          rating: action === 'APPROVE' ? rating : undefined,
          comment: action === 'APPROVE' ? comment : undefined,
          feedback: action === 'REJECT' ? feedback : undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit');
      }

      toast.success(action === 'APPROVE' ? t('review.success') : t('review.rejected'));
      router.refresh();
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setRating(0);
    setComment('');
    setFeedback('');
    setMode('CONFIRM');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === 'CONFIRM' ? (
              <><CheckCircle2 className="w-5 h-5 text-success" /> {t('actions.confirmTitle')}</>
            ) : (
              <><AlertTriangle className="w-5 h-5 text-orange-500" /> {t('actions.requestChanges')}</>
            )}
          </DialogTitle>
          <DialogDescription>
            {mode === 'CONFIRM' 
              ? t('actions.confirmDescription')
              : t('review.feedbackLabel')
            }
          </DialogDescription>
        </DialogHeader>

        {mode === 'CONFIRM' ? (
          <div className="space-y-6 py-4">
            <div className="flex flex-col items-center justify-center space-y-3">
              <Label className="text-base font-semibold">{t('review.ratingLabel')}</Label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="p-1 focus:outline-none transition-transform hover:scale-110"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                  >
                    <Star
                      className={`w-10 h-10 ${
                        star <= (hoverRating || rating)
                          ? 'fill-warning text-warning'
                          : 'text-muted-foreground/30'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <span className="text-sm font-medium text-warning">
                  {rating === 5 ? 'Excellent!' : rating === 4 ? 'Very Good' : rating === 3 ? 'Good' : rating === 2 ? 'Fair' : 'Poor'}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="review-text">
                {t('review.reviewLabel')}
                {rating > 0 && rating <= 2 && <span className="text-destructive ms-1">*</span>}
              </Label>
              <Textarea
                id="review-text"
                placeholder={t('review.feedbackPlaceholder')}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[100px] resize-none"
              />
              {rating > 0 && rating <= 2 && !comment.trim() && (
                <p className="text-xs text-destructive italic">{t('review.reviewRequiredLabel')}</p>
              )}
            </div>

            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => setMode('REQUEST_CHANGES')}
                className="text-sm text-muted-foreground hover:text-orange-600 underline underline-offset-4"
              >
                {t('actions.requestChanges')}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="feedback-text">{t('review.feedbackLabel')}</Label>
              <Textarea
                id="feedback-text"
                placeholder={t('review.feedbackPlaceholder')}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="min-h-[150px] border-orange-200 focus:ring-orange-500"
                autoFocus
              />
            </div>
            <div className="bg-orange-50 p-3 rounded-lg border border-orange-100 flex gap-3 text-sm text-orange-800">
              <MessageSquare className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <p>Your feedback will be sent directly to the company. The project status will return to "In Progress" so they can work on these changes.</p>
            </div>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setMode('CONFIRM')}
                className="text-sm text-muted-foreground hover:text-primary underline underline-offset-4"
              >
                Back to Confirmation
              </button>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            {t('actions.cancel')}
          </Button>
          
          {mode === 'CONFIRM' ? (
            <Button
              onClick={() => handleSubmit('APPROVE')}
              disabled={isSubmitting || rating === 0 || (rating <= 2 && !comment.trim())}
              className="bg-success hover:bg-success/90"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin me-2" /> : <CheckCircle2 className="w-4 h-4 me-2" />}
              {t('actions.submitComplete')}
            </Button>
          ) : (
            <Button
              onClick={() => handleSubmit('REJECT')}
              disabled={isSubmitting || !feedback.trim()}
              variant="destructive"
              className="bg-orange-600 hover:bg-orange-700 border-none"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin me-2" /> : <MessageSquare className="w-4 h-4 me-2" />}
              {t('actions.requestChanges')}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
