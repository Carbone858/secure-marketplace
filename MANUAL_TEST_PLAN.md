# Manual Test Plan

> **Secure Service Marketplace** — Next.js 14.1 / Prisma / PostgreSQL  
> Version 1.2 · March 2, 2026  
> Locales: Arabic (ar, default, RTL) + English (en, LTR)

---

## 🔑 Test Credentials

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

## 🧪 Core Lifecycle Stabilization (Verified March 2026)

### Flow 1: User Creates a Project
- [x] **L1.1** — Log in as a regular user → Dashboard loads
- [x] **L1.2** — Navigate to `/requests/new` → Multi-step form appears
- [x] **L1.3** — Fill details (>20 chars), category, location → No errors
- [x] **L1.4** — Submit → Toast: "Request submitted"
- [x] **L1.5** — View project → Detail page shows **amber "Pending Admin Approval" banner**
- [x] **L1.6** — Verify invisible to others on public `/requests` list (AR and EN)

### Flow 2: Admin Operations
- [x] **L2.1** — Admin Dashboard → "Pending Approval" tab shows the project
- [x] **L2.2** — Click **Approve ✅** → Status becomes ACTIVE; in-app notification sent to user
- [x] **L2.3** — Project now visible to companies on public `/requests`
- [ ] **L2.4** — State Guard: Try to approve ACTIVE project → ❌ Error (409)
- [x] **L2.5** — Reject a project with reason → User notified; project remains hidden

### Flow 3: Company Submission
- [x] **L3.1** — Log in as company → Navigate to `/requests` → Approved project visible
- [ ] **L3.2** — Click project → "Send Offer" button visible
- [ ] **L3.3** — Fill price/days/description → Submit → Toast: "Offer Submitted ✅"
- [ ] **L3.4** — Project owner receives in-app "New Offer Received" notification
- [ ] **L3.5** — State Guard: Try duplicate offer → ❌ Error: "Already submitted"

### Flow 4: Offer Acceptance
- [ ] **L4.1** — Owner clicks **Accept Offer** → Toast: "Offer accepted! 🎉"
- [ ] **L4.2** — Other pending offers auto-rejected
- [ ] **L4.3** — Project record created; company receives "Offer accepted" notification
- [ ] **L4.4** — State Guard: Try double-accept → ❌ Error (state machine block)

### Flow 5: Atomic Deletion
- [ ] **L5.1** — Delete project with pending offers → Multi-click confirmation
- [ ] **L5.2** — Verify all PENDING offers are now WITHDRAWN in DB
- [ ] **L5.3** — Project detail URL returns 404/redirect

---

## Progress Summary

| Section | Tests | Done |
|---------|-------|------|
| L — Core Lifecycle | 25 | 0/25 |
| A — User Flow | 115 | 0/115 |
| B — Company Flow | 52 | 0/52 |
| C — Project Management | 30 | 0/30 |
| D — Company Directory | 25 | 0/25 |
| E — Admin Panel | 65 | 0/65 |
| F — Security | 43 | 0/43 |
| G — i18n / RTL / Accessibility | 28 | 0/28 |
| H — Regression | 26 | 0/26 |
| I — Contact Page | 10 | 0/10 |
| **Total** | **419** | **0/419** |

---

## A. User (Client) Flow

### A.1 Registration `/ar/auth/register`

- [ ] **A1** — Page loads with: Name, Email, Phone, Password, Confirm Password, Terms checkbox
- [ ] **A2** — Submit empty form → validation errors on all required fields
- [ ] **A3** — Invalid email (`notanemail`) → "invalid email format" error
- [ ] **A4** — Weak password (`123`) → strength indicator shows "Weak", blocked on submit
  - Rules: min 12 chars, 1 upper, 1 lower, 1 digit, 1 special
- [ ] **A5** — Strong password (`MyStr0ng!Pass99`) → strength shows "Strong" or "Very Strong"
- [ ] **A6** — Mismatched confirm password → "passwords do not match" error
- [ ] **A7** — Invalid phone (`123456`) → E.164 format error (`+XXXXXXXXXXX`)
- [ ] **A8** — Valid phone (`+963912345678`) → no error
- [ ] **A9** — Uncheck terms → "must accept terms" error
- [ ] **A10** — Complete valid registration → success message, user created
- [ ] **A11** — Duplicate email → generic error (security hardening)
- [ ] **A12** — Rate limit: 6th registration in 5 min → 429 response

### A.2 Email Verification

- [ ] **A14** — `/ar/auth/verify-email?token=VALID` → "Email verified", link to login (24h expiry)
- [ ] **A15** — Invalid or expired token → error message
- [ ] **A16** — Login with unverified email → 403, "Email not verified" + resend link
- [ ] **A17** — Click resend → new verification email sent

### A.3 Login `/ar/auth/login`

- [ ] **A18** — Page loads with: Email, Password, Remember Me checkbox
- [ ] **A19** — Submit empty → validation errors
- [ ] **A20** — Wrong credentials → "Invalid credentials" + remaining attempts shown
- [ ] **A21** — Valid login → redirect to `/ar/dashboard`
- [ ] **A22** — Remember Me checked → refresh token 30-day expiry
- [ ] **A23** — 5 wrong passwords → account locked 30 min (HTTP 423)
- [ ] **A24** — Correct password while locked → still locked, shows remaining time
- [ ] **A28** — Social Login: Google button visible and functional

### A.4 Forgot / Reset Password

- [ ] **A29** — `/ar/auth/forgot-password` → form with email field
- [ ] **A30** — Submit registered email → "Check Your Email" message
- [ ] **A31** — `/ar/auth/reset-password?token=VALID` → password fields visible
- [ ] **A32** — Weak reset password (`abc`) → validation errors
- [ ] **A33** — Valid reset → "Password Reset Successful!" + login link

### A.5 User Dashboard `/ar/dashboard`

- [ ] **A36** — Dashboard shows: Active Requests, Offers, Messages stats
- [ ] **A37** — 4 menu cards: Profile, Settings, Requests, Messages
- [ ] **A38** — Unauthenticated → redirect to `/ar/auth/login`

### A.6 Profile Management `/ar/dashboard/profile`

- [ ] **A39** — Profile form + Password change form
- [ ] **A40** — Email field is read-only, shows verified badge
- [ ] **A41** — Update name → success toast
- [ ] **A43** — Upload avatar (JPEG/PNG/WebP) → displays correctly
- [ ] **A44** — Delete avatar → removed
- [ ] **A45** — Change password (current + new + confirm) → success

### A.7 Notification Settings `/ar/dashboard/settings`

- [ ] **A46** — Page shows notification settings + delete account
- [ ] **A47** — Toggle "Email — New Offers" off → saves via API
- [ ] **A49** — All 10 toggles save independently

### A.8 Delete Account

- [ ] **A50** — Warning phase: 4 warning points + "Continue" button
- [ ] **A51** — Confirmation: password, reason, type "DELETE"
- [ ] **A54** — Wrong text (e.g. `delete`) → error (must be `DELETE`)
- [ ] **A55** — Correct password + "DELETE" → success, redirect to home

### A.9 Service Requests — Progressive SPA Wizard

- [ ] **A56** — `/ar/requests/new` loads as single-page progressive form
- [ ] **A57** — Sticky progress bar at top updates dynamically
- [ ] **A59** — Syria auto-selected; cities load from API
- [ ] **A61** — Validation errors scroll panel to first field
- [ ] **A64** — Category/Subcategory dependency works (loads from API)
- [ ] **A69** — "Allow remote / online service" checkbox works
- [ ] **A71** — Budget min > max → inline error
- [ ] **A76** — Drag & drop images → upload zone highlights
- [ ] **A80** — Tags: type + Enter added as pills; max 10
- [ ] **A82** — Visibility radio cards: PUBLIC / REGISTERED / VERIFIED
- [ ] **A89** — "Review" button expands/collapses summary panel
- [ ] **A93** — Successful submit → Success screen with auto-redirect

### A.10 Guest Request Flow `/ar/requests/start`

- [ ] **A99** — Page loads without login
- [ ] **A100** — Same SPA wizard + "Account" section
- [ ] **A102** — Guest user + request created in single transaction
- [ ] **A105** — Verification email sent with completion link

### A.12 Messaging `/ar/dashboard/messages`

- [ ] **A110** — Conversation list + message thread
- [ ] **A112** — Send message → appears in thread immediately
- [ ] **A113** — Empty message blocked

---

## B. Company (Provider) Flow

### B.1 Company Join Flow `/ar/company/join`

- [ ] **B1** — Page loads with 2-step wizard
- [ ] **B2** — Step 1: Company Details (Name/Phone/Location) validation
- [ ] **B3** — Step 2: Admin Account (Email/Password) validation
- [ ] **B4** — Valid submit → User created with role COMPANY; Company status PENDING
- [ ] **B5** — Rate limiting and duplicate email checks
- [ ] **B6** — RTL layout mirrors correctly in Arabic

### B.2 Document Upload

- [ ] **B17** — Upload form with LICENSE, ID_CARD, COMMERCIAL_REGISTER types
- [ ] **B18** — Upload PDF/Image → status: PENDING
- [ ] **B20** — Multiple documents listed with individual statuses

### B.3 Company Dashboard

- [ ] **B21** — Stats: Projects, Active, Completed, Offers
- [ ] **B22** — Rating, reviews, and membership status visible

### B.4 Browse Requests `/ar/company/dashboard/browse`

- [ ] **B25** — List of active service requests (no pending projects)
- [ ] **B26** — Filter by category and city
- [ ] **B29** — Click request → detail with "Submit Offer" button

### B.5 Submit Offers

- [ ] **B30** — Form: price, currency, estimated days, description, message
- [ ] **B31** — Offer status: PENDING after submission
- [ ] **B33** — Offer history with statuses: ACCEPTED / REJECTED / WITHDRAWN
- [ ] **B34** — Withdraw pending offer → status WITHDRAWN

---

## C. Project Management

### C.1 Lifecycle

- [ ] **C1** — Accept offer → project auto-created
- [ ] **C4** — Detail page with status, progress %, milestones, messages

### C.2 Status Transitions
- [ ] **C5** — PENDING → ACTIVE
- [ ] **C8** — ACTIVE → COMPLETED
- [ ] **C9** — ACTIVE → CANCELLED
- [ ] **C10** — Terminal state guards verify (COMPLETED/CANCELLED are final)

### C.3 Milestones
- [ ] **C12** — Add milestone (title, description, dueDate)
- [ ] **C14** — Mark complete → project progress % updates

### C.4 Project Files
- [ ] **C16** — Upload files (name, size, mimeType saved)
- [ ] **C18** — Download works correctly

---

## D. Company Directory (Yellow Pages) `/ar/companies`

- [ ] **D1** — Search, filters, company cards, pagination
- [ ] **D2** — Text search against name/description
- [ ] **D3** — Filter by Country and City (IDs and Slugs supported)
- [ ] **D6** — "Verified Only" toggle works
- [ ] **D13** — Localization: Country/City names follow current locale

---

## E. Admin Panel `/ar/admin`

- [ ] **E1** — Admin access for `admin@secure-marketplace.com`
- [ ] **E6** — System stats (Users, Companies, Requests)
- [ ] **E12** — User management (edit roles/status)
- [ ] **E16** — Company management (verify/reject)
- [ ] **E34** — Category management (icons/names/slugs)

---

## F. Security & Authorization

- [ ] **F1** — HttpOnly session cookies
- [ ] **F7** — Auth middleware protects `/dashboard`, `/company`, `/admin`
- [ ] **F26** — Rate limiting on all auth endpoints active

---

## G. i18n / RTL / Accessibility

- [ ] **G1** — Arabic as default with correct RTL mirroring
- [ ] **G2** — Header/Footer/Nav localize correctly in English
- [ ] **G19** — Dark mode persistent across sessions

---

## H. Regression Checks

- [ ] **H1** — Homepage `AvailableProjects` loads correctly
- [ ] **H3** — Critical path: Register -> Verify -> Login -> Submit Request -> Accept Offer -> Complete Project

---

## I. Contact Page `/ar/contact`

- [ ] **I1** — Glassmorphism design renders
- [ ] **I5** — Form submission creates toast
- [ ] **I9** — Icons and arrows mirror correctly in RTL

---

## ✅ Pass Criteria

1. All 419 tasks pass or are marked N/A with justification.
2. No raw translation keys (e.g., `dashboard.errors.generic`) visible.
3. State machine blocks all invalid transitions with 400/409 errors.
4. Notifications (in-app + bell) trigger for all key events.
