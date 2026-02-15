import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
    const t = useTranslations('contact');

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-primary/5 py-24 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('title')}</h1>
                <p className="text-xl text-muted-foreground">{t('subtitle')}</p>
            </div>

            <div className="container mx-auto px-4 py-16 -mt-16 max-w-5xl">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Contact Info Card */}
                    <div className="bg-card rounded-2xl shadow-lg p-8 h-full border">
                        <h2 className="text-2xl font-bold mb-8">Get in Touch</h2>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">{t('form.email')}</h3>
                                    <p className="text-muted-foreground">{t('info.email')}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">{t('form.phone')}</h3>
                                    <p className="text-muted-foreground">{t('info.phone')}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Address</h3>
                                    <p className="text-muted-foreground">{t('info.address')}</p>
                                </div>
                            </div>
                        </div>

                        {/* Map Placeholder */}
                        <div className="mt-12 w-full h-48 bg-muted rounded-xl flex items-center justify-center text-muted-foreground overflow-hidden">
                            <span className="text-sm">Map Integration Coming Soon</span>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-card rounded-2xl shadow-lg p-8 h-full border">
                        <h2 className="text-2xl font-bold mb-6">Send Message</h2>
                        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t('form.name')}</label>
                                <Input placeholder="Your name" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t('form.email')}</label>
                                <Input type="email" placeholder="your@email.com" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t('form.subject')}</label>
                                <Input placeholder="What is this regarding?" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t('form.message')}</label>
                                <Textarea placeholder="Type your message here..." className="min-h-[150px]" />
                            </div>

                            <Button className="w-full" size="lg">
                                {t('form.send')}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
