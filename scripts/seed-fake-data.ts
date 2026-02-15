import { PrismaClient, UserRole, CompanyVerificationStatus, UrgencyLevel, VisibilityLevel, RequestStatus } from '@prisma/client';

const prisma = new PrismaClient();

const firstNames = ['Ahmad', 'Mohammad', 'Sami', 'Omar', 'Khaled', 'Youssef', 'Ibrahim', 'Hassan', 'Ali', 'Hussein', 'Nour', 'Layla', 'Sara', 'Fatima', 'Zainab', 'Rania', 'Maha', 'Huda', 'Salma', 'Amal'];
const lastNames = ['Al-Masri', 'Al-Halabi', 'Al-Shami', 'Al-Sayed', 'Al-Ali', 'Hassan', 'Ibrahim', 'Sleiman', 'Othman', 'Assad', 'Hamdan', 'Khoury', 'Haddad', 'Nasser', 'Saleh'];

const companyPrefixes = ['Golden', 'Royal', 'Elite', 'Advanced', 'Modern', 'Smart', 'Quick', 'Professional', 'Top', 'Best', 'Syrian', 'Damascus', 'Aleppo', 'National', 'International'];
const companySuffixes = ['Services', 'Solutions', 'Group', 'Company', 'Co.', 'Est.', 'Team', 'Experts', 'Masters', 'Pro', 'Tech', 'Works', 'Contracting', 'Trading'];

const requestTitles = [
    'Need help with home renovation',
    'Urgent plumbing repair needed',
    'Full house cleaning required',
    'Office electrical wiring fix',
    'Moving furniture to new apartment',
    'Interior design for living room',
    'AC maintenance and cleaning',
    'Roof waterproofing',
    'Kitchen cabinet installation',
    'Garden landscaping and maintenance',
    'Painting 3 bedrooms',
    'Installing new windows',
    'Bathroom tiling',
    'Fixing broken door lock',
    'Installing security cameras',
];

const requestDescriptions = [
    'I need a professional to help with this task as soon as possible. Please provide a quote.',
    'Looking for an experienced team to handle this project. Quality is consistent.',
    'We have a limited budget but need good work. Please contact me for details.',
    'Urgent requirement, ready to start immediately.',
    'Need someone reliable and trustworthy. Previous experience required.',
    'The project involves multiple stages, looking for a long-term partner.',
    'Please include materials in your quote.',
    'Contact me via WhatsApp for photos and more info.',
];

function getRandomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
    console.log('🚀 Starting fake data generation...');

    // 1. Fetch reference data
    const syria = await prisma.country.findFirst({ where: { code: 'SY' } });
    if (!syria) {
        throw new Error('Syria country not found. Please run seed-syria.ts first.');
    }

    const cities = await prisma.city.findMany({ where: { countryId: syria.id } });
    if (cities.length === 0) {
        throw new Error('No cities found. Please run seed-syria.ts first.');
    }

    const categories = await prisma.category.findMany();
    if (categories.length === 0) {
        throw new Error('No categories found. Please run seed-syria.ts first.');
    }

    console.log(`Found ${cities.length} cities and ${categories.length} categories.`);

    // 2. Create 50 Companies
    console.log('🏭 Creating 50 fake companies...');
    const companiesCreated = [];

    for (let i = 0; i < 50; i++) {
        const firstName = getRandomItem(firstNames);
        const lastName = getRandomItem(lastNames);
        const email = `company_${Date.now()}_${i}@test.com`;
        const passwordHash = '$2b$10$EpRnTzVlqHNP0.fKb.U00.F0y2k.x.5j.L1.G.0.0.0.0.0'; // Dummy hash

        // Create User
        const user = await prisma.user.create({
            data: {
                email,
                emailHash: email, // Simple duplication for test
                password: passwordHash,
                name: `${firstName} ${lastName}`,
                role: UserRole.COMPANY,
                isActive: true,
                emailVerified: new Date(),
            },
        });

        // Pick random category for the company name
        const mainCategory = getRandomItem(categories);
        const companyName = `${getRandomItem(companyPrefixes)} ${mainCategory.nameEn} ${getRandomItem(companySuffixes)}`;
        const city = getRandomItem(cities);

        // Create Company
        const company = await prisma.company.create({
            data: {
                userId: user.id,
                name: companyName,
                slug: `${companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${i}`,
                description: `We are a leading provider of ${mainCategory.nameEn} services in ${city.nameEn}. dedicated to quality and customer satisfaction.`,
                email: email,
                phone: `+9639${getRandomInt(10000000, 99999999)}`,
                countryId: syria.id,
                cityId: city.id,
                address: `${getRandomInt(1, 100)} Main St, ${city.nameEn}`,
                verificationStatus: CompanyVerificationStatus.VERIFIED, // Verified for list visibility
                verifiedAt: new Date(),
                isActive: true,
                rating: parseFloat((Math.random() * (5 - 3) + 3).toFixed(1)), // 3.0 to 5.0
                reviewCount: getRandomInt(5, 100),
                isFeatured: Math.random() > 0.8, // 20% featured
            },
        });

        // Create Company Services
        // Add primary service
        await prisma.companyService.create({
            data: {
                companyId: company.id,
                name: mainCategory.nameEn,
                description: `Professional ${mainCategory.nameEn} services.`,
                priceFrom: getRandomInt(100, 500),
                priceTo: getRandomInt(600, 2000),
                isActive: true,
            },
        });

        // Add 1-2 random other services
        const otherCategories = categories.filter(c => c.id !== mainCategory.id);
        const extraServicesCount = getRandomInt(0, 2);
        for (let j = 0; j < extraServicesCount; j++) {
            const extraCat = getRandomItem(otherCategories);
            await prisma.companyService.create({
                data: {
                    companyId: company.id,
                    name: extraCat.nameEn,
                    description: `Additional service: ${extraCat.nameEn}`,
                    isActive: true,
                },
            });
        }

        companiesCreated.push(company);
        process.stdout.write('.');
    }
    console.log('\n✅ Companies created.');

    // 3. Create 100 Service Requests
    console.log('📋 Creating 100 fake service requests...');

    // Create a pool of client users to own these requests
    const clientUsers = [];
    for (let i = 0; i < 20; i++) {
        const firstName = getRandomItem(firstNames);
        const lastName = getRandomItem(lastNames);
        const email = `client_${Date.now()}_${i}@test.com`;

        const user = await prisma.user.create({
            data: {
                email,
                emailHash: email,
                password: 'password', // dummy
                name: `${firstName} ${lastName}`,
                role: UserRole.USER,
                isActive: true,
            },
        });
        clientUsers.push(user);
    }

    for (let i = 0; i < 100; i++) {
        const owner = getRandomItem(clientUsers);
        const category = getRandomItem(categories);
        const city = getRandomItem(cities);
        const title = `${getRandomItem(requestTitles)} - ${city.nameEn}`;

        await prisma.serviceRequest.create({
            data: {
                userId: owner.id,
                title: title,
                description: getRandomItem(requestDescriptions),
                categoryId: category.id,
                countryId: syria.id,
                cityId: city.id,
                budgetMin: getRandomInt(50, 200),
                budgetMax: getRandomInt(300, 1000),
                currency: 'SYP', // Or USD depending on preference, schema defaults to USD but context is Syria
                urgency: getRandomItem([UrgencyLevel.LOW, UrgencyLevel.MEDIUM, UrgencyLevel.HIGH, UrgencyLevel.URGENT]),
                visibility: VisibilityLevel.PUBLIC,
                status: getRandomItem([RequestStatus.PENDING, RequestStatus.ACTIVE, RequestStatus.IN_PROGRESS, RequestStatus.COMPLETED]),
                isActive: true,
                viewCount: getRandomInt(0, 500),
            },
        });
        process.stdout.write('.');
    }
    console.log('\n✅ Service requests created.');

    console.log('🎉 Fake data generation complete!');
}

main()
    .catch((e) => {
        console.error('❌ Error generating data:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
