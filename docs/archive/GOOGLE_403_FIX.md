# Fix Google OAuth 403 Error

## The Problem
The 403 error occurs because the Google Cloud Console OAuth consent screen is not properly configured for external users.

## Required Fix in Google Cloud Console

### Step 1: Configure OAuth Consent Screen
1. Go to https://console.cloud.google.com/
2. Select your Wizqo project
3. Navigate to "APIs & Services" > "OAuth consent screen"
4. **CRITICAL**: Choose "External" user type (not Internal)
5. Fill out the required fields:
   - App name: "Wizqo"
   - User support email: your email address
   - App logo: (optional)
   - App domain: `wizqo.com` or leave blank
   - Authorized domains: Add `replit.dev` and `supabase.co`
   - Developer contact information: your email
6. Click "Save and Continue"

### Step 2: Configure Scopes
1. On the Scopes page, click "Add or Remove Scopes"
2. Add these Google scopes:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
   - `openid`
3. Click "Update" then "Save and Continue"

### Step 3: Add Test Users (Temporary)
1. On the Test users page, click "Add Users"
2. Add your email address and any other emails you want to test with
3. Click "Save and Continue"

### Step 4: Publish App (Optional but Recommended)
1. Go back to OAuth consent screen
2. Click "Publish App" to make it available to all users
3. If you don't publish, only test users can sign in

### Alternative: Use Different Redirect Strategy
If the above is too complex, I can implement a different authentication flow:
1. Email/password only (already working)
2. Magic link authentication
3. Social login with a different provider

## Current Status
- Supabase configuration: ✅ Complete
- Google credentials: ✅ Provided
- OAuth consent screen: ❌ Needs external user configuration
- App publication: ❌ Needs to be published or test users added