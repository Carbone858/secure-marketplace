import { z } from 'zod';

// Password requirements
const passwordRequirements = {
  minLength: 12,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: true,
};

// Password validation regex
const passwordRegex = {
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  number: /[0-9]/,
  specialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
};

// Phone number validation (international format: +xxx or 00xxx)
const phoneRegex = /^(\+|00)[1-9]\d{1,14}$/;

// Email validation
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Password strength checker
 * Returns score (0-5) and feedback
 */
export function checkPasswordStrength(password: string): {
  score: number;
  feedback: string[];
  isValid: boolean;
} {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= passwordRequirements.minLength) {
    score++;
  } else {
    feedback.push('password.minLength');
  }

  if (passwordRegex.uppercase.test(password)) {
    score++;
  } else {
    feedback.push('password.requireUppercase');
  }

  if (passwordRegex.lowercase.test(password)) {
    score++;
  } else {
    feedback.push('password.requireLowercase');
  }

  if (passwordRegex.number.test(password)) {
    score++;
  } else {
    feedback.push('password.requireNumber');
  }

  if (passwordRegex.specialChar.test(password)) {
    score++;
  } else {
    feedback.push('password.requireSpecialChar');
  }

  return {
    score,
    feedback,
    isValid: score === 5,
  };
}

/**
 * Registration form validation schema
 */
export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, 'email.required')
      .regex(emailRegex, 'email.invalid')
      .max(255, 'email.tooLong')
      .transform((val) => val.toLowerCase().trim()),
    password: z
      .string()
      .min(1, 'password.required')
      .min(passwordRequirements.minLength, 'password.minLength')
      .max(passwordRequirements.maxLength, 'password.maxLength')
      .refine(
        (val) => passwordRegex.uppercase.test(val),
        'password.requireUppercase'
      )
      .refine(
        (val) => passwordRegex.lowercase.test(val),
        'password.requireLowercase'
      )
      .refine(
        (val) => passwordRegex.number.test(val),
        'password.requireNumber'
      )
      .refine(
        (val) => passwordRegex.specialChar.test(val),
        'password.requireSpecialChar'
      ),
    confirmPassword: z.string().min(1, 'confirmPassword.required'),
    name: z
      .string()
      .min(1, 'name.required')
      .min(2, 'name.minLength')
      .max(100, 'name.maxLength')
      .trim(),
    phone: z
      .string()
      .min(1, 'phone.required')
      .regex(phoneRegex, 'phone.invalid')
      .transform((val) => {
        // Normalize 00 prefix to + for consistent storage
        const trimmed = val.trim();
        return trimmed.startsWith('00') ? '+' + trimmed.slice(2) : trimmed;
      }),
    termsAccepted: z.boolean().refine((val) => val === true, 'terms.required'),
    recaptchaToken: z.string().optional().default(''),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'password.mismatch',
    path: ['confirmPassword'],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * Login form validation schema
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'email.required')
    .regex(emailRegex, 'email.invalid')
    .transform((val) => val.toLowerCase().trim()),
  password: z.string().min(1, 'password.required'),
  rememberMe: z.boolean().default(false),
  recaptchaToken: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Email verification schema
 */
export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'token.required'),
});

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;

/**
 * Resend verification email schema
 */
export const resendVerificationSchema = z.object({
  email: z
    .string()
    .min(1, 'email.required')
    .regex(emailRegex, 'email.invalid')
    .transform((val) => val.toLowerCase().trim()),
  recaptchaToken: z.string().optional().default(''),
});

export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;

/**
 * Forgot password schema
 */
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'email.required')
    .regex(emailRegex, 'email.invalid')
    .transform((val) => val.toLowerCase().trim()),
  recaptchaToken: z.string().optional().default(''),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

/**
 * Reset password schema
 */
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'token.required'),
    password: z
      .string()
      .min(1, 'password.required')
      .min(passwordRequirements.minLength, 'password.minLength')
      .max(passwordRequirements.maxLength, 'password.maxLength')
      .refine(
        (val) => passwordRegex.uppercase.test(val),
        'password.requireUppercase'
      )
      .refine(
        (val) => passwordRegex.lowercase.test(val),
        'password.requireLowercase'
      )
      .refine(
        (val) => passwordRegex.number.test(val),
        'password.requireNumber'
      )
      .refine(
        (val) => passwordRegex.specialChar.test(val),
        'password.requireSpecialChar'
      ),
    confirmPassword: z.string().min(1, 'confirmPassword.required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'password.mismatch',
    path: ['confirmPassword'],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

/**
 * Sanitize input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
}

/**
 * Hash email for secure lookups
 * Compatible with both Node.js and Browser environments
 */
export async function hashEmail(email: string): Promise<string> {
  const normalizedEmail = email.toLowerCase().trim();

  // Server-side (Node.js)
  if (typeof window === 'undefined') {
    const { createHash } = await import('crypto');
    return createHash('sha256').update(normalizedEmail).digest('hex');
  }

  // Client-side (Browser)
  const encoder = new TextEncoder();
  const data = encoder.encode(normalizedEmail);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}
