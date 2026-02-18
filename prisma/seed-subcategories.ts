import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Data from src/lib/services-data.ts, mapped to DB slugs
const subcategoriesMap = {
    'hvac': [ // AC & HVAC
        { slug: 'ac-install', nameEn: 'AC Installation', nameAr: 'تركيب مكيفات' },
        { slug: 'ac-repair', nameEn: 'AC Repair', nameAr: 'صيانة مكيفات' },
        { slug: 'ac-maintenance', nameEn: 'AC Maintenance', nameAr: 'عقود صيانة' },
        { slug: 'central-ac', nameEn: 'Central AC Systems', nameAr: 'تكييف مركزي' },
        { slug: 'heating-repair', nameEn: 'Heating Repair', nameAr: 'صيانة أنظمة تدفئة' },
        { slug: 'duct-cleaning', nameEn: 'Duct Install & Cleaning', nameAr: 'تركيب وتنظيف دكت' },
        { slug: 'thermostat', nameEn: 'Thermostat Install', nameAr: 'تركيب ترموستات' },
        { slug: 'gas-refill', nameEn: 'Gas Refill', nameAr: 'تعبئة غاز' },
        { slug: 'hvac-inspection', nameEn: 'HVAC Inspection', nameAr: 'فحص أنظمة التكييف' },
    ],
    'electrical': [
        { slug: 'wiring', nameEn: 'Electrical Wiring', nameAr: 'تمديدات كهربائية' },
        { slug: 'electrical-repair', nameEn: 'Electrical Repairs', nameAr: 'إصلاح أعطال كهرباء' },
        { slug: 'lighting', nameEn: 'Lighting Install', nameAr: 'تركيب إنارة' },
        { slug: 'generator-install', nameEn: 'Generator Installation', nameAr: 'تركيب مولدات' },
        { slug: 'generator-maint', nameEn: 'Generator Maintenance', nameAr: 'صيانة مولدات' },
        { slug: 'solar-install', nameEn: 'Solar Panel Install', nameAr: 'تركيب طاقة شمسية' },
        { slug: 'solar-maint', nameEn: 'Solar System Maint', nameAr: 'صيانة طاقة شمسية' },
        { slug: 'panel-install', nameEn: 'Electrical Panel', nameAr: 'تركيب لوحات كهرباء' },
        { slug: 'backup-power', nameEn: 'Backup Power Systems', nameAr: 'أنظمة طاقة احتياطية' },
    ],
    'plumbing': [
        { slug: 'leak-repair', nameEn: 'Leak Detection & Repair', nameAr: 'كشف وإصلاح تسربات' },
        { slug: 'pipe-install', nameEn: 'Pipe Installation', nameAr: 'تمديد أنابيب' },
        { slug: 'water-heater-install', nameEn: 'Water Heater Install', nameAr: 'تركيب سخان مياه' },
        { slug: 'water-heater-repair', nameEn: 'Water Heater Repair', nameAr: 'صيانة سخان مياه' },
        { slug: 'bathroom-plumbing', nameEn: 'Bathroom Plumbing', nameAr: 'سباكة حمامات' },
        { slug: 'kitchen-plumbing', nameEn: 'Kitchen Plumbing', nameAr: 'سباكة مطابخ' },
        { slug: 'drain-cleaning', nameEn: 'Drain Cleaning', nameAr: 'تسليك مجاري' },
        { slug: 'water-tank-install', nameEn: 'Water Tank Install', nameAr: 'تركيب خزانات' },
        { slug: 'pump-install', nameEn: 'Pump Installation', nameAr: 'تركيب مضخات مياه' },
    ],
    'interior-design': [ // Represents 'design' & 'carpentry'
        { slug: 'custom-furniture', nameEn: 'Custom Furniture', nameAr: 'تفصيل أثاث' },
        { slug: 'door-install', nameEn: 'Door Install & Repair', nameAr: 'تركيب وصيانة أبواب' },
        { slug: 'kitchen-cabinets', nameEn: 'Kitchen Cabinets', nameAr: 'خزائن مطبخ' },
        { slug: 'wardrobes', nameEn: 'Bedroom Wardrobes', nameAr: 'خزائن ملابس' },
        { slug: 'wood-flooring', nameEn: 'Wood Flooring', nameAr: 'باركيه وأرضيات' },
        { slug: 'pergolas', nameEn: 'Pergolas & Outdoor', nameAr: 'مظلات خشبية' },
        { slug: 'office-furniture', nameEn: 'Office Furniture', nameAr: 'أثاث مكتبي' },
        { slug: 'furniture-repair', nameEn: 'Furniture Repair', nameAr: 'إصلاح أثاث' },
        { slug: 'interior-design-service', nameEn: 'Interior Design', nameAr: 'تصميم داخلي' },
        { slug: 'landscape', nameEn: 'Landscape Design', nameAr: 'تصميم حدائق' },
        { slug: '3d-visual', nameEn: '3D Visualization', nameAr: 'تصميم ثلاثي الأبعاد' },
    ],
    'construction': [
        { slug: 'general-contractor', nameEn: 'General Contractor', nameAr: 'مقاول عام' },
        { slug: 'home-renovation', nameEn: 'Home Renovation', nameAr: 'ترميم منازل' },
        { slug: 'kitchen-reno', nameEn: 'Kitchen Renovation', nameAr: 'تجديد مطابخ' },
        { slug: 'bathroom-reno', nameEn: 'Bathroom Renovation', nameAr: 'تجديد حمامات' },
        { slug: 'tile-install', nameEn: 'Tile Installation', nameAr: 'تركيب بلاط' },
        { slug: 'flooring', nameEn: 'Flooring Installation', nameAr: 'تركيب أرضيات' },
        { slug: 'gypsum', nameEn: 'Gypsum Board', nameAr: 'جبس بورد' },
        { slug: 'painting', nameEn: 'Painting Services', nameAr: 'دهانات وديكور' },
        { slug: 'roofing', nameEn: 'Roofing', nameAr: 'عزل أسطح' },
        { slug: 'concrete', nameEn: 'Concrete & Masonry', nameAr: 'أعمال باطون وبناء' },
        { slug: 'structural', nameEn: 'Structural Repairs', nameAr: 'تدعيم إنشائي' },
    ],
    'cleaning': [
        { slug: 'home-cleaning', nameEn: 'Home Cleaning', nameAr: 'تنظيف منازل' },
        { slug: 'deep-cleaning', nameEn: 'Deep Cleaning', nameAr: 'تنظيف عميق' },
        { slug: 'office-cleaning', nameEn: 'Office Cleaning', nameAr: 'تنظيف مكاتب' },
        { slug: 'post-construction', nameEn: 'Post-Construction', nameAr: 'تنظيف بعد البناء' },
        { slug: 'carpet-cleaning', nameEn: 'Carpet Cleaning', nameAr: 'تنظيف سجاد وموكيت' },
        { slug: 'sofa-cleaning', nameEn: 'Sofa Cleaning', nameAr: 'تنظيف كنب ومفروشات' },
        { slug: 'window-cleaning', nameEn: 'Window Cleaning', nameAr: 'تنظيف واجهات زجاجية' },
        { slug: 'tank-cleaning', nameEn: 'Water Tank Cleaning', nameAr: 'تعقيم خزانات المياه' },
        { slug: 'disinfection', nameEn: 'Disinfection Services', nameAr: 'خدمات تعقيم شامل' },
    ],
    'moving': [
        { slug: 'furniture-moving', nameEn: 'Furniture Moving', nameAr: 'نقل أثاث' },
        { slug: 'house-moving', nameEn: 'House Moving', nameAr: 'نقل منازل' },
        { slug: 'office-moving', nameEn: 'Office Moving', nameAr: 'نقل مكاتب وشركات' },
        { slug: 'packing-services', nameEn: 'Packing Services', nameAr: 'خدمات تغليف' },
        { slug: 'storage-services', nameEn: 'Storage Services', nameAr: 'خدمات تخزين' },
        { slug: 'equipment-transport', nameEn: 'Equipment Transport', nameAr: 'نقل معدات' },
        { slug: 'local-delivery', nameEn: 'Local Delivery', nameAr: 'توصيل بضائع محلي' },
        { slug: 'heavy-moving', nameEn: 'Heavy Equipment', nameAr: 'نقل معدات ثقيلة' },
    ],
    'it-technology': [ // Represents 'it' & 'digital'
        { slug: 'it-support', nameEn: 'IT Support', nameAr: 'دعم فني وتقني' },
        { slug: 'network-install', nameEn: 'Network Installation', nameAr: 'تمديد شبكات' },
        { slug: 'server-install', nameEn: 'Server Installation', nameAr: 'تركيب سيرفرات' },
        { slug: 'server-maint', nameEn: 'Server Maintenance', nameAr: 'صيانة سيرفرات' },
        { slug: 'hardware-repair', nameEn: 'Hardware Repair', nameAr: 'صيانة أجهزة كمبيوتر' },
        { slug: 'printer-setup', nameEn: 'Printer Setup', nameAr: 'تعريف طابعات' },
        { slug: 'cctv-it', nameEn: 'CCTV Integration', nameAr: 'ربط كاميرات بالشبكة' },
        { slug: 'web-dev', nameEn: 'Website Development', nameAr: 'تصميم وتطوير مواقع' },
        { slug: 'app-dev', nameEn: 'Mobile App Dev', nameAr: 'تطبيقات موبايل' },
        { slug: 'digital-marketing', nameEn: 'Digital Marketing', nameAr: 'تسويق رقمي' },
        { slug: 'seo', nameEn: 'SEO Services', nameAr: 'تحسين محركات البحث' },
    ],
    'accounting': [ // Represents 'business'
        { slug: 'accounting-service', nameEn: 'Accounting Services', nameAr: 'خدمات محاسبية' },
        { slug: 'tax-consult', nameEn: 'Tax Consultation', nameAr: 'استشارات ضريبية' },
        { slug: 'company-reg', nameEn: 'Company Registration', nameAr: 'تأسيس شركات' },
        { slug: 'business-consult', nameEn: 'Business Consulting', nameAr: 'استشارات أعمال' },
    ],
    'legal': [
        { slug: 'legal-consult', nameEn: 'Legal Consultation', nameAr: 'استشارات قانونية' },
        { slug: 'contracts', nameEn: 'Contract Drafting', nameAr: 'صياغة عقود' },
    ],
    'marketing': [
        { slug: 'branding', nameEn: 'Branding & Identity', nameAr: 'هوية بصرية' },
        { slug: 'social-media', nameEn: 'Social Media Mgmt', nameAr: 'إدارة صفحات سوشيال' },
        { slug: 'content-creation', nameEn: 'Content Creation', nameAr: 'صناعة محتوى' },
        { slug: 'graphic-design', nameEn: 'Graphic Design', nameAr: 'تصميم جرافيك' },
    ],
};

async function main() {
    console.log('🌱 Seeding Subcategories...');

    for (const [parentSlug, subcats] of Object.entries(subcategoriesMap)) {
        // find parent category
        const parent = await prisma.category.findUnique({ where: { slug: parentSlug } });
        if (!parent) {
            console.warn(`⚠️ Parent category not found: ${parentSlug}, skipping...`);
            continue;
        }

        console.log(`📂 Processing ${parent.nameEn} (${parentSlug})...`);

        for (const sub of subcats) {
            await prisma.category.upsert({
                where: { slug: sub.slug },
                update: {
                    name: sub.nameEn,
                    nameEn: sub.nameEn,
                    nameAr: sub.nameAr,
                    parentId: parent.id,
                    isActive: true,
                    isFeatured: false,
                },
                create: {
                    name: sub.nameEn,
                    nameEn: sub.nameEn,
                    nameAr: sub.nameAr,
                    slug: sub.slug,
                    parentId: parent.id,
                    isActive: true, // Auto-active
                    isFeatured: false,
                },
            });
        }
        console.log(`  ✅ Added ${subcats.length} subcategories`);
    }

    console.log('🎉 Subcategory seeding complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
