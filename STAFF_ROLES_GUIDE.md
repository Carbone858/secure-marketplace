# Staff Roles & Departments — How They Work

> **Location in the admin panel:** Admin → Staff Management  
> **Last updated:** February 2026

---

## Overview

The **Staff Management** system lets the platform owner (you) build an internal team to help run the marketplace. Think of it like an HR system built into your admin panel.

There are 3 concepts:

| Concept | What it is |
|---|---|
| **Role** | The *job title* — defines what a person is allowed to do |
| **Department** | The *team* a person belongs to (e.g., Support, Technical) |
| **Staff Member** | A registered user on the platform who has been promoted to an internal team member |

---

## How It Works Step by Step

### 1. A person registers on the platform normally
They sign up as a regular user (role: `USER`). They have a normal account.

### 2. You assign them as a Staff Member
In **Admin → Staff → Assign Staff**, you search for that user by name or email, pick their **Role** and **Department**, and click Assign.

### 3. Their account is automatically promoted
When you assign them, the system automatically upgrades their account role to `ADMIN`, giving them access to the admin panel at `/admin`.

### 4. They log in and see the admin panel
They now have access to the admin dashboard. What they can *actually do* inside it depends on their **Staff Role**.

---

## The Default Roles — Real-Life Meaning

### 🔴 Super Admin
**Real-life equivalent:** CEO / Platform Owner  
**What they do:** Everything. They can change system settings, assign other admins, delete data, toggle maintenance mode, and access every section of the admin panel.  
**Who should have this:** Only you (the owner) and your most trusted technical partner.

---

### 🟠 Admin
**Real-life equivalent:** Operations Manager / General Manager  
**What they do:** Can manage users, companies, verifications, requests, projects, reviews, and content. Cannot change system-level settings or assign Super Admin roles.  
**Who should have this:** A senior employee who runs day-to-day operations.

---

### 🟡 Department Admin
**Real-life equivalent:** Team Lead / Department Head  
**What they do:** Manages their specific department and the employees within it. For example, the head of Customer Support manages the support team.  
**Who should have this:** The person in charge of a specific team (e.g., Head of Support, Head of Content).

---

### 🔵 Support Agent
**Real-life equivalent:** Customer Service Representative  
**What they do:** Handles user complaints, answers questions, reviews flagged content, and communicates with users and companies through the internal messaging system.  
**Who should have this:** Your customer support team members.  
**Example workflow:**
1. A user complains that a company didn't deliver a project
2. The support agent opens the case in the admin panel
3. They review the project, messages, and offers
4. They take action (warn the company, refund, etc.)

---

### 🟢 Content Manager
**Real-life equivalent:** Content Editor / Marketing Coordinator  
**What they do:** Creates and edits CMS pages (About Us, Terms, Privacy Policy, etc.), manages website sections, updates categories, and controls what content appears on the homepage.  
**Who should have this:** The person responsible for the website's text, pages, and marketing content.  
**Example workflow:**
1. You want to add a new "How It Works" page to the website
2. The content manager goes to Admin → Content (CMS) → Pages → New Page
3. They write the content in English and Arabic
4. They publish it — it's now live on the website

---

### 🟣 Verification Officer
**Real-life equivalent:** Compliance / KYC Officer  
**What they do:** Reviews company registration documents, checks business licenses, verifies company identities, and approves or rejects company verification requests.  
**Who should have this:** The person responsible for making sure companies on the platform are legitimate.  
**Example workflow:**
1. A company uploads their trade license and ID documents
2. The verification officer receives a notification
3. They go to Admin → Verifications, review the documents
4. They approve the company → the company gets a "Verified" badge on their profile

---

### ⚪ Employee
**Real-life equivalent:** Junior Staff / General Employee  
**What they do:** Basic access to the admin panel. Can view data but has limited ability to make changes. Good for interns or new hires who are still learning.  
**Who should have this:** New team members, interns, or anyone who needs read-only visibility.

---

## The Default Departments — Real-Life Meaning

### 🏢 Management
The executive team. Usually just you and any co-founders or senior managers. They oversee everything.

### 🎧 Customer Support
The team that talks to users and companies. They handle complaints, disputes, refund requests, and general help.

### ⚙️ Operations
The team that keeps the platform running smoothly — monitoring activity, handling data, managing listings, and ensuring quality.

### 📣 Content & Marketing
The team that writes pages, manages the blog, runs promotions, updates categories, and handles social media or email campaigns.

### 💻 Technical
Your developers and technical staff. They may need admin access to debug issues, check logs, or manage feature flags.

---

## Practical Example: Building Your Team

Imagine you hire 4 people. Here's how you'd set them up:

| Person | Role | Department |
|---|---|---|
| Ahmed (your business partner) | Super Admin | Management |
| Sara (operations manager) | Admin | Operations |
| Khalid (support agent) | Support Agent | Customer Support |
| Lina (content writer) | Content Manager | Content & Marketing |

**Steps:**
1. Each person registers on the platform with their email
2. You go to Admin → Staff → Assign Staff
3. Search for each person, assign their role and department
4. They log in and see the admin panel with appropriate access

---

## Important Notes

- **Removing a staff member** does NOT delete their account — it just removes their admin access. They go back to being a regular user.
- **Roles are labels** — the current system uses them for display and organization. Full permission enforcement (where each role can only see specific pages) can be added later as the team grows.
- **You can create custom roles** — if you need a role not in the default list (e.g., "Financial Auditor"), go to Admin → Staff → Roles → Add Role.
- **You can create custom departments** — same for departments (e.g., "Legal Team").
- **One user = one staff role** — a user can only have one staff role at a time, but you can change it anytime by clicking the Edit button on their row.

---

## Where to Find Everything

| Task | Location |
|---|---|
| Add a staff member | Admin → Staff → Staff Members tab → Assign Staff |
| Create a new role | Admin → Staff → Roles tab → Add Role |
| Create a new department | Admin → Staff → Departments tab → Add Department |
| Remove a staff member | Admin → Staff → Staff Members tab → 🗑️ button |
| Change someone's role | Admin → Staff → Staff Members tab → ✏️ Edit button |
| Manage CMS pages | Admin → Content (CMS) → Pages tab |
| Review verifications | Admin → Verifications |
| Manage users | Admin → Users |
