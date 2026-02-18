
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const realisticRequests = [
    // English Requests (Technology)
    {
        title: 'Custom E-commerce Website Development',
        description: 'Looking for an experienced developer to build a modern e-commerce site using Next.js and Tailwind CSS. Must include payment gateway integration and user dashboard.',
        budgetMin: 1500,
        budgetMax: 3000,
        currency: 'USD',
        urgency: 'MEDIUM'
    },
    {
        title: 'Mobile App UI/UX Redesign',
        description: 'Need a complete redesign of our iOS app interface. Focus on clean, minimalist aesthetics and improved user flow. Deliverables include Figma files and assets.',
        budgetMin: 800,
        budgetMax: 1200,
        currency: 'USD',
        urgency: 'HIGH'
    },
    {
        title: 'SEO Audit for Corporate Blog',
        description: 'We need an SEO expert to audit our blog, fix technical issues, and improve keyword ranking. Goal is to increase organic traffic by 50% in 3 months.',
        budgetMin: 500,
        budgetMax: 1000,
        currency: 'USD',
        urgency: 'LOW'
    },
    {
        title: 'Python Script for Data Scraping',
        description: 'Need a script to scrape product data from competitor websites daily. Must handle CAPTCHA and output data to CSV/Excel format.',
        budgetMin: 200,
        budgetMax: 400,
        currency: 'USD',
        urgency: 'URGENT'
    },
    {
        title: 'Modern Logo Design for Tech Startup',
        description: 'Creating a new brand identity for an AI startup. Need a modern, abstract logo that conveys innovation and speed. Vector files required.',
        budgetMin: 300,
        budgetMax: 600,
        currency: 'USD',
        urgency: 'MEDIUM'
    },
    // Arabic Requests (Business & Creative)
    {
        title: 'تطوير تطبيق توصيل طلبات',
        description: 'مطلوب مطور تطبيقات لإنشاء تطبيق توصيل مشابه لأوبر إيتس. يجب أن يدعم اللغتين العربية والإنجليزية، وتتبع الموقع الجغرافي، والدفع الإلكتروني.',
        budgetMin: 2500,
        budgetMax: 5000,
        currency: 'USD',
        urgency: 'HIGH'
    },
    {
        title: 'تصميم هوية بصرية لشركة عقارية',
        description: 'نبحث عن مصمم محترف لتصميم شعار، بطاقات عمل، ومطبوعات لشركة عقارات جديدة في دبي. التصميم يجب أن يكون فخماً وعصرياً.',
        budgetMin: 1000,
        budgetMax: 2000,
        currency: 'USD',
        urgency: 'MEDIUM'
    },
    {
        title: 'ترجمة محتوى موقع إلكتروني (EN-AR)',
        description: 'نحتاج إلى مترجم محترف لترجمة محتوى موقع تقني من الإنجليزية إلى العربية. عدد الكلمات حوالي 5000 كلمة. الجودة والدقة مطلوبة.',
        budgetMin: 400,
        budgetMax: 800,
        currency: 'USD',
        urgency: 'LOW'
    },
    {
        title: 'إدارة حملات إعلانية للسوشيال ميديا',
        description: 'مطلوب مسوق رقمي لإدارة حملات إعلانية ممولة لمتجر ملابس. الهدف هو زيادة المبيعات والوصول للجمهور المستهدف بدقة.',
        budgetMin: 600,
        budgetMax: 1200,
        currency: 'USD',
        urgency: 'URGENT'
    },
    {
        title: 'مونتاج فيديو دعائي قصير',
        description: 'نبحث عن فيديو إديتور لإنتاج فيديو دعائي مدته 30 ثانية لمنتج جديد. يتطلب العمل مونتاج احترافي، مؤثرات صوتية، وتصحيح ألوان.',
        budgetMin: 300,
        budgetMax: 500,
        currency: 'USD',
        urgency: 'MEDIUM'
    }
];

async function main() {
    console.log('Fetching all categories...');
    const categories = await prisma.category.findMany();

    if (categories.length === 0) {
        console.error('No categories found! Please run category seed first.');
        return;
    }

    console.log(`Found ${categories.length} categories.`);

    console.log('Fetching all service requests...');
    const requests = await prisma.serviceRequest.findMany();

    if (requests.length === 0) {
        console.log('No requests found to update.');
        return;
    }

    console.log(`Updating ${requests.length} requests...`);

    for (const req of requests) {
        const content = realisticRequests[Math.floor(Math.random() * realisticRequests.length)];
        const category = categories[Math.floor(Math.random() * categories.length)];

        // 90% chance to be ACTIVE
        const status = Math.random() > 0.1 ? 'ACTIVE' : 'COMPLETED';

        await prisma.serviceRequest.update({
            where: { id: req.id },
            data: {
                title: content.title,
                description: content.description,
                categoryId: category.id,
                status: status,
                budgetMin: content.budgetMin,
                budgetMax: content.budgetMax,
                currency: content.currency,
                urgency: content.urgency,
                // Make dates recent (last 30 days)
                createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)),
            }
        });
    }

    console.log('All requests updated successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
