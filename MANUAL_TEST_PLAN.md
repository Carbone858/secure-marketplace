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
| **Admin (Ops)** | `admin-ops@secure-marketplace.com` | Broad access, no settings |
| **Finance Officer** | `finance@secure-marketplace.com` | Access to offers, projects |
| **Support Agent** | `support@secure-marketplace.com` | Access to users, messages, companies |
| **Content Manager** | `content-manager@secure-marketplace.com` | Access to CMS, categories |
| **Verification Officer** | `verification@secure-marketplace.com` | Access to verifications |
| **Staff (Employee)** | `staff-employee@secure-marketplace.com` | Restricted role for testing |
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
- [x] **L3.2** — Click project → "Send Offer" button visible
- [x] **L3.3** — Fill price/days/description → Submit → Toast: "Offer Submitted ✅"
- [x] **L3.4** — Project owner receives in-app "New Offer Received" notification
- [ ] **L3.5** — State Guard: Try duplicate offer → ❌ Error: "Already submitted"

### Flow 4: Offer Acceptance
- [x] **L4.1** — Owner clicks **Accept Offer** → Toast: "Offer accepted! 🎉"
- [ ] **L4.2** — Other pending offers auto-rejected
- [x] **L4.3** — Project record created; company receives "Offer accepted" notification
- [ ] **L4.4** — State Guard: Try double-accept → ❌ Error (state machine block)

### Flow 5: Atomic Deletion
- [x] **L5.1** — Delete project with pending offers → Multi-click confirmation
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
- [x] **A11** — Duplicate email → generic error (security hardening)
- [ ] **A12** — Rate limit: 6th registration in 5 min → 429 response

### A.2 Email Verification

- [ ] **A14** — `/ar/auth/verify-email?token=VALID` → "Email verified", link to login (24h expiry)
- [ ] **A15** — Invalid or expired token → error message
- [ ] **A16** — Login with unverified email → 403, "Email not verified" + resend link
- [ ] **A17** — Click resend → new verification email sent

### A.3 Login `/ar/auth/login`

- [x] **A18** — Page loads with: Email, Password, Remember Me checkbox
- [x] **A19** — Submit empty → validation errors
- [x] **A20** — Wrong credentials → "Invalid credentials" + remaining attempts shown
- [x] **A21** — Valid login → redirect to `/ar/dashboard`
- [ ] **A22** — Remember Me checked → refresh token 30-day expiry
- [x] **A23** — 5 wrong passwords → account locked 30 min (HTTP 423)
- [x] **A24** — Correct password while locked → still locked, shows remaining time
- [x] **A28** — Social Login: Google button visible and functional

### A.4 Forgot / Reset Password

- [x] **A29** — `/ar/auth/forgot-password` → form with email field
- [x] **A30** — Submit registered email → "Check Your Email" message
- [ ] **A31** — `/ar/auth/reset-password?token=VALID` → password fields visible
- [ ] **A32** — Weak reset password (`abc`) → validation errors
- [ ] **A33** — Valid reset → "Password Reset Successful!" + login link

### A.5 User Dashboard `/ar/dashboard`

- [x] **A36** — Dashboard shows: Active Requests, Offers, Messages stats
- [x] **A37** — 4 menu cards: Profile, Settings, Requests, Messages
- [ ] **A38** — Unauthenticated → redirect to `/ar/auth/login`

### A.6 Profile Management `/ar/dashboard/profile`

- [x] **A39** — Profile form + Password change form
- [x] **A40** — Email field is read-only, shows verified badge
- [x] **A41** — Update name → success toast
- [x] **A43** — Upload avatar (JPEG/PNG/WebP) → displays correctly
- [x] **A44** — Delete avatar → removed
- [x] **A45** — Change password (current + new + confirm) → success

### A.7 Notification Settings `/ar/dashboard/settings`

- [x] **A46** — Page shows notification settings + delete account
- [x] **A47** — Toggle "Email — New Offers" off → saves via API
- [x] **A49** — All 10 toggles save independently

### A.8 Delete Account

- [x] **A50** — Warning phase: 4 warning points + "Continue" button
- [ ] **A51** — Confirmation: password, reason, type "DELETE"
- [ ] **A54** — Wrong text (e.g. `delete`) → error (must be `DELETE`)
- [ ] **A55** — Correct password + "DELETE" → success, redirect to home

### A.9 Service Requests — Progressive SPA Wizard

- [x] **A56** — `/ar/requests/new` loads as single-page progressive form
- [x] **A57** — Sticky progress bar at top updates dynamically
- [x] **A59** — Syria auto-selected; cities load from API
- [x] **A61** — Validation errors scroll panel to first field
- [x] **A64** — Category/Subcategory dependency works (loads from API)
- [x] **A69** — "Allow remote / online service" checkbox works
- [x] **A71** — Budget min > max → inline error
- [x] **A76** — Drag & drop images → upload zone highlights
- [ ] **A80** — Tags: type + Enter added as pills; max 10
- [x] **A82** — Visibility radio cards: PUBLIC / REGISTERED / VERIFIED
- [x] **A89** — "Review" button expands/collapses summary panel
- [x] **A93** — Successful submit → Success screen with auto-redirect

### A.10 Guest Request Flow `/ar/requests/start`

- [x] **A99** — Page loads without login
- [x] **A100** — Same SPA wizard + "Account" section
- [ ] **A102** — Guest user + request created in single transaction
- [x] **A105** — Verification email sent with completion link

### A.12 Messaging `/ar/dashboard/messages`

- [x] **A110** — Conversation list + message thread
- [x] **A112** — Send message → appears in thread immediately
- [x] **A113** — Empty message blocked

---

## B. Company (Provider) Flow

### B.1 Company Join Flow `/ar/company/join`

- [x] **B1** — Page loads with 2-step wizard
- [x] **B2** — Step 1: Company Details (Name/Phone/Location) validation
- [ ] **B3** — Step 2: Admin Account (Email/Password) validation
- [x] **B4** — Valid submit → User created with role COMPANY; Company status PENDING
- [ ] **B5** — Rate limiting and duplicate email checks
- [ ] **B6** — RTL layout mirrors correctly in Arabic

### B.2 Document Upload

- [ ] **B17** — Upload form with LICENSE, ID_CARD, COMMERCIAL_REGISTER types
- [ ] **B18** — Upload PDF/Image → status: PENDING
- [ ] **B20** — Multiple documents listed with individual statuses

### B.3 Company Dashboard

- [x] **B21** — Stats: Projects, Active, Completed, Offers
- [x] **B22** — Rating, reviews, and membership status visible

### B.4 Browse Requests `/ar/company/dashboard/browse`

- [x] **B25** — List of active service requests (no pending projects)
- [x] **B26** — Filter by category and city
- [x] **B29** — Click request → detail with "Submit Offer" button

### B.5 Submit Offers

- [x] **B30** — Form: price, currency, estimated days, description, message
- [x] **B31** — Offer status: PENDING after submission
- [x] **B33** — Offer history with statuses: ACCEPTED / REJECTED / WITHDRAWN
- [x] **B34** — Withdraw pending offer → status WITHDRAWN

---

## C. Project Management

### C.1 Lifecycle

- [x] **C1** — Accept offer → project auto-created
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

- [x] **D1** — Search, filters, company cards, pagination
- [x] **D2** — Text search against name/description
- [x] **D3** — Filter by Country and City (IDs and Slugs supported)
- [x] **D6** — "Verified Only" toggle works
- [ ] **D13** — Localization: Country/City names follow current locale

---

## E. Admin Panel `/ar/admin`

- [x] **E1** — Admin access for `admin@secure-marketplace.com`
- [x] **E6** — System stats (Users, Companies, Requests)
- [x] **E12** — User management (edit roles/status)
- [x] **E16** — Company management (verify/reject)
- [x] **E34** — Category management (icons/names/slugs)

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
