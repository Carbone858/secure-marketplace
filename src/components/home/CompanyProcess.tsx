'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from 'next-intl';
import {
    Building2,
    Search,
    Send,
    LayoutDashboard,
    TrendingUp,
    CheckCircle2,
    MapPin,
    Clock,
    Briefcase,
    Upload,
    User,
    MessageSquare,
    Bell,
    Star as StarIcon,
    Filter,
    DollarSign,
    ChevronRight,
    ChevronLeft,
    Mail,
    Lock,
    Globe,
    Phone,
    Menu,
    MousePointer2,
    X,
    Plus,
    ArrowLeft,
    ArrowRight,
    RotateCw,
    MoreVertical,
    Minus,
    Maximize2,
    Wifi,
    Volume2,
    Battery,
    Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CompanyProcess() {
    const locale = useLocale();
    const [activeStep, setActiveStep] = useState(0);

    const steps = [
        {
            id: 0,
            titleEn: "1. Create Company Account",
            titleAr: "1. إنشاء حساب شركة",
            descEn: "Add company information, services, cities, working hours, and portfolio.",
            descAr: "إضافة معلومات الشركة، الخدمات، المدن، ساعات العمل، ومعرض الأعمال.",
            icon: Building2
        },
        {
            id: 1,
            titleEn: "2. Browse Projects",
            titleAr: "2. تصفح المشاريع",
            descEn: "View suitable projects and filter by category, city, service, and budget.",
            descAr: "مشاهدة المشاريع المناسبة وتصفيتها حسب الفئة، المدينة، الخدمة، والميزانية.",
            icon: Search
        },
        {
            id: 2,
            titleEn: "3. Submit Offers",
            titleAr: "3. تقديم العروض",
            descEn: "Send quotes to clients, track responses, and edit offers when needed.",
            descAr: "إرسال عروض الأسعار للعملاء، متابعة الردود، وتعديل العروض عند الحاجة.",
            icon: Send
        },
        {
            id: 3,
            titleEn: "4. Manage Work",
            titleAr: "4. إدارة العمل",
            descEn: "Track accepted projects, communicate with clients, and upload files.",
            descAr: "متابعة المشاريع المقبولة، التواصل مع العملاء، ورفع الملفات.",
            icon: LayoutDashboard
        },
        {
            id: 4,
            titleEn: "5. Increase Visibility",
            titleAr: "5. زيادة الظهور (اختياري)",
            descEn: "Upgrade to appear in the directory and get more opportunities (Optional).",
            descAr: "ترقية الحساب للظهور في الدليل والحصول على فرص أكثر (اختياري).",
            icon: TrendingUp
        }
    ];

    // Auto-play
    useEffect(() => {
        const timer = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % steps.length);
        }, 5500); // Optimized for scroll + click + quick transition
        return () => clearInterval(timer);
    }, [activeStep]);

    return (
        <section className="py-24 bg-gray-50 dark:bg-gray-950 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">
                        {locale === 'ar' ? 'كيف تستفيد الشركات من المنصة؟' : 'How Companies Benefit from the Platform'}
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        {locale === 'ar'
                            ? 'نظام متكامل لإدارة أعمالك وتوسيع نطاق خدماتك'
                            : 'Integrated system to manage your business and expand your services'}
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">

                    {/* LEFT: Steps List */}
                    <div className="w-full lg:w-1/3 space-y-4">
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                onClick={() => setActiveStep(index)}
                                className={cn(
                                    "cursor-pointer p-4 rounded-xl transition-all duration-300 border-l-4 relative overflow-hidden group hover:bg-white dark:hover:bg-gray-900",
                                    activeStep === index
                                        ? "bg-white dark:bg-gray-900 shadow-lg border-primary translate-x-2"
                                        : "border-transparent opacity-60 hover:opacity-100"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "h-10 w-10 rounded-full flex items-center justify-center shrink-0 transition-colors",
                                        activeStep === index ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-800 text-gray-500"
                                    )}>
                                        <step.icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className={cn("font-bold text-sm", activeStep === index ? "text-primary" : "text-gray-700 dark:text-gray-300")}>
                                            {locale === 'ar' ? step.titleAr : step.titleEn}
                                        </h3>
                                        {activeStep === index && (
                                            <motion.p
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                className="text-xs text-muted-foreground mt-1"
                                            >
                                                {locale === 'ar' ? step.descAr : step.descEn}
                                            </motion.p>
                                        )}
                                    </div>
                                </div>
                                {/* Progress Line */}
                                {activeStep === index && (
                                    <motion.div
                                        layoutId="progressLine"
                                        className="absolute bottom-0 left-0 h-0.5 bg-primary w-full"
                                        initial={{ scaleX: 0, originX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ duration: 6, ease: "linear" }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* RIGHT: Laptop Mockup */}
                    <div className="w-full lg:w-2/3 perspective-1000">
                        <motion.div
                            className="relative mx-auto w-full max-w-3xl"
                            initial={{ rotateX: 5 }}
                            whileHover={{ rotateX: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Laptop Lid Frame */}
                            <div className="relative bg-[#1a1a1a] rounded-t-2xl p-[14px] pb-[4px] shadow-2xl ring-1 ring-white/10 aspect-[16/10] flex flex-col">
                                {/* Camera */}
                                <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#0d0d0d] rounded-full z-20 flex items-center justify-center ring-1 ring-white/5">
                                    <div className="w-[40%] h-[40%] bg-[#3a3a3a] rounded-full"></div>
                                </div>

                                {/* Screen Content Wrapper */}
                                <div className="bg-white dark:bg-gray-950 w-full h-full rounded-sm overflow-hidden flex flex-col font-sans select-none border-[0.5px] border-black/20 relative">

                                    {/* BROWSER CHROME */}
                                    <div className="bg-[#dee1e6] dark:bg-[#202124] flex flex-col shrink-0">
                                        {/* Tabs Bar */}
                                        <div className="flex items-end px-2 pt-2 gap-1 h-9">
                                            <div className="bg-white dark:bg-[#323639] rounded-t-lg px-3 py-1.5 text-xs flex items-center gap-2 shadow-sm min-w-[140px] max-w-[200px] border-b-0 relative z-10">
                                                <div className="h-3 w-3 rounded-full bg-primary/20 flex items-center justify-center text-[8px] font-bold text-primary">S</div>
                                                <span className="truncate flex-1 dark:text-gray-200">{locale === 'ar' ? 'إنشاء حساب' : 'Register Company'}</span>
                                                <X className="h-3 w-3 text-gray-400 hover:bg-gray-200 rounded-full p-0.5" />
                                            </div>
                                            <div className="px-3 py-1.5 text-xs text-gray-500 hover:bg-black/5 rounded-t-lg flex items-center gap-2">
                                                Dashboard
                                            </div>
                                            <Plus className="h-4 w-4 text-gray-500 ml-1" />
                                        </div>
                                        {/* URL Bar */}
                                        <div className="bg-white dark:bg-[#323639] border-b dark:border-gray-700 p-1.5 flex items-center gap-2">
                                            <div className="flex gap-2 text-gray-400 px-1">
                                                <ArrowLeft className="h-4 w-4" />
                                                <ArrowRight className="h-4 w-4" />
                                                <RotateCw className="h-3.5 w-3.5" />
                                            </div>
                                            <div className="bg-[#f1f3f4] dark:bg-[#202124] rounded-full px-3 py-1 text-xs text-gray-600 dark:text-gray-300 flex-1 flex items-center gap-2 border dark:border-transparent">
                                                <Lock className="h-3 w-3 text-green-600" />
                                                <span className="text-green-600">secure</span>
                                                <span>-marketplace.com/{activeStep === 0 ? 'register' : activeStep === 1 ? 'projects' : 'dashboard'}</span>
                                            </div>
                                            <div className="flex gap-2 text-gray-400 px-1">
                                                <MoreVertical className="h-4 w-4" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* WEBSITE HEADER (Persistent) */}
                                    <div className="h-12 bg-white dark:bg-[#111] border-b dark:border-gray-800 flex items-center px-6 justify-between shrink-0 shadow-sm z-30 relative">
                                        <div className="flex items-center gap-6">
                                            <div className="text-lg font-bold text-primary">{locale === 'ar' ? 'موقعنا' : 'OurSite'}</div>
                                            <div className="hidden sm:flex gap-4 text-xs font-medium text-gray-500 dark:text-gray-400">
                                                <span className="text-gray-900 dark:text-gray-200 border-b-2 border-primary">{locale === 'ar' ? 'البحث عن مشاريع' : 'Find Projects'}</span>
                                                <span>{locale === 'ar' ? 'المراسلات' : 'Messages'}</span>
                                                <span>{locale === 'ar' ? 'ملفي' : 'My Profile'}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Bell className="h-4 w-4 text-gray-400" />
                                            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-800 rounded-full border border-gray-300 dark:border-gray-700"></div>
                                        </div>
                                    </div>

                                    {/* MAIN VIEWPORT */}
                                    <div className="flex-1 bg-gray-50 dark:bg-[#0a0a0a] relative overflow-y-auto no-scrollbar">
                                        <AnimatePresence mode="wait">

                                            {/* Step 1: Detailed Registration Form (Animated Scroll) */}
                                            {activeStep === 0 && (
                                                <motion.div
                                                    key="step1"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="h-full flex flex-col bg-white dark:bg-[#111]"
                                                >
                                                    {/* Scrollable Content Area */}
                                                    <div className="flex-1 overflow-hidden relative">
                                                        <motion.div
                                                            className="p-6 pb-4"
                                                            animate={{ y: [0, 0, -120] }} // Scroll just enough to show fields
                                                            transition={{
                                                                duration: 2,
                                                                times: [0, 0.2, 1],
                                                                ease: "easeInOut",
                                                                delay: 1
                                                            }}
                                                        >
                                                            <h3 className="text-lg font-bold mb-4 border-b pb-2 dark:text-white">{locale === 'ar' ? 'إنشاء حساب شركة جديد' : 'Create New Company Account'}</h3>

                                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                                <div className="space-y-1">
                                                                    <label className="text-[10px] font-bold text-gray-600 dark:text-gray-400">{locale === 'ar' ? 'اسم الشركة' : 'Company Name'} *</label>
                                                                    <div className="h-8 border dark:border-gray-700 rounded px-2 flex items-center bg-gray-50 dark:bg-gray-800 text-xs dark:text-white">
                                                                        Elite Construction Co.
                                                                        <motion.span
                                                                            initial={{ opacity: 0 }}
                                                                            animate={{ opacity: [0, 1, 0] }}
                                                                            transition={{ repeat: Infinity, duration: 0.8 }}
                                                                            className="inline-block w-0.5 h-3 bg-primary ml-0.5"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <label className="text-[10px] font-bold text-gray-600 dark:text-gray-400">{locale === 'ar' ? 'مجال العمل' : 'Industry'} *</label>
                                                                    <div className="h-8 border dark:border-gray-700 rounded px-2 flex items-center justify-between bg-white dark:bg-gray-800 text-xs dark:text-gray-300">
                                                                        Construction & Renovation
                                                                        <ChevronRight className="h-3 w-3 rotate-90 text-gray-400" />
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <label className="text-[10px] font-bold text-gray-600 dark:text-gray-400">{locale === 'ar' ? 'البريد الإلكتروني' : 'Work Email'} *</label>
                                                                    <div className="h-8 border dark:border-gray-700 rounded px-2 flex items-center bg-white dark:bg-gray-800 text-xs dark:text-gray-300">
                                                                        contact@elite-const.com
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <label className="text-[10px] font-bold text-gray-600 dark:text-gray-400">{locale === 'ar' ? 'رقم الهاتف' : 'Phone'} *</label>
                                                                    <div className="h-8 border dark:border-gray-700 rounded px-2 flex items-center bg-white dark:bg-gray-800 text-xs dark:text-gray-300">
                                                                        +963 912 345 678
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <label className="text-[10px] font-bold text-gray-600 dark:text-gray-400">{locale === 'ar' ? 'المدينة' : 'City'} *</label>
                                                                    <div className="h-8 border dark:border-gray-700 rounded px-2 flex items-center bg-white dark:bg-gray-800 text-xs dark:text-gray-300">
                                                                        Damascus
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <label className="text-[10px] font-bold text-gray-600 dark:text-gray-400">{locale === 'ar' ? 'العنوان' : 'Address'}</label>
                                                                    <div className="h-8 border dark:border-gray-700 rounded px-2 flex items-center bg-white dark:bg-gray-800 text-xs dark:text-gray-300">
                                                                        Malki St, Building 4
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="space-y-1 mb-4">
                                                                <label className="text-[10px] font-bold text-gray-600 dark:text-gray-400">{locale === 'ar' ? 'وصف الشركة' : 'Description'}</label>
                                                                <div className="h-20 border dark:border-gray-700 rounded p-2 bg-white dark:bg-gray-800 text-xs text-gray-500 leading-relaxed">
                                                                    Specializing in residential and commercial renovation projects with over 10 years of experience...
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-2">
                                                                <div className="h-3 w-3 border rounded bg-primary border-primary flex items-center justify-center">
                                                                    <CheckCircle2 className="h-2.5 w-2.5 text-white" />
                                                                </div>
                                                                <span className="text-[10px] text-gray-600 dark:text-gray-400">I agree to the <span className="text-primary underline">Terms</span></span>
                                                            </div>
                                                        </motion.div>
                                                    </div>

                                                    {/* Sticky Footer */}
                                                    <div className="p-4 border-t dark:border-gray-800 bg-white dark:bg-[#111] z-10 shrink-0">
                                                        <motion.button
                                                            className="w-full bg-primary text-white py-3 rounded-lg shadow-lg shadow-primary/20 flex items-center justify-center gap-2 text-xs font-bold relative overflow-hidden"
                                                            initial={{ scale: 1, backgroundColor: "#2563eb" }} // Start as Primary Blue
                                                            animate={{
                                                                scale: [1, 0.95, 1],
                                                                backgroundColor: ["#2563eb", "#1e40af", "#2563eb"] // Press to Dark Blue
                                                            }}
                                                            transition={{
                                                                duration: 0.3,
                                                                delay: 4 // Match cursor arrival
                                                            }}
                                                        >
                                                            <motion.span
                                                                initial={{ opacity: 1 }}
                                                                animate={{ opacity: 0 }}
                                                                transition={{ duration: 0.2, delay: 4.5 }} // Fade out text later
                                                            >
                                                                {locale === 'ar' ? 'إكمال التسجيل' : 'Create Account'}
                                                            </motion.span>

                                                            {/* Simulated Loading Spinner after click */}
                                                            <motion.div
                                                                className="absolute inset-0 flex items-center justify-center"
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                transition={{ duration: 0.2, delay: 4.5 }}
                                                            >
                                                                <Loader2 className="h-4 w-4 animate-spin text-white" />
                                                            </motion.div>

                                                            {/* Click Ripple on Button */}
                                                            <motion.div
                                                                className="absolute inset-0 bg-white"
                                                                initial={{ opacity: 0, scale: 0 }}
                                                                animate={{ opacity: [0.3, 0], scale: [0, 2] }}
                                                                transition={{ duration: 0.5, delay: 4 }}
                                                            />
                                                        </motion.button>
                                                    </div>
                                                    {/* Cursor Animation */}
                                                    <motion.div
                                                        initial={{ top: "80%", left: "90%" }}
                                                        animate={{
                                                            top: "92%", left: "80%", // Target sticky footer button
                                                            transition: { duration: 1, ease: "easeInOut", delay: 3 }
                                                        }}
                                                        className="absolute z-50 pointer-events-none"
                                                    >
                                                        <MousePointer2 className="h-6 w-6 text-black dark:text-white drop-shadow-md fill-current" />
                                                        <motion.div
                                                            className="absolute -top-2 -left-2 w-10 h-10 bg-white/30 rounded-full"
                                                            initial={{ scale: 0, opacity: 0 }}
                                                            animate={{ scale: [0, 1.5], opacity: [0.5, 0] }}
                                                            transition={{ delay: 4, duration: 0.5 }} // Click
                                                        />
                                                    </motion.div>
                                                </motion.div>
                                            )}
                                            {/* Step 2: Detailed Browse */}
                                            {activeStep === 1 && (
                                                <motion.div key="step2" className="h-full flex flex-col p-6 relative" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                                    <div className="flex gap-4 mb-6">
                                                        <div className="w-1/4 space-y-4">
                                                            <div className="bg-white dark:bg-[#111] p-4 rounded-xl border dark:border-gray-800 shadow-sm">
                                                                <h4 className="font-bold text-sm mb-3 dark:text-white">Filters</h4>
                                                                <div className="space-y-2">
                                                                    <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded w-3/4"></div>
                                                                    <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded w-1/2"></div>
                                                                    <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded w-2/3"></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 space-y-4">
                                                            {[1, 2, 3].map((i) => (
                                                                <div key={i} className="bg-white dark:bg-[#111] p-5 rounded-xl border dark:border-gray-800 shadow-sm hover:border-primary/50 transition-colors cursor-pointer group relative">
                                                                    <div className="flex justify-between items-start mb-2">
                                                                        <div>
                                                                            <h4 className="font-bold text-base dark:text-white text-primary group-hover:underline">
                                                                                {i === 1 ? 'Modern Villa Interior Design' : i === 2 ? 'Office Complex Cleaning Contract' : 'Plumbing System Overhaul'}
                                                                            </h4>
                                                                            <div className="text-xs text-gray-500 mt-1">Posted 2 hours ago • Damascus, Syria</div>
                                                                        </div>
                                                                        <span className="font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded text-xs border border-green-100 dark:border-green-900">
                                                                            $1,500 - $3,000
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                                                                        We are looking for an experienced interior design firm to handle the renovation of a 500sqm villa. Scope includes 3D rendering, material selection...
                                                                    </p>
                                                                    <div className="flex gap-2">
                                                                        <span className="text-[10px] bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-500">Interior Design</span>
                                                                        <span className="text-[10px] bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-500">3D Rendering</span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Cursor */}
                                                    <motion.div
                                                        initial={{ top: "90%", left: "90%" }}
                                                        animate={{
                                                            top: "20%", left: "50%",
                                                            transition: { duration: 1.5, ease: "easeInOut", delay: 0.5 }
                                                        }}
                                                        className="absolute z-50 pointer-events-none"
                                                    >
                                                        <MousePointer2 className="h-6 w-6 text-black dark:text-white drop-shadow-md fill-current" />
                                                        <motion.div
                                                            className="absolute -top-2 -left-2 w-10 h-10 bg-white/30 rounded-full"
                                                            initial={{ scale: 0, opacity: 0 }}
                                                            animate={{ scale: [0, 1.5], opacity: [0.5, 0] }}
                                                            transition={{ delay: 2, duration: 0.5 }} // Click
                                                        />
                                                    </motion.div>
                                                </motion.div>
                                            )}

                                            {/* Step 3: Detailed Offer */}
                                            {activeStep === 2 && (
                                                <motion.div key="step3" className="h-full flex flex-col justify-center items-center p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                                    <div className="w-full max-w-2xl bg-white dark:bg-[#111] rounded-xl shadow-lg border dark:border-gray-800 overflow-hidden">
                                                        <div className="bg-gray-50 dark:bg-gray-900 p-4 border-b dark:border-gray-800 flex justify-between items-center">
                                                            <h3 className="font-bold text-sm dark:text-white">Submit Proposal: Modern Villa Interior Design</h3>
                                                            <X className="h-4 w-4 text-gray-400" />
                                                        </div>
                                                        <div className="p-6">
                                                            <div className="flex gap-6 mb-6">
                                                                <div className="flex-1 space-y-1.5">
                                                                    <label className="text-xs font-bold text-gray-500 uppercase">Fixed Price ($)</label>
                                                                    <div className="h-10 border dark:border-gray-700 rounded-lg flex items-center px-3 bg-white dark:bg-black font-mono font-bold dark:text-white">
                                                                        2,400.00
                                                                    </div>
                                                                </div>
                                                                <div className="flex-1 space-y-1.5">
                                                                    <label className="text-xs font-bold text-gray-500 uppercase">Estimated Duration</label>
                                                                    <div className="h-10 border dark:border-gray-700 rounded-lg flex items-center px-3 bg-white dark:bg-black dark:text-white justify-between">
                                                                        3 Weeks
                                                                        <ChevronRight className="h-4 w-4 rotate-90 text-gray-400" />
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="space-y-1.5 mb-6">
                                                                <label className="text-xs font-bold text-gray-500 uppercase">Cover Letter</label>
                                                                <div className="h-32 border dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-black text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-serif">
                                                                    Dear Client,<br /><br />
                                                                    We are thrilled to submit our proposal for your villa renovation. Our team has extensive experience in modern luxury interiors...
                                                                    <span className="inline-block w-0.5 h-4 bg-primary ml-0.5 animate-pulse align-middle"></span>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center justify-between border-t dark:border-gray-800 pt-4">
                                                                <div className="flex items-center gap-2 text-primary font-bold text-xs cursor-pointer hover:underline">
                                                                    <Upload className="h-4 w-4" /> Attach Portfolio
                                                                </div>
                                                                <div className="flex gap-3">
                                                                    <button className="px-4 py-2 border rounded-lg text-sm font-bold text-gray-500">Cancel</button>
                                                                    <button className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-md">Submit Proposal</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {/* Step 4: Manage (Chat) */}
                                            {activeStep === 3 && (
                                                <motion.div key="step4" className="h-full flex gap-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                                    {/* Standard Chat UI - Keeping previous clean design but fuller */}
                                                    <div className="w-1/3 border-r dark:border-gray-800 bg-white dark:bg-[#111]">
                                                        <div className="p-4 border-b dark:border-gray-800">
                                                            <div className="relative">
                                                                <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-gray-400" />
                                                                <div className="h-9 bg-gray-100 dark:bg-gray-800 rounded-lg w-full pl-9 flex items-center text-xs text-gray-500">Search messages...</div>
                                                            </div>
                                                        </div>
                                                        {[1, 2, 3].map(i => (
                                                            <div key={i} className={cn("p-4 border-b dark:border-gray-800 flex gap-3 cursor-pointer hover:bg-gray-50", i === 1 && "bg-blue-50 dark:bg-blue-900/10 border-l-4 border-l-primary")}>
                                                                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                                                                <div className="flex-1 overflow-hidden">
                                                                    <div className="flex justify-between mb-1">
                                                                        <span className="font-bold text-sm dark:text-white">Ahmed Hassan</span>
                                                                        <span className="text-[10px] text-gray-400">10:23 AM</span>
                                                                    </div>
                                                                    <div className="text-xs text-gray-500 truncate">Here are the updated blueprints you asked for.</div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="flex-1 flex flex-col bg-gray-50 dark:bg-[#0a0a0a]">
                                                        <div className="h-14 bg-white dark:bg-[#111] border-b dark:border-gray-800 flex items-center justify-between px-4">
                                                            <div className="font-bold dark:text-white">Ahmed Hassan</div>
                                                            <MoreVertical className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                        <div className="flex-1 p-4 overflow-y-auto space-y-4">
                                                            <div className="flex justify-end">
                                                                <div className="bg-primary text-white p-3 rounded-xl rounded-tr-sm text-sm shadow-sm max-w-[80%]">
                                                                    Hello, here is the initial draft.
                                                                </div>
                                                            </div>
                                                            <div className="flex justify-start">
                                                                <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-3 rounded-xl rounded-tl-sm text-sm shadow-sm max-w-[80%] border dark:border-gray-700">
                                                                    Looking good! Can you send the CAD file?
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="p-3 bg-white dark:bg-[#111] border-t dark:border-gray-800">
                                                            <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center px-4 text-sm text-gray-400">Type a message...</div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {/* Step 5: Visibility (Directory) */}
                                            {activeStep === 4 && (
                                                <motion.div key="step5" className="h-full flex flex-col p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                                    <h3 className="font-bold text-xl mb-6 dark:text-white">Top Rated Companies</h3>
                                                    <div className="space-y-4">
                                                        <motion.div
                                                            initial={{ y: 20, opacity: 0 }}
                                                            animate={{ y: 0, opacity: 1 }}
                                                            className="bg-white dark:bg-[#111] p-5 rounded-xl border-2 border-yellow-400 shadow-md relative group hover:shadow-xl transition-shadow"
                                                        >
                                                            <div className="absolute -top-3 right-4 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                                                                <StarIcon className="h-3 w-3 fill-black" /> FEATURED
                                                            </div>
                                                            <div className="flex items-start gap-4">
                                                                <div className="h-16 w-16 bg-black rounded-xl border border-gray-100 flex items-center justify-center">
                                                                    <Building2 className="h-8 w-8 text-white" />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="flex justify-between items-start">
                                                                        <h4 className="font-bold text-lg dark:text-white hover:text-primary cursor-pointer">Elite Construction Co.</h4>
                                                                        <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm">
                                                                            5.0 <StarIcon className="h-4 w-4 fill-current" /> (124)
                                                                        </div>
                                                                    </div>
                                                                    <p className="text-sm text-gray-500 mb-2">Damascus, SY • General Contractor</p>
                                                                    <div className="flex gap-2">
                                                                        <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-600 dark:text-gray-300">Renovation</span>
                                                                        <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-600 dark:text-gray-300">Commercial</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </motion.div>

                                                        {[1, 2].map(i => (
                                                            <div key={i} className="bg-white dark:bg-[#111] p-4 rounded-xl border dark:border-gray-800 opacity-60 flex gap-4 items-start grayscale">
                                                                <div className="h-14 w-14 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                                                                <div className="flex-1 space-y-2">
                                                                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
                                                                    <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/4"></div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}

                                        </AnimatePresence>
                                    </div>

                                    {/* WINDOWS TASKBAR (Fixed Bottom) */}
                                    <div className="h-10 bg-[#f3f3f3] dark:bg-[#1a1a1a]/95 backdrop-blur border-t dark:border-white/5 flex items-center justify-between px-3 shrink-0 z-50">
                                        <div className="flex items-center gap-1">
                                            <div className="h-7 w-7 flex items-center justify-center hover:bg-white/50 rounded p-1 transition-colors group cursor-pointer">
                                                <div className="grid grid-cols-2 gap-0.5">
                                                    <div className="w-2.5 h-2.5 bg-[#00adef]"></div>
                                                    <div className="w-2.5 h-2.5 bg-[#00adef]"></div>
                                                    <div className="w-2.5 h-2.5 bg-[#00adef]"></div>
                                                    <div className="w-2.5 h-2.5 bg-[#00adef]"></div>
                                                </div>
                                            </div>
                                            <div className="h-7 w-48 bg-white dark:bg-[#333] border dark:border-gray-600 rounded-sm ml-2 flex items-center px-2 shadow-sm opacity-80">
                                                <Search className="h-3.5 w-3.5 text-gray-400 mr-2" />
                                                <span className="text-xs text-gray-400">Search</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
                                            <div className="h-8 w-8 hover:bg-white/50 rounded p-1.5 cursor-pointer border-b-2 border-blue-500 bg-white/20"><Globe className="h-full w-full text-blue-600" /></div>
                                            <div className="h-8 w-8 hover:bg-white/50 rounded p-1.5 cursor-pointer opacity-70"><div className="h-full w-full bg-yellow-500 rounded-sm"></div></div>
                                            <div className="h-8 w-8 hover:bg-white/50 rounded p-1.5 cursor-pointer opacity-70"><div className="h-full w-full bg-gray-700 rounded-sm"></div></div>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                                            <div className="flex gap-1.5">
                                                <Wifi className="h-4 w-4" />
                                                <Volume2 className="h-4 w-4" />
                                                <Battery className="h-4 w-4" />
                                            </div>
                                            <div className="text-right leading-tight">
                                                <div>11:42 AM</div>
                                                <div className="text-[10px]">10/24/2026</div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* Laptop Base (Realistic) */}
                            <div className="relative mx-auto w-[110%]">
                                <div className="h-3 sm:h-4 bg-gradient-to-b from-[#e6e6e6] to-[#d4d4d4] dark:from-[#2a2a2a] dark:to-[#1a1a1a] rounded-t-sm shadow-inner relative z-10"></div>
                                <div className="h-2 sm:h-3 bg-[#c8c8c8] dark:bg-[#111] rounded-b-xl shadow-[0_15px_30px_-10px_rgba(0,0,0,0.4)] relative z-0 mx-2"></div>
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1.5 bg-[#dcdcdc] dark:bg-[#333] rounded-b-md z-20 shadow-inner"></div>
                            </div>

                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
