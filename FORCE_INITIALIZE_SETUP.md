# Force Initialize Game State - Setup Guide

## Problem
Your Firestore account only has authentication data but no game state (stats, calibration report, etc.), which is why the app isn't showing your predetermined stats or Classified Dossier.

## Solution
Use the `force-initialize-game-state.js` script to write the correct game state directly to Firestore.

---

## Quick Start

### 1. Download Firebase Admin SDK Key

1. Go to [Firebase Console](https://console.firebase.google.com/project/genesis-protocol/settings/serviceaccounts/adminsdk)
2. Click on the **Service accounts** tab
3. Click **Generate new private key**
4. Download the JSON file
5. **Rename** it to `genesis-protocol-firebase-adminsdk.json`
6. **Move** it to your project root: `/Users/sylviaukanga/Desktop/Genesis-Protocol/`

### 2. Install Dependencies

```bash
npm install firebase-admin
```

### 3. Run the Script

```bash
node force-initialize-game-state.js
```

### 4. Clear Browser Cache

**Option A: Clear Cache**
1. Open Chrome/Brave
2. Press `Cmd+Shift+Delete` (Mac)
3. Select **Cached images and files**
4. Select **All time**
5. Click **Clear data**

**Option B: Use Incognito Mode**
- Just open a new Incognito/Private window

### 5. Log In

Go to your app and log in. You should now see:
- ✅ All stats set to Abas profile values (A/B/C ranks)
- ✅ Classified Dossier showing your profile
- ✅ Radar chart displaying your stats correctly

---

## What the Script Does

The script:
1. ✅ Connects to your Firestore database
2. ✅ Writes the predetermined Abas profile stats
3. ✅ Writes the calibration report (for dossier display)
4. ✅ Marks onboarding as complete
5. ✅ Updates your account with all game state data

---

## Expected Output

```
🚀 Starting game state initialization...

User ID: bKGGHbe6Szdo0oSx3OOVrDFhUmq1
Profile: Abas (Predetermined Stats)

✅ User found in database

📝 Writing game state to Firestore...

Stats being set:
  IP: 88 (Rank: A)
  LE: 86 (Rank: A)
  FP: 83 (Rank: A)
  KA: 78 (Rank: B)
  WM: 82 (Rank: A)
  PS: 74 (Rank: B)
  TC: 75 (Rank: B)
  AT: 68 (Rank: C)
  Overall Rank: A

✅ SUCCESS! Game state initialized.

📊 Summary:
  - Stats: 8 attributes set
  - Overall Rank: A
  - Calibration Report: Complete
  - Onboarding: Marked complete

🎯 Next Steps:
  1. Clear your browser cache (Cmd+Shift+Delete on Mac)
  2. Or use Incognito/Private mode
  3. Log in to see your stats and Classified Dossier
```

---

## Troubleshooting

### Error: "Service account key file not found"
- Make sure you downloaded the Firebase Admin SDK key
- Make sure you renamed it to `genesis-protocol-firebase-adminsdk.json`
- Make sure it's in the project root directory

### Error: "User not found in Firestore"
- Make sure you've logged in to the app at least once
- The user ID in the script should match your Firebase auth ID

### Error: "Permission denied"
- The service account key gives admin access, so this shouldn't happen
- Make sure the JSON file is valid

### Still not seeing stats after running the script?
- **Clear your browser cache** or use Incognito mode
- The app may have cached the old (empty) state

---

## File Locations

- Script: `/Users/sylviaukanga/Desktop/Genesis-Protocol/force-initialize-game-state.js`
- Service Account Key (you download): `/Users/sylviaukanga/Desktop/Genesis-Protocol/genesis-protocol-firebase-adminsdk.json`

---

## Security Note

⚠️ **IMPORTANT**: The `genesis-protocol-firebase-adminsdk.json` file contains admin credentials. 

**DO NOT**:
- ❌ Commit it to Git
- ❌ Share it publicly
- ❌ Upload it anywhere

The `.gitignore` should already exclude it, but double-check!
