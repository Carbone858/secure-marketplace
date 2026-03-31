---
description: Start server, pull changes, and log session (Start of Day Routine)
---

This workflow is triggered when the user says "start session" or "let's work" or "/start_session".

1. Environment & Vercel Verification.
   - Check the **Vercel Master Link**: `https://secure-marketplace.vercel.app`
   - Check **Vercel Dashboard** for `SMTP_USER`, `SMTP_PASSWORD` and other email variables.
   - Run the **Diagnostic tool**: `https://secure-marketplace.vercel.app/api/debug/email`

2. Synchronize Local Code.
   Fetch the latest changes from GitHub (pushed by Vercel syncs or other sessions).
   ```powershell
   & "C:\Program Files\Git\cmd\git.exe" pull
   ```

3. Local Preparation.
   Install/Update any new dependencies that were added during deployment.
   ```powershell
   npm install
   ```

4. Session Start Log.
   Append the log entry to `SESSION_LOG.md`.
   ```powershell
   $logDate = Get-Date -Format "yyyy-MM-dd HH:mm"
   $logEntry = "---`n## Session Log - $logDate`n- Git pulled (Code synchronized from GitHub)`n- Environment Verified (Live Site Check)`n- Server starting...`n"
   Add-Content -Path "SESSION_LOG.md" -Value $logEntry
   ```

5. Start Local Development.
   Fire up the local dev server for active work.
   ```powershell
   npm run dev
   ```
