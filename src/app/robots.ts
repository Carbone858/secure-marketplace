import { MetadataRoute } from 'next';
import { CANONICAL_DOMAIN } from '@/lib/config/site';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? CANONICAL_DOMAIN 
    : (process.env.NEXT_PUBLIC_APP_URL || CANONICAL_DOMAIN).replace(/\/$/, '');

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/dashboard/',
          '/api/',
          '/auth/',
          '/dev/',
          '/maintenance/',
          '/*?*', // Prevent duplicate query params crawling where unnecessary
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
