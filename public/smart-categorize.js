
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const templates = [
    // IT & Software
    {
        keywords: ['web', 'software', 'programming', 'it', 'development'],
        data: {
            title: 'Custom E-commerce Website Development',
            description: 'Looking for a full-stack developer to build a scalable e-commerce platform using Next.js and Node.js. Must include payment integration.',
            budgetMin: 2000,
            budgetMax: 5000,
            currency: 'USD'
        }
    },
    {
        keywords: ['app', 'mobile', 'android', 'ios'],
        data: {
            title: 'Mobile App Development for Food Delivery',
            description: 'Need a native iOS and Android app for a new food delivery service. Features include GPS tracking, user profiles, and order management.',
            budgetMin: 3000,
            budgetMax: 8000,
            currency: 'USD'
        }
    },
    {
        keywords: ['python', 'data', 'script'],
        data: {
            title: 'Python Data Scraping Script',
            description: 'Need a Python script to scrape real estate data from 3 major websites daily and export to CSV.',
            budgetMin: 200,
            budgetMax: 500,
            currency: 'USD'
        }
    },

    // Design & Creative
    {
        keywords: ['design', 'graphic', 'logo', 'creative', 'art'],
        data: {
            title: 'Brand Identity Design',
            description: 'Looking for a creative designer to build a complete brand identity including logo, color palette, and business cards.',
            budgetMin: 500,
            budgetMax: 1500,
            currency: 'USD'
        }
    },
    {
        keywords: ['video', 'animation', 'montage'],
        data: {
            title: 'Promotional Video Editing',
            description: 'Need a professional video editor to create a 60-second promo video for our new product. Raw footage provided.',
            budgetMin: 300,
            budgetMax: 800,
            currency: 'USD'
        }
    },

    // Marketing
    {
        keywords: ['marketing', 'seo', 'social', 'digital'],
        data: {
            title: 'SEO & Content Marketing Strategy',
            description: 'We need an SEO expert to improve our Google ranking and create a 3-month content calendar.',
            budgetMin: 800,
            budgetMax: 2000,
            currency: 'USD'
        }
    },

    // Writing
    {
        keywords: ['writing', 'translation', 'content'],
        data: {
            title: 'Technical Blog Writing',
            description: 'Looking for a writer with tech background to write 4 detailed articles about Cloud Computing and AI.',
            budgetMin: 200,
            budgetMax: 400,
            currency: 'USD'
        }
    },

    // Business
    {
        keywords: ['business', 'consulting', 'finance', 'accounting'],
        data: {
            title: 'Business Plan for Startup',
            description: 'Need a financial consultant to help create a 5-year business plan and financial projection for a tech startup.',
            budgetMin: 1000,
            budgetMax: 3000,
            currency: 'USD'
        }
    }
];

// Helper to find best category match
function findCategory(categories, keywords) {
    for (const keyword of keywords) {
        const match = categories.find(c =>
            c.nameEn.toLowerCase().includes(keyword.toLowerCase()) ||
            c.slug.toLowerCase().includes(keyword.toLowerCase())
        );
        if (match) return match.id;
    }
    // Fallback: try to find "Other" or just pick random
    const other = categories.find(c => c.slug === 'other' || c.nameEn === 'Other');
    if (other) return other.id;
    return categories[Math.floor(Math.random() * categories.length)].id;
}

async function main() {
    console.log('Fetching all categories...');
    const categories = await prisma.category.findMany();

    if (categories.length === 0) {
        console.log('No categories. Cannot proceed.');
        return;
    }

    console.log('Fetching all requests...');
    const requests = await prisma.serviceRequest.findMany();
    console.log(`Found ${requests.length} requests to update.`);

    let updatedCount = 0;

    for (const req of requests) {
        // Pick a random template
        const template = templates[Math.floor(Math.random() * templates.length)];

        // Find matching category
        const categoryId = findCategory(categories, template.keywords);

        // Update request
        await prisma.serviceRequest.update({
            where: { id: req.id },
            data: {
                title: template.data.title,
                description: template.data.description,
                budgetMin: template.data.budgetMin,
                budgetMax: template.data.budgetMax,
                currency: template.data.currency,
                categoryId: categoryId,
                status: 'ACTIVE',
                isActive: true,
                visibility: 'PUBLIC'
            }
        });
        updatedCount++;
        if (updatedCount % 10 === 0) process.stdout.write('.');
    }

    console.log('\nDone! Updated ' + updatedCount + ' requests with smart categorization.');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
