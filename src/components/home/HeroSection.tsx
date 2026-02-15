'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CategoryQuickSelect, { type FeaturedCategory } from './CategoryQuickSelect';
import HeroTrustImage from './HeroTrustImage';
import HowItWorksSection from './HowItWorksSection';

/**
 * HeroSection — offerta.se / mittanbud.no inspired hero.
 *
 * Layout:
 *   Desktop: 2-column grid — Left (headline + CTA + categories) | Right (trust image)
 *   Mobile:  Single column — Headline → CTA → Categories → Image (optional)
 *
 * Data fetching happens here (top of the component tree for the hero),
 * then passed down to presentational children.
 */
export default function HeroSection() {
  const locale = useLocale();
  const t = useTranslations('home');
  const [categories, setCategories] = useState<FeaturedCategory[]>([]);

  useEffect(() => {
    fetchFeaturedCategories();
  }, [locale]);

  const fetchFeaturedCategories = async () => {
    try {
      const res = await fetch(`/api/categories?featured=true&limit=8&locale=${locale}`);
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories);
      }
    } catch {
      // Fail silently — categories grid just won't render
    }
  };



  const trustPoints = [
    t('hero.trustPoint1'),
    t('hero.trustPoint2'),
    t('hero.trustPoint3'),
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/[0.06] via-background to-primary/[0.03]">
      <div className="container mx-auto px-2 py-4 md:py-5 lg:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* ───── LEFT: Content ───── */}
          <div className="flex flex-col gap-4 max-w-xl">
            {/* Headline */}
            <div className="flex flex-col gap-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.15]">
                {t('hero.title')}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t('hero.subtitle')}
              </p>
            </div>

            {/* Category Quick Select — moved up */}
            <div className="pt-2">
              <CategoryQuickSelect categories={categories} maxItems={8} />
            </div>

            {/* Trust points */}
            <ul className="flex flex-col gap-2">
              {trustPoints.map((point, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-success shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <Button
                size="lg"
                asChild
                className="h-14 px-10 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-primary to-primary/85 hover:from-primary/90 hover:to-primary rounded-xl hover:scale-[1.03] active:scale-[0.98]"
              >
                <Link href={`/${locale}/requests/start`}>
                  {t('hero.startRequest')}
                  <ArrowRight className="h-5 w-5 ms-2" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="h-14 px-10 text-lg font-bold rounded-xl border-2 border-primary/30 hover:border-primary/60 hover:bg-primary/5 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
              >
                <Link href={`/${locale}/company/register`}>
                  {t('hero.registerCompany')}
                </Link>
              </Button>
            </div>
          </div>

          {/* ───── RIGHT: Trust Image ───── */}
          <HeroTrustImage
            imageUrl="/images/hero-services.svg"
            alt={t('hero.imageAlt')}
            hideOnMobile={true}
            position="right"
          />
        </div>

        {/* How It Works Section — now embedded below hero content, visible together */}
        <div className="mt-4">
          <HowItWorksSection />
        </div>
      </div>

      {/* Subtle decorative gradient orb — purely visual */}
      <div
        className="absolute -top-32 -end-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
    </section>
  );
}
