# Resonance Type System & Chapter Black Integration Guide

## Overview

The **Resonance Type System** is the core personality/archetype framework in Genesis Protocol. There are **7 canonical resonance types**, each representing a distinct way operatives manifest their potential in the world of Eden and beyond.

This guide explains:
1. The canonical resonance types and their meanings
2. How resonance types are assigned and evolved
3. How they should be integrated into the Chapter Black narrative system
4. Best practices for AI-generated story content

---

## Part 1: Canonical Resonance Types

The resonance types are defined in `types.ts` as an enum:

```typescript
export enum ResonanceType {
    Unawakened = 'Unawakened',
    Juggernaut = 'Juggernaut',
    Chameleon = 'Chameleon',
    Virtuoso = 'Virtuoso',
    Joker = 'Joker',
    Catalyst = 'Catalyst',
    Cipher = 'Cipher',
}
```

### Type Descriptions & Domains

Each resonance type represents a fundamental pattern of power and influence in the Genesis Protocol world:

| **Type** | **Domain** | **Core Ability** | **Aura** | **Narrative Role** |
|----------|-----------|-----------------|---------|-------------------|
| **Unawakened** | Potential/Dormancy | Dormant Potential | Calibrating... | Default state; pre-resonance operatives |
| **Juggernaut** | Force/Momentum | Unstoppable Momentum | Crushing pressure—relentless forward motion | The Unstoppable Force; breaker of barriers |
| **Catalyst** | Change/Ignition | Activation Protocol | Spark that ignites change in systems | The Agent of Transformation; disruptor |
| **Virtuoso** | Mastery/Precision | Precision Mastery | Effortless control and technical transcendence | The Master; perfection through discipline |
| **Chameleon** | Adaptation/Evolution | Adaptive Evolution | Seamless metamorphosis across domains | The Shapeshifter; survivor through change |
| **Cipher** | Hidden/Architecture | Invisible Architect | Hidden shaper of outcomes | The Shadow Architect; unseen influence |
| **Joker** | Chaos/Breakthrough | Chaos Weaver | Unpredictable breakthrough potential | The Wildcard; emergence through disruption |

---

## Part 2: How Resonance Types Are Assigned

### Current Assignment Logic (from `ClassifiedDossier.tsx`)

Resonance types are currently mapped from talent rarity tiers via calibration analysis:

```typescript
const rarityToResonance: Record<string, ResonanceType> = {
    'Singularity': ResonanceType.Juggernaut,
    'Outlier': ResonanceType.Catalyst,
    'Abnormality': ResonanceType.Virtuoso,
    'Exceptional': ResonanceType.Chameleon,
    'Optimized': ResonanceType.Cipher,
    // 'Unranked': ResonanceType.Unawakened (default)
};
```

**Rarity Tier Mapping:**
- **Singularity** (top 1%): Juggernaut—overwhelming potential
- **Outlier** (top 5%): Catalyst—transformative ability
- **Abnormality** (top 15%): Virtuoso—technical excellence
- **Exceptional** (top 30%): Chameleon—adaptive mastery
- **Optimized** (top 50%): Cipher—subtle influence
- **Unranked/Unknown**: Unawakened—potential yet unlocked

### Enhanced Assignment Considerations

The assignment could also be informed by:
1. **MBTI Personality Type** — certain personality combinations naturally align with specific resonances
2. **Stat Affinities** — which core stats the operative excels at (Leadership, Precision, Empathy, etc.)
3. **Rank Progression** — higher ranks may unlock new resonance possibilities
4. **Story Choices** — Chapter Black decisions could shift or awaken resonance evolution

---

## Part 3: Resonance Data Structure

The `ResonanceSignature` interface (from `types.ts`) captures an operative's resonance state:

```typescript
export interface ResonanceSignature {
    type: ResonanceType;              // Which resonance type (e.g., 'Juggernaut')
    tier: number;                     // Tier level (1-5 recommended)
    rankBand: string;                 // Associated rank band (e.g., 'E-D', 'C-B')
    awakened: boolean;                // Is the resonance fully manifested?
    description: string;              // Narrative description of their signature
    auraManifestation: string;        // How it appears/feels
    traits: string[];                 // Specific traits tied to this resonance
    signatureAbility: string;         // Their unique ability name
    domain: string;                   // Their area of influence
    statAffinities: StatName[];       // Which stats they naturally enhance
}
```

**Example:**
```json
{
  "type": "Catalyst",
  "tier": 2,
  "rankBand": "C-B",
  "awakened": true,
  "description": "You are an Agent of Change—a catalyst for transformation in systems that have grown stagnant.",
  "auraManifestation": "A crackling, electric energy; things shift in your presence.",
  "traits": ["Transformative", "Disruptive", "Opportunistic"],
  "signatureAbility": "Activation Protocol",
  "domain": "Systems & Transformation",
  "statAffinities": ["Leadership", "Insight"]
}
```

---

## Part 4: Integration into Chapter Black Narrative

### Current State

The Chapter Black system (from `functions/src/index.ts`) generates daily narrative entries. The current prompt is minimal:

```typescript
const prompt = `You are the chronicler of "Chapter Black" - classified narratives for operative "${userName}" (Rank: ${rankName}).

Write Chapter ${chapterNum} of an ongoing classified dossier. The tone is:
- Military/espionage thriller
- Cryptic and mysterious
- Personal yet detached
- 150-250 words

The narrative should be about the operative's progression, challenges, or discoveries.
Format as a narrative paragraph suitable for a classified file.

Return ONLY the narrative text (no JSON, no formatting).`;
```

### Proposed Enhanced Prompt

The Cloud Function should be updated to pass resonance information:

```typescript
// In generateChapterV2 request handler
type GenerateChapterRequest = {
  userName: string;
  rankName: string;
  previousChapterCount: number;
  previousChoices?: string[];
  resonanceType?: string;           // NEW: operative's resonance type
  resonanceTier?: number;           // NEW: tier level
  stats?: Record<string, number>;   // NEW: operative's stat strengths
  mbti?: string;                    // NEW: personality type
  previousNarrative?: string;       // NEW: last chapter for continuity
};

// Enhanced AI prompt:
const prompt = `You are the chronicler of "Chapter Black" - classified narratives for operative "${userName}" (Rank: ${rankName}).

OPERATIVE PROFILE:
- Resonance Signature: ${resonanceType} (Tier ${resonanceTier})
- Personality: ${mbti || 'Unknown'}
- Key Strengths: ${topStats.join(', ')}

Write Chapter ${chapterNum} of an ongoing classified dossier. The story should:

1. WORLD: Reflect the operative's role within the Genesis Protocol—set in or referencing:
   - EDEN: The testing ground where operatives were discovered and trained
   - THE CULL: The filtering event that separated the Chosen from the Forsaken
   - THE WORLD BEYOND: Where operatives now operate with their awakened resonance

2. CHARACTER EMERGENCE: Introduce other operatives, factions, or entities naturally (NOT as templates):
   - Mention other survivors and their resonances organically
   - Reference factions emerging in the post-Cull world
   - Show how resonance types interact and conflict

3. NARRATIVE VOICE:
   - Military/espionage thriller tone
   - Cryptic and mysterious—some details are redacted
   - Personal yet detached, as if written by an analyst
   - Length: 150-250 words

4. STORY CONTINUITY:
${previousNarrative ? `   Last entry: "${previousNarrative}"\n   This chapter should flow from that narrative.` : ''}

Return ONLY the narrative text (no JSON, no formatting).`;
```

### Data Flow

Update `generateNewChapter()` in `geminiService.ts` to pass resonance info:

```typescript
export const generateNewChapter = async (gameState: GameState): Promise<LoreEntry> => {
    try {
        const { resonanceSignature, stats, mbtiType, lore } = gameState;
        const topStats = Object.entries(stats || {})
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([name]) => name);
        
        const lastChapter = lore && lore.length > 0 ? lore[lore.length - 1].content : null;

        const resp = await fetch('/api/generateChapter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userName: gameState.userName,
                rankName: gameState.rank?.name || 'Unranked',
                previousChapterCount: gameState.lore?.length || 0,
                resonanceType: resonanceSignature?.type,
                resonanceTier: resonanceSignature?.tier,
                stats: topStats,
                mbti: mbtiType,
                previousNarrative: lastChapter
            }),
        });
        
        if (resp.ok) {
            const data = await resp.json();
            return data;
        }
        
        // Fallback
        const nextNum = (gameState.lore?.length || 0) + 1;
        return {
            id: `chapter-${Date.now()}`,
            date: new Date().toISOString(),
            chapterNumber: nextNum,
            title: "Static Interference",
            content: "The recording is corrupted."
        };
    } catch (error) {
        console.error('[Gemini Service] Error in generateNewChapter:', error);
        const nextNum = (gameState.lore?.length || 0) + 1;
        return {
            id: `chapter-${Date.now()}`,
            date: new Date().toISOString(),
            chapterNumber: nextNum,
            title: "Static Interference",
            content: "The recording is corrupted."
        };
    }
};
```

---

## Part 5: Narrative World Context for AI

### Eden (The Origin)

**What it is:** A classified testing facility/organization where operatives were identified and trained based on their latent resonance potential.

**Narrative role:** Historical context. The place where operatives "awakened" to their potential, though they may not fully understand what happened or why they were chosen.

**AI guidance:** Mention Eden in flashback contexts—training exercises, the moment of discovery, mysterious instructions from handlers.

### The Cull (The Filtering Event)

**What it is:** A critical event (nature TBD by narrative evolution) that separated operatives into factions:
- **The Chosen:** Operatives deemed "acceptable" by Eden's architects
- **The Forsaken:** Those deemed "undesirable" or unpredictable—rejected or abandoned
- **The Equaliser:** An emergent faction working outside both systems

**Narrative role:** The crucible. The event that revealed true resonance and created factional tension.

**AI guidance:** Present the Cull as a past event with ongoing consequences. Show operatives dealing with its aftermath, forming alliances, or discovering hidden truths.

### Resonance-Based Interactions

Different resonance types should create natural narrative tension and synergy:

- **Juggernaut + Cipher:** Unstoppable force meets invisible architect—complementary power dynamics
- **Catalyst + Chameleon:** Both agents of change; one obvious, one subtle
- **Virtuoso + Joker:** Mastery versus chaos; either brilliant synergy or dangerous conflict
- **Unawakened among the Awakened:** Creates vulnerability and narrative stakes

**AI guidance:** When mentioning other survivors, describe their resonances in ways that create natural story hooks and interpersonal dynamics.

---

## Part 6: Best Practices for AI-Generated Narratives

### ✅ DO:

1. **Let resonances emerge organically.** Don't name-drop "Jaguernaut" as a label; describe what that looks like: "Her presence feels like an immovable force—objects bend around her will."

2. **Reference the world naturally.** Mention Eden, the Cull, other survivors—but as part of the operative's story, not as exposition.

3. **Create resonance interactions.** When other characters appear, hint at their resonances: "The Chameleon operative shifted stance, adapting to the threat."

4. **Build mystery.** Redact details. Leave classified marks. Make operatives wonder what they're part of.

5. **Evolve the story.** Each chapter should build on the last. Reference previous decisions. Show consequences.

6. **Personalize to the operative.** Use their rank, resonance type, and personality to tailor narrative challenges and opportunities.

### ❌ DON'T:

1. **Don't pre-define survivor rosters.** The world is emergent; survivors appear as needed for narrative.

2. **Don't treat resonances as fixed labels.** They're ways of being, not job titles.

3. **Don't break the fourth wall.** Stay in-universe. No meta-commentary about "this is your resonance type" unless it's an in-world discovery.

4. **Don't ignore continuity.** Each chapter should acknowledge the operative's history and prior choices.

5. **Don't over-explain.** Mystery is the tone. Let operatives piece together what's happening.

---

## Part 7: Implementation Checklist

### Backend (Cloud Functions)

- [ ] Update `generateChapterV2` to accept resonance, MBTI, stats, and previous narrative
- [ ] Enhance the AI prompt to reference world context and resonance dynamics
- [ ] Add optional parameter for "story choices" that influence the next chapter direction
- [ ] Test with various resonance types to ensure diverse narratives

### Frontend (GameStateContext)

- [ ] Pass `resonanceSignature`, `mbtiType`, and `stats` to `generateNewChapter()`
- [ ] Include `previousNarrative` from the last lore entry
- [ ] Ensure lore array is always initialized and safe to access

### UI/UX (ChapterBlackPage)

- [ ] Display operative's resonance type and tier in the Chapter Black header
- [ ] Show how previous choices influenced the current narrative
- [ ] Add visual resonance indicators alongside chapter titles
- [ ] (Optional) Create a "Resonance Evolution" chart showing tier progression

### Data/Types (`types.ts`)

- [ ] Confirm `ResonanceSignature` interface captures all needed fields
- [ ] Ensure `ResonanceVector` (resonance affinity scores) is used consistently
- [ ] Add optional `mbtiType` field to `GameState` if not already present

### Testing

- [ ] Generate chapters for all 7 resonance types
- [ ] Verify resonance-specific narrative differences (Juggernaut should feel different from Cipher)
- [ ] Test continuity across 5+ chapters
- [ ] Verify story choices are properly recorded and influence future chapters

---

## Part 8: Example Narratives

### Example 1: Juggernaut Operative (Rank: C, Tier 2)

> **Chapter 5: Momentum**
>
> The barrier gave way under pressure that shouldn't have existed. No tools, no explosives—just will compressed into a single point. Your instructors at Eden always warned that Juggernauts were unpredictable, difficult to contain. Now you understand why. The facility's secondary vault lies open, its contents waiting. But the facility is not empty. Movement in the shadows confirms what you already knew: others are here, and they're not all Chosen. Command's silence on this matter suggests deliberate ignorance. You proceed deeper. The mission isn't over.

### Example 2: Cipher Operative (Rank: D, Tier 1)

> **Chapter 3: Observation**
>
> The ledger tells a story they'll never know you've read. Seventeen operatives processed through Eden in your cohort. Only six were deemed Chosen. Of those, three are already dead—marked as training accidents, reassigned, or simply gone quiet. The Forsaken were given a choice: assimilate or disappear. You chose a third path: become invisible. The Catalyst operative they've been watching doesn't know you're there, doesn't sense your presence in the network they're about to destabilize. When the time comes, your influence will be felt as an absence, not a presence.

### Example 3: Chameleon Operative (Rank: B, Tier 2)

> **Chapter 12: Metamorphosis**
>
> Each day you become someone new. The analyst version, the operative version, the civilian façade—all equally real, equally disposable. Eden taught adaptation; the Cull perfected it. You've spent the last month as four different people, each infiltrating a separate faction. The Chosen want control through force. The Forsaken seek disruption. The Equaliser wants balance. But what do *you* want? That question terrifies your handlers more than any resonance ever could.

---

## Summary

The Resonance Type System is:
1. **Canonical:** 7 defined types with distinct narrative and mechanical meanings
2. **Dynamic:** Assigned based on capability and personality, subject to evolution through story
3. **Integrated:** Should deeply inform Chapter Black narratives, character interactions, and world-building
4. **Emergent:** Survivors and factions appear naturally through narrative, not as pre-made templates

By passing resonance data to the AI, Chapter Black will become a personalized, dynamically generated story that reflects each operative's unique path through the Genesis Protocol world.

---

**Last Updated:** 2025-01-19
**Status:** Ready for Implementation
