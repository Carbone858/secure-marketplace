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

    const content = {
        en: {
            title: "How Companies Benefit from the Platform",
            subtitle: "Integrated system to manage your business and expand your services",
            steps: [
                { id: 0, title: "1. Create Company Account", desc: "Add company information, services, cities, working hours, and portfolio.", icon: Building2 },
                { id: 1, title: "2. Browse Projects", desc: "View suitable projects and filter by category, city, service, and budget.", icon: Search },
                { id: 2, title: "3. Submit Offers", desc: "Send quotes to clients, track responses, and edit offers when needed.", icon: Send },
                { id: 3, title: "4. Manage Work", desc: "Track accepted projects, communicate with clients, and upload files.", icon: LayoutDashboard },
                { id: 4, title: "5. Increase Visibility", desc: "Upgrade to appear in the directory and get more opportunities (Optional).", icon: TrendingUp }
            ],
            browser: {
                tab: "Register Company",
                address: "register",
                nav: ["Find Projects", "Messages", "My Profile"],
                siteName: "OurSite"
            },
            step1: {
                header: "Create New Company Account",
                fields: {
                    name: "Company Name",
                    nameVal: "Elite Construction Co.",
                    industry: "Industry",
                    industryVal: "Construction & Renovation",
                    email: "Work Email",
                    phone: "Phone",
                    city: "City",
                    cityVal: "Damascus",
                    address: "Address",
                    addressVal: "Malki St, Building 4",
                    desc: "Description",
                    descVal: "Specializing in residential and commercial renovation projects with over 10 years of experience...",
                    terms: "I agree to the Terms"
                },
                btn: "Create Account"
            },
            step2: {
                filters: { cat: "Categories", budget: "Budget" },
                cats: ["Design & Creative", "Construction", "Maintenance", "Cleaning"],
                header: "Recommended Projects",
                sort: "Newest",
                cards: [
                    { title: "Modern Villa Interior Renovation", badge: "New", time: "Posted 2h ago", verified: "Verified Client", price: "2,500 - 4,000", desc: "We are urgently looking for a specialized construction firm for a full interior renovation...", tags: ["Renovation", "Interior", "Construction"] },
                    { title: "Commercial Complex Cleaning", badge: "", time: "Posted 4h ago", verified: "Verified Client", price: "500 - 1,200", desc: "Looking for a cleaning company for a monthly contract...", tags: ["Cleaning", "Maintenance"] },
                    { title: "Plumbing System Overhaul", badge: "", time: "Posted 5h ago", verified: "New Client", price: "300 - 900", desc: "Complete overhaul of water system in residential building...", tags: ["Plumbing", "Maintenance"] }
                ]
            },
            step3: {
                header: "Submit Proposal: Modern Villa Renovation",
                price: "Fixed Price ($)",
                duration: "Duration",
                durationVal: "3 Weeks",
                cover: "Cover Letter",
                coverVal: "Dear Client, \nWe are excited to bid on your villa project. Our team specializes in modern luxury renovations with similar scope...",
                words: "145 words",
                attach: "Attach Portfolio.pdf",
                cancel: "Cancel",
                send: "Send Offer"
            },
            step4: {
                sidebarTitle: "Active Projects",
                projects: [
                    { title: "Modern Villa Renovation", client: "Client: Ahmad S.", status: "In Progress" },
                    { title: "Office Cleaning Contract", client: "Client: Tech Corp", status: "Pending" }
                ],
                chatHeader: { name: "Ahmad S.", status: "Online" },
                msg1: "Hi team! We approved the proposal. When can simulating start?",
                msg2: "Great! We can start strictly next Monday. I sent the contract.",
                input: "Great! We can start strictly ne...",
                send: "Send"
            },
            step5: {
                search: "Renovation Companies",
                filters: ["Top Rated", "Verified", "Near Me"],
                card: {
                    featured: "FEATURED",
                    name: "Elite Constructions",
                    reviews: "(48 Reviews)",
                    tags: ["Residential", "Commercial"],
                    loc: "Damascus, Syria",
                    btn: "View Profile",
                    verified: "VERIFIED"
                }
            }
        },
        ar: {
            title: "كيف تستفيد الشركات من المنصة؟",
            subtitle: "نظام متكامل لإدارة أعمالك وتوسيع نطاق خدماتك",
            steps: [
                { id: 0, title: "1. إنشاء حساب شركة", desc: "إضافة معلومات الشركة، الخدمات، المدن، ساعات العمل، ومعرض الأعمال.", icon: Building2 },
                { id: 1, title: "2. تصفح المشاريع", desc: "مشاهدة المشاريع المناسبة وتصفيتها حسب الفئة، المدينة، الخدمة، والميزانية.", icon: Search },
                { id: 2, title: "3. تقديم العروض", desc: "إرسال عروض الأسعار للعملاء، متابعة الردود، وتعديل العروض عند الحاجة.", icon: Send },
                { id: 3, title: "4. إدارة العمل", desc: "متابعة المشاريع المقبولة، التواصل مع العملاء، ورفع الملفات.", icon: LayoutDashboard },
                { id: 4, title: "5. زيادة الظهور (اختياري)", desc: "ترقية الحساب للظهور في الدليل والحصول على فرص أكثر (اختياري).", icon: TrendingUp }
            ],
            browser: {
                tab: "إنشاء حساب",
                address: "تسجيل",
                nav: ["البحث عن مشاريع", "المراسلات", "ملفي"],
                siteName: "موقعنا"
            },
            step1: {
                header: "إنشاء حساب شركة جديد",
                fields: {
                    name: "اسم الشركة",
                    nameVal: "شركة النخبة للمقاولات",
                    industry: "مجال العمل",
                    industryVal: "بناء وتجديد",
                    email: "البريد الإلكتروني",
                    phone: "رقم الهاتف",
                    city: "المدينة",
                    cityVal: "دمشق",
                    address: "العنوان",
                    addressVal: "شارع المالكي، بناء 4",
                    desc: "وصف الشركة",
                    descVal: "متخصصون في مشاريع التجديد السكنية والتجارية مع خبرة تفوق 10 سنوات...",
                    terms: "أوافق على الشروط والأحكام"
                },
                btn: "إكمال التسجيل"
            },
            step2: {
                filters: { cat: "التصنيفات", budget: "الميزانية" },
                cats: ["تصميم وإبداع", "مباني", "صيانة", "تنظيف"],
                header: "مشاريع مقترحة",
                sort: "الأحدث",
                cards: [
                    { title: "تجديد داخلي لفيلا مودرن", badge: "جديد", time: "منذ ساعتين", verified: "عميل موثوق", price: "2,500 - 4,000", desc: "نبحث بشكل عاجل عن شركة مقاولات متخصصة لتجديد داخلي كامل...", tags: ["تجديد", "ديكور", "بناء"] },
                    { title: "تنظيف مجمع تجاري", badge: "", time: "منذ 4 ساعات", verified: "عميل موثوق", price: "500 - 1,200", desc: "مطلوب شركة تنظيف بعقود شهرية لمجمع مكاتب...", tags: ["تنظيف", "صيانة"] },
                    { title: "صيانة شبكة سباكة", badge: "", time: "منذ 5 ساعات", verified: "عميل جديد", price: "300 - 900", desc: "إصلاح شامل لشبكة المياه في مبنى سكني...", tags: ["سباكة", "صيانة"] }
                ]
            },
            step3: {
                header: "تقديم عرض: تجديد فيلا مودرن",
                price: "سعر ثابت ($)",
                duration: "المدة",
                durationVal: "3 أسابيع",
                cover: "خطاب التغطية",
                coverVal: "عزيزي العميل، \nنحن متحمسون لتقديم عرضنا لمشروع الفيلا الخاص بك. فريقنا متخصص في التجديدات الفاخرة...",
                words: "145 كلمة",
                attach: "إرفاق معرض أعمال.pdf",
                cancel: "إلغاء",
                send: "إرسال العرض"
            },
            step4: {
                sidebarTitle: "المشاريع النشطة",
                projects: [
                    { title: "تجديد فيلا مودرن", client: "العميل: أحمد س.", status: "قيد التنفيذ" },
                    { title: "عقد تنظيف مكاتب", client: "العميل: شركة التقنية", status: "معلق" },
                ],
                chatHeader: { name: "أحمد س.", status: "متصل" },
                msg1: "مرحباً يا فريق! وافقنا على العرض. متى يمكن البدء؟",
                msg2: "ممتاز! يمكننا البدء يوم الاثنين القادم. لقد أرسلت العقد.",
                input: "ممتاز! يمكننا البدء يوم الاثنين...",
                send: "إرسال"
            },
            step5: {
                search: "شركات المقاولات",
                filters: ["الأعلى تقييماً", "موثق", "بالقرب مني"],
                card: {
                    featured: "متميز",
                    name: "شركة النخبة للمقاولات",
                    reviews: "(48 تقييم)",
                    tags: ["سكني", "تجاري"],
                    loc: "دمشق، سوريا",
                    btn: "عرض الملف",
                    verified: "موثق"
                }
            }
        }
    };

    const t = content[locale === 'ar' ? 'ar' : 'en'] || content.en;
    const [activeStep, setActiveStep] = useState(0);

    // Auto-play
    useEffect(() => {
        const timer = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % t.steps.length);
        }, 5500);
        return () => clearInterval(timer);
    }, [activeStep, t.steps.length]);

    return (
        <section className="py-24 bg-gray-50 dark:bg-gray-950 overflow-hidden" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">
                        {t.title}
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        {t.subtitle}
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">

                    {/* LEFT: Steps List */}
                    <div className="w-full lg:w-1/3 space-y-4">
                        {t.steps.map((step, index) => (
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
                                    <div className="relative flex items-center justify-center">
                                        {activeStep === index && (
                                            <svg className="absolute -inset-2 w-14 h-14 -rotate-90 pointer-events-none" viewBox="0 0 50 50">
                                                <circle cx="25" cy="25" r="23" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gray-200 dark:text-gray-800" />
                                                <motion.circle
                                                    cx="25"
                                                    cy="25"
                                                    r="23"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2.5"
                                                    strokeLinecap="round"
                                                    className="text-primary"
                                                    initial={{ pathLength: 0 }}
                                                    animate={{ pathLength: 1 }}
                                                    transition={{ duration: 5.5, ease: "linear" }}
                                                />
                                            </svg>
                                        )}
                                        <div className={cn(
                                            "h-10 w-10 rounded-full flex items-center justify-center shrink-0 transition-colors relative z-10",
                                            activeStep === index ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-800 text-gray-500"
                                        )}>
                                            <step.icon className="h-5 w-5" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className={cn("font-bold text-sm", activeStep === index ? "text-primary" : "text-gray-700 dark:text-gray-300")}>
                                            {step.title}
                                        </h3>
                                        {activeStep === index && (
                                            <motion.p
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                className="text-xs text-muted-foreground mt-1"
                                            >
                                                {step.desc}
                                            </motion.p>
                                        )}
                                    </div>
                                </div>
                                {/* Progress Line */}

                            </div>
                        ))}
                    </div>

                    {/* RIGHT: Laptop Mockup */}
                    <div className="w-full lg:w-2/3 perspective-1000">
                        {/* Mobile Scaling Container (Edge-to-Edge) */}
                        <div className="relative w-[calc(100%+2rem)] -mx-4 sm:w-full sm:mx-0 h-[450px] sm:h-auto overflow-hidden sm:overflow-visible">
                            <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[550px] sm:w-full sm:static sm:translate-x-0 origin-top transform scale-[0.7] sm:scale-100 sm:mx-auto">
                                <motion.div
                                    className="relative width-full"
                                    initial={{ rotateX: 5 }}
                                    whileHover={{ rotateX: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {/* Laptop Lid Frame (Metallic Style) */}
                                    <div className="relative bg-gradient-to-b from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 rounded-t-2xl p-[14px] pb-[4px] shadow-2xl ring-1 ring-black/10 dark:ring-white/40 h-[550px] sm:h-auto sm:aspect-[16/10] flex flex-col">
                                        {/* Camera */}
                                        <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-black rounded-full z-20 flex items-center justify-center ring-1 ring-white/10">
                                            <div className="w-[40%] h-[40%] bg-gray-600 rounded-full"></div>
                                        </div>

                                        {/* Screen Content Wrapper */}
                                        <div className="bg-white dark:bg-gray-950 w-full h-full rounded-sm overflow-hidden flex flex-col font-sans select-none border-[0.5px] border-black/20 relative">

                                            {/* BROWSER CHROME */}
                                            <div className="bg-[#dee1e6] dark:bg-[#202124] flex flex-col shrink-0">
                                                {/* Tabs Bar */}
                                                <div className="flex items-end px-2 pt-2 gap-1 h-9">
                                                    <div className="bg-white dark:bg-[#323639] rounded-t-lg px-3 py-1.5 text-xs flex items-center gap-2 shadow-sm min-w-[140px] max-w-[200px] border-b-0 relative z-10">
                                                        <div className="h-3 w-3 rounded-full bg-primary/20 flex items-center justify-center text-[8px] font-bold text-primary">{t.browser.siteName.charAt(0)}</div>
                                                        <span className="truncate flex-1 dark:text-gray-200">{t.browser.tab}</span>
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
                                                        <span>-marketplace.com/{t.browser.address}</span>
                                                    </div>
                                                    <div className="flex gap-2 text-gray-400 px-1">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* WEBSITE HEADER (Persistent) */}
                                            <div className="h-12 bg-white dark:bg-[#111] border-b dark:border-gray-800 flex items-center px-6 justify-between shrink-0 shadow-sm z-30 relative">
                                                <div className="flex items-center gap-6">
                                                    <div className="text-lg font-bold text-primary">{t.browser.siteName}</div>
                                                    <div className="hidden sm:flex gap-4 text-xs font-medium text-gray-500 dark:text-gray-400">
                                                        <span className="text-gray-900 dark:text-gray-200 border-b-2 border-primary">{t.browser.nav[0]}</span>
                                                        <span>{t.browser.nav[1]}</span>
                                                        <span>{t.browser.nav[2]}</span>
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
                                                                    <h3 className="text-lg font-bold mb-4 border-b pb-2 dark:text-white">{t.step1.header}</h3>

                                                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                                                        <div className="space-y-1">
                                                                            <label className="text-[10px] font-bold text-gray-600 dark:text-gray-400">{t.step1.fields.name} *</label>
                                                                            <div className="h-8 border dark:border-gray-700 rounded px-2 flex items-center bg-gray-50 dark:bg-gray-800 text-xs dark:text-white">
                                                                                {t.step1.fields.nameVal}
                                                                                <motion.span
                                                                                    initial={{ opacity: 0 }}
                                                                                    animate={{ opacity: [0, 1, 0] }}
                                                                                    transition={{ repeat: Infinity, duration: 0.8 }}
                                                                                    className="inline-block w-0.5 h-3 bg-primary ml-0.5"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="space-y-1">
                                                                            <label className="text-[10px] font-bold text-gray-600 dark:text-gray-400">{t.step1.fields.industry} *</label>
                                                                            <div className="h-8 border dark:border-gray-700 rounded px-2 flex items-center justify-between bg-white dark:bg-gray-800 text-xs dark:text-gray-300">
                                                                                {t.step1.fields.industryVal}
                                                                                <ChevronRight className="h-3 w-3 rotate-90 text-gray-400" />
                                                                            </div>
                                                                        </div>
                                                                        <div className="space-y-1">
                                                                            <label className="text-[10px] font-bold text-gray-600 dark:text-gray-400">{t.step1.fields.email} *</label>
                                                                            <div className="h-8 border dark:border-gray-700 rounded px-2 flex items-center bg-white dark:bg-gray-800 text-xs dark:text-gray-300">
                                                                                contact@elite-const.com
                                                                            </div>
                                                                        </div>
                                                                        <div className="space-y-1">
                                                                            <label className="text-[10px] font-bold text-gray-600 dark:text-gray-400">{t.step1.fields.phone} *</label>
                                                                            <div className="h-8 border dark:border-gray-700 rounded px-2 flex items-center bg-white dark:bg-gray-800 text-xs dark:text-gray-300">
                                                                                +963 912 345 678
                                                                            </div>
                                                                        </div>
                                                                        <div className="space-y-1">
                                                                            <label className="text-[10px] font-bold text-gray-600 dark:text-gray-400">{t.step1.fields.city} *</label>
                                                                            <div className="h-8 border dark:border-gray-700 rounded px-2 flex items-center bg-white dark:bg-gray-800 text-xs dark:text-gray-300">
                                                                                {t.step1.fields.cityVal}
                                                                            </div>
                                                                        </div>
                                                                        <div className="space-y-1">
                                                                            <label className="text-[10px] font-bold text-gray-600 dark:text-gray-400">{t.step1.fields.address}</label>
                                                                            <div className="h-8 border dark:border-gray-700 rounded px-2 flex items-center bg-white dark:bg-gray-800 text-xs dark:text-gray-300">
                                                                                {t.step1.fields.addressVal}
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="space-y-1 mb-4">
                                                                        <label className="text-[10px] font-bold text-gray-600 dark:text-gray-400">{t.step1.fields.desc}</label>
                                                                        <div className="h-20 border dark:border-gray-700 rounded p-2 bg-white dark:bg-gray-800 text-xs text-gray-500 leading-relaxed">
                                                                            {t.step1.fields.descVal}
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex items-center gap-2">
                                                                        <div className="h-3 w-3 border rounded bg-primary border-primary flex items-center justify-center">
                                                                            <CheckCircle2 className="h-2.5 w-2.5 text-white" />
                                                                        </div>
                                                                        <span className="text-[10px] text-gray-600 dark:text-gray-400">{t.step1.fields.terms}</span>
                                                                    </div>
                                                                </motion.div>
                                                            </div>

                                                            {/* Sticky Footer */}
                                                            <div className="p-4 border-t dark:border-gray-800 bg-white dark:bg-[#111] z-10 shrink-0">
                                                                <motion.button
                                                                    className="w-full bg-primary text-white py-3 rounded-lg shadow-lg shadow-primary/20 flex items-center justify-center gap-2 text-xs font-bold relative overflow-hidden"
                                                                    initial={{ scale: 1 }}
                                                                    animate={{
                                                                        scale: [1, 0.95, 1]
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
                                                                        {t.step1.btn}
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
                                                    {/* Step 2: Realistic Browse Projects */}
                                                    {activeStep === 1 && (
                                                        <motion.div
                                                            key="step2"
                                                            className="h-full flex flex-col relative overflow-hidden bg-gray-50 dark:bg-[#0a0a0a]"
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                        >
                                                            <div className="flex h-full">
                                                                {/* Interactive Sidebar */}
                                                                <div className="w-64 bg-white dark:bg-[#111] border-r dark:border-gray-800 p-4 space-y-6 shrink-0 hidden md:block">
                                                                    <div>
                                                                        <h4 className="font-bold text-xs uppercase text-gray-400 mb-3 tracking-wider">{t.step2.filters.cat}</h4>
                                                                        <div className="space-y-2">
                                                                            {t.step2.cats.map((cat, i) => (
                                                                                <motion.div
                                                                                    key={cat}
                                                                                    className={cn(
                                                                                        "flex items-center gap-2 text-sm p-2 rounded cursor-pointer transition-colors",
                                                                                        i === 1 ? "bg-primary/10 text-primary font-medium" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                                                                                    )}
                                                                                    animate={i === 1 ? { scale: [1, 1.02, 1] } : {}}
                                                                                    transition={{ delay: 1.5, duration: 0.3 }} // Simulate filter click
                                                                                >
                                                                                    <div className={cn("w-4 h-4 rounded border flex items-center justify-center", i === 1 ? "border-primary bg-primary text-white" : "border-gray-300 dark:border-gray-700")}>
                                                                                        {i === 1 && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.5 }}><CheckCircle2 className="h-3 w-3" /></motion.div>}
                                                                                    </div>
                                                                                    {cat}
                                                                                </motion.div>
                                                                            ))}
                                                                        </div>
                                                                    </div>

                                                                    <div>
                                                                        <h4 className="font-bold text-xs uppercase text-gray-400 mb-3 tracking-wider">{t.step2.filters.budget}</h4>
                                                                        <div className="px-1">
                                                                            <div className="h-1 bg-gray-200 dark:bg-gray-800 rounded-full mb-2">
                                                                                <div className="h-full w-1/2 bg-primary rounded-full"></div>
                                                                            </div>
                                                                            <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                                                                                <span>$100</span>
                                                                                <span>$5k+</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Project List */}
                                                                <div className="flex-1 p-6 overflow-y-auto">
                                                                    <div className="flex justify-between items-center mb-4">
                                                                        <h3 className="font-bold text-lg dark:text-white">{t.step2.header}</h3>
                                                                        <div className="text-xs text-gray-500">Sorted by: <span className="font-medium text-gray-900 dark:text-white">{t.step2.sort}</span></div>
                                                                    </div>

                                                                    <div className="space-y-4">
                                                                        {t.step2.cards.map((card, i) => (
                                                                            <motion.div
                                                                                key={i}
                                                                                initial={{ opacity: 0, y: 10 }}
                                                                                animate={{ opacity: 1, y: 0 }}
                                                                                transition={{ delay: i * 0.1 }} // Staggered load
                                                                                className={cn(
                                                                                    "bg-white dark:bg-[#111] p-5 rounded-xl border dark:border-gray-800 shadow-sm hover:border-primary transition-all cursor-pointer group relative",
                                                                                    i === 1 ? "ring-2 ring-primary ring-offset-2 dark:ring-offset-black" : ""
                                                                                )}
                                                                                whileHover={{ scale: 1.01 }}
                                                                            >
                                                                                <div className="flex justify-between items-start mb-2">
                                                                                    <div>
                                                                                        <div className="flex items-center gap-2 mb-1">
                                                                                            <h4 className="font-bold text-base dark:text-white text-gray-900 group-hover:text-primary transition-colors">
                                                                                                {card.title}
                                                                                            </h4>
                                                                                            {card.badge && <span className="bg-primary/10 text-primary text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">{card.badge}</span>}
                                                                                        </div>
                                                                                        <div className="text-xs text-gray-500 flex items-center gap-2">
                                                                                            <span>{card.time}</span>
                                                                                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                                                            <div className="flex items-center gap-1 text-green-600">
                                                                                                <CheckCircle2 className="h-3 w-3" /> {card.verified}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <span className="font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded text-sm font-mono tracking-tight">
                                                                                        ${card.price}
                                                                                    </span>
                                                                                </div>
                                                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">
                                                                                    {card.desc}
                                                                                </p>
                                                                                <div className="flex gap-2">
                                                                                    {card.tags.map(tag => (
                                                                                        <span key={tag} className="text-[10px] bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 px-2 py-1 rounded-md text-gray-500 font-medium">{tag}</span>
                                                                                    ))}
                                                                                </div>

                                                                                {/* Simulated Ripple on Click (Card 1 only) */}
                                                                                {i === 1 && (
                                                                                    <motion.div
                                                                                        className="absolute inset-0 bg-primary/5 rounded-xl pointer-events-none"
                                                                                        initial={{ opacity: 0 }}
                                                                                        animate={{ opacity: [0, 1, 0] }}
                                                                                        transition={{ delay: 3.5, duration: 0.4 }}
                                                                                    />
                                                                                )}
                                                                            </motion.div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Cursor Interactive Animation */}
                                                            <motion.div
                                                                initial={{ top: "110%", left: "50%" }}
                                                                animate={{
                                                                    top: ["50%", "30%", "40%"], // 1. Center, 2. Filter (Construction), 3. Card (Villa)
                                                                    left: locale === 'ar' ? ["50%", "85%", "40%"] : ["50%", "15%", "60%"], // Mirror for RTL
                                                                }}
                                                                transition={{
                                                                    duration: 4,
                                                                    times: [0, 0.3, 1], // Move to filter (1.2s), then to card (2.8s)
                                                                    ease: "easeInOut",
                                                                    delay: 0.5
                                                                }}
                                                                className="absolute z-50 pointer-events-none"
                                                            >
                                                                <MousePointer2 className="h-6 w-6 text-black dark:text-white drop-shadow-xl fill-current" />

                                                                {/* Click Ripple 1 (Filter) */}
                                                                <motion.div
                                                                    className="absolute -top-2 -left-2 w-10 h-10 bg-black/10 dark:bg-white/20 rounded-full"
                                                                    initial={{ scale: 0, opacity: 0 }}
                                                                    animate={{ scale: [0, 1.5], opacity: [0.5, 0] }}
                                                                    transition={{ delay: 1.5, duration: 0.4 }}
                                                                />

                                                                {/* Click Ripple 2 (Card) */}
                                                                <motion.div
                                                                    className="absolute -top-2 -left-2 w-10 h-10 bg-primary/30 rounded-full"
                                                                    initial={{ scale: 0, opacity: 0 }}
                                                                    animate={{ scale: [0, 1.5], opacity: [0.5, 0] }}
                                                                    transition={{ delay: 3.5, duration: 0.4 }}
                                                                />
                                                            </motion.div>
                                                        </motion.div>
                                                    )}

                                                    {/* Step 3: Realistic Submit Proposal */}
                                                    {activeStep === 2 && (
                                                        <motion.div
                                                            key="step3"
                                                            className="h-full flex flex-col bg-white dark:bg-[#111]"
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                        >
                                                            {/* Scrollable Form Content */}
                                                            <div className="flex-1 overflow-y-auto p-6">
                                                                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 border-b dark:border-gray-800 flex justify-between items-center rounded-t-xl mb-4">
                                                                    <h3 className="font-bold text-sm dark:text-white">{t.step3.header}</h3>
                                                                    <X className="h-4 w-4 text-gray-400" />
                                                                </div>

                                                                <div className="space-y-6">
                                                                    <div className="flex gap-4">
                                                                        <div className="flex-1 space-y-1.5">
                                                                            <label className="text-[10px] font-bold text-gray-500 uppercase">{t.step3.price}</label>
                                                                            <div className="h-10 border dark:border-gray-700 rounded-lg flex items-center px-3 bg-white dark:bg-black font-mono font-bold dark:text-white relative">
                                                                                <motion.span
                                                                                    initial={{ width: 0 }}
                                                                                    animate={{ width: "auto" }}
                                                                                    transition={{ duration: 0.5, delay: 1 }}
                                                                                    className="overflow-hidden whitespace-nowrap"
                                                                                >
                                                                                    2,400.00
                                                                                </motion.span>
                                                                                <motion.span
                                                                                    animate={{ opacity: [0, 1, 0] }}
                                                                                    transition={{ repeat: Infinity, duration: 0.8 }}
                                                                                    className="w-0.5 h-4 bg-primary ml-0.5 absolute right-3"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex-1 space-y-1.5">
                                                                            <label className="text-[10px] font-bold text-gray-500 uppercase">{t.step3.duration}</label>
                                                                            <div className="h-10 border dark:border-gray-700 rounded-lg flex items-center px-3 bg-white dark:bg-black dark:text-white justify-between">
                                                                                {t.step3.durationVal}
                                                                                <ChevronRight className="h-4 w-4 rotate-90 text-gray-400" />
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="space-y-1.5">
                                                                        <label className="text-[10px] font-bold text-gray-500 uppercase">{t.step3.cover}</label>
                                                                        <div className="h-32 border dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-black text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-serif relative">
                                                                            <motion.p
                                                                                initial={{ opacity: 0 }}
                                                                                animate={{ opacity: 1 }}
                                                                                transition={{ delay: 1.5, duration: 2 }} // Typing simulation time
                                                                            >
                                                                                {t.step3.coverVal}
                                                                            </motion.p>
                                                                            <motion.span
                                                                                className="absolute bottom-3 right-3 text-[10px] text-gray-400"
                                                                                animate={{ opacity: [0, 1] }}
                                                                                transition={{ delay: 3.5 }}
                                                                            >
                                                                                {t.step3.words}
                                                                            </motion.span>
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex items-center justify-between pt-2">
                                                                        <motion.div
                                                                            className="flex items-center gap-2 text-primary font-bold text-xs cursor-pointer hover:underline border border-dashed border-primary/30 p-2 rounded bg-primary/5"
                                                                            whileHover={{ scale: 1.02 }}
                                                                        >
                                                                            <Upload className="h-3 w-3" />
                                                                            <span>{t.step3.attach}</span>
                                                                            <motion.div
                                                                                initial={{ width: 0 }}
                                                                                animate={{ width: "100%" }}
                                                                                transition={{ delay: 3, duration: 0.5 }}
                                                                                className="h-0.5 bg-primary absolute bottom-0 left-0"
                                                                            />
                                                                        </motion.div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Sticky Footer Button */}
                                                            <div className="p-4 border-t dark:border-gray-800 bg-white dark:bg-[#111] z-10 shrink-0 flex gap-3">
                                                                <button className="px-4 py-3 border dark:border-gray-700 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800">{t.step3.cancel}</button>
                                                                <motion.button
                                                                    className="flex-1 bg-primary text-white py-3 rounded-lg shadow-lg shadow-primary/20 flex items-center justify-center gap-2 text-xs font-bold relative overflow-hidden"
                                                                    initial={{ scale: 1 }}
                                                                    animate={{
                                                                        scale: [1, 0.95, 1]
                                                                    }}
                                                                    transition={{
                                                                        duration: 0.3,
                                                                        delay: 4
                                                                    }}
                                                                >
                                                                    <motion.span
                                                                        initial={{ opacity: 1 }}
                                                                        animate={{ opacity: 0 }}
                                                                        transition={{ duration: 0.2, delay: 4.5 }}
                                                                    >
                                                                        {t.step3.send}
                                                                    </motion.span>

                                                                    <motion.div
                                                                        className="absolute inset-0 flex items-center justify-center"
                                                                        initial={{ opacity: 0 }}
                                                                        animate={{ opacity: 1 }}
                                                                        transition={{ duration: 0.2, delay: 4.5 }}
                                                                    >
                                                                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                                                                    </motion.div>

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
                                                                initial={{ top: "10%", left: "50%" }}
                                                                animate={{
                                                                    top: ["10%", "50%", "92%"], // 1. Start, 2. Typing/Form, 3. Button
                                                                    left: locale === 'ar' ? ["50%", "50%", "25%"] : ["50%", "50%", "75%"], // Mirror for RTL
                                                                }}
                                                                transition={{
                                                                    duration: 3,
                                                                    times: [0, 0.6, 1],
                                                                    ease: "easeInOut",
                                                                    delay: 1 // Start moving after form loads
                                                                }}
                                                                className="absolute z-50 pointer-events-none"
                                                            >
                                                                <MousePointer2 className="h-6 w-6 text-black dark:text-white drop-shadow-xl fill-current" />

                                                                {/* Click Ripple on Button */}
                                                                <motion.div
                                                                    className="absolute -top-2 -left-2 w-10 h-10 bg-white/30 rounded-full"
                                                                    initial={{ scale: 0, opacity: 0 }}
                                                                    animate={{ scale: [0, 1.5], opacity: [0.5, 0] }}
                                                                    transition={{ delay: 4, duration: 0.5 }}
                                                                />
                                                            </motion.div>
                                                        </motion.div>
                                                    )}

                                                    {/* Step 4: Realistic Manage & Chat */}
                                                    {activeStep === 3 && (
                                                        <motion.div
                                                            key="step4"
                                                            className="h-full flex bg-gray-50 dark:bg-[#0a0a0a]"
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                        >
                                                            {/* Sidebar: Active Projects */}
                                                            <div className="w-1/3 border-r dark:border-gray-800 bg-white dark:bg-[#111] flex flex-col">
                                                                <div className="p-3 border-b dark:border-gray-800">
                                                                    <h3 className="font-bold text-xs uppercase text-gray-400 tracking-wider">{t.step4.sidebarTitle}</h3>
                                                                </div>
                                                                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                                                                    {t.step4.projects.map((proj, i) => (
                                                                        <div
                                                                            key={i}
                                                                            className={cn(
                                                                                "p-3 rounded-lg border text-left transition-colors relative",
                                                                                i === 0 ? "bg-primary/5 border-primary/20" : "bg-white dark:bg-black border-gray-100 dark:border-gray-800 opacity-60"
                                                                            )}
                                                                        >
                                                                            <div className="font-bold text-xs dark:text-white mb-1 line-clamp-1">
                                                                                {proj.title}
                                                                            </div>
                                                                            <div className="flex justify-between items-center text-[10px] text-gray-500">
                                                                                <span>{proj.client}</span>
                                                                                <span className={cn("px-1.5 py-0.5 rounded-full text-[9px] font-bold", i === 0 ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600")}>
                                                                                    {proj.status}
                                                                                </span>
                                                                            </div>
                                                                            {i === 0 && <div className="absolute right-2 top-2 w-2 h-2 bg-primary rounded-full animate-pulse" />}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            {/* Main: Chat Interface */}
                                                            <div className="flex-1 flex flex-col bg-gray-50 dark:bg-[#0a0a0a]">
                                                                {/* Chat Header */}
                                                                <div className="p-3 bg-white dark:bg-[#111] border-b dark:border-gray-800 flex justify-between items-center shadow-sm z-10">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">{t.step4.chatHeader.name.charAt(0)}</div>
                                                                        <div>
                                                                            <div className="font-bold text-xs dark:text-white">{t.step4.chatHeader.name}</div>
                                                                            <div className="text-[10px] text-green-500 flex items-center gap-1">
                                                                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" /> {t.step4.chatHeader.status}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-500">
                                                                        <Search className="h-3 w-3" />
                                                                    </div>
                                                                </div>

                                                                {/* Messages Area */}
                                                                <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                                                                    {/* Message 1 (Client) */}
                                                                    <motion.div
                                                                        className="flex items-start gap-2"
                                                                        initial={{ opacity: 0, y: 10 }}
                                                                        animate={{ opacity: 1, y: 0 }}
                                                                        transition={{ delay: 0.5 }}
                                                                    >
                                                                        <div className="bg-white dark:bg-[#222] border dark:border-gray-700 p-3 rounded-2xl rounded-tl-none shadow-sm max-w-[85%] text-xs dark:text-gray-300">
                                                                            {t.step4.msg1}
                                                                        </div>
                                                                        <span className="text-[9px] text-gray-400 mt-1">10:42 AM</span>
                                                                    </motion.div>

                                                                    {/* Message 2 (User Response) */}
                                                                    <motion.div
                                                                        className="flex flex-row-reverse items-start gap-2"
                                                                        initial={{ opacity: 0, y: 10 }}
                                                                        animate={{ opacity: 1, y: 0 }}
                                                                        transition={{ delay: 2.5 }} // Show after typing
                                                                    >
                                                                        <div className="bg-primary text-white p-3 rounded-2xl rounded-tr-none shadow-md max-w-[85%] text-xs">
                                                                            {t.step4.msg2}
                                                                        </div>
                                                                        <span className="text-[9px] text-gray-400 mt-1">10:43 AM</span>
                                                                    </motion.div>
                                                                </div>

                                                                {/* Input Area */}
                                                                <div className="p-3 bg-white dark:bg-[#111] border-t dark:border-gray-800 sticky bottom-0">
                                                                    <div className="flex gap-2">
                                                                        <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 text-xs flex items-center text-gray-500 dark:text-gray-400 relative overflow-hidden">
                                                                            <motion.span
                                                                                initial={{ opacity: 1 }}
                                                                                animate={{ opacity: 0 }}
                                                                                transition={{ delay: 2.5 }} // Hide simulated text when 'sent'
                                                                            >
                                                                                <motion.span
                                                                                    initial={{ width: 0 }}
                                                                                    animate={{ width: "100%" }}
                                                                                    transition={{ duration: 1.5, delay: 1 }} // Typing duration
                                                                                    className="inline-block overflow-hidden whitespace-nowrap text-gray-900 dark:text-gray-200"
                                                                                >
                                                                                    {t.step4.input}
                                                                                </motion.span>
                                                                            </motion.span>

                                                                            {/* Cursor in input */}
                                                                            <motion.div
                                                                                className="w-0.5 h-3 bg-black dark:bg-white absolute left-[2px] animate-pulse"
                                                                                animate={{ left: locale === 'ar' ? ["100%", "20%"] : ["0%", "80%"] }}
                                                                                transition={{ duration: 1.5, delay: 1, ease: "linear" }}
                                                                            />
                                                                        </div>
                                                                        <motion.button
                                                                            className="bg-primary text-white p-2 rounded-lg shadow-sm"
                                                                            animate={{ scale: [1, 0.9, 1] }}
                                                                            transition={{ delay: 2.6, duration: 0.2 }} // Click Send
                                                                        >
                                                                            <ChevronRight className={cn("h-4 w-4", locale === 'ar' ? "rotate-180" : "")} />
                                                                        </motion.button>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Cursor Interacting with Chat */}
                                                            <motion.div
                                                                initial={{ top: "80%", left: "20%" }}
                                                                animate={{
                                                                    top: ["80%", "90%"], // Move to input
                                                                    left: locale === 'ar' ? ["80%", "15%"] : ["20%", "85%"],
                                                                }}
                                                                transition={{
                                                                    duration: 2,
                                                                    times: [0, 1],
                                                                    ease: "easeInOut",
                                                                    delay: 0.5
                                                                }}
                                                                className="absolute z-50 pointer-events-none"
                                                            >
                                                                <MousePointer2 className="h-6 w-6 text-black dark:text-white drop-shadow-xl fill-current" />

                                                                {/* Click Ripple on Send */}
                                                                <motion.div
                                                                    className="absolute -top-2 -left-2 w-10 h-10 bg-primary/30 rounded-full"
                                                                    initial={{ scale: 0, opacity: 0 }}
                                                                    animate={{ scale: [0, 1.5], opacity: [0.5, 0] }}
                                                                    transition={{ delay: 2.5, duration: 0.4 }}
                                                                />
                                                            </motion.div>
                                                        </motion.div>
                                                    )}

                                                    {/* Step 5: Company Directory Listing */}
                                                    {activeStep === 4 && (
                                                        <motion.div
                                                            key="step5"
                                                            className="h-full flex flex-col bg-gray-50 dark:bg-[#0a0a0a]"
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                        >
                                                            {/* Search Header */}
                                                            <div className="p-4 bg-white dark:bg-[#111] border-b dark:border-gray-800 shadow-sm z-10">
                                                                <div className="relative">
                                                                    <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                                                                    <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded-xl w-full pl-10 flex items-center text-sm font-medium">
                                                                        <span className="text-gray-900 dark:text-gray-100">{t.step5.search}</span>
                                                                        <span className="w-0.5 h-4 bg-primary ml-1 animate-pulse" />
                                                                    </div>
                                                                </div>
                                                                <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                                                                    {t.step5.filters.map((filter, i) => (
                                                                        <span key={filter} className={cn("px-3 py-1 rounded-full text-xs font-medium border transition-colors", i === 0 ? "bg-black text-white dark:bg-white dark:text-black border-transparent" : "bg-white dark:bg-black border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400")}>
                                                                            {filter}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            {/* Directory Grid */}
                                                            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                                                                {/* Our Company Card (Featured) */}
                                                                <motion.div
                                                                    className="bg-white dark:bg-[#111] p-4 rounded-xl border-2 border-primary/20 shadow-lg relative overflow-hidden"
                                                                    initial={{ scale: 0.9, opacity: 0 }}
                                                                    animate={{ scale: 1, opacity: 1 }}
                                                                    transition={{ duration: 0.5 }}
                                                                >
                                                                    {/* Promoted Label */}
                                                                    <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                                                                        {t.step5.card.featured}
                                                                    </div>

                                                                    <div className="flex gap-4">
                                                                        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-inner">
                                                                            {t.step5.card.name.charAt(0)}
                                                                        </div>
                                                                        <div className="flex-1">
                                                                            <div className="flex items-center gap-2 mb-1">
                                                                                <h3 className="font-bold text-base dark:text-white">{t.step5.card.name}</h3>
                                                                                <motion.div
                                                                                    initial={{ scale: 0, rotate: -180 }}
                                                                                    animate={{ scale: 1, rotate: 0 }}
                                                                                    transition={{ delay: 1, type: "spring" }}
                                                                                >
                                                                                    <CheckCircle2 className="h-4 w-4 text-primary fill-current" />
                                                                                </motion.div>
                                                                            </div>
                                                                            <div className="flex items-center gap-1 text-yellow-400 text-xs mb-2">
                                                                                {[1, 2, 3, 4, 5].map((s) => (
                                                                                    <motion.div
                                                                                        key={s}
                                                                                        initial={{ opacity: 0, scale: 0 }}
                                                                                        animate={{ opacity: 1, scale: 1 }}
                                                                                        transition={{ delay: 1.5 + (s * 0.1) }}
                                                                                    >
                                                                                        <StarIcon className="h-3 w-3 fill-current" />
                                                                                    </motion.div>
                                                                                ))}
                                                                                <span className="text-gray-400 ml-1">{t.step5.card.reviews}</span>
                                                                            </div>
                                                                            <div className="flex gap-2">
                                                                                {t.step5.card.tags.map(tag => (
                                                                                    <span key={tag} className="text-[10px] bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-600">{tag}</span>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="mt-4 pt-4 border-t dark:border-gray-800 flex justify-between items-center">
                                                                        <div className="text-xs text-gray-500">
                                                                            <MapPin className="h-3 w-3 inline mr-1" /> {t.step5.card.loc}
                                                                        </div>
                                                                        <button className="bg-black dark:bg-white text-white dark:text-black py-1.5 px-4 rounded-lg text-xs font-bold shadow-md hover:scale-105 transition-transform">
                                                                            {t.step5.card.btn}
                                                                        </button>
                                                                    </div>

                                                                    {/* Verification Stamp Animation */}
                                                                    <motion.div
                                                                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                                                        initial={{ opacity: 0, scale: 3 }}
                                                                        animate={{ opacity: [0, 1, 0], scale: [3, 1, 2] }}
                                                                        transition={{ delay: 0.8, duration: 1.5 }}
                                                                    >
                                                                        <div className="border-4 border-green-500 text-green-500 font-black text-2xl uppercase p-2 -rotate-12 rounded-lg opacity-20">
                                                                            {t.step5.card.verified}
                                                                        </div>
                                                                    </motion.div>
                                                                </motion.div>

                                                                {/* Other Companies (Generic) */}
                                                                {[1, 2].map((i) => (
                                                                    <motion.div
                                                                        key={i}
                                                                        className="bg-white dark:bg-[#111] p-4 rounded-xl border dark:border-gray-800 opacity-60 grayscale-[50%]"
                                                                        initial={{ opacity: 0, y: 20 }}
                                                                        animate={{ opacity: 0.6, y: 0 }}
                                                                        transition={{ delay: 2 + (i * 0.1) }}
                                                                    >
                                                                        <div className="flex gap-4">
                                                                            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                                                                            <div className="flex-1 space-y-2">
                                                                                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
                                                                                <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/4"></div>
                                                                            </div>
                                                                        </div>
                                                                    </motion.div>
                                                                ))}
                                                            </div>

                                                            {/* Cursor */}
                                                            <motion.div
                                                                initial={{ top: "110%", left: "50%" }}
                                                                animate={{
                                                                    top: ["110%", "40%", "40%"],
                                                                    left: locale === 'ar' ? ["50%", "20%", "20%"] : ["50%", "80%", "80%"],
                                                                }}
                                                                transition={{
                                                                    duration: 2,
                                                                    times: [0, 0.5, 1],
                                                                    ease: "easeInOut",
                                                                    delay: 0.5
                                                                }}
                                                                className="absolute z-50 pointer-events-none"
                                                            >
                                                                <MousePointer2 className="h-6 w-6 text-black dark:text-white drop-shadow-xl fill-current" />

                                                                {/* Hover Ripple */}
                                                                <motion.div
                                                                    className="absolute -top-2 -left-2 w-10 h-10 bg-black/10 dark:bg-white/20 rounded-full"
                                                                    initial={{ scale: 0, opacity: 0 }}
                                                                    animate={{ scale: [0, 1.5], opacity: [0.5, 0] }}
                                                                    transition={{ delay: 1.5, duration: 0.5 }}
                                                                />
                                                            </motion.div>
                                                        </motion.div>
                                                    )}

                                                </AnimatePresence>
                                            </div>

                                            {/* WINDOWS TASKBAR (Fixed Bottom) */}
                                            <div
                                                dir={locale === 'ar' ? 'rtl' : 'ltr'}
                                                className="h-10 bg-[#f3f3f3] dark:bg-[#1a1a1a]/95 backdrop-blur border-t dark:border-white/5 flex items-center justify-between px-3 shrink-0 z-50"
                                            >
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
                                                        <span className="text-xs text-gray-400">{locale === 'ar' ? 'بحث' : 'Search'}</span>
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

                                    {/* Laptop Base (Realistic Metallic) */}
                                    <div className="relative mx-auto w-[110%]">
                                        <div className="h-3 sm:h-4 bg-gradient-to-b from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800 rounded-t-sm shadow-inner relative z-10 ring-1 ring-black/5 dark:ring-white/30"></div>
                                        <div className="h-2 sm:h-3 bg-gray-400 dark:bg-gray-900 rounded-b-xl shadow-[0_15px_30px_-10px_rgba(0,0,0,0.4)] relative z-0 mx-2 ring-1 ring-black/5 dark:ring-white/30"></div>
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-b-md z-20 shadow-inner"></div>
                                    </div>

                                </motion.div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
