'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Star, 
  CheckCircle,
  Building2,
  ArrowRight
} from 'lucide-react';

interface HomePageClientProps {
  locale: string;
}

export default function HomePageClient({ locale }: HomePageClientProps) {
  const isRTL = locale === 'ar';
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <main className={isRTL ? 'rtl' : 'ltr'} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {isRTL ? 'احصل على عروض أسعار من أفضل الشركات' : 'Get Quotes from Top Companies'}
            </h1>
            <p className="text-xl text-primary/20 mb-8 max-w-2xl mx-auto">
              {isRTL 
                ? 'منصة الخدمات الرائدة في الوطن العربي' 
                : 'Leading service marketplace in the Arab world'}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href={`/${locale}/request`}
                className="inline-flex items-center justify-center px-8 py-4 bg-card text-primary rounded-lg font-semibold hover:bg-muted transition-colors"
              >
                {isRTL ? 'اطلب خدمة' : 'Request Service'}
                <ArrowRight className={`ml-2 w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
              </Link>
              <Link 
                href={`/${locale}/directory`}
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-card/10 transition-colors"
              >
                {isRTL ? 'تصفح الشركات' : 'Browse Companies'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">10K+</div>
              <div className="text-muted-foreground">{isRTL ? 'شركة' : 'Companies'}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">50K+</div>
              <div className="text-muted-foreground">{isRTL ? 'طلب' : 'Requests'}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">98%</div>
              <div className="text-muted-foreground">{isRTL ? 'رضا العملاء' : 'Satisfaction'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Available Projects Section */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {isRTL ? 'المشاريع المتاحة' : 'Available Projects'}
            </h2>
            <p className="text-muted-foreground">
              {isRTL ? 'تصفح المشاريع وأرسل عروضك' : 'Browse projects and send your offers'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                    {isRTL ? 'بناء' : 'Construction'}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {isRTL ? 'منذ ساعتين' : '2 hours ago'}
                  </span>
                </div>
                
                <h3 className="font-bold text-lg mb-2 text-foreground">
                  {isRTL ? 'ترميم شقة سكنية' : 'Apartment Renovation'}
                </h3>
                
                <div className="flex items-center text-muted-foreground mb-4">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">{isRTL ? 'دمشق - المالكي' : 'Damascus - Malki'}</span>
                </div>

                <div className="relative">
                  <div className="blur-sm opacity-50">
                    <div className="h-16 bg-muted rounded mb-2"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium">
                      <Star className="w-4 h-4 inline mr-1" />
                      {isRTL ? 'ترقية للعرض' : 'Upgrade to view'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link 
              href={`/${locale}/projects`}
              className="inline-flex items-center text-primary font-medium hover:text-primary"
            >
              {isRTL ? 'عرض جميع المشاريع' : 'View all projects'}
              <ArrowRight className={`ml-2 w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            {isRTL ? 'كيف يعمل؟' : 'How It Works?'}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Briefcase, title: isRTL ? 'قدم طلبك' : 'Submit Request', desc: isRTL ? 'اختر الخدمة واشرح ما تحتاجه' : 'Choose service and describe your needs' },
              { icon: Search, title: isRTL ? 'قارن العروض' : 'Compare Offers', desc: isRTL ? 'احصل على عروض من شركات متعددة' : 'Get offers from multiple companies' },
              { icon: CheckCircle, title: isRTL ? 'اختر الأفضل' : 'Choose Best', desc: isRTL ? 'اختر العرض المناسب لك' : 'Select the best offer for you' },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-8 h-8 text-primary/70" />
                <span className="font-bold text-xl">
                  {isRTL ? 'سوق الخدمات' : 'Service Marketplace'}
                </span>
              </div>
              <p className="text-muted-foreground/60">
                {isRTL ? 'منصة الخدمات الرائدة' : 'Leading service marketplace platform'}
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">{isRTL ? 'روابط سريعة' : 'Quick Links'}</h4>
              <ul className="space-y-2 text-muted-foreground/60">
                <li><Link href={`/${locale}/directory`} className="hover:text-white">{isRTL ? 'الشركات' : 'Companies'}</Link></li>
                <li><Link href={`/${locale}/projects`} className="hover:text-white">{isRTL ? 'المشاريع' : 'Projects'}</Link></li>
                <li><Link href={`/${locale}/about`} className="hover:text-white">{isRTL ? 'عن المنصة' : 'About'}</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">{isRTL ? 'للشركات' : 'For Companies'}</h4>
              <ul className="space-y-2 text-muted-foreground/60">
                <li><Link href={`/${locale}/register`} className="hover:text-white">{isRTL ? 'التسجيل' : 'Register'}</Link></li>
                <li><Link href={`/${locale}/pricing`} className="hover:text-white">{isRTL ? 'الأسعار' : 'Pricing'}</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">{isRTL ? 'تواصل معنا' : 'Contact'}</h4>
              <p className="text-muted-foreground/60">support@marketplace.com</p>
            </div>
          </div>
          
          <div className="border-t border-foreground/80 mt-8 pt-8 text-center text-muted-foreground/60">
            © 2024 Service Marketplace. {isRTL ? 'جميع الحقوق محفوظة' : 'All rights reserved.'}
          </div>
        </div>
      </footer>
    </main>
  );
}
