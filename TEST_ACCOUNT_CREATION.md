# Quick Test Guide - Account Creation

## What Was Fixed
The "missing or insufficient permissions" error during signup has been resolved by updating Firestore security rules.

## How to Test

### 1. Test New Account Creation
1. Open your Genesis Protocol app: https://genesis-protocol-bffc2.web.app
2. Click **"Sign Up"** or navigate to the signup page
3. Enter:
   - **Email:** test@example.com (use a real email format)
   - **Password:** TestPass123! (at least 6 characters)
   - **Username:** testuser (3-20 characters, alphanumeric)
4. Click **"Sign Up"**
5. **Expected Result:** ✅ Account created successfully, redirected to main app

### 2. Test Username Validation
1. Try to create another account with the same username
2. **Expected Result:** ✅ Error message "Username already taken"

### 3. Test Login with Username
1. Log out (if logged in)
2. On the login page, enter:
   - **Email/Username:** testuser (or the username you created)
   - **Password:** TestPass123!
3. Click **"Sign In"**
4. **Expected Result:** ✅ Logged in successfully

### 4. Test Login with Email
1. Log out
2. On the login page, enter:
   - **Email/Username:** test@example.com
   - **Password:** TestPass123!
3. Click **"Sign In"**
4. **Expected Result:** ✅ Logged in successfully

## What Should NOT Happen
- ❌ "Missing or insufficient permissions" error
- ❌ Firestore security rules errors in console
- ❌ Getting stuck at login/signup screens
- ❌ Being redirected to onboarding (onboarding is disabled)

## If You Still See Errors
1. **Clear browser cache and cookies** (Ctrl+Shift+Delete / Cmd+Shift+Delete)
2. **Hard refresh** the page (Ctrl+Shift+R / Cmd+Shift+R)
3. **Try incognito/private browsing mode**
4. **Check browser console** for any errors (F12 → Console tab)
5. **Verify Firebase Console:**
   - Go to https://console.firebase.google.com/project/genesis-protocol-bffc2/firestore/rules
   - Confirm the rules show `allow read: if true;` for the `/users` collection

## Browser Console Check
Open Developer Tools (F12) and check:
- No red errors related to Firestore permissions
- No authentication errors
- No network errors for Firebase requests

## Firebase Console Verification
1. Go to: https://console.firebase.google.com/project/genesis-protocol-bffc2/authentication/users
2. After creating a test account, you should see it listed here
3. Go to: https://console.firebase.google.com/project/genesis-protocol-bffc2/firestore/data
4. Check `/users` collection - should have a document with your user's UID
5. The document should contain:
   - `username`
   - `displayName`
   - `email`
   - `createdAt`
   - `uid`

## Success Indicators ✅
- Account creation completes without errors
- User is redirected to the main app (not onboarding)
- User can log out and log back in
- Firebase Console shows the new user in Authentication
- Firestore shows the user document in `/users` collection

---

**Last Updated:** January 29, 2025  
**Fix Deployed:** ✅ Live in production
