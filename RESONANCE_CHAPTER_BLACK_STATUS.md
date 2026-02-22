# Genesis Protocol - Resonance & Chapter Black System Overview

## Project Status Summary

This document provides a high-level overview of the Resonance Type System and Chapter Black narrative framework for Genesis Protocol.

---

## What Has Been Established

### 1. **The 7 Canonical Resonance Types**

The system defines exactly **7 resonance types** (plus Unawakened as default):

| Type | Core Meaning | Narrative Archetype |
|------|---|---|
| **Juggernaut** | Unstoppable force | The Breaker of Barriers |
| **Catalyst** | Agent of change | The Transformer |
| **Virtuoso** | Technical mastery | The Master |
| **Chameleon** | Adaptive evolution | The Shapeshifter |
| **Cipher** | Hidden architect | The Shadow Influence |
| **Joker** | Chaos & breakthrough | The Wildcard |
| **Unawakened** | Dormant potential | The Uncalibrated |

**Source Code:** `types.ts` lines 80-87

### 2. **Resonance Assignment**

Resonance types are currently assigned via the **Rarity Tier System** from talent calibration:

- **Singularity** (top 1%) → Juggernaut
- **Outlier** (top 5%) → Catalyst
- **Abnormality** (top 15%) → Virtuoso
- **Exceptional** (top 30%) → Chameleon
- **Optimized** (top 50%) → Cipher
- **Unranked** → Unawakened

**Source Code:** `ClassifiedDossier.tsx` lines 208-215

### 3. **Resonance Signature Structure**

Each operative has a `ResonanceSignature` object containing:
- Type (enum value)
- Tier (1-5)
- Rank Band (e.g., 'E-D', 'C-B')
- Awakened status
- Description & aura manifestation
- Traits & signature ability
- Domain of influence
- Stat affinities

**Source Code:** `types.ts` lines 295-308

### 4. **World Context**

The narrative world includes:
- **Eden:** The origin facility that discovered and trained operatives
- **The Cull:** A filtering event that created factions
- **The Chosen:** Operatives deemed acceptable
- **The Forsaken:** Those rejected or abandoned
- **The Equaliser:** An emergent third faction

### 5. **Chapter Black System**

Daily narrative generation for each operative:
- **UI:** `ChapterBlackPage.tsx`
- **Frontend Service:** `generateNewChapter()` in `geminiService.ts`
- **Backend Cloud Function:** `generateChapterV2` in `functions/src/index.ts`
- **Current State:** Basic narrative generation without resonance context

---

## What Needs to Be Done

### Priority 1: Enhanced Chapter Black Integration

**Goal:** Make Chapter Black narratives personalized based on resonance type, stats, and personality.

**What to change:**
1. Update `generateChapterV2` Cloud Function to accept and use resonance data
2. Update `generateNewChapter()` frontend service to pass resonance data
3. Add MBTI personality type tracking to GameState
4. Enhance the AI prompt with resonance-specific narrative guidance

**Expected outcome:** Each operative's Chapter Black will feel unique to their resonance type and personality.

**Timeline:** 2-3 hours implementation + testing

**Reference:** `CHAPTER_BLACK_IMPLEMENTATION.md`

### Priority 2: Chapter Black UI Enhancement

**Goal:** Display resonance information alongside narrative entries.

**What to add:**
1. Resonance profile card in Chapter Black page (type, tier, ability, aura)
2. Visual indicators of which resonance type is generating each chapter
3. (Optional) Chart showing resonance evolution over time

**Expected outcome:** Players see how their resonance affects their story.

**Timeline:** 1-2 hours

### Priority 3: Story Choice System (Optional but Recommended)

**Goal:** Let player choices influence future narratives and potentially shift resonance tier/type.

**What to add:**
1. Implement choice tracking in `LoreEntry`
2. Pass previous choices to AI prompt
3. Allow AI to reference player decisions in narratives
4. (Advanced) Implement resonance shift mechanics based on choices

**Expected outcome:** Story becomes dynamic and player agency is visible.

**Timeline:** 4-6 hours (depending on scope)

### Priority 4: Resonance Evolution System (Future)

**Goal:** Allow resonance types to evolve based on gameplay.

**What to add:**
1. Mechanics for tier progression (1→2→3, etc.)
2. Rare mechanics for type shifts (Catalyst → Juggernaut)
3. Narrative events tied to resonance milestones

**Timeline:** 8+ hours (major feature)

---

## Documentation Files Created

### For Developers

1. **`RESONANCE_TYPE_SYSTEM_GUIDE.md`** (Long-form)
   - Complete explanation of the resonance system
   - Integration with Chapter Black
   - Narrative best practices
   - 8-part detailed reference

2. **`RESONANCE_QUICK_REF.md`** (Quick lookup)
   - Type definitions and meanings
   - Code locations and examples
   - Quick usage patterns
   - Common implementations

3. **`CHAPTER_BLACK_IMPLEMENTATION.md`** (Code examples)
   - Exact code changes needed
   - Cloud Function enhancement
   - Frontend service updates
   - UI improvements with examples
   - Testing strategies

### For Reference

4. **`CLASSIFIED_DOSSIER_ALIGNMENT_INTEGRATION.md`** (Existing)
   - How resonance types relate to calibration

5. **`BIOMETRICS_AND_PROTOCOLS_GUIDE.md`** (Existing)
   - Broader game system context

---

## Key Insight: Emergent vs. Template-Based

**Important Design Principle:**

Resonance types and survivor factions should be **emergent** (appearing naturally in story) rather than **template-based** (pre-defined rosters).

- ❌ DON'T: Create a list of "survivor NPCs with fixed resonances"
- ✅ DO: Let AI mention survivors as needed for the narrative, describing their resonances naturally
- ✅ DO: Reference factions organically as the story develops
- ✅ DO: Let each operative's Chapter Black tell its own unique story

This approach keeps the world feeling alive and unrepeatable.

---

## Code Locations Quick Reference

### Type Definitions
```
types.ts:80-87       ResonanceType enum
types.ts:90          ResonanceVector type
types.ts:295-308     ResonanceSignature interface
```

### Initialization
```
GameStateContext.tsx:102    Default Unawakened resonance
GameStateContext.tsx:226    Resonance in initial state
```

### Display & Logic
```
ClassifiedDossier.tsx:208-226    Rarity → Resonance mapping & descriptions
ResonanceWheel.tsx               Resonance visualization component
StatsPage.tsx:262,496            Resonance display in stats
scoringService.ts:231-237        Resonance scoring logic
```

### Narrative Generation
```
geminiService.ts:221-260         generateNewChapter() frontend service
functions/src/index.ts:746-820   generateChapterV2 Cloud Function
ChapterBlackPage.tsx:1-200       Chapter Black UI
```

---

## Success Metrics

Once implementation is complete:

1. ✅ Each operatives's Chapter Black chapter varies based on their resonance type
2. ✅ Resonance profile displays in Chapter Black UI
3. ✅ Narratives reference operative's MBTI and stats
4. ✅ Story maintains continuity across chapters
5. ✅ Different resonance types produce distinctly different narrative tones
6. ✅ AI naturally references world context (Eden, Cull, factions)

---

## Next Steps

### If Implementing Priority 1 (Recommended First Step):

1. Read `CHAPTER_BLACK_IMPLEMENTATION.md` sections 1-3
2. Update Cloud Function with enhanced prompt
3. Update frontend service to pass resonance data
4. Test with sample requests
5. Deploy and verify in staging environment

### If Implementing Priority 2:

1. Read `CHAPTER_BLACK_IMPLEMENTATION.md` section 4
2. Add resonance profile card to ChapterBlackPage
3. Style to match existing design system
4. Test display with various resonance types

### For Deep Understanding:

1. Read `RESONANCE_TYPE_SYSTEM_GUIDE.md` in full
2. Study the example narratives in Part 8
3. Review code locations in Quick Reference
4. Explore the existing ClassifiedDossier implementation

---

## FAQ

**Q: Should I pre-create a list of survivor characters?**
A: No. Let the AI introduce survivors naturally through narrative. They emerge as needed for the story.

**Q: Can an operative's resonance type change?**
A: Currently, no. But it's a great future feature (Priority 4). For now, tier progression is easier to implement.

**Q: What if I want to add more resonance types?**
A: You can, but the current 7 are well-balanced. Adding more requires rebalancing the rarity mapping and AI guidance.

**Q: How does resonance affect gameplay mechanics?**
A: Currently, it's narrative/cosmetic. The system is ready for mechanical integration (damage types, stat bonuses, etc.) but not yet implemented.

**Q: Should resonance information be passed to other AI prompts (missions, etc.)?**
A: Absolutely. The same pattern should be applied to mission generation, promotion exams, and side missions for consistency.

---

## Contact & Questions

If unclear on any aspect:
1. Check `RESONANCE_QUICK_REF.md` for quick answers
2. Read `RESONANCE_TYPE_SYSTEM_GUIDE.md` for detailed explanations
3. Review `CHAPTER_BLACK_IMPLEMENTATION.md` for code examples
4. Search codebase for example implementations

---

**Status:** Ready for Implementation (Priority 1)
**Last Updated:** 2025-01-19
**Maintained by:** Development Team
