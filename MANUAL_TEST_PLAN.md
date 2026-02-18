# Manual Test Plan

> **Secure Service Marketplace** — Next.js 14.1 / Prisma / PostgreSQL  
> Version 1.1 · Feb 17, 2026  
> Locales: Arabic (ar, default, RTL) + English (en, LTR)

---

## 🔐 Test Credentials

**Password for ALL accounts:** `Test123456!@`

| Role | Email | Notes |
|------|-------|-------|
| **Admin** | `admin@secure-marketplace.com` | Full administrative access |
| **Website Owner** (Super Admin) | `owner@secure-marketplace.com` | Root access, system configuration |
| **Verified Company** | `company@secure-marketplace.com` | Approved service provider |
| **Pending Company** | `pending@secure-marketplace.com` | Awaiting verification |
| **Standard User** | `user@secure-marketplace.com` | Regular client account |
| **Unverified User** | `unverified@secure-marketplace.com` | Email not yet verified |
| **Locked Account** | `locked@secure-marketplace.com` | Account temporarily locked (for testing lockout) |

---

## Quick Setup

```bash
npx prisma db seed        # seed database with test accounts above
npm run dev               # start on localhost:3000
```

---

## Progress Summary

| Section | Tests | Done |
|---------|-------|------|
| A — User Flow | 115 | 0/115 |
| B — Company Flow | 52 | 0/52 |
| C — Project Management | 30 | 0/30 |
| D — Company Directory | 25 | 0/25 |
| E — Admin Panel | 65 | 0/65 |
| F — Security | 43 | 0/43 |
| G — i18n / RTL / Accessibility | 28 | 0/28 |
| H — Regression | 26 | 0/26 |
| I — Contact Page | 10 | 0/10 |
| **Total** | **394** | **0/394** |

---

## A. User (Client) Flow

### A.1 Registration `/ar/auth/register`

- [ ] **A1** — Page loads with: Name, Email, Phone, Password, Confirm Password, Terms checkbox
- [ ] **A2** — Submit empty form → validation errors on all required fields
- [ ] **A3** — Invalid email (`notanemail`) → "invalid email format" error
- [ ] **A4** — Weak password (`123`) → strength indicator shows "Weak", blocked on submit
  - Rules: min 12 chars, 1 upper, 1 lower, 1 digit, 1 special
- [ ] **A5** — Strong password (`MyStr0ng!Pass99`) → strength shows "Strong" or "Very Strong"
- [ ] **A6** — Mismatched confirm password → "passwords do not match" error (Immediate feedback)
- [ ] **A7** — Invalid phone (`123456`) → E.164 format error (`+XXXXXXXXXXX`). Input restricted to digits/symbols.
- [ ] **A8** — Valid phone (`+963912345678`) → no error
- [ ] **A9** — Uncheck terms → "must accept terms" error
- [ ] **A10** — Complete valid registration → success message, user created
- [ ] **A11** — Duplicate email → generic error (no "email already exists" leak for security)
- [ ] **A12** — Rate limit: 6th registration in 5 min → 429 response (limit: 5, configurable via `RATE_LIMIT_REGISTER_MAX`)
- [ ] **A13** — Show/hide password toggle (eye icon) works on both password fields

### A.2 Email Verification

- [ ] **A14** — `/ar/auth/verify-email?token=VALID` → "Email verified", link to login (24h expiry)
- [ ] **A15** — Invalid or expired token → error message
- [ ] **A16** — Login with unverified email (`unverified@secure-marketplace.com`) → 403, "Email not verified" + resend link
- [ ] **A17** — Click resend → new verification email sent

### A.3 Login `/ar/auth/login`

- [ ] **A18** — Page loads with: Email, Password, Remember Me checkbox
- [ ] **A19** — Submit empty → validation errors
- [ ] **A20** — Wrong credentials → "Invalid credentials" + remaining attempts shown
- [ ] **A21** — Valid login (`user@secure-marketplace.com` / `Test123456!@`) → redirect to `/ar/dashboard`
- [ ] **A22** — Remember Me checked → refresh token 30-day expiry (vs 7 days default)
- [ ] **A23** — 5 wrong passwords → account locked 30 min (HTTP 423)
- [ ] **A24** — Correct password while locked (`locked@secure-marketplace.com`) → still locked, shows remaining time
- [ ] **A25** — Show/hide password toggle works
- [ ] **A26** — "Forgot password?" link → `/ar/auth/forgot-password`
- [ ] **A27** — "Create one" link → `/ar/auth/register`
- [ ] **A28** — Social Login: Google button visible and functional

### A.4 Forgot / Reset Password

- [ ] **A29** — `/ar/auth/forgot-password` → form with email field
- [ ] **A30** — Submit registered email → "Check Your Email" message (reCAPTCHA v3 in background)
- [ ] **A31** — `/ar/auth/reset-password?token=VALID` → new password + confirm + strength indicator
- [ ] **A32** — Weak reset password (`abc`) → validation errors
- [ ] **A33** — Valid reset (`NewStr0ng!Pass99`) → "Password Reset Successful!" + login link
- [ ] **A34** — Mismatched reset passwords → error
- [ ] **A35** — Expired/invalid token → error

### A.5 User Dashboard `/ar/dashboard`

- [ ] **A36** — Dashboard shows: Active Requests, Offers, Messages stats
- [ ] **A37** — 4 menu cards visible: Profile, Settings, Requests, Messages (+ "New Request" button)
- [ ] **A38** — Unauthenticated → redirect to `/ar/auth/login?callbackUrl=...`

### A.6 Profile Management `/ar/dashboard/profile`

- [ ] **A39** — Profile form + Password change form side by side
- [ ] **A40** — Email field is read-only, shows verified/unverified badge
- [ ] **A41** — Update name → success toast (min 2 chars)
- [ ] **A42** — Invalid phone (`12345`) → E.164 error
- [ ] **A43** — Upload avatar (JPEG/PNG/WebP) → displays via `POST /api/user/avatar`
- [ ] **A44** — Delete avatar → removed via `DELETE /api/user/avatar`
- [ ] **A45** — Change password (current + new + confirm) → success

### A.7 Notification Settings `/ar/dashboard/settings`

- [ ] **A46** — Page shows notification settings + delete account sections
- [ ] **A47** — Toggle "Email — New Offers" off → saves via `PUT /api/user/notifications`
- [ ] **A48** — Security Alerts marked "Recommended" with warning on toggle
- [ ] **A49** — All 10 toggles save independently (5 email + 3 push + 2 SMS)

### A.8 Delete Account

- [ ] **A50** — Warning phase: 4 warning points + "Continue" button
- [ ] **A51** — Continue → confirmation: password, reason (optional), type "DELETE"
- [ ] **A52** — Cancel → returns to warning phase
- [ ] **A53** — Wrong password → error
- [ ] **A54** — Wrong text (`delete` lowercase) → error (case-sensitive: must be `DELETE`)
- [ ] **A55** — Correct password + "DELETE" → success, redirect to home after 2s

### A.9 Service Requests — Progressive SPA Wizard

#### A.9.1 Page & Layout `/ar/requests/new`

- [ ] **A56** — Page loads as single-page progressive form with collapsible panels: Details, Location, Budget, Images & Tags, Visibility
- [ ] **A57** — Sticky progress bar at top shows 0% on empty form, updates as fields are filled
- [ ] **A58** — Mini nav pills below progress bar allow jumping to any section
- [ ] **A59** — Syria auto-selected as country, cities load automatically on page load

#### A.9.2 Details Panel (required, open by default)

- [ ] **A60** — Panel has title input, description textarea, category/subcategory selects, urgency buttons
- [ ] **A61** — Empty submit → inline errors on title (min 5), description (min 20), category required; panel auto-scrolls to first error
- [ ] **A62** — Fill title (< 5 chars) → shows character counter "3/5 min" below input
- [ ] **A63** — Fill description (< 20 chars) → shows character counter below textarea
- [ ] **A64** — Select category → subcategory select enables, loads subcategories from API
- [ ] **A65** — Urgency selector: 4 color-coded buttons (Low/Medium/High/Urgent), Medium pre-selected

#### A.9.3 Location Panel (required, open by default)

- [ ] **A66** — Country dropdown (Syria pre-selected), City dropdown (populated from API)
- [ ] **A67** — Change country → city dropdown clears and reloads for new country
- [ ] **A68** — Address textarea available for optional detailed address
- [ ] **A69** — "Allow remote / online service" checkbox toggles correctly

#### A.9.4 Budget Panel (optional, collapsed by default)

- [ ] **A70** — Click panel header → expands with min/max budget + currency + deadline fields
- [ ] **A71** — Budget min > max → inline error "Invalid budget range"
- [ ] **A72** — Valid budget + currency select (USD/EUR/GBP/SAR/AED) → no errors
- [ ] **A73** — Deadline date picker works, accepts future date
- [ ] **A74** — When collapsed, badge shows budget summary (e.g., "USD 100 – 500")

#### A.9.5 Images & Tags Panel (optional, collapsed by default)

- [ ] **A75** — Click panel header → expands with drag & drop upload zone + tags input
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
- [ ] **A101** — Account section shows email + password + confirm password fields (Immediate mismatch check)
- [ ] **A102** — Fill form + provide email (Phone input masked) → calls `POST /api/auth/guest-request`
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

### B.1 Company Join Flow `/ar/company/join`
- [ ] **B1** — Page loads with "Start Your Journey" header + 2-step form wizard
- [ ] **B2** — **Step 1: Company Details**
  - [ ] **B2a** — Validation: Empty Name/Phone/Country/City → inline errors
  - [ ] **B2b** — Select Country → City dropdown populates correctly
  - [ ] **B2c** — Phone validation: accepts international format (Input restricted to digits/symbols)
- [ ] **B3** — **Step 2: Admin Account**
  - [ ] **B3a** — Validation: Empty Name/Email/Password → inline errors
  - [ ] **B3b** — Password strength: enforces min 12 chars
  - [ ] **B3c** — Confirm Password mismatch → error (Immediate feedback)
  - [ ] **B3d** — Terms unchecked → error
- [ ] **B4** — **Submission**
  - [ ] **B4a** — Valid form → Success screen with "Check Email" message
  - [ ] **B4b** — Database check: User created with proper role COMPANY
  - [ ] **B4c** — Database check: Company created with status PENDING, linked to User
  - [ ] **B4d** — Database check: Verification Token created
  - [ ] **B4e** — Email sent: "Verify your email" received
- [ ] **B5** — **Error Handling**
  - [ ] **B5a** — Duplicate Email → Friendly error message (no stack trace)
  - [ ] **B5b** — Rate limiting → 429 after 5 attempts
- [ ] **B6** — **RTL Support**
  - [ ] **B6a** — Layout mirrors correctly in Arabic (Inputs, Labels, Steps)
  - [ ] **B6b** — "Join as Partner" link visible in Navbar (Desktop hidden on Mobile)

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

- [ ] **D1** — Directory loads: search bar, filters, company cards, pagination
- [ ] **D2** — Text search ("تقنية") → filtered by name/description against DB `contains` check
- [ ] **D3** — Filter by country (e.g., "Syria") → Supports both ID (UUID) and Code ('SY')
- [ ] **D4** — Filter by city (e.g., "Damascus") → Supports both ID (UUID) and Slug ('damascus')
- [ ] **D5** — Filter by category → Supports both ID and Slug
- [ ] **D6** — "Verified Only" checkbox → only `verificationStatus: VERIFIED`
- [ ] **D7** — Sort by rating → companies with highest average rating first
- [ ] **D8** — Sort by newest → `createdAt` descending
- [ ] **D9** — Pagination → Page 1 shows limit (e.g. 12), Page 2 loads next set
- [ ] **D10** — No results → "No companies found" empty state with "Clear Filters" button
- [ ] **D11** — Combined filters (Syria + Verified + Sorting) → intersection works correctly
- [ ] **D12** — Clear filters → resets all params, shows full list
- [ ] **D13** — Localization: Country/City names appear in AR/EN based on current locale

### D.2 Company Detail `/ar/companies/{slug}`

- [ ] **D14** — Full company profile with tabs: Overview, Services, Reviews
- [ ] **D15** — Header: Logo, Name (localized keys if avail), Description, Verification Badge, Rating, Location
- [ ] **D16** — Contact Info: Email, Phone, Website, Address (clickable Google Maps link)
- [ ] **D17** — Services tab: list of services with price ranges
- [ ] **D18** — Working Hours: displays correct schedule
- [ ] **D19** — Social links: clickable icons (Facebook, Twitter, LinkedIn, etc)
- [ ] **D20** — Reviews tab: star rating distribution, individual review cards
- [ ] **D21** — Send Message button → opens dialog/modal (requires login)

---

## E. Admin Panel `/ar/admin`

### E.0 Access & Auth

- [ ] **E1** — Login as `admin@secure-marketplace.com` → admin sidebar visible
- [ ] **E2** — Login as `owner@secure-marketplace.com` → full super admin access
- [ ] **E3** — Standard user → redirected to dashboard if accessing `/admin`

### E.1 Dashboard

- [ ] **E6** — Stats cards: Users, Companies, Requests, Projects
- [ ] **E7** — Recent activity feeds load correctly

### E.2 User Management `/ar/admin/users`

- [ ] **E12** — List all users with roles (USER, COMPANY, ADMIN, SUPER_ADMIN)
- [ ] **E13** — Search/Filter users
- [ ] **E14** — Edit user role or status (Active/Locked)

### E.3 Company Management `/ar/admin/companies`

- [ ] **E16** — List companies with verification status
- [ ] **E17** — Filter by Pending/Verified/Rejected
- [ ] **E18** — Approve/Reject company verification

### E.8 Category Management `/ar/admin/categories`

- [ ] **E34** — Categories list: name (EN/AR), slug, icon
- [ ] **E35** — Create/Edit/Delete categories

(Other Admin sections E.4 - E.13 follow similar CRUD patterns)

---

## F. Security & Authorization

### F.1 Authentication

- [ ] **F1** — Session management (HttpOnly cookies)
- [ ] **F2** — Token refresh mechanism
- [ ] **F3** — Logout clears cookies

### F.2 Route Protection

- [ ] **F7** — Protected routes redirect to login
- [ ] **F10** — Role-based access control (RBAC) enforces constraints

### F.5 Rate Limiting

- [ ] **F26** — Registration rate limits
- [ ] **F27** — Login rate limits

---

## G. i18n / RTL / Accessibility

- [ ] **G1** — Default to Arabic (`/ar`) with RTL layout
- [ ] **G2** — Switch to English (`/en`) → LTR layout
- [ ] **G3** — Data localization (Categories, Countries, Cities)
- [ ] **G19** — Dark Mode toggle works and persists

---

## H. Regression Checks

- [ ] **H1** — Homepage loads without errors
- [ ] **H2** — API endpoints return correct status codes (200, 401, 403, 404)
- [ ] **H3** — Critical flows (Register -> Login -> Dashboard) function end-to-end

---

## I. Contact Page `/ar/contact` (New)

- [ ] **I1** — Page loads with modern Glassmorphism design
- [ ] **I2** — Content (Title, Subtitle, Cards) localized correctly (AR/EN)
- [ ] **I3** — Contact Information (Email, Phone, Address) matches configuration
- [ ] **I4** — Address link opens Google Maps in new tab
- [ ] **I5** — Contact Form: Valid submission → Success toast
- [ ] **I6** — Contact Form: Empty submission → Field validation errors (Name, Email, Subject, Message)
- [ ] **I7** — Animation: Staggered entry animations play smoothly on load
- [ ] **I8** — Responsive: Cards stack on mobile, grid on desktop
- [ ] **I9** — RTL: Icons (Phone, Mail, Arrow) positioned correctly (margin-end)
- [ ] **I10** — RTL: Arrow icon in links rotates 180 degrees
