import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { CANONICAL_DOMAIN } from '@/lib/config/site';
import { JsonLd } from '@/components/seo/JsonLd';
import { resolveCategory, resolveSyrianCity, getSyrianCities } from '@/lib/services/seoCategoryService';
import { categories as mainCategoriesList } from '@/lib/services-data';
import { 
  MapPin, 
  CheckCircle, 
  Star, 
  Building2, 
  Briefcase, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Clock, 
  HelpCircle,
  PlusCircle,
  Phone,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PageProps {
  params: {
    locale: string;
    category: string;
    city: string;
  };
}

export async function generateMetadata({ params: { locale, category: categoryParam, city: cityParam } }: PageProps): Promise<Metadata> {
  const isAr = locale === 'ar';
  const category = await resolveCategory(categoryParam);
  const city = await resolveSyrianCity(cityParam);

  if (!category || !city) {
    return {
      title: isAr ? 'الخدمة غير موجودة' : 'Service Not Found',
    };
  }

  const categoryName = isAr ? category.nameAr : category.nameEn;
  const cityName = isAr ? city.nameAr : city.nameEn;

  const title = isAr 
    ? `${categoryName} ${cityName} | أفضل فنيي والشركات في ${cityName} - وسيط`
    : `${categoryName} in ${cityName} | Find Trusted Services & Companies - Wassitt`;

  const description = isAr
    ? `ابحث عن أفضل خدمات ${categoryName} في ${cityName}. قارن الأسعار والتقييمات واحصل على عروض من أفضل الشركات والفنيين الموثوقين عبر منصة وسيط.`
    : `Find trusted ${categoryName} services and top-rated companies in ${cityName}. Compare quotes, read customer reviews, and hire verified local professionals on Wassitt.`;

  const canonicalUrl = `${CANONICAL_DOMAIN}/${locale}/services/${category.slug}/${city.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ar: `${CANONICAL_DOMAIN}/ar/services/${category.slug}/${city.slug}`,
        en: `${CANONICAL_DOMAIN}/en/services/${category.slug}/${city.slug}`,
        'x-default': `${CANONICAL_DOMAIN}/ar/services/${category.slug}/${city.slug}`,
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

export default async function LocalSeoServicePage({ params: { locale, category: categoryParam, city: cityParam } }: PageProps) {
  const isAr = locale === 'ar';
  const category = await resolveCategory(categoryParam);
  const city = await resolveSyrianCity(cityParam);

  if (!category || !city) {
    notFound();
  }

  const categoryName = isAr ? category.nameAr : category.nameEn;
  const cityName = isAr ? city.nameAr : city.nameEn;

  // 1. Fetch ONLY Real, Active, Verified non-demo Companies in this city
  const companies = await prisma.company.findMany({
    where: {
      isActive: true,
      isDemo: false,
      verificationStatus: 'VERIFIED',
      cityId: city.id,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      logo: true,
      rating: true,
      reviewCount: true,
      address: true,
      phone: true,
      verificationStatus: true,
    },
    take: 12,
  });

  // 2. Fetch Public Active Requests in this city
  const activeRequests = await prisma.serviceRequest.findMany({
    where: {
      isActive: true,
      isDemo: false,
      status: 'ACTIVE',
      visibility: 'PUBLIC',
      cityId: city.id,
    },
    select: {
      id: true,
      title: true,
      description: true,
      budgetMin: true,
      budgetMax: true,
      currency: true,
      createdAt: true,
    },
    take: 6,
  });

  // 3. Fetch Syrian cities for internal linking
  const syrianCities = await getSyrianCities();
  const otherCities = syrianCities.filter(c => c.slug !== city.slug);

  // 4. Structured Data (JSON-LD)
  const canonicalUrl = `${CANONICAL_DOMAIN}/${locale}/services/${category.slug}/${city.slug}`;

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
        name: isAr ? 'الخدمات' : 'Services',
        item: `${CANONICAL_DOMAIN}/${locale}/services/${category.slug}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `${categoryName} في ${cityName}`,
        item: canonicalUrl,
      },
    ],
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${categoryName} في ${cityName}`,
    serviceType: categoryName,
    provider: {
      '@type': 'Organization',
      name: 'Wassitt',
      url: CANONICAL_DOMAIN,
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: `${cityName}, Syria`,
    },
    description: category.descriptionAr,
  };

  const companySchemas = companies.map(comp => ({
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: comp.name,
    url: `${CANONICAL_DOMAIN}/${locale}/companies/${comp.slug}`,
    image: comp.logo || `${CANONICAL_DOMAIN}/apple-touch-icon.png`,
    telephone: comp.phone || undefined,
    address: {
      '@type': 'PostalAddress',
      addressLocality: cityName,
      addressCountry: 'SY',
    },
    aggregateRating: comp.reviewCount > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: comp.rating,
      reviewCount: comp.reviewCount,
    } : undefined,
  }));

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: isAr ? `كيف أحصل على أفضل خدمات ${categoryName} في ${cityName}؟` : `How do I find the best ${categoryName} services in ${cityName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: isAr 
            ? `يمكنك نشر طلب خدمة مجاناً عبر منصة وسيط في ${cityName}، وستتلقى عروض أسعار تنافسية من الشركات والفنيين الموثوقين مع إمكانية مقارنة التقييمات والأعمال السابقة.`
            : `You can post a request for free on Wassitt in ${cityName} to receive competitive quotes from verified service providers and compare reviews.`,
        },
      },
      {
        '@type': 'Question',
        name: isAr ? `هل خدمات ${categoryName} عبر وسيط مضمونة وموثقة في ${cityName}؟` : `Are ${categoryName} providers verified on Wassitt in ${cityName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: isAr
            ? `نعم، تخضع جميع الشركات ومزودي الخدمات في ${cityName} لعملية تحقق وثائق وتدقيق من فريق وسيط لضمان الأمان والجودة.`
            : `Yes, all companies and providers undergo identity and document verification by the Wassitt team.`,
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20" dir={isAr ? 'rtl' : 'ltr'}>
      <JsonLd data={[breadcrumbSchema, serviceSchema, faqSchema, ...companySchemas]} />

      {/* Hero Header Section */}
      <div className="bg-primary/5 border-b border-primary/10 py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 overflow-x-auto whitespace-nowrap">
            <Link href={`/${locale}`} className="hover:text-primary transition-colors">
              {isAr ? 'الرئيسية' : 'Home'}
            </Link>
            <span>/</span>
            <Link href={`/${locale}/services/${category.slug}`} className="hover:text-primary transition-colors">
              {categoryName}
            </Link>
            <span>/</span>
            <span className="text-primary font-bold">{cityName}</span>
          </nav>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 text-xs px-3 py-1 font-semibold">
                <MapPin className="w-3.5 h-3.5 mr-1 ml-1" />
                {isAr ? `خدمة موثوقة في ${cityName}، سوريا` : `Verified Service in ${cityName}, Syria`}
              </Badge>
              <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tight leading-tight">
                {isAr ? `خدمات ${categoryName} في ${cityName}` : `${categoryName} Services in ${cityName}`}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {isAr 
                  ? `احصل على أفضل خدمات ${categoryName} في مدينة ${cityName}. تصفح الشركات الموثوقة، قارن الأسعار، واطلب عروض أسعار مجانية فورية.`
                  : `Find top-rated ${categoryName} specialists and verified companies in ${cityName}. Compare quotes and get your job done safely.`}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
              <Button size="lg" className="font-bold shadow-lg shadow-primary/20" asChild>
                <Link href={`/${locale}/requests/new`}>
                  <PlusCircle className="w-5 h-5 mr-2 ml-2" />
                  {isAr ? 'أضف طلبك مجاناً' : 'Post Request Free'}
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href={`/${locale}/companies`}>
                  <Search className="w-5 h-5 mr-2 ml-2" />
                  {isAr ? 'تصفح دليل الشركات' : 'Browse Directory'}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl py-12 space-y-16">

        {/* Introduction Section */}
        <section className="bg-card rounded-2xl p-6 md:p-10 border shadow-sm space-y-4">
          <h2 className="text-2xl font-bold text-foreground">
            {isAr ? `عن خدمات ${categoryName} في ${cityName}` : `About ${categoryName} Services in ${cityName}`}
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            {isAr 
              ? `تعتبر خدمات ${categoryName} في ${cityName} من أكثر الخدمات طلباً. عبر منصة وسيط، نوفر لك إمكانية التواصل المباشر مع أفضل الفنيين والشركات المعتمدة في ${cityName} مع ضمان الشفافية والأسعار المناسبة.`
              : `Access professional ${categoryName} solutions in ${cityName}. Wassitt links you with certified local contractors and professionals.`}
          </p>
        </section>

        {/* Listed Verified Companies Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                {isAr ? `الشركات الموثوقة في ${cityName}` : `Verified Companies in ${cityName}`}
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                {isAr ? `مزودو خدمات معتمدون ومفعلون في ${cityName}` : `Certified service providers active in ${cityName}`}
              </p>
            </div>
            <Button variant="ghost" className="text-primary font-bold" asChild>
              <Link href={`/${locale}/companies`}>
                {isAr ? 'عرض الكل' : 'View All'}
                {isAr ? <ArrowLeft className="w-4 h-4 mr-2" /> : <ArrowRight className="w-4 h-4 ml-2" />}
              </Link>
            </Button>
          </div>

          {companies.length === 0 ? (
            <Card className="border-dashed bg-muted/20">
              <CardContent className="py-12 text-center space-y-4">
                <Building2 className="w-12 h-12 text-muted-foreground/40 mx-auto" />
                <h3 className="text-lg font-bold text-foreground">
                  {isAr ? `لم تنضم شركات جديدة لهذه الفئة في ${cityName} بعد` : `No verified companies listed in ${cityName} yet`}
                </h3>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                  {isAr
                    ? `هل تملك شركة أو تقدم خدمات ${categoryName} في ${cityName}؟ انضم مجاناً لمنصة وسيط واحصل على عملاء جدد.`
                    : `Do you offer ${categoryName} services in ${cityName}? Join Wassitt today and start getting client leads.`}
                </p>
                <Button variant="default" asChild>
                  <Link href={`/${locale}/company/join`}>
                    {isAr ? 'سجل شركتك الآن' : 'Register Your Business'}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companies.map(comp => (
                <Card key={comp.id} className="hover:shadow-lg transition-shadow duration-300 border bg-card flex flex-col">
                  <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-muted border flex items-center justify-center overflow-hidden shrink-0">
                          {comp.logo ? (
                            <img src={comp.logo} alt={comp.name} className="w-full h-full object-cover" />
                          ) : (
                            <Building2 className="w-7 h-7 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <h3 className="font-bold text-foreground text-lg">{comp.name}</h3>
                            <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <span className="flex items-center gap-1 text-warning font-bold">
                              <Star className="w-3.5 h-3.5 fill-warning" />
                              {comp.rating.toFixed(1)}
                            </span>
                            <span>({comp.reviewCount} {isAr ? 'تقييم' : 'reviews'})</span>
                          </div>
                        </div>
                      </div>
                      {comp.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {comp.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t flex items-center justify-between">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {cityName}
                      </span>
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/${locale}/companies/${comp.slug}`}>
                          {isAr ? 'عرض الملف' : 'View Profile'}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Public Active Requests Section */}
        {activeRequests.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">
              {isAr ? `أحدث طلبات الخدمة في ${cityName}` : `Recent Service Requests in ${cityName}`}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeRequests.map(req => (
                <Card key={req.id} className="border hover:border-primary/40 transition-colors">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-base text-foreground line-clamp-1">{req.title}</h3>
                      <Badge variant="secondary" className="text-xs shrink-0">
                        {req.currency} {req.budgetMin && req.budgetMax ? `${req.budgetMin}-${req.budgetMax}` : req.budgetMin || req.budgetMax || ''}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{req.description}</p>
                    <div className="pt-2 flex justify-between items-center text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(req.createdAt).toLocaleDateString(locale)}
                      </span>
                      <Link href={`/${locale}/requests/${req.id}`} className="text-primary font-bold hover:underline">
                        {isAr ? 'تقديم عرض' : 'Send Offer'}
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Why Choose Wassitt Section */}
        <section className="bg-primary/5 rounded-3xl p-8 md:p-12 border border-primary/10 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl md:text-3xl font-black text-foreground">
              {isAr ? `لماذا تختار منصة وسيط في ${cityName}؟` : `Why Choose Wassitt in ${cityName}?`}
            </h2>
            <p className="text-muted-foreground text-sm">
              {isAr ? 'المنصة الأولى والآمنة للربط بين أصحاب العمل ومزودي الخدمات في سوريا' : 'The trusted marketplace connecting clients with service professionals'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card p-6 rounded-2xl border space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">1</div>
              <h3 className="font-bold text-base">{isAr ? 'خدمة مجانية 100%' : '100% Free for Clients'}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {isAr ? 'أضف طلبك مجاناً واستقبل عدة عروض أسعار بدون أي رسوم مخفية.' : 'Post your request for free and get multiple quotes with zero fees.'}
              </p>
            </div>
            <div className="bg-card p-6 rounded-2xl border space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">2</div>
              <h3 className="font-bold text-base">{isAr ? 'شركات موثوقة ومفعلة' : 'Verified Companies'}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {isAr ? 'نتحقق من هوية وتراخيص مزودي الخدمات لضمان الجودة والأمان.' : 'We audit profiles and documents to ensure trusted quality.'}
              </p>
            </div>
            <div className="bg-card p-6 rounded-2xl border space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">3</div>
              <h3 className="font-bold text-base">{isAr ? 'مقارنة شفافة للأسعار' : 'Transparent Comparison'}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {isAr ? 'قارن العروض والتقييمات قبل الاتفاق واختر الأنسب لميزانيتك.' : 'Compare offers, ratings, and portfolios before hiring.'}
              </p>
            </div>
            <div className="bg-card p-6 rounded-2xl border space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">4</div>
              <h3 className="font-bold text-base">{isAr ? 'دعم مستمر وإنجاز سريع' : 'Fast Execution'}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {isAr ? 'تواصل مباشر وسريع مع الفنيين في مدينتك لإنجاز العمل بالوقت المحدد.' : 'Direct messaging to get your tasks completed on time.'}
              </p>
            </div>
          </div>
        </section>

        {/* Local FAQ Section */}
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            {isAr ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
          </h2>
          <div className="space-y-4">
            <Card className="border">
              <CardContent className="p-6 space-y-2">
                <h3 className="font-bold text-base text-foreground">
                  {isAr ? `كيف أحصل على أفضل خدمات ${categoryName} في ${cityName}؟` : `How do I find top ${categoryName} professionals in ${cityName}?`}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {isAr 
                    ? `اضغط على زر "أضف طلبك مجاناً"، حدد تفاصيل الخدمة والميزانية، وستصلك عروض أسعار مباشرة من الفنيين والشركات المعتمدة في ${cityName}.`
                    : `Click "Post Request Free", outline your project requirements, and receive direct competitive quotes from top providers in ${cityName}.`}
                </p>
              </CardContent>
            </Card>

            <Card className="border">
              <CardContent className="p-6 space-y-2">
                <h3 className="font-bold text-base text-foreground">
                  {isAr ? `هل خدمات ${categoryName} عبر وسيط موثوقة في ${cityName}؟` : `Are providers verified on Wassitt in ${cityName}?`}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {isAr 
                    ? `نعم، تخضع جميع الحسابات التجارية للتدقيق والتحقق من الهوية والأوراق الثبوتية من قبل فريق وسيط.`
                    : `Yes, service providers undergo strict document and identity verification before being listed on Wassitt.`}
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Internal Linking & SEO Hub Section */}
        <section className="space-y-8 pt-8 border-t">
          {/* Other Categories in Same City */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-foreground">
              {isAr ? `خدمات أخرى متاحة في ${cityName}` : `Other Popular Services in ${cityName}`}
            </h3>
            <div className="flex flex-wrap gap-2">
              {mainCategoriesList.map(cat => (
                <Link
                  key={cat.id}
                  href={`/${locale}/services/${cat.id}/${city.slug}`}
                  className="px-3.5 py-1.5 rounded-full bg-card border text-xs font-medium hover:border-primary hover:text-primary transition-colors"
                >
                  {isAr ? cat.label.ar : cat.label.en} في {cityName}
                </Link>
              ))}
            </div>
          </div>

          {/* Same Category in Other Syrian Cities */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-foreground">
              {isAr ? `خدمات ${categoryName} في المدن السورية` : `${categoryName} Services across Syrian Cities`}
            </h3>
            <div className="flex flex-wrap gap-2">
              {otherCities.map(otherCity => (
                <Link
                  key={otherCity.slug}
                  href={`/${locale}/services/${category.slug}/${otherCity.slug}`}
                  className="px-3.5 py-1.5 rounded-full bg-card border text-xs font-medium hover:border-primary hover:text-primary transition-colors"
                >
                  {categoryName} في {isAr ? otherCity.nameAr : otherCity.nameEn}
                </Link>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
