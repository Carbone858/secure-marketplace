'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Hammer, Cog, Clock, Mail, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function MaintenancePage() {
  const t = useTranslations('maintenance');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  return (
    <div 
      className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center overflow-hidden relative"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <motion.div 
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-24 -left-24 w-96 h-96 bg-primary/30 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            rotate: -360,
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Animated Icons */}
          <div className="flex justify-center gap-4 mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="p-4 bg-primary/10 rounded-2xl text-primary"
            >
              <Cog className="w-12 h-12" />
            </motion.div>
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-500"
            >
              <Hammer className="w-12 h-12" />
            </motion.div>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-foreground mb-6 tracking-tight">
            {isRTL ? 'نعمل على تحسين تجربتكم' : 'Under Maintenance'}
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
            {isRTL 
              ? 'سوق الخدمات يخضع حالياً لبعض التحسينات المجدولة. سنعود قريباً بأدوات أفضل لمساعدتكم.'
              : 'Service Marketplace is currently undergoing scheduled improvements. We\'ll be back shortly with better tools to serve you.'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <Clock className="w-6 h-6" />
              </div>
              <div className="text-start">
                <p className="text-sm text-muted-foreground">{isRTL ? 'الوقت المتوقع' : 'Estimated Time'}</p>
                <p className="font-bold text-foreground">{isRTL ? 'حوالي ساعتين' : 'Approx. 2 hours'}</p>
              </div>
            </div>
            <div className="bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500">
                <Mail className="w-6 h-6" />
              </div>
              <div className="text-start">
                <p className="text-sm text-muted-foreground">{isRTL ? 'تواصل معنا' : 'Contact Support'}</p>
                <p className="font-bold text-foreground">support@servicemarket.com</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-all flex items-center gap-2"
            >
              <Globe className="w-5 h-5" />
              {isRTL ? 'تحديث الصفحة' : 'Check Again'}
            </button>
            <Link 
              href={`/${locale}/status`}
              className="px-8 py-3 bg-secondary text-secondary-foreground rounded-xl font-bold hover:bg-secondary/80 transition-all"
            >
              {isRTL ? 'حالة النظام' : 'System Status'}
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-16 pt-8 border-t border-border/50 text-sm text-muted-foreground"
        >
          &copy; {new Date().getFullYear()} ServiceMarket. {isRTL ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
        </motion.div>
      </div>
    </div>
  );
}
