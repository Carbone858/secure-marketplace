"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Building2, CheckCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Company {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
    averageRating: number;
    reviewCount: number;
}

export default function FeaturedCompanies() {
    const locale = useLocale();
    const t = useTranslations('home');
    const [featuredCompanies, setFeaturedCompanies] = useState<Company[]>([]);

    useEffect(() => {
        fetchFeaturedCompanies();
    }, []);

    const fetchFeaturedCompanies = async () => {
        try {
            const response = await fetch('/api/companies/search?limit=4&sortBy=rating');
            if (response.ok) {
                const data = await response.json();
                setFeaturedCompanies(data.companies);
            }
        } catch (err) {
            console.error('Failed to fetch featured companies');
        }
    };

    return (
        <section className="py-24 bg-gray-100 dark:bg-gray-900">
            <div className="container mx-auto px-4">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold mb-4">{t('featured.title')}</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        {t('featured.subtitle')}
                    </p>
                </div>

                {featuredCompanies.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featuredCompanies.map((company) => (
                            <Link
                                key={company.id}
                                href={`/${locale}/companies/${company.slug}`}
                                className="block"
                            >
                                <div className="flex flex-col items-center bg-card rounded-2xl shadow-sm p-8 h-full hover:shadow-lg transition-shadow">
                                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4 overflow-hidden">
                                        {company.logo ? (
                                            <img
                                                src={company.logo}
                                                alt={company.name}
                                                className="w-full h-full object-cover rounded-full"
                                            />
                                        ) : (
                                            <Building2 className="h-10 w-10 text-muted-foreground" />
                                        )}
                                    </div>
                                    <h3 className="font-semibold text-lg mb-1 text-center">{company.name}</h3>
                                    <div className="flex items-center gap-1 text-sm mb-2">
                                        <CheckCircle className="h-4 w-4 text-success" />
                                        <span className="text-muted-foreground">
                                            {t('featured.verified')}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Star className="h-4 w-4 text-warning fill-warning" />
                                        <span className="font-medium">
                                            {company.averageRating.toFixed(1)}
                                        </span>
                                        <span className="text-muted-foreground">
                                            {t('featured.reviewCount', { count: company.reviewCount })}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-muted/20 rounded-2xl">
                        <Building2 className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
                        <p className="text-muted-foreground text-lg">
                            {locale === 'ar' ? 'الشركات المميزة قادمة قريباً' : 'Featured companies coming soon'}
                        </p>
                        <Button variant="outline" className="mt-4" asChild>
                            <Link href={`/${locale}/company/register`}>
                                {locale === 'ar' ? 'سجل شركتك الآن' : 'Register your company'}
                            </Link>
                        </Button>
                    </div>
                )}
            </div>
        </section>
    );
}
