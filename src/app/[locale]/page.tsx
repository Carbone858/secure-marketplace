'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import {
  Search,
  Building2,
  CheckCircle,
  Star,
  TrendingUp,
  ArrowRight,
  Shield,
  Clock,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Category {
  id: string;
  name: string;
  nameAr: string | null;
  icon: string | null;
  _count: {
    companies: number;
  };
}

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
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredCompanies, setFeaturedCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchFeaturedCompanies();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories?includeSubcategories=true');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories.slice(0, 8));
      }
    } catch (err) {
      console.error('Failed to fetch categories');
    }
  };

  const fetchFeaturedCompanies = async () => {
    try {
      const response = await fetch('/api/companies/search?verifiedOnly=true&limit=4');
      if (response.ok) {
        const data = await response.json();
        setFeaturedCompanies(data.companies);
      }
    } catch (err) {
      console.error('Failed to fetch featured companies');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/${locale}/companies?q=${encodeURIComponent(searchQuery)}`;
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
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-primary/5 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4" variant="secondary">
              {t('hero.badge')}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              {t('hero.subtitle')}
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-xl mx-auto">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder={t('hero.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-14 text-lg"
                  />
                </div>
                <Button type="submit" size="lg" className="h-14 px-8">
                  {t('hero.searchButton')}
                </Button>
              </div>
            </form>

            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Button variant="outline" asChild>
                <Link href={`/${locale}/requests/new`}>
                  {t('hero.postRequest')}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/${locale}/company/register`}>
                  {t('hero.registerCompany')}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary">
                  {stat.value}
                </p>
                <p className="text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('categories.title')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('categories.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/${locale}/companies?categoryId=${category.id}`}
              >
                <Card className="hover:shadow-lg transition-shadow h-full">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-1">
                      {locale === 'ar' && category.nameAr
                        ? category.nameAr
                        : category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t('categories.companyCount', { count: category._count.companies })}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link href={`/${locale}/companies`}>
                {t('categories.viewAll')}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('whyChooseUs.title')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('whyChooseUs.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="h-full">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Companies Section */}
      {featuredCompanies.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{t('featured.title')}</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t('featured.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredCompanies.map((company) => (
                <Link
                  key={company.id}
                  href={`/${locale}/companies/${company.slug}`}
                >
                  <Card className="hover:shadow-lg transition-shadow h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                          {company.logo ? (
                            <img
                              src={company.logo}
                              alt={company.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <Building2 className="h-8 w-8 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold">{company.name}</h3>
                          <div className="flex items-center gap-1 text-sm">
                            <CheckCircle className="h-4 w-4 text-success" />
                            <span className="text-muted-foreground">
                              {t('featured.verified')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-warning fill-warning" />
                        <span className="font-medium">
                          {company.averageRating.toFixed(1)}
                        </span>
                        <span className="text-muted-foreground">
                          {t('featured.reviewCount', { count: company.reviewCount })}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('cta.title')}
          </h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              variant="secondary"
              asChild
            >
              <Link href={`/${locale}/requests/new`}>
                {t('cta.postRequest')}
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground hover:bg-primary-foreground hover:text-primary"
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
