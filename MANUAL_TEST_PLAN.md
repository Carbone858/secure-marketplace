# 🧪 FULL MANUAL TEST TASKS – SERVICE MARKETPLACE

> [!TIP]
> **Interactive Dashboard:** Use the [Interactive Manual Test Dashboard](http://localhost:3000/ar/dev/manual-test) to track progress.
> 
> **Focus:** This list contains 140+ real tests. Keep descriptions short to ensure the dashboard UI remains clean.

## 🟢 SECTION 1 — CLIENT (PROJECT OWNER)

### 🔹 A. Registration & Authentication
| ID | Test Case | Steps | Expected Result | Priority |
|---|---|---|---|---|
| C-01 | Valid Registration | Correct data | Account created + email sent | P1 |
| C-02 | Duplicate Email | Re-use email | Error: Already exists | P1 |
| C-03 | Weak Password | Enter < 8 chars | Validation meter updates | P1 |
| C-04 | Empty Submit | Blank form | Field errors visible | P1 |
| C-05 | Invalid Email | test@invalid | Format error visible | P1 |
| C-06 | Verify Email | Click link | Account active | P1 |
| C-07 | Expired Link | Use old token | Error message | P2 |
| C-08 | Valid Login | Correct creds | Redirect to dashboard | P1 |
| C-09 | Lockout | 5 failures | Account locks (30m) | P1 |
| C-10 | Password Reset | Request + Change | Updated successfully | P1 |

### 🔹 B. Create Project Flow
| ID | Test Case | Steps | Expected Result | Priority |
|---|---|---|---|---|
| C-11 | Standard Create | Fill all | Posted successfully | P1 |
| C-12 | Missing Category | Skip category | Validation error | P1 |
| C-13 | Valid Images | Upload images | Saved correctly | P1 |
| C-14 | Blocked Files | Upload .exe | Rejected | P1 |
| C-15 | Image Size | Upload >5MB | File size error | P1 |
| C-16 | Rapid Submit | Double click | 1 project created | P1 |
| C-17 | Slow Net | Throttle net | No duplicates | P2 |
| C-18 | Edit Project | Change info | Changes saved | P1 |
| C-19 | Early Delete | Delete < offer | Removed | P2 |
| C-20 | Late Delete | Delete > offer | Restricted | P1 |

### 🔹 C. Offer Handling
| ID | Test Case | Steps | Expected Result | Priority |
|---|---|---|---|---|
| C-21 | Notify Offer | Provider posts | Notification sent | P1 |
| C-22 | Compare View | Open 3 offers | Scannable UI | P1 |
| C-23 | Accept Offer | Click accept | Status updates | P1 |
| C-24 | Reject Offer | Click reject | Status updates | P1 |
| C-25 | Refresh State | Accept+Refresh | State preserved | P1 |
| C-26 | Double Accept | Multi-click | 1 accept only | P1 |
| C-27 | Expiry Logic | Try expired | Valid error | P2 |

### 🔹 D. Messaging
| ID | Test Case | Steps | Expected Result | Priority |
|---|---|---|---|---|
| C-28 | Basic Chat | Send text | Delivered | P1 |
| C-29 | Empty Msg | Send blank | Prevented | P1 |
| C-30 | Long Msg | 2000+ chars | Graceful wrap | P2 |
| C-31 | Spam Limit | 10 fast msgs | Rate limited | P1 |
| C-32 | Mobile Chat | Use on phone | Responsive UI | P1 |

### 🔹 E. Completion & Reviews
| ID | Test Case | Steps | Expected Result | Priority |
|---|---|---|---|---|
| C-33 | Project Done | Mark complete | Status changes | P1 |
| C-34 | Leave Review | Submit rating | Saved correctly | P1 |
| C-35 | Blank Review | Submit empty | Validation error | P1 |
| C-36 | Edit Review | Change score | Updated | P2 |
| C-37 | Safe Delete | Active project | Properly restricted | P1 |

## 🟢 SECTION 2 — SERVICE PROVIDER

### 🔹 A. Registration
| ID | Test Case | Steps | Expected Result | Priority |
|---|---|---|---|---|
| P-01 | Wizard Form | Steps 1-4 | Account created | P1 |
| P-02 | Incomplete | Skip fields | Validation error | P1 |
| P-03 | Multi-City | Select cities | Saved correctly | P1 |
| P-04 | Multi-Service | Select categories | Saved correctly | P1 |
| P-05 | Portfolio | Upload images | Gallery saved | P1 |
| P-06 | Blocked Files | Upload .exe | Rejected | P1 |

### 🔹 B. Browse & Submit Offers
| ID | Test Case | Steps | Expected Result | Priority |
|---|---|---|---|---|
| P-07 | Browse Leads | View list | Relevant leads | P1 |
| P-08 | Filter Category | Apply filter | Filtered results | P1 |
| P-09 | Submit Offer | Price + Msg | Offer sent | P1 |
| P-10 | Duplicate Offer | Re-submit | Prevented | P1 |
| P-11 | Edit Offer | Modify before accept | Updated | P1 |
| P-12 | Withdraw | Click withdraw | Removed | P1 |

### 🔹 C. Dashboard & Profile
| ID | Test Case | Steps | Expected Result | Priority |
|---|---|---|---|---|
| P-13 | Edit Profile | Update info | Saved | P1 |
| P-14 | Services Sync | Modify cat | Profile updated | P1 |
| P-15 | Lock Deletion | Active offer | Blocked | P1 |
| P-16 | Stats Check | View dashboard | Accurate counters | P2 |

## 🟢 SECTION 3 — ADMIN PANEL
| ID | Test Case | Expected Result | Priority |
|---|---|---|---|
| A-01 | Login | Access granted | P1 |
| A-02 | Restricted Route | 403 Forbidden | P1 |
| A-03 | Approve | Status verified | P1 |
| A-04 | Block | Access denied | P1 |
| A-05 | Audit Logs | Events recorded | P1 |

## 🟢 SECTION 4 — EDGE CASES
- [ ] 10 concurrent offers on 1 request
- [ ] User deletion mid-offer
- [ ] Provider deletion mid-project
- [ ] Multi-browser editing sync
- [ ] Net drop during submit
- [ ] Session expiry mid-flow
- [ ] Login from 2 devices
- [ ] Rapid button click spam

## 🟢 SECTION 5 — SECURITY AUDIT
- [ ] XSS in descriptions
- [ ] SQLi in login
- [ ] IDOR increment checks
- [ ] File/Magic-byte validation
- [ ] JWT Signature tampering
- [ ] API Rate limit abuse
- [ ] Refresh token replay
- [ ] Privilege escalation
- [ ] Payload ID tampering

## 🟢 SECTION 6 — UX & QUALITY
- [ ] Arabic RTL alignment
- [ ] Mobile spacing & touch targets
- [ ] Error message clarity
- [ ] Loading feedback / skeletons
- [ ] Empty state designs
- [ ] Slogan / Branding perception

## 🟢 SECTION 7 — PRODUCTION CHECK
- [ ] HTTPS enforcement
- [ ] Clean browser console
- [ ] `.env` hidden
- [ ] Core latency < 300ms
- [ ] SEO Meta & Sitemap
