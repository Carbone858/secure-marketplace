"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { useLocale } from "next-intl";
import { ArrowLeft, ArrowRight, Filter, Search, MapPin, Globe } from "lucide-react";
import { categories, getSubcategories } from "@/lib/services-data";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";


interface PageProps {
    params: {
        category: string;
    };
}

// Mock Locations
const countries = [
    { id: "sy", name: { en: "Syria", ar: "سوريا" } },
];

const cities = {
    sy: [
        { id: "damascus", en: "Damascus", ar: "دمشق" },
        { id: "aleppo", en: "Aleppo", ar: "حلب" },
        { id: "homs", en: "Homs", ar: "حمص" },
        { id: "latakia", en: "Latakia", ar: "اللاذقية" },
        { id: "hama", en: "Hama", ar: "حماة" },
        { id: "tartus", en: "Tartus", ar: "طرطوس" },
        { id: "rif-dimashq", en: "Rif Dimashq", ar: "ريف دمشق" },
        { id: "daraa", en: "Daraa", ar: "درعا" },
        { id: "suwayda", en: "As-Suwayda", ar: "السويداء" },
        { id: "hasakah", en: "Al-Hasakah", ar: "الحسكة" },
        { id: "deir-ez-zor", en: "Deir ez-Zor", ar: "دير الزور" },
        { id: "raqqa", en: "Raqqa", ar: "الرقة" },
        { id: "idlib", en: "Idlib", ar: "إدلب" },
        { id: "quneitra", en: "Quneitra", ar: "القنيطرة" },
    ],
};

export default function CategoryPage({ params }: PageProps) {
    const locale = useLocale();
    const isAr = locale === "ar";
    const categoryId = params.category;

    const [selectedCountry, setSelectedCountry] = useState("sy");
    const [selectedCity, setSelectedCity] = useState("");

    const category = categories.find((c) => c.id === categoryId);
    const subcategories = getSubcategories(categoryId);

    if (!category) {
        notFound();
    }

    const Icon = category.icon;
    const activeCities = selectedCountry ? (cities as any)[selectedCountry] : [];

    const FiltersContent = () => (
        <div className="space-y-6">
            {/* Categories Navigation */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                <h3 className="font-bold text-lg mb-4">{isAr ? "التصنيفات" : "Categories"}</h3>
                <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                    {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/${locale}/services/${cat.id}`}
                            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${cat.id === categoryId
                                ? "bg-primary text-white font-bold"
                                : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                }`}
                        >
                            <cat.icon className="w-5 h-5" />
                            <span className="text-sm">{isAr ? cat.label.ar : cat.label.en}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Location Filter */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    {isAr ? "الموقع" : "Location"}
                </h3>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {isAr ? "الدولة" : "Country"}
                        </label>
                        <select
                            className="w-full p-2 rounded-lg border bg-gray-50 dark:bg-gray-800 text-sm"
                            value={selectedCountry}
                            onChange={(e) => { setSelectedCountry(e.target.value); setSelectedCity(""); }}
                        >
                            <option value="">{isAr ? "كل الدول" : "All Countries"}</option>
                            {countries.map((c) => (
                                <option key={c.id} value={c.id}>{isAr ? c.name.ar : c.name.en}</option>
                            ))}
                        </select>
                    </div>

                    {selectedCountry && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {isAr ? "المدينة" : "City"}
                            </label>
                            <select
                                className="w-full p-2 rounded-lg border bg-gray-50 dark:bg-gray-800 text-sm"
                                value={selectedCity}
                                onChange={(e) => setSelectedCity(e.target.value)}
                            >
                                <option value="">{isAr ? "كل المدن" : "All Cities"}</option>
                                {activeCities?.map((c: any) => (
                                    <option key={c.id} value={c.id}>{isAr ? c.ar : c.en}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
            {/* Header Section */}
            <div className="bg-primary/5 border-b border-primary/10 py-12 md:py-16">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-lg shadow-primary/10">
                            <Icon className="w-12 h-12 md:w-16 md:h-16 text-primary" />
                        </div>
                        <div className="text-center md:text-start flex-1">
                            <div className="flex items-center gap-2 text-sm text-primary font-bold mb-2 justify-center md:justify-start">
                                <Link href={`/${locale}`} className="hover:underline flex items-center gap-1">
                                    {isAr ? <ArrowRight className="w-4 h-4 rtl:rotate-180" /> : <ArrowLeft className="w-4 h-4 rtl:rotate-180" />}
                                    {isAr ? "عودة للرئيسية" : "Back to Home"}
                                </Link>
                                <span className="text-gray-300">/</span>
                                <span>{isAr ? category.label.ar : category.label.en}</span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold mb-3 text-gray-900 dark:text-white">
                                {isAr ? category.label.ar : category.label.en}
                            </h1>
                            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl">
                                {isAr ? category.description.ar : category.description.en}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">

                {/* Desktop Sidebar */}
                <aside className="hidden lg:block w-1/4 sticky top-24 h-fit">
                    <FiltersContent />
                </aside>

                {/* Mobile Filter Trigger */}
                <div className="lg:hidden mb-4">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" className="w-full flex items-center justify-between py-6 text-lg shadow-sm">
                                <span className="flex items-center gap-2">
                                    <Filter className="w-5 h-5" />
                                    {isAr ? "التصنيفات والموقع" : "Categories & Location"}
                                </span>
                                {selectedCountry && <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{isAr ? "مفلتر" : "Filtered"}</span>}
                            </Button>
                        </SheetTrigger>
                        <SheetContent side={isAr ? "right" : "left"} className="overflow-y-auto">
                            <SheetHeader>
                                <SheetTitle className="text-start">{isAr ? "تصفية الخدمات" : "Filter Services"}</SheetTitle>
                            </SheetHeader>
                            <div className="mt-6">
                                <FiltersContent />
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Main Content Grid */}
                <main className="flex-1">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl md:text-2xl font-bold">
                            {isAr ? `تصفح ${subcategories.length} خدمات` : `Browse ${subcategories.length} Services`}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {subcategories.map((sub) => {
                            // Construct Query with Location Params
                            const queryParams = new URLSearchParams();
                            queryParams.set('q', sub.title.en); // Use English title for search
                            if (selectedCountry) queryParams.set('country', selectedCountry);
                            if (selectedCity) queryParams.set('city', selectedCity);

                            return (
                                <Link
                                    key={sub.id}
                                    href={`/${locale}/companies?${queryParams.toString()}`}
                                    className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 flex flex-col h-full"
                                >
                                    <div className="h-48 overflow-hidden relative">
                                        <img
                                            src={sub.img}
                                            alt={isAr ? sub.title.ar : sub.title.en}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />

                                        {/* Location Badge on Card if Selected */}
                                        {(selectedCountry || selectedCity) && (
                                            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                <span>
                                                    {selectedCity ? (cities as any)[selectedCountry].find((c: any) => c.id === selectedCity)[isAr ? 'ar' : 'en'] : ''}
                                                    {selectedCity && selectedCountry ? ', ' : ''}
                                                    {selectedCountry ? countries.find(c => c.id === selectedCountry)?.name[isAr ? 'ar' : 'en'] : ''}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                                            {isAr ? sub.title.ar : sub.title.en}
                                        </h3>
                                        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                                            {isAr
                                                ? "احصل على عروض أسعار من محترفين موثوقين."
                                                : "Find top-rated professionals for this service."}
                                        </p>
                                        <div className="mt-auto flex items-center text-primary font-bold text-sm gap-1 group-hover:gap-2 transition-all">
                                            {isAr ? "عرض المحترفين" : "View Pros"}
                                            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </main>
            </div>
        </div>
    );
}
