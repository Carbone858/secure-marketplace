
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';

import { getFeaturedCategories } from '@/lib/services/categoryService';
import { getFeaturedCompanies } from '@/lib/services/companyService';
import { HeroSection } from '@/components/home';
import DynamicServicesBar from '@/components/home/DynamicServicesBar';
import Statistics from '@/components/home/Statistics';
import AppShowcase from '@/components/home/AppShowcase';

// Lazy loading below-the-fold heavy components for low-bandwidth optimization
const ServiceDiscovery = dynamic(() => import('@/components/home/ServiceDiscovery'), { ssr: false });
const WhyChooseUs = dynamic(() => import('@/components/home/WhyChooseUs'), { ssr: false });
const UserProcess = dynamic(() => import('@/components/home/UserProcess'), { ssr: false });
const FeaturedCompanies = dynamic(() => import('@/components/home/FeaturedCompanies'), { ssr: false });
const CompanyProcess = dynamic(() => import('@/components/home/CompanyProcess'), { ssr: false });
const TrustSafety = dynamic(() => import('@/components/home/TrustSafety'), { ssr: false });
const FAQSection = dynamic(() => import('@/components/home/FAQSection'), { ssr: false });

import { CANONICAL_DOMAIN } from '@/lib/config/site';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'home' });
  const canonicalUrl = `${CANONICAL_DOMAIN}/${locale}`;

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ar: `${CANONICAL_DOMAIN}/ar`,
        en: `${CANONICAL_DOMAIN}/en`,
        'x-default': `${CANONICAL_DOMAIN}/ar`,
      },
    },
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      url: canonicalUrl,
      type: 'website',
      siteName: 'وسيط Wassitt',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('meta.title'),
      description: t('meta.description'),
    },
  };
}


export default async function HomePage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'home' });
  const categories = await getFeaturedCategories(locale);
  const companies = await getFeaturedCompanies(locale);

  return (
    <div className="min-h-screen">
      {/* 1. Hero Section - Value Proposition & CTA */}
      <HeroSection initialCategories={categories} />

      {/* 2. Visual Flair - Dynamic Services */}
      <DynamicServicesBar />

      {/* 3. Social Proof - Statistics */}
      <Statistics />

      {/* 4. Core Feature - Service Discovery */}
      <ServiceDiscovery />

      {/* 5. Trust & Differentiation - Why Choose Us */}
      <WhyChooseUs />

      {/* 6. Security & Peace of Mind - Trust Section */}
      <TrustSafety />

      {/* 7. Education - How it Works for Users */}
      <UserProcess />

      {/* 8. Validation - Featured Companies */}
      <FeaturedCompanies initialCompanies={companies} />

      {/* 9. Supply Side - How it Works for Companies */}
      <CompanyProcess />

      {/* 10. Mobile App - Download & Install Guide */}
      <AppShowcase />

      {/* 11. Education - FAQ */}
      <FAQSection />

      {/* 11. Final CTA - Call to Action */}
      <section className="py-24 bg-primary/5 border-t">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary">
            {t('cta.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              variant="default"
              className="font-bold shadow-lg shadow-primary/20 px-8 py-6 text-lg h-auto"
              asChild
            >
              <Link href={`/${locale}/requests/start`}>
                {t('cta.postRequest')}
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary/5 font-bold px-8 py-6 text-lg h-auto"
              asChild
            >
              <Link href={`/${locale}/company/join`}>
                {t('cta.registerCompany')}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
