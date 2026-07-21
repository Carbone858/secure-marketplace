import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { CANONICAL_DOMAIN } from '@/lib/config/site';
import { JsonLd } from '@/components/seo/JsonLd';
import { resolveCategory, resolveSyrianCity, getSyrianCities } from '@/lib/services/seoCategoryService';
import { categories as mainCategoriesList, subcategories as subcategoryDict } from '@/lib/services-data';
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
  Search,
  Wrench,
  AlertTriangle,
  UserCheck,
  Zap,
  Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    ? `احصل على أفضل خدمات ${categoryName} في ${cityName}. قارن الأسعار والتقييمات بين الشركات والفنيين الموثوقين، واطلب عروض أسعار مجانية فورية عبر منصة وسيط.`
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

  // 3. Fetch Service Coverage Areas (Districts) in this Syrian city from DB
  const cityAreas = await prisma.area.findMany({
    where: {
      cityId: city.id,
      isActive: true,
    },
    select: {
      id: true,
      nameAr: true,
      nameEn: true,
      slug: true,
    },
    take: 16,
    orderBy: { nameAr: 'asc' },
  });

  // 4. Fetch Syrian cities for internal linking
  const syrianCities = await getSyrianCities();
  const otherCities = syrianCities.filter(c => c.slug !== city.slug);

  // 5. Related subcategories under parent category
  const parentCatId = category.parentCategoryId || category.id;
  const relatedSubcategories = subcategoryDict[parentCatId as keyof typeof subcategoryDict] || [];

  // 6. Structured Data (JSON-LD)
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
        name: isAr ? `كم تكلفة خدمات ${categoryName} في ${cityName}؟` : `How much do ${categoryName} services cost in ${cityName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: isAr 
            ? `تختلف التكلفة بحسب حجم ونوع العمل المطلوب. تتيح لك منصة وسيط نشر طلبك مجاناً في ${cityName} وتلقي عروض أسعار مباشرة من الفنيين والشركات المعتمدة لمقارنتها دون أي رسوم.`
            : `Costs depend on project scale. On Wassitt in ${cityName}, you can post your job for free and receive transparent quotes directly from verified local providers.`,
        },
      },
      {
        '@type': 'Question',
        name: isAr ? `كيف أجد فني أو شركة ${categoryName} موثوقة في ${cityName}؟` : `How do I find trusted ${categoryName} providers in ${cityName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: isAr
            ? `عبر منصة وسيط، يمكنك تصفح دليل الشركات في ${cityName}، والاطلاع على تقييمات العملاء السابقين، أو نشر طلب جديد لاستقبال عروض مباشرة من مزودين تم التحقق من هوياتهم وسجلاتهم.`
            : `Through Wassitt, you can browse verified profiles in ${cityName}, read genuine reviews, or post a request to get direct offers from background-checked professionals.`,
        },
      },
      {
        '@type': 'Question',
        name: isAr ? `ما هي الخدمات المشمولة في قسم ${categoryName} بمدينة ${cityName}؟` : `What services are included under ${categoryName} in ${cityName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: isAr
            ? `يشمل هذا القسم كافة أعمال التركيب والصيانة الدورية والتعديلات والحلول الطارئة للمنازل والمباني السكنية والتجارية في جميع أحياء ${cityName}.`
            : `This category covers installation, preventive maintenance, repair work, and emergency services for residential and commercial properties throughout ${cityName}.`,
        },
      },
      {
        '@type': 'Question',
        name: isAr ? `ما هو وقت الاستجابة للحصول على عروض أسعار في ${cityName}؟` : `How fast will I get responses for ${categoryName} in ${cityName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: isAr
            ? `عادةً ما يبدأ الفنيون والشركات المعتمدة في ${cityName} بتقديم العروض خلال دقائق معدودة من نشر الطلب عبر المنصة.`
            : `Verified contractors and providers in ${cityName} typically begin sending quotes within minutes of posting your request.`,
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
                  ? `أفضل الحلول والشركات المعتمدة في مجال ${categoryName} بمدينة ${cityName}. قارن الأسعار والتقييمات واطلب عروض أسعار مجانية فورية.`
                  : `Find certified ${categoryName} professionals and verified companies in ${cityName}. Compare quotes and get your job done safely.`}
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
                  {isAr ? 'تصفح الشركات' : 'Browse Directory'}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl py-12 space-y-16">

        {/* 1. Dynamic Local Content & City Overview */}
        <section className="bg-card rounded-3xl p-6 md:p-10 border shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b pb-4">
            <div className="p-3 bg-primary/10 rounded-2xl text-primary">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {isAr ? `دليل خدمات ${categoryName} في ${cityName}` : `Guide to ${categoryName} Services in ${cityName}`}
              </h2>
              <p className="text-xs text-muted-foreground">
                {isAr ? `خدمات احترافية تلبي احتياجات السكان والمباني في ${cityName}` : `Professional solutions tailored for ${cityName} residents and businesses`}
              </p>
            </div>
          </div>

          <div className="space-y-4 text-muted-foreground text-base md:text-lg leading-relaxed">
            <p>
              {isAr 
                ? `تعتبر خدمات ${categoryName} من الركائز الأساسية للمحافظة على جودة المباني والمنشآت السكنية والتجارية في مدينة ${cityName}. يسعى سكان ومؤسسات ${cityName} دائماً للوصول إلى فنيين وشركات تمتلك الخبرة الكافية، وتلتزم بالمواعيد المحددة والأسعار العادلة.`
                : `${categoryName} services are essential for maintaining residential and commercial infrastructure in ${cityName}. Local clients require dependable, skilled contractors offering fair pricing and punctual delivery.`}
            </p>
            <p>
              {isAr 
                ? `عبر منصة وسيط، نسهل عليك عناء البحث والتردد. نوفر لك بيئة آمنة للمقارنة بين المزودين المعتمدين في ${cityName}، والاطلاع على أعمالهم السابقة وتقييمات العملاء الحقيقيين قبل اتخاذ قرار التعاقد.`
                : `Wassitt eliminates the hassle of finding reliable help in ${cityName} by connecting you directly with background-checked local professionals.`}
            </p>
          </div>
        </section>

        {/* 2. Common Problems & Solutions Section */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <Badge variant="outline" className="text-xs text-primary border-primary/20">
              <AlertTriangle className="w-3.5 h-3.5 mr-1 ml-1" />
              {isAr ? 'مشاكل وحلول شائعة' : 'Problems & Solutions'}
            </Badge>
            <h2 className="text-2xl md:text-3xl font-black text-foreground">
              {isAr ? `أبرز تحديات ${categoryName} وكيف نحلها في ${cityName}` : `Common ${categoryName} Challenges Solved in ${cityName}`}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isAr ? 'حلول هندسية وفنية مضمونة تُقدم بواسطة خبرات محلية معتمدة' : 'Guaranteed technical solutions provided by certified local experts'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border bg-card hover:shadow-md transition-shadow">
              <CardContent className="p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center font-bold">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-foreground">
                  {isAr ? 'صعوبة إيجاد فنيين موثوقين' : 'Finding Reliable Technicians'}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {isAr 
                    ? `يعاني الكثيرون في ${cityName} من التعامل مع أفراد غير مؤهلين. حل منصة وسيط هو اعتماد شركات وفنيين بعد التحقق من الأوراق الثبوتية والخبرة.`
                    : `Finding qualified technicians in ${cityName} can be difficult. Wassitt verifies credentials and background checks before listing.`}
                </p>
              </CardContent>
            </Card>

            <Card className="border bg-card hover:shadow-md transition-shadow">
              <CardContent className="p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-warning/10 text-warning flex items-center justify-center font-bold">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-foreground">
                  {isAr ? 'تفاوت وتضخم الأسعار' : 'Price Inflation & Discrepancies'}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {isAr 
                    ? `تفاوت التكاليف وعدم وضوح التسعير يُربك العميل. تتيح لك المنصة استقبال عدة عروض أسعار شفافة لمقارنتها واختيار العرض الأنسب لميزانيتك.`
                    : `Unclear pricing creates confusion. Wassitt allows you to receive and compare transparent quotes before committing.`}
                </p>
              </CardContent>
            </Card>

            <Card className="border bg-card hover:shadow-md transition-shadow">
              <CardContent className="p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-success/10 text-success flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-foreground">
                  {isAr ? 'غياب الضمان والمتابعة' : 'Lack of Service Guarantees'}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {isAr 
                    ? `يضمن وسيط إنجاز العمل وفق الشروط والاتفاقيات عبر نظام توثيق العقود والتقييمات المباشرة بعد انتهاء الخدمة.`
                    : `Wassitt ensures work compliance through contractual documentation and verified client ratings after job completion.`}
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 3. Listed Verified Companies Section & Improved High-Value Empty State */}
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
            /* Empowering, SEO-Friendly High-Value Action Hub (No negative empty message) */
            <div className="bg-gradient-to-br from-card via-card to-primary/5 rounded-3xl border border-primary/20 p-8 md:p-12 shadow-sm space-y-8">
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <Badge className="bg-primary/10 text-primary border-primary/20 text-xs px-3 py-1 font-bold">
                  <UserCheck className="w-3.5 h-3.5 mr-1 ml-1" />
                  {isAr ? `أطلب خدمة ${categoryName} فوراً في ${cityName}` : `Get Quotes for ${categoryName} in ${cityName}`}
                </Badge>
                <h3 className="text-2xl md:text-3xl font-black text-foreground">
                  {isAr ? `احصل على أفضل عروض الأسعار لخدمات ${categoryName} في ${cityName}` : `Receive Top Quotes for ${categoryName} in ${cityName}`}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {isAr
                    ? `لا داعي للانتظار. أنشئ طلبك مجاناً خلال دقيقة، وسيقوم الفنيون والشركات المعتمدة في ${cityName} بتقديم عروض أسعار تنافسية ومباشرة لحسابك.`
                    : `No waiting required. Post your project details for free, and verified contractors in ${cityName} will send direct competitive bids.`}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <Card className="border bg-card shadow-sm hover:border-primary/40 transition-colors">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <PlusCircle className="w-5 h-5 text-primary" />
                      {isAr ? 'لأصحاب الطلبات والعملاء' : 'For Clients & Homeowners'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {isAr
                        ? `أضف تفاصيل عملك وميزانيتك، واستقبل عروض أسعار متعددة للمقارنة واختيار الأنسب.`
                        : `Specify your job details and budget to receive multiple competitive offers.`}
                    </p>
                    <Button className="w-full font-bold shadow-md shadow-primary/20" asChild>
                      <Link href={`/${locale}/requests/new`}>
                        {isAr ? 'أضف طلبك الآن مجاناً' : 'Post Request Free'}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border bg-card shadow-sm hover:border-primary/40 transition-colors">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-primary" />
                      {isAr ? 'لشركات والفنيين في ' + cityName : 'For Providers in ' + cityName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {isAr
                        ? `هل تملك شركة أو تقدم خدمات ${categoryName} في ${cityName}؟ سجل مجاناً لتتلقى طلبات العملاء.`
                        : `Do you provide ${categoryName} in ${cityName}? Register free to start receiving job leads.`}
                    </p>
                    <Button variant="outline" className="w-full font-bold border-primary text-primary hover:bg-primary/5" asChild>
                      <Link href={`/${locale}/company/join`}>
                        {isAr ? 'سجل شركتك الآن' : 'Register Your Business'}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
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

        {/* 4. Service Coverage Areas / Districts Section */}
        {cityAreas.length > 0 && (
          <section className="bg-card rounded-3xl p-6 md:p-10 border shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {isAr ? `مناطق تغطية خدمات ${categoryName} في ${cityName}` : `Service Coverage Areas in ${cityName}`}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {isAr ? `يغطي الفنيون والشركات المعتمدة مختلف الأحياء والمناطق في ${cityName}` : `Coverage spans major districts and neighborhoods across ${cityName}`}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {cityAreas.map(area => (
                <Badge key={area.id} variant="secondary" className="px-3.5 py-1.5 text-xs font-medium bg-muted/60 border border-border/50">
                  <MapPin className="w-3 h-3 mr-1 ml-1 text-primary" />
                  {isAr ? area.nameAr : area.nameEn}
                </Badge>
              ))}
            </div>
          </section>
        )}

        {/* 5. Public Active Requests Section */}
        {activeRequests.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">
              {isAr ? `أحدث طلبات الخدمة النشطة في ${cityName}` : `Recent Active Service Requests in ${cityName}`}
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

        {/* 6. Why Choose Wassitt Section */}
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

        {/* 7. Local FAQ Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-2xl text-primary">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              {isAr ? 'الأسئلة الشائعة عن الخدمة' : 'Frequently Asked Questions'}
            </h2>
          </div>

          <div className="space-y-4">
            <Card className="border">
              <CardContent className="p-6 space-y-2">
                <h3 className="font-bold text-base text-foreground">
                  {isAr ? `كم تكلفة خدمات ${categoryName} في ${cityName}؟` : `How much do ${categoryName} services cost in ${cityName}?`}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {isAr 
                    ? `تختلف التكلفة بحسب حجم ونوع العمل المطلوب. تتيح لك منصة وسيط نشر طلبك مجاناً في ${cityName} وتلقي عروض أسعار مباشرة من الفنيين والشركات المعتمدة لمقارنتها دون أي رسوم.`
                    : `Costs depend on project scale. On Wassitt in ${cityName}, you can post your job for free and receive transparent quotes directly from verified local providers.`}
                </p>
              </CardContent>
            </Card>

            <Card className="border">
              <CardContent className="p-6 space-y-2">
                <h3 className="font-bold text-base text-foreground">
                  {isAr ? `كيف أجد فني أو شركة ${categoryName} موثوقة في ${cityName}؟` : `How do I find trusted ${categoryName} providers in ${cityName}?`}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {isAr 
                    ? `عبر منصة وسيط، يمكنك تصفح دليل الشركات في ${cityName}، والاطلاع على تقييمات العملاء السابقين، أو نشر طلب جديد لاستقبال عروض مباشرة من مزودين تم التحقق من هوياتهم وسجلاتهم.`
                    : `Through Wassitt, you can browse verified profiles in ${cityName}, read genuine reviews, or post a request to get direct offers from background-checked professionals.`}
                </p>
              </CardContent>
            </Card>

            <Card className="border">
              <CardContent className="p-6 space-y-2">
                <h3 className="font-bold text-base text-foreground">
                  {isAr ? `ما هي الخدمات المشمولة في قسم ${categoryName} بمدينة ${cityName}؟` : `What services are included under ${categoryName} in ${cityName}?`}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {isAr
                    ? `يشمل هذا القسم كافة أعمال التركيب والصيانة الدورية والتعديلات والحلول الطارئة للمنازل والمباني السكنية والتجارية في جميع أحياء ${cityName}.`
                    : `This category covers installation, preventive maintenance, repair work, and emergency services for residential and commercial properties throughout ${cityName}.`}
                </p>
              </CardContent>
            </Card>

            <Card className="border">
              <CardContent className="p-6 space-y-2">
                <h3 className="font-bold text-base text-foreground">
                  {isAr ? `ما هو وقت الاستجابة للحصول على عروض أسعار في ${cityName}؟` : `How fast will I get responses for ${categoryName} in ${cityName}?`}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {isAr
                    ? `عادةً ما يبدأ الفنيون والشركات المعتمدة في ${cityName} بتقديم العروض خلال دقائق معدودة من نشر الطلب عبر المنصة.`
                    : `Verified contractors and providers in ${cityName} typically begin sending quotes within minutes of posting your request.`}
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 8. Comprehensive Internal Linking & SEO Hub Section */}
        <section className="space-y-8 pt-8 border-t">
          {/* Related Subcategories in Same Category */}
          {relatedSubcategories.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                <Tag className="w-4 h-4 text-primary" />
                {isAr ? `خدمات فرعية ذات صلة بـ ${categoryName} في ${cityName}` : `Sub-Services Related to ${categoryName} in ${cityName}`}
              </h3>
              <div className="flex flex-wrap gap-2">
                {relatedSubcategories.map(sub => (
                  <Link
                    key={sub.id}
                    href={`/${locale}/services/${sub.id}/${city.slug}`}
                    className="px-3.5 py-1.5 rounded-full bg-card border text-xs font-medium hover:border-primary hover:text-primary transition-colors shadow-sm"
                  >
                    {isAr ? sub.title.ar : sub.title.en} في {cityName}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Other Main Categories in Same City */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-primary" />
              {isAr ? `قطاعات خدمات أخرى في ${cityName}` : `Other Service Sectors in ${cityName}`}
            </h3>
            <div className="flex flex-wrap gap-2">
              {mainCategoriesList.map(cat => (
                <Link
                  key={cat.id}
                  href={`/${locale}/services/${cat.id}/${city.slug}`}
                  className="px-3.5 py-1.5 rounded-full bg-card border text-xs font-medium hover:border-primary hover:text-primary transition-colors shadow-sm"
                >
                  {isAr ? cat.label.ar : cat.label.en} في {cityName}
                </Link>
              ))}
            </div>
          </div>

          {/* Same Category in Other Syrian Cities */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              {isAr ? `خدمات ${categoryName} في المدن السورية الأخرى` : `${categoryName} Services in Other Syrian Cities`}
            </h3>
            <div className="flex flex-wrap gap-2">
              {otherCities.map(otherCity => (
                <Link
                  key={otherCity.slug}
                  href={`/${locale}/services/${category.slug}/${otherCity.slug}`}
                  className="px-3.5 py-1.5 rounded-full bg-card border text-xs font-medium hover:border-primary hover:text-primary transition-colors shadow-sm"
                >
                  {categoryName} في {isAr ? otherCity.nameAr : otherCity.nameEn}
                </Link>
              ))}
            </div>
          </div>

          {/* Global SEO Navigation Footer */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-muted/40 rounded-2xl border text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <Link href={`/${locale}/services/${category.slug}`} className="hover:text-primary transition-colors font-medium">
                ← {isAr ? `جميع خدمات ${categoryName}` : `All ${categoryName} Services`}
              </Link>
              <span>|</span>
              <Link href={`/${locale}/companies`} className="hover:text-primary transition-colors font-medium">
                {isAr ? 'دليل الشركات' : 'Companies Directory'}
              </Link>
            </div>
            <Link href={`/${locale}/requests/new`} className="text-primary font-bold hover:underline">
              + {isAr ? 'أضف طلب خدمة جديد' : 'Post New Service Request'}
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
