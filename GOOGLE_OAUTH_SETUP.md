# Google OAuth Setup Guide for Wizqo

## Current Issue
"accounts.google.com refused to connect" error when trying to sign in with Google.

## Root Cause
The issue occurs because Google OAuth requires proper configuration in both Supabase and Google Cloud Console.

## Complete Fix Instructions

### Step 1: Google Cloud Console Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable the Google+ API:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Application type: "Web application"
   - Name: "Wizqo App"
   - Authorized redirect URIs: Add these URLs:
     ```
     https://jerhbtrgwrlyoimhxqta.supabase.co/auth/v1/callback
     https://84946fc3-bb4d-484c-a817-50868a18d63f-00-jgab4c5gngyj.picard.replit.dev
     ```
5. Copy the Client ID and Client Secret

### Step 2: Supabase Configuration
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your Wizqo project
3. Navigate to "Authentication" > "Providers"
4. Find "Google" and enable it
5. Enter the Client ID and Client Secret from Google Cloud Console
6. In "Authentication" > "URL Configuration":
   - Site URL: `https://84946fc3-bb4d-484c-a817-50868a18d63f-00-jgab4c5gngyj.picard.replit.dev`
   - Redirect URLs: Add the same URL

### Step 3: Alternative Solution (If Google Setup is Complex)
If Google OAuth setup is too complex, we can implement email-only authentication:

1. Disable Google sign-in temporarily
2. Use email + password authentication
3. Add email verification flow
4. Implement password reset functionality

## Current Status
- Supabase URL configuration: ✅ Complete
- Google Cloud Console setup: ❌ Needs configuration
- Provider settings in Supabase: ❌ Needs Google credentials

## Next Steps
Choose one of these options:
1. Complete Google OAuth setup (Steps 1-2 above)
2. Switch to email-only authentication (Step 3)
3. Add both Google and email authentication options