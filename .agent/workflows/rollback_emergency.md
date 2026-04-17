---
description: Emergency recovery of the application to the last stable state.
---

This workflow is triggered by the magic word "**/rollback**" or "**Emergency Rollback**".

1. **Safety Snapshot**.
   Before reverting, we save the current (broken) state into a recovery branch to ensure no work is lost.
   ```powershell
   $timestamp = Get-Date -Format "yyyyMMdd-HHmm"
   & "C:\Program Files\Git\cmd\git.exe" checkout -b "emergency/recovery-$timestamp"
   & "C:\Program Files\Git\cmd\git.exe" add .
   & "C:\Program Files\Git\cmd\git.exe" commit -m "Emergency Rollback Snapshot - WIP Saved"
   & "C:\Program Files\Git\cmd\git.exe" push origin "emergency/recovery-$timestamp"
   ```

2. **Identify Stable SHA**.
   Fetch the last known good commit from `STABLE_RELS.md`.
   ```powershell
   Get-Content STABLE_RELS.md -Tail 5
   ```

3. **Revert Local Code**.
   Switch back to the `main` branch and reset to the last stable commit.
   ```powershell
   & "C:\Program Files\Git\cmd\git.exe" checkout main
   # Note: The agent will replace [STABLE_SHA] with the actual SHA from STABLE_RELS.md
   & "C:\Program Files\Git\cmd\git.exe" reset --hard [STABLE_SHA]
   ```

4. **Vercel Rollback**.
   Inform the user to manually trigger the rollback in the Vercel Dashboard.
   > [!IMPORTANT]
   > Please visit the **[Vercel Deployments Page](https://vercel.com/dashboard/projects)** and click **"Rollback"** on the last successful deployment to restore the live site.

5. **Post-Mortem Analysis**.
   The agent will create a `POST_MORTEM.md` in the artifacts directory to document what was in progress and what likely caused the issue.
