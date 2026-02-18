# Company Registration SPA - UI/UX Specification

## 1. Overview
A single-page application (SPA) progressive registration form designed for companies and professionals to join the marketplace. The flow prioritizes user retention through a segmented, low-friction experience that feels modern, trustworthy, and fast.

**Goal:** maximize conversion rate from visitor to registered partner.
**Key Metaphor:** "Building your profile" rather than "filling a form".

---

## 2. Layout & Structure

### 2.1. Global Layout
- **Sticky Header (Minimal):** 
  - Left: Logo (clickable, confirming "Leave registration?" if data entered).
  - Right: "Already have an account? Sign in" link.
  - **Progress Bar:** A thin, animated gradient bar (brand color) spanning the full width of the header bottom, indicating % completion (0% -> 25% -> 50% -> 75% -> 100%).

- **Main Content Area:**
  - Centered card layout (max-width: 800px).
  - White background (or dark gray in Dark Mode), subtle shadow (md), rounded corners (xl).
  - Generous internal padding (40px desktop, 20px mobile).

- **Section Navigation (Sidebar/Floating on Desktop):**
  - A vertical step indicator to the left of the form on large screens.
  - Steps: "Basic Info", "Location", "Services", "Account".
  - Status icons: Empty circle (pending), Blue circle (active), Checkmark (completed).

### 2.2. Responsive Design (Mobile)
- Converting side navigation to a top horizontal stepper (or just the progress bar text "Step 1/4: Basic Info").
- Full-width inputs.
- Sticky "Next" button at the bottom of the viewport for easy thumb access.

---

## 3. Interaction Design (UX) & Behaviors

### 3.1. Progressive Disclosure
- **Initial State:** Only "Section 1" is fully visible and expanded. Sections 2, 3, and 4 are visible as collapsed headers (grayed out).
- **Expansion Logic:**
  - User completes Section 1 validly -> clicks "Continue".
  - Section 1 collapses to a summary view (showing key data like Company Name) with an "Edit" button.
  - Section 2 expands with a smooth slide-down animation.
  - Focus moves to the first field of Section 2.
- **Back Navigation:** Clicking "Back" or a previous section header collapses the current section and expands the target section.

### 3.2. Validation & Feedback
- **Real-time Inline Validation:**
  - Fields validate `onBlur` (when user leaves field).
  - Checkmark icon (Green) appears inside the input on valid entry.
  - Error message (Red, small text) appears below input on invalid entry.
- **Submit Button State:**
  - Disabled (opacity 50%) until the current section is valid.
  - Transitions to "Loading" state (spinner) during API checks (e.g., checking email uniqueness).

### 3.3. Autosave (Optional Delight)
- Save form state to `localStorage`. If user accidentally refreshes, restore their data. Toast message: "We restored your progress".

---

## 4. Section Specifications

### SECTION 1: Company Basic Information
*Purpose: Establish identity.*

**Fields:**
1.  **Company Name / Trade Name** (Required)
    *   *Component:* Input (Text)
    *   *Helper:* "The public name displayed on your profile."
2.  **Business Type / Category** (Required)
    *   *Component:* Select / Combobox
    *   *Data:* Construction, IT, Legal, Consulting, Health, etc.
    *   *UI:* Standard dropdown with search.
3.  **Company Logo** (Optional)
    *   *Component:* File Upload (Drag & Drop zone)
    *   *UI:* Circular preview area. "Drop logo here or click to browse".
    *   *Validation:* Max 2MB, PNG/JPG/WEBP.
4.  **Short Description** (Required, 50-100 chars min)
    *   *Component:* Textarea (Auto-growing)
    *   *Validations:* Min length indicator (e.g., "50 characters remaining").
    *   *Helper:* "Briefly describe what your company does."

*Action:* "Continue to Location" button.

### SECTION 2: Location & Coverage
*Purpose: Matching supply to demand geography.*

**Fields:**
1.  **Country** (Required)
    *   *Component:* Select
    *   *Default:* Syria (Pre-selected).
    *   *Behavior:* Changing this resets City/Governorate.
2.  **Governorate / City** (Required)
    *   *Component:* Searchable Dropdown (Async load based on Country).
    *   *Data Source:* `/api/locations/cities?countryId={id}`.
3.  **Operation Areas** (Optional - "I serve multiple cities")
    *   *Component:* Multi-select Tags.
    *   *UI:* User types/selects "Damascus", "Aleppo". Tags appear below as dismissible chips.
    *   *Placeholder:* "Select other cities you cover..."

*Action:* "Continue to Services" button.

### SECTION 3: Services & Categories
*Purpose: Define the catalog.*

**Fields:**
1.  **Primary Services** (Required, Min 1)
    *   *Component:* Card Grid Multi-select.
    *   *Data Source:* Connect to `/api/categories`.
    *   *UI:* Grid of 3-4 columns. Each item is a card with an Icon + Label.
    *   *Interaction:* Click to toggle selection. Selected state adds a thick brand-colored border and checkmark badge.
2.  **Service Type / Tier** (Required)
    *   *Component:* Segmented Control / Radio Tiles.
    *   *Options:*
        *   **Standard**: "Regular service delivery"
        *   **Premium**: "High priority / Specialized" (Tooltip explaining difference).
        *   **Both**
3.  **Specific Skills / Tags** (Optional)
    *   *Component:* Dynamic Tag Input.
    *   *Helper:* "e.g., HVAC Repair, Python Development, Corporate Law".

*Action:* "Continue to Account" button.

### SECTION 4: Account & Contact Information
*Purpose: Security and communication.*

**Fields:**
1.  **Account Owner Name** (Required)
    *   *Component:* Input (Text)
    *   *Label:* "Who manages this account?"
2.  **Email Address** (Required)
    *   *Component:* Input (Email)
    *   *Validation:* Async check for uniqueness `onBlur`.
    *   *Error:* "This email is already registered. [Sign in instead?]"
3.  **Phone Number** (Required)
    *   *Component:* Phone Input (with country code flag).
    *   *Validation:* E.164 format.
4.  **Password** (Required)
    *   *Component:* Password Input with toggle visibility.
    *   *UI:* Password Strength Meter bar (Red -> Yellow -> Green) below input.
5.  **Confirm Password** (Required)
    *   *Component:* Password Input.
    *   *Validation:* Must match Password.

*Legal:*
- Checkbox: "I agree to the Terms of Service and Privacy Policy." (Link opens in modal).

*Action:* "Create Company Account" (Primary, Large, Full Width).

---

## 5. Post-Submission Flow

### 5.1. Loading State
- User clicks "Create Account".
- Button shows spinner.
- Screen dims slightly.

### 5.2. Success State (The "Wow" moment)
- **Transition:** Content fades out, Success Card fades/scales in.
- **Visual:** Large animated Checkmark (Lottie animation) or Confetti burst.
- **Headline:** "Welcome to [Platform Name], [Company Name]!"
- **Sub-headline:** "We've sent a verification link to **[user@email.com]**. Please check your inbox to activate your dashboard."
- **Action:**
  - "Go to Homepage" (Secondary).
  - "Resend Email" (Text Link, with countdown timer).

---

## 6. Technical Components Hierarchy (React/Next.js)

```tsx
<CompanyRegistrationPage> (Page Wrapper, SEO Meta)
  ├── <RegistrationLayout> (Header, Container, Footer)
  │     ├── <ProgressBar value={progress} />
  │     └── <RegistrationWizard> (State Manager: step, formData, errors)
  │           ├── <StepHeader title="Basic Info" step={1} current={currentStep} />
  │           ├── <AnimatePresence> (Framer Motion transitions)
  │           │     ├── <SectionBasicInfo /> (Step 1)
  │           │     │     ├── <CompanyIdentityFields />
  │           │     │     └── <LogoUploader />
  │           │     ├── <SectionLocation /> (Step 2)
  │           │     │     └── <LocationSelector country={...} />
  │           │     ├── <SectionServices /> (Step 3)
  │           │     │     └── <ServiceGridSelector services={fetchedServices} />
  │           │     └── <SectionAccount /> (Step 4)
  │           │           ├── <UserCredentialsForm />
  │           │           └── <PasswordStrengthMeter />
  │           └── <FormNavigation> (Back / Next Buttons)
  └── <SuccessState> (Conditional Render)
```

## 7. Design Tokens (Theme)
- **Primary Color:** Indigo-600 (Trust, Modern).
- **Secondary:** Slate-500 (Text).
- **Surface:** White / Slate-50 (Backgrounds).
- **Border Radius:** `rounded-xl` (12px) for inputs and cards.
- **Typography:** Inter or System UI. Headings `font-bold`, Body `font-medium`.
