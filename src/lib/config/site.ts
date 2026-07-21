export const CANONICAL_DOMAIN = 'https://www.wassitt.com';

export const SITE_URL = 
  process.env.NODE_ENV === 'production' 
    ? (process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes('localhost')
        ? process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '')
        : CANONICAL_DOMAIN)
    : (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');

export const SITE_CONFIG = {
  name: {
    ar: 'وسيط | منصة الخدمات والشركات الأولى',
    en: 'Wassitt | Leading Services & Business Marketplace',
  },
  shortName: 'Wassitt',
  description: {
    ar: 'وسيط هي المنصة الرائدة للربط بين العملاء والشركات ومزودي الخدمات الموثوقين في العالم العربي.',
    en: 'Wassitt is the leading marketplace connecting clients with verified service providers and companies across the Arab world.',
  },
  domain: 'wassitt.com',
  canonicalUrl: CANONICAL_DOMAIN,
  defaultLocale: 'ar',
  locales: ['ar', 'en'],
  ogImage: '/images/og-image.jpg',
  twitterHandle: '@wassitt_com',
  contact: {
    email: 'support@wassitt.com',
    phone: '+963110000000',
  },
};
