# Deployment Guide

## Quick Deployment Steps

### 1. GitHub Setup

**Important: Fix Git Author First**
```bash
# Configure Git with your GitHub email
git config --global user.email "your-github-email@example.com"
git config --global user.name "Your GitHub Username"

# Then commit and push
git init
git add .
git commit -m "Initial commit: Wizqo hobby learning platform"
git branch -M main
git remote add origin https://github.com/yourusername/wizqo.git
git push -u origin main
```

**Alternative: Download and Upload**
If Git issues persist:
1. Download project as ZIP from Replit
2. Create new GitHub repository
3. Upload files via GitHub web interface

### 2. Vercel Deployment
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Set environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `DEEPSEEK_API_KEY`
5. Deploy!

### 3. Supabase OAuth Configuration
Once deployed with your custom domain:

1. **Google OAuth Setup:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Edit your OAuth 2.0 Client ID
   - Add to "Authorized redirect URIs":
     - `https://yourdomain.com`
     - `https://jerhbtrgwrlyoimhxqta.supabase.co/auth/v1/callback`

2. **GitHub OAuth Setup:**
   - Go to GitHub Settings → Developer settings → OAuth Apps
   - Update "Authorization callback URL":
     - `https://jerhbtrgwrlyoimhxqta.supabase.co/auth/v1/callback`

3. **Supabase Dashboard:**
   - Go to Authentication → URL Configuration
   - Set "Site URL" to: `https://yourdomain.com`
   - Add redirect URLs: `https://yourdomain.com/**`

### 4. Database Setup
Run the migration in your Supabase SQL editor:
```sql
-- Copy and paste content from supabase/migrations/001_initial_setup.sql
```

### 5. Custom Domain (Optional)
1. In Vercel dashboard, go to your project
2. Settings → Domains
3. Add your custom domain
4. Update DNS records as instructed
5. Update Supabase and OAuth providers with new domain

## Environment Variables Checklist

### Required for Production:
- ✅ `VITE_SUPABASE_URL` - Your Supabase project URL
- ✅ `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- ✅ `DEEPSEEK_API_KEY` - For AI-powered plan generation

### OAuth Provider Configuration:
- ✅ Google Cloud Console - Redirect URIs updated
- ✅ GitHub OAuth App - Callback URL updated
- ✅ Supabase Auth - Site URL and redirect URLs set

## Post-Deployment Testing

1. **Authentication:**
   - ✅ Email/password registration
   - ✅ Google OAuth sign-in
   - ✅ GitHub OAuth sign-in

2. **Core Features:**
   - ✅ AI plan generation
   - ✅ Plan saving to dashboard
   - ✅ Progress tracking
   - ✅ YouTube video embeds

3. **Responsive Design:**
   - ✅ Mobile compatibility
   - ✅ Desktop functionality
   - ✅ Cross-browser testing

## Troubleshooting

### Google OAuth Issues:
- Verify redirect URIs in Google Console
- Check "Site URL" in Supabase settings
- Wait 1-2 minutes after changes

### Build Errors:
- Ensure all environment variables are set
- Check Vercel build logs
- Verify package.json scripts

### Database Issues:
- Run migrations in Supabase
- Check Row Level Security policies
- Verify user permissions

## Success Metrics

After deployment, your users will be able to:
- Sign in with multiple methods
- Generate personalized 7-day hobby plans
- Save and track their learning progress
- Access curated YouTube tutorials
- Use the platform across all devices

Ready for production! 🚀