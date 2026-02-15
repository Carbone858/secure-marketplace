'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import {
  Building2,
  CheckCircle,
  Star,
  TrendingUp,
  Shield,
  Clock,
  Users,
  Briefcase,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { HeroSection } from '@/components/home';

import DynamicServicesBar from '@/components/home/DynamicServicesBar';

interface Company {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  averageRating: number;
  reviewCount: number;
}

export default function HomePage() {
  const locale = useLocale();
  const t = useTranslations('home');
  const [featuredCompanies, setFeaturedCompanies] = useState<Company[]>([]);

  useEffect(() => {
    fetchFeaturedCompanies();
  }, []);

  const fetchFeaturedCompanies = async () => {
    try {
      const response = await fetch('/api/companies/search?limit=4&sortBy=rating');
      if (response.ok) {
        const data = await response.json();
        setFeaturedCompanies(data.companies);
      }
    } catch (err) {
      console.error('Failed to fetch featured companies');
    }
  };

  const features = [
    {
      icon: Shield,
      title: t('features.verified.title'),
      description: t('features.verified.description'),
    },
    {
      icon: Clock,
      title: t('features.quickResponse.title'),
      description: t('features.quickResponse.description'),
    },
    {
      icon: Users,
      title: t('features.trustedNetwork.title'),
      description: t('features.trustedNetwork.description'),
    },
    {
      icon: TrendingUp,
      title: t('features.growBusiness.title'),
      description: t('features.growBusiness.description'),
    },
  ];

  const stats = [
    { value: '10K+', label: t('stats.verifiedCompanies') },
    { value: '50K+', label: t('stats.serviceRequests') },
    { value: '100K+', label: t('stats.happyCustomers') },
    { value: '4.8', label: t('stats.averageRating') },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />


      {/* Dynamic Services Bar */}
      <DynamicServicesBar />

      {/* Featured Companies Section */}
      <section className="py-24 bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">{t('featured.title')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('featured.subtitle')}
            </p>
          </div>

          {featuredCompanies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredCompanies.map((company) => (
                <Link
                  key={company.id}
                  href={`/${locale}/companies/${company.slug}`}
                  className="block"
                >
                  <div className="flex flex-col items-center bg-card rounded-2xl shadow-sm p-8 h-full hover:shadow-lg transition-shadow">
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4 overflow-hidden">
                      {company.logo ? (
                        <img
                          src={company.logo}
                          alt={company.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <Building2 className="h-10 w-10 text-muted-foreground" />
                      )}
                    </div>
                    <h3 className="font-semibold text-lg mb-1 text-center">{company.name}</h3>
                    <div className="flex items-center gap-1 text-sm mb-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-muted-foreground">
                        {t('featured.verified')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-4 w-4 text-warning fill-warning" />
                      <span className="font-medium">
                        {company.averageRating.toFixed(1)}
                      </span>
                      <span className="text-muted-foreground">
                        {t('featured.reviewCount', { count: company.reviewCount })}
                      </span>
                    </div>
                    {/* Placeholder for services offered (future: add real data) */}
                    <div className="text-xs text-muted-foreground text-center mt-1">
                      {/* Example: "نجارة، دهان، سباكة" */}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/20 rounded-2xl">
              <Building2 className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">
                {locale === 'ar' ? 'الشركات المميزة قادمة قريباً' : 'Featured companies coming soon'}
              </p>
              <Button variant="outline" className="mt-4" asChild>
                <Link href={`/${locale}/company/register`}>
                  {locale === 'ar' ? 'سجل شركتك الآن' : 'Register your company'}
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Statistics Section */}\

      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={stat.label} className="flex flex-col items-center justify-center bg-card rounded-2xl shadow-sm p-8">
                <span className="mb-4 flex items-center justify-center h-14 w-14 rounded-full bg-primary/10">
                  {/* Example icons for each stat */}
                  {i === 0 && <Shield className="h-7 w-7 text-primary" />}
                  {i === 1 && <Briefcase className="h-7 w-7 text-primary" />}
                  {i === 2 && <Users className="h-7 w-7 text-primary" />}
                  {i === 3 && <Star className="h-7 w-7 text-primary" />}
                </span>
                <p className="text-3xl md:text-4xl font-bold text-primary">
                  {stat.value}
                </p>
                <p className="text-muted-foreground mt-2 text-center">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">{t('whyChooseUs.title')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('whyChooseUs.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="flex flex-col items-center bg-card rounded-2xl shadow-sm p-8 h-full">
                <span className="mb-4 flex items-center justify-center h-14 w-14 rounded-full bg-primary/10">
                  <feature.icon className="h-7 w-7 text-primary" />
                </span>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-base text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary/80 to-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 drop-shadow-lg">
            {t('cta.title')}
          </h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              variant="secondary"
              className="font-bold shadow-md px-8 py-3 text-lg"
              asChild
            >
              <Link href={`/${locale}/requests/start`}>
                {t('cta.postRequest')}
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white font-bold shadow-md px-8 py-3 text-lg hover:bg-white hover:text-primary"
              asChild
            >
              <Link href={`/${locale}/company/register`}>
                {t('cta.registerCompany')}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
