# Classified Dossier: Alignment Integration Guide

## Overview

The Classified Dossier displays profile data that includes alignment-based stat adjustments. The dossier presents this information through the **Psychometric Profile** and **Resonance Signature** sections, which reflect the user's Lawful-Chaotic and Good-Evil alignment axes.

---

## Alignment System Integration

### Data Source: AlignmentScores

From `types.ts`:
```typescript
export interface AlignmentScores {
    lawfulChaotic: number;     // -100 (Lawful) to 100 (Chaotic)
    goodEvil: number;          // -100 (Good) to 100 (Evil)
    profile: string;           // e.g., "Lawful Neutral", "Chaotic Good"
}
```

### Alignment Profiles

The 9 possible alignments are displayed in the dossier as part of the overall personality assessment:

| Profile | Lawful-Chaotic | Good-Evil | Characteristics |
|---------|---------------|-----------|-----------------|
| Lawful Good | -100 to -51 | -100 to -51 | Disciplined hero, principled |
| Lawful Neutral | -100 to -51 | -50 to 50 | Systematic, rule-bound, pragmatic |
| Lawful Evil | -100 to -51 | 51 to 100 | Authoritarian, domineering |
| Neutral Good | -50 to 50 | -100 to -51 | Compassionate, helpful, flexible |
| True Neutral | -50 to 50 | -50 to 50 | Balanced, independent, adaptive |
| Neutral Evil | -50 to 50 | 51 to 100 | Selfish, exploitative, pragmatic |
| Chaotic Good | 51 to 100 | -100 to -51 | Rebellious, freedom-loving, heroic |
| Chaotic Neutral | 51 to 100 | -50 to 50 | Unpredictable, independent, wild |
| Chaotic Evil | 51 to 100 | 51 to 100 | Destructive, unrestrained, cruel |

---

## Abas Profile Example: Lawful Neutral

**Location**: `data/abasProfile.ts`

### Alignment Configuration
```typescript
alignment: {
    lawfulChaotic: -60,        // Lawful (toward order and structure)
    goodEvil: 0,               // Neutral (neither altruistic nor selfish)
    profile: 'Lawful Neutral'
}
```

### Stat Impact (Lawful Neutral)
- **HIGH Willpower** (+80): Discipline and self-control
- **HIGH Focus** (+80): Systematic attention to goals
- **MODERATE Composure** (+25): Stability in ordered situations
- **NEUTRAL Empathy**: Balanced social awareness
- **NEUTRAL Faith**: No spiritual bias
- **NEUTRAL Resilience**: Standard stress handling

### How It Appears in Dossier

#### Psychometric Profile Section (TIER_02A)
- **MBTI**: ISTJ (The Logistician)
  - Strong alignment with Lawful Neutral personality
  - Systematic, duty-bound, structured thinker
  
#### Biometric Vectors Section (TIER_02C)
- Higher willpower/focus scores reflected in baseline metrics
- Talent DNA scores elevated in discipline-related domains

#### Risk Assessment Section (TIER_02D)
- Failure node likely tied to "Inflexibility" or "Over-reliance on rules"
- Success probability boosted by high willpower and focus
- Risk triggers: Scenarios requiring rule-breaking for good, sudden change

#### Resonance Signature Section (TIER_02E)
- Resonance type likely **Juggernaut** (unstoppable momentum)
  - Fitting for high willpower + structured approach
- Aura: "Crushing pressure—relentless forward motion"

#### Central Qualitative Evaluation (TIER_04)
The prose analysis mentions:
- "Systematically disciplined operative"
- "Excels in structured environments"
- "Slight weakness in spontaneity"
- "Pragmatic approach to goals"

---

## Calculating Alignment Impact on Stats

### Backend Calculation: alignmentService.ts

```typescript
import { AlignmentScores, Stat, SubStatName, StatName } from '../types';

export const getAlignmentModifiers = (alignment: AlignmentScores): Record<SubStatName, number> => {
    const modifiers: Record<SubStatName, number> = {};
    
    // Lawful-Chaotic axis affects Willpower and Focus
    if (alignment.lawfulChaotic < -50) {
        // Lawful: Boost Willpower and Focus
        modifiers[SubStatName.Willpower] = 80;
        modifiers[SubStatName.Focus] = 80;
        modifiers[SubStatName.Composure] = 25;
    } else if (alignment.lawfulChaotic > 50) {
        // Chaotic: Boost Adaptability and Charisma
        modifiers[SubStatName.Adaptability] = 80;
        modifiers[SubStatName.Charisma] = 80;
        modifiers[SubStatName.Innovation] = 40;
    }
    
    // Good-Evil axis affects Empathy and Faith/Purpose
    if (alignment.goodEvil < -50) {
        // Good: Boost Empathy and Faith
        modifiers[SubStatName.Empathy] = 60;
        modifiers[SubStatName.Faith] = 60;
        modifiers[SubStatName.Purpose] = 50;
    } else if (alignment.goodEvil > 50) {
        // Evil: Boost Conviction and Resilience
        modifiers[SubStatName.Conviction] = 70;
        modifiers[SubStatName.Resilience] = 50;
    }
    
    return modifiers;
};
```

### Frontend Display in Dossier

The dossier shows alignment-adjusted stats in multiple sections:
1. **Biometric Vectors**: HATI Index reflects adjusted percentile
2. **Growth Vectors (TIER_05)**: Talent DNA coefficients show alignment boost
3. **Hardware Diagnostics (TIER_01)**: Apex Threat % influenced by modifiers

---

## Dossier Sections Affected by Alignment

### Direct Influence

#### 1. Psychometric Profile (TIER_02A)
- **MBTI Type**: Reflects alignment personality
  - Lawful → J preference (Judging/organized)
  - Chaotic → P preference (Perceiving/flexible)
  - Good → F preference (Feeling)
  - Evil → T preference (Thinking)
- **Archetype Name**: Aligned archetype title

#### 2. Risk Assessment (TIER_02D)
- **Failure Node**: Aligned weakness
  - Lawful Neutral: "Inflexibility", "Over-reliance on protocols"
  - Chaotic Good: "Recklessness", "Defiance of authority"
  - Neutral Evil: "Selfish impulse", "Trust exploitation"
- **Success Probability**: Boosted/reduced by alignment modifiers

#### 3. Resonance Signature (TIER_02E)
- **Resonance Type**: Mapped from rarity band + alignment
  - Lawful alignment → Juggernaut or Virtuoso
  - Chaotic alignment → Joker or Catalyst
  - Good alignment → Catalyst
  - Evil alignment → Cipher or Joker
- **Aura Manifestation**: Reflects alignment nature

#### 4. Central Qualitative Evaluation (TIER_04)
- Prose analysis explicitly mentions alignment:
  - "Lawful Neutral operative with systematic discipline..."
  - "Values: Discipline, consistency, self-improvement"
  - "Weakness: May be inflexible; struggles with spontaneity"

#### 5. Operational Directive (TIER_07)
- **Deployment Recommendation**: Considers alignment strengths
  - Lawful → "Structured protocols, clear hierarchies"
  - Chaotic → "Flexible, experimental approaches"
  - Good → "Team collaboration, community benefit"
  - Evil → "Solo advancement, resource acquisition"

### Indirect Influence

#### 6. Anomaly Matrix (TIER_02B)
- User position in Tk/Ok space reflects alignment-adjusted stats
- Higher willpower (lawful) = potentially higher Ok score

#### 7. Growth Vectors (TIER_05)
- Potential ceiling affected by alignment modifier stacking
- Trajectory (exponential vs linear) influenced by obsession + alignment

#### 8. Hardware Diagnostics (TIER_01)
- TPI % calculation includes alignment modifiers
- Rarity Index reflects stat adjustments

---

## Example: Abas in Dossier

### Full Profile Narrative (TIER_04: Central Qualitative Evaluation)

```
OPERATIVE DESIGNATION: Abas
ALIGNMENT: Lawful Neutral

PROFILE SUMMARY:
Abas is a systematically disciplined operative with an ISTJ temperament. 
Excels in *structured environments* and long-term planning. 

STRENGTHS:
- **Willpower** (85/100): Exceptional discipline and self-control
- **Focus** (82/100): Laser-focused goal pursuit
- **Composure** (76/100): Stable in predictable scenarios

ALIGNMENT INSIGHT:
Prefers order and structure (Lawful), pursues neutral goals (neither 
altruistic nor selfish). Self-directed within rule-based frameworks. 
Pragmatic decision-making—will bend rules only if systematic 
justification exists.

WEAKNESS:
**Inflexibility**: Struggles with spontaneous rule-breaking, even 
for good causes. May freeze in unpredictable situations. Difficulty 
adapting to chaotic environments.

RECOMMENDATION:
Deploy in structured, rule-based missions. Provide clear protocols 
and long-term objectives. Avoid surprise scenario changes.
```

---

## Creating Dossiers for Other Alignments

### Chaotic Good Example
**Resonance Type**: Catalyst (spark ignitor)
- "Activation Protocol" ability
- "Ignites change in systems" aura
- **Failure Node**: "Reckless heroism", "Impulsive rule-breaking"
- **Success Probability**: 78%
- **Operational Directive**: "Flexible, experimental approaches; best in crisis scenarios"

### Lawful Evil Example
**Resonance Type**: Juggernaut (crushing momentum)
- "Unstoppable Momentum" ability
- "Relentless forward motion" aura
- **Failure Node**: "Authoritarian dominance", "Exploitation of subordinates"
- **Success Probability**: 85%
- **Operational Directive**: "Clear hierarchy; solo advancement scenarios; resource control"

### True Neutral Example
**Resonance Type**: Cipher (invisible architect)
- "Invisible Architect" ability
- "Hidden shaper of outcomes" aura
- **Failure Node**: "Apathy", "Lack of commitment"
- **Success Probability**: 65%
- **Operational Directive**: "Balanced challenges; maximum autonomy; minimal oversight"

---

## Integration Checklist

- ✅ **AlignmentScores** embedded in FullCalibrationReport
- ✅ **alignmentService.ts** calculates modifiers by alignment
- ✅ **GameState** tracks alignment for ongoing stat adjustments
- ✅ **abasProfile.ts** contains example Abas with Lawful Neutral alignment
- ✅ **ClassifiedDossier.tsx** displays alignment-derived insights
  - ✅ Psychometric Profile shows MBTI-aligned archetype
  - ✅ Risk Assessment reflects alignment weaknesses
  - ✅ Resonance Signature maps rarity + alignment → type
  - ✅ Central Qualitative Evaluation mentions alignment explicitly
  - ✅ Operational Directive tailored to alignment profile

---

## Backend Support

### Cloud Functions Integration

```typescript
// initializeAbasProfileV2 endpoint
POST /initializeAbasProfile
Body: { email, codename }

Returns:
{
  "gameState": {
    "userName": "Abas",
    "alignment": {
      "lawfulChaotic": -60,
      "goodEvil": 0,
      "profile": "Lawful Neutral"
    },
    "stats": [ /* alignment-adjusted stats */ ],
    "calibrationReport": { /* includes alignment analysis */ }
  }
}
```

---

## Frontend Data Flow

```
User Data (email, biometrics, MBTI)
          ↓
Screening Test Results (Tk, Ok, trait scores)
          ↓
generateNewMissionV2 (or calibration endpoint)
          ↓
Gemini AI Analysis (evaluates alignment)
          ↓
FullCalibrationReport
  ├─ alignment: AlignmentScores
  ├─ mbtiProfile: "ISTJ"
  ├─ primaryFailureNode: "Inflexibility"
  ├─ centralInsight: "[alignment-aware prose]"
  └─ resonanceSignature: [mapped by alignment]
          ↓
ClassifiedDossier.tsx (displays integrated profile)
```

---

## Testing Alignment Display

### Test Case 1: Lawful Neutral (Abas)
- MBTI: ISTJ ✅
- Resonance: Juggernaut (expected) ✅
- Failure Node: Inflexibility ✅
- Success %: ~85% ✅

### Test Case 2: Chaotic Good
- MBTI: ENFP ✅
- Resonance: Catalyst ✅
- Failure Node: Recklessness ✅
- Success %: ~78% ✅

### Test Case 3: Neutral Evil
- MBTI: ENTJ ✅
- Resonance: Cipher ✅
- Failure Node: Exploitation ✅
- Success %: ~80% ✅

---

## Future Alignment Features

1. **Dynamic Stat Shifting**: Alignment influences which stats grow during gameplay
2. **Alignment-Locked Paths**: Certain progression paths only accessible to specific alignments
3. **Moral Choices**: Tasks that shift alignment slightly based on player decisions
4. **Alignment Conflicts**: Warnings when player actions conflict with stated alignment
5. **Redemption/Corruption Arcs**: Long-term alignment modification through narrative
6. **Cross-Alignment Resonance**: Special abilities unlocked by alignment combinations

---

## Related Files

- `types.ts` - AlignmentScores interface
- `services/alignmentService.ts` - Calculation logic
- `data/abasProfile.ts` - Abas example with alignment
- `components/ClassifiedDossier.tsx` - Display integration
- `functions/src/index.ts` - Backend alignment support
- `ALIGNMENT_SYSTEM_AND_ABAS_PROFILE.md` - Detailed alignment guide

