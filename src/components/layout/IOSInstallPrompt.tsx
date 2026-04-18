'use client';

import { useState, useEffect } from 'react';
import { Share, PlusSquare, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocale } from 'next-intl';

export function IOSInstallPrompt() {
    const [isVisible, setIsVisible] = useState(false);
    const locale = useLocale();
    const isRTL = locale === 'ar';

    useEffect(() => {
        // 1. Detect if it's an iOS device
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        
        // 2. Detect if it's already in standalone mode (installed)
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;

        // 3. User hasn't dismissed it yet
        const isDismissed = localStorage.getItem('ios-install-prompt-dismissed');

        if (isIOS && !isStandalone && !isDismissed) {
            // Show prompt after a short delay
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem('ios-install-prompt-dismissed', 'true');
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-20 left-4 right-4 z-[100] animate-in fade-in slide-in-from-bottom-5 duration-500">
            <div className="bg-card border shadow-2xl rounded-2xl p-4 relative overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
                
                <button 
                    onClick={handleDismiss}
                    className="absolute top-2 end-2 p-1 rounded-full hover:bg-muted transition-colors"
                >
                    <X className="h-4 w-4 text-muted-foreground" />
                </button>

                <div className="flex gap-4">
                    <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                        <PlusSquare className="h-6 w-6" />
                    </div>
                    
                    <div className="flex-1 space-y-1 pe-6">
                        <h3 className="font-bold text-sm">
                            {isRTL ? 'تثبيت التطبيق' : 'Install App'}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            {isRTL 
                                ? 'للوصول السريع، اضغط على أيقونة المشاركة ثم "إضافة إلى الشاشة الرئيسية"'
                                : 'For quick access, tap the Share icon and then "Add to Home Screen"'}
                        </p>
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-center gap-3 py-2 bg-muted/50 rounded-lg text-[10px] font-medium text-muted-foreground italic">
                    <Share className="h-3 w-3" />
                    <span>{isRTL ? 'أيقونة المشاركة في شريط Safari السفلي' : 'Share icon in Safari bottom bar'}</span>
                </div>
            </div>
        </div>
    );
}
