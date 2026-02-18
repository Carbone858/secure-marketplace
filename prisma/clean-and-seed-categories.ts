import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Data from src/lib/services-data.ts
// IMPORTANT: This data MUST be the single source of truth.
// Any category NOT in this list will be DEACTIVATED/DELETED.

const categories = [
    { id: "ac", label: { en: "AC & HVAC", ar: "تكييف وتبريد" }, icon: "fan", sortOrder: 1 },
    { id: "electrical", label: { en: "Electrical", ar: "كهرباء" }, icon: "zap", sortOrder: 2 },
    { id: "plumbing", label: { en: "Plumbing", ar: "سباكة" }, icon: "droplets", sortOrder: 3 },
    { id: "carpentry", label: { en: "Carpentry", ar: "نجارة" }, icon: "hammer", sortOrder: 4 },
    { id: "construction", label: { en: "Construction", ar: "مقاولات" }, icon: "building", sortOrder: 5 },
    { id: "cleaning", label: { en: "Cleaning", ar: "تنظيف" }, icon: "sparkles", sortOrder: 6 },
    { id: "moving", label: { en: "Moving", ar: "نقل عفش" }, icon: "truck", sortOrder: 7 },
    { id: "it", label: { en: "IT Support", ar: "دعم تقني" }, icon: "cpu", sortOrder: 8 },
    { id: "digital", label: { en: "Digital Services", ar: "خدمات رقمية" }, icon: "globe", sortOrder: 9 },
    { id: "business", label: { en: "Business", ar: "أعمال" }, icon: "briefcase", sortOrder: 10 },
    { id: "design", label: { en: "Design", ar: "تصميم" }, icon: "palette", sortOrder: 11 },
];

const subcategories = {
    ac: [
        { id: "ac-install", title: { en: "AC Installation", ar: "تركيب مكيفات" } },
        { id: "ac-repair", title: { en: "AC Repair", ar: "صيانة مكيفات" } },
        { id: "ac-maintenance", title: { en: "AC Maintenance", ar: "عقود صيانة" } },
        { id: "central-ac", title: { en: "Central AC Systems", ar: "تكييف مركزي" } },
        { id: "heating-repair", title: { en: "Heating Repair", ar: "صيانة أنظمة تدفئة" } },
        { id: "duct-cleaning", title: { en: "Duct Install & Cleaning", ar: "تركيب وتنظيف دكت" } },
        { id: "thermostat", title: { en: "Thermostat Install", ar: "تركيب ترموستات" } },
        { id: "gas-refill", title: { en: "Gas Refill", ar: "تعبئة غاز" } },
        { id: "hvac-inspection", title: { en: "HVAC Inspection", ar: "فحص أنظمة التكييف" } },
    ],
    electrical: [
        { id: "wiring", title: { en: "Electrical Wiring", ar: "تمديدات كهربائية" } },
        { id: "electrical-repair", title: { en: "Electrical Repairs", ar: "إصلاح أعطال كهرباء" } },
        { id: "lighting", title: { en: "Lighting Install", ar: "تركيب إنارة" } },
        { id: "generator-install", title: { en: "Generator Installation", ar: "تركيب مولدات" } },
        { id: "generator-maint", title: { en: "Generator Maintenance", ar: "صيانة مولدات" } },
        { id: "solar-install", title: { en: "Solar Panel Install", ar: "تركيب طاقة شمسية" } },
        { id: "solar-maint", title: { en: "Solar System Maint", ar: "صيانة طاقة شمسية" } },
        { id: "panel-install", title: { en: "Electrical Panel", ar: "تركيب لوحات كهرباء" } },
        { id: "backup-power", title: { en: "Backup Power Systems", ar: "أنظمة طاقة احتياطية" } },
    ],
    plumbing: [
        { id: "leak-repair", title: { en: "Leak Detection & Repair", ar: "كشف وإصلاح تسربات" } },
        { id: "pipe-install", title: { en: "Pipe Installation", ar: "تمديد أنابيب" } },
        { id: "water-heater-install", title: { en: "Water Heater Install", ar: "تركيب سخان مياه" } },
        { id: "water-heater-repair", title: { en: "Water Heater Repair", ar: "صيانة سخان مياه" } },
        { id: "bathroom-plumbing", title: { en: "Bathroom Plumbing", ar: "سباكة حمامات" } },
        { id: "kitchen-plumbing", title: { en: "Kitchen Plumbing", ar: "سباكة مطابخ" } },
        { id: "drain-cleaning", title: { en: "Drain Cleaning", ar: "تسليك مجاري" } },
        { id: "water-tank-install", title: { en: "Water Tank Install", ar: "تركيب خزانات" } },
        { id: "pump-install", title: { en: "Pump Installation", ar: "تركيب مضخات مياه" } },
    ],
    carpentry: [
        { id: "custom-furniture", title: { en: "Custom Furniture", ar: "تفصيل أثاث" } },
        { id: "door-install", title: { en: "Door Install & Repair", ar: "تركيب وصيانة أبواب" } },
        { id: "kitchen-cabinets", title: { en: "Kitchen Cabinets", ar: "خزائن مطبخ" } },
        { id: "wardrobes", title: { en: "Bedroom Wardrobes", ar: "خزائن ملابس" } },
        { id: "wood-flooring", title: { en: "Wood Flooring", ar: "باركيه وأرضيات" } },
        { id: "pergolas", title: { en: "Pergolas & Outdoor", ar: "مظلات خشبية" } },
        { id: "office-furniture", title: { en: "Office Furniture", ar: "أثاث مكتبي" } },
        { id: "furniture-repair", title: { en: "Furniture Repair", ar: "إصلاح أثاث" } },
    ],
    construction: [
        { id: "general-contractor", title: { en: "General Contractor", ar: "مقاول عام" } },
        { id: "home-renovation", title: { en: "Home Renovation", ar: "ترميم منازل" } },
        { id: "kitchen-reno", title: { en: "Kitchen Renovation", ar: "تجديد مطابخ" } },
        { id: "bathroom-reno", title: { en: "Bathroom Renovation", ar: "تجديد حمامات" } },
        { id: "tile-install", title: { en: "Tile Installation", ar: "تركيب بلاط" } },
        { id: "flooring", title: { en: "Flooring Installation", ar: "تركيب أرضيات" } },
        { id: "gypsum", title: { en: "Gypsum Board", ar: "جبس بورد" } },
        { id: "painting", title: { en: "Painting Services", ar: "دهانات وديكور" } },
        { id: "roofing", title: { en: "Roofing", ar: "عزل أسطح" } },
        { id: "concrete", title: { en: "Concrete & Masonry", ar: "أعمال باطون وبناء" } },
        { id: "structural", title: { en: "Structural Repairs", ar: "تدعيم إنشائي" } },
    ],
    cleaning: [
        { id: "home-cleaning", title: { en: "Home Cleaning", ar: "تنظيف منازل" } },
        { id: "deep-cleaning", title: { en: "Deep Cleaning", ar: "تنظيف عميق" } },
        { id: "office-cleaning", title: { en: "Office Cleaning", ar: "تنظيف مكاتب" } },
        { id: "post-construction", title: { en: "Post-Construction", ar: "تنظيف بعد البناء" } },
        { id: "carpet-cleaning", title: { en: "Carpet Cleaning", ar: "تنظيف سجاد وموكيت" } },
        { id: "sofa-cleaning", title: { en: "Sofa Cleaning", ar: "تنظيف كنب ومفروشات" } },
        { id: "window-cleaning", title: { en: "Window Cleaning", ar: "تنظيف واجهات زجاجية" } },
        { id: "tank-cleaning", title: { en: "Water Tank Cleaning", ar: "تعقيم خزانات المياه" } },
        { id: "disinfection", title: { en: "Disinfection Services", ar: "خدمات تعقيم شامل" } },
    ],
    moving: [
        { id: "furniture-moving", title: { en: "Furniture Moving", ar: "نقل أثاث" } },
        { id: "house-moving", title: { en: "House Moving", ar: "نقل منازل" } },
        { id: "office-moving", title: { en: "Office Moving", ar: "نقل مكاتب وشركات" } },
        { id: "packing-services", title: { en: "Packing Services", ar: "خدمات تغليف" } },
        { id: "storage-services", title: { en: "Storage Services", ar: "خدمات تخزين" } },
        { id: "equipment-transport", title: { en: "Equipment Transport", ar: "نقل معدات" } },
        { id: "local-delivery", title: { en: "Local Delivery", ar: "توصيل بضائع محلي" } },
        { id: "heavy-moving", title: { en: "Heavy Equipment", ar: "نقل معدات ثقيلة" } },
    ],
    it: [
        { id: "it-support", title: { en: "IT Support", ar: "دعم فني وتقني" } },
        { id: "network-install", title: { en: "Network Installation", ar: "تمديد شبكات" } },
        { id: "server-install", title: { en: "Server Installation", ar: "تركيب سيرفرات" } },
        { id: "server-maint", title: { en: "Server Maintenance", ar: "صيانة سيرفرات" } },
        { id: "hardware-repair", title: { en: "Hardware Repair", ar: "صيانة أجهزة كمبيوتر" } },
        { id: "printer-setup", title: { en: "Printer Setup", ar: "تعريف طابعات" } },
        { id: "cctv-it", title: { en: "CCTV Integration", ar: "ربط كاميرات بالشبكة" } },
        { id: "system-contracts", title: { en: "Maintenance Contracts", ar: "عقود صيانة دورية" } },
        { id: "data-recovery", title: { en: "Data Recovery", ar: "استعادة بيانات" } },
    ],
    digital: [
        { id: "web-dev", title: { en: "Website Development", ar: "تصميم وتطوير مواقع" } },
        { id: "ecommerce", title: { en: "E-commerce Dev", ar: "متاجر إلكترونية" } },
        { id: "app-dev", title: { en: "Mobile App Dev", ar: "تطبيقات موبايل" } },
        { id: "ui-ux", title: { en: "UI/UX Design", ar: "تصميم واجهات المستخدم" } },
        { id: "digital-marketing", title: { en: "Digital Marketing", ar: "تسويق رقمي" } },
        { id: "social-media", title: { en: "Social Media Mgmt", ar: "إدارة صفحات سوشيال" } },
        { id: "seo", title: { en: "SEO Services", ar: "تحسين محركات البحث" } },
        { id: "paid-ads", title: { en: "Paid Ads Mgmt", ar: "إدارة حملات إعلانية" } },
        { id: "content-creation", title: { en: "Content Creation", ar: "صناعة محتوى" } },
    ],
    business: [
        { id: "accounting", title: { en: "Accounting Services", ar: "خدمات محاسبية" } },
        { id: "tax-consult", title: { en: "Tax Consultation", ar: "استشارات ضريبية" } },
        { id: "legal", title: { en: "Legal Consultation", ar: "استشارات قانونية" } },
        { id: "company-reg", title: { en: "Company Registration", ar: "تأسيس شركات" } },
        { id: "hr-recruitment", title: { en: "HR & Recruitment", ar: "توظيف وموارد بشرية" } },
        { id: "business-consult", title: { en: "Business Consulting", ar: "استشارات أعمال" } },
        { id: "office-setup", title: { en: "Office Setup", ar: "تجهيز مكاتب" } },
        { id: "pro-services", title: { en: "PRO Services", ar: "خدمات تعقيب" } },
        { id: "translation", title: { en: "Translation", ar: "ترجمة معتمدة" } },
    ],
    design: [
        { id: "interior-design", title: { en: "Interior Design", ar: "تصميم داخلي" } },
        { id: "landscape", title: { en: "Landscape Design", ar: "تصميم حدائق" } },
        { id: "graphic-design", title: { en: "Graphic Design", ar: "تصميم جرافيك" } },
        { id: "branding", title: { en: "Branding & Identity", ar: "هوية بصرية" } },
        { id: "logo-design", title: { en: "Logo Design", ar: "تصميم شعارات" } },
        { id: "3d-visual", title: { en: "3D Visualization", ar: "تصميم ثلاثي الأبعاد" } },
        { id: "architecture", title: { en: "Architectural Design", ar: "تصميم معماري" } },
        { id: "video-production", title: { en: "Video Production", ar: "إنتاج فيديو" } },
        { id: "photography", title: { en: "Photography", ar: "تصوير احترافي" } },
    ],
};

async function main() {
    console.log('🧹 Correcting Categories & Subcategories (Single Source of Truth)...');

    // 1. Get all existing categories
    const allCategories = await prisma.category.findMany();

    // 2. Identify allowed slugs (both methods allowed: 'ac' from list, 'hvac' existing might need migration?)
    // Decision: WE FORCE THE SLUGS FROM THE LIST. 'ac' not 'hvac'.

    const allowedCategorySlugs = categories.map(c => c.id);
    const CategoriesToDeactivate = allCategories.filter(c => !allowedCategorySlugs.includes(c.slug) && c.parentId === null);

    console.log(`🗑️ Deactivating ${CategoriesToDeactivate.length} invalid main categories...`);
    for (const cat of CategoriesToDeactivate) {
        console.log(`   - Deactivating ${cat.slug} (${cat.nameEn})...`);
        // We deactivate recursively
        try {
            await prisma.category.update({ where: { id: cat.id }, data: { isActive: false } });
            await prisma.category.updateMany({ where: { parentId: cat.id }, data: { isActive: false } });
        } catch (e) {
            console.warn(`Failed to deactivate ${cat.slug}: ${e}`);
        }
    }

    // 3. Upsert Main Categories
    console.log('✨ Upserting valid main categories...');
    for (const cat of categories) {
        await prisma.category.upsert({
            where: { slug: cat.id },
            create: {
                slug: cat.id,
                name: cat.label.en,
                nameEn: cat.label.en,
                nameAr: cat.label.ar,
                iconName: cat.icon,
                sortOrder: cat.sortOrder,
                isActive: true, // Force active
                isFeatured: true,
            },
            update: {
                name: cat.label.en,
                nameEn: cat.label.en,
                nameAr: cat.label.ar,
                iconName: cat.icon,
                sortOrder: cat.sortOrder,
                isActive: true,
                isFeatured: true,
            }
        });
    }

    // 4. Handle Subcategories
    console.log('📂 Syncing Subcategories...');
    for (const [parentSlug, subs] of Object.entries(subcategories)) {
        const parent = await prisma.category.findUnique({ where: { slug: parentSlug } });
        if (!parent) continue;

        const allowedSubSlugs = subs.map(s => s.id);

        // Deactivate subcategories not in the list for this parent
        await prisma.category.updateMany({
            where: {
                parentId: parent.id,
                slug: { notIn: allowedSubSlugs }
            },
            data: { isActive: false }
        });

        // Upsert subcategories
        for (const sub of subs) {
            await prisma.category.upsert({
                where: { slug: sub.id },
                create: {
                    slug: sub.id,
                    name: sub.title.en,
                    nameEn: sub.title.en,
                    nameAr: sub.title.ar,
                    parentId: parent.id,
                    isActive: true,
                },
                update: {
                    name: sub.title.en,
                    nameEn: sub.title.en,
                    nameAr: sub.title.ar,
                    parentId: parent.id,
                    isActive: true,
                }
            });
        }
    }

    console.log('✅ Correction Complete! Database now matches src/lib/services-data.ts exactly.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
