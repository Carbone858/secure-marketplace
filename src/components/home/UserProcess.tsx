'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from 'next-intl';
import { FileText, MessageSquare, CheckCircle, Star, Shield, User, Globe, Moon, Sun, Menu, ChevronRight, MapPin, DollarSign, Image as ImageIcon, Plus, Home as HomeIcon, Wifi, Battery, Signal } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function UserProcess() {
    const locale = useLocale();
    const [activeStep, setActiveStep] = useState(0);

    const steps = [
        {
            id: 0,
            titleEn: "1. Home & Start",
            titleAr: "1. الرئيسية والبدء",
            descEn: "Start by creating a new request from the home screen.",
            descAr: "ابدأ بإنشاء طلب جديد من الشاشة الرئيسية.",
            icon: HomeIcon,
            color: "bg-blue-500"
        },
        {
            id: 1,
            titleEn: "2. Create Request",
            titleAr: "2. تفاصيل الطلب",
            descEn: "Fill in the details: location, budget, and description.",
            descAr: "املأ التفاصيل: الموقع، الميزانية، والوصف.",
            icon: FileText,
            color: "bg-purple-500"
        },
        {
            id: 2,
            titleEn: "3. Receive Offers",
            titleAr: "3. تلقي العروض",
            descEn: "Review offers, accept the best one, and track status.",
            descAr: "راجع العروض، اقبل الأفضل، وتابع حالة الطلب.",
            icon: MessageSquare,
            color: "bg-emerald-500"
        }
    ];

    const offersEn = [
        { name: 'Alpha Services', price: '$120 - $150', desc: 'Full service with materials included.', rating: '4.9' },
        { name: 'Quick Fix', price: '$100', desc: 'Can start immediately. 1 year warranty.', rating: '4.5' },
    ];

    const offersAr = [
        { name: 'شركة الأصيل', price: '$120 - $150', desc: 'خدمة شاملة مع توفير جميع المواد اللازمة.', rating: '4.9' },
        { name: 'ورشة الإتقان', price: '$100', desc: 'يمكننا البدء فوراً. ضمان سنة على الشغل.', rating: '4.5' },
    ];

    const offers = locale === 'ar' ? offersAr : offersEn;

    // Auto-play with reset on interaction
    useEffect(() => {
        const timer = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % steps.length);
        }, 6000); // Slower speed (6s) for realistic animations
        return () => clearInterval(timer);
    }, [activeStep]); // Reset timer when activeStep changes

    return (
        <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">
                        {locale === 'ar' ? 'رحلة المستخدم' : 'User Journey'}
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        {locale === 'ar'
                            ? 'تجربة مستخدم سهلة وسريعة من البداية حتى النهاية'
                            : 'Seamless user experience from start to finish'}
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row items-center justify-center gap-16">

                    {/* Left Side: Steps (Text) */}
                    <div className="w-full lg:w-1/2 space-y-6">
                        {steps.map((step, index) => (
                            <div
                                key={step.id}
                                onClick={() => setActiveStep(index)}
                                className={cn(
                                    "cursor-pointer p-6 rounded-2xl transition-all duration-300 border-2 relative overflow-hidden group select-none",
                                    activeStep === index
                                        ? "border-primary bg-primary/5 shadow-lg scale-105"
                                        : "border-transparent hover:bg-gray-100 dark:hover:bg-gray-800"
                                )}
                            >
                                <div className="flex items-start gap-4 relative z-10">
                                    <div className="relative">
                                        <div className={cn(
                                            "h-12 w-12 rounded-full flex items-center justify-center text-white shadow-md shrink-0 transition-colors relative z-10",
                                            activeStep === index ? "bg-primary" : "bg-gray-300 dark:bg-gray-700"
                                        )}>
                                            <step.icon className="h-6 w-6" />
                                        </div>
                                        {/* Circular Progress (Active only) */}
                                        {activeStep === index && (
                                            <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16 rotate-[-90deg] z-0 pointer-events-none">
                                                <circle
                                                    cx="32" cy="32" r="28"
                                                    stroke="currentColor"
                                                    strokeWidth="3"
                                                    className="text-primary/20"
                                                    fill="none"
                                                />
                                                <motion.circle
                                                    key={activeStep} // Restart animation on step change
                                                    cx="32" cy="32" r="28"
                                                    stroke="currentColor"
                                                    strokeWidth="3"
                                                    className="text-primary"
                                                    fill="none"
                                                    strokeDasharray="176"
                                                    initial={{ strokeDashoffset: 176 }}
                                                    animate={{ strokeDashoffset: 0 }}
                                                    transition={{ duration: 3, ease: "linear" }} // Faster (3s)
                                                />
                                            </svg>
                                        )}
                                    </div>

                                    <div>
                                        <h3 className={cn(
                                            "text-xl font-bold mb-2 transition-colors",
                                            activeStep === index ? "text-primary" : "text-gray-700 dark:text-gray-300"
                                        )}>
                                            {locale === 'ar' ? step.titleAr : step.titleEn}
                                        </h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {locale === 'ar' ? step.descAr : step.descEn}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Side: Phone Mockup */}
                    <div className="w-full lg:w-1/2 flex justify-center perspective-1000">
                        <motion.div
                            className="relative w-[300px] h-[600px] bg-gray-900 rounded-[3rem] shadow-2xl overflow-hidden border-[8px] border-gray-900 dark:border-gray-800 dark:shadow-gray-800/20 ring-1 ring-gray-900/5 dark:ring-white/10"
                            initial={{ rotateY: 15, rotateX: 5 }}
                            animate={{ rotateY: 0, rotateX: 0 }}
                            transition={{ duration: 1 }}
                        >
                            {/* Notch */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-50"></div>

                            {/* Status Bar */}
                            <div className="absolute top-0 w-full h-12 flex justify-between items-center px-6 pt-2 z-50 text-black dark:text-white">
                                <div className="text-xs font-bold">9:41</div>
                                <div className="flex gap-1.5 items-center">
                                    <Signal className="h-3 w-3" strokeWidth={3} />
                                    <Wifi className="h-3.5 w-3.5" strokeWidth={3} />
                                    <Battery className="h-4 w-4" strokeWidth={3} />
                                </div>
                            </div>

                            {/* Screen Content */}
                            <div className="w-full h-full bg-white dark:bg-gray-950 relative overflow-hidden font-sans select-none flex flex-col pt-12">

                                {/* Top App Bar (Common) */}
                                <div className="h-14 bg-white dark:bg-gray-900 border-b dark:border-gray-800 flex justify-between items-center px-4 shrink-0 z-40">
                                    <div className="font-bold text-lg text-primary">
                                        {locale === 'ar' ? 'موقعنا' : 'OurSite'}
                                    </div>
                                    <div className="flex gap-3 text-gray-400">
                                        <Globe className="h-4 w-4" />
                                        <Moon className="h-4 w-4" />
                                    </div>
                                </div>

                                <div className="flex-1 relative bg-gray-50 dark:bg-gray-950 overflow-hidden">
                                    <AnimatePresence mode="wait">

                                        {/* Screen 1: Home / Hero */}
                                        {activeStep === 0 && (
                                            <motion.div
                                                key="screen1"
                                                className="absolute inset-0 flex flex-col p-6 items-center justify-center text-center"
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 1.1 }}
                                                transition={{ duration: 0.4 }}
                                            >
                                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                                    {locale === 'ar' ? 'مرحباً بك مجدداً!' : 'Welcome Back!'}
                                                </h2>
                                                <p className="text-gray-500 mb-8 max-w-[200px]">
                                                    {locale === 'ar' ? 'ما الذي تريد إنجازه اليوم؟' : 'What do you want to get done today?'}
                                                </p>

                                                <div className="w-full relative">
                                                    <motion.button
                                                        className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 mb-6 hover:scale-105 transition-transform"
                                                        animate={{ scale: [1, 0.95, 1] }}
                                                        transition={{ delay: 5.5, duration: 0.2 }}
                                                    >
                                                        <Plus className="h-5 w-5" />
                                                        {locale === 'ar' ? 'إنشاء طلب جديد' : 'Create New Request'}
                                                    </motion.button>
                                                    {/* Tap Highlight */}
                                                    <motion.div
                                                        className="absolute top-1/2 left-1/2 w-12 h-12 bg-white/30 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                                                        initial={{ scale: 0, opacity: 0 }}
                                                        animate={{ scale: [0, 2], opacity: [0.5, 0] }}
                                                        transition={{ delay: 5.4, duration: 0.4 }}
                                                    />
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 w-full">
                                                    <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border dark:border-gray-800 h-24 flex flex-col items-center justify-center gap-2">
                                                        <FileText className="h-6 w-6 text-blue-500" />
                                                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{locale === 'ar' ? 'طلباتي' : 'My Requests'}</span>
                                                    </div>
                                                    <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border dark:border-gray-800 h-24 flex flex-col items-center justify-center gap-2">
                                                        <MessageSquare className="h-6 w-6 text-purple-500" />
                                                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{locale === 'ar' ? 'الرسائل' : 'Messages'}</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Screen 2: Create Request Form (Realistic Typing) */}
                                        {activeStep === 1 && (
                                            <motion.div
                                                key="screen2"
                                                className="absolute inset-0 flex flex-col p-4 overflow-y-auto"
                                                initial={{ opacity: 0, x: 50 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -50 }}
                                                transition={{ duration: 0.4 }}
                                            >
                                                <div className="mb-4">
                                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                                                        {locale === 'ar' ? 'إنشاء طلب جديد' : 'Create New Request'}
                                                    </h3>
                                                    <div className="text-xs text-gray-400 mt-1 flex justify-between">
                                                        <span>{locale === 'ar' ? 'الخطوة 1 من 5' : 'Step 1 of 5'}</span>
                                                        <span>20%</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-800 rounded-full mt-1">
                                                        <motion.div
                                                            className="h-1.5 bg-primary rounded-full"
                                                            initial={{ width: "0%" }}
                                                            animate={{ width: "20%" }}
                                                            transition={{ delay: 0.5, duration: 0.5 }}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="space-y-1 relative">
                                                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                                                            {locale === 'ar' ? 'عنوان الطلب' : 'Title'}
                                                        </label>
                                                        <div className="h-10 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-lg flex items-center px-3 text-sm text-gray-800 dark:text-gray-200 overflow-hidden relative">
                                                            <motion.span
                                                                initial={{ width: 0 }}
                                                                animate={{ width: "100%" }}
                                                                transition={{ delay: 1, duration: 1.5, ease: "linear" }}
                                                                className="overflow-hidden whitespace-nowrap block"
                                                            >
                                                                {locale === 'ar' ? 'صيانة عامة للمنزل' : 'General Home Maintenance'}
                                                            </motion.span>
                                                            <motion.span
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: [0, 1, 0] }}
                                                                transition={{ delay: 1, duration: 2, repeat: 2 }}
                                                                className="absolute right-3 w-0.5 h-4 bg-primary top-3"
                                                            />
                                                        </div>
                                                        {/* Tap Highlight */}
                                                        <motion.div
                                                            className="absolute top-1/2 left-1/2 w-8 h-8 bg-primary/20 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                                                            initial={{ scale: 0, opacity: 0 }}
                                                            animate={{ scale: [0, 1.5], opacity: [0.5, 0] }}
                                                            transition={{ delay: 0.8, duration: 0.4 }}
                                                        />
                                                    </div>

                                                    <div className="space-y-1 relative">
                                                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                                                            {locale === 'ar' ? 'الوصف' : 'Description'}
                                                        </label>
                                                        <div className="h-24 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-lg p-3 text-sm text-gray-400 leading-relaxed font-sans relative">
                                                            <motion.span
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                transition={{ delay: 3, duration: 1 }}
                                                                className="text-gray-800 dark:text-gray-200"
                                                            >
                                                                {locale === 'ar' ? 'أحتاج إلى سباك وكهربائي لإصلاح...' : 'I need a plumber and electrician to fix...'}
                                                            </motion.span>
                                                            <motion.span
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: [0, 1, 0] }}
                                                                transition={{ delay: 3, duration: 2, repeat: 2 }}
                                                                className="inline-block w-0.5 h-3 bg-primary ml-0.5 align-middle"
                                                            />
                                                        </div>
                                                        {/* Tap Highlight */}
                                                        <motion.div
                                                            className="absolute top-1/2 left-10 w-8 h-8 bg-primary/20 rounded-full pointer-events-none"
                                                            initial={{ scale: 0, opacity: 0 }}
                                                            animate={{ scale: [0, 1.5], opacity: [0.5, 0] }}
                                                            transition={{ delay: 2.8, duration: 0.4 }}
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className="space-y-1">
                                                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">{locale === 'ar' ? 'المدينة' : 'City'}</label>
                                                            <div className="h-10 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-lg flex items-center px-3 text-sm text-gray-800 dark:text-gray-200">
                                                                {locale === 'ar' ? 'دمشق' : 'Damascus'}
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">{locale === 'ar' ? 'الميزانية' : 'Budget'}</label>
                                                            <div className="h-10 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-lg flex items-center px-3 text-sm text-gray-800 dark:text-gray-200">
                                                                {locale === 'ar' ? 'قابل للتفاوض' : 'Negotiable'}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="h-24 border-2 border-dashed dark:border-gray-800 rounded-xl flex flex-col items-center justify-center text-gray-400 gap-2 bg-gray-50/50 dark:bg-gray-900/50">
                                                        <ImageIcon className="h-6 w-6" />
                                                        <span className="text-xs">{locale === 'ar' ? 'اسحب الصور هنا' : 'Drop images here'}</span>
                                                    </div>
                                                </div>

                                                <div className="mt-auto pt-4 relative">
                                                    <motion.button
                                                        className="w-full bg-gray-900 dark:bg-white dark:text-black text-white py-3 rounded-lg font-bold shadow-lg"
                                                        animate={{ scale: [1, 0.95, 1] }}
                                                        transition={{ delay: 5.5, duration: 0.2 }}
                                                    >
                                                        {locale === 'ar' ? 'التالي' : 'Next'}
                                                    </motion.button>
                                                    {/* Tap Highlight on Button */}
                                                    <motion.div
                                                        className="absolute top-1/2 left-1/2 w-12 h-12 bg-white/30 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                                                        initial={{ scale: 0, opacity: 0 }}
                                                        animate={{ scale: [0, 2], opacity: [0.5, 0] }}
                                                        transition={{ delay: 5.4, duration: 0.4 }}
                                                    />
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Screen 3: Offers List */}
                                        {activeStep === 2 && (
                                            <motion.div
                                                key="screen3"
                                                className="absolute inset-0 flex flex-col p-4 overflow-y-auto"
                                                initial={{ opacity: 0, x: 50 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -50 }}
                                                transition={{ duration: 0.4 }}
                                            >
                                                <div className="flex justify-between items-center mb-4">
                                                    <div>
                                                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                                                            {locale === 'ar' ? 'الطلب #1234' : 'Request #1234'}
                                                        </h3>
                                                        <span className="text-xs text-gray-400">
                                                            {locale === 'ar' ? 'منذ 2 ساعة' : 'Posted 2h ago'}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-bold uppercase tracking-wider">
                                                        {locale === 'ar' ? 'قيد الانتظار' : 'Pending'}
                                                    </span>
                                                </div>

                                                <h4 className="font-semibold text-sm mb-2 text-gray-600 dark:text-gray-400">
                                                    {locale === 'ar' ? 'العروض (2)' : 'Offers (2)'}
                                                </h4>

                                                <div className="space-y-3">
                                                    {offers.map((offer, i) => (
                                                        <div key={i} className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl p-3 shadow-sm">
                                                            <div className="flex justify-between mb-1">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="h-6 w-6 bg-gray-200 dark:bg-gray-800 rounded-full text-[10px] flex items-center justify-center font-bold dark:text-gray-300">
                                                                        {offer.name[0]}
                                                                    </div>
                                                                    <span className="font-bold text-sm dark:text-gray-200">{offer.name}</span>
                                                                </div>
                                                                <span className="font-bold text-primary text-sm">{offer.price}</span>
                                                            </div>
                                                            <p className="text-xs text-gray-500 mb-2 pl-8">{offer.desc}</p>

                                                            <div className="flex gap-2 pl-8">
                                                                <button className="flex-1 bg-green-600 text-white text-xs py-1.5 rounded font-medium hover:bg-green-700">
                                                                    {locale === 'ar' ? 'قبول' : 'Accept'}
                                                                </button>
                                                                <button className="flex-1 bg-red-50 text-red-600 text-xs py-1.5 rounded font-medium hover:bg-red-100">
                                                                    {locale === 'ar' ? 'رفض' : 'Reject'}
                                                                </button>
                                                                <button className="flex-1 bg-gray-100 text-gray-600 text-xs py-1.5 rounded font-medium hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
                                                                    {locale === 'ar' ? 'التفاصيل' : 'Details'}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-900/50">
                                                    <p className="text-xs text-blue-800 dark:text-blue-300 text-center">
                                                        {locale === 'ar' ? 'يرجى مراجعة العروض واختيار الأنسب للبدء.' : 'Please review offers and accept one to start the job.'}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Bottom Navigation */}
                                <div className="h-16 bg-white dark:bg-gray-900 border-t dark:border-gray-800 flex justify-around items-center px-6 shrink-0 z-40 pb-2">
                                    <div className="flex flex-col items-center gap-1">
                                        <HomeIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center text-white -mt-5 shadow-lg">
                                            <Plus className="h-5 w-5" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
