# Google OAuth Quick Fix - Final Steps

## Current Status
✅ Google OAuth credentials configured in Replit  
✅ Supabase Google provider enabled  
✅ Redirect URLs configured  
❌ Google Cloud Console OAuth consent screen needs final setup  

## The Issue
The "refused to connect" error occurs because Google Cloud Console OAuth consent screen isn't configured for external users yet.

## Quick 5-Minute Fix

### 1. Google Cloud Console Final Setup
1. **Go to**: https://console.cloud.google.com/apis/credentials/consent
2. **User Type**: Make sure "External" is selected (not Internal)
3. **App Information**:
   - App name: "Wizqo"
   - User support email: your email
   - **Authorized domains** (CRITICAL): Add these exact domains:
     ```
     replit.dev
     supabase.co
     ```
4. **Scopes**: Add these Google API scopes:
   - `userinfo.email`
   - `userinfo.profile`
   - `openid`
5. **Test Users**: Add your email address as a test user
6. **Save** the configuration

### 2. Verify OAuth 2.0 Client
1. **Go to**: https://console.cloud.google.com/apis/credentials
2. **Edit your OAuth 2.0 Client ID**
3. **Authorized JavaScript origins**:
   ```
   https://84946fc3-bb4d-484c-a817-50868a18d63f-00-jgab4c5gngyj.picard.replit.dev
   https://jerhbtrgwrlyoimhxqta.supabase.co
   ```
4. **Authorized redirect URIs**:
   ```
   https://jerhbtrgwrlyoimhxqta.supabase.co/auth/v1/callback
   https://84946fc3-bb4d-484c-a817-50868a18d63f-00-jgab4c5gngyj.picard.replit.dev
   ```

### 3. Test Authentication
After completing the above:
1. Clear browser cache or use incognito mode
2. Try Google sign-in on Wizqo
3. Should now work without "refused to connect" error

## Expected Result
- Google account selection screen appears
- User can select their Google account
- Successful redirect back to Wizqo with authentication
- User profile appears in navigation
- Access to dashboard and hobby plans

## If Still Having Issues
1. **Publishing Status**: Consider publishing the OAuth app for all users (not just test users)
2. **Domain Verification**: Ensure `replit.dev` and `supabase.co` are added to authorized domains
3. **Consent Screen**: Make sure it's configured for "External" users

The key missing piece is usually the authorized domains configuration in the OAuth consent screen.