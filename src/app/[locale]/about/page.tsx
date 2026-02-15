import { useTranslations } from 'next-intl';
import Image from 'next/image';

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
                {/* Mission Section */}
                <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
                    <div>
                        <h2 className="text-3xl font-bold mb-6 text-foreground">{t('mission.title')}</h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            {t('mission.description')}
                        </p>
                    </div>
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted shadow-xl hover:shadow-2xl transition-shadow duration-500">
                        {/* Placeholder for About Image - Used a div with gradient for now */}
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <span className="text-muted-foreground/50 font-medium">Mission Image</span>
                        </div>
                    </div>
                </div>

                {/* Story Section */}
                <div className="bg-card rounded-3xl p-8 md:p-12 shadow-sm border mb-20">
                    <h2 className="text-3xl font-bold mb-6 text-center">{t('story.title')}</h2>
                    <div className="max-w-3xl mx-auto text-center">
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            {t('story.description')}
                        </p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div className="p-6 bg-primary/5 rounded-2xl">
                        <div className="text-4xl font-bold text-primary mb-2">10k+</div>
                        <div className="text-sm text-muted-foreground">Certified Pros</div>
                    </div>
                    <div className="p-6 bg-primary/5 rounded-2xl">
                        <div className="text-4xl font-bold text-primary mb-2">50k+</div>
                        <div className="text-sm text-muted-foreground">Projects Done</div>
                    </div>
                    <div className="p-6 bg-primary/5 rounded-2xl">
                        <div className="text-4xl font-bold text-primary mb-2">98%</div>
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
