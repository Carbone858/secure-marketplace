import { NextResponse } from 'next/server';
import { sendEmail, verifyEmailConfig } from '@/lib/email/service';

export const dynamic = 'force-dynamic';

export async function GET() {
  console.log('[DEBUG] Starting Email Service Test...');
  
  const isConfigValid = await verifyEmailConfig();
  
  if (!isConfigValid) {
    return NextResponse.json({
      success: false,
      message: 'SMTP Configuration Verification Failed. Check your Vercel Environment Variables.',
      debug: {
        host: process.env.SMTP_HOST || 'default (smtp.gmail.com)',
        port: process.env.SMTP_PORT || 'default (587)',
        userExists: !!process.env.SMTP_USER,
        passExists: !!process.env.SMTP_PASSWORD
      }
    }, { status: 500 });
  }

  const testEmail = {
    to: process.env.SMTP_USER || '',
    template: {
      subject: '🚀 Secure Marketplace - LIVE SMTP TEST',
      text: 'Congratulations! If you received this, your Vercel email service is perfectly configured.',
      html: '<h1>🚀 Success!</h1><p>Your Vercel email service is working perfectly. You can now reliably send verification emails.</p>'
    }
  };

  if (!testEmail.to) {
    return NextResponse.json({
        success: false,
        message: 'SMTP_USER is not defined in environment variables.'
    }, { status: 400 });
  }

  const result = await sendEmail(testEmail);

  return NextResponse.json({
    success: result.success,
    message: result.success ? 'Email sent successfully! Check your inbox (or spam).' : 'Failed to send email. Check Vercel logs for detail.',
    error: result.error,
    messageId: result.messageId,
    config: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        user: process.env.SMTP_USER
    }
  });
}
