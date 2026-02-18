import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { hashPassword } from '@/lib/auth';
import { sanitizeInput, hashEmail } from '@/lib/validations/auth';
import { sendEmail } from '@/lib/email/service';
import { getVerificationEmailTemplate } from '@/lib/email/templates';
import { registerLimiter, getClientIp } from '@/lib/rate-limit';
import crypto from 'crypto';
import { z } from 'zod';

// Standalone schema definition to avoid Zod extension issues
const companyRegisterSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(12, 'Password must be at least 12 characters'),
    confirmPassword: z.string(),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z.string().min(5, 'Invalid phone number'),
    termsAccepted: z.boolean().refine(val => val === true, "You must accept the terms"),
    recaptchaToken: z.string().optional(),

    // Company Fields
    companyName: z.string().min(2, 'Company name is required'),
    companyPhone: z.string().min(5, 'Invalid company phone'), // Simplified regex
    countryId: z.string().uuid('Invalid country'),
    cityId: z.string().uuid('Invalid city'),
    address: z.string().optional(),
    description: z.string().optional(),
    serviceIds: z.array(z.string()).optional(),
    serviceType: z.enum(['STANDARD', 'PREMIUM', 'BOTH']).optional(),
    operationAreas: z.array(z.string()).optional(),
    skills: z.array(z.string()).optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

async function verifyRecaptcha(token: string): Promise<boolean> {
    try {
        const secretKey = process.env.RECAPTCHA_SECRET_KEY;
        if (!secretKey) return process.env.NODE_ENV !== 'production';

        const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `secret=${secretKey}&response=${token}`,
        });

        const data = await response.json();
        return data.success === true && data.score >= 0.5;
    } catch (error) {
        console.error('reCAPTCHA verification failed:', error);
        return false;
    }
}

function generateVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex');
}

export async function POST(request: NextRequest) {
    const ip = getClientIp(request);

    try {
        // Rate Limit
        const rateLimit = await registerLimiter.check(ip);
        if (!rateLimit.allowed) {
            return NextResponse.json(
                { success: false, message: 'Too many attempts. Please try again later.' },
                { status: 429 }
            );
        }

        const body = await request.json();

        // Sanitize
        const sanitizedBody = {
            ...body,
            email: sanitizeInput(body.email || ''),
            name: sanitizeInput(body.name || ''),
            phone: sanitizeInput(body.phone || ''),
            companyName: sanitizeInput(body.companyName || ''),
            companyPhone: sanitizeInput(body.companyPhone || ''),
            address: sanitizeInput(body.address || ''),
            description: sanitizeInput(body.description || ''),
        };

        // Validate
        const validationResult = companyRegisterSchema.safeParse(sanitizedBody);
        if (!validationResult.success) {
            return NextResponse.json(
                { success: false, errors: validationResult.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const data = validationResult.data;

        // Verify Recaptcha
        if (data.recaptchaToken && !(await verifyRecaptcha(data.recaptchaToken))) {
            return NextResponse.json(
                { success: false, message: 'Security verification failed' },
                { status: 400 }
            );
        }

        // Check existing email
        const emailHash = await hashEmail(data.email);
        const existingUser = await prisma.user.findUnique({ where: { emailHash } });
        if (existingUser) {
            return NextResponse.json(
                { success: false, message: 'User already exists.' },
                { status: 400 }
            );
        }

        // Generate unique slug
        let slug = generateSlug(data.companyName);
        let counter = 0;
        while (await prisma.company.findUnique({ where: { slug } })) {
            counter++;
            slug = `${generateSlug(data.companyName)}-${counter}`;
        }

        const hashedPassword = await hashPassword(data.password);
        const verificationToken = generateVerificationToken();
        const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

        // Transaction: Create User + Company + Token + Services
        await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email: data.email,
                    emailHash,
                    password: hashedPassword,
                    name: data.name,
                    phone: data.phone,
                    role: 'COMPANY',
                    isActive: true,
                },
            });

            const newCompany = await tx.company.create({
                data: {
                    userId: user.id,
                    name: data.companyName,
                    slug,
                    description: data.description,
                    phone: data.companyPhone,
                    countryId: data.countryId,
                    cityId: data.cityId,
                    address: data.address,
                    operationAreas: data.operationAreas || [],
                    skills: data.skills || [],
                    verificationStatus: 'PENDING',
                    isActive: true, // Company active but pending verification
                },
            });

            await tx.verificationToken.create({
                data: {
                    email: data.email,
                    token: verificationToken,
                    expires: tokenExpiry,
                },
            });

            // Create Company Services based on selected Categories
            if (data.serviceIds && data.serviceIds.length > 0) {
                const categories = await tx.category.findMany({
                    where: { id: { in: data.serviceIds } }
                });

                for (const cat of categories) {
                    await tx.companyService.create({
                        data: {
                            companyId: newCompany.id,
                            name: cat.nameEn, // Defaulting to English name
                            description: `Service provided in category: ${cat.nameEn}`,
                            tags: [data.serviceType || 'STANDARD', cat.nameAr],
                            isActive: true
                        }
                    });
                }
            }
        });

        // Send Email
        const locale = request.headers.get('accept-language')?.startsWith('ar') ? 'ar' : 'en';
        const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/auth/verify-email/${verificationToken}`;
        const emailTemplate = getVerificationEmailTemplate(data.name, verifyUrl, locale);

        await sendEmail({ to: data.email, template: emailTemplate });

        return NextResponse.json(
            { success: true, message: 'Registration successful. Check your email.' },
            { status: 201 }
        );

    } catch (error) {
        console.error('Company Registration Error:', error);
        return NextResponse.json(
            { success: false, message: 'Server error occurred.' },
            { status: 500 }
        );
    }
}
