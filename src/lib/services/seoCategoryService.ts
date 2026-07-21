import { prisma } from '@/lib/prisma';
import { categories as mainCategories, subcategories as subcategoryDict } from '@/lib/services-data';

export interface ResolvedCategory {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  isSubcategory: boolean;
  parentCategoryId?: string;
  parentCategoryNameAr?: string;
  parentCategoryNameEn?: string;
}

export interface ResolvedCity {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  countryCode: string;
}

// Category Aliases mapping common search terms to normalized IDs
const CATEGORY_ALIASES: Record<string, string> = {
  'electrician': 'electrician',
  'electricity': 'electrician',
  'plumbing': 'plumber',
  'plumber': 'plumber',
  'ac-repair': 'ac-services',
  'ac-services': 'ac-services',
  'home-cleaning': 'home-cleaning',
  'cleaning': 'home-cleaning',
  'painting': 'painter',
  'painter': 'painter',
  'furniture-moving': 'furniture-moving',
  'moving': 'furniture-moving',
  'real-estate-sale-rent': 'home-sales-rentals',
  'contracting': 'contracting',
  'engineering-supervision': 'engineering-supervision',
  'airport-transfer': 'airport-driver',
  'airport-driver': 'airport-driver',
  'private-driver': 'personal-driver',
  'company-formation': 'business-setup',
  'company-registration': 'company-registration',
  'web-development': 'web-design',
  'programming': 'programming',
  'cybersecurity': 'cybersecurity',
  'digital-marketing': 'digital-marketing',
};

export async function resolveCategory(categorySlug: string): Promise<ResolvedCategory | null> {
  const normalizedSlug = CATEGORY_ALIASES[categorySlug.toLowerCase()] || categorySlug.toLowerCase();

  // 1. Check main categories in services-data
  const mainCat = mainCategories.find(c => c.id.toLowerCase() === normalizedSlug);
  if (mainCat) {
    return {
      id: mainCat.id,
      slug: mainCat.id,
      nameAr: mainCat.label.ar,
      nameEn: mainCat.label.en,
      descriptionAr: mainCat.description.ar,
      descriptionEn: mainCat.description.en,
      isSubcategory: false,
    };
  }

  // 2. Check subcategories in services-data
  for (const [parentId, subList] of Object.entries(subcategoryDict)) {
    const parentCat = mainCategories.find(c => c.id === parentId);
    const subItem = subList.find(s => s.id.toLowerCase() === normalizedSlug);
    if (subItem) {
      return {
        id: subItem.id,
        slug: subItem.id,
        nameAr: subItem.title.ar,
        nameEn: subItem.title.en,
        descriptionAr: `أفضل خدمات ${subItem.title.ar} الموثوقة مع ضمان الجودة وأنسب الأسعار.`,
        descriptionEn: `Find top-rated ${subItem.title.en} services with verified quality and competitive rates.`,
        isSubcategory: true,
        parentCategoryId: parentId,
        parentCategoryNameAr: parentCat?.label.ar,
        parentCategoryNameEn: parentCat?.label.en,
      };
    }
  }

  // 3. Fallback to Database Category table
  try {
    const dbCat = await prisma.category.findUnique({
      where: { slug: categorySlug },
      include: { parent: true },
    });

    if (dbCat && dbCat.isActive) {
      return {
        id: dbCat.id,
        slug: dbCat.slug,
        nameAr: dbCat.nameAr || dbCat.name,
        nameEn: dbCat.nameEn,
        descriptionAr: `أفضل خدمات ${dbCat.nameAr || dbCat.name} الموثوقة.`,
        descriptionEn: `Find top-rated ${dbCat.nameEn} services.`,
        isSubcategory: !!dbCat.parentId,
        parentCategoryId: dbCat.parentId || undefined,
        parentCategoryNameAr: dbCat.parent?.nameAr || undefined,
        parentCategoryNameEn: dbCat.parent?.nameEn || undefined,
      };
    }
  } catch (err) {
    console.error('Error resolving category from database:', err);
  }

  return null;
}

export async function resolveSyrianCity(citySlug: string): Promise<ResolvedCity | null> {
  try {
    const city = await prisma.city.findFirst({
      where: {
        slug: citySlug.toLowerCase(),
        country: {
          code: 'SY',
        },
        isActive: true,
      },
      include: {
        country: true,
      },
    });

    if (city) {
      return {
        id: city.id,
        slug: city.slug,
        nameAr: city.nameAr,
        nameEn: city.nameEn,
        countryCode: city.country.code,
      };
    }
  } catch (err) {
    console.error('Error resolving Syrian city:', err);
  }

  return null;
}

export async function getSyrianCities(): Promise<ResolvedCity[]> {
  try {
    const cities = await prisma.city.findMany({
      where: {
        country: { code: 'SY' },
        isActive: true,
      },
      select: {
        id: true,
        slug: true,
        nameAr: true,
        nameEn: true,
        country: { select: { code: true } },
      },
      orderBy: { nameAr: 'asc' },
    });

    return cities.map(c => ({
      id: c.id,
      slug: c.slug,
      nameAr: c.nameAr,
      nameEn: c.nameEn,
      countryCode: c.country.code,
    }));
  } catch (err) {
    console.error('Error fetching Syrian cities:', err);
    return [];
  }
}
