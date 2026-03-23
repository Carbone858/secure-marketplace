import { NextRequest, NextResponse } from 'next/server';
import { 
    getVerificationEmailTemplate, 
    getNewOfferEmailTemplate, 
    getPasswordResetEmailTemplate,
    getWelcomeEmailTemplate,
    getWelcomeCompanyEmailTemplate,
    getNewMessageEmailTemplate,
    getOfferAcceptedEmailTemplate,
    getVerificationStatusEmailTemplate,
    getNewReviewEmailTemplate,
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
        case 'welcome_user':
            template = getWelcomeEmailTemplate('Hamza Asfour', locale);
            break;
        case 'welcome_company':
            template = getWelcomeCompanyEmailTemplate('Expert Cool Co.', locale);
            break;
        case 'message':
            template = getNewMessageEmailTemplate('Sami Ahmad', 'AC Repair', locale);
            break;
        case 'offer_received':
            template = getNewOfferEmailTemplate(
                'Hamza', 
                'AC Maintenance & Repair', 
                'Expert Cool Co.', 
                '$450.00', 
                '#', 
                locale
            );
            break;
        case 'offer_accepted':
            template = getOfferAcceptedEmailTemplate(
                'Expert Cool Co.',
                'Elite Project Manager',
                'Villa Interior Design',
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
                locale === 'ar' ? 'جاري التنفيذ' : 'IN PROGRESS', 
                '#', 
                locale
            );
            break;
        case 'id_approved':
            template = getVerificationStatusEmailTemplate('Expert Cool Co.', true, locale);
            break;
        case 'id_rejected':
            template = getVerificationStatusEmailTemplate('Expert Cool Co.', false, locale);
            break;
        case 'new_review':
            template = getNewReviewEmailTemplate('Expert Cool Co.', 5, 'Great work, very professional!', locale);
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
