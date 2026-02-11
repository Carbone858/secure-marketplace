You are continuing the development of a **Secure Service Marketplace** website. The foundation has been built, and you need to complete all features following the tasks file.

## 📋 PROJECT CONTEXT

**What exists (completed by previous developer):**
- Next.js 14 project with TypeScript and Tailwind CSS
- Security middleware with rate limiting, CSP headers, JWT authentication
- Database schema with Prisma (25+ tables including users, companies, requests, reviews, payments, CMS)
- Argon2 password hashing and JWT utilities
- Basic homepage with AvailableProjects component
- Arabic and English translations
- Docker configuration structure

**Project Location:** `/mnt/kimi/output/secure-marketplace`

**Tasks File:** `/mnt/kimi/output/secure-marketplace/TASKS.md`

## 🎯 YOUR MISSION

Complete the marketplace by implementing tasks **sequentially** from the TASKS.md file. Start with **TASK 2.1** and work through each task in order.

## 📊 CURRENT STATUS

✅ **COMPLETED:**
- Phase 1: Core Infrastructure (security, database, middleware)

🔄 **NEXT TO BUILD:**
- Phase 2: Authentication & User Management (TASK 2.1 - 2.4)
- Phase 3: Service Request System (TASK 3.1 - 3.4)
- Phase 4: Company Directory (TASK 4.1 - 4.4)
- Phase 5: Membership & Projects (TASK 5.1 - 5.4)
- Phase 6: Real-time Features (TASK 6.1 - 6.3)
- Phase 7: CMS System (TASK 7.1 - 7.5)
- Phase 8: Admin Dashboard (TASK 8.1 - 8.6)
- Phase 9: Company Dashboard (TASK 9.1 - 9.4)
- Phase 10: Frontend Pages (TASK 10.1 - 10.3)
- Phase 11: API Development (TASK 11.1 - 11.9)

## 🚀 START WITH TASK 2.1: USER REGISTRATION SYSTEM

Build a complete, secure user registration system:

### Requirements:

1. **Registration Page** (`/src/app/[locale]/auth/register/page.tsx`)
   - Multi-step form or single comprehensive form
   - Fields: email, password, confirm password, full name, phone
   - Real-time password strength indicator
   - Terms of service checkbox
   - reCAPTCHA v3 integration
   - Responsive design (mobile + desktop)
   - RTL support for Arabic, LTR for English

2. **Form Validation** (Zod schema)
   - Email format validation
   - Password: min 12 chars, uppercase, lowercase, number, special char
   - Phone number format (international)
   - Password match confirmation
   - Terms acceptance required

3. **API Endpoint** (`/src/app/api/auth/register/route.ts`)
   - Rate limited (5 attempts per 5 minutes per IP)
   - Input sanitization (XSS prevention)
   - Check for existing email (use emailHash)
   - Argon2 password hashing
   - Create user in database
   - Generate email verification token
   - Return success response (no sensitive data)

4. **Email Verification**
   - Send verification email (use nodemailer)
   - Verification token generation (secure random)
   - Verification page (`/auth/verify-email/[token]`)
   - Token expiration (24 hours)
   - Resend verification option

5. **Security Features**
   - reCAPTCHA v3 verification
   - Rate limiting on API
   - Input sanitization
   - CSRF protection
   - Secure headers
   - Audit logging (SecurityLog table)

6. **User Experience**
   - Loading states
   - Error messages (user-friendly, not exposing system details)
   - Success confirmation
   - Redirect to login after verification
   - Progress indicator for multi-step

### Files to Create/Modify:
src/
├── app/[locale]/auth/
│   ├── register/
│   │   └── page.tsx           # Registration form
│   ├── verify-email/
│   │   └── [token]/
│   │       └── page.tsx       # Email verification
│   └── layout.tsx             # Auth layout
├── app/api/auth/
│   ├── register/
│   │   └── route.ts           # Registration API
│   ├── verify-email/
│   │   └── route.ts           # Verification API
│   └── resend-verification/
│       └── route.ts           # Resend email API
├── components/auth/
│   ├── RegisterForm.tsx       # Form component
│   ├── PasswordStrength.tsx   # Strength indicator
│   └── VerifyEmail.tsx        # Verification component
├── lib/validations/
│   └── auth.ts                # Zod schemas
├── lib/email/
│   └── templates.ts           # Email templates
└── messages/
├── ar.json                # Add translations
└── en.json                # Add translations


### Technical Requirements:

- Use existing utilities from `src/lib/auth/utils.ts` (Argon2, JWT)
- Use existing middleware for rate limiting
- Follow existing code style and patterns
- Add translations to both AR and EN files
- Ensure TypeScript strict mode compliance
- Write clean, commented code
- Test all error scenarios

### Security Checklist:

- [ ] Password hashed with Argon2id
- [ ] Email verification required before login
- [ ] Rate limiting implemented
- [ ] reCAPTCHA v3 working
- [ ] Input sanitized (no XSS)
- [ ] SQL injection prevented (Prisma)
- [ ] No sensitive data in logs
- [ ] Secure token generation
- [ ] HTTPS enforcement
- [ ] CSRF protection

### After Completing TASK 2.1:

Move to **TASK 2.2: Login System** and continue sequentially through the TASKS.md file.

Update the TASKS.md file to mark completed tasks with ✅.

## 📞 REFERENCE

**Existing Code Patterns:**
- Database: Use `prisma` from `@/lib/db/client`
- Auth: Use functions from `@/lib/auth/utils`
- Security: Middleware handles rate limiting and headers
- Translations: Use `next-intl` (see existing usage)
- Styling: Tailwind CSS with existing color scheme

**Environment Variables Needed:**

DATABASE_URL="postgresql://..."
JWT_SECRET="min-32-char-secret"
RECAPTCHA_SECRET_KEY="your-recaptcha-key"
SMTP_HOST="smtp.gmail.com"
SMTP_USER="your-email"
SMTP_PASSWORD="your-password"


## ✅ DELIVERABLE

A fully functional, secure user registration system that:
1. Allows users to register with email/password
2. Validates all inputs securely
3. Sends verification emails
4. Prevents abuse (rate limiting, CAPTCHA)
5. Works in both Arabic and English
6. Is mobile responsive
7. Follows security best practices

**Test the registration flow end-to-end before moving to next task.**

Good luck! Build secure, clean, and well-documented code.