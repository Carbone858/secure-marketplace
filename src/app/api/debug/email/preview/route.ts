import { NextRequest, NextResponse } from 'next/server';
import { 
    getVerificationEmailTemplate, 
    getNewOfferEmailTemplate, 
    getPasswordResetEmailTemplate,
    getWelcomeEmailTemplate,
    getRequestStatusUpdateEmailTemplate,
    getNewRequestForExistingUserTemplate
} from '@/lib/email/templates';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'verification';
    const locale = searchParams.get('locale') || 'en';
    
    let template;
    
    switch (type) {
        case 'welcome':
            template = getWelcomeEmailTemplate('Hamza Asfour', locale);
            break;
        case 'offer':
            template = getNewOfferEmailTemplate(
                'Hamza', 
                'AC Maintenance & Repair', 
                'Expert Cool Co.', 
                '$450.00', 
                '#', 
                locale
            );
            break;
        case 'reset':
            template = getPasswordResetEmailTemplate('Hamza', '#', locale);
            break;
        case 'status':
            template = getRequestStatusUpdateEmailTemplate(
                'Hamza', 
                'AC Repair', 
                locale === 'ar' ? 'تم الاكتمال' : 'Completed', 
                '#', 
                locale
            );
            break;
        case 'linked':
            template = getNewRequestForExistingUserTemplate('Hamza', '#', locale);
            break;
        default:
            template = getVerificationEmailTemplate('Hamza Asfour', '#', locale);
    }

    return new Response(template.html, {
        headers: {
            'Content-Type': 'text/html; charset=utf-8',
        },
    });
}
