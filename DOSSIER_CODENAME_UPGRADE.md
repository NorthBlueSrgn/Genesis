# Dossier & Codename System Upgrade

**Date**: January 19, 2026  
**Status**: ✅ COMPLETE

---

## What Changed

### 1. **Codename Generation Engine (Enhanced)**

**Old**: Basic, generic codenames like "Subject: Alex" or "Chrome Protocol"

**New**: Elite, earned-sounding, Gen Z-approved codenames with 4 aesthetic categories:

#### Category 1: Cosmic/Existential (Heavy, Fate-Coded)
```
Angel Born in Hell
Shadow Monarch
The Chosen One
Cursed Child
Flaw of the World
```

#### Category 2: Dark Professional (Lethal, Skill-Based)
```
Surgeon of Death
Black Reaper
Copy Ninja
Hero Hunter
Executioner Prime
```

#### Category 3: Warrior Archetype (Role-Forged, Identity-Based)
```
The Dark Knight
Black Swordsman
The One-Eyed King
Ghost of the Uchiha
Heavenly Demon
```

#### Category 4: Modern Icon (Clean, Earned, Inevitable)
```
The Process
The Anomaly
Black Mamba
Slim Reaper
The Greek Freak
GeneratorRex (username + functional suffix)
```

### How Codenames Are Generated

**Priority 1: Direct Username Keywords**
- If username contains "ninja" → Draw from Warrior pool
- If username contains "surgeon" → `Surgeon of [suffix]`
- If username contains "king" → `The One-Eyed King`

**Priority 2: Interest Signals (inferred from username)**
- Contains "rex", "motor", "mech" → Engineering vibe → `GeneratorRex`
- Contains "kai", "shadow", "ninja" → Martial vibe → Warrior Archetype
- Contains "nova", "star" → Cosmic vibe → Cosmic/Existential pool
- Contains "code", "cipher" → Logic vibe → `The [Name] Cipher`

**Priority 3: Length-Based Heuristics**
- Short names (≤3 chars) → Modern icon (punchy)
  - "Rex" → `REX-The Process`
- Long names (>8 chars) → Cosmic or Warrior (epic sounding)
  - "Alexandra" → `Shadow Monarch`

**Priority 4: Hash-Based Selection + Blending**
- Username hash determines which category + template
- Final blend can be:
  - Pure title: `Shadow Monarch`
  - Name + title suffix: `James Paradox`
  - The + Name + suffix: `The James Catalyst`
  - Title prefix + Name: `Shadow Kane`

**Result**: Each user gets a unique, witty, earned-sounding codename that feels tuff by Gen Z standards.

---

### 2. **Classified Dossier Structure (Clarified)**

**Old Understanding**: Dossier was a generic summary with an "Archetype" title

**New Understanding**: Dossier is a **clinical breakdown of your value as an asset**, not a personality report

#### The 6 Tiers of the Dossier

**Tier 1: Header & Identity Registry**
- **Codename**: Your elite identifier (e.g., Black Paradox)
- **Asset File ID**: Unique serial (GP-BLA92)
- **Security Clearance**: LVL_9
- **Status**: CALIBRATED

**Tier 2: Hardware Diagnostics (The "Now")**
- Your current operational status
- HATI % (power level vs 8B humans)
- Overall Grade (E → SS+)
- MBTI Profile
- Rarity Index (statistical frequency)

**Tier 3: Growth Vectors (The "Potential")**
- **Talent Class**: Learning speed (IMMUTABLE)
  - Laggard (0.8x) → Genius (2.0x)
- **Obsession Level**: Psychological adherence (IMMUTABLE)
  - Lazy (40%) → Compulsive (99%+)
- **Potential Vector**: Combined ceiling
  - Gifted + Average = Short vector (natural ability, lacks discipline)
  - Average + Compulsive = Long vector (effort eventually surpasses talent)
  - Genius + Compulsive = Singularity (exponential ceiling)

**Tier 4: Neural Architecture (The Visuals)**
- **Singularity Plot**: Your position on Talent vs Obsession grid + 6-month projection
- **Comparative Radar**: Your 6 attributes vs global mean

**Tier 5: Tactical Intelligence (The "Red Flags")**
- **Primary Failure Node**: Your biggest weakness (clinical diagnosis)
  - Examples: Dopamine Loop Sensitivity, Over-Analysis, Commitment Threshold
- **Failure Node Risk**: What triggers your failure?
  - "Quits after week 3-4 if no visible wins"
- **Historical Precedent**: AI finds matching historical figure (e.g., "85% correlation to Miyamoto Musashi")
- **Central Insight**: Long-form AI analysis of your strategic value and deployment recommendations

**Tier 6: Signature Feats (Optional)**
- Extraordinary achievements from your test
- Examples: "Perfect Logic Accuracy (99th percentile)"
- Marked as Mythic/Signature
- Permanently recorded

---

## Example Dossiers

### Example 1: High Talent + High Obsession (Singularity)
```
ASSET_FILE: GP-093
CODENAME: Black Paradox
Talent Class: GENIUS (x2.0)
Obsession Level: COMPULSIVE (99%+)
HATI: 94% (SS-Rank)
Rarity: 1 in 8.2M

Primary Failure Node: None detected
Historical Precedent: 92% match to Stephen Hawking

Central Insight: Unmitigated asset. Minimal failure risk. 
Fast-track to S+ rank feasible within 4-6 weeks. 
Monitor for burnout patterns despite high Obsession.
```

### Example 2: Moderate Talent + Low Obsession (Short Vector)
```
ASSET_FILE: GP-071
CODENAME: The Catalyst
Talent Class: GIFTED (x1.6)
Obsession Level: AVERAGE (65%)
HATI: 78% (B-Rank)
Rarity: 1 in 450K

Primary Failure Node: Commitment Threshold
Failure Node Risk: Quits after week 3-4 if no visible wins

Central Insight: High natural ability, insufficient drive. 
Recommend pairing with Compulsive assets for synergy. 
Or implement weekly milestone wins to maintain motivation.
```

### Example 3: Low Talent + High Obsession (Long Vector)
```
ASSET_FILE: GP-042
CODENAME: The Process
Talent Class: AVERAGE (x1.0)
Obsession Level: RELENTLESS (95%)
HATI: 58% (C-Rank)
Rarity: 1 in 85K

Primary Failure Node: Speed-Quality Trade-off
Failure Node Risk: Burns bridges when pushed too hard

Central Insight: Underestimated asset. Will eventually surpass 
Gifted peers through sheer effort. Recommend long-term role; 
short sprints will fail. Ideal for marathon-style protocols.
```

---

## Code Changes

### 1. `services/scoringService.ts` - Codename Generation
- **Function**: `generateCodename(username: string, narrativeOrContext?: string)`
- **Changed**: From basic templates to 4-category pool system
- **Added**: Interest signal detection (engineering, martial, cosmic, logic, speed, darkness)
- **Added**: Blend templates for variety
- **Result**: Unique, earned-sounding codenames per username

### 2. `components/ClassifiedDossier.tsx`
- **Added**: Dossier Introduction section explaining it's a clinical asset breakdown
- **Tone**: Clarifies this is NOT a personality report
- **Visual**: ShieldAlert icon + brief explanation of what each tier represents
- **Added**: "CLASSIFIED ASSET ASSESSMENT" header with context

### 3. `BIOMETRICS_AND_PROTOCOLS_GUIDE_FIXED.md`
- **Added**: Comprehensive "THE CLASSIFIED DOSSIER" section (6 tiers)
- **Added**: Codename generation philosophy explanation
- **Added**: Primary Failure Node concept & examples
- **Added**: 3 example dossiers showing different Talent/Obsession combinations
- **Added**: Historical Precedent explanation
- **Tone**: Clinical, asset-focused, not gamified

---

## Key Concepts

### Codename Philosophy
- **Earned, not assigned**: Feels like it was *earned* through performance, not given
- **Gen Z aesthetic**: Tuff, ironic, memorable
- **Functional**: References performance (The Process), rarity (Anomaly), or characteristics
- **Category-driven**: Different vibes for different profiles

### Dossier as Clinical Assessment
- **Not a personality report**: It's a value assessment
- **Clinical language**: "Asset," "deployment," "failure node," "precedent"
- **Immutable tiers**: Talent Class, Obsession Level, HATI % are locked at calibration
- **Mutable elements**: Rank, Stats, Protocols change through gameplay

### Primary Failure Node
- Your personal psychological weakness
- The specific condition that will cause you to quit
- AI-diagnosed, not generic
- Helps you know your trigger condition
- Central Insight suggests mitigation strategies

---

## Testing Checklist

- ✅ Codename generation for various usernames (short, long, with keywords)
- ✅ Dossier introduction section displays correctly
- ✅ All 6 tiers render without errors
- ✅ Singularity Plot shows correct Talent/Obsession positioning
- ✅ Failure Node displays clinically (not as judgment)
- ✅ Asset File ID generated correctly from codename hash
- ✅ Rarity Index calculates based on Talent + Obsession combination
- ✅ Documentation clear and accessible

---

## Files Modified

1. `services/scoringService.ts` - Codename generation logic
2. `components/ClassifiedDossier.tsx` - Dossier intro section
3. `BIOMETRICS_AND_PROTOCOLS_GUIDE_FIXED.md` - Comprehensive dossier documentation

---

## Deployment Status

✅ **READY FOR PRODUCTION**

All code is live, documentation is comprehensive, and the dossier now properly communicates:
1. Who you are (Codename)
2. What you're worth (HATI %)
3. How fast you learn (Talent Class)
4. How hard you'll work (Obsession Level)
5. What will break you (Primary Failure Node)
6. How you compare historically (Precedent)
