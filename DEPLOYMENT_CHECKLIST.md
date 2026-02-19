# 🚀 Pre-Deployment Checklist

Use this checklist before moving the site from Development to Production.

## 🛡️ Security Hardening (CRITICAL)
- [ ] **Re-enable Strict CSP**: 
    - Remove `'unsafe-eval'` from `script-src` in `next.config.js`.
    - *Note: If this breaks the UI, we must implement "CSP Nonces" for Next.js.*
- [ ] **Environment Variables Audit**: 
    - Ensure all `NEXT_PUBLIC_` variables are set correctly for the production domain.
    - Change `NODE_ENV` to `production`.
- [ ] **Auth Secrets**:
    - Ensure `NEXTAUTH_SECRET` and `JWT_SECRET` are long, random, and stored in a secure production `.env`.
- [ ] **Permissions Policy**:
    - Verify that `camera=()`, `microphone=()`, etc., are still appropriate for production.

## 📦 Database & Performance
- [ ] **Prisma Migration**: Run `npx prisma migrate deploy` on the production database.
- [ ] **Image Optimization**: Confirm `images.domains` in `next.config.js` includes the production domain.
- [ ] **Build Check**: Run `npm run build` locally to ensure no compiler errors.

## 🌐 Localization & UI
- [ ] **Default Locale**: Verify if `defaultLocale: 'ar'` is still the intended choice for the landing page.
- [ ] **Broken Links**: Run `test:e2e` (Playwright) to ensure all routes and language toggles are functional.
- [ ] **Icon Encoding Check**: Final check that all category icons render at the production URL.

## 🧪 Testing
- [ ] **Security Suite**: Run `npm run test:security`.
- [ ] **Regression Suite**: Run `npm run test:regression`.
- [ ] **E2E Visual**: Final manual walkthrough of the project posting flow.
