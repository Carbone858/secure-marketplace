import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { hashPassword } from '@/lib/auth';
import { sanitizeInput, hashEmail } from '@/lib/validations/auth';
import { createRequestSchema } from '@/lib/validations/request';
import { sendEmail } from '@/lib/email/service';
import { getVerificationEmailTemplate } from '@/lib/email/templates';
import { registerLimiter, getClientIp } from '@/lib/rate-limit';
import crypto from 'crypto';
import { z } from 'zod';
import { SecurityLogType } from '@prisma/client';

/* ── guest contact schema ─────────────────────────── */
const guestContactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
});

function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

function generateTempPassword(): string {
  return crypto.randomBytes(32).toString('base64url');
}

async function logSecurityEvent(
  type: SecurityLogType,
  ip: string,
  userAgent: string | null,
  metadata?: Record<string, unknown>
) {
  try {
    await prisma.securityLog.create({
      data: {
        type,
        ip,
        userAgent: userAgent?.slice(0, 255) || null,
        metadata: (metadata || {}) as any,
      },
    });
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
}

/**
 * POST /api/auth/guest-request
 * Creates a new user account (with temp password) + service request in one transaction.
 * Sends verification email with a link to complete registration (set password).
 */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const userAgent = request.headers.get('user-agent');

  try {
    // Rate limiting
    const rateLimit = await registerLimiter.check(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'rateLimit.exceeded', message: 'Too many attempts. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfter || 60) } }
      );
    }

    const body = await request.json();

    // Validate contact info
    const contactResult = guestContactSchema.safeParse({
      name: sanitizeInput(body.contact?.name || ''),
      email: sanitizeInput(body.contact?.email || ''),
      phone: body.contact?.phone ? sanitizeInput(body.contact.phone) : undefined,
    });

    if (!contactResult.success) {
      return NextResponse.json(
        { success: false, error: 'validation.failed', message: 'Invalid contact information.', errors: contactResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Validate request data
    const requestBody = {
      ...body.request,
      budgetMin: body.request?.budgetMin ? Number(body.request.budgetMin) : undefined,
      budgetMax: body.request?.budgetMax ? Number(body.request.budgetMax) : undefined,
    };
    const requestResult = createRequestSchema.safeParse(requestBody);

    if (!requestResult.success) {
      return NextResponse.json(
        { success: false, error: 'validation.failed', message: 'Invalid request data.', errors: requestResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const contact = contactResult.data;
    const requestData = requestResult.data;

    // Check if email already exists
    const emailHash = await hashEmail(contact.email);
    const existingUser = await prisma.user.findUnique({ where: { emailHash } });

    if (existingUser) {
      // If user exists but not verified, allow re-linking
      if (!existingUser.emailVerified) {
        // Create request for existing unverified user and resend verification
        const serviceRequest = await prisma.serviceRequest.create({
          data: {
            userId: existingUser.id,
            title: requestData.title,
            description: requestData.description,
            categoryId: requestData.categoryId,
            subcategoryId: requestData.subcategoryId || null,
            countryId: requestData.countryId,
            cityId: requestData.cityId,
            areaId: requestData.areaId || null,
            address: requestData.address || null,
            budgetMin: requestData.budgetMin || null,
            budgetMax: requestData.budgetMax || null,
            currency: requestData.currency,
            deadline: requestData.deadline ? new Date(requestData.deadline) : null,
            urgency: requestData.urgency,
            visibility: requestData.visibility,
            images: requestData.images || [],
            tags: requestData.tags || [],
            allowRemote: requestData.allowRemote,
            requireVerification: requestData.requireVerification,
            status: 'PENDING',
          },
        });

        // Resend verification
        const verificationToken = generateVerificationToken();
        await prisma.verificationToken.create({
          data: { email: contact.email, token: verificationToken, expires: new Date(Date.now() + 24 * 60 * 60 * 1000) },
        });

        const locale = request.headers.get('accept-language')?.startsWith('ar') ? 'ar' : 'en';
        const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/${locale}/auth/complete-registration?token=${verificationToken}`;
        const emailTemplate = getVerificationEmailTemplate(contact.name, verificationUrl, locale);
        await sendEmail({ to: contact.email, template: emailTemplate });

        return NextResponse.json(
          { success: true, message: 'Request created. Please check your email to verify your account and set your password.', data: { requestId: serviceRequest.id, emailSent: true } },
          { status: 201 }
        );
      }

      // User exists and is verified — they should log in
      return NextResponse.json(
        { success: false, error: 'user.exists', message: 'An account with this email already exists. Please log in to create a request.' },
        { status: 409 }
      );
    }

    // Create user + request in transaction
    const tempPassword = generateTempPassword();
    const hashedPassword = await hashPassword(tempPassword);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: contact.email,
          emailHash,
          password: hashedPassword,
          name: contact.name,
          phone: contact.phone || null,
          emailVerified: null,
          isActive: true,
        },
      });

      const serviceRequest = await tx.serviceRequest.create({
        data: {
          userId: user.id,
          title: requestData.title,
          description: requestData.description,
          categoryId: requestData.categoryId,
          subcategoryId: requestData.subcategoryId || null,
          countryId: requestData.countryId,
          cityId: requestData.cityId,
          areaId: requestData.areaId || null,
          address: requestData.address || null,
          budgetMin: requestData.budgetMin || null,
          budgetMax: requestData.budgetMax || null,
          currency: requestData.currency,
          deadline: requestData.deadline ? new Date(requestData.deadline) : null,
          urgency: requestData.urgency,
          visibility: requestData.visibility,
          images: requestData.images || [],
          tags: requestData.tags || [],
          allowRemote: requestData.allowRemote,
          requireVerification: requestData.requireVerification,
          status: 'PENDING',
        },
      });

      return { user, serviceRequest };
    });

    // Generate verification token
    const verificationToken = generateVerificationToken();
    await prisma.verificationToken.create({
      data: { email: contact.email, token: verificationToken, expires: new Date(Date.now() + 24 * 60 * 60 * 1000) },
    });

    // Send verification email with complete-registration link
    const locale = request.headers.get('accept-language')?.startsWith('ar') ? 'ar' : 'en';
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/${locale}/auth/complete-registration?token=${verificationToken}`;
    const emailTemplate = getVerificationEmailTemplate(contact.name, verificationUrl, locale);
    const emailResult = await sendEmail({ to: contact.email, template: emailTemplate });

    await logSecurityEvent(SecurityLogType.REGISTER, ip, userAgent, { userId: result.user.id, method: 'guest_request' });

    return NextResponse.json(
      {
        success: true,
        message: 'Request created successfully. Please check your email to verify your account.',
        data: { requestId: result.serviceRequest.id, emailSent: emailResult.success },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Guest request error:', error);
    await logSecurityEvent(SecurityLogType.REGISTER_FAILED, ip, userAgent, { reason: 'server_error', method: 'guest_request' });
    return NextResponse.json(
      { success: false, error: 'server.error', message: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
