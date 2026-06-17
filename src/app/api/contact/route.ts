import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/service';

export async function POST(request: Request) {
    try {
        const { name, email, subject, message } = await request.json();

        // 1. Basic validation
        if (!name || !email || !subject || !message) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        // 2. Format the email content
        const emailTemplate = {
            subject: `Contact Form Submission: ${subject}`,
            text: `New contact submission:\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
                    <h2 style="color: #0f172a; margin-bottom: 24px;">New Contact Form Submission</h2>
                    <p style="margin-bottom: 8px;"><strong>Name:</strong> ${name}</p>
                    <p style="margin-bottom: 8px;"><strong>Email:</strong> ${email}</p>
                    <p style="margin-bottom: 24px;"><strong>Subject:</strong> ${subject}</p>
                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 24px;" />
                    <p style="font-weight: bold; margin-bottom: 8px;">Message:</p>
                    <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; white-space: pre-wrap; color: #334155; line-height: 1.6;">${message}</div>
                </div>
            `
        };

        // 3. Send email to help@wassitt.com
        const result = await sendEmail({
            to: 'help@wassitt.com',
            template: emailTemplate,
            fromName: name,
            from: email
        });

        if (!result.success) {
            return NextResponse.json({ error: result.error || 'Failed to send email' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Contact API error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
