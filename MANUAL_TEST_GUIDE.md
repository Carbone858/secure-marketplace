# Manual Test Guide for Company Registration SPA

## ⚠️ Important Note
**You must restart your development server** (`npm run dev`) before testing. 
We updated the database schema (`Company` model) to include `operationAreas` and `skills`. The Prisma Client needs to be regenerated, which might have been blocked by the running server.

To restart:
1. Stop the current server (Ctrl+C).
2. Run `npm run dev` again.

## Test Steps

1.  **Navigate to Registration**:
    - Go to `/en/company/join` (or click "Register as Company").
    
2.  **Verify Layout**:
    - Check for the Sticky Header with the progress bar at the top.
    - Check for the Sidebar Step Indicator on desktop (left side).

3.  **Step 1: Basic Info**:
    - Enter "Company Name".
    - Select "Business Category".
    - Upload a dummy logo (drag & drop).
    - Enter a description (>50 chars).
    - Click **Continue**.
    - *Expected*: Section 1 collapses, Section 2 expands smoothly.

4.  **Step 2: Location**:
    - Select "Country" (e.g., Syria).
    - Select "Main City".
    - **New**: Type "Aleppo" in "Operation Areas" and press Enter. Add another tag.
    - Click **Continue**.

5.  **Step 3: Services**:
    - Click on a few service cards (e.g., "Plumbing", "Electrical").
    - Select "Service Tier" (e.g., Premium).
    - **New**: Type specific skills (e.g., "Industrial HVAC") in the Tags input.
    - Click **Continue**.

6.  **Step 4: Account**:
    - Enter Admin Name, Phone.
    - Enter Email. (Mock check should run on blur).
    - Enter Password.
    - **New**: Verify the "Password Strength Meter" updates as you type (Red -> Yellow -> Green).
    - Confirm Password.
    - Accept Terms.
    - Click **Create Company Account**.

7.  **Success State**:
    - Verify the form disappears and a "Success" card appears.
    - Verify the "Resend Email" button has a countdown timer.

## Troubleshooting
- If you see an error "Server error occurred" or "Internal Server Error", check the terminal. If it says `Unknown field operationAreas`, you didn't restart the server properly to regenerate Prisma Client.
