import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { CANONICAL_DOMAIN } from '@/lib/config/site';
import { JsonLd } from '@/components/seo/JsonLd';
import { 
  Calendar, 
  User, 
  ArrowLeft, 
  ArrowRight, 
  MapPin, 
  PlusCircle, 
  Building2, 
  CheckCircle,
  Tag,
  Share2,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PageProps {
  params: {
    locale: string;
    slug: string;
  };
}

export async function generateMetadata({ params: { locale, slug } }: PageProps): Promise<Metadata> {
  const isAr = locale === 'ar';

  const article = await prisma.cMSPage.findUnique({
    where: {
      slug,
    },
    select: {
      title: true,
      titleAr: true,
      contentAr: true,
      metaDescription: true,
      metaKeywords: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!article) {
    return {
      title: isAr ? 'المقال غير موجود | وسيط' : 'Article Not Found | Wassitt',
    };
  }

  const title = isAr ? article.titleAr || article.title : article.title;
  const description = article.metaDescription || (isAr 
    ? `اقرأ مقال ${title} عبر مدونة وسيط للاطلاع على أحدث الدلائل والنصائح في سوريا.` 
    : `Read ${title} on Wassitt Blog for expert service insights in Syria.`);

  const canonicalUrl = `${CANONICAL_DOMAIN}/${locale}/blog/${slug}`;

  // Extract featured image from HTML content or use WebP default stock
  const imgMatch = (article as any).contentAr?.match(/<img[^>]+src=["']([^"']+)["']/i);
  const ogImageUrl = imgMatch ? imgMatch[1] : `${CANONICAL_DOMAIN}/images/blog/default-banner.webp`;

  return {
    title: `${title} | وسيط Wassitt`,
    description,
    keywords: article.metaKeywords ? article.metaKeywords.split(',') : undefined,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ar: `${CANONICAL_DOMAIN}/ar/blog/${slug}`,
        en: `${CANONICAL_DOMAIN}/en/blog/${slug}`,
        'x-default': `${CANONICAL_DOMAIN}/ar/blog/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'article',
      siteName: 'وسيط Wassitt',
      publishedTime: article.createdAt.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function BlogArticleDetailPage({ params: { locale, slug } }: PageProps) {
  const isAr = locale === 'ar';

  const article = await prisma.cMSPage.findUnique({
    where: {
      slug,
    },
    include: {
      createdByUser: {
        select: { name: true },
      },
    },
  });

  if (!article) {
    notFound();
  }

  const title = isAr ? article.titleAr || article.title : article.title;
  const content = isAr ? article.contentAr || article.content : article.content;
  const authorName = article.createdByUser?.name || (isAr ? 'فريق تحرير وسيط' : 'Wassitt Editorial Team');
  const canonicalUrl = `${CANONICAL_DOMAIN}/${locale}/blog/${slug}`;

  // Structured Data Schemas
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
        name: isAr ? 'المدونة' : 'Blog',
        item: `${CANONICAL_DOMAIN}/${locale}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: title,
        item: canonicalUrl,
      },
    ],
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    headline: title,
    description: article.metaDescription || title,
    author: {
      '@type': 'Organization',
      name: authorName,
      url: CANONICAL_DOMAIN,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Wassitt',
      url: CANONICAL_DOMAIN,
      logo: {
        '@type': 'ImageObject',
        url: `${CANONICAL_DOMAIN}/apple-touch-icon.png`,
      },
    },
    datePublished: article.createdAt.toISOString(),
    dateModified: article.updatedAt.toISOString(),
  };

  // Internal Linking Helper Widgets based on Priority Syria Topics
  const relatedSyriaLinks = [
    { nameAr: 'كهربائي في دمشق', nameEn: 'Electrician in Damascus', href: '/services/electrician/damascus' },
    { nameAr: 'صيانة تكييف في دمشق', nameEn: 'AC Repair in Damascus', href: '/services/ac-services/damascus' },
    { nameAr: 'تنظيف منازل في دمشق', nameEn: 'Home Cleaning in Damascus', href: '/services/home-cleaning/damascus' },
    { nameAr: 'تأسيس شركات في دمشق', nameEn: 'Business Setup in Damascus', href: '/services/business-setup/damascus' },
    { nameAr: 'سائق توصيل للمطار', nameEn: 'Airport Transfer Driver', href: '/services/airport-driver/damascus' },
  ];

  return (
    <div className="min-h-screen bg-muted/30 pb-20" dir={isAr ? 'rtl' : 'ltr'}>
      <JsonLd data={[breadcrumbSchema, articleSchema]} />

      {/* Article Header */}
      <div className="bg-card border-b py-10 md:py-14">
        <div className="container mx-auto px-4 max-w-4xl space-y-6">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground overflow-x-auto whitespace-nowrap">
            <Link href={`/${locale}`} className="hover:text-primary transition-colors">
              {isAr ? 'الرئيسية' : 'Home'}
            </Link>
            <span>/</span>
            <Link href={`/${locale}/blog`} className="hover:text-primary transition-colors">
              {isAr ? 'المدونة' : 'Blog'}
            </Link>
            <span>/</span>
            <span className="text-primary font-bold line-clamp-1">{title}</span>
          </nav>

          <div className="space-y-4">
            {!article.isPublished && (
              <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/30 text-xs px-3 py-1 font-bold block w-fit">
                ⚠️ {isAr ? 'معاينة مسودة غير منشورة (Draft Preview)' : 'Unpublished Draft Preview'}
              </Badge>
            )}
            <Badge variant="outline" className="text-xs text-primary border-primary/20">
              <BookOpen className="w-3.5 h-3.5 mr-1 ml-1" />
              {isAr ? 'دليل وسيط الرسمي' : 'Official Wassitt Article'}
            </Badge>

            <h1 className="text-3xl md:text-5xl font-black text-foreground leading-tight tracking-tight">
              {title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
              <span className="flex items-center gap-1.5 font-medium">
                <User className="w-4 h-4 text-primary" />
                {authorName}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {new Date(article.createdAt).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Article Main Body & Sidebar Layout */}
      <div className="container mx-auto px-4 max-w-4xl py-12 space-y-12">
        
        {/* Main Article Content */}
        <article className="bg-card rounded-3xl p-6 md:p-10 border shadow-sm prose dark:prose-invert max-w-none text-foreground leading-relaxed">
          <div 
            dangerouslySetInnerHTML={{ __html: content }} 
            className="space-y-4 text-base md:text-lg"
          />
        </article>

        {/* Internal Linking SEO Action Box */}
        <section className="bg-primary/5 rounded-3xl p-8 border border-primary/15 space-y-6">
          <div className="space-y-2 text-center max-w-xl mx-auto">
            <h3 className="text-xl md:text-2xl font-bold text-foreground">
              {isAr ? 'هل تبحث عن خدمات موثوقة في مدينتك؟' : 'Looking for Trusted Local Services in Syria?'}
            </h3>
            <p className="text-xs text-muted-foreground">
              {isAr ? 'انشر طلبك مجاناً واحصل على عروض أسعار تنافسية من الفنيين والشركات المعتمدة عبر وسيط' : 'Post your service request for free and get direct quotes from background-checked providers'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="font-bold shadow-md shadow-primary/20" asChild>
              <Link href={`/${locale}/requests/new`}>
                <PlusCircle className="w-5 h-5 mr-2 ml-2" />
                {isAr ? 'أضف طلبك الآن مجاناً' : 'Post Request Free'}
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href={`/${locale}/companies`}>
                <Building2 className="w-5 h-5 mr-2 ml-2" />
                {isAr ? 'تصفح دليل الشركات' : 'Browse Directory'}
              </Link>
            </Button>
          </div>

          {/* Related Local Service Links */}
          <div className="pt-6 border-t space-y-3">
            <h4 className="font-bold text-xs text-foreground uppercase tracking-wider text-center">
              {isAr ? 'روابط خدمات وتخصصات ذات صلة في سوريا' : 'Related Syrian Local Service Hubs'}
            </h4>
            <div className="flex flex-wrap justify-center gap-2">
              {relatedSyriaLinks.map((link, idx) => (
                <Link
                  key={idx}
                  href={`/${locale}${link.href}`}
                  className="px-3 py-1.5 rounded-full bg-card border text-xs font-medium hover:border-primary hover:text-primary transition-colors"
                >
                  <MapPin className="w-3 h-3 inline mr-1 ml-1 text-primary" />
                  {isAr ? link.nameAr : link.nameEn}
                </Link>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
