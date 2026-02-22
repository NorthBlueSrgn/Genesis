# 🔧 Clear Cache and Force Fresh Stats

## The Problem

Your Firestore database only has authentication data, but **no game state** is saved. The browser is using old cached data instead of creating fresh stats with the new predetermined profile.

## Solution: Clear All Data and Force Fresh Start

### Method 1: Clear Browser Data (Recommended)

1. **Open the app**: https://genesis-protocol-bffc2.web.app
2. **Open Developer Tools**:
   - Mac: `Cmd + Option + I`
   - Windows: `Ctrl + Shift + I`
3. **Go to Application tab** (Chrome) or Storage tab (Firefox)
4. **Clear all storage**:
   - Click "Clear site data" or "Storage" → "Clear All"
   - This includes:
     - Local Storage
     - Session Storage
     - IndexedDB
     - Cache Storage
5. **Close and reopen** the browser
6. **Login again** - You should get fresh stats

### Method 2: Use Incognito/Private Mode

1. Open a **new incognito/private window**
2. Go to: https://genesis-protocol-bffc2.web.app
3. Login
4. Fresh stats should load

### Method 3: Manual Firestore Clear (Nuclear Option)

If the above don't work, we can manually delete your game state from Firestore:

1. Go to Firebase Console: https://console.firebase.google.com
2. Select project: `genesis-protocol-bffc2`
3. Go to **Firestore Database**
4. Navigate to collection: `gameStates`
5. Find document with ID: `bKGGHbe6Szdo0oSx3OOVrDFhUmq1`
6. **Delete it** (if it exists)
7. Logout and login again

---

## What Should Happen After Clearing Cache

### ✅ Expected Results:

1. **Login** → Game loads
2. **Dashboard** shows stats immediately:
   - Physical: 300 (C)
   - Vitality: 340 (C)
   - Intelligence: 415 (A)
   - Creativity: 350 (B)
   - Spirit: 345 (B)
   - Psyche: 360 (B)

3. **Stats Page** → Radar chart shows hexagon (not dot at center)

4. **Rank Page**:
   - HATI: ~71% (not 0%)
   - Grade: B
   - "View Classified Dossier" button visible

5. **Dossier** displays complete profile

---

## Why This Happened

The code was updated to use predetermined stats, but:
1. Your browser had **old cached data** from before the fix
2. Your Firestore had **no game state** saved
3. The browser kept using the old cache instead of creating fresh data

By clearing the cache, the app will:
1. See no local cache
2. See no Firestore data
3. **Create fresh state** with the new predetermined stats
4. **Save to Firestore** for the first time

---

## Quick Test Checklist

After clearing cache:

- [ ] Login successful
- [ ] Dashboard shows stats (not zeros)
- [ ] Stats Page radar is hexagonal
- [ ] Rank Page shows ~71-75% HATI
- [ ] Dossier button appears
- [ ] Dossier shows complete profile

---

## Still Not Working?

If clearing cache doesn't work, try this in the browser console:

```javascript
// Open DevTools Console (F12) and run:
localStorage.clear();
sessionStorage.clear();
location.reload();
```

Or let me know and I'll create a backend script to force-write your stats to Firestore!
