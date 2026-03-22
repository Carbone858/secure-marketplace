"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { ChevronDown, HelpCircle, MessageCircle, Phone, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function FAQSection() {
    const t = useTranslations('home.faq');
    const locale = useLocale();
    const isAr = locale === "ar";
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const questions = [0, 1, 2, 3, 4].map(i => ({
        q: t(`items.${i}.q`),
        a: t(`items.${i}.a`)
    }));

    return (
        <section className="py-24 bg-gray-50 dark:bg-gray-900/50">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4">
                        <HelpCircle className="w-4 h-4" />
                        {t('badge')}
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        {t('title')}
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto italic-arabic text-lg">
                        {t('subtitle')}
                    </p>
                </div>

                {/* FAQ Items */}
                <div className="space-y-4 mb-20">
                    {questions.map((item, idx) => (
                        <div
                            key={idx}
                            className={cn(
                                "group border rounded-2xl transition-all overflow-hidden bg-white dark:bg-gray-900",
                                openIndex === idx 
                                    ? "border-primary shadow-xl shadow-primary/5 ring-1 ring-primary/20" 
                                    : "border-transparent dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 shadow-sm"
                            )}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                className="w-full flex items-center justify-between p-6 text-left rtl:text-right"
                            >
                                <span className={cn(
                                    "text-lg font-bold transition-colors select-none",
                                    openIndex === idx ? "text-primary italic-arabic" : "text-gray-700 dark:text-gray-300"
                                )}>
                                    {item.q}
                                </span>
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center transition-all bg-gray-50 dark:bg-gray-800",
                                    openIndex === idx ? "bg-primary text-white rotate-180" : "text-gray-400"
                                )}>
                                    <ChevronDown className="w-5 h-5" />
                                </div>
                            </button>
                            
                            <AnimatePresence>
                                {openIndex === idx && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="px-6 pb-6 text-muted-foreground leading-relaxed border-t border-gray-50 dark:border-gray-800 pt-4 select-none text-base">
                                            {item.a}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

                {/* CTA BOX: Re-designed for Premium Light Theme */}
                <div className="relative p-1 md:p-1.5 rounded-[2.5rem] bg-gradient-to-br from-primary via-primary/50 to-accent shadow-2xl shadow-primary/20 group">
                    <div className="bg-white dark:bg-gray-950 rounded-[2.4rem] p-8 md:p-12 relative overflow-hidden">
                        {/* Decorative Background Ornaments */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-primary/10 transition-colors duration-500" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl" />
                        
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                            <div className="flex-1 text-center md:text-left rtl:md:text-right">
                                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white italic-arabic">
                                    {t('help.title')}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 leading-relaxed max-w-lg">
                                    {t('help.desc')}
                                </p>
                                
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                    <Link 
                                        href={`/${locale}/contact`}
                                        className="inline-flex items-center gap-2 bg-primary text-white font-bold px-8 py-4 rounded-2xl hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/25 group/btn"
                                    >
                                        <MessageCircle className="w-5 h-5" />
                                        <span>{t('help.button')}</span>
                                        <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1" />
                                    </Link>
                                    
                                    <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 font-medium px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                                        <Phone className="w-4 h-4 text-primary" />
                                        <span dir="ltr">+963 11 000 0000</span>
                                    </div>
                                </div>
                            </div>

                            {/* Optional visual icon stack for "Support" */}
                            <div className="hidden lg:flex w-40 h-40 bg-primary/5 rounded-3xl items-center justify-center relative">
                                <div className="absolute inset-0 bg-primary/10 rounded-3xl rotate-6 -z-10 animate-pulse" />
                                <HelpCircle className="w-20 h-20 text-primary opacity-20" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl shadow-xl flex items-center justify-center">
                                        <MessageCircle className="w-8 h-8 text-primary" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
