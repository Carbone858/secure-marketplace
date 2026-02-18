'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

// Define schema with keys for translation lookup
const contactSchema = z.object({
    name: z.string().min(2, { message: 'nameLength' }),
    email: z.string().email({ message: 'emailInvalid' }),
    subject: z.string().min(5, { message: 'subjectRequired' }),
    message: z.string().min(10, { message: 'messageLength' }),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactForm() {
    const t = useTranslations('contact.form');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ContactFormValues>({
        resolver: zodResolver(contactSchema),
    });

    async function onSubmit(data: ContactFormValues) {
        setIsSubmitting(true);
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 2000));

            console.log('Form Submitted:', data);
            toast.success(t('success'));
            reset();
        } catch (error) {
            toast.error(t('error'));
        } finally {
            setIsSubmitting(false);
        }
    }

    // Helper to get translated error message
    const getErrorMessage = (error: any) => {
        if (!error?.message) return null;
        // Try to translate if key exists in 'validation', else fallback to raw message
        return t.has(`validation.${error.message}`)
            ? t(`validation.${error.message}`)
            : error.message;
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full flex flex-col justify-center"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                {/* Name */}
                <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground/90 font-medium">
                        {t('name')} <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="name"
                        {...register('name')}
                        placeholder={t('placeholders.name')}
                        className={`bg-background/50 backdrop-blur-sm transition-all focus:ring-2 focus:ring-primary/20 ${errors.name ? 'border-destructive focus:ring-destructive/20' : ''}`}
                    />
                    {errors.name && (
                        <p className="text-sm text-destructive animate-in slide-in-from-top-1 fade-in">
                            {getErrorMessage(errors.name)}
                        </p>
                    )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground/90 font-medium">
                        {t('email')} <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        {...register('email')}
                        placeholder={t('placeholders.email')}
                        className={`bg-background/50 backdrop-blur-sm transition-all focus:ring-2 focus:ring-primary/20 ${errors.email ? 'border-destructive focus:ring-destructive/20' : ''}`}
                    />
                    {errors.email && (
                        <p className="text-sm text-destructive animate-in slide-in-from-top-1 fade-in">
                            {getErrorMessage(errors.email)}
                        </p>
                    )}
                </div>

                {/* Subject */}
                <div className="space-y-2">
                    <Label htmlFor="subject" className="text-foreground/90 font-medium">
                        {t('subject')} <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="subject"
                        {...register('subject')}
                        placeholder={t('placeholders.subject')}
                        className={`bg-background/50 backdrop-blur-sm transition-all focus:ring-2 focus:ring-primary/20 ${errors.subject ? 'border-destructive focus:ring-destructive/20' : ''}`}
                    />
                    {errors.subject && (
                        <p className="text-sm text-destructive animate-in slide-in-from-top-1 fade-in">
                            {getErrorMessage(errors.subject)}
                        </p>
                    )}
                </div>

                {/* Message */}
                <div className="space-y-2">
                    <Label htmlFor="message" className="text-foreground/90 font-medium">
                        {t('message')} <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                        id="message"
                        {...register('message')}
                        placeholder={t('placeholders.message')}
                        className={`min-h-[160px] resize-y bg-background/50 backdrop-blur-sm transition-all focus:ring-2 focus:ring-primary/20 ${errors.message ? 'border-destructive focus:ring-destructive/20' : ''}`}
                    />
                    {errors.message && (
                        <p className="text-sm text-destructive animate-in slide-in-from-top-1 fade-in">
                            {getErrorMessage(errors.message)}
                        </p>
                    )}
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300"
                    disabled={isSubmitting}
                    size="lg"
                >
                    {isSubmitting ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>{t('sending')}</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <span>{t('send')}</span>
                            <Send className="h-4 w-4" />
                        </div>
                    )}
                </Button>
            </form>
        </motion.div>
    );
}
