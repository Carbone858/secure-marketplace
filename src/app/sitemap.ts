import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://secure-marketplace.com';
  const locales = ['en', 'ar'];
  const paths = ['', '/companies', '/requests'];
  
  const sitemaps: MetadataRoute.Sitemap = [];
  
  // 1. Core static/locale-scoped pages
  for (const locale of locales) {
    for (const path of paths) {
      sitemaps.push({
        url: `${baseUrl}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: path === '' ? 1.0 : 0.8,
      });
    }
  }

  try {
    // 2. Fetch real active companies (non-demo)
    const realCompanies = await prisma.company.findMany({
      where: {
        isDemo: false,
        isActive: true,
        verificationStatus: 'VERIFIED'
      },
      select: {
        slug: true,
        updatedAt: true
      },
      take: 1000 // Safely cap output for sitemap
    });

    for (const locale of locales) {
      for (const company of realCompanies) {
        sitemaps.push({
          url: `${baseUrl}/${locale}/companies/${company.slug}`,
          lastModified: company.updatedAt,
          changeFrequency: 'weekly',
          priority: 0.6,
        });
      }
    }

    // 3. Fetch real active public requests (non-demo)
    const realRequests = await prisma.serviceRequest.findMany({
      where: {
        isDemo: false,
        isActive: true,
        status: 'ACTIVE',
        visibility: 'PUBLIC'
      },
      select: {
        id: true,
        updatedAt: true
      },
      take: 1000 // Safely cap output for sitemap
    });

    for (const locale of locales) {
      for (const request of realRequests) {
        sitemaps.push({
          url: `${baseUrl}/${locale}/requests/${request.id}`,
          lastModified: request.updatedAt,
          changeFrequency: 'weekly',
          priority: 0.5,
        });
      }
    }
  } catch (error) {
    console.error('[Sitemap Generation Error] Dynamic route compilation failed:', error);
    // Fallback to static URLs in case DB is unreachable during build or execution
  }
  
  return sitemaps;
}

