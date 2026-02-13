import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { hashPassword } from '@/lib/auth';
import { z } from 'zod';

const completeRegistrationSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
  password: z.string()
    .min(12, 'Password must be at least 12 characters')
    .max(128)
    .refine((val) => /[A-Z]/.test(val), 'Must include an uppercase letter')
    .refine((val) => /[a-z]/.test(val), 'Must include a lowercase letter')
    .refine((val) => /[0-9]/.test(val), 'Must include a number')
    .refine((val) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(val), 'Must include a special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

/**
 * POST /api/auth/complete-registration
 * Verify email + set password for guest-registered users.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = completeRegistrationSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'validation.failed', errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { token, password } = result.data;

    // Find verification token
    const verificationRecord = await prisma.verificationToken.findUnique({ where: { token } });

    if (!verificationRecord) {
      return NextResponse.json(
        { success: false, error: 'token.invalid', message: 'Invalid or expired token.' },
        { status: 400 }
      );
    }

    if (new Date() > verificationRecord.expires) {
      await prisma.verificationToken.delete({ where: { id: verificationRecord.id } });
      return NextResponse.json(
        { success: false, error: 'token.expired', message: 'Token has expired. Please submit a new request.' },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email: verificationRecord.email } });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'user.notFound', message: 'User not found.' },
        { status: 404 }
      );
    }

    // Hash new password and update user
    const hashedPassword = await hashPassword(password);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        emailVerified: new Date(),
      },
    });

    // Delete used token
    await prisma.verificationToken.delete({ where: { id: verificationRecord.id } });

    return NextResponse.json(
      {
        success: true,
        message: 'Account setup complete. You can now log in.',
        data: { userId: user.id, email: user.email },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Complete registration error:', error);
    return NextResponse.json(
      { success: false, error: 'server.error', message: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
