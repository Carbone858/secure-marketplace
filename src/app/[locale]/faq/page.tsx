'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown, HelpCircle, User, CreditCard } from 'lucide-react';

interface FaqItem {
    id: string;
    question: string;
    answer: string;
    category: 'general' | 'account' | 'payments';
}

const faqs: FaqItem[] = [
    {
        id: '1',
        category: 'general',
        question: 'How does Secure Service Marketplace work?',
        answer: 'Post a detailed service request describing what you need. Verified companies in your area will view your request and send you competitive offers. You can compare profiles, ratings, and prices to choose the best pro.'
    },
    {
        id: '2',
        category: 'general',
        question: 'Is it free to post a request?',
        answer: 'Yes! Posting service requests is completely free for customers. There are no hidden fees.'
    },
    {
        id: '3',
        category: 'account',
        question: 'How do I know the companies are trustworthy?',
        answer: 'All companies go through a verification process where we check their business documents and identity. We also allow customers to leave verified reviews after a job is completed.'
    },
    {
        id: '4',
        category: 'account',
        question: 'Can I cancel my request?',
        answer: 'Yes, you can cancel your request at any time from your dashboard as long as you haven\'t accepted an offer yet.'
    },
    {
        id: '5',
        category: 'payments',
        question: 'How do I pay the service provider?',
        answer: 'Currently, payment terms are agreed upon directly between you and the service provider. We recommend using secure payment methods and never paying the full amount upfront.'
    },
    {
        id: '6',
        category: 'payments',
        question: 'Do pros pay to use the platform?',
        answer: 'Service providers may pay a subscription fee or a small fee to send offers. This ensures we attract serious professionals committed to quality work.'
    }
];

export default function FaqPage() {
    const t = useTranslations('faq');
    const [openItem, setOpenItem] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<string>('all');

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
                        className={`px-6 py-2 rounded-full font-medium transition-colors ${activeCategory === 'all' ? 'bg-primary text-secondary-foreground' : 'bg-muted hover:bg-muted/80'}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setActiveCategory('general')}
                        className={`px-6 py-2 rounded-full font-medium transition-colors flex items-center gap-2 ${activeCategory === 'general' ? 'bg-primary text-secondary-foreground' : 'bg-muted hover:bg-muted/80'}`}
                    >
                        <HelpCircle className="w-4 h-4" />
                        {t('categories.general')}
                    </button>
                    <button
                        onClick={() => setActiveCategory('account')}
                        className={`px-6 py-2 rounded-full font-medium transition-colors flex items-center gap-2 ${activeCategory === 'account' ? 'bg-primary text-secondary-foreground' : 'bg-muted hover:bg-muted/80'}`}
                    >
                        <User className="w-4 h-4" />
                        {t('categories.account')}
                    </button>
                    <button
                        onClick={() => setActiveCategory('payments')}
                        className={`px-6 py-2 rounded-full font-medium transition-colors flex items-center gap-2 ${activeCategory === 'payments' ? 'bg-primary text-secondary-foreground' : 'bg-muted hover:bg-muted/80'}`}
                    >
                        <CreditCard className="w-4 h-4" />
                        {t('categories.payments')}
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
                                className={`transition-all duration-300 ease-in-out overflow-hidden ${openItem === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                <div className="p-6 pt-0 text-muted-foreground leading-relaxed border-t bg-muted/30">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Still have questions? */}
                <div className="mt-16 text-center bg-primary/5 rounded-2xl p-8">
                    <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
                    <p className="text-muted-foreground mb-6">Can't find the answer you're looking for? Please contact our friendly support team.</p>
                    <a href="/contact" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors">
                        Contact Support
                    </a>
                </div>
            </div>
        </div>
    );
}
