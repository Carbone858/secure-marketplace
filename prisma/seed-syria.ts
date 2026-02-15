import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// All 14 Syrian governorates with their major cities/districts
const syriaData = {
  code: 'SY',
  nameAr: 'سوريا',
  nameEn: 'Syria',
  governorates: [
    {
      nameAr: 'دمشق',
      nameEn: 'Damascus',
      slug: 'damascus',
      cities: [
        { nameAr: 'المزة', nameEn: 'Al-Mazzeh', slug: 'al-mazzeh' },
        { nameAr: 'المالكي', nameEn: 'Al-Malki', slug: 'al-malki' },
        { nameAr: 'أبو رمانة', nameEn: 'Abu Rummaneh', slug: 'abu-rummaneh' },
        { nameAr: 'الشعلان', nameEn: 'Al-Shaalan', slug: 'al-shaalan' },
        { nameAr: 'باب توما', nameEn: 'Bab Touma', slug: 'bab-touma' },
        { nameAr: 'القصاع', nameEn: 'Al-Qassa', slug: 'al-qassa' },
        { nameAr: 'ركن الدين', nameEn: 'Rukn al-Din', slug: 'rukn-al-din' },
        { nameAr: 'المهاجرين', nameEn: 'Al-Muhajirin', slug: 'al-muhajirin' },
        { nameAr: 'الصالحية', nameEn: 'Al-Salihiyah', slug: 'al-salihiyah' },
      ],
    },
    {
      nameAr: 'ريف دمشق',
      nameEn: 'Rif Dimashq',
      slug: 'rif-dimashq',
      cities: [
        { nameAr: 'جرمانا', nameEn: 'Jaramana', slug: 'jaramana' },
        { nameAr: 'صحنايا', nameEn: 'Sahnaya', slug: 'sahnaya' },
        { nameAr: 'داريا', nameEn: 'Darayya', slug: 'darayya' },
        { nameAr: 'دوما', nameEn: 'Douma', slug: 'douma' },
        { nameAr: 'التل', nameEn: 'Al-Tall', slug: 'al-tall' },
        { nameAr: 'الزبداني', nameEn: 'Al-Zabadani', slug: 'al-zabadani' },
        { nameAr: 'يبرود', nameEn: 'Yabroud', slug: 'yabroud' },
        { nameAr: 'النبك', nameEn: 'Al-Nabk', slug: 'al-nabk' },
        { nameAr: 'قطنا', nameEn: 'Qatana', slug: 'qatana' },
        { nameAr: 'عربين', nameEn: 'Arbin', slug: 'arbin' },
        { nameAr: 'حرستا', nameEn: 'Harasta', slug: 'harasta' },
        { nameAr: 'المعضمية', nameEn: 'Al-Muaddamiyah', slug: 'al-muaddamiyah' },
      ],
    },
    {
      nameAr: 'حلب',
      nameEn: 'Aleppo',
      slug: 'aleppo',
      cities: [
        { nameAr: 'حلب المدينة', nameEn: 'Aleppo City', slug: 'aleppo-city' },
        { nameAr: 'منبج', nameEn: 'Manbij', slug: 'manbij' },
        { nameAr: 'الباب', nameEn: 'Al-Bab', slug: 'al-bab' },
        { nameAr: 'عفرين', nameEn: 'Afrin', slug: 'afrin' },
        { nameAr: 'أعزاز', nameEn: 'Azaz', slug: 'azaz' },
        { nameAr: 'جرابلس', nameEn: 'Jarabulus', slug: 'jarabulus' },
        { nameAr: 'عين العرب', nameEn: 'Ain al-Arab', slug: 'ain-al-arab' },
        { nameAr: 'السفيرة', nameEn: 'Al-Safira', slug: 'al-safira' },
        { nameAr: 'دير حافر', nameEn: 'Deir Hafer', slug: 'deir-hafer' },
      ],
    },
    {
      nameAr: 'حمص',
      nameEn: 'Homs',
      slug: 'homs',
      cities: [
        { nameAr: 'حمص المدينة', nameEn: 'Homs City', slug: 'homs-city' },
        { nameAr: 'تدمر', nameEn: 'Palmyra', slug: 'palmyra' },
        { nameAr: 'الرستن', nameEn: 'Al-Rastan', slug: 'al-rastan' },
        { nameAr: 'تلكلخ', nameEn: 'Talkalakh', slug: 'talkalakh' },
        { nameAr: 'القصير', nameEn: 'Al-Qusayr', slug: 'al-qusayr' },
        { nameAr: 'المخرم', nameEn: 'Al-Makhram', slug: 'al-makhram' },
      ],
    },
    {
      nameAr: 'حماة',
      nameEn: 'Hama',
      slug: 'hama',
      cities: [
        { nameAr: 'حماة المدينة', nameEn: 'Hama City', slug: 'hama-city' },
        { nameAr: 'مصياف', nameEn: 'Masyaf', slug: 'masyaf' },
        { nameAr: 'السلمية', nameEn: 'Al-Salamiyah', slug: 'al-salamiyah' },
        { nameAr: 'محردة', nameEn: 'Mahardeh', slug: 'mahardeh' },
        { nameAr: 'السقيلبية', nameEn: 'Al-Suqaylabiyah', slug: 'al-suqaylabiyah' },
      ],
    },
    {
      nameAr: 'اللاذقية',
      nameEn: 'Latakia',
      slug: 'latakia',
      cities: [
        { nameAr: 'اللاذقية المدينة', nameEn: 'Latakia City', slug: 'latakia-city' },
        { nameAr: 'جبلة', nameEn: 'Jableh', slug: 'jableh' },
        { nameAr: 'الحفة', nameEn: 'Al-Haffah', slug: 'al-haffah' },
        { nameAr: 'القرداحة', nameEn: 'Al-Qardaha', slug: 'al-qardaha' },
      ],
    },
    {
      nameAr: 'طرطوس',
      nameEn: 'Tartous',
      slug: 'tartous',
      cities: [
        { nameAr: 'طرطوس المدينة', nameEn: 'Tartous City', slug: 'tartous-city' },
        { nameAr: 'بانياس', nameEn: 'Baniyas', slug: 'baniyas' },
        { nameAr: 'صافيتا', nameEn: 'Safita', slug: 'safita' },
        { nameAr: 'الدريكيش', nameEn: 'Al-Dreikish', slug: 'al-dreikish' },
        { nameAr: 'الشيخ بدر', nameEn: 'Sheikh Badr', slug: 'sheikh-badr' },
      ],
    },
    {
      nameAr: 'إدلب',
      nameEn: 'Idlib',
      slug: 'idlib',
      cities: [
        { nameAr: 'إدلب المدينة', nameEn: 'Idlib City', slug: 'idlib-city' },
        { nameAr: 'معرة النعمان', nameEn: 'Maarat al-Numan', slug: 'maarat-al-numan' },
        { nameAr: 'أريحا', nameEn: 'Ariha', slug: 'ariha' },
        { nameAr: 'جسر الشغور', nameEn: 'Jisr al-Shughur', slug: 'jisr-al-shughur' },
        { nameAr: 'حارم', nameEn: 'Harim', slug: 'harim' },
      ],
    },
    {
      nameAr: 'دير الزور',
      nameEn: 'Deir ez-Zor',
      slug: 'deir-ez-zor',
      cities: [
        { nameAr: 'دير الزور المدينة', nameEn: 'Deir ez-Zor City', slug: 'deir-ez-zor-city' },
        { nameAr: 'الميادين', nameEn: 'Al-Mayadin', slug: 'al-mayadin' },
        { nameAr: 'البوكمال', nameEn: 'Al-Bukamal', slug: 'al-bukamal' },
        { nameAr: 'الأشارة', nameEn: 'Al-Ashara', slug: 'al-ashara' },
      ],
    },
    {
      nameAr: 'الرقة',
      nameEn: 'Raqqa',
      slug: 'raqqa',
      cities: [
        { nameAr: 'الرقة المدينة', nameEn: 'Raqqa City', slug: 'raqqa-city' },
        { nameAr: 'الطبقة', nameEn: 'Al-Tabqa', slug: 'al-tabqa' },
        { nameAr: 'تل أبيض', nameEn: 'Tell Abyad', slug: 'tell-abyad' },
      ],
    },
    {
      nameAr: 'الحسكة',
      nameEn: 'Al-Hasakah',
      slug: 'al-hasakah',
      cities: [
        { nameAr: 'الحسكة المدينة', nameEn: 'Al-Hasakah City', slug: 'al-hasakah-city' },
        { nameAr: 'القامشلي', nameEn: 'Qamishli', slug: 'qamishli' },
        { nameAr: 'رأس العين', nameEn: 'Ras al-Ayn', slug: 'ras-al-ayn' },
        { nameAr: 'المالكية', nameEn: 'Al-Malikiyah', slug: 'al-malikiyah' },
      ],
    },
    {
      nameAr: 'درعا',
      nameEn: 'Daraa',
      slug: 'daraa',
      cities: [
        { nameAr: 'درعا المدينة', nameEn: 'Daraa City', slug: 'daraa-city' },
        { nameAr: 'نوى', nameEn: 'Nawa', slug: 'nawa' },
        { nameAr: 'الصنمين', nameEn: 'Al-Sanamayn', slug: 'al-sanamayn' },
        { nameAr: 'إزرع', nameEn: 'Izra', slug: 'izra' },
        { nameAr: 'جاسم', nameEn: 'Jasim', slug: 'jasim' },
      ],
    },
    {
      nameAr: 'السويداء',
      nameEn: 'As-Suwayda',
      slug: 'as-suwayda',
      cities: [
        { nameAr: 'السويداء المدينة', nameEn: 'As-Suwayda City', slug: 'as-suwayda-city' },
        { nameAr: 'شهبا', nameEn: 'Shahba', slug: 'shahba' },
        { nameAr: 'صلخد', nameEn: 'Salkhad', slug: 'salkhad' },
      ],
    },
    {
      nameAr: 'القنيطرة',
      nameEn: 'Quneitra',
      slug: 'quneitra',
      cities: [
        { nameAr: 'القنيطرة المدينة', nameEn: 'Quneitra City', slug: 'quneitra-city' },
        { nameAr: 'فيق', nameEn: 'Fiq', slug: 'fiq' },
      ],
    },
  ],
};

// Common service categories for seeding
const categories = [
  { name: 'Construction & Building', nameEn: 'Construction & Building', nameAr: 'البناء والتشييد', slug: 'construction', icon: '🏗️', iconName: 'construction', sortOrder: 1, isFeatured: true },
  { name: 'Interior Design', nameEn: 'Interior Design', nameAr: 'التصميم الداخلي', slug: 'interior-design', icon: '🎨', iconName: 'interior-design', sortOrder: 2, isFeatured: true },
  { name: 'Plumbing', nameEn: 'Plumbing', nameAr: 'السباكة', slug: 'plumbing', icon: '🔧', iconName: 'plumbing', sortOrder: 3, isFeatured: true },
  { name: 'Electrical', nameEn: 'Electrical', nameAr: 'الكهرباء', slug: 'electrical', icon: '⚡', iconName: 'electrical', sortOrder: 4, isFeatured: true },
  { name: 'HVAC', nameEn: 'HVAC', nameAr: 'التدفئة والتبريد', slug: 'hvac', icon: '❄️', iconName: 'hvac', sortOrder: 5, isFeatured: true },
  { name: 'Cleaning Services', nameEn: 'Cleaning Services', nameAr: 'خدمات التنظيف', slug: 'cleaning', icon: '🧹', iconName: 'cleaning', sortOrder: 6, isFeatured: true },
  { name: 'Moving & Relocation', nameEn: 'Moving & Relocation', nameAr: 'النقل والترحيل', slug: 'moving', icon: '🚚', iconName: 'moving', sortOrder: 7, isFeatured: true },
  { name: 'IT & Technology', nameEn: 'IT & Technology', nameAr: 'تكنولوجيا المعلومات', slug: 'it-technology', icon: '💻', iconName: 'it', sortOrder: 8, isFeatured: true },
  { name: 'Legal Services', nameEn: 'Legal Services', nameAr: 'الخدمات القانونية', slug: 'legal', icon: '⚖️', iconName: 'gavel', sortOrder: 9, isFeatured: false },
  { name: 'Accounting & Finance', nameEn: 'Accounting & Finance', nameAr: 'المحاسبة والمالية', slug: 'accounting', icon: '📊', iconName: 'calculator', sortOrder: 10, isFeatured: false },
  { name: 'Marketing & Advertising', nameEn: 'Marketing & Advertising', nameAr: 'التسويق والإعلان', slug: 'marketing', icon: '📣', iconName: 'business', sortOrder: 11, isFeatured: false },
  { name: 'Transportation', nameEn: 'Transportation', nameAr: 'النقل', slug: 'transportation', icon: '🚗', iconName: 'moving', sortOrder: 12, isFeatured: false },
  { name: 'Healthcare', nameEn: 'Healthcare', nameAr: 'الرعاية الصحية', slug: 'healthcare', icon: '🏥', iconName: 'health', sortOrder: 13, isFeatured: false },
  { name: 'Education & Training', nameEn: 'Education & Training', nameAr: 'التعليم والتدريب', slug: 'education', icon: '📚', iconName: 'school', sortOrder: 14, isFeatured: false },
  { name: 'Events & Entertainment', nameEn: 'Events & Entertainment', nameAr: 'الفعاليات والترفيه', slug: 'events', icon: '🎉', iconName: 'award', sortOrder: 15, isFeatured: false },
  { name: 'Photography & Video', nameEn: 'Photography & Video', nameAr: 'التصوير والفيديو', slug: 'photography', icon: '📷', iconName: 'camera', sortOrder: 16, isFeatured: false },
];

// Membership plans
const membershipPlans = [
  {
    name: 'Basic',
    description: 'Perfect for small businesses starting out',
    price: 0,
    currency: 'SYP',
    duration: 'MONTHLY' as const,
    features: ['List your company', 'Receive up to 5 offers/month', 'Basic profile'],
    isActive: true,
  },
  {
    name: 'Professional',
    description: 'For growing businesses that need more visibility',
    price: 50000,
    currency: 'SYP',
    duration: 'MONTHLY' as const,
    features: ['Unlimited offers', 'Priority listing', 'Verified badge', 'Analytics dashboard'],
    isActive: true,
  },
  {
    name: 'Enterprise',
    description: 'For large companies seeking maximum exposure',
    price: 150000,
    currency: 'SYP',
    duration: 'MONTHLY' as const,
    features: ['Everything in Professional', 'Featured company', 'Dedicated support', 'Custom branding', 'API access'],
    isActive: true,
  },
];

async function main() {
  console.log('🌍 Seeding Syria data...');

  // Upsert Syria country
  const syria = await prisma.country.upsert({
    where: { code: syriaData.code },
    update: {
      nameAr: syriaData.nameAr,
      nameEn: syriaData.nameEn,
      isActive: true,
    },
    create: {
      code: syriaData.code,
      nameAr: syriaData.nameAr,
      nameEn: syriaData.nameEn,
      isActive: true,
    },
  });

  console.log(`  ✅ Country: ${syria.nameEn} (${syria.id})`);

  // Seed governorates as cities, and their cities as areas
  let cityCount = 0;
  for (const gov of syriaData.governorates) {
    // Create governorate as a City
    const city = await prisma.city.upsert({
      where: { countryId_slug: { countryId: syria.id, slug: gov.slug } },
      update: {
        nameAr: gov.nameAr,
        nameEn: gov.nameEn,
        isActive: true,
      },
      create: {
        countryId: syria.id,
        nameAr: gov.nameAr,
        nameEn: gov.nameEn,
        slug: gov.slug,
        isActive: true,
      },
    });
    cityCount++;

    // Create districts/towns as Areas under the governorate
    for (const area of gov.cities) {
      await prisma.area.upsert({
        where: { cityId_slug: { cityId: city.id, slug: area.slug } },
        update: {
          nameAr: area.nameAr,
          nameEn: area.nameEn,
          isActive: true,
        },
        create: {
          cityId: city.id,
          nameAr: area.nameAr,
          nameEn: area.nameEn,
          slug: area.slug,
          isActive: true,
        },
      });
    }

    console.log(`  📍 ${gov.nameEn}: ${gov.cities.length} areas`);
  }

  console.log(`  ✅ Total: ${cityCount} governorates seeded\n`);

  // Seed categories
  console.log('📂 Seeding categories...');
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        nameEn: cat.nameEn,
        nameAr: cat.nameAr,
        icon: cat.icon,
        iconName: cat.iconName,
        sortOrder: cat.sortOrder,
        isFeatured: cat.isFeatured,
        isActive: true,
      },
      create: {
        name: cat.name,
        nameEn: cat.nameEn,
        nameAr: cat.nameAr,
        slug: cat.slug,
        icon: cat.icon,
        iconName: cat.iconName,
        sortOrder: cat.sortOrder,
        isFeatured: cat.isFeatured,
        isActive: true,
      },
    });
  }
  console.log(`  ✅ ${categories.length} categories seeded\n`);

  // Seed membership plans
  console.log('💳 Seeding membership plans...');
  for (const plan of membershipPlans) {
    await prisma.membershipPlan.upsert({
      where: { name: plan.name },
      update: {
        description: plan.description,
        price: plan.price,
        currency: plan.currency,
        duration: plan.duration,
        features: plan.features,
        isActive: plan.isActive,
      },
      create: {
        name: plan.name,
        description: plan.description,
        price: plan.price,
        currency: plan.currency,
        duration: plan.duration,
        features: plan.features,
        isActive: plan.isActive,
      },
    });
  }
  console.log(`  ✅ ${membershipPlans.length} membership plans seeded\n`);

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
