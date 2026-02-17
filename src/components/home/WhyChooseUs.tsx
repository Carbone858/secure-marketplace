"use client";

import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Clock, CheckCircle, Star, GitCompare, ShieldCheck } from "lucide-react";

export default function WhyChooseUs() {
    const locale = useLocale();
    const isAr = locale === "ar";

    const features = [
        {
            icon: Clock,
            title: { en: "Save Time", ar: "توفير الوقت" },
            desc: { en: "Get quotes in minutes, not days. We connect you with pros instantly.", ar: "احصل على عروض أسعار في دقائق. نصلك بالمحترفين فوراً." }
        },
        {
            icon: GitCompare,
            title: { en: "Easy Comparison", ar: "مقارنة عروض بسهولة" },
            desc: { en: "Compare prices, profiles, and reviews side-by-side to make the best choice.", ar: "قارن الأسعار والملفات الشخصية والتقييمات لاختيار الأفضل." }
        },
        {
            icon: ShieldCheck,
            title: { en: "Trusted Companies", ar: "شركات موثوقة" },
            desc: { en: "All professionals are verified and background-checked for your safety.", ar: "جميع المحترفين تم التحقق منهم لضمان وسلامة خدماتك." }
        },
        {
            icon: Star,
            title: { en: "Transparent Ratings", ar: "نظام تقييم شفاف" },
            desc: { en: "Read real reviews from verified customers to hire with confidence.", ar: "اقرأ تقييمات حقيقية من عملاء سابقين لتوظيف بثقة." }
        }
    ];

    return (
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                        {isAr ? "لماذا تختارنا؟" : "Why Choose Us?"}
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        {isAr
                            ? "نحن نجعل عملية العثور على محترفين سهلة، آمنة، وموثوقة."
                            : "We make hiring professionals easy, safe, and reliable."}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, idx) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 text-center group border border-gray-100 dark:border-gray-700"
                            >
                                <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                                    <Icon className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                                    {isAr ? feature.title.ar : feature.title.en}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {isAr ? feature.desc.ar : feature.desc.en}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
