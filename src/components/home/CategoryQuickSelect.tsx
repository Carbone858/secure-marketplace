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

  const displayed = categories.slice(0, maxItems);

  if (displayed.length === 0) return null;

  return (
    <div className="w-full flex flex-col items-center">
      <p className="text-sm font-medium text-muted-foreground mb-3 text-center">
        {t('hero.popularCategories')}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl w-full justify-center">
        {displayed.map((cat) => {
          const label = locale === 'ar' && cat.nameAr ? cat.nameAr : cat.name;
          return (
            <Link
              key={cat.id}
              href={`/${locale}/requests/start?categoryId=${cat.id}`}
              className="group flex items-center gap-2.5 rounded-full border border-border/60 bg-card px-5 py-3 mx-auto 
                         transition-all duration-200 hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm min-w-[170px] justify-center"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary 
                              transition-colors group-hover:bg-primary/20">
                <CategoryIcon
                  iconName={cat.iconName}
                  emoji={cat.icon}
                  className="h-5 w-5"
                  size={20}
                />
              </span>
              <span className="text-base font-medium leading-tight text-foreground/80 group-hover:text-foreground line-clamp-2">
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
