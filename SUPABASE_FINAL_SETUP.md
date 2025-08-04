# Final Supabase Google OAuth Configuration

## Current Status
✅ Google OAuth credentials are configured in Replit Secrets  
✅ Redirect URLs are set correctly in Supabase  
❌ Google provider needs to be enabled in Supabase with credentials  

## Required Action in Supabase Dashboard

**Go to your Supabase project:** https://supabase.com/dashboard

**Navigate to:** Authentication > Providers > Google

**Configuration:**
1. **Enable Google Provider:** Toggle the switch to "Enabled"
2. **Client ID:** Use the same Client ID you provided to Replit Secrets
3. **Client Secret:** Use the same Client Secret you provided to Replit Secrets
4. **Redirect URL:** Should already be set to `https://jerhbtrgwrlyoimhxqta.supabase.co/auth/v1/callback`

## Verification Checklist

After configuring in Supabase:
- [ ] Google provider is enabled
- [ ] Client ID matches your Google Cloud Console credentials
- [ ] Client Secret matches your Google Cloud Console credentials
- [ ] Redirect URL is set to the Supabase callback URL
- [ ] Site URL includes your Replit development URL

## Test Authentication

Once configured:
1. Refresh your Wizqo app
2. Click "Continue with Google"
3. You should see the Google account selection screen
4. After successful authentication, you'll be redirected back to Wizqo

## If Issues Persist

Check these common problems:
- Ensure Google+ API is enabled in Google Cloud Console
- Verify OAuth consent screen is configured
- Make sure redirect URIs in Google Cloud Console include both:
  - `https://jerhbtrgwrlyoimhxqta.supabase.co/auth/v1/callback`
  - `https://84946fc3-bb4d-484c-a817-50868a18d63f-00-jgab4c5gngyj.picard.replit.dev`