# Supabase Setup Guide

This document outlines the required Supabase configuration for the app to work correctly.

## 1. Profiles Table

Run this SQL in your Supabase SQL Editor to create/update the profiles table:

```sql
-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('customer', 'vendor')),
    phone TEXT,
    address TEXT,
    business_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS profiles_role_idx ON profiles(role);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Policy: Users can select their own profile
CREATE POLICY "Users can select their own profile"
    ON profiles FOR SELECT USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Policy: Admins can select all profiles (optional)
-- CREATE POLICY "Admins can select all profiles"
--     ON profiles FOR SELECT USING (
--         EXISTS (
--             SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
--         )
--     );
```

## 2. Email Verification Setup

1. **Enable Email Verification in Supabase Dashboard:**
   - Go to Authentication → Providers → Email
   - Enable "Require email confirmation"
   - Set "Email OTP Expiration" to 24 hours (or as needed)

2. **Confirm Redirect URL:**
   - Authentication → URL Configuration
   - Add your app's redirect URL (e.g., `exp://localhost:8081/` for Expo, `myapp://verify` for native)

## 3. Test the Flow

### Signup Flow:
1. User fills signup form (name, email, password, phone, address, role)
2. App creates auth user → creates `profiles` entry → redirects to verify-email screen
3. User receives verification email from Supabase
4. User clicks link in email → email_confirmed_at is set in auth.users
5. User can now log in (login checks email_confirmed_at)

### Login Flow:
1. User enters email/password
2. Auth checks if email is verified (`email_confirmed_at IS NOT NULL`)
3. If not verified, shows "Please verify your email before logging in"
4. If verified, loads user profile from `profiles` table and redirects to dashboard

### Email Verification Screen:
- Shows verification status
- "Resend" button resends verification email
- "Check" button polls verification status
- Auto-redirects when verified

## 4. Troubleshooting

### Profile Insert Fails:
- Check RLS policies are enabled and correct
- Verify user ID matches auth.users.id
- Check all required fields are non-null (id, email, name, role)
- View Supabase logs for exact error

### Email Not Sending:
- Check email provider is configured (SMTP or Supabase default)
- Verify email address is valid
- Check spam folder
- Review Supabase email logs

### Verification Link Not Working:
- Ensure redirect URL is correct in your app
- Check deep linking is configured (Expo or native)
- For web: ensure environment variables are set

## 5. Environment Variables

Make sure `.env.local` contains:
```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```


