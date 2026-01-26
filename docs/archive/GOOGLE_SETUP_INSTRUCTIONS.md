# Complete Google OAuth Setup for Wizqo

## Step-by-Step Instructions

### 1. Google Cloud Console Setup

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create or Select Project:**
   - Click "Select a project" at the top
   - Either select existing project or click "New Project"
   - Name: "Wizqo" or similar
   - Click "Create"

3. **Enable Required APIs:**
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and click on it
   - Click "Enable"
   - Also search for "Google Identity" and enable it

4. **Configure OAuth Consent Screen:**
   - Go to "APIs & Services" > "OAuth consent screen"
   - Choose "External" (unless you have G Suite)
   - Fill in required fields:
     - App name: "Wizqo"
     - User support email: your email
     - Developer contact: your email
   - Click "Save and Continue"
   - Skip scopes for now, click "Save and Continue"
   - Add test users if needed, click "Save and Continue"

5. **Create OAuth 2.0 Credentials:**
   - Go to "APIs & Services" > "Credentials"
   - Click "+ Create Credentials" > "OAuth 2.0 Client IDs"
   - Application type: "Web application"
   - Name: "Wizqo Web Client"
   - Authorized JavaScript origins: Add:
     ```
     https://84946fc3-bb4d-484c-a817-50868a18d63f-00-jgab4c5gngyj.picard.replit.dev
     https://jerhbtrgwrlyoimhxqta.supabase.co
     ```
   - Authorized redirect URIs: Add:
     ```
     https://jerhbtrgwrlyoimhxqta.supabase.co/auth/v1/callback
     https://84946fc3-bb4d-484c-a817-50868a18d63f-00-jgab4c5gngyj.picard.replit.dev
     ```
   - Click "Create"
   - **COPY the Client ID and Client Secret** - you'll need these!

### 2. Supabase Configuration

1. **Go to Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard
   - Select your Wizqo project

2. **Configure Google Provider:**
   - Navigate to "Authentication" > "Providers"
   - Find "Google" in the list
   - Toggle it to "Enabled"
   - Enter the Client ID: `${process.env.GOOGLE_CLIENT_ID}` (the one you just provided to Replit)
   - Enter the Client Secret: `${process.env.GOOGLE_CLIENT_SECRET}` (the one you just provided to Replit)
   - Click "Save"

3. **Verify URL Configuration:**
   - Go to "Authentication" > "URL Configuration"
   - Site URL should be: `https://84946fc3-bb4d-484c-a817-50868a18d63f-00-jgab4c5gngyj.picard.replit.dev`
   - Redirect URLs should include the same URL

### 3. Test the Setup

After completing both steps above:
1. Refresh your Wizqo app
2. Try the "Continue with Google" button
3. It should now work without the "refused to connect" error

## Troubleshooting

If you still get errors:
- Double-check all URLs match exactly
- Make sure Google+ API is enabled
- Verify Client ID/Secret are entered correctly in Supabase
- Try using an incognito/private browser window

## Current Requirements
- Google Cloud Console project with OAuth credentials
- Supabase Google provider configuration with Client ID/Secret
- Matching redirect URLs in both platforms