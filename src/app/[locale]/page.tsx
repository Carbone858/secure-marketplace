
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

import { HeroSection } from '@/components/home';
import DynamicServicesBar from '@/components/home/DynamicServicesBar';
import Statistics from '@/components/home/Statistics';
import ServiceDiscovery from '@/components/home/ServiceDiscovery';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import UserProcess from '@/components/home/UserProcess';
import FeaturedCompanies from '@/components/home/FeaturedCompanies';
import CompanyProcess from '@/components/home/CompanyProcess';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'home' });
  return {
    title: t('meta.title'),
    description: t('meta.description'),
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      type: 'website',
    }
  };
}

export default function HomePage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('home');

  return (
    <div className="min-h-screen">
      {/* 1. Hero Section - Value Proposition & CTA */}
      <HeroSection />

      {/* 2. Visual Flair - Dynamic Services */}
      <DynamicServicesBar />

      {/* 3. Social Proof - Statistics */}
      <Statistics />

      {/* 4. Core Feature - Service Discovery */}
      <ServiceDiscovery />

      {/* 5. Trust & Differentiation - Why Choose Us */}
      <WhyChooseUs />

      {/* 6. Education - How it Works for Users */}
      <UserProcess />

      {/* 7. Validation - Featured Companies */}
      <FeaturedCompanies />

      {/* 8. Supply Side - How it Works for Companies */}
      <CompanyProcess />

      {/* 9. Final CTA - Call to Action */}
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
