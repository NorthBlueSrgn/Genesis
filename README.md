# Genesis Protocol v1.0

## 🎯 DEPLOYMENT COMPLETE ✅

**Status**: Live in Production  
**Live URL**: https://genesis-protocol-bffc2.web.app  
**Date**: January 19, 2026

All features are now live and operational. Visit the link above to start your assessment!

---

## � DOCUMENTATION

### Main Guides
- **[Biometrics & Protocols Guide](BIOMETRICS_AND_PROTOCOLS_GUIDE_FIXED.md)** - Complete calculation methodology
- **[Codename System](DOSSIER_CODENAME_UPGRADE.md)** - How codenames are generated
- **[Visualizations Guide](DOSSIER_VISUALIZATIONS_GUIDE.md)** - Visual system specifications
- **[Deployment Guide](DEPLOYMENT_GUIDE_FINAL.md)** - How to deploy

### Status Reports
- **[Final Deployment Summary](FINAL_DEPLOYMENT_SUMMARY.md)** - Deployment overview
- **[Deployment Status](DEPLOYMENT_STATUS_FINAL.md)** - Current status
- **[Production Readiness Report](PRODUCTION_READINESS_REPORT.md)** - Technical verification

---

## 🚀 Live Features

✅ **Talent Class Calculation** - 5-tier system based on 16 substats  
✅ **Obsession Level** - 5-tier psychological adherence measurement  
✅ **HATI Threat Index** - Your power level relative to humanity  
✅ **Codename Generation** - Gen Z-appropriate, earned-sounding names  
✅ **Classified Dossier** - 6-tier clinical asset evaluation  
✅ **Visualizations** - Singularity Plot & Comparative Radar Chart  

---

## 🛠 Developer Setup (Local Development)

1. **Install Node.js**: Download the LTS version from [nodejs.org](https://nodejs.org/).
2. **Download VS Code**: Use this to edit your files.
3. **Download Project**: Create a folder and put all the project files inside.
4. **Environment Setup**:
   - Create a file named `.env` in the root folder.
   - Add `API_KEY=your_gemini_key` to that file.
5. **Firebase Setup**:
   - Create a project at [console.firebase.google.com](https://console.firebase.google.com).
   - Enable **Authentication** (Email/Pass) and **Firestore**.
   - Copy your config into `firebaseConfig.ts`.

## 🚀 How to Run Locally
In your terminal/command prompt:
```bash
# Install everything
npm install

# Start local test mode
npm start

# Build for production
npm run build

# Deploy to Firebase
firebase login
firebase deploy --project genesis-protocol-bffc2
```
