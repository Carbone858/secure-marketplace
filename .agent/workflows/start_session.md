---
description: Start server, pull changes, and log session (Start of Day Routine)
---

This workflow is triggered when the user says "start session" or "let's work".

1. Git Pull.
   Ensure we have the latest code from GitHub.
   ```powershell
   & "C:\Program Files\Git\cmd\git.exe" pull
   ```

2. Install Dependencies.
   Make sure all packages are up to date.
   ```powershell
   npm install
   ```

3. Session Logging.
   Append the log entry to `SESSION_LOG.md`.
   ```powershell
   $logDate = Get-Date
   $logEntry = "## Session Log - $logDate`n- Session started`n- Git pulled`n- Server starting...`n"
   Add-Content -Path "SESSION_LOG.md" -Value $logEntry
   ```

4. Start Development Server.
   Start the Next.js dev server. This command will run until stopped.
   ```powershell
   npm run dev
   ```
