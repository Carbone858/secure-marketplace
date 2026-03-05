---
description: Start server, pull changes, and log session (Start of Day Routine)
---

This workflow is triggered when the user says "start session" or "let's work".

0. Verify PostgreSQL Service.
   Ensure the database is running before starting the session.
   ```powershell
   $service = Get-Service -Name "postgresql-x64-17" -ErrorAction SilentlyContinue
   if ($null -eq $service) {
       Write-Error "PostgreSQL 17 service not found."
       exit 1
   }
   if ($service.Status -ne 'Running') {
       Write-Host "Starting PostgreSQL service..."
       Start-Service -Name "postgresql-x64-17"
   } else {
       Write-Host "PostgreSQL service is already running."
   }
   ```

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
