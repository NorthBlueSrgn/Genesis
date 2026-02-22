# Resonance Type System - Quick Reference

## The 7 Resonance Types

```typescript
// From types.ts
export enum ResonanceType {
    Unawakened = 'Unawakened',     // Default; potential not yet manifested
    Juggernaut = 'Juggernaut',     // Unstoppable force; momentum & power
    Chameleon = 'Chameleon',       // Adaptive; metamorphosis & change
    Virtuoso = 'Virtuoso',         // Mastery; precision & control
    Joker = 'Joker',               // Chaos; breakthrough & unpredictability
    Catalyst = 'Catalyst',         // Change; activation & transformation
    Cipher = 'Cipher',             // Hidden; invisible architect of outcomes
}
```

## Key Data Structures

### ResonanceSignature (Current State)
```typescript
{
  type: ResonanceType;           // Which type (enum value)
  tier: number;                  // Level (1-5)
  rankBand: string;              // e.g., 'E-D', 'C-B', 'A'
  awakened: boolean;             // Fully manifested?
  description: string;           // Narrative description
  auraManifestation: string;     // How it appears/feels
  traits: string[];              // Specific traits
  signatureAbility: string;      // Unique ability name
  domain: string;                // Area of influence
  statAffinities: StatName[];    // Which stats align with this resonance
}
```

### ResonanceVector (Affinity Scores)
```typescript
// Record of each type to numeric affinity (0-100)
type ResonanceVector = Record<ResonanceType, number>;

// Example:
{
  Unawakened: 0,
  Juggernaut: 45,    // Good affinity
  Catalyst: 30,
  Virtuoso: 25,
  Chameleon: 15,
  Cipher: 20,
  Joker: 35
}
```

## Rarity → Resonance Mapping

| Rarity | Resonance Type | Meaning |
|--------|---|---|
| Singularity | Juggernaut | Top 1% — overwhelming potential |
| Outlier | Catalyst | Top 5% — transformative ability |
| Abnormality | Virtuoso | Top 15% — technical excellence |
| Exceptional | Chameleon | Top 30% — adaptive mastery |
| Optimized | Cipher | Top 50% — subtle influence |
| Unranked | Unawakened | Unknown potential |

*Code: `ClassifiedDossier.tsx` lines 208-215*

## Resonance Profile Descriptions

```typescript
// From ClassifiedDossier.tsx
const resonanceDescriptions: Record<ResonanceType, { ability: string; aura: string }> = {
    [ResonanceType.Juggernaut]: { 
        ability: 'Unstoppable Momentum', 
        aura: 'Crushing pressure—relentless forward motion' 
    },
    [ResonanceType.Catalyst]: { 
        ability: 'Activation Protocol', 
        aura: 'Spark that ignites change in systems' 
    },
    [ResonanceType.Virtuoso]: { 
        ability: 'Precision Mastery', 
        aura: 'Effortless control and technical transcendence' 
    },
    [ResonanceType.Chameleon]: { 
        ability: 'Adaptive Evolution', 
        aura: 'Seamless metamorphosis across domains' 
    },
    [ResonanceType.Cipher]: { 
        ability: 'Invisible Architect', 
        aura: 'Hidden shaper of outcomes' 
    },
    [ResonanceType.Joker]: { 
        ability: 'Chaos Weaver', 
        aura: 'Unpredictable breakthrough potential' 
    },
    [ResonanceType.Unawakened]: { 
        ability: 'Dormant Potential', 
        aura: 'Calibrating...' 
    },
};
```

## File Locations

| Feature | File | Lines |
|---------|------|-------|
| Type Definition | `types.ts` | 80-90 |
| Default Resonance | `GameStateContext.tsx` | 102, 226 |
| Rarity Mapping | `ClassifiedDossier.tsx` | 208-215 |
| Profile Display | `ClassifiedDossier.tsx` | 219-226 |
| Resonance Wheel | `ResonanceWheel.tsx` | — |
| Stats Display | `StatsPage.tsx` | 262, 496 |
| Scoring Logic | `scoringService.ts` | 231-237 |
| Chapter Generation | `geminiService.ts` | 221-260 |
| Cloud Function | `functions/src/index.ts` | 746-820 |

## Usage in Components

### Display Operative's Resonance
```tsx
import { ResonanceType } from '../types';

const myType: ResonanceType = ResonanceType.Catalyst;
console.log(myType); // "Catalyst"
```

### Access Resonance Signature
```tsx
import { useGameState } from '../contexts/GameStateContext';

const { gameState } = useGameState();
const { resonanceSignature } = gameState;

console.log(resonanceSignature.type);           // e.g., "Juggernaut"
console.log(resonanceSignature.tier);           // e.g., 2
console.log(resonanceSignature.signatureAbility); // e.g., "Unstoppable Momentum"
```

### Render Resonance Wheel
```tsx
import ResonanceWheel from '../components/ResonanceWheel';

<ResonanceWheel 
  userResonance={resonanceSignature.type}
  resonanceVector={resonanceVector}
/>
```

## World Context References

### Eden
The original testing facility where operatives were discovered and trained. Set in the past; referenced as origin of knowledge and power.

### The Cull
A filtering event that separated operatives into factions:
- **Chosen:** Deemed acceptable by Eden's architects
- **Forsaken:** Rejected or abandoned
- **Equaliser:** Emerged outside both systems

### Resonance in Narrative
- Each type has a distinct way of approaching problems
- They create natural tensions and synergies
- They should emerge in dialogue and action, not as labels

## Common Patterns

### Check if Awakened
```tsx
if (resonanceSignature.awakened) {
  // Operative has unlocked their resonance
}
```

### Get Highest Affinity
```tsx
const types = Object.entries(resonanceVector)
  .sort(([, a], [, b]) => b - a);
const topType = types[0][0] as ResonanceType;
```

### Initialize Default
```tsx
const defaultSignature: ResonanceSignature = {
  type: ResonanceType.Unawakened,
  tier: 1,
  rankBand: 'E-D',
  awakened: false,
  description: "Your core potential is yet to be unlocked.",
  auraManifestation: "A faint, colorless hum.",
  traits: [],
  signatureAbility: "N/A",
  domain: "N/A",
  statAffinities: []
};
```

## Next Steps

1. **Chapter Black Integration** — Pass resonance data to AI prompt
2. **Resonance Evolution** — Enable tier/type changes through gameplay
3. **Faction Alignment** — Show how resonance type aligns with faction choice
4. **Ability System** — Implement `signatureAbility` as unique player power

---

**Reference:** `RESONANCE_TYPE_SYSTEM_GUIDE.md` for detailed explanation and implementation guide.
