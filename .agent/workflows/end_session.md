---
description: Stop server, save changes, and log session (End of Day Routine)
---

This workflow is triggered when the user says "we are finish for today save everything" or "/end_session".

1. Stop the Node.js server.
   The following command will force-stop all running Node processes (including the dev server).
   ```powershell
   taskkill /F /IM node.exe
   ```

2. Sync with GitHub and Vercel.
   Stage all changes and commit them with a specialized Vercel-ready message.
   ```powershell
   & "C:\Program Files\Git\cmd\git.exe" add .
   $date = Get-Date -Format "yyyy-MM-dd HH:mm"
   & "C:\Program Files\Git\cmd\git.exe" commit -m "chore(deploy): Vercel Sync - session closure $date"
   & "C:\Program Files\Git\cmd\git.exe" push
   ```

3. Verification.
   Confirm that the push was successful by checking the git status one last time.
   ```powershell
   & "C:\Program Files\Git\cmd\git.exe" status
   ```

4. Session Logging.
   Append the log entry to `SESSION_LOG.md`.
   ```powershell
   $logDate = Get-Date
   $logEntry = "## Session Log - $logDate`n- Server stopped`n- Project pushed to GitHub (Vercel automatic deployment triggered)`n- Local environment clean`n- Session ended successfully`n"
   Add-Content -Path "SESSION_LOG.md" -Value $logEntry
   ```

5. Final Status.
   Ensure the user knows their website is currently deploying on Vercel and check `https://secure-marketplace-macm.vercel.app` for the final result.
