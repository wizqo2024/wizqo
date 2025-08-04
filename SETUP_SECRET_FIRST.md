# Setup Required Before git push $GIT_URL

## Step 1: Create Replit Secret
1. Go to **Tools → Secrets** in your Replit workspace
2. Click **"New Secret"**
3. Set:
   - **Key**: `GIT_URL`
   - **Value**: `https://wizqo2024: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@github.com/wizqo2024/HobbyPlanGen`

## Step 2: Then Run in Shell Tab
```bash
git checkout main
git merge replit-agent
git push $GIT_URL
```

## Why This Works
- Replit Secrets bypass some authentication restrictions
- Your token is stored securely in the environment
- $GIT_URL references the secret automatically

**You must create the secret first, then the git push $GIT_URL command will work in the Shell tab.**