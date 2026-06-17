import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
    const t = await getTranslations({ locale, namespace: 'about' });
    return {
        title: t('meta.title'),
        description: t('meta.description'),
    };
}

export default function AboutPage() {
    const t = useTranslations('about');

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="relative h-[400px] w-full bg-primary/5 flex items-center justify-center overflow-hidden">
                <div className="container px-4 text-center z-10">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                        {t('title')}
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        {t('subtitle')}
                    </p>
                </div>
                {/* Abstract background blobs */}
                <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2" />
                <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl -translate-y-1/2" />
            </div>

            <div className="container mx-auto px-4 py-16 max-w-5xl">
                {/* About Us Section */}
                <div className="grid md:grid-cols-12 gap-12 items-center mb-24">
                    <div className="md:col-span-7 flex flex-col justify-center">
                        <h2 className="text-3xl font-bold mb-6 text-foreground border-b pb-2 inline-block max-w-max">
                            {t('title')}
                        </h2>
                        <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed text-start">
                            {(t.raw('paragraphs') as string[]).map((para, i) => (
                                <p key={i} className={i === 0 ? "text-lg md:text-xl font-medium text-foreground border-l-4 border-primary pl-4 rtl:border-l-0 rtl:border-r-4 rtl:pl-0 rtl:pr-4" : ""}>
                                    {para}
                                </p>
                            ))}
                        </div>
                    </div>
                    <div className="md:col-span-5 relative aspect-square md:aspect-auto md:h-[500px] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-500 border bg-card">
                        <Image
                            src="/images/about_us_hero.png"
                            alt={t('title')}
                            fill
                            className="object-cover"
                            sizes="(max-w-768px) 100vw, 33vw"
                            priority
                        />
                    </div>
                </div>

                {/* Story Section */}
                <div className="bg-card rounded-3xl p-8 md:p-12 shadow-sm border mb-24">
                    <h2 className="text-3xl font-bold mb-8 text-center text-foreground">{t('story.title')}</h2>
                    <div className="max-w-3xl mx-auto space-y-6 text-base md:text-lg text-muted-foreground leading-relaxed text-start">
                        {(t.raw('story.paragraphs') as string[]).map((para, i) => (
                            <p key={i}>
                                {para}
                            </p>
                        ))}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div className="p-6 bg-primary/5 rounded-2xl">
                        <div className="text-4xl font-bold text-primary mb-2">150+</div>
                        <div className="text-sm text-muted-foreground">Certified Pros</div>
                    </div>
                    <div className="p-6 bg-primary/5 rounded-2xl">
                        <div className="text-4xl font-bold text-primary mb-2">800+</div>
                        <div className="text-sm text-muted-foreground">Projects Done</div>
                    </div>
                    <div className="p-6 bg-primary/5 rounded-2xl">
                        <div className="text-4xl font-bold text-primary mb-2">99%</div>
                        <div className="text-sm text-muted-foreground">Satisfaction</div>
                    </div>
                    <div className="p-6 bg-primary/5 rounded-2xl">
                        <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                        <div className="text-sm text-muted-foreground">Support</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
