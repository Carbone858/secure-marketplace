'use client';

import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useAuth } from '@/components/providers/AuthProvider';
import { Send } from 'lucide-react';

interface SendOfferButtonProps {
    requestId: string;
    /** 'card' = compact style for list cards, 'page' = large style for detail page */
    variant?: 'card' | 'page';
    className?: string;
}

export function SendOfferButton({ requestId, variant = 'card', className = '' }: SendOfferButtonProps) {
    const router = useRouter();
    const locale = useLocale();
    const { user } = useAuth();
    const isAr = locale === 'ar';

    const label = isAr ? 'إرسال عرض' : 'Send Offer';

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault(); // prevent Link parent from navigating
        e.stopPropagation();

        if (user && user.role === 'COMPANY') {
            // Authenticated company → go to offer form
            router.push(`/${locale}/requests/${requestId}/offer`);
        } else {
            // Not logged in or not a company → go to company signup
            router.push(`/${locale}/company/join`);
        }
    };

    if (variant === 'page') {
        return (
            <button
                type="button"
                onClick={handleClick}
                className={`inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 active:scale-95 transition-all shadow-sm ${className}`}
            >
                <Send className="w-5 h-5" />
                {label}
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-sm rounded-lg font-medium hover:bg-primary/90 active:scale-95 transition-all flex-shrink-0 ${className}`}
        >
            <Send className="w-3.5 h-3.5" />
            {label}
        </button>
    );
}
