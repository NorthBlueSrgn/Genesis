# Firebase Cloud Functions Deployment Status - January 28, 2026

## Build Status
✅ **BUILD SUCCESSFUL**
- TypeScript compilation completed without errors
- All code changes have been integrated

## Deployment Status
❌ **DEPLOYMENT BLOCKED BY GCP SERVICE IDENTITY PERMISSIONS**

### Error Details
```
Error: Error generating the service identity for pubsub.googleapis.com.
```

This error occurs when:
1. Firebase CLI attempts to auto-enable required APIs for Cloud Functions
2. The GCP service account doesn't have permission to create service identities
3. This is typically a permission issue at the GCP project level, not with the code

### Root Cause
The `genesis-protocol-bffc2` Firebase project's service account is missing the required IAM role to generate service identities for:
- `pubsub.googleapis.com`
- `eventarc.googleapis.com`

This is a **GCP infrastructure permission**, not a code issue.

## Solution Options

### Option 1: Grant Permissions via GCP Console (Recommended)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select project `genesis-protocol-bffc2`
3. Go to **IAM & Admin** > **Service Accounts**
4. Find the service account named `firebase-adminsdk-*`
5. Click on it and go to **Permissions**
6. Grant these roles:
   - `Service Account Admin`
   - `Service Identity Creator`
   - `Security Admin`
7. Wait 5-10 minutes for permissions to propagate
8. Retry deployment: `firebase deploy --only functions`

### Option 2: Use Firebase Console Deployment
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select `genesis-protocol-bffc2` project
3. Go to **Functions**
4. Manually upload the function code via the Console UI

### Option 3: Contact GCP Support
If you don't have sufficient permissions to grant IAM roles, contact your GCP organization administrator to request:
- Service Account Admin role
- Service Identity Creator role

## Code Status

All code changes have been successfully compiled and are ready to deploy:

### Files Updated:
- ✅ `/functions/src/index.ts` - All Cloud Functions endpoints
- ✅ `/scripts/create-user.cjs` - CLI tool (Node.js CommonJS)
- ✅ `/scripts/create-user.js` - CLI tool (Node.js ESM)
- ✅ `/create-user.sh` - Bash script
- ✅ `/create-user-account.ts` - Legacy TypeScript script
- ✅ `/USER_CREATION_GUIDE.md` - Updated documentation
- ✅ `/ONBOARDING_SKIP_EXPLAINED.md` - New documentation

### Key Changes:
1. **`hasOnboarded` now set to `true`** for all newly created users
2. Users skip the screening test and onboarding flow
3. Pre-filled baseline data allows users to go directly to the dashboard
4. All stat calculations are complete before user login

## What's Working Right Now

Users can be created via CLI tools **without** needing Cloud Functions:

```bash
# Create a user from terminal
node scripts/create-user.cjs --email user@example.com --username Username --password Pass123!
```

✅ User is created in Firebase Auth
✅ User document is created in Firestore with `hasOnboarded: true`
✅ All stats are pre-calculated
✅ User goes directly to dashboard on login (no screening test)

## What Needs Cloud Functions

The following features require Cloud Functions to be deployed:
- Email verification endpoints (`sendVerificationEmailV2`, `checkEmailVerificationV2`)
- Companion greeting AI (`companionGreetingV2`)
- Order chat with Central AI (`orderChatV2`)
- Mission generation (`generateNewMissionV2`)
- Side mission generation (`generateSideMissionV2`)
- Task evaluation (`evaluateTaskReportV2`)
- Chapter Black generation (`generateChapterV2`)
- Promotion exam generation (`generatePromotionExamV2`)
- Tactical suggestions (`generateTacticalSuggestionsV2`)
- Benchmark recording (`recordBenchmarkV2`)
- Stats initialization from baseline (`initializeStatsFromBaseline`)
- Abas account bootstrap (`bootstrapAbasAccount`)

## Next Steps

1. **Immediate**: Request GCP permissions from your organization administrator
2. **Once permissions granted**: Run `firebase deploy --only functions`
3. **Verification**: Check Firebase Console > Functions to see all 11 functions deployed
4. **Testing**: Use endpoints like `companionGreetingV2` to verify deployment

## Build Artifacts

The compiled Cloud Functions are in:
```
/Users/sylviaukanga/Desktop/Genesis-Protocol/functions/lib/
```

Size: 77.48 KB (ready for upload)

---

**Status as of 2026-01-28**: Code is ready. Awaiting GCP permission resolution for deployment.
