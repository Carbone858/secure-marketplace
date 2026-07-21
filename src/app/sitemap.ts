import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { categories } from '@/lib/services-data';
import { CANONICAL_DOMAIN } from '@/lib/config/site';

// Ensure Next.js revalidates the sitemap dynamically every 1 hour (3600 seconds)
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? CANONICAL_DOMAIN 
    : (process.env.NEXT_PUBLIC_APP_URL || CANONICAL_DOMAIN).replace(/\/$/, '');

  const locales = ['ar', 'en'];
  const sitemaps: MetadataRoute.Sitemap = [];

  // Helper to build entry with hreflang alternates for ar and en
  const createEntry = (
    path: string, 
    lastModified: Date = new Date(), 
    changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' = 'daily',
    priority: number = 0.8
  ) => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    
    for (const locale of locales) {
      const url = `${baseUrl}/${locale}${cleanPath === '/' ? '' : cleanPath}`;
      const alternateAr = `${baseUrl}/ar${cleanPath === '/' ? '' : cleanPath}`;
      const alternateEn = `${baseUrl}/en${cleanPath === '/' ? '' : cleanPath}`;
      
      sitemaps.push({
        url,
        lastModified,
        changeFrequency,
        priority: cleanPath === '/' ? 1.0 : priority,
        alternates: {
          languages: {
            ar: alternateAr,
            en: alternateEn,
            'x-default': alternateAr,
          },
        },
      });
    }
  };

  // 1. All Valid Public Static Pages (2 locales each)
  const staticPaths = [
    '/',
    '/companies',
    '/requests',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/faq',
    '/for-companies',
    '/for-customers',
    '/pricing',
    '/membership',
    '/landing',
    '/press',
    '/stories',
    '/careers',
    '/download',
    '/status',
  ];

  for (const path of staticPaths) {
    const priority = path === '/' ? 1.0 : (path === '/companies' || path === '/requests' ? 0.9 : 0.7);
    createEntry(path, new Date(), 'daily', priority);
  }

  // 2. All 12 Public Category Service Pages (2 locales each)
  for (const category of categories) {
    createEntry(`/services/${category.id}`, new Date(), 'weekly', 0.8);
  }

  try {
    // 3. Query ONLY Real, Active, Verified Companies (Strictly excluding demo accounts isDemo: false)
    const realCompanies = await prisma.company.findMany({
      where: {
        isDemo: false,
        isActive: true,
        verificationStatus: 'VERIFIED',
      },
      select: {
        slug: true,
        updatedAt: true,
      },
      take: 2000,
    });

    for (const company of realCompanies) {
      if (company.slug) {
        createEntry(`/companies/${company.slug}`, company.updatedAt || new Date(), 'weekly', 0.65);
      }
    }

    // 4. Query ONLY Real, Active, Public Service Requests (Strictly excluding demo requests isDemo: false)
    const realRequests = await prisma.serviceRequest.findMany({
      where: {
        isDemo: false,
        isActive: true,
        status: 'ACTIVE',
        visibility: 'PUBLIC',
      },
      select: {
        id: true,
        updatedAt: true,
      },
      take: 2000,
    });

    for (const request of realRequests) {
      if (request.id) {
        createEntry(`/requests/${request.id}`, request.updatedAt || new Date(), 'weekly', 0.6);
      }
    }

    // 5. Query Active Database Categories if additional ones exist
    const dbCategories = await prisma.category.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });

    for (const cat of dbCategories) {
      if (cat.slug && !categories.some(c => c.id === cat.slug)) {
        createEntry(`/services/${cat.slug}`, cat.updatedAt || new Date(), 'weekly', 0.75);
      }
    }
  } catch (error) {
    console.error('[Sitemap Generation Warning] Database query bypassed during sitemap build:', error);
  }

  return sitemaps;
}
