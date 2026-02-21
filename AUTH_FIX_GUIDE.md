# Authentication Flow Fix - Complete Guide

## Summary of Changes

This document explains the fixes made to resolve:
1. **User data not saving to `profiles` table** after signup
2. **Email verification not being enforced** on login
3. **App not preventing unverified users** from accessing the interface

## Problems Fixed

### 1. Profile Insert Failures (signup)
**Problem:** Users could create an auth account, but profile data wasn't being saved to the database.

**Cause:** Row-Level Security (RLS) policies were missing or incorrect, preventing profile inserts.

**Solution:**
- Added retry logic in `signUp()` function with 3 attempts and exponential backoff
- Function now waits before retrying if insert fails
- Better error handling and logging
- Profile insert errors no longer block signup (user can access app but may have incomplete profile)
- Added explicit null handling for optional fields (phone, address, business_name)

**Code Modified:** [`contexts/AuthContext.tsx`](contexts/AuthContext.tsx#L208-L270)

### 2. Email Verification Gate Not Enforced
**Problem:** Unverified users could log in and access the app.

**Cause:** `login()` function didn't check `email_confirmed_at` field.

**Solution:**
- Added verification check in `login()`: throws error if `!data.user.email_confirmed_at`
- Error message: "Please verify your email before logging in"
- User must verify email before accessing any app features

**Code Modified:** [`contexts/AuthContext.tsx`](contexts/AuthContext.tsx#L155-L160)

### 3. Improved Email Verification Screen
**Problem:** Verification screen didn't auto-redirect or show clear status.

**Solution:**
- Auto-redirects when email is verified (checks `isVerified && isAuthenticated`)
- Better UI with success/error message styling
- "Check status" button now properly handles state
- Disabled buttons while loading
- Clear instructions for user

**Code Modified:** [`app/(mainapp)/verify-email.tsx`](app/(mainapp)/verify-email.tsx)

## Complete Sign-Up → Login Flow

```
1. User fills signup form
   ↓
2. signUp() creates auth user with email/password
   ↓
3. signUp() inserts profile record to `profiles` table (with retry)
   ↓
4. App sets session and redirects to /verify-email
   ↓
5. User receives verification email from Supabase
   ↓
6. User clicks link in email → Supabase marks email_confirmed_at
   ↓
7. User manually checks status OR email auto-refreshes
   ↓
8. Screen auto-redirects to /customer or /vendor
   ↓
9. User logs out or session expires
   ↓
10. User logs in with email/password
    ↓
11. Login checks email_confirmed_at
    ↓
12. If verified: loads profile → redirects to dashboard
    ↓
13. If not verified: shows error "Please verify your email before logging in"
```

## Supabase Configuration Required

You MUST configure Supabase correctly for this to work. See [`SUPABASE_SETUP.md`](SUPABASE_SETUP.md) for complete SQL and setup steps.

### Quick Checklist:
- [ ] Create `profiles` table with columns: id, email, name, role, phone, address, business_name, avatar_url, created_at, updated_at
- [ ] Enable RLS on `profiles` table
- [ ] Add RLS policy: Users can insert their own profile
- [ ] Add RLS policy: Users can select their own profile
- [ ] Add RLS policy: Users can update their own profile
- [ ] Enable "Require email confirmation" in Authentication → Email Provider
- [ ] Set email redirect URL in Authentication → URL Configuration

## Testing the Flow

### Test Signup → Verify → Login:

1. **Sign up as customer:**
   - Go to customer login
   - Click "Sign up"
   - Fill: Name, Email, Password, Phone, Address
   - Submit
   - Should redirect to verify-email screen

2. **Verify email:**
   - Check inbox for email from Supabase
   - Click verification link
   - Should auto-redirect to /customer dashboard
   - Log out

3. **Try logging in unverified (optional test):**
   - Create account without verifying
   - Try to log in
   - Should get error: "Please verify your email before logging in"

4. **Log back in after verification:**
   - Use same email/password
   - Should log in successfully
   - Should see customer dashboard

## Files Modified

1. **[`contexts/AuthContext.tsx`](contexts/AuthContext.tsx)**
   - Added email verification check in `login()`
   - Added retry logic in `signUp()` for profile insert
   - Better error messages and logging

2. **[`app/(mainapp)/verify-email.tsx`](app/(mainapp)/verify-email.tsx)**
   - Improved auto-redirect logic
   - Better UI/UX for status checking
   - Clear success/error messages

3. **[`SUPABASE_SETUP.md`](SUPABASE_SETUP.md)** (NEW)
   - Complete SQL for profiles table
   - RLS policies setup
   - Supabase configuration guide
   - Troubleshooting tips

## Debugging Tips

If signup or login still fails:

1. **Check browser console (web):**
   - Open DevTools → Console
   - Look for `[Auth]` logs
   - Check for exact error messages

2. **Check Supabase logs:**
   - Supabase Dashboard → Auth → Logs
   - Look for failed insertions or policy violations

3. **Verify environment variables:**
   - `.env.local` must contain EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY
   - Restart dev server after changes

4. **Test RLS policies:**
   - Supabase Dashboard → SQL Editor
   - Try: `SELECT * FROM profiles WHERE id = auth.uid()`
   - Should return your profile or empty (if none)

5. **Check email delivery:**
   - Supabase Dashboard → Authentication → Email Templates
   - Verify email provider is configured
   - Check spam folder

## Next Steps

1. **Apply Supabase setup SQL** from [`SUPABASE_SETUP.md`](SUPABASE_SETUP.md)
2. **Test signup flow** with test email
3. **Verify email configuration** in Supabase
4. **Run full flow test** and collect any errors
5. **Debug using logs** if issues occur

---

**Questions?** Check browser console, Supabase logs, and [`SUPABASE_SETUP.md`](SUPABASE_SETUP.md) troubleshooting section.

