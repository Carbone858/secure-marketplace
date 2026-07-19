"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { categories, getSubcategories } from "@/lib/services-data";

export default function ServiceDiscovery() {
    const locale = useLocale();
    const isAr = locale === "ar";
    const [activeId, setActiveId] = useState("home-maintenance");
    const [isExpanded, setIsExpanded] = useState(false);

    // Get all subcategories from shared data
    const activeSubcats = getSubcategories(activeId);

    const handleCategoryChange = (id: string) => {
        setActiveId(id);
        setIsExpanded(false);
    };

    // Show 8 subcategories initially, show all if expanded
    const displayedSubcats = isExpanded ? activeSubcats : activeSubcats.slice(0, 8);

    return (
        <section className="py-16 bg-white dark:bg-[#0a0a0a]">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold mb-10 text-center text-gray-900 dark:text-white">
                    {isAr ? "اكتشف الخدمات المطلوبة في منطقتك" : "Discover Top Services in Your Area"}
                </h2>

                {/* 
                  Category Navigation Bar:
                  - Desktop (>= 768px): md:flex-nowrap ensures all 12 categories lay on the same line (no wrap, no slide).
                  - Mobile (< 768px): flex-wrap allows items to wrap into multiple rows so they are fully visible without sliding.
                */}
                <div className="flex flex-wrap md:flex-nowrap md:justify-center justify-center gap-2 lg:gap-3 mb-12">
                    {categories.map((cat) => {
                        const Icon = cat.icon;
                        const isActive = activeId === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => handleCategoryChange(cat.id)}
                                className={cn(
                                    "flex flex-col items-center gap-2 p-2 lg:p-4 min-w-[85px] md:min-w-0 md:flex-1 md:max-w-[100px] rounded-xl transition-all duration-300 border",
                                    isActive
                                        ? "bg-primary/5 border-primary text-primary shadow-lg scale-105"
                                        : "bg-gray-50 dark:bg-gray-900 border-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800"
                                )}
                            >
                                <div className={cn(
                                    "p-2.5 lg:p-3 rounded-full transition-all duration-300",
                                    isActive 
                                        ? "bg-primary text-white shadow-[0_0_12px_rgba(59,130,246,0.35)] scale-110" 
                                        : "bg-white dark:bg-gray-800"
                                )}>
                                    <Icon className="w-8 h-8" />
                                </div>
                                <span className="text-[10px] lg:text-xs font-bold text-center leading-tight mt-1 break-words w-full">{isAr ? cat.label.ar : cat.label.en}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Subcategory Cards Grid with Premium Glowing & Glassmorphism effects */}
                <div className="relative min-h-[300px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                             key={activeId + "-" + isExpanded}
                             initial={{ opacity: 0, y: 15 }}
                             animate={{ opacity: 1, y: 0 }}
                             exit={{ opacity: 0, y: -15 }}
                             transition={{ duration: 0.25 }}
                             className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                        >
                            {displayedSubcats.map((sub, idx) => (
                                <Link
                                    key={idx}
                                    href={`/${locale}/companies?q=${encodeURIComponent(sub.title.en)}`}
                                    className="group cursor-pointer relative overflow-hidden rounded-2xl border border-transparent shadow-md hover:shadow-[0_0_25px_rgba(6,182,212,0.3)] hover:border-cyan-500/40 hover:-translate-y-1 transition-all duration-300 h-[280px] block"
                                >
                                    {/* Background Image */}
                                    <div className="absolute inset-0">
                                        <Image
                                            src={sub.img}
                                            alt={isAr ? sub.title.ar : sub.title.en}
                                            fill
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        {/* Premium dark gradient overlay for text readability */}
                                        <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-95" />
                                    </div>

                                    {/* Glassmorphic Title Plate */}
                                    <div className="absolute inset-x-0 bottom-0 p-4">
                                        <div className="backdrop-blur-md bg-black/40 border border-white/10 rounded-xl p-4 transition-all duration-300 group-hover:bg-black/60 group-hover:border-cyan-500/30">
                                            <h4 className="text-white text-base md:text-lg font-bold mb-1 transition-colors duration-300 group-hover:text-cyan-400">
                                                {isAr ? sub.title.ar : sub.title.en}
                                            </h4>
                                            <div className="flex items-center gap-1.5 text-white/80 text-xs font-semibold opacity-0 h-0 overflow-hidden group-hover:opacity-100 group-hover:h-5 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                                <span>{isAr ? "عرض المحترفين" : "View Pros"}</span>
                                                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180 text-cyan-400" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Show More / Show Less Button */}
                {activeSubcats.length > 8 && (
                    <div className="flex justify-center mt-10">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 font-bold rounded-xl transition-all shadow-sm hover:shadow"
                        >
                            <span>
                                {isExpanded
                                    ? (isAr ? "عرض خدمات أقل" : "Show Less Services")
                                    : (isAr 
                                        ? `عرض المزيد (+${activeSubcats.length - 8} خدمة)` 
                                        : `Show More (+${activeSubcats.length - 8} Services)`
                                      )
                                }
                            </span>
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                    </div>
                )}

                {/* View All Redirect Link */}
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
