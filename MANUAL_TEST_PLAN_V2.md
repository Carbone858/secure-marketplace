# Manual Test Plan V2: Strict Service Lifecycle Stabilization

This document outlines the authoritative manual testing path to verify the newly hardened service lifecycle. It ensures that Project States, Visibility, Offer Logistics, Communication locks, and Dual-confirmation Completions are 100% stable.

## Table of Contents
1. [State Machine & Visibility Rules](#1-state-machine--visibility-rules)
2. [Offer Submission & Acceptance Flow](#2-offer-submission--acceptance-flow)
3. [Communication Gating](#3-communication-gating)
4. [Dual-Sided Project Completion](#4-dual-sided-project-completion)
5. [In-App Notifications](#5-in-app-notifications)
6. [UI & RTL Consistency](#6-ui--rtl-consistency)

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
| **Staff (Employee)** | `staff-employee@secure-marketplace.com` | Restricted role for testing RBAC |

---

### 1. State Machine & Visibility Rules

**Scenario:** User creates a Request, Admin approves.
- [ x] **Step 1:** User creates a request. It appears as `PENDING` on their dashboard.
- [ x] **Step 2:** Ensure this `PENDING` request does **not** appear on the public `Browse` page or to any companies.
- [ x] **Step 3:** Admin logs in, clicks `Approve`. Request status becomes `ACTIVE`.
- [x ] **Step 4:** Ensure the `ACTIVE` request now appears on the public `Browse` page and for companies.
- [ ] **Step 5:** **(Negative Test)** Try to edit the `ACTIVE` request. Verify changes stick.

---

### 2. Offer Submission & Acceptance Flow

**Scenario:** Companies bid on an ACTIVE Request.
- [ ] **Step 1:** Company A submits an Offer. The request status automatically transitions to `REVIEWING_OFFERS`.
- [ ] **Step 2:** Verify that the request remains visible to *other* companies (via the public Browse page) while in `REVIEWING_OFFERS`, allowing them to submit competitive bids.
- [ ] **Step 3:** Company B submits an an Offer. Verify submission succeeds.
- [ ] **Step 4:** **(Negative Test)** Admin clicks `Reject` on this request. The system should throw `INVALID_REQUEST_TRANSITION` (HTTP 409).
- [ ] **Step 5:** User accepts Company A's offer.
- [ ] **Step 6:** Verify Project status becomes `ACTIVE` (which signifies an accepted request) and Request status becomes `ACCEPTED`.
- [ ] **Step 7:** Verify Company B's offer automatically transitions to `REJECTED`.
- [ ] **Step 8:** **(Negative Test)** Trying to accept Company B's offer now should return `OFFER_ALREADY_PROCESSED` (HTTP 409).

---

### 3. Communication Gating

**Scenario:** Strict 403 blocks for any messaging before acceptance.
- [ ] **Step 1:** Pre-acceptance: Attempt to message the User via direct API call `/api/messages`. Verify backend returns `403 Forbidden`.
- [ ] **Step 2:** Ensure there is no global "Contact" button on the Company's public profile page.
- [ ] **Step 3:** Ensure there is no "Message" button on the Offer Details or Request Details screens.
- [ ] **Step 4:** Post-acceptance: Navigate to User Dashboard -> Projects -> Active. Click "Message Company". Verify message successfully sends.
- [ ] **Step 5:** Company logs in -> Dashboard -> Projects -> Active. Click "Message Client". Verify message successfully sends and is received.

---

### 4. Dual-Sided Project Completion

**Scenario:** The project work finishes and parties confirm.
- [ ] **Step 1:** User clicks "Mark Completed" on their ACTIVE project. Verify UI updates to "Waiting on Company" and project remains `ACTIVE`.
- [ ] **Step 2:** **(Negative Test)** Try to mutate the accepted request or offer. Mutation locks should return 400 (`assertRequestEditable`).
- [ ] **Step 3:** Company logs in, views their dashboard, clicks "Mark Completed".
- [ ] **Step 4:** Verify BOTH the Project and Request statuses transition strictly to `COMPLETED`.
- [ ] **Step 5:** Send a message between them. If fully compliant, messaging should ideally return `403 Forbidden - Read Only`, testing the read-only completion state.

---

### 5. In-App Notifications

**Scenario:** Verify all system notifications are triggered across the lifecycle.
- [ ] **Approval:** Admin approves -> User gets `"Project Request Approved"`.
- [ ] **Rejection:** Admin rejects -> User gets `"Project Request Not Approved"`.
- [ ] **New Offer:** Company submits offer -> User gets `"New Offer on your Request"`.
- [ ] **Offer Accepted:** User accepts -> Company gets `"Offer Accepted!"`.
- [ ] **Offer Rejected:** User manually rejects -> Company gets `"Offer Update"` stating rejection.
- [ ] **Completion:** Project marked completed by both -> User & Company both get `"Project Completed"`.

---

### 6. UI & RTL Consistency

**Scenario:** Confirm dashboard mobile-responsiveness and Arabic language layout.
- [ ] **Step 1:** Switch interface to Arabic (`/ar`).
- [ ] **Step 2:** Go to User Dashboard. Verify all text aligns Right-to-Left. Verify badges display properly and "Mark Completed" button text reads "تحديد كمكتمل".
- [ ] **Step 3:** Ensure logical margin properties (`me-2` instead of `mr-2`) work correctly, rendering icons on the right of the button text.
- [ ] **Step 4:** Resize window to mobile. Verify Dashboard layouts collapse smoothly using flex/grid.

---
**End of Test Plan.**
