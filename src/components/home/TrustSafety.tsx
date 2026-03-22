"use client";

import { useLocale, useTranslations } from "next-intl";
import { ShieldCheck, UserCheck, MessageSquare, FileCheck2 } from "lucide-react";
import { motion } from "framer-motion";

export default function TrustSafety() {
    const t = useTranslations('home.trust');
    const locale = useLocale();
    const isAr = locale === "ar";

    const features = [
        {
            icon: UserCheck,
            title: t('manual.title'),
            desc: t('manual.desc'),
            color: "text-blue-600",
            bg: "bg-blue-50 dark:bg-blue-900/20"
        },
        {
            icon: MessageSquare,
            title: t('privacy.title'),
            desc: t('privacy.desc'),
            color: "text-purple-600",
            bg: "bg-purple-50 dark:bg-purple-900/20"
        },
        {
            icon: FileCheck2,
            title: t('reviews.title'),
            desc: t('reviews.desc'),
            color: "text-emerald-600",
            bg: "bg-emerald-50 dark:bg-emerald-900/20"
        },
        {
            icon: ShieldCheck,
            title: t('dispute.title'),
            desc: t('dispute.desc'),
            color: "text-orange-600",
            bg: "bg-orange-50 dark:bg-orange-900/20"
        }
    ];

    return (
        <section className="py-24 bg-white dark:bg-[#0a0a0a] overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                        {t('title')}
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        {t('subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-8 rounded-2xl border dark:border-gray-800 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 bg-white dark:bg-gray-950/50"
                        >
                            <div className={`w-14 h-14 rounded-xl ${item.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                <item.icon className={`w-7 h-7 ${item.color}`} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100 italic-arabic">
                                {item.title}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed text-sm">
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
                
                {/* Security Badge Ribbon */}
                <div className="mt-16 flex flex-wrap justify-center items-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all cursor-default select-none">
                    <div className="flex items-center gap-2 font-bold text-gray-400">
                        <ShieldCheck className="w-5 h-5 text-green-500" />
                        <span>SSL SECURED</span>
                    </div>
                    <div className="flex items-center gap-2 font-bold text-gray-400">
                        <ShieldCheck className="w-5 h-5 text-blue-500" />
                        <span>ID VERIFIED</span>
                    </div>
                    <div className="flex items-center gap-2 font-bold text-gray-400">
                        <ShieldCheck className="w-5 h-5 text-purple-500" />
                        <span>ENCRYPTED CHAT</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
