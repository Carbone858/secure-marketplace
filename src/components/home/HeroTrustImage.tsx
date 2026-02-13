'use client';

import Image from 'next/image';

interface HeroTrustImageProps {
  /** Image source URL or path */
  imageUrl: string;
  /** Alt text for accessibility */
  alt: string;
  /** Hide this image on mobile viewports (default: true) */
  hideOnMobile?: boolean;
  /** Position relative to content (affects layout ordering) */
  position?: 'left' | 'right';
}

/**
 * HeroTrustImage — Emotional design / conversion booster element.
 * Displays a human photo or illustration to build trust.
 * 
 * Usage:
 *   <HeroTrustImage
 *     imageUrl="/images/hero-person.webp"
 *     alt="Professional service provider"
 *   />
 * 
 * The image is:
 * - Lazy-loaded (priority=false by default)
 * - Optimized via Next.js Image component
 * - Responsive with no layout shift (fill mode)
 * - Easily replaceable — just change the imageUrl prop
 */
export default function HeroTrustImage({
  imageUrl,
  alt,
  hideOnMobile = true,
  position = 'right',
}: HeroTrustImageProps) {
  return (
    <div
      className={`
        relative w-full
        ${hideOnMobile ? 'hidden lg:block' : 'block'}
        ${position === 'left' ? 'order-first' : 'order-last'}
      `}
    >
      <div className="relative aspect-[4/3] w-full max-w-lg mx-auto">
        {/* Decorative background blob */}
        <div
          className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent 
                      -rotate-3 scale-105 blur-sm"
          aria-hidden="true"
        />
        {/* Image container */}
        <div className="relative h-full w-full overflow-hidden rounded-2xl">
          <Image
            src={imageUrl}
            alt={alt}
            fill
            sizes="(max-width: 1024px) 0px, 480px"
            className="object-cover object-center"
            priority={false}
            quality={80}
          />
        </div>
        {/* Trust indicator floating badge */}
        <div className="absolute -bottom-3 -start-3 rounded-xl bg-card border border-border shadow-lg px-4 py-2.5">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1.5 rtl:space-x-reverse">
              <div className="h-7 w-7 rounded-full bg-primary/20 border-2 border-card" />
              <div className="h-7 w-7 rounded-full bg-primary/30 border-2 border-card" />
              <div className="h-7 w-7 rounded-full bg-primary/40 border-2 border-card" />
            </div>
            <span className="text-xs font-semibold text-foreground">+10K</span>
          </div>
        </div>
      </div>
    </div>
  );
}
