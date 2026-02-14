# Manual Test Plan

> **Secure Service Marketplace** — Next.js 14.1 / Prisma / PostgreSQL  
> Version 1.0 · Feb 12, 2026  
> Locales: Arabic (ar, default, RTL) + English (en, LTR)

---

## Quick Setup

```bash
npx prisma db seed        # seed database
npm run dev               # start on localhost:3000
```

### Test Accounts

| Super Admin | `super@test.com` | `Test123456!@` |

---

## Progress Summary

| Section | Tests | Done |
|---------|-------|------|
| A — User Flow | 113 | 65/113 |
| B — Company Flow | 52 | 0/52 |
| C — Project Management | 30 | 0/30 |
| D — Company Directory | 22 | 0/22 |
| E — Admin Panel | 65 | 0/65 |
| F — Security | 43 | 0/43 |
| G — i18n / RTL / Accessibility | 28 | 0/28 |
| H — Regression | 26 | 0/26 |
| **Total** | **379** | **65/379** |

---

## A. User (Client) Flow

### A.1 Registration `/ar/auth/register`

- [x] **A1** — Page loads with: Name, Email, Phone, Password, Confirm Password, Terms checkbox
- [x] **A2** — Submit empty form → validation errors on all required fields
- [x] **A3** — Invalid email (`notanemail`) → "invalid email format" error
- [x] **A4** — Weak password (`123`) → strength indicator shows "Weak", blocked on submit
  - Rules: min 12 chars, 1 upper, 1 lower, 1 digit, 1 special
- [x] **A5** — Strong password (`MyStr0ng!Pass99`) → strength shows "Strong" or "Very Strong"
- [x] **A6** — Mismatched confirm password → "passwords do not match" error
- [x] **A7** — Invalid phone (`123456`) → E.164 format error (`+XXXXXXXXXXX`)
- [x] **A8** — Valid phone (`+963912345678`) → no error
- [x] **A9** — Uncheck terms → "must accept terms" error
- [x] **A10** — Complete valid registration → success message, user created
- [x] **A11** — Duplicate email → generic error (no "email already exists" leak for security)
- [x] **A12** — Rate limit: 6th registration in 5 min → 429 response (limit: 5, configurable via `RATE_LIMIT_REGISTER_MAX`)
- [x] **A13** — Show/hide password toggle (eye icon) works on both password fields

### A.2 Email Verification

- [ ] **A14** — `/ar/auth/verify-email?token=VALID` → "Email verified", link to login (24h expiry)
- [ ] **A15** — Invalid or expired token → error message
- [x] **A16** — Login with unverified email → 403, "Email not verified" + resend link
- [ ] **A17** — Click resend → new verification email sent

### A.3 Login `/ar/auth/login`

- [x] **A18** — Page loads with: Email, Password, Remember Me checkbox
- [x] **A19** — Submit empty → validation errors
- [x] **A20** — Wrong credentials → "Invalid credentials" + remaining attempts shown
- [x] **A21** — Valid login (`user@test.com` / `Test123456!@`) → redirect to `/ar/dashboard`
- [x] **A22** — Remember Me checked → refresh token 30-day expiry (vs 7 days default)
- [x] **A23** — 5 wrong passwords → account locked 30 min (HTTP 423)
- [x] **A24** — Correct password while locked → still locked, shows remaining time
- [x] **A25** — Show/hide password toggle works
- [x] **A26** — "Forgot password?" link → `/ar/auth/forgot-password`
- [ ] **A27** — "Create one" link → `/ar/auth/register`

### A.4 Forgot / Reset Password

- [ ] **A28** — `/ar/auth/forgot-password` → form with email field
- [x] **A29** — Submit registered email → "Check Your Email" message (reCAPTCHA v3 in background)
- [x] **A31** — `/ar/auth/reset-password?token=VALID` → new password + confirm + strength indicator
- [x] **A32** — Weak reset password (`abc`) → validation errors
- [x] **A33** — Valid reset (`NewStr0ng!Pass99`) → "Password Reset Successful!" + login link
- [x] **A34** — Mismatched reset passwords → error
- [x] **A35** — Expired/invalid token → error

### A.5 User Dashboard `/ar/dashboard`

- [x] **A36** — Dashboard shows: Active Requests, Offers, Messages stats
- [x] **A37** — 4 menu cards visible: Profile, Settings, Requests, Messages (+ "New Request" button)
- [x] **A38** — Unauthenticated → redirect to `/ar/auth/login?callbackUrl=...`

### A.6 Profile Management `/ar/dashboard/profile`

- [x] **A39** — Profile form + Password change form side by side
- [x] **A40** — Email field is read-only, shows verified/unverified badge
- [x] **A41** — Update name → success toast (min 2 chars)
- [x] **A42** — Invalid phone (`12345`) → E.164 error
- [x] **A43** — Upload avatar (JPEG/PNG/WebP) → displays via `POST /api/user/avatar`
- [x] **A44** — Delete avatar → removed via `DELETE /api/user/avatar`
- [x] **A45** — Change password (current + new + confirm) → success

### A.7 Notification Settings `/ar/dashboard/settings`

- [x] **A46** — Page shows notification settings + delete account sections
- [x] **A47** — Toggle "Email — New Offers" off → saves via `PUT /api/user/notifications`
- [x] **A48** — Security Alerts marked "Recommended" with warning on toggle
- [x] **A49** — All 10 toggles save independently (5 email + 3 push + 2 SMS)

### A.8 Delete Account

- [x] **A50** — Warning phase: 4 warning points + "Continue" button
- [x] **A51** — Continue → confirmation: password, reason (optional), type "DELETE"
- [x] **A52** — Cancel → returns to warning phase
- [x] **A53** — Wrong password → error
- [x] **A54** — Wrong text (`delete` lowercase) → error (case-sensitive: must be `DELETE`)
- [x] **A55** — Correct password + "DELETE" → success, redirect to home after 2s

### A.9 Service Requests — Progressive SPA Wizard

#### A.9.1 Page & Layout `/ar/requests/new`

- [x] **A56** — Page loads as single-page progressive form with collapsible panels: Details, Location, Budget, Images & Tags, Visibility
- [x] **A57** — Sticky progress bar at top shows 0% on empty form, updates as fields are filled
- [x] **A58** — Mini nav pills below progress bar allow jumping to any section
- [x] **A59** — Syria auto-selected as country, cities load automatically on page load

#### A.9.2 Details Panel (required, open by default)

- [x] **A60** — Panel has title input, description textarea, category/subcategory selects, urgency buttons
- [x] **A61** — Empty submit → inline errors on title (min 5), description (min 20), category required; panel auto-scrolls to first error
- [x] **A62** — Fill title (< 5 chars) → shows character counter "3/5 min" below input
- [x] **A63** — Fill description (< 20 chars) → shows character counter below textarea
- [x] **A64** — Select category → subcategory select enables, loads subcategories from API
- [x] **A65** — Urgency selector: 4 color-coded buttons (Low/Medium/High/Urgent), Medium pre-selected

#### A.9.3 Location Panel (required, open by default)

- [x] **A66** — Country dropdown (Syria pre-selected), City dropdown (populated from API)
- [x] **A67** — Change country → city dropdown clears and reloads for new country
- [x] **A68** — Address textarea available for optional detailed address
- [x] **A69** — "Allow remote / online service" checkbox toggles correctly

#### A.9.4 Budget Panel (optional, collapsed by default)

- [x] **A70** — Click panel header → expands with min/max budget + currency + deadline fields
- [ x] **A71** — Budget min > max → inline error "Invalid budget range"
- [ x] **A72** — Valid budget + currency select (USD/EUR/GBP/SAR/AED) → no errors
- [x ] **A73** — Deadline date picker works, accepts future date
- [x ] **A74** — When collapsed, badge shows budget summary (e.g., "USD 100 – 500")

#### A.9.5 Images & Tags Panel (optional, collapsed by default)

- [x/  ] **A75** — Click panel header → expands with drag & drop upload zone + tags input
- [ ] **A76** — Drag & drop images → upload zone highlights on drag-over, files upload on drop
- [ ] **A77** — Click "Browse Files" → file picker opens, selected images upload
- [ ] **A78** — Uploaded images show as thumbnail grid, hover shows X button to remove
- [ ] **A79** — Max 10 images limit enforced
- [ ] **A80** — Tags: type + Enter → tag pill added with # prefix; X removes tag; max 10 tags
- [ ] **A81** — When collapsed, badge shows image count (e.g., "3 images")

#### A.9.6 Visibility Panel (optional, collapsed by default)

- [ ] **A82** — Click panel header → expands with 3 styled radio cards: PUBLIC / REGISTERED_ONLY / VERIFIED_COMPANIES
- [ ] **A83** — PUBLIC pre-selected by default
- [ ] **A84** — "Require company verification" checkbox works with description text
- [ ] **A85** — When collapsed, badge shows visibility label if non-default

#### A.9.7 Progress Bar & Navigation

- [ ] **A86** — Progress bar reaches 100% when all 7 tracked fields filled (title, description, category, country, city, budget, visibility)
- [ ] **A87** — Sections with validation errors show red border + AlertCircle icon in header
- [ ] **A88** — Mini nav pills turn red for sections with errors, blue for open sections

#### A.9.8 Review & Submit

- [ ] **A89** — Click "Review" button in sticky bottom bar → review summary panel expands below visibility
- [ ] **A90** — Review shows: title, description, category badge, urgency badge, location, budget, images thumbnails, tags, visibility
- [ ] **A91** — Click "Hide Review" → review panel collapses
- [ ] **A92** — Click "Create Request" → validates all fields; if errors, scrolls to first errored section
- [ ] **A93** — Successful submit → success screen with checkmark, auto-redirect to `/ar/requests/{id}`

#### A.9.9 Request Management `/ar/dashboard/requests`

- [ ] **A94** — Request list with status tabs, urgency badges, offer counts
- [ ] **A95** — Click request → detail page with all fields, offers, messaging
- [ ] **A96** — Edit request → pre-populated edit form
- [ ] **A97** — Delete request → confirm dialog → removed
- [ ] **A98** — Unauthenticated → redirect to login

### A.10 Guest Request Flow `/ar/requests/start`

- [ ] **A99** — Page loads without authentication (no login required)
- [ ] **A100** — Same SPA wizard as `/requests/new` but with extra "Account" section
- [ ] **A101** — Account section shows email + password + confirm password fields
- [ ] **A102** — Fill form + provide email → calls `POST /api/auth/guest-request`
- [ ] **A103** — Success → "Check your email" screen with checkmark
- [ ] **A104** — Guest user + request created in DB in single transaction
- [ ] **A105** — Verification email sent with completion link

### A.11 Complete Registration `/ar/auth/complete-registration`

- [ ] **A106** — `/ar/auth/complete-registration?token=VALID` → password setup form with strength indicator
- [ ] **A107** — Set password (meets rules) → account activated, redirect to login
- [ ] **A108** — Invalid/expired token → error message
- [ ] **A109** — Weak password → validation errors + strength indicator shows weak

### A.12 Messaging `/ar/dashboard/messages`

- [ ] **A110** — Conversation list (left) + message thread (right)
- [ ] **A111** — Click conversation → messages load, ordered by date
- [ ] **A112** — Send message → appears in thread, saved via API
- [ ] **A113** — Empty message → blocked or validation error

---

## B. Company (Provider) Flow

### B.1 Company Registration Wizard `/ar/company/register`

- [ ] **B1** — 5-step wizard: Basic → Location → Services → Hours → Social
- [ ] **B2** — Step 1 empty name → error
- [ ] **B3** — Step 1 valid (name: "شركة التقنية", optional: description, email, phone, website)
- [ ] **B4** — Step 1 invalid email → error
- [ ] **B5** — Step 1 invalid phone → E.164 error
- [ ] **B6** — Step 2 skip country/city → errors
- [ ] **B7** — Step 2 select Syria → city dropdown loads via `/api/countries/{id}/cities`
- [ ] **B8** — Step 2 select Damascus → proceed
- [ ] **B9** — Step 3 no services → error (at least one required)
- [ ] **B10** — Step 3 add service (name, description, priceFrom, priceTo)
- [ ] **B11** — Step 3 multiple services → each removable
- [ ] **B12** — Step 4 default hours: Mon–Fri 09:00–17:00, Sat–Sun closed
- [ ] **B13** — Step 4 modify hours → accepted
- [ ] **B14** — Step 5 social links (fb, twitter, ig, linkedin, youtube) → optional
- [ ] **B15** — Submit → company created, redirect to `/ar/company/{id}/documents`
- [ ] **B16** — Duplicate → "user already has a company" error

### B.2 Document Upload

- [ ] **B17** — Upload form with document type selector
- [ ] **B18** — Upload License (PDF/image) → status: PENDING
  - Types: LICENSE, ID_CARD, COMMERCIAL_REGISTER
- [ ] **B19** — Upload commercial register → file metadata saved
- [ ] **B20** — Multiple documents → all listed with individual statuses

### B.3 Company Dashboard `/ar/company/dashboard`

- [ ] **B21** — Stats: Total Projects, Active, Completed, Total Offers
- [ ] **B22** — Additional: Accepted/Pending offers, reviews, rating, membership
- [ ] **B23** — Recent projects with status badges
- [ ] **B24** — Recent offers with status

### B.4 Browse Requests `/ar/company/dashboard/browse`

- [ ] **B25** — List of active service requests
- [ ] **B26** — Filter by category
- [ ] **B27** — Filter by city
- [ ] **B28** — Search by text (case-insensitive)
- [ ] **B29** — Click request → detail with "Submit Offer" option

### B.5 Submit Offers

- [ ] **B30** — Offer form: price, currency, estimated days, description, message
- [ ] **B31** — Valid offer (price: 500, days: 7) → status PENDING
- [ ] **B32** — Empty price → validation error
- [ ] **B33** — `/ar/company/dashboard/offers` → list with statuses
  - Statuses: PENDING / ACCEPTED / REJECTED / WITHDRAWN / EXPIRED
- [ ] **B34** — Withdraw pending offer → status WITHDRAWN

### B.6 Company Profile `/ar/company/dashboard/profile`

- [ ] **B35** — Editable company profile form
- [ ] **B36** — Update name → saved
- [ ] **B37** — Update services → saved
- [ ] **B38** — Update working hours → saved
- [ ] **B39** — Update social links → saved

### B.7 Company Projects `/ar/company/dashboard/projects`

- [ ] **B40** — List with badges: ACTIVE, PENDING, COMPLETED, CANCELLED, ON_HOLD
- [ ] **B41** — Click project → milestones, files, messages
- [ ] **B42** — Update project status → transitions correctly

### B.8 Company Reviews `/ar/company/dashboard/reviews`

- [ ] **B43** — List of reviews with star ratings and comments
- [ ] **B44** — Each review shows: avatar, name, date, stars, comment

### B.9 Membership

- [ ] **B45** — Dashboard shows current plan: FREE / BASIC / PREMIUM / ENTERPRISE
- [ ] **B46** — Plans page: features, pricing, duration (MONTHLY/QUARTERLY/YEARLY)
- [ ] **B47** — Subscribe → flow initiated via `POST /api/membership/subscribe`

### B.10 Messaging (Company Side)

- [ ] **B48** — Receive message from client → appears in inbox
- [ ] **B49** — Reply → thread updated
- [ ] **B50** — Message in project context → linked to projectId

### B.11 Verification Status

- [ ] **B51** — Badge: PENDING / UNDER_REVIEW / VERIFIED / REJECTED / EXPIRED
- [ ] **B52** — VERIFIED_COMPANIES visibility request → only accessible if verified

---

## C. Project Management

### C.1 Project Lifecycle

- [ ] **C1** — Accept offer → project auto-created (status PENDING)
- [ ] **C2** — User sees project at `/ar/dashboard/projects`
- [ ] **C3** — Company sees project at `/ar/company/dashboard/projects`
- [ ] **C4** — Detail page: title, description, status, progress %, dates, budget, milestones, files, messages

### C.2 Status Transitions

- [ ] **C5** — PENDING → ACTIVE (startDate set)
- [ ] **C6** — ACTIVE → ON_HOLD
- [ ] **C7** — ON_HOLD → ACTIVE (resume)
- [ ] **C8** — ACTIVE → COMPLETED (endDate set)
- [ ] **C9** — ACTIVE → CANCELLED
- [ ] **C10** — COMPLETED → blocked (final state)
- [ ] **C11** — CANCELLED → blocked (final state)

### C.3 Milestones

- [ ] **C12** — Add milestone: title, description, dueDate → status PENDING
- [ ] **C13** — List milestones → ordered with statuses and due dates
- [ ] **C14** — Mark milestone complete → progress % may update
- [ ] **C15** — Multiple milestones (3–5) → all display correctly

### C.4 Project Files

- [ ] **C16** — Upload file → saved with name, URL, mimeType, size, uploadedBy
- [ ] **C17** — List files → all shown with metadata
- [ ] **C18** — Download file → works correctly
- [ ] **C19** — Upload 3+ files → all listed

### C.5 Project Messaging

- [ ] **C20** — Send message in project chat → saved with projectId
- [ ] **C21** — Message history → chronological, shows sender name/avatar
- [ ] **C22** — Both user and company can message → both appear in thread

### C.6 Reviews After Project

- [ ] **C23** — Submit review: 1–5 stars + comment → linked to project and company
- [ ] **C24** — Invalid review (0 stars, empty comment) → error
- [ ] **C25** — Rating recalculated → company `rating` and `reviewCount` updated
- [ ] **C26** — Review visible on company detail page
- [ ] **C27** — One review per project (prevent duplicate)

### C.7 Progress Tracking

- [ ] **C28** — Progress bar shows 0–100%
- [ ] **C29** — Update progress → bar updates, saved to DB
- [ ] **C30** — 100% → prompts completion or auto-suggest

---

## D. Company Directory (Yellow Pages) `/ar/companies`

### D.1 Search & Browse

- [ ] **D1** — Directory loads: search bar, filters, company cards
- [ ] **D2** — Text search ("تقنية") → filtered by name/description
- [ ] **D3** — Filter by country (Syria) → only Syrian companies
- [ ] **D4** — Filter by category → matching companies
- [ ] **D5** — "Verified Only" checkbox → only VERIFIED companies
- [ ] **D6** — Sort by rating → descending
- [ ] **D7** — Sort by newest → most recent first
- [ ] **D8** — Sort by projects → most completed first
- [ ] **D9** — Pagination → page 2 loads correctly
- [ ] **D10** — No results → empty state message
- [ ] **D11** — Combined filters → intersection of all
- [ ] **D12** — Clear filters → full list returns

### D.2 Company Detail `/ar/companies/{slug}`

- [ ] **D13** — Full company profile with tabs
- [ ] **D14** — Header: logo, name, description, verification badge, rating, location
- [ ] **D15** — Contact: email, phone, website, address
- [ ] **D16** — Services tab: name, description, price range
- [ ] **D17** — Working Hours tab: days with hours, closed days marked
- [ ] **D18** — Social links: clickable (only if populated)
- [ ] **D19** — Reviews tab: stars, comment, reviewer, date
- [ ] **D20** — Submit review (logged in) → posted via `POST /api/companies/{id}/reviews`
- [ ] **D21** — Submit review (logged out) → login prompt
- [ ] **D22** — Send message → dialog, sent via `POST /api/messages`

---

## E. Admin Panel `/ar/admin`

### E.0 Access & Auth

- [ ] **E1** — Login as `admin@test.com` → admin sidebar visible
- [ ] **E2** — USER navigates to `/ar/admin` → redirected to `/ar/dashboard`
- [ ] **E3** — Sidebar has 13 items: Dashboard, Users, Companies, Verifications, Requests, Projects, Offers, Categories, Reviews, Staff, Feature Flags, Messages, Settings
- [ ] **E4** — Sidebar collapse/expand toggle works
- [ ] **E5** — Mobile (< 768px) → hamburger menu, sidebar overlay

### E.1 Dashboard

- [ ] **E6** — Stats cards: Users, Companies, Requests, Projects, Pending Verifications
- [ ] **E7** — Recent users section
- [ ] **E8** — Recent requests section
- [ ] **E9** — Requests by status distribution
- [ ] **E10** — Companies by status distribution
- [ ] **E11** — Quick links navigate correctly

### E.2 User Management `/ar/admin/users`

- [ ] **E12** — Paginated user list (20/page)
- [ ] **E13** — Search by name/email
- [ ] **E14** — Filter by role (USER / COMPANY / ADMIN / SUPER_ADMIN)
- [ ] **E15** — Pagination works

### E.3 Company Management `/ar/admin/companies`

- [ ] **E16** — Paginated company list with status badges
- [ ] **E17** — Search companies
- [ ] **E18** — Filter by status (PENDING / UNDER_REVIEW / VERIFIED / REJECTED / EXPIRED)
- [ ] **E19** — Edit company → updated via `PUT /api/admin/companies`
- [ ] **E20** — Toggle active/inactive
- [ ] **E21** — Toggle featured

### E.4 Verification Management `/ar/admin/verifications`

- [ ] **E22** — List of PENDING verifications
- [ ] **E23** — Approve → status VERIFIED, `verifiedAt` set
- [ ] **E24** — Reject → status REJECTED
- [ ] **E25** — View uploaded documents (type, filename, preview)

### E.5 Request Management `/ar/admin/requests`

- [ ] **E26** — All requests with search + status filter + pagination
- [ ] **E27** — Filter: OPEN / IN_PROGRESS / COMPLETED / CANCELLED / CLOSED
- [ ] **E28** — Click request → full detail view
- [ ] **E29** — Search by title/description

### E.6 Project Management `/ar/admin/projects`

- [ ] **E30** — All projects with pagination, status badges
- [ ] **E31** — Badge colors: ACTIVE (green), PENDING (yellow), COMPLETED (blue), CANCELLED (red), ON_HOLD (gray)

### E.7 Offer Management `/ar/admin/offers`

- [ ] **E32** — All offers with pagination, status badges
- [ ] **E33** — Statuses: PENDING, ACCEPTED, REJECTED, WITHDRAWN, EXPIRED

### E.8 Category Management `/ar/admin/categories`

- [ ] **E34** — Categories list: name (EN/AR), slug, icon
- [ ] **E35** — Create: nameEn, nameAr, slug, icon → saved
- [ ] **E36** — Edit → updated
- [ ] **E37** — Delete → removed (if no linked requests)
- [ ] **E38** — Duplicate slug → error

### E.9 Review Management `/ar/admin/reviews`

- [ ] **E39** — All reviews with pagination, star ratings
- [ ] **E40** — Delete review → removed, company rating recalculated
- [ ] **E41** — Review card: company, user, rating, comment, date

### E.10 Staff, Roles & Departments `/ar/admin/staff`

- [ ] **E42** — 3 tabs: Staff / Roles / Departments
- [ ] **E43** — Create role: name, nameAr, description, permissions
- [ ] **E44** — Create department: name, nameAr, description
- [ ] **E45** — Add staff: select user, role, department
- [ ] **E46** — Edit role permissions (JSON)
- [ ] **E47** — Toggle role active/inactive

### E.11 Feature Flags `/ar/admin/feature-flags`

- [ ] **E48** — All 8 flags with toggle switches
- [ ] **E49** — Toggle smartMatching off → value changes
  - Phase 1: smartMatching, emailVerification, reviewModeration, maintenanceMode
- [ ] **E50** — Create new flag: key, description, category, value
- [ ] **E51** — Edit flag: description/category updated
- [ ] **E52** — Phase 2 flags exist but inactive: requestLimit, paidPlan, yellowPagesFeatured, milestoneTracking
- [ ] **E53** — Maintenance mode ON → maintenance page shown

### E.12 Messages `/ar/admin/messages`

- [ ] **E54** — Read-only message list with priority badges
- [ ] **E55** — Priority colors: HIGH (red), MEDIUM (yellow), LOW (gray)
- [ ] **E56** — Details: sender, recipient, content, timestamp

### E.13 Settings & CMS `/ar/admin/settings`

- [ ] **E57** — System settings via feature flags (category=system)
- [ ] **E58** — Maintenance toggle
- [ ] **E59** — CMS pages list: title, titleAr, slug, isPublished
- [ ] **E60** — Create CMS page: title, slug, content, contentAr
- [ ] **E61** — Edit CMS page → content updated
- [ ] **E62** — CMS sections: page-based, JSON content, identifier, active flag

### E.14 Super Admin

- [ ] **E63** — Login as `super@test.com` → full access, SUPER_ADMIN role
- [ ] **E64** — All 13 admin sections accessible and functional
- [ ] **E65** — Both ADMIN and SUPER_ADMIN pass middleware checks

---

## F. Security & Authorization

### F.1 Authentication & Session

- [ ] **F1** — After login: `access_token` (httpOnly, 15min) + `refresh_token` (httpOnly, 7d) cookies set
- [ ] **F2** — After 15min: access token auto-refreshes (no re-login)
- [ ] **F3** — Clear all cookies → 401, redirect to login
- [ ] **F4** — JWT: audience = `secure-marketplace`, issuer = `secure-marketplace-api`
- [ ] **F5** — Access token payload contains `type: 'access'`
- [ ] **F6** — Logout → both cookies cleared, redirect to login

### F.2 Route Protection (Pages)

- [ ] **F7** — `/ar/dashboard` without auth → redirect to login with callbackUrl
- [ ] **F8** — `/ar/admin` without auth → redirect to login
- [ ] **F9** — `/ar/company/dashboard` without auth → redirect to login
- [ ] **F10** — USER at `/ar/admin` → redirect to dashboard
- [ ] **F11** — COMPANY at `/ar/admin` → redirect to dashboard
- [ ] **F12** — After login → redirect back to originally requested page

### F.3 API Protection

- [ ] **F13** — `GET /api/projects` without token → 401
- [ ] **F14** — `GET /api/admin/users` without auth → 401
- [ ] **F15** — USER calls `/api/admin/users` → 403 "Admin access required"
- [ ] **F16** — ADMIN calls `/api/admin/users` → 200
- [ ] **F17** — `Authorization: Bearer <token>` header works as fallback
- [ ] **F18** — Public APIs (`/api/categories`, `/api/countries`) → 200 without auth
- [ ] **F19** — All protected endpoints return 401 without auth:
  - `/api/projects`, `/api/messages`, `/api/notifications`, `/api/offers`
  - `/api/user/*`, `/api/matching/*`, `/api/membership/subscribe`, `/api/company/dashboard`

### F.4 CSRF Protection

- [ ] **F20** — Same-origin POST → succeeds
- [ ] **F21** — Cross-origin POST (`Origin: https://evil.com`) → 403 "CSRF validation failed"
- [ ] **F22** — Cross-origin PUT → 403
- [ ] **F23** — Cross-origin DELETE → 403
- [ ] **F24** — Cross-origin PATCH → 403
- [ ] **F25** — Cross-origin GET → allowed (safe/idempotent)

### F.5 Rate Limiting

- [ ] **F26** — 6 POSTs to `/api/auth/register` in 5min → 429 after 5th (prod)
- [ ] **F27** — 6 POSTs to `/api/auth/login` in 15min → 429 + `Retry-After` header
- [ ] **F28** — Response headers include `X-RateLimit-Limit` and `X-RateLimit-Remaining`

### F.6 Account Lockout

- [ ] **F29** — 5 failed logins → locked 30min (HTTP 423 + remainingMinutes)
- [ ] **F30** — Correct password while locked → still locked
- [ ] **F31** — After 30min (or DB clear) → login succeeds, failedAttempts reset

### F.7 Input Validation & Injection

- [ ] **F32** — SQL injection in search (`'; DROP TABLE users; --`) → treated as text (Prisma parameterized)
- [ ] **F33** — XSS in title (`<script>alert('xss')</script>`) → HTML escaped, no execution
- [ ] **F34** — XSS in message (`<img onerror=...>`) → escaped
- [ ] **F35** — 100KB JSON body → rejected or handled gracefully

### F.8 Password Security

- [ ] **F36** — Check DB → password stored as Argon2 hash (not plaintext)
- [ ] **F37** — `aaaaaaaaaaaa` (12 chars, no variety) → rejected
- [ ] **F38** — Register existing email → generic error (not "email already exists")
- [ ] **F39** — Forgot password with fake email → same success message

### F.9 Security Logging

- [ ] **F40** — Failed login → `SecurityLog` entry: type=LOGIN_FAILED, IP, userAgent
- [ ] **F41** — Successful login → type=LOGIN
- [ ] **F42** — Registration → type=REGISTER
- [ ] **F43** — Account lock → type=ACCOUNT_LOCKED

---

## G. i18n / RTL / Dark Mode / Accessibility

### G.1 Language Switching

- [ ] **G1** — Open `localhost:3000` → redirects to `/ar/` (Arabic default)
- [ ] **G2** — Switch to English → `/en/...`, all text English
- [ ] **G3** — Switch to Arabic → `/ar/...`, all text Arabic
- [ ] **G4** — Deep switch (`/ar/dashboard/profile` → EN) → `/en/dashboard/profile`
- [ ] **G5** — Arabic completeness: no untranslated English keys (15 namespaces)
- [ ] **G6** — English completeness: all strings translated
- [ ] **G7** — Admin in Arabic → all labels/buttons in Arabic (22 sub-namespaces)
- [ ] **G8** — Admin in English → all labels in English
- [ ] **G9** — Form validation messages → correct language per locale
- [ ] **G10** — Locale persists across navigation

### G.2 RTL Layout

- [ ] **G11** — Arabic page → `dir="rtl"`, text right-aligned
- [ ] **G12** — English page → `dir="ltr"`, text left-aligned
- [ ] **G13** — Navbar in RTL → logo right, links flow RTL
- [ ] **G14** — Admin sidebar in RTL → right side, icons mirrored
- [ ] **G15** — Forms in RTL → labels right-aligned, inputs RTL
- [ ] **G16** — Tables in RTL → headers right-aligned, data flows RTL
- [ ] **G17** — Pagination in RTL → arrows mirrored
- [ ] **G18** — Cards in RTL → content right-aligned, badges positioned correctly

### G.3 Dark Mode

- [ ] **G19** — Toggle theme (sun/moon) → dark background, light text
- [ ] **G20** — Refresh page → dark mode preserved (localStorage)
- [ ] **G21** — Dark mode consistent: home, dashboard, admin, companies
- [ ] **G22** — Forms readable in dark mode
- [ ] **G23** — Badges/buttons maintain contrast in dark mode
- [ ] **G24** — First visit follows OS preference (if no manual override)

### G.4 Responsiveness & Accessibility

- [ ] **G25** — 375px width → no horizontal scroll, hamburger menu
- [ ] **G26** — 768px width → sidebar collapses, forms stack
- [ ] **G27** — Tab through form → all fields/buttons reachable, Enter submits
- [ ] **G28** — Screen reader: inputs have labels, images have alt, buttons have aria-labels

---

## H. Regression Checks

### H.1 Previously Fixed Bugs

- [ ] **H1** — Homepage categories load without `TypeError: Cannot read properties of undefined`
- [ ] **H2** — `GET /api/categories` includes `_count: { companies: N }`
- [ ] **H3** — `npm run build` completes with 0 errors
- [ ] **H4** — `/en/` loads without errors
- [ ] **H5** — `/ar/` loads without errors, RTL

### H.2 Page Load (Zero Errors)

- [ ] **H6** — Home: `/ar/` and `/en/` → no console errors
- [ ] **H7** — Login: `/ar/auth/login` and `/en/auth/login` → renders
- [ ] **H8** — Register: `/ar/auth/register` → all fields render
- [ ] **H9** — Companies: `/ar/companies` → list loads
- [ ] **H10** — Dashboard: `/ar/dashboard` → stats + cards render
- [ ] **H11** — Admin: `/ar/admin` → dashboard stats load
- [ ] **H12** — New request: `/ar/requests/new` → wizard renders (requires auth)
- [ ] **H12b** — Guest request: `/ar/requests/start` → wizard renders (no auth needed)

### H.3 API Endpoints

- [ ] **H13** — `GET /api/categories` → 200, JSON with `categories` array
- [ ] **H14** — `GET /api/countries` → 200, JSON with countries
- [ ] **H15** — `GET /api/companies/search` → 200, companies + pagination
- [ ] **H16** — `GET /api/requests` → 200, requests + pagination
- [ ] **H17** — `POST /api/auth/login` (no body) → 400 (not 500)
- [ ] **H18** — `GET /api/projects` (no auth) → 401 (not 500)
- [ ] **H19** — `GET /api/admin/users` (no auth) → 401 (not 500)

### H.4 Cross-Browser & Performance

- [ ] **H20** — Chrome: full flow (register → login → create request)
- [ ] **H21** — Firefox: same flow works
- [ ] **H22** — Safari: same flow works
- [ ] **H23** — Mobile Chrome: responsive, all features accessible
- [ ] **H24** — Homepage load < 3 seconds on broadband
- [ ] **H25** — Lighthouse: Performance >= 70, Accessibility >= 80

---

## Appendix

### Feature Flags

| Flag | Phase | Default | Description |
|------|-------|---------|-------------|
| smartMatching | 1 | `true` | Smart matching for requests ↔ companies |
| emailVerification | 1 | `true` | Require email verification |
| reviewModeration | 1 | `true` | Admin moderation before publish |
| maintenanceMode | 1 | `false` | Global maintenance mode |
| requestLimit | 2 | `false` | Monthly request limit (10 free) |
| paidPlan | 2 | `false` | Paid subscription plans |
| yellowPagesFeatured | 2 | `false` | Featured companies in directory |
| milestoneTracking | 2 | `false` | Project milestone tracking |

### Status Enums

| Model | Flow |
|-------|------|
| Request | DRAFT → PENDING → ACTIVE → MATCHING → REVIEWING_OFFERS → ACCEPTED → IN_PROGRESS → COMPLETED / CANCELLED / EXPIRED |
| Offer | PENDING → ACCEPTED / REJECTED / WITHDRAWN / EXPIRED |
| Project | PENDING → ACTIVE → ON_HOLD → COMPLETED / CANCELLED |
| Company | PENDING → UNDER_REVIEW → VERIFIED / REJECTED / EXPIRED |
| Membership | ACTIVE → CANCELLED / EXPIRED |
| Payment | PENDING → COMPLETED / FAILED / REFUNDED |

### Route Map

**Public (no auth)**

| Route | Page |
|-------|------|
| `/{locale}` | Homepage |
| `/{locale}/auth/login` | Login |
| `/{locale}/auth/register` | Register |
| `/{locale}/auth/forgot-password` | Forgot password |
| `/{locale}/auth/reset-password` | Reset password |
| `/{locale}/auth/verify-email` | Email verification |
| `/{locale}/auth/complete-registration` | Guest password setup |
| `/{locale}/requests/start` | Guest request wizard (no auth) |
| `/{locale}/companies` | Company directory |
| `/{locale}/companies/{slug}` | Company detail |

**Protected (require login)**

| Route | Page | Role |
|-------|------|------|
| `/{locale}/dashboard` | User dashboard | Any |
| `/{locale}/dashboard/profile` | Profile & password | Any |
| `/{locale}/dashboard/settings` | Notifications & delete | Any |
| `/{locale}/dashboard/requests` | My requests | Any |
| `/{locale}/dashboard/messages` | Messaging | Any |
| `/{locale}/dashboard/reviews` | My reviews | Any |
| `/{locale}/dashboard/projects` | My projects | Any |
| `/{locale}/requests/new` | Create request (auth) | Any |
| `/{locale}/company/dashboard` | Company dashboard | COMPANY |
| `/{locale}/company/dashboard/*` | Company sub-pages | COMPANY |

**Admin (ADMIN or SUPER_ADMIN)**

| Route | Page |
|-------|------|
| `/{locale}/admin` | Dashboard |
| `/{locale}/admin/users` | Users |
| `/{locale}/admin/companies` | Companies |
| `/{locale}/admin/verifications` | Verification queue |
| `/{locale}/admin/requests` | Requests |
| `/{locale}/admin/projects` | Projects |
| `/{locale}/admin/offers` | Offers |
| `/{locale}/admin/categories` | Categories |
| `/{locale}/admin/reviews` | Reviews |
| `/{locale}/admin/staff` | Staff / Roles / Departments |
| `/{locale}/admin/feature-flags` | Feature flags |
| `/{locale}/admin/messages` | Messages |
| `/{locale}/admin/settings` | Settings & CMS |
| `/{locale}/admin/cms` | CMS Pages & Sections |

---

**Total: 379 test cases across 8 sections**  
**Coverage: 44 page routes · 60 API endpoints · 36 data models · 8 feature flags · 2 locales · dark/light modes · mobile/desktop**
