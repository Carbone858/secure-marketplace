# 🚩 Feature Flags Management Guide

This guide explains how to use the Feature Flags system to control platform behavior in real-time without changing code.

## 🛠️ How to Access
1. Log in as an **Admin**.
2. Go to the **Dashboard**.
3. Select **Feature Flags** from the sidebar.

---

## 🚦 Understanding Current Flags

The system is organized into categories. Here are the most important flags you can control:

### 📢 Project Approval (New!)
*   **`isRequestAutoApproveEnabled`**:
    *   **OFF (Default)**: New projects from users are hidden and wait in the "Pending Approval" tab for you.
    *   **ON**: New projects are published immediately and visible to all companies.

### 🛡️ Security & Content
*   **`isReviewModerationEnabled`**: If ON, user reviews won't show up until you approve them.
*   **`isEmailVerificationRequired`**: If ON, new users must verify their email before using the platform.

### ⚙️ System
*   **`isMaintenanceMode`**: If ON, only admins can use the site. Regular users will see a maintenance page.

---

## 📝 How to Use the Dashboard

### 1. Toggling a Flag
*   Find the flag in the list (e.g., under the **Requests** category).
*   Click the **Toggle Switch** on the right side.
*   The change is **instant**. No need to save or restart the server.

### 2. Adding a New Flag (Technical)
> [!IMPORTANT]
> Adding a flag in the dashboard only creates the *switch*. A developer must then update the code to check that switch.

*   Click the **+ New Flag** button.
*   **Key**: Must match the name used in the code (e.g., `isSmartMatchingEnabled`).
*   **Category**: Enter a name like "Beta", "UI", or "SEO".
*   **Value**: Choose if it starts as enabled or disabled.
*   **Description**: Explain what this flag does for other admins.

---

## 💡 Pro Tips
*   **Phase 2 Flags**: Some flags are labeled "Phase 2". These are prepared in the code but their features are still being finalized.
*   **Performance**: Flags are cached for 1 minute to keep the site fast. If you flip a switch, it may take up to 60 seconds to take effect for all users.
