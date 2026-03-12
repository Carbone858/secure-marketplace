---
description: Start server, pull changes, and log session (Start of Day Routine)
---

This workflow is triggered when the user says "start session" or "let's work".

0. Sync Environment.
   Ensure the Supabase connection strings in `.env` are ready for use.

1. Git Pull (Project).

   Ensure we have the latest code from GitHub.
   ```powershell
   & "C:\Program Files\Git\cmd\git.exe" pull
   ```

2. Git Pull (Brain).
   Ensure we have the latest conversation history.
   ```powershell
   cd "$HOME\.gemini\antigravity"
   & "C:\Program Files\Git\cmd\git.exe" pull
   cd "$PSScriptRoot"
   ```

3. Install Dependencies.
   Make sure all packages are up to date.
   ```powershell
   npm install
   ```

4. Session Logging.
   Append the log entry to `SESSION_LOG.md`.
   ```powershell
   $logDate = Get-Date
   $logEntry = "## Session Log - $logDate`n- Session started`n- Git pulled`n- Server starting...`n"
   Add-Content -Path "SESSION_LOG.md" -Value $logEntry
   ```

5. Start Development Server.
   Start the Next.js dev server. This command will run until stopped.
   ```powershell
   npm run dev
   ```
