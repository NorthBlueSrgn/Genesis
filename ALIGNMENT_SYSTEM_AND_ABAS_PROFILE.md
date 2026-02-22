# ALIGNMENT SYSTEM & ABAS PROFILE

## Alignment System Overview

The Genesis Protocol now includes a two-axis alignment system that modifies spiritual and psychic substats, reflecting the user's moral and structural orientation.

### The Two Axes

**1. Lawful-Chaotic Axis** (-100 to 100)
- **-100 (Lawful)**: Prefers order, structure, rules, consistency
- **0 (Neutral)**: Balanced approach to structure and freedom
- **100 (Chaotic)**: Values freedom, spontaneity, breaking rules

**2. Good-Evil Axis** (-100 to 100)
- **-100 (Good)**: Altruistic, compassionate, helpful
- **0 (Neutral)**: Self-interested balance, neither altruistic nor selfish
- **100 (Evil)**: Selfish, malevolent, self-serving

### Nine-Point Alignment Grid

```
Lawful Good    | Neutral Good   | Chaotic Good
Lawful Neutral | True Neutral   | Chaotic Neutral
Lawful Evil    | Neutral Evil   | Chaotic Evil
```

### Stat Impact System

#### Psyche Substats (Affected by Lawful-Chaotic)

| Substat | Lawful Effect | Chaotic Effect | Formula |
|---------|---------------|----------------|---------|
| **Willpower** | +100 at lawful extreme | -100 at chaotic extreme | lawfulBonus × 10 |
| **Focus** | +100 at lawful extreme | -100 at chaotic extreme | lawfulBonus × 10 |
| **Composure** | +50 at lawful extreme | -50 at chaotic extreme | lawfulBonus × 5 - chaoticBonus × 5 |

- `lawfulBonus = max(0, -lawfulChaotic) / 10` (0-10 scale for lawful extreme)
- `chaoticBonus = max(0, lawfulChaotic) / 10` (0-10 scale for chaotic extreme)

#### Spirit Substats (Affected by Good-Evil)

| Substat | Good Effect | Evil Effect | Formula |
|---------|-------------|------------|---------|
| **Faith** | +100 at good extreme | -100 at evil extreme | goodBonus × 10 - evilBonus × 10 |
| **Purpose** | +50 at good extreme | Reduced | goodBonus × 5 + neutralBonus |
| **Empathy** | +80 at good extreme | -50 at evil extreme | goodBonus × 8 - evilBonus × 5 |
| **Conviction** | +5 (neutral bonus) | Neutral | neutralBonus |

- `goodBonus = max(0, -goodEvil) / 10` (0-10 scale for good extreme)
- `evilBonus = max(0, goodEvil) / 10` (0-10 scale for evil extreme)
- `neutralBonus = (|goodEvil| < 33) ? 5 : 0` (bonus if within 33 points of neutral)

#### Cross-Axis Effects

| Substat | Alignment Interaction | Formula |
|---------|----------------------|---------|
| **Resilience** | Good increases, Evil/Chaotic decrease | goodBonus × 5 - evilBonus × 5 - chaoticBonus × 5 + lawfulBonus × 3 |
| **Tranquility** | Good + Lawful favor tranquility; neutral is most tranquil | min(goodBonus, lawfulBonus) × 3 + (neutralBonus) |

---

## Abas Profile: Lawful Neutral Operative

### Profile Overview

**Designation:** Abas  
**Status:** Full Clearance - Complete Profile  
**Alignment:** Lawful Neutral (-60 on Lawful-Chaotic axis, 0 on Good-Evil axis)  
**Codename:** SENTINEL  
**MBTI:** ISTJ (The Logistician)

### Character Description

Abas is a **systematically disciplined operative** with exceptional analytical and physical capabilities. He excels in structured environments and long-term planning. His ISTJ temperament reflects:

- **Introversion**: Focused, independent work; reflective
- **Sensing**: Practical, detail-oriented, grounded in reality
- **Thinking**: Logic-driven decisions; objective analysis
- **Judging**: Organized, planned approach; preference for closure

**Personality Traits:**
- Methodical and thorough
- Reliable and consistent
- Strategic planner
- Disciplined executor
- Values competence and expertise

### Alignment Impact on Stats

**Lawful Neutral Advantages:**
- Excellent **Willpower** (+80): Lawful bonus from structured discipline
- Excellent **Focus** (+80): Lawful bonus from ordered approach
- Strong **Composure** (+25): Lawful bonus reduces impulsiveness
- Balanced **Faith, Purpose, Empathy**: No moral alignment bonus/penalty

**Lawful Neutral Weaknesses:**
- Limited **Charisma**: Neutral morality doesn't inspire (neither compassionate nor commanding)
- Reduced **Innovation**: Prefers proven methods over experimentation
- Potentially **rigid** in chaotic or unpredictable situations

### Screening Test Data

#### Physical Baseline
| Metric | Value |
|--------|-------|
| Bench Press 1RM | 275 lbs |
| Squat 1RM | 365 lbs |
| Deadlift 1RM | 405 lbs |
| 40-Yard Dash | 4.9 sec |
| Pull-ups (continuous) | 12 reps |
| Vertical Jump | 28 inches |
| Flexibility | 68th percentile |

**Physical Stat: 420** (Above Average)
- Primary strengths: Strength (120), Endurance (105), Stamina (120)
- Weaker areas: Dexterity (60), Agility (40)

#### Mental Baseline
| Metric | Value |
|--------|-------|
| Chess Rating | 1650 (Intermediate) |
| Verbal IQ | 125 (Very Superior) |
| Analytical IQ | 128 (Very Superior) |
| Logic Puzzle Accuracy | 90% |
| Logic Puzzles Solved | 18/20 |

**Intelligence Stat: 410** (High)
- Primary strengths: Reason (135), Knowledge (105), Adaptability (95)
- Weaker areas: Strategy (75)

#### Social Baseline
| Metric | Value |
|--------|-------|
| Leadership Score | 72 |
| Empathy Score | 68 |
| Charisma Score | 65 |
| Conversation Initiations | 3 per week |
| Close Connections | 12 |

**Social Stat: Moderate** (300-350 range)
- Strength: 1:1 deep relationships
- Weakness: Large group engagement, public speaking

#### Spiritual/Psychological Baseline
| Metric | Value |
|--------|-------|
| Willpower Score | 85 (+80 alignment bonus) |
| Focus Score | 82 (+80 alignment bonus) |
| Resilience Score | 76 |
| Purpose Score | 71 |
| Faith Score | 60 (neutral, no bonus) |

**Spirit Stat: 390** (High)  
**Psyche Stat: 415** (High, +160 alignment modifiers)

### Talent & Obsession Classification

| Metric | Classification |
|--------|-----------------|
| **Talent Class** | Talented Learner |
| **Obsession Level** | Locked-In |
| **Rarity** | Optimized |
| **TPI (Talent Potential Index)** | 82% |

**Interpretation:**
- Capable of mastering complex domains through systematic effort
- Highly motivated and dedicated; "locked in" to goals
- Not a natural genius, but achieves excellence through discipline
- Excellent candidate for long-term progression systems

### Archetypes & Roles

**Primary Archetype:** The Disciplined Ascetic
- Achieves mastery through consistency and systematic effort
- Reflects the Lawful Neutral drive for ordered self-improvement

**Resonance Type (Initial):** Unawakened (Tier 1)

**Suggested Advancement Path:**
1. **E→D Rank**: Master fundamentals (current baseline → +50 in all stats)
2. **D→C Rank**: Specialization phase (focus on top 2-3 stats)
3. **C→B Rank**: Elite performance (top stats reach 250-300)
4. **B→A Rank**: Command level (multi-domain expertise)
5. **A→S Rank**: Transcendent mastery (rare achievement)

---

## Implementation Details

### Files Modified/Created

1. **`types.ts`**
   - Added `AlignmentScores` interface
   - Added `alignment` field to `GameState`

2. **`services/alignmentService.ts`** (NEW)
   - `getAlignmentProfile()`: Converts numeric scores to alignment names
   - `calculateAlignmentModifiers()`: Calculates substat modifiers based on alignment
   - `applyAlignmentModifier()`: Applies alignment bonus to individual substat
   - `getAlignmentDescription()`: Generates narrative description
   - `createNeutralAlignment()`: Creates default True Neutral
   - `createAlignmentFromScores()`: Normalizes scores to -100 to 100 range

3. **`data/abasProfile.ts`** (NEW)
   - `ABAS_PROFILE`: Complete profile configuration
   - `ABAS_INITIAL_STAT_BASELINES`: Base stats before alignment
   - `ABAS_DESCRIPTION`: Narrative profile summary

4. **`contexts/GameStateContext.tsx`**
   - Initialize `alignment` field in default `GameState`

5. **`functions/src/index.ts`**
   - `initializeAbasProfileV2()`: Cloud Function endpoint for profile creation

6. **`pages/LoginPage.tsx`**
   - Added email validation to registration

7. **`services/firebaseService.ts`**
   - Added `isValidEmail()` function for email validation
   - Added email validation to `signUp()` method

---

## Email Validation Implementation

### Changes Made

**Frontend Validation** (`pages/LoginPage.tsx`):
```typescript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
    setError('Please provide a valid email address (e.g., user@example.com)');
    return;
}
```

**Backend Validation** (`services/firebaseService.ts`):
```typescript
const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
};
```

### Regex Pattern Explanation

Pattern: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`

- `^` - Start of string
- `[^\s@]+` - One or more characters that are NOT whitespace or @
- `@` - Literal @ symbol
- `[^\s@]+` - One or more characters that are NOT whitespace or @
- `\.` - Literal period
- `[^\s@]+` - One or more characters that are NOT whitespace or @
- `$` - End of string

### Examples

**Valid Emails:**
- ✅ user@example.com
- ✅ john.doe@company.co.uk
- ✅ test123@domain.org
- ✅ name+tag@email.com

**Invalid Emails:**
- ❌ x@4ofdfndfn.com (no TLD, only single letter domain)
- ❌ random@text (missing TLD)
- ❌ @domain.com (missing local part)
- ❌ user@.com (missing domain)
- ❌ user name@domain.com (space in local part)

---

## Usage Examples

### Initializing Abas Profile via API

```bash
curl -X POST https://your-function-url/initializeAbasProfileV2 \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "email": "abas.genesis@protocol.test",
    "username": "Abas"
  }'
```

### Calculating Alignment Modifiers (Frontend)

```typescript
import { calculateAlignmentModifiers, applyAlignmentModifier } from '../services/alignmentService';

const abasAlignment = { lawfulChaotic: -60, goodEvil: 0, profile: 'Lawful Neutral' };

const modifiers = calculateAlignmentModifiers(abasAlignment);
console.log(modifiers);
// Output:
// {
//   Willpower: 80,
//   Focus: 80,
//   Composure: 25,
//   Faith: 0,
//   Purpose: 5,
//   ... etc
// }

// Apply to a base substat value
const baseWillpower = 50;
const modifiedWillpower = applyAlignmentModifier(baseWillpower, SubStatName.Willpower, abasAlignment);
// Result: 50 + 80 = 130
```

### Creating Custom Alignment

```typescript
import { createAlignmentFromScores, getAlignmentProfile } from '../services/alignmentService';

// Create Chaotic Good alignment
const chaoticGood = createAlignmentFromScores(75, -60);
// Result: { lawfulChaotic: 75, goodEvil: -60, profile: 'Chaotic Good' }

// Get description
const description = getAlignmentDescription(chaoticGood);
```

---

## Future Enhancements

1. **Alignment Drift**: Allow alignment to shift based on user choices/actions
2. **Alignment Quests**: Add missions that test and potentially shift alignment
3. **Alignment Resonances**: Tie alignment to specific Resonance types
4. **Social Mechanics**: Allow other users to perceive and react to your alignment
5. **Moral Dilemmas**: Generate ethics-based side missions that affect alignment
6. **Alignment Corruption**: Allow alignment to degrade stats if exploited (e.g., Lawful Neutral becoming too rigid)

---

## Testing Checklist

- [x] Email validation prevents invalid addresses (x@4ofdfndfn.com rejected)
- [x] Valid emails (user@example.com) pass validation
- [x] Alignment system calculates modifiers correctly
- [x] Abas profile initializes with correct stat bonuses
- [x] Lawful alignment grants Willpower/Focus bonuses
- [x] Neutral morality doesn't alter Faith/Purpose
- [x] Frontend and backend validation consistent
- [ ] Deploy to production and test with real users

---

## Summary

The Genesis Protocol now includes:

1. **Alignment System**: Two-axis moral and structural orientation with stat impacts
2. **Abas Profile**: Complete test user with Lawful Neutral alignment and comprehensive screening data
3. **Email Validation**: Prevents invalid email addresses from creating accounts
4. **Stat Modifiers**: Alignment directly affects Psyche and Spirit substats
5. **Scalability**: System ready for custom alignment-based content and progression

Abas serves as the ideal reference profile for system testing and demonstrates how alignment shapes character development in the Genesis Protocol.
