# 🧪 FULL MANUAL TEST TASKS – SERVICE MARKETPLACE

---

## 🔑 TEST CREDENTIALS (INTERNAL)

> **Shared Password for all accounts:** `Test123456!@`
> 
> | Role | Email | Purpose |
> |---|---|---|
> | **Admin** | `admin@secure-marketplace.com` | Access Admin Dashboard & Approve Companies |
> | **Owner** | `owner@secure-marketplace.com` | Full system access (Super Admin) |
> | **Client** | `user@secure-marketplace.com` | Submit service requests & chat with providers |
> | **Provider** | `company@secure-marketplace.com` | Verified company - Submit offers & view dashboard |
> | **Pending** | `pending@secure-marketplace.com` | Unverified company - Restricted access until approved |
> | **Unverified** | `unverified@secure-marketplace.com` | Account registered but email not verified |
> | **Locked** | `locked@secure-marketplace.com` | Account locked for testing lockout scenarios |

---

> [!TIP]
> **Interactive Dashboard:** Use the [Interactive Manual Test Dashboard](http://localhost:3000/ar/dev/manual-test) to track progress.
> 
> **Focus:** This list contains 140+ real tests. Keep descriptions short to ensure the dashboard UI remains clean.

## 🟢 SECTION 1 — CLIENT (PROJECT OWNER) TESTING

### 🔹 A. Registration & Authentication
| Status | ID | Test Case | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| [ ] | C-01 | Register with valid data | Fill all fields correctly | Account created + verification email sent | P1 |
| [ ] | C-02 | Register with existing email | Use same email twice | Error: Email already exists | P1 |
| [ ] | C-03 | Weak password | Enter weak password | Password strength validation appears | P1 |
| [ ] | C-04 | Empty form submit | Submit blank | Required errors shown | P1 |
| [ ] | C-05 | Invalid email format | Enter wrong email | Email validation error | P1 |
| [ ] | C-06 | Verify email | Click verification link | Account becomes active | P1 |
| [ ] | C-07 | Expired verification link | Use expired token | Error message | P2 |
| [ ] | C-08 | Login with correct credentials | Enter valid login | Redirect to dashboard | P1 |
| [ ] | C-09 | Login with wrong password 5 times | Try repeatedly | Account locks | P1 |
| [ ] | C-10 | Reset password flow | Request reset + change | Password updated successfully | P1 |

### 🔹 B. Create Project Flow
| Status | ID | Test Case | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| [x] | C-11 | Create project normal | Fill all fields | Project posted successfully | P1 |
| [x] | C-12 | Missing category | Leave category empty | Error shown | P1 |
| [x] | C-13 | Upload valid images | Upload JPG/PNG | Images saved | P1 |
| [ ] | C-14 | Upload invalid file type | Upload .exe | Rejected | P1 |
| [ ] | C-15 | Exceed image size | Upload >5MB | Error | P1 |
| [ ] | C-16 | Submit twice quickly | Double click submit | Only 1 project created | P1 |
| [ ] | C-17 | Slow internet submit | Throttle network | No duplicate submission | P2 |
| [ ] | C-18 | Edit project | Modify description | Changes saved | P1 |
| [ ] | C-19 | Delete project before offers | Delete | Removed successfully | P2 |
| [ ] | C-20 | Delete project after offers | Try delete | Proper restriction message | P1 |

### 🔹 C. Offer Handling
| Status | ID | Test Case | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| [ ] | C-21 | Receive offer notification | Provider submits offer | Notification received | P1 |
| [ ] | C-22 | Compare multiple offers | Open 3 offers | Clear comparison | P1 |
| [ ] | C-23 | Accept offer | Click accept | Status updates | P1 |
| [ ] | C-24 | Reject offer | Reject | Status updated | P1 |
| [ ] | C-25 | Accept then refresh page | Refresh | State preserved | P1 |
| [ ] | C-26 | Try accept twice | Click multiple times | Only 1 acceptance allowed | P1 |
| [ ] | C-27 | Accept after expiration | Try expired offer | Error shown | P2 |

### 🔹 D. Messaging
| Status | ID | Test Case | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| [ ] | C-28 | Send message | Type + send | Message delivered | P1 |
| [ ] | C-29 | Send empty message | Try blank | Error shown | P1 |
| [ ] | C-30 | Send long message | 2000+ chars | Handled properly | P2 |
| [ ] | C-31 | Rapid send spam | Send 10 fast | Rate limit triggered | P1 |
| [ ] | C-32 | Open chat on mobile | Use phone | UI responsive | P1 |

### 🔹 E. Completion & Reviews
| Status | ID | Test Case | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| [ ] | C-33 | Mark project complete | Click complete | Status changes | P1 |
| [ ] | C-34 | Leave review | Submit rating | Saved correctly | P1 |
| [ ] | C-35 | Leave empty review | Submit blank | Validation shown | P1 |
| [ ] | C-36 | Edit review | Modify | Saved | P2 |
| [ ] | C-37 | Delete account with active project | Attempt | Proper restriction | P1 |

## 🟢 SECTION 2 — SERVICE PROVIDER TESTING

### 🔹 A. Provider Registration
| Status | ID | Test Case | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| [ ] | P-01 | Multi-step registration | Complete all steps | Account created | P1 |
| [ ] | P-02 | Skip required field | Leave empty | Validation error | P1 |
| [ ] | P-03 | Add multiple cities | Select many | Saved correctly | P1 |
| [ ] | P-04 | Add multiple services | Select multiple | Saved correctly | P1 |
| [ ] | P-05 | Upload portfolio images | Upload valid | Saved | P1 |
| [ ] | P-06 | Upload invalid file | Try .exe | Rejected | P1 |

### 🔹 B. Browse & Submit Offers
| Status | ID | Test Case | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| [ ] | P-07 | Browse projects | View list | Relevant projects shown | P1 |
| [ ] | P-08 | Filter by category | Apply filter | Correct results | P1 |
| [ ] | P-09 | Submit offer | Fill price + message | Offer submitted | P1 |
| [ ] | P-10 | Submit duplicate offer | Try again | Prevented | P1 |
| [ ] | P-11 | Edit offer | Modify before accepted | Saved | P1 |
| [ ] | P-12 | Withdraw offer | Withdraw | Removed | P1 |

### 🔹 C. Dashboard & Profile
| Status | ID | Test Case | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| [ ] | P-13 | Edit profile | Change info | Saved | P1 |
| [ ] | P-14 | Change services | Modify services | Updated | P1 |
| [ ] | P-15 | Delete account with active offer | Try delete | Blocked | P1 |
| [ ] | P-16 | View statistics | Open dashboard | Stats accurate | P2 |

## 🟢 SECTION 3 — ADMIN PANEL
| Status | ID | Test Case | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| [ ] | A-01 | Admin login | Valid admin creds | Access granted | P1 |
| [ ] | A-02 | Normal user tries admin route | Access /api/admin | 403 error | P1 |
| [ ] | A-03 | Approve provider | Click approve | Status updated | P1 |
| [ ] | A-04 | Block user | Block account | User locked | P1 |
| [ ] | A-05 | View security logs | Open logs | Events recorded | P1 |

## 🟢 SECTION 4 — EDGE CASES (CRITICAL)
- [ ] 10 providers submit offers same second
- [ ] Client deletes account after accepting offer
- [ ] Provider deletes account mid-project
- [ ] Two browsers editing same project
- [ ] Refresh during payment (future)
- [ ] Network disconnect during submit
- [ ] Token expiration mid-session
- [ ] Login from 2 devices simultaneously
- [ ] Rapid multi-click on all buttons

## 🟢 SECTION 5 — SECURITY MANUAL TESTS
- [ ] XSS injection in description `<script>alert(1)</script>`
- [ ] SQL injection attempt `' OR 1=1 --`
- [ ] ID enumeration `/api/project/1,2,3`
- [ ] File upload malicious renamed file
- [ ] JWT tampering
- [ ] Rate limit abuse
- [ ] Refresh token replay
- [ ] Access admin without role
- [ ] Change user ID in request payload

## 🟢 SECTION 6 — UX QUALITY CHECK
- [ ] Button clarity
- [ ] CTA visibility
- [ ] Arabic RTL alignment
- [ ] Mobile spacing
- [ ] Error message clarity
- [ ] Loading indicators
- [ ] Empty states design
- [ ] First impression (5 second rule)
- [ ] Onboarding clarity
- [ ] Trust perception

## 🟢 SECTION 7 — PRODUCTION CHECK
- [ ] HTTPS only
- [ ] No console errors
- [ ] No exposed .env
- [ ] No public test endpoints
- [ ] Lighthouse > 85
- [ ] SEO meta tags correct
- [ ] OpenGraph preview correct
- [ ] Sitemap valid

