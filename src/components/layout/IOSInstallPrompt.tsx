'use client';

import { useState, useEffect } from 'react';
import { Share, PlusSquare, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocale } from 'next-intl';

export function IOSInstallPrompt() {
    const [isVisible, setIsVisible] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const locale = useLocale();
    const isRTL = locale === 'ar';

    useEffect(() => {
        setIsMounted(true);
        
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

    if (!isMounted || !isVisible) return null;

    return (
        <div className="fixed bottom-6 left-4 right-4 z-[100] animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Pulsing Arrow pointing to Safari navigation bar */}
            <div className="flex justify-center mb-2 animate-bounce">
                <div className="bg-primary text-white p-2 rounded-full shadow-lg">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14M19 12l-7 7-7-7"/>
                    </svg>
                </div>
            </div>

            <div className="bg-card border-2 border-primary/20 shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-2xl p-5 relative overflow-hidden">
                <button 
                    onClick={handleDismiss}
                    className="absolute top-2 end-2 p-2 rounded-full hover:bg-muted transition-colors"
                >
                    <X className="h-4 w-4 text-muted-foreground" />
                </button>

                <div className="flex gap-4">
                    <div className="flex-shrink-0 h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                        <PlusSquare className="h-8 w-8" />
                    </div>
                    
                    <div className="flex-1 space-y-2 pe-6">
                        <h3 className="font-bold text-base">
                            {isRTL ? 'ثبت التطبيق على هاتفك' : 'Install on iPhone'}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                            {isRTL 
                                ? 'هذا الموقع يعمل كـتطبيق! اضغط على أيقونة المشاركة في أسفل الشاشة ثم اختر "إضافة إلى الشاشة الرئيسية".'
                                : 'This site works as an app! Tap the Share icon at the very bottom of your screen and select "Add to Home Screen".'}
                        </p>
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-center gap-3 py-3 bg-primary/5 rounded-xl border border-primary/10">
                    <div className="flex items-center gap-2 text-xs font-bold text-primary">
                        <Share className="h-4 w-4" />
                        <span>{isRTL ? 'أيقونة المشاركة في متصفح Safari' : 'Safari Share Button'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
