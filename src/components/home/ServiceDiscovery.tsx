"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { categories, getSubcategories } from "@/lib/services-data";

export default function ServiceDiscovery() {
    const locale = useLocale();
    const isAr = locale === "ar";
    const [activeId, setActiveId] = useState("ac");

    // Get subcategories from shared data and slice to top 4
    const activeSubcats = getSubcategories(activeId).slice(0, 4);

    return (
        <section className="py-12 bg-white dark:bg-[#0a0a0a]">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
                    {isAr ? "اكتشف الخدمات المطلوبة في منطقتك" : "Discover Top Services in Your Area"}
                </h2>

                {/* Category Icons Navigation */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {categories.map((cat) => {
                        const Icon = cat.icon;
                        const isActive = activeId === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setActiveId(cat.id)}
                                className={cn(
                                    "flex flex-col items-center gap-2 p-4 min-w-[90px] rounded-xl transition-all duration-300 border",
                                    isActive
                                        ? "bg-primary/5 border-primary text-primary shadow-lg scale-105"
                                        : "bg-gray-50 dark:bg-gray-900 border-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800"
                                )}
                            >
                                <div className={cn(
                                    "p-3 rounded-full transition-colors",
                                    isActive ? "bg-primary text-white" : "bg-white dark:bg-gray-800"
                                )}>
                                    <Icon className="w-8 h-8" />
                                </div>
                                <span className="text-xs font-bold text-center line-clamp-1">{isAr ? cat.label.ar : cat.label.en}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Subcategory Cards Grid */}
                <div className="relative min-h-[300px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeId}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                        >
                            {activeSubcats.map((sub, idx) => (
                                <Link
                                    key={idx}
                                    href={`/${locale}/companies?q=${encodeURIComponent(sub.title.en)}`}
                                    className="group cursor-pointer relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 h-[280px] block"
                                >
                                    {/* Background Image */}
                                    <div className="absolute inset-0">
                                        <img
                                            src={sub.img}
                                            alt="Category"
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
                                    </div>

                                    {/* Content */}
                                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                        <h4 className="text-white text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                            {isAr ? sub.title.ar : sub.title.en}
                                        </h4>
                                        <div className="flex items-center gap-2 text-white/80 text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                            {isAr ? "عرض المحترفين" : "View Pros"} <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* View All Button */}
                <div className="flex justify-center mt-12">
                    <Link
                        href={`/${locale}/services/${activeId}`}
                        className="inline-flex items-center gap-2 text-primary font-bold hover:underline underline-offset-4 transition-all text-lg group"
                    >
                        <span>
                            {isAr
                                ? `عرض جميع خدمات ${categories.find(c => c.id === activeId)?.label.ar}`
                                : `View All ${categories.find(c => c.id === activeId)?.label.en} Services`
                            }
                        </span>
                        <ArrowRight className="w-5 h-5 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
