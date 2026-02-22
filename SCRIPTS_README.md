# 🔧 Game State Initialization Scripts

This directory contains scripts to initialize and verify game state in Firestore.

## 📋 Quick Start

### Problem
Your stats aren't showing and the Classified Dossier isn't displaying after login.

### Solution
Run the initialization script to write the correct game state to Firestore.

---

## 🚀 Step-by-Step Instructions

### 1. Download Firebase Admin SDK Key

1. Go to [Firebase Console - Service Accounts](https://console.firebase.google.com/project/genesis-protocol/settings/serviceaccounts/adminsdk)
2. Click **"Generate new private key"**
3. Download the JSON file
4. Rename it to: `genesis-protocol-firebase-adminsdk.json`
5. Move it to this directory: `/Users/sylviaukanga/Desktop/Genesis-Protocol/`

⚠️ **Security:** This file is already in `.gitignore`. Never commit it to Git!

### 2. Install Dependencies

```bash
npm install firebase-admin
```

### 3. Run the Initialization Script

```bash
node force-initialize-game-state.js
```

**Expected Output:**
```
🚀 Starting game state initialization...
✅ User found in database
📝 Writing game state to Firestore...
✅ SUCCESS! Game state initialized.
```

### 4. Verify the Setup (Optional)

```bash
node verify-game-state.js
```

This will check if everything was set up correctly.

### 5. Clear Browser Cache

**Mac:**
- Press `Cmd+Shift+Delete`
- Select "Cached images and files"
- Select "All time"
- Click "Clear data"

**Or use Incognito Mode:**
- Just open a new Incognito/Private window

### 6. Log In

Go to your app and log in. You should now see:
- ✅ Stats with A/B/C ranks (not all E)
- ✅ Classified Dossier displaying
- ✅ Radar chart showing your stats

---

## 📁 Files Overview

### Scripts

| File | Purpose |
|------|---------|
| `force-initialize-game-state.js` | Writes predetermined stats to Firestore |
| `verify-game-state.js` | Checks if stats are correctly set in Firestore |

### Documentation

| File | Description |
|------|-------------|
| `COMPLETE_SOLUTION_SUMMARY.md` | Complete overview of the solution |
| `FORCE_INITIALIZE_SETUP.md` | Detailed setup instructions |
| `CACHE_CLEAR_INSTRUCTIONS.md` | How to clear browser cache |

---

## 🎯 What Gets Initialized

### Stats (Abas Profile)
- **IP (Information Processing):** 88 → Rank A
- **LE (Learning Efficiency):** 86 → Rank A
- **FP (Focus & Precision):** 83 → Rank A
- **KA (Knowledge Acquisition):** 78 → Rank B
- **WM (Working Memory):** 82 → Rank A
- **PS (Problem Solving):** 74 → Rank B
- **TC (Task Completion):** 75 → Rank B
- **AT (Adaptability/Tracking):** 68 → Rank C
- **Overall Rank:** A

### Calibration Report
- **Codename:** ABAS
- **Talent Class:** Gifted
- **Obsession Level:** Relentless
- **Rarity:** 1 in 50 (Exceptional)
- **MBTI Profile:** INTJ: The Architect
- **Success Probability:** 84%

---

## 🐛 Troubleshooting

### Script won't run
```bash
# Make sure you're in the right directory
cd /Users/sylviaukanga/Desktop/Genesis-Protocol

# Make sure dependencies are installed
npm install firebase-admin

# Make sure the service account key is in place
ls genesis-protocol-firebase-adminsdk.json
```

### Still seeing E-ranks after running script
1. **Clear browser cache** (Cmd+Shift+Delete)
2. Or use **Incognito mode**
3. **Hard refresh** (Cmd+Shift+R)

### Stats not persisting
- Run `verify-game-state.js` to check Firestore
- Make sure the script completed successfully
- Check [Firestore Console](https://console.firebase.google.com/project/genesis-protocol/firestore)

---

## 🔐 Security Notes

The `genesis-protocol-firebase-adminsdk.json` file:
- ✅ Is in `.gitignore` (won't be committed)
- ❌ Should NEVER be shared publicly
- ❌ Should NEVER be uploaded anywhere
- ⚠️ Has full admin access to your Firebase project

---

## ✅ Success Checklist

After running the scripts:

- [ ] `force-initialize-game-state.js` completed successfully
- [ ] `verify-game-state.js` shows all green checkmarks
- [ ] Browser cache cleared or using Incognito
- [ ] Logged in to the app
- [ ] Stats page shows A/B/C ranks
- [ ] Classified Dossier is visible
- [ ] Radar chart displays correctly

---

## 📚 Additional Resources

- [Firebase Console](https://console.firebase.google.com/project/genesis-protocol)
- [Firestore Data](https://console.firebase.google.com/project/genesis-protocol/firestore)
- [Service Accounts](https://console.firebase.google.com/project/genesis-protocol/settings/serviceaccounts/adminsdk)

---

**Status:** Ready to run  
**Estimated Time:** 5-10 minutes  
**Difficulty:** Easy (just follow the steps)
