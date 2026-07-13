import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Hammer,
  Zap,
  Droplets,
  Sparkles,
  Wrench,
  Palette,
  Code2,
  Megaphone,
  Camera,
  Truck,
  Scale,
  Calculator,
  GraduationCap,
  Home,
  CheckCircle2,
  User,
  Search,
  Building2,
  ArrowRight,
  ShieldCheck,
  Clock,
  ThumbsUp,
  MapPin,
  TrendingUp,
} from 'lucide-react';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'landing' });
  return {
    title: `${t('hero.title')} - ${t('hero.subtitle')}`,
    description: t('hero.description'),
    openGraph: {
      title: `${t('hero.title')} - ${t('hero.subtitle')}`,
      description: t('hero.description'),
      images: [
        {
          url: '/images/hero-wassitt-syria.jpg',
          width: 1200,
          height: 630,
          alt: t('hero.title'),
        },
      ],
    },
  };
}

export default async function LandingPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'landing' });
  const isRTL = locale === 'ar';

  // Category list mapping with corresponding Lucide icons
  const categoriesList = [
    { key: 'construction', icon: Hammer, color: 'text-amber-500 bg-amber-500/10' },
    { key: 'electrical', icon: Zap, color: 'text-yellow-500 bg-yellow-500/10' },
    { key: 'plumbing', icon: Droplets, color: 'text-blue-500 bg-blue-500/10' },
    { key: 'cleaning', icon: Sparkles, color: 'text-teal-500 bg-teal-500/10' },
    { key: 'maintenance', icon: Wrench, color: 'text-slate-600 bg-slate-600/10' },
    { key: 'design', icon: Palette, color: 'text-purple-500 bg-purple-500/10' },
    { key: 'programming', icon: Code2, color: 'text-indigo-500 bg-indigo-500/10' },
    { key: 'marketing', icon: Megaphone, color: 'text-pink-500 bg-pink-500/10' },
    { key: 'photography', icon: Camera, color: 'text-rose-500 bg-rose-500/10' },
    { key: 'transportation', icon: Truck, color: 'text-emerald-500 bg-emerald-500/10' },
    { key: 'legal', icon: Scale, color: 'text-cyan-600 bg-cyan-600/10' },
    { key: 'accounting', icon: Calculator, color: 'text-violet-500 bg-violet-500/10' },
    { key: 'education', icon: GraduationCap, color: 'text-sky-500 bg-sky-500/10' },
    { key: 'realestate', icon: Home, color: 'text-orange-500 bg-orange-500/10' },
  ];

  // Syrian cities keys
  const citiesList = [
    'damascus',
    'aleppo',
    'homs',
    'hama',
    'latakia',
    'tartus',
    'idlib',
    'daraa',
    'sweida',
    'raqqa',
    'deir',
    'hasakah',
    'qamishli',
    'jableh',
    'baniyas',
    'safita',
    'salamiyah',
    'douma',
    'manbij',
    'afrin',
  ];

  // Why Wassitt cards map
  const whyCards = [
    { key: 'allInOne', icon: ShieldCheck, color: 'bg-primary/5 text-primary' },
    { key: 'saveTime', icon: Clock, color: 'bg-accent/10 text-accent-foreground' },
    { key: 'compareOffers', icon: ThumbsUp, color: 'bg-green-500/5 text-green-600' },
    { key: 'localizedSearch', icon: MapPin, color: 'bg-blue-500/5 text-blue-600' },
    { key: 'newOpportunities', icon: TrendingUp, color: 'bg-purple-500/5 text-purple-600' },
  ];

  return (
    <div className="w-full overflow-x-hidden bg-background min-h-screen">
      {/* 1. Hero Section — Light Premium Style */}
      <section className="relative min-h-[85vh] flex items-center py-20 px-4 md:px-8 border-b overflow-hidden bg-gradient-to-br from-blue-50 via-white to-emerald-50">
        {/* Light Decorative Background Blobs */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -start-32 w-96 h-96 rounded-full bg-blue-100/70 blur-3xl" />
          <div className="absolute top-20 end-0 w-80 h-80 rounded-full bg-emerald-100/60 blur-3xl" />
          <div className="absolute bottom-0 start-1/3 w-72 h-72 rounded-full bg-indigo-100/50 blur-3xl" />
        </div>

        {/* Hero Content + Illustration Grid */}
        <div className="container mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text & CTAs */}
          <div className="space-y-6 text-start">
            {/* Branding Accent */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-semibold text-xs md:text-sm">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>{t('hero.title')}</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.15] md:leading-[1.2]">
              {t('hero.subtitle')}
            </h1>

            {/* Sub-headline */}
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-normal max-w-xl">
              {t('hero.description')}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/95 text-white font-bold text-lg px-8 py-6 rounded-xl shadow-xl shadow-primary/30 h-auto transition-transform hover:-translate-y-0.5"
              >
                <Link href={`/${locale}/requests/start`}>
                  {t('hero.cta.post')}
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="bg-white hover:bg-slate-50 border-slate-300 text-foreground font-bold text-lg px-8 py-6 rounded-xl h-auto shadow-sm transition-transform hover:-translate-y-0.5"
              >
                <Link href={`/${locale}/companies`}>
                  {t('hero.cta.find')}
                </Link>
              </Button>
            </div>
          </div>

          {/* Right: Inline SVG Illustration — no CSP issues, always renders */}
          <div className="flex items-center justify-center relative">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 580" className="w-full max-w-md drop-shadow-2xl" aria-label="Wassitt marketplace illustration">
              <defs>
                <linearGradient id="h-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#eff6ff" />
                  <stop offset="100%" stopColor="#f0fdf4" />
                </linearGradient>
                <linearGradient id="h-phone" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>
                <filter id="h-shadow">
                  <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#0f172a" floodOpacity="0.10" />
                </filter>
              </defs>

              {/* Background card */}
              <rect x="10" y="10" width="500" height="560" rx="32" fill="url(#h-bg)" filter="url(#h-shadow)" />

              {/* SYRIAN FLAG — correct: green / white / black + 3 red five-point stars */}
              <g transform="translate(30, 32)">
                <rect x="0" y="0" width="5" height="160" rx="2.5" fill="#94a3b8" />
                <circle cx="2.5" cy="0" r="5" fill="#cbd5e1" />
                {/* Green stripe */}
                <path d="M5,8 C35,2 60,14 90,8 L90,60 C60,66 35,54 5,60 Z" fill="#007a3d" />
                {/* White stripe */}
                <path d="M5,60 C35,54 60,66 90,60 L90,112 C60,118 35,106 5,112 Z" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.5" />
                {/* Black stripe */}
                <path d="M5,112 C35,106 60,118 90,112 L90,163 C60,169 35,157 5,163 Z" fill="#000000" />
                {/* 3 red 5-point stars centered in the white stripe */}
                <path d="M0,-6 L1.76,-1.76 L6,-1.76 L2.65,0.88 L3.82,5.12 L0,2.48 L-3.82,5.12 L-2.65,0.88 L-6,-1.76 L-1.76,-1.76 Z" transform="translate(28,86)" fill="#ce1126" />
                <path d="M0,-6 L1.76,-1.76 L6,-1.76 L2.65,0.88 L3.82,5.12 L0,2.48 L-3.82,5.12 L-2.65,0.88 L-6,-1.76 L-1.76,-1.76 Z" transform="translate(47,86)" fill="#ce1126" />
                <path d="M0,-6 L1.76,-1.76 L6,-1.76 L2.65,0.88 L3.82,5.12 L0,2.48 L-3.82,5.12 L-2.65,0.88 L-6,-1.76 L-1.76,-1.76 Z" transform="translate(66,86)" fill="#ce1126" />
              </g>

              {/* SMARTPHONE MOCKUP */}
              <g transform="translate(200, 30)" filter="url(#h-shadow)">
                <rect width="200" height="400" rx="32" fill="#0f172a" />
                <rect x="7" y="7" width="186" height="386" rx="25" fill="#ffffff" />
                <rect x="7" y="7" width="186" height="48" rx="0" fill="url(#h-phone)" clipPath="inset(0 round 25px 25px 0 0)" />
                <rect x="60" y="7" width="80" height="14" rx="7" fill="#0f172a" />
                <text x="100" y="35" fill="#ffffff" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="13" textAnchor="middle" letterSpacing="1">WASSITT</text>
                {/* Search bar */}
                <rect x="18" y="66" width="164" height="22" rx="11" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1" />
                <text x="30" y="81" fill="#94a3b8" fontFamily="Arial, sans-serif" fontSize="9">ابحث عن خدمة...</text>
                {/* Cards */}
                <rect x="18" y="100" width="164" height="50" rx="10" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
                <rect x="26" y="108" width="34" height="34" rx="8" fill="#eff6ff" />
                <text x="43" y="130" fill="#2563eb" fontFamily="Arial" fontWeight="bold" fontSize="18" textAnchor="middle">⚡</text>
                <text x="70" y="120" fill="#1e293b" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="10">الكهرباء</text>
                <text x="70" y="134" fill="#10b981" fontFamily="Arial, sans-serif" fontSize="9">12 شركة موثقة</text>

                <rect x="18" y="160" width="164" height="50" rx="10" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
                <rect x="26" y="168" width="34" height="34" rx="8" fill="#f0fdf4" />
                <text x="43" y="190" fill="#10b981" fontFamily="Arial" fontWeight="bold" fontSize="18" textAnchor="middle">🔧</text>
                <text x="70" y="180" fill="#1e293b" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="10">صيانة عامة</text>
                <text x="70" y="194" fill="#64748b" fontFamily="Arial, sans-serif" fontSize="9">دمشق · حلب</text>

                {/* Offer accepted */}
                <rect x="18" y="225" width="164" height="95" rx="12" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
                <rect x="18" y="225" width="164" height="26" rx="0" fill="#10b981" clipPath="inset(0 round 12px 12px 0 0)" />
                <text x="100" y="242" fill="#ffffff" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="9" textAnchor="middle">✔ تم قبول العرض</text>
                <circle cx="40" cy="274" r="14" fill="#dbeafe" />
                <circle cx="40" cy="270" r="5" fill="#2563eb" />
                <path d="M30,284 C30,278 34,278 40,278 C46,278 50,278 50,284 Z" fill="#2563eb" />
                <text x="60" y="268" fill="#1e293b" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="9">ياسين م. - دمشق</text>
                <text x="60" y="280" fill="#64748b" fontFamily="Arial, sans-serif" fontSize="8">كهربائي معتمد ★ 4.9</text>
                <rect x="120" y="298" width="55" height="17" rx="6" fill="#2563eb" />
                <text x="147" y="310" fill="#ffffff" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="8" textAnchor="middle">تواصل الآن</text>
                <rect x="65" y="385" width="70" height="4" rx="2" fill="#e2e8f0" />
              </g>

              {/* FLOATING BADGES */}
              <g transform="translate(28, 310)" filter="url(#h-shadow)">
                <rect width="155" height="52" rx="14" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
                <rect x="10" y="8" width="36" height="36" rx="10" fill="#eff6ff" />
                <text x="28" y="31" fontFamily="Arial" fontSize="20" textAnchor="middle">🛡️</text>
                <text x="56" y="26" fill="#1e293b" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="10">موثق وآمن</text>
                <text x="56" y="40" fill="#10b981" fontFamily="Arial, sans-serif" fontSize="8">100% مضمون</text>
              </g>

              <g transform="translate(28, 375)" filter="url(#h-shadow)">
                <rect width="155" height="52" rx="14" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
                <rect x="10" y="8" width="36" height="36" rx="10" fill="#f0fdf4" />
                <text x="28" y="31" fontFamily="Arial" fontSize="20" textAnchor="middle">📋</text>
                <text x="56" y="26" fill="#1e293b" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="10">عروض متعددة</text>
                <text x="56" y="40" fill="#64748b" fontFamily="Arial, sans-serif" fontSize="8">قارن واختر الأفضل</text>
              </g>

              <g transform="translate(28, 440)" filter="url(#h-shadow)">
                <rect width="155" height="52" rx="14" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
                <rect x="10" y="8" width="36" height="36" rx="10" fill="#fefce8" />
                <text x="28" y="31" fontFamily="Arial" fontSize="20" textAnchor="middle">📍</text>
                <text x="56" y="26" fill="#1e293b" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="10">جميع المدن</text>
                <text x="56" y="40" fill="#64748b" fontFamily="Arial, sans-serif" fontSize="8">دمشق · حلب · حمص</text>
              </g>
            </svg>
          </div>
        </div>
      </section>

      {/* 2. How Wassitt Works Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              {t('howItWorks.title')}
            </h2>
            <div className="h-1.5 w-20 bg-primary mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Journey 1: Customer flow */}
            <Card className="border-border/60 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden bg-card/60 backdrop-blur-sm">
              <div className="p-8 md:p-10 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    <User className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">
                    {t('howItWorks.customer.title')}
                  </h3>
                </div>

                <div className="space-y-6">
                  {/* Step 1 */}
                  <div className="flex gap-4 items-start">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold shrink-0 text-sm mt-0.5">
                      1
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-foreground text-start">
                        {t('howItWorks.customer.step1')}
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex gap-4 items-start">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold shrink-0 text-sm mt-0.5">
                      2
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-foreground text-start">
                        {t('howItWorks.customer.step2')}
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex gap-4 items-start">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold shrink-0 text-sm mt-0.5">
                      3
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-foreground text-start">
                        {t('howItWorks.customer.step3')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Journey 2: Search flow */}
            <Card className="border-border/60 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden bg-card/60 backdrop-blur-sm">
              <div className="p-8 md:p-10 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-accent/15 text-accent-foreground">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">
                    {t('howItWorks.search.title')}
                  </h3>
                </div>

                <p className="text-muted-foreground text-start">
                  {t('howItWorks.search.intro')}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* City Filter */}
                  <div className="p-4 rounded-xl border bg-background/80 flex flex-col items-center justify-center text-center gap-2 hover:border-primary/50 transition-colors">
                    <MapPin className="w-6 h-6 text-primary" />
                    <span className="font-semibold text-sm text-foreground">
                      {t('howItWorks.search.city')}
                    </span>
                  </div>

                  {/* Category Filter */}
                  <div className="p-4 rounded-xl border bg-background/80 flex flex-col items-center justify-center text-center gap-2 hover:border-primary/50 transition-colors">
                    <Building2 className="w-6 h-6 text-primary" />
                    <span className="font-semibold text-sm text-foreground">
                      {t('howItWorks.search.category')}
                    </span>
                  </div>

                  {/* Service Type Filter */}
                  <div className="p-4 rounded-xl border bg-background/80 flex flex-col items-center justify-center text-center gap-2 hover:border-primary/50 transition-colors">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                    <span className="font-semibold text-sm text-foreground">
                      {t('howItWorks.search.type')}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 3. Segment section: For Customers */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/30 border-y border-border/40">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-start">
            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-sm">
              {t('forCustomers.title')}
            </div>
            <h3 className="text-3xl md:text-4xl font-extrabold text-foreground leading-tight">
              {locale === 'ar' ? 'هل تبحث عن مقدم خدمة موثوق؟' : 'Looking for a reliable service provider?'}
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('forCustomers.description')}
            </p>
            <div className="pt-2">
              <Button
                asChild
                size="lg"
                className="rounded-xl px-8 py-5 h-auto font-bold bg-primary hover:bg-primary/90 text-white"
              >
                <Link href={`/${locale}/requests/start`} className="inline-flex items-center gap-2">
                  <span>{t('forCustomers.cta')}</span>
                  <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                </Link>
              </Button>
            </div>
          </div>
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="w-full max-w-md aspect-square rounded-3xl bg-gradient-to-tr from-primary to-blue-600 p-1 shadow-2xl overflow-hidden">
              <div className="w-full h-full rounded-[22px] bg-slate-950 flex flex-col items-center justify-center p-8 text-center text-white relative">
                {/* Visual Graphic Representation */}
                <div className="absolute top-4 start-4 text-xs font-bold text-slate-400">وسيط App</div>
                <div className="p-4 rounded-2xl bg-white/10 mb-4">
                  <ShieldCheck className="w-16 h-16 text-accent" />
                </div>
                <h4 className="text-xl font-bold mb-2">{locale === 'ar' ? 'أمان وضمان كامل' : '100% Secure & Vetted'}</h4>
                <p className="text-sm text-slate-300">{locale === 'ar' ? 'نحقق يدوياً من هويات وأوراق جميع الشركات والمقدمين لنضمن راحتك تماماً.' : 'We manually verify identities of all businesses for your absolute peace of mind.'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Segment section: For Companies & Professionals */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1 relative flex justify-center">
            <div className="w-full max-w-md aspect-square rounded-3xl bg-gradient-to-tr from-accent to-amber-500 p-1 shadow-2xl overflow-hidden">
              <div className="w-full h-full rounded-[22px] bg-slate-950 flex flex-col items-center justify-center p-8 text-center text-white relative">
                {/* Visual Graphic Representation */}
                <div className="absolute top-4 start-4 text-xs font-bold text-slate-400">Wassitt Business</div>
                <div className="p-4 rounded-2xl bg-white/10 mb-4">
                  <TrendingUp className="w-16 h-16 text-primary" />
                </div>
                <h4 className="text-xl font-bold mb-2">{locale === 'ar' ? 'نمو ونجاح مستمر' : 'Grow Your Business'}</h4>
                <p className="text-sm text-slate-300">{locale === 'ar' ? 'تلقى طلبات حقيقية من عملاء في منطقتك مباشرة وابدأ بتقديم عروضك وزيادة أرباحك.' : 'Receive real service requests from local customers directly, offer quotes, and increase profits.'}</p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6 text-start">
            <div className="inline-block px-3 py-1 rounded-full bg-accent/15 text-accent-foreground font-bold text-sm">
              {locale === 'ar' ? 'للمحترفين والشركات' : 'For Professionals & Companies'}
            </div>
            <h3 className="text-3xl md:text-4xl font-extrabold text-foreground leading-tight">
              {t('forCompanies.title')}
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('forCompanies.description')}
            </p>
            <div className="pt-2">
              <Button
                asChild
                size="lg"
                className="rounded-xl px-8 py-5 h-auto font-bold bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                <Link href={`/${locale}/company/join`} className="inline-flex items-center gap-2">
                  <span>{t('forCompanies.cta')}</span>
                  <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Categories Grid */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/20 border-t border-border/40">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
              {t('categories.title')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('categories.subtitle')}
            </p>
            <div className="h-1.5 w-20 bg-primary mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {categoriesList.map((category) => {
              const IconComponent = category.icon;
              return (
                <Link
                  key={category.key}
                  href={`/${locale}/companies?category=${category.key}`}
                  className="group block"
                >
                  <Card className="h-full border-border/50 hover:border-primary/50 hover:shadow-lg transition-all duration-300 rounded-2xl bg-card hover:-translate-y-1">
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-4">
                      <div className={`p-4 rounded-2xl shrink-0 transition-transform group-hover:scale-110 ${category.color}`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <span className="font-bold text-sm text-foreground transition-colors group-hover:text-primary leading-tight">
                        {t(`categories.list.${category.key}`)}
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Syrian Cities Showcase */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
              {t('cities.title')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('cities.subtitle')}
            </p>
            <div className="h-1.5 w-20 bg-primary mx-auto rounded-full" />
          </div>

          <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-4xl mx-auto">
            {citiesList.map((cityKey) => (
              <Link
                key={cityKey}
                href={`/${locale}/companies?city=${cityKey}`}
                className="px-5 py-3 rounded-full border border-border bg-card/60 backdrop-blur hover:border-primary hover:bg-primary/5 hover:text-primary transition-all duration-200 font-semibold text-sm md:text-base shadow-sm hover:shadow"
              >
                {t(`cities.list.${cityKey}`)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Why Wassitt? Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/30 border-t border-border/40">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
              {t('whyWassitt.title')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('whyWassitt.subtitle')}
            </p>
            <div className="h-1.5 w-20 bg-primary mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyCards.map((card, idx) => {
              const IconComponent = card.icon;
              return (
                <Card
                  key={card.key}
                  className={`border-border/50 shadow-sm hover:shadow-md transition-shadow rounded-2xl bg-card ${
                    idx === 3 || idx === 4 ? 'md:col-span-1 lg:col-span-1' : ''
                  }`}
                >
                  <CardContent className="p-8 space-y-4 text-start">
                    <div className={`inline-flex p-3 rounded-2xl ${card.color}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">
                      {t(`whyWassitt.cards.${card.key}.title`)}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {t(`whyWassitt.cards.${card.key}.desc`)}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. Final CTA Section */}
      <section className="relative py-24 overflow-hidden bg-primary">
        {/* Subtle Background Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-primary to-indigo-800 opacity-90 z-0" />

        <div className="container mx-auto px-4 relative z-10 text-center space-y-8 max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
            {t('footerCta.title')}
          </h2>
          <p className="text-lg md:text-xl text-blue-100 leading-relaxed font-normal">
            {locale === 'ar'
              ? 'انضم إلى آلاف المستخدمين والشركات في سوريا وابدأ بتسهيل إنجاز أعمالك اليوم.'
              : 'Join thousands of users and companies in Syria and start getting things done today.'}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Button
              asChild
              size="lg"
              className="bg-white hover:bg-slate-100 text-primary font-bold text-lg px-8 py-6 rounded-xl shadow-xl h-auto"
            >
              <Link href={`/${locale}/requests/start`}>
                {t('hero.cta.post')}
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="bg-transparent border-white text-white hover:bg-white/10 font-bold text-lg px-8 py-6 rounded-xl h-auto"
            >
              <Link href={`/${locale}/company/join`}>
                {t('forCompanies.cta')}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
