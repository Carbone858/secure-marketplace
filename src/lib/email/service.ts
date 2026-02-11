import nodemailer from 'nodemailer';
import { EmailTemplate } from './templates';

// Email configuration
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASSWORD = process.env.SMTP_PASSWORD || '';
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@servicemarketplace.com';
const FROM_NAME = process.env.FROM_NAME || 'Service Marketplace';

// Create transporter
const transporter = nodemailer.createTransporter({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: process.env.NODE_ENV === 'production',
  },
});

/**
 * Verify email configuration
 */
export async function verifyEmailConfig(): Promise<boolean> {
  try {
    await transporter.verify();
    console.log('✅ Email service configured successfully');
    return true;
  } catch (error) {
    console.error('❌ Email service configuration failed:', error);
    return false;
  }
}

export interface SendEmailOptions {
  to: string;
  template: EmailTemplate;
  from?: string;
  fromName?: string;
}

/**
 * Send email using nodemailer
 */
export async function sendEmail(options: SendEmailOptions): Promise<{
  success: boolean;
  messageId?: string;
  error?: string;
}> {
  const { to, template, from = FROM_EMAIL, fromName = FROM_NAME } = options;

  try {
    // Validate email configuration
    if (!SMTP_USER || !SMTP_PASSWORD) {
      console.warn('⚠️ Email credentials not configured. Email not sent.');
      // In development, log the email content instead
      if (process.env.NODE_ENV !== 'production') {
        console.log('--- EMAIL WOULD BE SENT ---');
        console.log('To:', to);
        console.log('Subject:', template.subject);
        console.log('Text:', template.text);
        console.log('---------------------------');
        return { success: true, messageId: 'dev-mode' };
      }
      return { success: false, error: 'Email service not configured' };
    }

    const info = await transporter.sendMail({
      from: `"${fromName}" <${from}>`,
      to,
      subject: template.subject,
      text: template.text,
      html: template.html,
    });

    console.log('✅ Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send bulk emails (with rate limiting)
 */
export async function sendBulkEmails(
  recipients: string[],
  template: EmailTemplate,
  delayMs: number = 100
): Promise<{
  success: boolean;
  sent: number;
  failed: number;
  errors: string[];
}> {
  const results = {
    success: true,
    sent: 0,
    failed: 0,
    errors: [] as string[],
  };

  for (const to of recipients) {
    const result = await sendEmail({ to, template });
    if (result.success) {
      results.sent++;
    } else {
      results.failed++;
      results.errors.push(`${to}: ${result.error}`);
    }
    // Rate limiting delay
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  results.success = results.failed === 0;
  return results;
}
