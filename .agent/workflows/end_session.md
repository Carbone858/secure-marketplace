---
description: Stop server, save changes, and log session (End of Day Routine)
---

This workflow is triggered when the user says "we are finish for today save everything".

1. Stop the Node.js server.
   The following command will force-stop all running Node processes (including the dev server).
   ```powershell
   taskkill /F /IM node.exe
   ```

2. Verify cleanliness.
   Check if the git status is clean before committing.
   ```powershell
   git status
   ```

3. Git Add and Commit.
   Stage all changes and commit them with a timestamp.
   ```powershell
   & "C:\Program Files\Git\cmd\git.exe" add .
   $date = Get-Date -Format "yyyy-MM-dd HH:mm"
   & "C:\Program Files\Git\cmd\git.exe" commit -m "End of session - Work saved on $date"
   ```

4. Git Push.
   Push changes to the remote repository.
   ```powershell
   & "C:\Program Files\Git\cmd\git.exe" push
   ```

5. Session Logging.
   Append the log entry to `SESSION_LOG.md`.
   ```powershell
   $logDate = Get-Date
   $logEntry = "## Session Log - $logDate`n- Server stopped`n- Changes committed`n- Session ended successfully`n"
   Add-Content -Path "SESSION_LOG.md" -Value $logEntry
   ```

5. Confirm completion.
   Tell the user the system is clean and safe to shut down.
