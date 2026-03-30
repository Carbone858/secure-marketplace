'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { CheckCircle, AlertTriangle, Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ReviewConfirmModal } from './ReviewConfirmModal';

interface RequestDeliveryBannerProps {
  requestId: string;
  deliveredAt: Date | string | null;
  reviewDeadline: Date | string | null;
  isAutoCompleted?: boolean;
}

export function RequestDeliveryBanner({ 
  requestId, 
  deliveredAt, 
  reviewDeadline,
  isAutoCompleted 
}: RequestDeliveryBannerProps) {
  const t = useTranslations('requests.completion');
  const locale = useLocale();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (!reviewDeadline) return;

    const calculateTimeLeft = () => {
      const deadline = new Date(reviewDeadline).getTime();
      const now = new Date().getTime();
      const difference = deadline - now;

      if (difference <= 0) {
        setTimeLeft('Expired');
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      
      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h`);
      } else {
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${hours}h ${minutes}m`);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [reviewDeadline]);

  const deadlineDate = reviewDeadline ? new Date(reviewDeadline).toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }) : '';

  return (
    <>
      <div className="mb-6 overflow-hidden rounded-xl border border-orange-200 bg-orange-50 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-4 p-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
            <CheckCircle className="h-6 w-6" />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-lg font-bold text-orange-900">
              {t('banner.title')}
            </h3>
            <p className="text-sm text-orange-800">
              {t('banner.description', { days: 10 })}
            </p>
            {reviewDeadline && (
              <div className="mt-2 flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs font-medium text-orange-700">
                <span className="flex items-center gap-1.5 bg-orange-100 px-2 py-1 rounded">
                  <Clock className="h-3.5 w-3.5" />
                  {timeLeft} remaining
                </span>
                <span className="opacity-75">
                  • {t('banner.deadlineWarning', { date: deadlineDate })}
                </span>
              </div>
            )}
          </div>

          <div className="shrink-0 w-full md:w-auto">
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold shadow-lg shadow-orange-200"
            >
              {t('actions.reviewConfirm')}
              <ChevronRight className="ms-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <ReviewConfirmModal 
        requestId={requestId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
