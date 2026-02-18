'use client';

import { useTranslations } from 'next-intl';
import { Mail, Phone, MapPin, MessageSquare, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import ContactForm from './ContactForm';

export default function ContactPageContent() {
    const t = useTranslations('contact');

    // Staggered animation variants
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
            },
        },
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 50 } },
    };

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent -z-10" />
            <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10 opacity-40 animate-pulse" />
            <div className="absolute bottom-0 left-10 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] -z-10 opacity-30" />

            <div className="container mx-auto px-4 py-16 md:py-24 max-w-7xl">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl mx-auto mb-16 space-y-4"
                >
                    <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4 ring-1 ring-primary/20 backdrop-blur-sm">
                        <MessageSquare className="w-4 h-4 text-primary mr-2" />
                        <span className="text-sm font-medium text-primary px-2">{t('sections.getInTouch')}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 pb-2">
                        {t('title')}
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                        {t('subtitle')}
                    </p>
                </motion.div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start"
                >
                    {/* Left Column: Contact Info & Map */}
                    <div className="lg:col-span-5 space-y-8">
                        {/* Info Cards */}
                        <motion.div className="grid gap-6">
                            <motion.div variants={item}>
                                <Card className="p-6 flex items-start hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-primary/10 bg-card/60 backdrop-blur-md group cursor-pointer overflow-hidden">
                                    <div className="p-4 bg-primary/10 rounded-2xl text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 z-10 me-4">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 min-w-0 z-10 relative">
                                        <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">{t('form.email')}</h3>
                                        <p className="text-muted-foreground text-sm mb-2">{t('cards.emailDesc')}</p>
                                        <a href={`mailto:${t('info.email')}`} className="text-foreground font-medium hover:text-primary transition-colors flex items-center gap-1 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 duration-300">
                                            {t('info.email')} <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity rtl:rotate-180" />
                                        </a>
                                    </div>
                                </Card>
                            </motion.div>

                            <motion.div variants={item}>
                                <Card className="p-6 flex items-start hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-primary/10 bg-card/60 backdrop-blur-md group cursor-pointer overflow-hidden">
                                    <div className="p-4 bg-primary/10 rounded-2xl text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 z-10 me-4">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 min-w-0 z-10 relative">
                                        <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">{t('form.phone')}</h3>
                                        <p className="text-muted-foreground text-sm mb-2">{t('cards.phoneDesc')}</p>
                                        <a href={`tel:${t('info.phone')}`} className="text-foreground font-medium hover:text-primary transition-colors flex items-center gap-1 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 duration-300">
                                            {t('info.phone')} <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity rtl:rotate-180" />
                                        </a>
                                    </div>
                                </Card>
                            </motion.div>

                            <motion.div variants={item}>
                                <Card className="p-6 flex items-start hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-primary/10 bg-card/60 backdrop-blur-md group cursor-pointer overflow-hidden">
                                    <div className="p-4 bg-primary/10 rounded-2xl text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 z-10 me-4">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 min-w-0 z-10 relative">
                                        <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">{t('form.office')}</h3>
                                        <p className="text-muted-foreground text-sm mb-2">{t('cards.officeDesc')}</p>
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(t('info.address'))}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-foreground font-medium w-3/4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform duration-300 block hover:text-primary hover:underline"
                                        >
                                            {t('info.address')}
                                        </a>
                                    </div>
                                </Card>
                            </motion.div>
                        </motion.div>

                        {/* Visual Map Placeholder */}
                        <motion.div variants={item} className="relative w-full h-64 rounded-3xl overflow-hidden shadow-xl border border-border/50 group">
                            <div className="absolute inset-0 bg-muted flex items-center justify-center overflow-hidden">
                                {/* Use a gradient or pattern instead of image to be safer */}
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900" />
                                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#444_1px,transparent_1px)] [background-size:16px_16px]" />

                                <div className="flex flex-col items-center justify-center z-10 text-muted-foreground transform transition-transform duration-500 group-hover:scale-105">
                                    <div className="relative">
                                        <div className="absolute -inset-4 bg-primary/20 rounded-full blur-lg animate-pulse" />
                                        <div className="p-4 bg-background/80 backdrop-blur-md rounded-full shadow-lg mb-3 relative ring-1 ring-primary/20">
                                            <MapPin className="w-8 h-8 text-primary fill-primary/10" />
                                        </div>
                                    </div>
                                    <span className="font-semibold text-sm bg-background/80 px-4 py-1.5 rounded-full backdrop-blur-md shadow-sm border border-border/50 text-foreground">
                                        {t('info.address')}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Contact Form */}
                    <motion.div variants={item} className="lg:col-span-7 h-full">
                        <Card className="h-full p-8 md:p-10 shadow-2xl shadow-primary/5 border-primary/10 bg-card/80 backdrop-blur-xl relative overflow-hidden flex flex-col justify-center">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-bl-[100px] -mr-16 -mt-16 transition-transform hover:scale-110 duration-1000 ease-in-out pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-40 h-40 bg-accent/5 rounded-tr-[80px] -ml-10 -mb-10 transition-transform hover:scale-110 duration-1000 ease-in-out pointer-events-none" />

                            <div className="mb-8 relative z-10">
                                <h2 className="text-3xl font-bold mb-3 tracking-tight">{t('sections.sendMessage')}</h2>
                                <p className="text-muted-foreground text-lg">
                                    {t('sections.fillForm')}
                                </p>
                            </div>

                            <div className="relative z-10">
                                <ContactForm />
                            </div>
                        </Card>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
