'use client';

import { useState, useEffect } from 'react';
import { X, Smartphone, Download } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

export function SmartAppBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [deviceType, setDeviceType] = useState<'android' | 'ios' | null>(null);
  const locale = useLocale();
  const t = useTranslations('download');

  useEffect(() => {
    setIsMounted(true);
    
    // 1. Detect Device
    const ua = navigator.userAgent.toLowerCase();
    const isAndroid = /android/.test(ua);
    const isIOS = /iphone|ipad|ipod/.test(ua);
    
    // 2. Detect Standalone (already in app)
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone ||
      ua.includes('capacitor');

    // 3. Check Dismissed Status
    const isDismissed = localStorage.getItem('smart-app-banner-dismissed');

    if ((isAndroid || isIOS) && !isStandalone && !isDismissed) {
      setDeviceType(isAndroid ? 'android' : 'ios');
      // Show after a small delay to not feel like an aggressive popup
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('smart-app-banner-dismissed', 'true');
  };

  if (!isMounted || !isVisible || !deviceType) return null;

  const downloadUrl = deviceType === 'android' 
    ? '/downloads/android.apk' 
    : `/${locale}/download`;

  return (
    <div className="bg-background border-b shadow-sm w-full relative z-[60] animate-in slide-in-from-top duration-500">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* App Info */}
        <div className="flex items-center gap-3 overflow-hidden">
          <button 
            onClick={handleDismiss}
            className="p-1 rounded-full hover:bg-muted transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
          
          <div className="h-10 w-10 rounded-lg overflow-hidden border flex-shrink-0">
            <Image 
              src="/apple-touch-icon.png" 
              alt="App Icon" 
              width={40} 
              height={40} 
              className="object-cover"
            />
          </div>
          
          <div className="min-w-0">
            <h4 className="text-xs font-bold truncate">Secure Marketplace</h4>
            <p className="text-[10px] text-muted-foreground truncate">
              {locale === 'ar' ? 'تجربة أسرع وأكثر سلاسة' : 'Faster, smoother experience'}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex-shrink-0">
          <Button 
            size="sm" 
            className="h-8 px-4 text-[11px] font-bold rounded-full"
            asChild
          >
            <Link 
              href={downloadUrl} 
              download={deviceType === 'android'}
            >
              {deviceType === 'android' 
                ? (locale === 'ar' ? 'تحميل' : 'DOWNLOAD')
                : (locale === 'ar' ? 'عرض' : 'VIEW')
              }
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
