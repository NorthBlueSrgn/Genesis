# Genesis Protocol - Production Deployment Guide

**Status**: ✅ **READY FOR PRODUCTION**  
**Date**: January 19, 2026  
**Version**: 1.0.0

---

## Quick Start

### 1. Build the Application
```bash
cd /Users/sylviaukanga/Desktop/Genesis-Protocol
npm run build
```

**Expected Output**:
```
✓ 2278 modules transformed
✓ Built in 2.88s
✓ dist/index.html                     1.71 kB
✓ dist/assets/index-*.js            ~1.94 MB (gzipped 502 KB)
✓ dist/assets/index-*.css             2.16 kB
```

### 2. Deploy to Firebase Hosting
```bash
firebase deploy --project genesis-protocol-bffc2
```

**Expected Output**:
```
✓ Hosting URL: https://genesis-protocol-bffc2.web.app
✓ Hosting URL: https://genesis-protocol-bffc2.firebaseapp.com
✓ Deploy complete!
```

---

## Deployment Pre-Checklist

- ✅ **Build Verification**
  - [ ] `npm run build` completes without errors
  - [ ] `dist/` folder contains `index.html`, `assets/` folder with CSS, JS, PNG
  - [ ] No TypeScript compilation errors
  - [ ] No Vite bundling warnings (chunk size warnings are expected and non-critical)

- ✅ **Git Status**
  - [ ] `git status` shows clean working tree
  - [ ] All changes committed to main branch
  - [ ] Latest commit message describes the deployment

- ✅ **Firebase Configuration**
  - [ ] `firebase.json` configured with `dist/` as public directory
  - [ ] `firebaseConfig.ts` contains valid Firebase credentials
  - [ ] Project ID: `genesis-protocol-bffc2`
  - [ ] Firestore rules in `firestore.rules` are up-to-date

- ✅ **Feature Verification**
  - [ ] Test dossier generation in dev mode (`npm start`)
  - [ ] Verify all 6 dossier tiers display correctly
  - [ ] Check Talent Class calculation (should map to Laggard/Average/Talented/Gifted/Genius)
  - [ ] Check Obsession Level calculation (should map to Lazy/Average/Locked-In/Relentless/Compulsive)
  - [ ] Verify codename generation produces Gen Z-appropriate names
  - [ ] Test visualizations (Singularity Plot, Radar Chart)

---

## Step-by-Step Deployment

### Step 1: Verify the Build
```bash
cd /Users/sylviaukanga/Desktop/Genesis-Protocol
npm run build
```

Check that:
- No errors appear
- `dist/` directory is created
- All asset files are present

### Step 2: Verify Firebase Authentication
```bash
firebase login
firebase projects:list
```

You should see `genesis-protocol-bffc2` in the list.

### Step 3: Deploy
```bash
firebase deploy --project genesis-protocol-bffc2
```

### Step 4: Verify Deployment
Once deployed, visit:
- **Primary URL**: https://genesis-protocol-bffc2.web.app
- **Alternative URL**: https://genesis-protocol-bffc2.firebaseapp.com

Test features:
1. Fill out the test form
2. View the classified dossier
3. Check all visualizations render correctly
4. Verify responsive design on mobile

---

## Rollback Procedure

If you need to rollback to a previous version:

```bash
# View previous deployments
firebase hosting:channels:list --project genesis-protocol-bffc2

# Rollback to a previous version (if available)
firebase hosting:versions:list --project genesis-protocol-bffc2
```

---

## Monitoring & Maintenance

### View Deployment History
```bash
firebase hosting:versions:list --project genesis-protocol-bffc2
```

### View Logs
```bash
firebase functions:log --project genesis-protocol-bffc2
```

### Re-deploy After Changes
```bash
git add .
git commit -m "Update: [description of changes]"
npm run build
firebase deploy --project genesis-protocol-bffc2
```

---

## Performance Metrics

**Build Statistics**:
- Bundle size: 1.94 MB (gzipped: 502 KB)
- Number of modules: 2,278
- Build time: ~2.88 seconds

**Optimization Notes**:
- JavaScript is minified and code-split by Vite
- CSS is processed through Tailwind and Autoprefixer
- Assets are cached for 1 year (immutable)
- HTML is set to no-cache for always serving latest version
- Gzip compression applied automatically by Firebase

---

## Feature Checklist (Live Deployment)

### ✅ Talent Class Calculation
- Population-aligned thresholds
- 16-substat calculation
- XP multiplier scaling (0.8x to 2.0x)
- Confidence metrics

### ✅ Obsession Level Calculation
- Population frequencies respected
- 11-substat calculation
- Psyche/Spirit synergy multiplier
- Adherence probability tracking

### ✅ HATI Calculation
- Weighted percentile across 6 attributes
- Transparent, deterministic
- Rank mapping (E → SS+)

### ✅ Codename Generation
- 4 aesthetic categories
- Interest-based signals
- Gen Z-appropriate names
- Earned-sounding codenames

### ✅ Classified Dossier
- 6-tier clinical structure
- All hardware diagnostics
- Growth vectors displayed
- Neural architecture visualizations
- Tactical intelligence included
- Signature feats (optional)

### ✅ Visualizations
- Singularity Plot (custom SVG)
- Comparative Radar Chart (Recharts)
- Metrics cards grid
- Feats grid with icons
- Interactive tooltips

---

## Troubleshooting

### Build Fails
```bash
rm -rf node_modules dist
npm install
npm run build
```

### Firebase Deploy Fails
```bash
firebase logout
firebase login
firebase deploy --project genesis-protocol-bffc2
```

### Features Not Showing
- Clear browser cache (Ctrl+Shift+Delete / Cmd+Shift+Delete)
- Hard refresh (Cmd+Shift+R on macOS)
- Check browser console for errors (F12)

---

## Support

For questions or issues:
1. Check `BIOMETRICS_AND_PROTOCOLS_GUIDE_FIXED.md` for calculation logic
2. Review `DOSSIER_CODENAME_UPGRADE.md` for codename generation
3. See `DOSSIER_VISUALIZATIONS_GUIDE.md` for visualization details
4. Check `DEPLOYMENT_STATUS.md` for current deployment status

---

## Deployment Confirmation

**Deployment Date**: [READY TO DEPLOY]  
**Deployed By**: [Your Name]  
**Live URL**: https://genesis-protocol-bffc2.web.app  
**Status**: ✅ Production Ready

**Command to Deploy**:
```bash
npm run build && firebase deploy --project genesis-protocol-bffc2
```

---

*Last Updated: January 19, 2026*
*All systems operational. Ready for production deployment.*
