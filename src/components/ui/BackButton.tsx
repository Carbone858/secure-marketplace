'use client';

import { useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface BackButtonProps {
    fallbackHref: string;
    label: string;
}

const FROM_ROUTES: Record<string, (locale: string) => string> = {
    'company-browse': (locale) => `/${locale}/company/dashboard/browse`,
    'owner-dashboard': (locale) => `/${locale}/dashboard/requests`,
    'admin-requests': (locale) => `/${locale}/admin/requests`,
};

export function BackButton({ fallbackHref, label }: BackButtonProps) {
    const locale = useLocale();
    const isRTL = locale === 'ar';
    const searchParams = useSearchParams();

    const fromParam = searchParams.get('from');
    const resolvedHref = (fromParam && FROM_ROUTES[fromParam])
        ? FROM_ROUTES[fromParam](locale)
        : fallbackHref;

    return (
        <Link
            href={resolvedHref}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 cursor-pointer"
        >
            {isRTL ? '→' : '←'} {label}
        </Link>
    );
}
