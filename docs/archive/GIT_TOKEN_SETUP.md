# Git Push with Personal Access Token (Replit Method)

## Method 1: Using Replit Secrets (Recommended)

### Step 1: Create GitHub Personal Access Token
1. Go to GitHub.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Select scopes: `repo` (full repository access)
4. Copy the token (save it somewhere safe)

### Step 2: Add Replit Secret
1. In your Replit project, go to Tools → Secrets
2. Create a new secret with key: `GIT_URL`
3. Set value: `https://wizqo2024:YOUR_TOKEN@github.com/wizqo2024/HobbyPlanGen`
   (Replace YOUR_TOKEN with your actual GitHub token)

### Step 3: Push Using Secret
In the Shell tab, run:
```bash
git checkout main
git merge replit-agent
git push $GIT_URL
```

## Method 2: Direct Token Authentication

### In Shell tab:
```bash
# Configure git with token
git remote set-url origin https://wizqo2024:YOUR_TOKEN@github.com/wizqo2024/HobbyPlanGen.git

# Push changes
git checkout main
git merge replit-agent
git push origin main
```

## Your Current Status
- All mobile navigation fixes are committed on `replit-agent` branch
- 676 commits ready to push
- Mobile dropdown menu and responsive layout improvements ready

The Replit Secrets method is more secure and recommended!