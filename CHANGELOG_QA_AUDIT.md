# QA Audit Changelog — Critical Fix Report

**Date:** $(date)  
**Scope:** Full Critical Fix Audit — Security, Project Management, Admin Panel, i18n/RTL, Performance, Phase 2 Preparation  
**Directive:** Fix only critical/major issues. Do not remove or alter existing functionality unless strictly necessary.

---

## Table of Contents

1. [Security & Authentication](#1-security--authentication)
2. [Project Management Lifecycle](#2-project-management-lifecycle)
3. [Admin Panel Fixes](#3-admin-panel-fixes)
4. [i18n & RTL Fixes](#4-i18n--rtl-fixes)
5. [Performance & UX](#5-performance--ux)
6. [Phase 2 Feature Flags](#6-phase-2-feature-flags)
7. [Mobile Responsiveness](#7-mobile-responsiveness)
8. [Dark Mode Fixes](#8-dark-mode-fixes)
9. [File Upload Security](#9-file-upload-security)
10. [Files Modified](#10-files-modified)
11. [Files Created](#11-files-created)
12. [Translation Keys Added](#12-translation-keys-added)
13. [No Schema Changes](#13-no-schema-changes)

---

## 1. Security & Authentication

### 1.1 Middleware Auth Protection (CRITICAL)
**File:** `src/middleware.ts`  
**Before:** Only handled i18n locale routing. All dashboard, admin, company, and API routes were unprotected at the middleware level.  
**After:** Complete rewrite with:
- **Protected route patterns** — `/dashboard/*`, `/company/*`, `/admin/*` redirect unauthenticated users to login
- **Admin route enforcement** — `/admin/*` and `/api/admin/*` require ADMIN or SUPER_ADMIN role
- **CSRF protection** — Origin/Host header validation for all state-changing API methods (POST, PUT, DELETE, PATCH)
- **Cookie-based JWT verification** — Uses `verifyTokenFromCookie()` to check the `auth_token` cookie

### 1.2 Hardcoded JWT Secret Removed (CRITICAL)
**File:** `src/lib/auth.ts`  
**Before:** Fallback secret `'your-fallback-secret-min-32-characters-long'` was hardcoded, meaning production could run without JWT_SECRET env var.  
**After:** `getJwtSecret()` function that:
- Throws an error in production if `JWT_SECRET` is not set
- Warns in development and uses a dev-only fallback
- Validates minimum 32-character length

### 1.3 Rate Limiting Added
**File created:** `src/lib/rate-limit.ts`  
**File modified:** `src/lib/auth-middleware.ts`  
- In-memory sliding window rate limiter with configurable intervals
- Pre-configured limiters: `apiLimiter` (60/min), `authLimiter` (10/min), `strictLimiter` (5/min)
- `applyRateLimit()` helper added to auth-middleware for per-route usage
- Periodic cleanup of expired entries every 5 minutes

### 1.4 Admin PUT Mass Assignment Prevention (HIGH)
**Files:** 4 admin API routes  
**Before:** Raw request body spread directly into `prisma.update()`, enabling mass assignment of any field.  
**After:** Zod validation schemas whitelist allowed fields:
| Route | Schema | Allowed Fields |
|-------|--------|----------------|
| `/api/admin/users` | `updateUserSchema` | name, role, isActive (SUPER_ADMIN role restricted) |
| `/api/admin/roles` | `updateRoleSchema` | name, nameAr, description, permissions, isActive |
| `/api/admin/departments` | `updateDeptSchema` | name, nameAr, description, isActive |
| `/api/admin/staff` | `updateStaffSchema` | roleId, departmentId, isActive |

---

## 2. Project Management Lifecycle

### 2.1 Offer Acceptance — Transaction & Auto-Project (CRITICAL)
**File:** `src/app/api/offers/[id]/route.ts`  
**Before:** Offer acceptance was non-transactional, didn't create a project, and was vulnerable to race conditions.  
**After:**
- Wrapped in `prisma.$transaction()` to prevent race conditions
- Re-checks offer status is PENDING inside transaction (double-check pattern)
- **Auto-creates a Project** from the accepted offer with correct relations
- Rejects all other pending offers on the same request
- Creates notification for the company owner
- Handles `OFFER_ALREADY_PROCESSED` error gracefully

### 2.2 Project Status Transition Validation
**File:** `src/app/api/projects/[id]/route.ts`  
- Added `VALID_STATUS_TRANSITIONS` map enforcing:
  - PENDING → [ACTIVE, CANCELLED]
  - ACTIVE → [ON_HOLD, COMPLETED, CANCELLED]
  - ON_HOLD → [ACTIVE, CANCELLED]
  - COMPLETED → [] (terminal)
  - CANCELLED → [] (terminal)
- Returns 400 with descriptive error for invalid transitions
- **Service request sync** — When project reaches COMPLETED or CANCELLED, the linked ServiceRequest status is updated accordingly

### 2.3 Company Rating Recalculation
**File:** `src/app/api/companies/[id]/reviews/route.ts`  
**Before:** Reviews were created but company rating/reviewCount were never recalculated.  
**After:** After review creation, runs `prisma.review.aggregate()` to compute average rating and count, then updates the Company record.

---

## 3. Admin Panel Fixes

### 3.1 Admin PUT Endpoint Validation
See [Section 1.4](#14-admin-put-mass-assignment-prevention-high) above for details.

### 3.2 Admin Page i18n Conversion
All 12 admin pages updated from hardcoded English strings to `useTranslations('admin')` with `t()` calls. See [Section 4](#4-i18n--rtl-fixes) for details.

### 3.3 Admin Loading States
All admin pages converted from raw `<Loader2>` spinners to `<PageSkeleton />` component for better perceived performance.

---

## 4. i18n & RTL Fixes

### 4.1 Translation Keys Added (~250 keys per language)
**Files:** `messages/en.json`, `messages/ar.json`  
New translation namespaces added:
- `admin.common.*` — Shared admin terms (create, cancel, save, etc.)
- `admin.users.*` — User management page
- `admin.companies_mgmt.*` — Company management page
- `admin.requests_mgmt.*` — Request management page
- `admin.projects_mgmt.*` — Project management page  
- `admin.offers_mgmt.*` — Offer management page
- `admin.categories_mgmt.*` — Category management page (with toasts)
- `admin.reviews_mgmt.*` — Review management page
- `admin.verifications_mgmt.*` — Verification management page
- `admin.staff_mgmt.*` — Staff management page (tabs, toasts, confirms)
- `admin.featureFlags_mgmt.*` — Feature flags page (ON/OFF, toasts)
- `admin.messages_mgmt.*` — Messages page
- `admin.settings_mgmt.*` — Settings page (toasts, maintenance mode)
- `dashboard_pages.messages.*` — Dashboard messages (toasts, placeholders)
- `dashboard_pages.reviews.*` — Dashboard reviews (empty states)
- `dashboard_pages.projects.*` — Dashboard projects (toasts, labels)
- `dashboard_pages.requests.*` — Dashboard requests (toasts, dialog text)
- `nav.userMenu.profile` / `nav.userMenu.settings` — Navigation links

### 4.2 Pages Updated with i18n

**Admin pages (12 total):**
| Page | Changes |
|------|---------|
| `admin/users/page.tsx` | All strings → t(), RTL fixes, PageSkeleton |
| `admin/companies/page.tsx` | All strings → t(), RTL fixes, PageSkeleton |
| `admin/offers/page.tsx` | All strings → t(), PageSkeleton |
| `admin/projects/page.tsx` | All strings → t(), PageSkeleton |
| `admin/requests/page.tsx` | All strings → t(), RTL fixes, PageSkeleton |
| `admin/reviews/page.tsx` | All strings → t(), PageSkeleton |
| `admin/verifications/page.tsx` | All strings → t(), PageSkeleton |
| `admin/settings/page.tsx` | Remaining hardcoded strings → t(), already had PageSkeleton |
| `admin/staff/page.tsx` | All strings → t(), RTL fixes (ms-1, me-2), PageSkeleton |
| `admin/categories/page.tsx` | All strings → t(), RTL fix (me-2), PageSkeleton |
| `admin/messages/page.tsx` | All strings → t(), PageSkeleton |
| `admin/feature-flags/page.tsx` | All strings → t(), RTL fixes (me-2, toggle), PageSkeleton |

**Dashboard pages (4 total):**
| Page | Changes |
|------|---------|
| `dashboard/messages/page.tsx` | Added useTranslations, all strings → t(), RTL fixes (start-3, ps-10, text-start) |
| `dashboard/reviews/page.tsx` | Added useTranslations, all strings → t() |
| `dashboard/projects/page.tsx` | Added useTranslations, all strings → t() |
| `dashboard/requests/page.tsx` | Added 2nd translations hook (td), remaining strings → t()/td(), RTL fixes (me-2 ×5) |

**Layout (1):**
| Page | Changes |
|------|---------|
| `dashboard/layout.tsx` | Replaced manual isRTL ternaries with getTranslations() server-side i18n |

### 4.3 RTL Class Fixes
All physical direction classes converted to logical properties:
- `ml-*` → `ms-*` (margin-inline-start)
- `mr-*` → `me-*` (margin-inline-end)
- `pl-*` → `ps-*` (padding-inline-start)
- `text-left` → `text-start`
- `left-*` → `start-*`
- Feature flag toggle: `translate-x-*` → `ltr:translate-x-* rtl:-translate-x-*`

---

## 5. Performance & UX

### 5.1 Skeleton Loading Components
**File created:** `src/components/ui/skeleton.tsx`  
Exports: `Skeleton`, `TableSkeleton`, `CardSkeleton`, `DashboardSkeleton`, `PageSkeleton`  
Uses `animate-pulse` pattern for perceived performance during data loads.

### 5.2 Admin/Dashboard Pages — Loading States
All admin pages updated from `<Loader2 className="animate-spin" />` to `<PageSkeleton />` for better visual polish.

---

## 6. Phase 2 Feature Flags

### 6.1 Feature Flag Utility
**File created:** `src/lib/feature-flags.ts`  
- Defines `FEATURE_FLAG_KEYS` for Phase 1 and Phase 2 flags
- 1-minute TTL in-memory cache to avoid DB hits on every request
- Exports: `getFeatureFlag()`, `isRequestLimitActive()`, `isPaidPlanActive()`, `isYellowPagesFeaturedActive()`, `invalidateFlagCache()`

### 6.2 Flags Wired Into API Routes
| Route | Flag | Behavior |
|-------|------|----------|
| `POST /api/requests` | `isRequestLimitEnabled` | Enforces monthly request limit (10 free) when enabled |
| `POST /api/membership/subscribe` | `isCompanyPaidPlanActive` | Returns 403 "All features are free during Phase 1" when disabled |
| `GET /api/companies/search` | `isYellowPagesFeatured` | Sorts featured companies to top when enabled |

All flags are currently **disabled** — no behavior change in Phase 1.

---

## 7. Mobile Responsiveness

### 7.1 Admin Sidebar Mobile Support (CRITICAL)
**File:** `src/components/admin/AdminSidebar.tsx`  
**Before:** Sidebar was always rendered at `w-64` with no mobile breakpoint. On mobile, it consumed ~66% of viewport width.  
**After:**
- Desktop: `hidden md:flex` — sidebar visible only on md+ screens with collapse toggle
- Mobile: Floating hamburger button (Menu icon, `fixed top-3 start-3`) opens an overlay drawer
- Overlay drawer includes backdrop dimmer, X close button, auto-closes on link click
- Nav list has `overflow-y-auto` for scrolling on short viewports

### 7.2 Admin Layout Responsive Padding
**File:** `src/app/[locale]/admin/layout.tsx`  
**Before:** `p-8` (fixed padding)  
**After:** `p-4 md:p-6 lg:p-8` (responsive)

### 7.3 Dashboard Layout Mobile Navigation (CRITICAL)
**File:** `src/app/[locale]/dashboard/layout.tsx`  
**Before:** All nav links in a single `flex justify-between` row — squished on mobile.  
**After:**
- Desktop: `hidden sm:flex` nav, user name visible
- Mobile: Separate scrollable nav row below header with `overflow-x-auto`
- User name hidden on mobile (`hidden sm:inline`), logout always visible
- Responsive padding on main content (`py-4 sm:py-6 lg:py-8`)

### 7.4 Navbar Missing Mobile Links
**File:** `src/components/layout/Navbar.tsx`  
RTL fix: 4 instances of `mr-2` → `me-2` in dropdown menu icons.

---

## 8. Dark Mode Fixes

### 8.1 text-white → text-primary-foreground
| File | Before | After |
|------|--------|-------|
| `AdminSidebar.tsx` | Active link: `text-white` | `text-primary-foreground` |
| `Layouts.tsx` Section primary | `text-white` | `text-primary-foreground` |

---

## 9. File Upload Security

### 9.1 Files Moved Out of public/ (CRITICAL)
**Files:** `src/app/api/companies/[id]/documents/route.ts`, `src/app/api/user/avatar/route.ts`  
**Before:** Files stored in `public/uploads/` — accessible without authentication via direct URL.  
**After:** Files stored in `data/uploads/` — outside the public web root. Served only through authenticated API route.

### 9.2 Authenticated File Serving Route
**File created:** `src/app/api/files/[...path]/route.ts`  
- Serves files from `data/uploads/{category}/{filename}`
- Documents require authentication; avatars are semi-public
- Path traversal protection via `resolveUploadPath()`
- Sets `X-Content-Type-Options: nosniff` header

### 9.3 Magic Byte Validation
**File created:** `src/lib/upload.ts`  
- `validateFileMagicBytes()` — checks file signatures (PDF %PDF, JPEG FFD8FF, PNG 89504E47, WebP RIFF)
- Applied in both document and avatar upload endpoints
- Returns 400 if file content doesn't match claimed MIME type

### 9.4 Path Traversal Protection
**File:** `src/lib/upload.ts`  
- `resolveUploadPath()` — uses `path.basename()` + `path.resolve()` to ensure resolved path stays within expected directory
- Applied to both file serving (GET) and deletion (DELETE) operations

---

## 10. Files Modified

| File | Category |
|------|----------|
| `src/middleware.ts` | Security (complete rewrite) |
| `src/lib/auth.ts` | Security (JWT secret) |
| `src/lib/auth-middleware.ts` | Security (rate limit, admin helpers) |
| `src/app/api/admin/users/route.ts` | Security (Zod validation) |
| `src/app/api/admin/roles/route.ts` | Security (Zod validation) |
| `src/app/api/admin/departments/route.ts` | Security (Zod validation) |
| `src/app/api/admin/staff/route.ts` | Security (Zod validation) |
| `src/app/api/offers/[id]/route.ts` | Project lifecycle |
| `src/app/api/projects/[id]/route.ts` | Project lifecycle |
| `src/app/api/companies/[id]/reviews/route.ts` | Rating recalculation |
| `src/app/api/requests/route.ts` | Phase 2 flag |
| `src/app/api/companies/search/route.ts` | Phase 2 flag |
| `src/app/api/membership/subscribe/route.ts` | Phase 2 flag |
| `src/app/api/companies/[id]/documents/route.ts` | Upload security |
| `src/app/api/user/avatar/route.ts` | Upload security |
| `messages/en.json` | i18n (~250 keys added) |
| `messages/ar.json` | i18n (~250 keys added) |
| `src/app/[locale]/admin/users/page.tsx` | i18n + RTL + skeleton |
| `src/app/[locale]/admin/companies/page.tsx` | i18n + RTL + skeleton |
| `src/app/[locale]/admin/offers/page.tsx` | i18n + skeleton |
| `src/app/[locale]/admin/projects/page.tsx` | i18n + skeleton |
| `src/app/[locale]/admin/requests/page.tsx` | i18n + RTL + skeleton |
| `src/app/[locale]/admin/reviews/page.tsx` | i18n + skeleton |
| `src/app/[locale]/admin/verifications/page.tsx` | i18n + skeleton |
| `src/app/[locale]/admin/settings/page.tsx` | i18n (remaining strings) |
| `src/app/[locale]/admin/staff/page.tsx` | i18n + RTL + skeleton |
| `src/app/[locale]/admin/categories/page.tsx` | i18n + RTL + skeleton |
| `src/app/[locale]/admin/messages/page.tsx` | i18n + skeleton |
| `src/app/[locale]/admin/feature-flags/page.tsx` | i18n + RTL + skeleton |
| `src/app/[locale]/admin/layout.tsx` | Mobile responsive padding |
| `src/app/[locale]/dashboard/layout.tsx` | i18n + mobile responsive |
| `src/app/[locale]/dashboard/messages/page.tsx` | i18n + RTL |
| `src/app/[locale]/dashboard/reviews/page.tsx` | i18n |
| `src/app/[locale]/dashboard/projects/page.tsx` | i18n |
| `src/app/[locale]/dashboard/requests/page.tsx` | i18n + RTL |
| `src/components/admin/AdminSidebar.tsx` | Mobile + dark mode |
| `src/components/layout/Navbar.tsx` | RTL |
| `src/components/layout/Layouts.tsx` | Dark mode |
| `.gitignore` | Upload directory + backups |

## 11. Files Created

| File | Purpose |
|------|---------|
| `src/lib/rate-limit.ts` | In-memory sliding window rate limiter |
| `src/lib/feature-flags.ts` | Feature flag utility with TTL cache |
| `src/lib/upload.ts` | Upload path management, magic byte validation, path traversal protection |
| `src/components/ui/skeleton.tsx` | Skeleton loading components (Skeleton, TableSkeleton, CardSkeleton, PageSkeleton) |
| `src/app/api/files/[...path]/route.ts` | Authenticated file serving endpoint |

## 12. Translation Keys Added

~250 keys added to each of `messages/en.json` and `messages/ar.json` across these namespaces:
- `admin.common` (20 keys)
- `admin.users` (12 keys)
- `admin.companies_mgmt` (14 keys)
- `admin.requests_mgmt` (12 keys)
- `admin.projects_mgmt` (14 keys)
- `admin.offers_mgmt` (14 keys)
- `admin.categories_mgmt` (22 keys incl. toasts)
- `admin.reviews_mgmt` (10 keys)
- `admin.verifications_mgmt` (5 keys)
- `admin.staff_mgmt` (35 keys incl. tabs, toasts, confirms)
- `admin.featureFlags_mgmt` (18 keys incl. toasts)
- `admin.messages_mgmt` (8 keys)
- `admin.settings_mgmt` (24 keys incl. toasts, maintenance)
- `dashboard_pages.messages` (9 keys incl. toasts)
- `dashboard_pages.reviews` (7 keys)
- `dashboard_pages.projects` (12 keys incl. toasts)
- `dashboard_pages.requests` (8 keys incl. toasts)
- `nav.userMenu.profile`, `nav.userMenu.settings` (2 keys)

## 13. No Schema Changes

No database schema (Prisma) changes were made. All fixes operate within the existing schema.  
No new migrations are needed.
