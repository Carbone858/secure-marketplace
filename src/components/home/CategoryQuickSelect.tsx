'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import CategoryIcon from './CategoryIcon';

export interface FeaturedCategory {
    id: string;
    name: string;
    nameEn: string;
    nameAr: string | null;
    slug: string;
    icon: string | null;
    iconName: string | null;
    imageUrl: string | null;
    _count?: { companies?: number };
}

interface CategoryQuickSelectProps {
    categories: FeaturedCategory[];
    /** Maximum categories to display (default: 8) */
    maxItems?: number;
}

// Hardcoded original 8 categories to preserve the exact style, size, and layout of Hero Section
const originalHeroCategories = [
    { id: "home-maintenance", nameEn: "AC & HVAC", nameAr: "تكييف وتبريد", iconName: "fan", icon: "❄️" },
    { id: "home-maintenance", nameEn: "Electrical", nameAr: "كهرباء", iconName: "electrical", icon: "⚡" },
    { id: "home-maintenance", nameEn: "Plumbing", nameAr: "سباكة", iconName: "plumbing", icon: "🚰" },
    { id: "home-maintenance", nameEn: "Carpentry", nameAr: "نجارة", iconName: "hammer", icon: "🔨" },
    { id: "real-estate-construction", nameEn: "Construction", nameAr: "مقاولات", iconName: "construction", icon: "🏗️" },
    { id: "home-maintenance", nameEn: "Cleaning", nameAr: "تنظيف", iconName: "cleaning", icon: "🧹" },
    { id: "automotive-logistics", nameEn: "Moving", nameAr: "نقل عفش", iconName: "moving", icon: "📦" },
    { id: "tech-programming", nameEn: "IT Support", nameAr: "دعم تقني", iconName: "it", icon: "💻" }
];

/**
 * CategoryQuickSelect — Featured category grid for the Hero section.
 * Clicking a category routes to /requests/start?categoryId=ID
 * Data is fetched externally and passed in as props (separation of concerns).
 */
export default function CategoryQuickSelect({
    categories,
    maxItems = 8,
}: CategoryQuickSelectProps) {
    const locale = useLocale();
    const t = useTranslations('home');

    // We use the exact 8 original popular categories as requested by the user
    const displayed = originalHeroCategories;

    return (
        <div className="w-full flex flex-col items-center lg:items-start">
            <p className="text-sm font-medium text-muted-foreground mb-3 text-center lg:text-start w-full px-1">
                {t('hero.popularCategories')}
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-x-3 gap-y-4 w-full">
                {displayed.map((cat, idx) => {
                    const label = locale === 'ar' ? cat.nameAr : cat.nameEn;
                    return (
                        <Link
                            key={idx}
                            href={`/${locale}/requests/start?categoryId=${cat.id}`}
                            className="group flex flex-col items-center gap-2 p-1 transition-transform duration-200 hover:scale-105 active:scale-95 text-center w-full"
                        >
                            <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-secondary/5 text-primary 
                              transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground shadow-sm ring-1 ring-border/10">
                                <CategoryIcon
                                    iconName={cat.iconName}
                                    emoji={cat.icon}
                                    className="h-[50px] w-[50px]"
                                    size={50}
                                />
                            </span>
                            <span className="text-sm font-medium leading-tight text-muted-foreground group-hover:text-foreground line-clamp-2 min-h-[2.5em] flex items-center justify-center w-full px-1">
                                {label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
