const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const prisma = new PrismaClient();

// ─── English company name templates ───────────────────────────────────────────
const enPrefixes = ['Pro', 'Elite', 'Prime', 'Swift', 'Expert', 'Alpha', 'Apex', 'Star', 'Top', 'Best'];
const enSuffixes = ['Solutions', 'Services', 'Group', 'Co', 'Works', 'Hub', 'Team', 'Partners', 'Experts', 'Agency'];

// ─── Arabic company name templates ────────────────────────────────────────────
const arPrefixes = ['شركة', 'مؤسسة', 'مجموعة', 'مركز', 'خبراء'];
const arSuffixes = ['للخدمات', 'المتميزة', 'المتخصصة', 'الاحترافية', 'المتكاملة'];

function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function slugify(str) {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 50);
}

function hashEmail(email) {
    return crypto.createHash('sha256').update(email.toLowerCase()).digest('hex');
}

async function main() {
    console.log('Fetching categories and locations...');

    const categories = await prisma.category.findMany({
        where: { isActive: true },
        include: { children: { where: { isActive: true } } },
    });

    const cities = await prisma.city.findMany({ select: { id: true, countryId: true } });
    const countries = await prisma.country.findMany({ select: { id: true } });

    if (cities.length === 0) { console.error('No cities found'); return; }

    // Collect all categories + subcategories to seed
    const allCats = [];
    for (const cat of categories) {
        allCats.push(cat);
        for (const sub of cat.children || []) {
            allCats.push(sub);
        }
    }

    console.log(`Found ${allCats.length} categories/subcategories. Creating 2 companies each (EN + AR)...`);

    let enCount = 0;
    let arCount = 0;
    let errorCount = 0;

    for (const cat of allCats) {
        // ── English Company ──────────────────────────────────────────────────────
        try {
            const enName = `${randomItem(enPrefixes)} ${cat.nameEn} ${randomItem(enSuffixes)}`;
            const baseSlug = slugify(`${enName}-${cat.id.substring(0, 6)}`);
            const enEmail = `company-en-${cat.id.substring(0, 8)}@marketplace-demo.com`;
            const city = randomItem(cities);

            // Create user first
            const enUser = await prisma.user.create({
                data: {
                    email: enEmail,
                    emailHash: hashEmail(enEmail),
                    password: '$2b$10$demohashedpassword123456789012345678901234567890',
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
                    currentPlan: randomItem(['FREE', 'BASIC', 'PREMIUM']),
                    skills: [cat.id, 'lang:en'],
                    createdAt: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)),
                },
            });

            enCount++;
            process.stdout.write('E');
        } catch (e) {
            errorCount++;
            process.stdout.write('x');
        }

        // ── Arabic Company ───────────────────────────────────────────────────────
        try {
            const arName = `${randomItem(arPrefixes)} ${cat.nameAr} ${randomItem(arSuffixes)}`;
            const baseSlugAr = slugify(`ar-company-${cat.id.substring(0, 6)}-${arCount}`);
            const arEmail = `company-ar-${cat.id.substring(0, 8)}-${arCount}@marketplace-demo.com`;
            const city = randomItem(cities);

            const arUser = await prisma.user.create({
                data: {
                    email: arEmail,
                    emailHash: hashEmail(arEmail),
                    password: '$2b$10$demohashedpassword123456789012345678901234567890',
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
                    currentPlan: randomItem(['FREE', 'BASIC', 'PREMIUM']),
                    skills: [cat.id, 'lang:ar'],
                    createdAt: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)),
                },
            });

            arCount++;
            process.stdout.write('A');
        } catch (e) {
            errorCount++;
            process.stdout.write('x');
        }
    }

    console.log(`\n\n✅ Done!`);
    console.log(`English companies created: ${enCount}`);
    console.log(`Arabic companies created:  ${arCount}`);
    console.log(`Errors skipped:            ${errorCount}`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
