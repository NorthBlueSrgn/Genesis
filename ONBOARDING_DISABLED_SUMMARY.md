# Onboarding System - Fully Disabled

## Date: January 29, 2026

## Summary
The entire onboarding/screening test flow has been completely disabled. Users now skip directly to the main application upon login.

---

## Changes Made

### 1. **Removed Dilemma Screening Step**
   - **File**: `data/calibrationData.ts`
   - **Change**: Removed the `dilemma-screening` step from `CALIBRATION_BENCHMARKS` array
   - **Impact**: No dilemma screening test in onboarding flow

### 2. **Removed DilemmaScreening Component**
   - **File**: `pages/OnboardingPage.tsx`
   - **Changes**:
     - Deleted entire `DilemmaScreening` React component
     - Removed step from onboarding steps array
     - Removed rendering logic from switch statement
   - **Impact**: Component no longer exists in codebase

### 3. **Updated Scoring Service**
   - **File**: `services/scoringService.ts`
   - **Changes**:
     - Removed references to `dilemma-screening` input data
     - Removed `spiritDilemmas` property usage
     - Updated stat calculations:
       - **Purpose**: Now calculated only from narrative clarity (was: narrative + dilemma consistency)
       - **Empathy**: Now calculated only from social confidence (was: social confidence + dilemma choices)
       - **Conviction**: Now calculated only from conflict resolution (was: conflict resolution + dilemma consistency)
   - **Impact**: Spirit substats now calculated without dilemma test data

### 4. **Disabled Onboarding Flow in App**
   - **File**: `App.tsx` (Line 51-52)
   - **Change**: Commented out the onboarding check
   ```tsx
   // SCREENING TEST DISABLED - Skip onboarding check
   // if (gameState && !gameState.hasOnboarded) return <OnboardingPage />;
   ```
   - **Impact**: Users never redirected to onboarding page

### 5. **Force hasOnboarded to True**
   - **File**: `contexts/GameStateContext.tsx`
   - **Changes**:
     - Line 80: Set default `hasOnboarded: true` (was: `false`)
     - Line 129-131: Added migration to force `hasOnboarded = true` for all users
     - Line 226: `seedInitialState` sets `hasOnboarded: true`
   - **Impact**: 
     - New users start with `hasOnboarded: true`
     - Existing users with `hasOnboarded: false` get automatically migrated to `true`
     - All users bypass onboarding completely

---

## User Flow Impact

### Before:
1. User logs in → Check `hasOnboarded`
2. If `hasOnboarded === false` → Redirect to OnboardingPage
3. User completes screening tests (including dilemma screening)
4. Stats calculated from test results
5. `hasOnboarded` set to `true`
6. User proceeds to main app

### After:
1. User logs in → `hasOnboarded` automatically `true`
2. User goes directly to Dashboard
3. No screening tests shown
4. Stats initialized from default/baseline data or existing profile
5. Full app access immediately

---

## Files Modified
1. ✅ `data/calibrationData.ts` - Removed dilemma-screening step
2. ✅ `pages/OnboardingPage.tsx` - Removed DilemmaScreening component
3. ✅ `services/scoringService.ts` - Removed dilemma test logic
4. ✅ `App.tsx` - Commented out onboarding check
5. ✅ `contexts/GameStateContext.tsx` - Force hasOnboarded to true

---

## Verification

### No Compilation Errors ✅
- All modified files compile successfully
- No TypeScript errors
- No missing imports or undefined references

### No References to Removed Code ✅
- No references to `dilemma-screening` in TypeScript/React files
- No references to `spiritDilemmas` in codebase
- Documentation references only (historical, non-functional)

### User Experience ✅
- New users: Skip directly to app with default stats
- Existing users: Automatically marked as onboarded
- No broken flows or infinite redirects

---

## How to Re-enable (If Needed)

If you need to re-enable onboarding in the future:

1. **Uncomment the check in App.tsx**:
   ```tsx
   if (gameState && !gameState.hasOnboarded) return <OnboardingPage />;
   ```

2. **Restore hasOnboarded defaults in GameStateContext.tsx**:
   - Line 80: Change `hasOnboarded: true` → `hasOnboarded: false`
   - Line 129-131: Remove the forced migration
   - Line 226: Keep as `hasOnboarded: true` (only for seeded states)

3. **Restore DilemmaScreening** (if needed):
   - Re-add step to `calibrationData.ts`
   - Re-implement component in `OnboardingPage.tsx`
   - Re-add scoring logic in `scoringService.ts`

---

## Notes

- The onboarding flow still exists in code but is never triggered
- `OnboardingPage.tsx` component is still functional (minus DilemmaScreening)
- Backend screening test initialization logic remains intact for master users
- This is a front-end bypass - backend still supports screening data structures

---

## Testing Recommendations

1. ✅ Test new user registration → Should go straight to dashboard
2. ✅ Test existing user login → Should bypass onboarding
3. ✅ Verify stats calculation works without dilemma data
4. ✅ Check no console errors on app load
5. ✅ Verify dashboard loads correctly for all user types

---

**Status**: ✅ COMPLETE - Onboarding fully disabled, all users skip to main app
