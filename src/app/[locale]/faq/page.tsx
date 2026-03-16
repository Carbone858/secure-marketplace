'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown, HelpCircle, User, CreditCard } from 'lucide-react';

interface FaqItem {
    id: string;
    question: string;
    answer: string;
    category: 'general' | 'customers' | 'companies' | 'security';
}

export default function FaqPage() {
    const t = useTranslations('faq');
    const [openItem, setOpenItem] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<string>('all');

    const faqs: FaqItem[] = [
        { id: '1', category: 'general', question: t('questions.q1.question'), answer: t('questions.q1.answer') },
        { id: '2', category: 'general', question: t('questions.q2.question'), answer: t('questions.q2.answer') },
        { id: '3', category: 'customers', question: t('questions.q5.question'), answer: t('questions.q5.answer') },
        { id: '4', category: 'customers', question: t('questions.q6.question'), answer: t('questions.q6.answer') },
        { id: '5', category: 'companies', question: t('questions.q7.question'), answer: t('questions.q7.answer') },
        { id: '6', category: 'companies', question: t('questions.q8.question'), answer: t('questions.q8.answer') },
        { id: '7', category: 'security', question: t('questions.q3.question'), answer: t('questions.q3.answer') },
        { id: '8', category: 'security', question: t('questions.q9.question'), answer: t('questions.q9.answer') },
        { id: '9', category: 'security', question: t('questions.q10.question'), answer: t('questions.q10.answer') },
    ];

    const toggleItem = (id: string) => {
        setOpenItem(openItem === id ? null : id);
    };

    const filteredFaqs = activeCategory === 'all'
        ? faqs
        : faqs.filter(faq => faq.category === activeCategory);

    return (
        <div className="min-h-screen bg-background py-16 px-4">
            <div className="container mx-auto max-w-4xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
                    <p className="text-xl text-muted-foreground">{t('subtitle')}</p>
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    <button
                        onClick={() => setActiveCategory('all')}
                        className={`px-6 py-2 rounded-full font-medium transition-colors ${activeCategory === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
                    >
                        {t('categories.general')}
                    </button>
                    <button
                        onClick={() => setActiveCategory('customers')}
                        className={`px-6 py-2 rounded-full font-medium transition-colors flex items-center gap-2 ${activeCategory === 'customers' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
                    >
                        <User className="w-4 h-4" />
                        {t('categories.customers')}
                    </button>
                    <button
                        onClick={() => setActiveCategory('companies')}
                        className={`px-6 py-2 rounded-full font-medium transition-colors flex items-center gap-2 ${activeCategory === 'companies' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
                    >
                        <HelpCircle className="w-4 h-4" />
                        {t('categories.companies')}
                    </button>
                    <button
                        onClick={() => setActiveCategory('security')}
                        className={`px-6 py-2 rounded-full font-medium transition-colors flex items-center gap-2 ${activeCategory === 'security' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
                    >
                        <CreditCard className="w-4 h-4" />
                        {t('categories.security')}
                    </button>
                </div>

                {/* FAQ List */}
                <div className="space-y-4">
                    {filteredFaqs.map((faq) => (
                        <div
                            key={faq.id}
                            className="bg-card border rounded-xl overflow-hidden shadow-sm transition-shadow hover:shadow-md"
                        >
                            <button
                                onClick={() => toggleItem(faq.id)}
                                className="w-full flex items-center justify-between p-6 text-start focus:outline-none"
                            >
                                <span className="text-lg font-semibold">{faq.question}</span>
                                <ChevronDown
                                    className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${openItem === faq.id ? 'rotate-180' : ''}`}
                                />
                            </button>
                            <div
                                className={`transition-all duration-300 ease-in-out overflow-hidden ${openItem === faq.id ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                <div className="p-6 pt-0 text-muted-foreground leading-relaxed border-t bg-muted/30 whitespace-pre-wrap">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Still have questions? */}
                <div className="mt-16 text-center bg-primary/5 rounded-2xl p-8">
                    <h3 className="text-2xl font-bold mb-4">{t('stillQuestions')}</h3>
                    <p className="text-muted-foreground mb-6">{t('contactSupport')}</p>
                    <a href="/contact" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 transition-colors">
                        {t('contactButton')}
                    </a>
                </div>
            </div>
        </div>
    );
}
