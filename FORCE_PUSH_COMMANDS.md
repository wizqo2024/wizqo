# Force Push Commands (Direct Method)

## Step 1: Get GitHub Personal Access Token
1. Go to GitHub.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)" 
3. Select scopes: `repo` (full repository access)
4. Copy the token

## Step 2: Run These Commands in Shell
Replace `YOUR_TOKEN` with your actual GitHub token:

```bash
# Set remote with token
git remote set-url origin https://wizqo2024:YOUR_TOKEN@github.com/wizqo2024/HobbyPlanGen.git

# Switch to main branch
git checkout main

# Merge all changes from replit-agent
git merge replit-agent

# Force push to GitHub
git push origin main --force
```

## Alternative Single Command (if merge conflicts)
```bash
# If you want to force push replit-agent branch directly
git push origin replit-agent --force
```

## What This Will Do
- Upload all 676 commits from your local replit-agent branch
- Include mobile navigation improvements (hamburger menu, responsive layout)
- Override any conflicts on GitHub repository
- Make GitHub match your local code exactly

**Copy these commands to Shell tab and replace YOUR_TOKEN with your GitHub token.**