"use client";

import { useTranslations } from "next-intl";

export default function Statistics() {
    const t = useTranslations('home');

    const stats = [
        { value: '10K+', label: t('stats.verifiedCompanies') },
        { value: '50K+', label: t('stats.serviceRequests') },
        { value: '100K+', label: t('stats.happyCustomers') },
        { value: '4.8', label: t('stats.averageRating') },
    ];

    return (
        <section className="py-12 bg-background/50 border-y">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                    {stats.map((stat) => (
                        <div key={stat.label} className="flex flex-col items-center justify-center bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
                            <span className="mb-3 flex items-center justify-center h-10 w-10 rounded-full bg-primary/10">
                                {/* Icons could be added here later if needed */}
                            </span>
                            <p className="text-2xl md:text-3xl font-bold text-primary">
                                {stat.value}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1 text-center font-medium">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
