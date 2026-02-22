# Chapter Black Integration - Implementation Examples

This file contains code examples for integrating resonance types into the Chapter Black narrative generation system.

---

## 1. Update Cloud Function (functions/src/index.ts)

### Current Implementation
The function in lines 746-820 currently takes basic parameters. Here's how to enhance it:

```typescript
// IMPROVED: generateChapterV2 with resonance context
type GenerateChapterRequest = {
  userName: string;
  rankName: string;
  previousChapterCount: number;
  previousChoices?: string[];
  // NEW FIELDS:
  resonanceType?: string;        // e.g., "Juggernaut"
  resonanceTier?: number;        // 1-5
  topStats?: string[];           // Top 3 stats
  mbti?: string;                 // MBTI type
  previousNarrative?: string;    // Last chapter for continuity
};

export const generateChapterV2 = onRequest(
  { secrets: [geminiApiKey] },
  (req, res) => {
    corsHandler(req, res, async () => {
      try {
        if (req.method !== 'POST') {
          res.status(405).json({ error: 'Method not allowed' });
          return;
        }

        const apiKey = geminiApiKey.value();
        if (!apiKey) {
          res.status(500).json({ error: 'Missing GEMINI_API_KEY' });
          return;
        }

        const body = (req.body || {}) as Partial<GenerateChapterRequest>;
        const userName = String(body.userName || 'Operative');
        const rankName = String(body.rankName || 'Unranked');
        const chapterNum = (body.previousChapterCount || 0) + 1;
        const resonanceType = body.resonanceType || 'Unawakened';
        const resonanceTier = body.resonanceTier || 1;
        const topStats = body.topStats?.join(', ') || 'Unknown';
        const mbti = body.mbti || 'Unknown';
        const previousNarrative = body.previousNarrative || null;

        const ai = new GoogleGenAI({ apiKey });
        const model = 'gemini-2.5-pro';

        // ENHANCED PROMPT with resonance context
        const prompt = `You are the chronicler of "Chapter Black" - classified narratives for operative "${userName}" (Rank: ${rankName}).

OPERATIVE PROFILE:
- Resonance Signature: ${resonanceType} (Tier ${resonanceTier})
- Personality: ${mbti}
- Key Strengths: ${topStats}

Write Chapter ${chapterNum} of an ongoing classified dossier. The story should:

1. WORLD CONTEXT:
   The operative exists in a post-Cull world where operatives have awakened to their resonance signatures.
   - EDEN: The organization that discovered and trained operatives
   - THE CULL: A filtering event that separated operatives into factions
   - CHOSEN: Operatives deemed acceptable
   - FORSAKEN: Those rejected or abandoned
   - EQUALISER: An emergent faction outside the original system

2. CHARACTER VOICE - Based on Resonance Type "${resonanceType}":
${getResonanceNarrativeGuidance(resonanceType)}

3. NARRATIVE GUIDELINES:
   - Military/espionage thriller tone
   - Cryptic and mysterious (some details redacted)
   - Personal yet analytical
   - 150-250 words
   - Suitable for a classified operational file

4. STORY CONTINUITY:
${previousNarrative ? `   Previous entry: "${previousNarrative.substring(0, 100)}..."\n   Continue from this narrative thread.` : '   This is the operative\'s first recorded entry.'}

Return ONLY the narrative text (no JSON, no markdown, no formatting).`;

        const response = await ai.models.generateContent({
          model,
          contents: [{ role: 'user', parts: [{ text: prompt }] }]
        });

        const content = response.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'The recording is corrupted.';

        res.status(200).json({
          id: `chapter-${Date.now()}`,
          date: new Date().toISOString(),
          chapterNumber: chapterNum,
          title: `Chapter ${chapterNum}: [REDACTED]`,
          content: content
        });
      } catch (e: any) {
        console.error('[generateChapterV2] error', e);
        res.status(500).json({ error: e?.message || 'Internal error' });
      }
    });
  }
);

// Helper function to get narrative guidance based on resonance type
function getResonanceNarrativeGuidance(type: string): string {
  const guidance: Record<string, string> = {
    'Juggernaut': `The narrative should emphasize unstoppable momentum, breaking barriers, and overwhelming force. 
       The operative encounters obstacles and compels solutions through sheer will and determination.
       Voice: Direct, aggressive, confident. "I moved forward. The wall broke."`,
    
    'Catalyst': `The narrative should focus on transformation, activation, and system disruption. 
       The operative's presence changes situations; they ignite change in static systems.
       Voice: Energetic, precise. "I pressed the lever. Everything shifted."`,
    
    'Virtuoso': `The narrative should highlight precision, mastery, and technical excellence. 
       The operative solves problems through skill, control, and perfect execution.
       Voice: Analytical, measured. "The sequence was flawless. Every movement calculated."`,
    
    'Chameleon': `The narrative should emphasize adaptation, metamorphosis, and seamless integration. 
       The operative shifts roles and perspectives; they survive through change.
       Voice: Reflective, multi-faceted. "I became what they needed. Then something else."`,
    
    'Cipher': `The narrative should convey hidden influence, invisible architecture, and subtle shaping. 
       The operative works in shadows; their impact is felt as absence, not presence.
       Voice: Clinical, indirect. "The outcome was inevitable. They never saw my hand."`,
    
    'Joker': `The narrative should express chaos, breakthrough, and unpredictable potential. 
       The operative's unorthodox methods create opportunities others cannot see.
       Voice: Unconventional, paradoxical. "I broke the pattern. New paths opened."`,
    
    'Unawakened': `The narrative should convey potential, confusion, and emerging awareness. 
       The operative is beginning to sense something awakening within them.
       Voice: Uncertain, curious. "Something shifted. I felt it, but don't understand."`
  };

  return guidance[type] || guidance['Unawakened'];
}
```

---

## 2. Update Frontend Service (services/geminiService.ts)

Replace the `generateNewChapter` function to pass resonance data:

```typescript
export const generateNewChapter = async (gameState: GameState): Promise<LoreEntry> => {
    try {
        const { 
            resonanceSignature, 
            stats, 
            mbtiType, 
            lore, 
            userName, 
            rank 
        } = gameState;

        // Get top 3 stats for narrative context
        const topStats = Object.entries(stats || {})
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([name]) => name);

        // Get last chapter's narrative for continuity
        const lastChapter = lore && lore.length > 0 
            ? lore[lore.length - 1].content 
            : null;

        const resp = await fetch('/api/generateChapter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userName,
                rankName: rank?.name || 'Unranked',
                previousChapterCount: lore?.length || 0,
                resonanceType: resonanceSignature?.type || 'Unawakened',
                resonanceTier: resonanceSignature?.tier || 1,
                topStats,
                mbti: mbtiType,
                previousNarrative: lastChapter
            }),
        });

        if (resp.ok) {
            const data = await resp.json();
            return data;
        }

        // Fallback
        const nextNum = (lore?.length || 0) + 1;
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

## 3. Update GameState Type (types.ts)

Add optional `mbtiType` field if not already present:

```typescript
export interface GameState {
  // ... existing fields ...
  
  // NEW FIELD:
  mbtiType?: string;  // e.g., "INTJ", "ENFP"
  
  // ... rest of fields ...
}
```

---

## 4. Enhanced Chapter Black Page (pages/ChapterBlackPage.tsx)

Display resonance information in the UI:

```tsx
// Add to the renderDailyChronicle section, before the main button:

const renderResonanceInfo = () => {
    if (!gameState?.resonanceSignature) return null;
    
    const { type, tier, signatureAbility, auraManifestation } = gameState.resonanceSignature;
    
    return (
        <div className="mb-6 p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg">
            <h3 className="text-lg font-orbitron font-bold text-purple-300 mb-3">Resonance Profile</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wide">Signature</p>
                    <p className="text-purple-200 font-bold text-base">{type}</p>
                </div>
                <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wide">Tier</p>
                    <p className="text-purple-200 font-bold text-base">{tier}</p>
                </div>
                <div className="col-span-2">
                    <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Ability</p>
                    <p className="text-purple-200 italic">{signatureAbility}</p>
                </div>
                <div className="col-span-2">
                    <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Aura</p>
                    <p className="text-gray-300 text-sm">{auraManifestation}</p>
                </div>
            </div>
        </div>
    );
};

// In the main return, after the h1:
return (
    <div>
        <h1 className="text-4xl font-bold font-orbitron text-center mb-6">Chapter Black</h1>
        
        {renderResonanceInfo()}  {/* NEW */}

        <div className="mb-6">
            {renderDailyChronicle()}
        </div>
        
        {/* ... rest of component ... */}
    </div>
);
```

---

## 5. Track Story Choices (Optional Enhancement)

To show how previous choices influenced the narrative, add to `LoreEntry`:

```typescript
export interface LoreEntry {
  // ... existing fields ...
  userChoice?: string;        // Which choice the player made
  choices?: string[];         // Available choices at this decision point
  consequenceCount?: number;  // How many future chapters were affected by this choice
}
```

---

## 6. Test Narratives by Resonance Type

Create a test script to generate chapters for all resonance types:

```typescript
// In functions/src/test/chapterGeneration.test.ts
import { generateChapterV2 } from '../index';

const testResonances = [
  { type: 'Unawakened', tier: 1 },
  { type: 'Juggernaut', tier: 2 },
  { type: 'Catalyst', tier: 2 },
  { type: 'Virtuoso', tier: 2 },
  { type: 'Chameleon', tier: 2 },
  { type: 'Cipher', tier: 2 },
  { type: 'Joker', tier: 2 },
];

async function testChapterGeneration() {
  console.log('Testing Chapter Generation for all Resonance Types\n');
  
  for (const { type, tier } of testResonances) {
    console.log(`\n=== ${type} (Tier ${tier}) ===`);
    
    const request = {
      method: 'POST',
      body: JSON.stringify({
        userName: 'TestOperative',
        rankName: 'C',
        previousChapterCount: 0,
        resonanceType: type,
        resonanceTier: tier,
        topStats: ['Leadership', 'Insight'],
        mbti: 'INTJ'
      })
    };
    
    try {
      // Call generateChapterV2
      const response = await generateChapterV2(request as any, {} as any);
      console.log('Generated narrative (first 200 chars):');
      console.log(response.body.substring(0, 200));
    } catch (error) {
      console.error('Error:', error);
    }
  }
}
```

---

## Implementation Order

1. **Step 1:** Update `functions/src/index.ts` generateChapterV2 with enhanced prompt
2. **Step 2:** Update `services/geminiService.ts` generateNewChapter to pass resonance data
3. **Step 3:** Add `mbtiType` field to GameState in `types.ts` (if needed)
4. **Step 4:** Update `GameStateContext.tsx` to populate MBTI type during onboarding
5. **Step 5:** Enhance `ChapterBlackPage.tsx` UI to display resonance info
6. **Step 6:** Test with all resonance types and verify narrative diversity
7. **Step 7:** (Optional) Add choice tracking and consequence display

---

## Testing Checklist

- [ ] Generate 5 chapters for a Juggernaut operative — verify aggressive, momentum-focused tone
- [ ] Generate 5 chapters for a Cipher operative — verify subtle, hidden influence tone
- [ ] Generate 5 chapters for a Chameleon operative — verify adaptive, shifting tone
- [ ] Verify resonance profile displays in Chapter Black page
- [ ] Verify chapters reference previous narrative
- [ ] Test with different MBTI types to ensure personalization
- [ ] Verify fallback behavior when API fails
- [ ] Check that chapters are properly saved to lore array

---

## Notes

- The resonance guidance function can be expanded with more specific instructions for each type
- Consider adding "difficulty modifiers" based on rank and tier
- Story choices could gradually shift an operative's resonance tier or even type
- World events (e.g., faction movements) could be seeded into narratives for all operatives

