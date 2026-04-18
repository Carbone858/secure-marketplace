'use client';

import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { 
    Download, 
    Smartphone, 
    Apple, 
    CheckCircle2, 
    Share, 
    PlusSquare, 
    ShieldCheck, 
    Zap,
    Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function DownloadPage() {
    const t = useTranslations('download');
    const locale = useLocale();
    const isRTL = locale === 'ar';

    const androidSteps = [
        t('android.guide.step1'),
        t('android.guide.step2'),
        t('android.guide.step3'),
        t('android.guide.step4'),
    ];

    const iosSteps = [
        t('ios.guide.step1'),
        t('ios.guide.step2'),
        t('ios.guide.step3'),
        t('ios.guide.step4'),
    ];

    return (
        <div className="min-h-screen pb-20 overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative pt-16 pb-24 lg:pt-24 lg:pb-32 overflow-hidden bg-slate-50 dark:bg-slate-900/50 transition-colors">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px]" />
                </div>

                <div className="container relative px-4 mx-auto text-center lg:text-start lg:flex lg:items-center lg:gap-16">
                    <div className="lg:w-1/2 space-y-8">
                        <Badge variant="secondary" className="px-4 py-1.5 text-sm font-semibold bg-primary/20 text-primary border-primary/20 backdrop-blur-md">
                            {t('mockup.badge')}
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight lg:leading-[1.1] text-slate-900 dark:text-white">
                            {t('title')}
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
                            {t('subtitle')}
                        </p>
                        
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background border shadow-sm backdrop-blur-sm text-slate-700 dark:text-slate-300">
                                <ShieldCheck className="w-5 h-5 text-green-500" />
                                <span className="text-sm font-medium">Verified Security</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background border shadow-sm backdrop-blur-sm text-slate-700 dark:text-slate-300">
                                <Zap className="w-5 h-5 text-yellow-500" />
                                <span className="text-sm font-medium">Instant Updates</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background border shadow-sm backdrop-blur-sm text-slate-700 dark:text-slate-300">
                                <Lock className="w-5 h-5 text-blue-500" />
                                <span className="text-sm font-medium">Safe 256-bit Encryption</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 lg:mt-0 lg:w-1/2 relative">
                        <div className="relative z-10 animate-in fade-in zoom-in duration-1000">
                            <Image 
                                src="/images/app-mockup.png" 
                                alt={t('mockup.alt')} 
                                width={800} 
                                height={600} 
                                className="object-contain"
                                priority
                            />
                        </div>
                        {/* Decorative circle */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/10 rounded-full blur-3xl -z-10" />
                    </div>
                </div>
            </section>

            {/* Installation Guides */}
            <section className="container px-4 mx-auto -mt-12 lg:-mt-16">
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Android Card */}
                    <Card className="border-2 shadow-2xl relative overflow-hidden group">
                        <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b pb-8 pt-10">
                            <div className="flex items-center justify-between gap-4 mb-4">
                                <div className="h-14 w-14 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-600 border border-green-500/20">
                                    <Smartphone className="h-8 w-8" />
                                </div>
                                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
                                    Official APK Release
                                </Badge>
                            </div>
                            <CardTitle className="text-2xl font-bold">{t('android.title')}</CardTitle>
                            <CardDescription className="text-base mt-2">
                                {t('android.p')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-8 space-y-8">
                            <div className="space-y-4">
                                <h4 className="font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100 italic">
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                    {t('android.guide.title')}
                                </h4>
                                <div className="space-y-6">
                                    {androidSteps.map((step, idx) => (
                                        <div key={idx} className="flex gap-4 group/step">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-sm text-slate-500 group-hover/step:bg-primary group-hover/step:text-primary-foreground transition-colors">
                                                {idx + 1}
                                            </div>
                                            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 pt-1">
                                                {step}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 pb-2">
                                <a href="/downloads/android.apk" download>
                                    <Button className="w-full h-14 text-lg font-bold gap-3 shadow-lg shadow-primary/20">
                                        <Download className="w-6 h-6" />
                                        {t('android.button')}
                                    </Button>
                                </a>
                                <p className="text-center mt-4 text-[11px] text-muted-foreground italic">
                                    Current Version: 1.0.0 (Build 14) • 8.2 MB
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* iOS Card */}
                    <Card className="border-2 shadow-2xl relative overflow-hidden group">
                        <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b pb-8 pt-10">
                            <div className="flex items-center justify-between gap-4 mb-4">
                                <div className="h-14 w-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 border border-blue-500/20">
                                    <Apple className="h-8 w-8" />
                                </div>
                                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200">
                                    PWA Instant Native
                                </Badge>
                            </div>
                            <CardTitle className="text-2xl font-bold">{t('ios.title')}</CardTitle>
                            <CardDescription className="text-base mt-2">
                                {t('ios.p')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-8 space-y-8">
                            <div className="space-y-4">
                                <h4 className="font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100 italic">
                                    <CheckCircle2 className="w-5 h-5 text-blue-500" />
                                    {t('ios.guide.title')}
                                </h4>
                                <div className="space-y-6">
                                    {iosSteps.map((step, idx) => (
                                        <div key={idx} className="flex gap-4 group/step">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-sm text-slate-500 group-hover/step:bg-primary group-hover/step:text-primary-foreground transition-colors">
                                                {idx + 1}
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 pt-1">
                                                    {step}
                                                </p>
                                                {idx === 1 && (
                                                    <div className="flex items-center gap-2 mt-2 px-3 py-1.5 rounded-md bg-muted inline-flex">
                                                        <Share className="w-3.5 h-3.5 text-blue-500" />
                                                        <span className="text-[10px] uppercase font-bold text-muted-foreground">Safari Share Icon</span>
                                                    </div>
                                                )}
                                                {idx === 2 && (
                                                    <div className="flex items-center gap-2 mt-2 px-3 py-1.5 rounded-md bg-muted inline-flex">
                                                        <PlusSquare className="w-3.5 h-3.5 text-primary" />
                                                        <span className="text-[10px] uppercase font-bold text-muted-foreground">Add to Home Screen</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 pb-2">
                                <Button variant="outline" className="w-full h-14 text-lg font-bold gap-3 cursor-default border-primary/20 bg-primary/5">
                                    <Smartphone className="w-6 h-6 text-primary" />
                                    {t('ios.button')}
                                </Button>
                                <p className="text-center mt-4 text-[11px] text-muted-foreground italic">
                                    {locale === 'ar' ? 'يتطلب متصفح Safari لإتمام التثبيت' : 'Requires Safari browser for full features'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    );
}
