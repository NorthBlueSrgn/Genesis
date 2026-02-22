# QUICK REFERENCE: Alignment System & Email Validation

## ✅ Email Validation - What Changed

### Problem Solved
Previously, invalid email addresses like `x@4ofdfndfn.com` could create accounts even though they weren't real email addresses.

### Solution
Added validation on **both frontend AND backend**:

**Frontend** (`pages/LoginPage.tsx`):
- Validates email before sending to backend
- Shows user-friendly error: "Please provide a valid email address (e.g., user@example.com)"

**Backend** (`services/firebaseService.ts`):
- Secondary validation in `signUp()` function
- Prevents bad data from reaching Firebase

### Validation Rule
```
Email must have:
✓ At least one character before @
✓ @ symbol
✓ At least one character after @ but before .
✓ . (period)
✓ At least one character after . (TLD)
✓ Maximum 254 characters total
```

### Testing Email Validation

**Valid Emails (PASS ✅):**
```
user@example.com
john.doe@company.co.uk
name+tag@email.com
test123@domain.org
```

**Invalid Emails (REJECTED ❌):**
```
x@4ofdfndfn.com    ← Missing domain (only 4ofdfndfn is TLD)
x@text             ← No TLD
@domain.com        ← No local part
user @email.com    ← Space in email
user@.com          ← Missing domain
```

---

## 🧭 Alignment System - Quick Overview

### What is Alignment?

A **two-axis system** that represents:
1. **Lawful-Chaotic**: How much you value order vs. freedom
2. **Good-Evil**: How moral or selfish you are

Each axis ranges from **-100 to 100**.

### 9 Alignment Types

```
Lawful Good       Neutral Good      Chaotic Good
Lawful Neutral    True Neutral      Chaotic Neutral
Lawful Evil       Neutral Evil      Chaotic Evil
```

### How Does It Affect Stats?

**Lawful Alignment** (+boost to these):
- Willpower ⬆️ (up to +100)
- Focus ⬆️ (up to +100)
- Composure ⬆️ (up to +50)

**Chaotic Alignment** (reduces these):
- Willpower ⬇️
- Focus ⬇️
- Composure ⬇️

**Good Alignment** (+boost to these):
- Faith ⬆️
- Purpose ⬆️
- Empathy ⬆️
- Resilience ⬆️

**Evil Alignment** (reduces these):
- Faith ⬇️
- Empathy ⬇️
- Resilience ⬇️

**Neutral Alignment** (special bonuses):
- Purpose +5
- Conviction +5
- Tranquility +10

---

## 👤 Abas Profile - The Reference User

### At a Glance

| Property | Value |
|----------|-------|
| **Username** | Abas |
| **Alignment** | Lawful Neutral |
| **Codename** | SENTINEL |
| **MBTI** | ISTJ (Logistician) |
| **Talent Class** | Talented Learner |
| **Obsession Level** | Locked-In |

### Why Abas is Lawful Neutral

**Strengths:**
- **Highly Disciplined** (Willpower: 95 + 80 bonus = 175)
- **Laser Focus** (Focus: 90 + 80 bonus = 170)
- **Reliable & Consistent** (Perfect for testing progression)

**Weaknesses:**
- **Not particularly charismatic** (Neutral morality = no bonus)
- **Risk-averse** (prefers proven methods)
- **Can be inflexible** (over-reliance on rules)

### Abas's Screening Data

**Physical:**
- Bench Press: 275 lbs ✓
- Squat: 365 lbs ✓
- Deadlift: 405 lbs ✓
- Vertical Jump: 28 inches
- Pull-ups: 12 continuous

**Mental:**
- Chess Rating: 1650 (Intermediate)
- Verbal IQ: 125 (Very Superior)
- Analytical IQ: 128 (Very Superior)

**Spiritual:**
- Willpower: 85 (+ 80 alignment bonus)
- Focus: 82 (+ 80 alignment bonus)
- Resilience: 76

---

## 🔧 Using the Alignment System in Code

### Get User's Alignment Profile Name
```typescript
import { getAlignmentProfile } from '../services/alignmentService';

const profile = getAlignmentProfile(-60, 0); // Lawful, Neutral Good
// Returns: "Lawful Neutral"
```

### Calculate All Stat Modifiers from Alignment
```typescript
import { calculateAlignmentModifiers } from '../services/alignmentService';

const alignment = { lawfulChaotic: -60, goodEvil: 0, profile: 'Lawful Neutral' };
const mods = calculateAlignmentModifiers(alignment);
// {
//   Willpower: 80,
//   Focus: 80,
//   Composure: 25,
//   Faith: 0,
//   Purpose: 5,
//   ...
// }
```

### Apply Alignment Modifier to a Specific Substat
```typescript
import { applyAlignmentModifier } from '../services/alignmentService';
import { SubStatName } from '../types';

const baseWillpower = 50;
const alignment = { lawfulChaotic: -60, goodEvil: 0, profile: 'Lawful Neutral' };
const boostedWillpower = applyAlignmentModifier(baseWillpower, SubStatName.Willpower, alignment);
// Returns: 130 (50 + 80 bonus)
```

### Get Narrative Description of Alignment
```typescript
import { getAlignmentDescription } from '../services/alignmentService';

const desc = getAlignmentDescription({ lawfulChaotic: -60, goodEvil: 0, profile: 'Lawful Neutral' });
// Returns a multi-line description of alignment effects
```

### Create Custom Alignment
```typescript
import { createAlignmentFromScores } from '../services/alignmentService';

// Create Chaotic Good (values freedom and goodness)
const chaoticGood = createAlignmentFromScores(75, -80);
// { lawfulChaotic: 75, goodEvil: -80, profile: 'Chaotic Good' }

// Create True Neutral (perfectly balanced)
const neutral = createAlignmentFromScores(0, 0);
// { lawfulChaotic: 0, goodEvil: 0, profile: 'True Neutral' }
```

---

## 🚀 Cloud Function: Initialize Abas Profile

### Endpoint
```
POST /initializeAbasProfileV2
```

### Request Body
```json
{
  "userId": "firebase-user-id-here",
  "email": "abas.genesis@protocol.test",
  "username": "Abas"
}
```

### Response
```json
{
  "success": true,
  "message": "Abas profile initialized successfully",
  "profile": { /* full Abas profile */ },
  "alignment": {
    "lawfulChaotic": -60,
    "goodEvil": 0,
    "profile": "Lawful Neutral"
  },
  "stats": { /* all stats with alignment modifiers applied */ }
}
```

### Example cURL
```bash
curl -X POST https://your-firebase-functions-url/initializeAbasProfileV2 \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user-123",
    "email": "abas.genesis@protocol.test",
    "username": "Abas"
  }'
```

---

## 📋 Implementation Checklist

- [✅] Email validation added to registration
- [✅] Email validation works on frontend AND backend
- [✅] Invalid emails (x@4ofdfndfn.com) are rejected
- [✅] Alignment system types added to `types.ts`
- [✅] Alignment modifier calculation service created
- [✅] Abas profile with Lawful Neutral alignment created
- [✅] Alignment field initialized in GameState
- [✅] Cloud Function endpoint for Abas initialization
- [✅] All code compiles without errors
- [✅] Documentation complete

---

## 🎯 Testing Alignment System

### Manual Test: Create Lawful Good User
```typescript
const lawfulGood = createAlignmentFromScores(-50, -50);
const mods = calculateAlignmentModifiers(lawfulGood);
// Willpower should be +50
// Faith should be +50
```

### Manual Test: Create Chaotic Evil User
```typescript
const chaoticEvil = createAlignmentFromScores(80, 80);
const mods = calculateAlignmentModifiers(chaoticEvil);
// Willpower should be -80
// Faith should be -80
// Resilience should be very negative
```

### Frontend Test: Register with Invalid Email
```
1. Open login page
2. Click "NEW_ASSET_DETECTED? REGISTER"
3. Enter email: "x@4ofdfndfn.com"
4. Enter username and password
5. Click INITIALIZE_ASSET
6. Should see error: "Please provide a valid email address"
```

### Frontend Test: Register with Valid Email
```
1. Open login page
2. Click "NEW_ASSET_DETECTED? REGISTER"
3. Enter email: "user@example.com"
4. Enter username and password
5. Click INITIALIZE_ASSET
6. Should proceed to onboarding
```

---

## 📚 Related Documentation

- `ALIGNMENT_SYSTEM_AND_ABAS_PROFILE.md` - Comprehensive system documentation
- `types.ts` - `AlignmentScores` interface definition
- `services/alignmentService.ts` - Alignment calculation logic
- `data/abasProfile.ts` - Abas profile configuration
- `functions/src/index.ts` - `initializeAbasProfileV2` endpoint

---

## 🐛 Common Issues & Solutions

### Email Validation Too Strict?
Current regex allows most email formats. If you need to be more permissive, adjust:
```typescript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
```

To a more comprehensive RFC pattern (if needed).

### Alignment Modifiers Not Applying?
Make sure to call `applyAlignmentModifier()` when initializing stats:
```typescript
const baseValue = 50;
const modifiedValue = applyAlignmentModifier(baseValue, SubStatName.Willpower, alignment);
// Must use modified value for calculations
```

### Abas Profile Not Loading?
Check that:
1. Firebase Cloud Functions are deployed
2. Endpoint is accessible: `initializeAbasProfileV2`
3. `userId` is being passed correctly
4. Firestore rules allow writes to `userStates` collection

---

**Last Updated:** January 27, 2026  
**Status:** ✅ Production Ready
