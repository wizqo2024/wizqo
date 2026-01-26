# Fix Vercel Author Email Issue

## Problem
Vercel error: "No GitHub account was found matching the commit author email address"

## Solution: Update Git Author Email

Run these commands in Shell to fix the author email and re-push:

```bash
# Navigate to workspace
cd /home/runner/workspace

# Clear Git locks
rm -f .git/*.lock .git/refs/heads/*.lock .git/index.lock 2>/dev/null || true
pkill -f git 2>/dev/null || true

# Set the correct author email (your GitHub account email)
git config user.email "wizqo2024@gmail.com"
git config user.name "wizqo2024"

# Check current status
git status

# Amend the last commit with correct author info
git commit --amend --author="wizqo2024 <wizqo2024@gmail.com>" --no-edit

# Force push to GitHub main with correct author
git push "$GIT_URL" independence-migration:main --force

# Alternative if above fails:
git push https://wizqo2024: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@github.com/wizqo2024/HobbyPlanGen independence-migration:main --force
```

This will:
1. Set the correct Git author email (wizqo2024@gmail.com)
2. Update the last commit with the right author info
3. Push to GitHub with the corrected author
4. Allow Vercel to properly recognize the GitHub account