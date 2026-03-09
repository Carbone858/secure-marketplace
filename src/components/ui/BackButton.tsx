'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';

interface BackButtonProps {
    fallbackHref: string;
    label: string;
}

export function BackButton({ fallbackHref, label }: BackButtonProps) {
    const locale = useLocale();
    const isRTL = locale === 'ar';

    return (
        <Link
            href={fallbackHref}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 cursor-pointer"
        >
            {isRTL ? '→' : '←'} {label}
        </Link>
    );
}
