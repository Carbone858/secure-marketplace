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

    if (!isStandalone && !isDismissed) {
      if (isAndroid) setDeviceType('android');
      else if (isIOS) setDeviceType('ios');
      else setDeviceType(null); // Fallback for Desktop (will use redirect logic)
      
      // Show after a small delay
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('smart-app-banner-dismissed', 'true');
  };

  if (!isMounted || !isVisible) return null;

  // Logic: Android gets direct APK, iOS and Desktop get the Guide/Download page
  const isMobile = deviceType !== null;
  const isDirectDownload = deviceType === 'android';
  const downloadUrl = isDirectDownload 
    ? '/downloads/android.apk' 
    : `/${locale}/download`;

  if (isMobile) {
    return (
      <div className="bg-background border-b shadow-sm w-full relative z-[60] animate-in slide-in-from-top duration-500">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <button 
              onClick={handleDismiss}
              className="p-1 rounded-full hover:bg-muted transition-colors flex-shrink-0"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
            <div className="h-10 w-10 rounded-lg overflow-hidden border flex-shrink-0">
              <Image src="/apple-touch-icon.png" alt="App Icon" width={40} height={40} className="object-cover" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold truncate">Secure Marketplace</h4>
              <p className="text-[10px] text-muted-foreground truncate">
                {locale === 'ar' ? 'تجربة أسرع وأكثر سلاسة' : 'Faster, smoother experience'}
              </p>
            </div>
          </div>
          <Button size="sm" className="h-8 px-4 text-[11px] font-bold rounded-full" asChild>
            <Link href={downloadUrl} download={isDirectDownload}>
              {isDirectDownload ? (locale === 'ar' ? 'تحميل' : 'DOWNLOAD') : (locale === 'ar' ? 'عرض' : 'VIEW')}
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Desktop Floating Popup
  return (
    <div className="fixed bottom-6 left-6 z-[100] w-72 animate-in slide-in-from-bottom-10 fade-in duration-700">
      <div className="bg-card border-2 shadow-2xl rounded-2xl p-4 relative overflow-hidden">
        <button 
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted transition-colors"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl overflow-hidden border shadow-sm">
              <Image src="/apple-touch-icon.png" alt="App Icon" width={48} height={48} className="object-cover" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Mobile App</h4>
              <p className="text-xs text-muted-foreground leading-tight">
                {locale === 'ar' ? 'استخدم المنصة على هاتفك' : 'Use the platform on your phone'}
              </p>
            </div>
          </div>
          
          <Button className="w-full font-bold py-5 rounded-xl shadow-lg shadow-primary/20" asChild>
            <Link href={downloadUrl}>
              <Download className="mr-2 h-4 w-4" />
              {locale === 'ar' ? 'تحميل التطبيق' : 'Get the App'}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
