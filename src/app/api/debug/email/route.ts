import { NextResponse } from 'next/server';
import { sendEmail, verifyEmailConfig } from '@/lib/email/service';

export const dynamic = 'force-dynamic';

export async function GET() {
  console.log('[DEBUG] Starting Super-Diagnostic Email Test...');
  
  // Scour all environment variables to see what's visible to the server
  const allKeys = Object.keys(process.env);
  const smtpRelatedKeys = allKeys.filter(k => k.startsWith('SMTP_') || k.startsWith('FROM_') || k.includes('RECAPTCHA'));
  
  const envSummary = smtpRelatedKeys.map(key => ({
    key,
    exists: !!process.env[key],
    length: process.env[key]?.length || 0,
    isDevelopment: process.env.NODE_ENV === 'development'
  }));

  const isConfigValid = await verifyEmailConfig();
  
  const testEmailTo = process.env.SMTP_USER || '';

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
    isConfigValid,
    keysFound: envSummary,
    diagnostics: {
        host: process.env.SMTP_HOST || 'MISSING (Defaults to smtp.gmail.com)',
        port: process.env.SMTP_PORT || 'MISSING (Defaults to 587)',
        user: testEmailTo ? `${testEmailTo.substring(0, 3)}...` : 'MISSING',
        passExists: !!process.env.SMTP_PASSWORD
    },
    action: testEmailTo ? 'Attempting to send test email...' : 'Stopping. SMTP_USER is missing.'
  });
}
