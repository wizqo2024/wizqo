# Email Authentication Debug Guide

## Current Investigation
Testing email signup functionality to identify why it's not working.

## Enhanced Debug Features Added:
1. **Console Logging**: Added detailed logging for all auth operations
2. **Better Error Messages**: User-friendly error descriptions for common issues
3. **Flow Guidance**: Automatic switch to sign-in after successful signup

## Common Email Auth Issues & Solutions:

### 1. Email Confirmation Not Enabled
**Problem**: Supabase requires email confirmation by default
**Solution**: Either:
- Disable email confirmation in Supabase Dashboard → Authentication → Settings
- OR ensure users check email for confirmation link

### 2. SMTP Not Configured
**Problem**: Supabase can't send confirmation emails
**Solution**: Configure SMTP in Supabase Dashboard → Authentication → Email Templates

### 3. Invalid Redirect URLs
**Problem**: Email confirmation links redirect to wrong URL
**Solution**: Set correct Site URL in Supabase Dashboard → Authentication → URL Configuration

### 4. Rate Limiting
**Problem**: Too many signup attempts
**Solution**: Wait or check Supabase Dashboard → Authentication → Rate Limits

## Test Steps:
1. Open browser console to see detailed logs
2. Try signing up with a new email
3. Check console for error details
4. Verify Supabase dashboard for new user creation

## Supabase Configuration Checklist:
- [ ] SMTP configured for email sending
- [ ] Site URL matches current Replit domain
- [ ] Email confirmation setting configured
- [ ] Rate limits not exceeded
- [ ] Database tables created and accessible

## Next Steps:
Based on console logs, we can identify and fix the specific issue preventing email authentication.