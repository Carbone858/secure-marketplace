import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

const enPrefixes = ['Pro', 'Elite', 'Prime', 'Swift', 'Expert', 'Alpha', 'Apex', 'Star', 'Top', 'Best'];
const enSuffixes = ['Solutions', 'Services', 'Group', 'Co', 'Works', 'Hub', 'Team', 'Partners', 'Experts', 'Agency'];
const arPrefixes = ['شركة', 'مؤسسة', 'مجموعة', 'مركز', 'خبراء'];
const arSuffixes = ['للخدمات', 'المتميزة', 'المتخصصة', 'الاحترافية', 'المتكاملة'];

function randomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function slugify(str: string): string {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').substring(0, 50);
}

function hashEmail(email: string): string {
    return crypto.createHash('sha256').update(email.toLowerCase()).digest('hex');
}

export async function GET(request: NextRequest) {
    try {
        const categories = await prisma.category.findMany({
            where: { isActive: true },
            include: { children: { where: { isActive: true } } },
        });

        const cities = await prisma.city.findMany({ select: { id: true, countryId: true } });

        if (cities.length === 0) {
            return NextResponse.json({ error: 'No cities found in database' }, { status: 400 });
        }

        // Collect all categories + subcategories
        const allCats: any[] = [];
        for (const cat of categories) {
            allCats.push(cat);
            for (const sub of (cat as any).children || []) {
                allCats.push(sub);
            }
        }

        let enCount = 0;
        let arCount = 0;
        let errorCount = 0;
        const errors: string[] = [];

        for (const cat of allCats) {
            // ── English Company ──────────────────────────────────────────────────
            try {
                const enName = `${randomItem(enPrefixes)} ${cat.nameEn} ${randomItem(enSuffixes)}`;
                const uniqueSuffix = Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
                const baseSlug = slugify(`${cat.nameEn}-en-${uniqueSuffix}`);
                const enEmail = `co-en-${cat.id.substring(0, 8)}-${uniqueSuffix}@demo.marketplace.com`;
                const city = randomItem(cities);

                const enUser = await prisma.user.create({
                    data: {
                        email: enEmail,
                        emailHash: hashEmail(enEmail),
                        password: '$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu',
                        name: `${enName} Admin`,
                        role: 'COMPANY',
                        emailVerified: new Date(),
                        isActive: true,
                    },
                });

                await prisma.company.create({
                    data: {
                        userId: enUser.id,
                        name: enName,
                        slug: baseSlug,
                        description: `We are a professional ${cat.nameEn} service provider with years of experience. We offer high-quality solutions tailored to your needs. Contact us for a free quote.`,
                        email: enEmail,
                        phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
                        countryId: city.countryId,
                        cityId: city.id,
                        verificationStatus: 'VERIFIED',
                        verifiedAt: new Date(),
                        isActive: true,
                        isFeatured: Math.random() > 0.8,
                        rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
                        reviewCount: Math.floor(Math.random() * 80) + 5,
                        currentPlan: randomItem(['FREE', 'BASIC', 'PREMIUM'] as any[]),
                        skills: [cat.id, 'lang:en'],
                        createdAt: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)),
                    },
                });
                enCount++;
            } catch (e: any) {
                errorCount++;
                errors.push(`EN ${cat.nameEn}: ${e.message?.substring(0, 80)}`);
            }

            // ── Arabic Company ───────────────────────────────────────────────────
            try {
                const arName = `${randomItem(arPrefixes)} ${cat.nameAr} ${randomItem(arSuffixes)}`;
                const uniqueSuffix = Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
                const baseSlugAr = slugify(`ar-${cat.nameEn}-${uniqueSuffix}`);
                const arEmail = `co-ar-${cat.id.substring(0, 8)}-${uniqueSuffix}@demo.marketplace.com`;
                const city = randomItem(cities);

                const arUser = await prisma.user.create({
                    data: {
                        email: arEmail,
                        emailHash: hashEmail(arEmail),
                        password: '$2b$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu',
                        name: `${arName} مدير`,
                        role: 'COMPANY',
                        emailVerified: new Date(),
                        isActive: true,
                    },
                });

                await prisma.company.create({
                    data: {
                        userId: arUser.id,
                        name: arName,
                        slug: baseSlugAr,
                        description: `نحن شركة متخصصة في تقديم خدمات ${cat.nameAr} بأعلى مستويات الجودة والاحترافية. نقدم حلولاً متكاملة تلبي احتياجاتكم. تواصل معنا للحصول على عرض سعر مجاني.`,
                        email: arEmail,
                        phone: `+966${Math.floor(Math.random() * 900000000) + 100000000}`,
                        countryId: city.countryId,
                        cityId: city.id,
                        verificationStatus: 'VERIFIED',
                        verifiedAt: new Date(),
                        isActive: true,
                        isFeatured: Math.random() > 0.8,
                        rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
                        reviewCount: Math.floor(Math.random() * 80) + 5,
                        currentPlan: randomItem(['FREE', 'BASIC', 'PREMIUM'] as any[]),
                        skills: [cat.id, 'lang:ar'],
                        createdAt: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)),
                    },
                });
                arCount++;
            } catch (e: any) {
                errorCount++;
                errors.push(`AR ${cat.nameAr}: ${e.message?.substring(0, 80)}`);
            }
        }

        return NextResponse.json({
            success: true,
            message: `Seeded ${enCount} English + ${arCount} Arabic companies across ${allCats.length} categories/subcategories`,
            enCount,
            arCount,
            errorCount,
            errors: errors.slice(0, 10),
        });
    } catch (error: any) {
        console.error('Seed companies error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
