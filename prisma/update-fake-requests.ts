
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const realisticRequests = [
    // English Requests
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
        title: 'SEO Optimization for Corporate Blog',
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
        title: 'Logo Design for Tech Startup',
        description: 'Creating a new brand identity for an AI startup. Need a modern, abstract logo that conveys innovation and speed. delivering vector files required.',
        budgetMin: 300,
        budgetMax: 600,
        currency: 'USD',
        urgency: 'MEDIUM'
    },

    // Arabic Requests
    {
        title: 'تطوير تطبيق توصيل طلبات',
        description: 'مطلوب مطور تطبيقات لإنشاء تطبيق توصيل مشابه لأوبر إيتس. يجب أن يدعم اللغتين العربية والإنجليزية، وتتبع الموقع الجغرافي، والدفع الإلكتروني.',
        budgetMin: 2000,
        budgetMax: 5000,
        currency: 'USD',
        urgency: 'HIGH'
    },
    {
        title: 'تصميم هوية بصرية كاملة لشركة عقارية',
        description: 'نبحث عن مصمم محترف لتصميم شعار، بطاقات عمل، ومطبوعات لشركة عقارات جديدة في دبي. التصميم يجب أن يكون فخماً وعصرياً.',
        budgetMin: 1000,
        budgetMax: 2000,
        currency: 'USD',
        urgency: 'MEDIUM'
    },
    {
        title: 'ترجمة محتوى موقع إلكتروني (إنجليزي - عربي)',
        description: 'نحتاج إلى مترجم محترف لترجمة محتوى موقع تقني من الإنجليزية إلى العربية. عدد الكلمات حوالي 5000 كلمة. الجودة والدقة مطلوبة.',
        budgetMin: 300,
        budgetMax: 500,
        currency: 'USD',
        urgency: 'LOW'
    },
    {
        title: 'إدارة حملات إعلانية على فيسبوك وانستجرام',
        description: 'مطلوب مسوق رقمي لإدارة حملات إعلانية ممولة لمتجر ملابس. الهدف هو زيادة المبيعات والوصول للجمهور المستهدف بدقة.',
        budgetMin: 600,
        budgetMax: 1200,
        currency: 'USD',
        urgency: 'URGENT'
    },
    {
        title: 'تصوير وتعديل فيديو دعائي قصير',
        description: 'نبحث عن مصور وفيديو إديتور لإنتاج فيديو دعائي مدته 30 ثانية لمنتج جديد. يتطلب العمل مونتاج احترافي وإضافة مؤثرات صوتية.',
        budgetMin: 400,
        budgetMax: 800,
        currency: 'USD',
        urgency: 'MEDIUM'
    }
];

async function main() {
    console.log('Fetching all categories...');
    const categories = await prisma.category.findMany({ select: { id: true } });

    if (categories.length === 0) {
        console.error('No categories found! Please run category seed first.');
        return;
    }

    console.log('Fetching all service requests...');
    const requests = await prisma.serviceRequest.findMany({ select: { id: true } });

    if (requests.length === 0) {
        console.log('No requests found to update.');
        return;
    }

    console.log(`Updating ${requests.length} requests...`);

    for (const req of requests) {
        // Pick specific random content
        const content = realisticRequests[Math.floor(Math.random() * realisticRequests.length)];
        // Pick random category
        const categoryId = categories[Math.floor(Math.random() * categories.length)].id;
        // Status
        const status = Math.random() > 0.1 ? 'ACTIVE' : 'COMPLETED'; // mostly active

        await prisma.serviceRequest.update({
            where: { id: req.id },
            data: {
                title: content.title,
                description: content.description,
                categoryId: categoryId,
                status: status,
                budgetMin: content.budgetMin,
                budgetMax: content.budgetMax,
                currency: content.currency,
                urgency: content.urgency as any,
                createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)), // random recent date
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
