'use client';

import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { Smartphone, Apple, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function AppShowcase() {
    const t = useTranslations('download');
    const locale = useLocale();
    const isRTL = locale === 'ar';

    return (
        <section className="py-24 bg-slate-50 dark:bg-slate-900/50 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Left Side: Content */}
                    <div className="lg:w-1/2 space-y-8 text-center lg:text-start">
                        <div className="space-y-4">
                            <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 px-4 py-1">
                                {t('mockup.badge')}
                            </Badge>
                            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                                {t('title')}
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
                                {t('subtitle')}
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
                            <Button size="lg" className="rounded-2xl px-8 h-14 font-bold shadow-xl shadow-primary/20 gap-3 group" asChild>
                                <Link href={`/${locale}/download`}>
                                    <Smartphone className="w-5 h-5" />
                                    <span>{isRTL ? 'تحميل تطبيق أندرويد' : 'Get for Android'}</span>
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" className="rounded-2xl px-8 h-14 font-bold gap-3 border-2" asChild>
                                <Link href={`/${locale}/download`}>
                                    <Apple className="w-5 h-5" />
                                    <span>{isRTL ? 'تثبيت للآيفون' : 'Install on iPhone'}</span>
                                </Link>
                            </Button>
                        </div>

                        <div className="flex items-center justify-center lg:justify-start gap-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                             <div className="flex items-center gap-2">
                                <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                                </div>
                                <span className="text-xs font-semibold text-muted-foreground">{t('mockup.labels.malware')}</span>
                             </div>
                             <div className="flex items-center gap-2">
                                <div className="h-5 w-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                                    <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                                </div>
                                <span className="text-xs font-semibold text-muted-foreground">{t('mockup.labels.fast')}</span>
                             </div>
                        </div>
                    </div>

                    {/* Right Side: Mockup */}
                    <div className="lg:w-1/2 relative group">
                        <div className="relative z-10 animate-in fade-in slide-in-from-right-10 duration-1000">
                            <Image 
                                src="/images/app-mockup.png" 
                                alt={t('mockup.alt')} 
                                width={700} 
                                height={500} 
                                className="object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                            />
                        </div>
                        {/* Soft Glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-primary/5 rounded-full blur-[100px] -z-10 group-hover:bg-primary/10 transition-colors" />
                    </div>
                </div>
            </div>
        </section>
    );
}
