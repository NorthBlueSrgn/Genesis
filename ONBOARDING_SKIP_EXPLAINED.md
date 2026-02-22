# Onboarding Skip - Users Bypass Screening Test

## Overview

When you create a new user account using the CLI tools (`scripts/create-user.cjs`, `scripts/create-user.js`, or `create-user.sh`), the user **automatically skips the onboarding flow and screening test**.

This means:
- ✅ Users go **directly to the dashboard** upon login
- ✅ No screening test is shown
- ✅ No onboarding prompts appear
- ✅ All stats are pre-calculated from baseline data
- ✅ The dossier is treated as already complete

## Why This Happens

### The Flow

1. **User Creation Script Runs**
   - Email, username, password are validated
   - Firebase Auth user is created
   - Baseline data is generated (default comprehensive baseline)

2. **Stats Are Pre-Calculated**
   - Physical, Vitality, Intelligence, Creativity, Spirit, and Psyche stats are all calculated
   - All substats are computed from the baseline
   - User is assigned rank "D" (Delta - Emerging) with XP: 1000

3. **`hasOnboarded` Flag is Set to `true`**
   - The user document is created with `hasOnboarded: true`
   - The gameState also has `hasOnboarded: true`
   - This tells the frontend: "This user has already completed onboarding"

### Code Evidence

In all creation scripts:

```javascript
// Users created with pre-filled baseline data skip onboarding
const hasOnboarded = true; // Always true since we're providing baseline data

const userStateData = {
  uid: { stringValue: uid },
  email: { stringValue: email },
  userName: { stringValue: username },
  createdAt: { timestampValue: now },
  hasOnboarded: { booleanValue: hasOnboarded },  // ← Set to true
  // ...
  gameState: {
    mapValue: {
      fields: {
        userName: { stringValue: username },
        hasOnboarded: { booleanValue: hasOnboarded },  // ← Also set to true
        // ...
      }
    }
  }
};
```

## Frontend Logic

In `App.tsx`:

```tsx
const AppRoutes: React.FC = () => {
    const { isLoggedIn, gameState } = useGameState();
    
    if (!isLoggedIn) return <LoginPage />;
    if (gameState && !gameState.hasOnboarded) return <OnboardingPage />;  // ← This check
    
    // If hasOnboarded is true, skip straight to dashboard
    return (
        <div className="flex h-screen overflow-hidden bg-[#010409] text-white">
            {/* Dashboard and main app */}
        </div>
    );
};
```

When `gameState.hasOnboarded` is `true`, the app **bypasses** the `<OnboardingPage />` component entirely.

## What Data is Pre-Filled

When a user is created, they get:

### Baseline Data (`abasProfile.screeningTestSummary`)
- **Physical**: Bench press (120 KG), squat (160 KG), deadlift (220 KG), sprint (13.6s)
- **Cognitive**: IQ estimate (120), reasoning percentile (86), pattern learning (85)
- **Vitality**: Sleep quality (82%), breath hold (65th percentile), diet (70th percentile)
- **Psychosocial**: Purpose (85th), empathy (80th), composure (75th), willpower (50th), charisma (58th)

### Calculated Stats
Based on the baseline:

| Stat | Value | Rank |
|------|-------|------|
| Physical | 71 | B |
| Vitality | 72 | B |
| Intelligence | 84 | A |
| Creativity | 71 | B |
| Spirit | 72 | B |
| Psyche | 67 | C |

## How to Force Onboarding

If you need a user to **go through onboarding again**, you can manually update their Firestore document:

### Using Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select `genesis-protocol-bffc2` project
3. Go to **Firestore Database**
4. Open the `userStates` collection
5. Find the user document (by UID or email)
6. Click **Edit** on the document
7. Set `hasOnboarded` to `false`
8. Also set `gameState.hasOnboarded` to `false`
9. Click **Update**

### Using Firebase CLI
```bash
firebase firestore:delete userStates/USER_UID/gameState --project=genesis-protocol-bffc2
# Then manually update hasOnboarded flag
```

## Special Case: Abas Account

The `bootstrapAbasAccount` Cloud Function endpoint also sets `hasOnboarded: true`:

```typescript
export const bootstrapAbasAccount = onRequest(
  { cors: true },
  async (req, res) => {
    const uid = 'bdZaaACPPcVUG2yoe11Wss2ZwNk1';
    const profileExport = {
      hasOnboarded: true,  // ← Explicitly set
      gameState: {
        hasOnboarded: true,  // ← Also set
        // Complete stats pre-filled
      }
    };
    // ...
  }
);
```

This ensures Abas always skips the screening test and onboarding.

## Summary

| Aspect | Before | After |
|--------|--------|-------|
| New users see screening test | ✅ Yes | ❌ No |
| New users see onboarding | ✅ Yes | ❌ No |
| New users go to dashboard | ❌ No | ✅ Yes |
| Stats are pre-calculated | ❌ No | ✅ Yes |
| `hasOnboarded` set to | `false` | **`true`** |

**All users created via CLI tools now skip onboarding and go directly to the dashboard with pre-filled stats.**

---

## For Questions

If you need to understand the complete flow:
- **Script**: `scripts/create-user.cjs` or `scripts/create-user.js`
- **Frontend routing**: `App.tsx` (lines 51)
- **State loading**: `GameStateContext.tsx` (line 226)
- **Firestore structure**: `USER_CREATION_GUIDE.md`
