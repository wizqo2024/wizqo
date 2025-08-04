# Complete Google OAuth Setup Guide

## Root Cause of "Refused to Connect" Error
The error occurs because Google Cloud Console requires specific OAuth consent screen configuration and authorized domains setup.

## Step-by-Step Fix

### 1. Google Cloud Console Setup

#### A. Create/Configure Project
1. Go to https://console.cloud.google.com/
2. Create new project: "Wizqo-OAuth"
3. Enable APIs:
   - Google+ API
   - Google Identity Services API

#### B. OAuth Consent Screen (CRITICAL)
1. Navigate: APIs & Services → OAuth consent screen
2. **User Type**: Select "External" (this is crucial)
3. **App Information**:
   - App name: "Wizqo"
   - User support email: your email
   - App logo: (optional)
   - App domain: Leave blank for now
   - **Authorized domains**: Add these domains:
     ```
     replit.dev
     supabase.co
     ```
   - Developer contact: your email
4. Click "Save and Continue"

#### C. Scopes Configuration
1. Click "Add or Remove Scopes"
2. Select these scopes:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile` 
   - `openid`
3. Click "Update" → "Save and Continue"

#### D. Test Users (For Development)
1. Add your email as a test user
2. Click "Save and Continue"

#### E. Create OAuth Credentials
1. Navigate: APIs & Services → Credentials
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. **Application type**: Web application
4. **Name**: "Wizqo Web Client"
5. **Authorized JavaScript origins**:
   ```
   https://84946fc3-bb4d-484c-a817-50868a18d63f-00-jgab4c5gngyj.picard.replit.dev
   https://jerhbtrgwrlyoimhxqta.supabase.co
   ```
6. **Authorized redirect URIs**:
   ```
   https://jerhbtrgwrlyoimhxqta.supabase.co/auth/v1/callback
   https://84946fc3-bb4d-484c-a817-50868a18d63f-00-jgab4c5gngyj.picard.replit.dev
   ```
7. Click "Create"
8. **COPY** Client ID and Client Secret

### 2. Supabase Configuration

#### A. Enable Google Provider
1. Go to Supabase Dashboard → Your Project
2. Navigate: Authentication → Providers
3. Find "Google" and toggle "Enabled"
4. Enter:
   - **Client ID**: From Google Cloud Console
   - **Client Secret**: From Google Cloud Console
5. Click "Save"

#### B. Verify URL Configuration
1. Navigate: Authentication → URL Configuration
2. **Site URL**: `https://84946fc3-bb4d-484c-a817-50868a18d63f-00-jgab4c5gngyj.picard.replit.dev`
3. **Redirect URLs**: Same URL as above

### 3. Publish OAuth App (Recommended)

#### Option A: Publish for All Users
1. Go back to OAuth consent screen
2. Click "Publish App"
3. Submit for verification (takes 1-7 days)

#### Option B: Keep in Testing Mode
1. Keep app in "Testing" status
2. Only test users can sign in
3. Add more test users as needed

## Verification Steps

After completing setup:
1. Clear browser cache/use incognito mode
2. Try Google sign-in on Wizqo
3. Should see Google account selection (not "refused to connect")
4. After selecting account, should redirect back to Wizqo successfully

## Common Issues & Solutions

### "Refused to Connect"
- Check authorized domains include `replit.dev` and `supabase.co`
- Verify OAuth consent screen is configured for "External"
- Ensure redirect URIs match exactly

### "Access Blocked"
- App needs to be published or user needs to be added as test user
- Check scopes are properly configured

### "Invalid Redirect URI" 
- Verify exact URL match in Google Cloud Console
- Check both JavaScript origins AND redirect URIs

## Current Status After Setup
✅ Google Cloud Console project configured  
✅ OAuth consent screen for external users  
✅ Proper scopes and domains authorized  
✅ Supabase Google provider enabled  
✅ Matching redirect URLs configured  

This should resolve all Google OAuth issues and provide seamless authentication.