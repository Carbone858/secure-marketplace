'use client';

import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

interface BackButtonProps {
    fallbackHref: string;
    label: string;
}

export function BackButton({ fallbackHref, label }: BackButtonProps) {
    const router = useRouter();
    const locale = useLocale();
    const isRTL = locale === 'ar';

    const handleBack = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        // Use browser history to preserve the dashboard context
        if (window.history.length > 1) {
            router.back();
        } else {
            router.push(fallbackHref);
        }
    };

    return (
        <a
            href={fallbackHref}
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 cursor-pointer"
        >
            {isRTL ? '→' : '←'} {label}
        </a>
    );
}
