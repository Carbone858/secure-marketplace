/**
 * Environment variable validation
 * Import this module early to fail fast on missing config
 */

const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
] as const;

const optionalEnvVars = [
  'NEXT_PUBLIC_APP_URL',
  'NEXT_PUBLIC_RECAPTCHA_SITE_KEY',
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS',
  'SMTP_FROM',
] as const;

function validateEnv() {
  const missing: string[] = [];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  // JWT_SECRET must be at least 32 characters
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    console.warn('[ENV] WARNING: JWT_SECRET should be at least 32 characters for security');
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.map((v) => `  - ${v}`).join('\n')}\n\nPlease set them in your .env file.`
    );
  }

  // Log optional env var status in development
  if (process.env.NODE_ENV === 'development') {
    for (const envVar of optionalEnvVars) {
      if (!process.env[envVar]) {
        console.warn(`[ENV] Optional variable ${envVar} is not set`);
      }
    }
  }
}

// Run validation on import
validateEnv();

export const env = {
  DATABASE_URL: process.env.DATABASE_URL!,
  JWT_SECRET: process.env.JWT_SECRET!,
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
} as const;
