'use client';

import React, { useMemo } from 'react';
import { usePathname } from '@/i18n/navigation';
import { useTranslations, useLocale } from 'next-intl';
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
    BreadcrumbEllipsis,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

// Help helper to check if a segment is likely a UUID or numeric ID
const isDynamicSegment = (segment: string) => {
    // UUID pattern or numeric
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const isNumeric = /^\d+$/.test(segment);
    return uuidPattern.test(segment) || isNumeric;
};

// Helper to format slugs or labels
const formatLabel = (segment: string) => {
    return segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

interface DynamicBreadcrumbsProps {
    className?: string;
    overrides?: Record<string, string>;
}

export function DynamicBreadcrumbs({ className, overrides }: DynamicBreadcrumbsProps) {
    const pathname = usePathname();
    const t = useTranslations('breadcrumbs');
    const locale = useLocale();

    // Exclude landing and auth pages
    const isExcluded = useMemo(() => {
        const excludedPaths = ['/', '/login', '/register', '/forgot-password', '/reset-password'];
        return excludedPaths.includes(pathname);
    }, [pathname]);

    const breadcrumbs = useMemo(() => {
        if (isExcluded) return [];

        const segments = pathname.split('/').filter(Boolean);

        let items = segments.map((segment: string, index: number) => {
            const path = `/${segments.slice(0, index + 1).join('/')}`;
            const isLast = index === segments.length - 1;

            // Try to get translation
            let label = segment;
            try {
                // Check overrides first
                if (overrides && overrides[segment]) {
                    label = overrides[segment];
                } else if (isDynamicSegment(segment)) {
                    // Dynamic segment (UUID or ID)
                    label = t('details');
                } else {
                    // Static segment
                    const translation = t(segment);
                    if (translation !== `breadcrumbs.${segment}`) {
                        label = translation;
                    } else {
                        label = formatLabel(segment);
                    }
                }
            } catch (e) {
                label = formatLabel(segment);
            }

            return {
                label,
                path,
                isLast,
            };
        });

        // Handle collapsing if > 4 levels
        if (items.length > 4) {
            const first = items[0];
            const lastSegments = items.slice(-2);
            return [first, { label: '...', path: '#', isLast: false, isSeparator: false, isEllipsis: true }, ...lastSegments];
        }

        return items;
    }, [pathname, t, overrides, isExcluded]);

    // JSON-LD Structured Data for SEO
    const jsonLd = useMemo(() => {
        if (breadcrumbs.length === 0) return null;

        const filteredBreadcrumbs = breadcrumbs.filter((b: any) => !b.isEllipsis);

        const itemListElement = filteredBreadcrumbs.map((crumb: any, index: number) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: crumb.label,
            item: `${typeof window !== 'undefined' ? window.location.origin : ''}/${locale}${crumb.path}`,
        }));

        return {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement,
        };
    }, [breadcrumbs, locale]);

    if (isExcluded || breadcrumbs.length === 0) return null;

    return (
        <>
            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}
            <Breadcrumb className={className}>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink as={Link} href="/" className="flex items-center gap-1">
                            <Home className="h-3.5 w-3.5" />
                            <span className="sr-only">{t('home')}</span>
                        </BreadcrumbLink>
                    </BreadcrumbItem>

                    <BreadcrumbSeparator />

                    {breadcrumbs.map((crumb: any, index: number) => (
                        <React.Fragment key={crumb.isEllipsis ? `ellipsis-${index}` : crumb.path}>
                            <BreadcrumbItem>
                                {crumb.isLast ? (
                                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                                ) : crumb.isEllipsis ? (
                                    <BreadcrumbEllipsis />
                                ) : (
                                    <BreadcrumbLink as={Link} href={crumb.path}>
                                        {crumb.label}
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                            {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                        </React.Fragment>
                    ))}
                </BreadcrumbList>
            </Breadcrumb>
        </>
    );
}
