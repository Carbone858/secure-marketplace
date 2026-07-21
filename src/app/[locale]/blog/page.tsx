import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { CANONICAL_DOMAIN } from '@/lib/config/site';
import { JsonLd } from '@/components/seo/JsonLd';
import { 
  BookOpen, 
  Calendar, 
  User, 
  ArrowLeft, 
  ArrowRight, 
  Search, 
  Sparkles, 
  Wrench, 
  Building2, 
  Briefcase, 
  Car, 
  Laptop,
  CheckCircle2,
  PlusCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PageProps {
  params: { locale: string };
  searchParams?: { q?: string };
}

export async function generateMetadata({ params: { locale } }: PageProps): Promise<Metadata> {
  const isAr = locale === 'ar';
  const title = isAr 
    ? 'مدونة ودليل وسيط | نصائح ودلائل الخدمات والشركات في سوريا' 
    : 'Wassitt Blog & Guides | Service & Business Insights in Syria';
  
  const description = isAr
    ? 'اقرأ أحدث المقالات والدلائل الشاملة عن الصيانة المنزلية، تأسيس الشركات، العقارات، وخدمات السيارات في دمشق وكافة المحافظات السورية عبر منصة وسيط.'
    : 'Read the latest guides and expert articles on home maintenance, business setup, real estate, and professional services across Syrian cities on Wassitt.';

  const canonicalUrl = `${CANONICAL_DOMAIN}/${locale}/blog`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ar: `${CANONICAL_DOMAIN}/ar/blog`,
        en: `${CANONICAL_DOMAIN}/en/blog`,
        'x-default': `${CANONICAL_DOMAIN}/ar/blog`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
      siteName: 'وسيط Wassitt',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function BlogIndexPage({ params: { locale } }: PageProps) {
  const isAr = locale === 'ar';

  // Fetch published CMS pages/articles from database
  let articles: Array<{
    id: string;
    title: string;
    titleAr: string | null;
    slug: string;
    content: string;
    contentAr: string | null;
    metaDescription: string | null;
    createdAt: Date;
    createdByUser: { name: string | null } | null;
  }> = [];

  try {
    articles = await prisma.cMSPage.findMany({
      where: { isPublished: true },
      select: {
        id: true,
        title: true,
        titleAr: true,
        slug: true,
        content: true,
        contentAr: true,
        metaDescription: true,
        createdAt: true,
        createdByUser: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  } catch (err) {
    console.error('Error fetching blog articles:', err);
  }

  // Priority Syria SEO topics list for internal linking & category filters
  const priorityTopics = [
    { titleAr: 'كهربائي دمشق', titleEn: 'Electricians in Damascus', href: '/services/electrician/damascus' },
    { titleAr: 'تكييف وتبريد سوريا', titleEn: 'AC & Cooling Syria', href: '/services/ac-services/damascus' },
    { titleAr: 'دهان منازل', titleEn: 'Home Painting', href: '/services/painter/damascus' },
    { titleAr: 'تنظيف منازل', titleEn: 'Home Cleaning', href: '/services/home-cleaning/damascus' },
    { titleAr: 'بيع وإيجار منازل', titleEn: 'Real Estate Sales & Rent', href: '/services/home-sales-rentals/damascus' },
    { titleAr: 'تأسيس شركات سوريا', titleEn: 'Business Setup Syria', href: '/services/business-setup/damascus' },
    { titleAr: 'تسجيل شركات سوريا', titleEn: 'Company Registration', href: '/services/company-registration/damascus' },
    { titleAr: 'توصيل مطار دمشق', titleEn: 'Damascus Airport Driver', href: '/services/airport-driver/damascus' },
    { titleAr: 'خدمات الصيانة المنزلية', titleEn: 'Home Maintenance Guide', href: '/services/home-maintenance/damascus' },
  ];

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: isAr ? 'الرئيسية' : 'Home',
        item: `${CANONICAL_DOMAIN}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: isAr ? 'المدونة والدلائل' : 'Blog & Guides',
        item: `${CANONICAL_DOMAIN}/${locale}/blog`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20" dir={isAr ? 'rtl' : 'ltr'}>
      <JsonLd data={breadcrumbSchema} />

      {/* Hero Header Section */}
      <div className="bg-primary/5 border-b border-primary/10 py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-6xl text-center space-y-4">
          <Badge className="bg-primary/10 text-primary border-primary/20 text-xs px-3 py-1 font-bold inline-flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            {isAr ? 'دليل وسيط الشامل للخدمات في سوريا' : 'Wassitt Official Marketplace Guides'}
          </Badge>

          <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
            {isAr ? 'مدونة ودليل وسيط' : 'Wassitt Blog & Insights'}
          </h1>

          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            {isAr
              ? 'مقالات ودلائل متخصصة تشمل نصائح الصيانة المنزلية، تأسيس وتسجيل الشركات، العقارات، والخدمات في جميع المدن السورية.'
              : 'Expert articles and comprehensive guides covering home maintenance, business incorporation, real estate, and local services across Syria.'}
          </p>

          {/* Quick Topic Pills */}
          <div className="flex flex-wrap justify-center gap-2 pt-4 max-w-4xl mx-auto">
            {priorityTopics.map((topic, index) => (
              <Link
                key={index}
                href={`/${locale}${topic.href}`}
                className="px-3.5 py-1.5 rounded-full bg-card border text-xs font-medium hover:border-primary hover:text-primary transition-colors shadow-sm"
              >
                {isAr ? topic.titleAr : topic.titleEn}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl py-12 space-y-12">

        {/* Articles List / Grid */}
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => {
              const articleTitle = isAr ? article.titleAr || article.title : article.title;
              const articleDesc = article.metaDescription || (article.contentAr || article.content).slice(0, 140);
              const authorName = article.createdByUser?.name || (isAr ? 'فريق تحرير وسيط' : 'Wassitt Editorial');

              return (
                <Card key={article.id} className="hover:shadow-lg transition-shadow border bg-card flex flex-col justify-between">
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(article.createdAt).toLocaleDateString(locale)}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" />
                          {authorName}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-foreground line-clamp-2 leading-snug">
                        <Link href={`/${locale}/blog/${article.slug}`} className="hover:text-primary transition-colors">
                          {articleTitle}
                        </Link>
                      </h2>
                      <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                        {articleDesc}
                      </p>
                    </div>

                    <div className="pt-4 border-t flex justify-end">
                      <Button size="sm" variant="ghost" className="text-primary font-bold hover:bg-primary/5" asChild>
                        <Link href={`/${locale}/blog/${article.slug}`}>
                          {isAr ? 'اقرأ المقال كاملاً' : 'Read Full Article'}
                          {isAr ? <ArrowLeft className="w-4 h-4 mr-2" /> : <ArrowRight className="w-4 h-4 ml-2" />}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          /* High-Value Informational Hub when Database is awaiting new article publications */
          <div className="space-y-8">
            <Card className="border bg-card shadow-sm p-8 md:p-12 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                <BookOpen className="w-8 h-8" />
              </div>
              <div className="max-w-2xl mx-auto space-y-3">
                <h2 className="text-2xl md:text-3xl font-black text-foreground">
                  {isAr ? 'دليل وسيط الشامل للخدمات والأعمال في سوريا' : 'Wassitt Service & Business Knowledge Base'}
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {isAr 
                    ? 'يقوم فريق وسيط والخبراء المعتمدون بإعداد سلسلة المقالات والدلائل الشاملة المغطية لكافة مجالات الصيانة المنزلية، التأسيس القانوني للشركات، والعقارات في جميع المحافظات السورية.'
                    : 'Our editorial team and industry experts prepare comprehensive guides for home maintenance, legal business incorporation, and real estate across Syrian governorates.'}
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="font-bold shadow-md shadow-primary/20" asChild>
                  <Link href={`/${locale}/requests/new`}>
                    <PlusCircle className="w-5 h-5 mr-2 ml-2" />
                    {isAr ? 'أطلب خدمة الآن مجاناً' : 'Post Request Free'}
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href={`/${locale}/companies`}>
                    <Building2 className="w-5 h-5 mr-2 ml-2" />
                    {isAr ? 'دليل الشركات الموثوقة' : 'Verified Directory'}
                  </Link>
                </Button>
              </div>
            </Card>

            {/* Priority Syria SEO Article Topics Guide Grid */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-foreground">
                {isAr ? 'أبرز المواضيع والدلائل المتاحة عبر المنصة' : 'Featured Marketplace SEO Guides'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border bg-card p-6 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-base text-foreground">
                    {isAr ? 'دليل الصيانة المنزلية والكهرباء' : 'Home Maintenance & Electrical Guide'}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {isAr 
                      ? 'كيف تختار كهربائي موثوق في دمشق، نصائح التعامل مع التكييف والتبريد، وكيفية حساب التكلفة قبل البدء.'
                      : 'Tips for hiring trusted electricians in Damascus, AC maintenance, and cost estimations.'}
                  </p>
                  <Link href={`/${locale}/services/electrician/damascus`} className="text-xs text-primary font-bold hover:underline block pt-2">
                    {isAr ? 'تصفح فنيي الكهرباء في دمشق ←' : 'Explore Electricians in Damascus →'}
                  </Link>
                </Card>

                <Card className="border bg-card p-6 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-base text-foreground">
                    {isAr ? 'دليل تأسيس وتسجيل الشركات في سوريا' : 'Business Setup & Registration Guide'}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {isAr 
                      ? 'الخطوات القانونية لتأسيس الشركات والمؤسسات، الأوراق المطلوبة، واستشارات السجل التجاري في دمشق وحلب.'
                      : 'Legal steps, documentation, and commercial registry procedures for business setup in Syria.'}
                  </p>
                  <Link href={`/${locale}/services/business-setup/damascus`} className="text-xs text-primary font-bold hover:underline block pt-2">
                    {isAr ? 'استشارات تأسيس الشركات ←' : 'Explore Business Setup →'}
                  </Link>
                </Card>

                <Card className="border bg-card p-6 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Car className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-base text-foreground">
                    {isAr ? 'دليل النقل وتوصيل المطار' : 'Airport Transfer & Logistics Guide'}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {isAr 
                      ? 'كيف تحجز سائق خاص لتوصيل مطار دمشق الدولي ونقل الأثاث بين المحافظات بأمان وحرفية.'
                      : 'Booking airport transfers for Damascus International Airport and inter-city transport.'}
                  </p>
                  <Link href={`/${locale}/services/airport-driver/damascus`} className="text-xs text-primary font-bold hover:underline block pt-2">
                    {isAr ? 'خدمات توصيل المطار ←' : 'Explore Airport Transfers →'}
                  </Link>
                </Card>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
