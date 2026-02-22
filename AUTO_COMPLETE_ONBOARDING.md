# Auto-Complete Onboarding with Predetermined Stats

## What This Does
Automatically completes the onboarding/screening test for ALL new users with predetermined Abas stats, so they never see the screening test.

## Implementation Plan

### Option 1: Modify GameStateContext (Simplest)
When a new user signs up, automatically seed their account with the Abas profile stats from `abas-profile-export.json`.

### Option 2: Create Auto-Seed Service
Create a service that runs on first login and automatically completes the onboarding with predetermined values.

### Option 3: Remove OnboardingPage Entirely
Since onboarding is already disabled, we can go further and auto-generate stats for new users.

## Recommended Approach: Auto-Seed on Signup

I'll modify the signup flow to automatically create the user with complete stats, so they never see any test screens.

### Steps:
1. ✅ OnboardingPage already bypassed (commented out in App.tsx)
2. ✅ `hasOnboarded` already forced to `true` 
3. **NEW**: Auto-generate stats for new users based on Abas profile
4. **NEW**: Skip all screening components

## Implementation

I'll modify `contexts/GameStateContext.tsx` to automatically initialize new users with your predetermined stats.

---

**Status:** In Progress
**Target:** All new users get Abas-level stats automatically
