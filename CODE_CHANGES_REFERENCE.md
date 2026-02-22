# Resonance & Chapter Black - Code Change Reference

This document shows the exact code changes needed for Priority 1 implementation (Enhanced Chapter Black Integration).

---

## File 1: functions/src/index.ts - generateChapterV2 Enhancement

### Location: Lines 746-820

### Change: Enhance the prompt to include resonance context

**BEFORE:**
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

**AFTER:**
```typescript
// Extract optional parameters from request body
const resonanceType = String(body.resonanceType || 'Unawakened');
const resonanceTier = Number(body.resonanceTier || 1);
const topStats = (body.topStats as string[] || []).join(', ') || 'Unknown';
const mbti = String(body.mbti || 'Unknown');
const previousNarrative = String(body.previousNarrative || '');

// Build resonance guidance based on type
const resonanceGuidance = getResonanceNarrativeGuidance(resonanceType);

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
${resonanceGuidance}

3. NARRATIVE GUIDELINES:
   - Military/espionage thriller tone
   - Cryptic and mysterious (some details redacted)
   - Personal yet analytical
   - 150-250 words
   - Suitable for a classified operational file

4. STORY CONTINUITY:
${previousNarrative && previousNarrative.length > 0 ? `   Previous entry: "${previousNarrative.substring(0, 100)}..."\n   Continue from this narrative thread.` : '   This is the operative\'s first recorded entry.'}

Return ONLY the narrative text (no JSON, no markdown, no formatting).`;
```

### Additional Change: Add helper function at top of file

Add this function somewhere before `generateChapterV2`:

```typescript
function getResonanceNarrativeGuidance(type: string): string {
  const guidance: Record<string, string> = {
    'Juggernaut': `Emphasize unstoppable momentum, breaking barriers, overwhelming force. 
       The operative encounters obstacles and compels solutions through sheer will and determination.
       Voice: Direct, aggressive, confident. "I moved forward. The wall broke."`,
    
    'Catalyst': `Focus on transformation, activation, system disruption. 
       The operative's presence changes situations; they ignite change in static systems.
       Voice: Energetic, precise. "I pressed the lever. Everything shifted."`,
    
    'Virtuoso': `Highlight precision, mastery, technical excellence. 
       The operative solves problems through skill, control, and perfect execution.
       Voice: Analytical, measured. "The sequence was flawless. Every movement calculated."`,
    
    'Chameleon': `Emphasize adaptation, metamorphosis, seamless integration. 
       The operative shifts roles and perspectives; they survive through change.
       Voice: Reflective, multi-faceted. "I became what they needed. Then something else."`,
    
    'Cipher': `Convey hidden influence, invisible architecture, subtle shaping. 
       The operative works in shadows; their impact is felt as absence, not presence.
       Voice: Clinical, indirect. "The outcome was inevitable. They never saw my hand."`,
    
    'Joker': `Express chaos, breakthrough, unpredictable potential. 
       The operative's unorthodox methods create opportunities others cannot see.
       Voice: Unconventional, paradoxical. "I broke the pattern. New paths opened."`,
    
    'Unawakened': `Convey potential, confusion, emerging awareness. 
       The operative is beginning to sense something awakening within them.
       Voice: Uncertain, curious. "Something shifted. I felt it, but don't understand."`
  };

  return guidance[type] || guidance['Unawakened'];
}
```

---

## File 2: services/geminiService.ts - generateNewChapter Enhancement

### Location: Lines 221-260

### Change: Pass resonance data to Cloud Function

**BEFORE:**
```typescript
export const generateNewChapter = async (gameState: GameState): Promise<LoreEntry> => {
    try {
        const resp = await fetch('/api/generateChapter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userName: gameState.userName,
                rankName: gameState.rank?.name || 'Unranked',
                previousChapterCount: gameState.lore?.length || 0
            }),
        });
        // ... rest of function
```

**AFTER:**
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
        const topStats = stats 
            ? Object.entries(stats)
                .sort(([, a], [, b]) => (b || 0) - (a || 0))
                .slice(0, 3)
                .map(([name]) => name)
            : [];

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
                // NEW FIELDS:
                resonanceType: resonanceSignature?.type || 'Unawakened',
                resonanceTier: resonanceSignature?.tier || 1,
                topStats,
                mbti: mbtiType,
                previousNarrative: lastChapter
            }),
        });
        // ... rest of function
```

---

## File 3: types.ts - Add mbtiType field (Optional)

### Location: GameState interface (around line 480-520)

### Change: Add optional MBTI type field

Add this line to the GameState interface:

```typescript
export interface GameState {
  // ... existing fields ...
  
  mbtiType?: string;  // E.g., "INTJ", "ENFP", etc.
  
  // ... rest of fields ...
}
```

**Note:** If MBTI type is not being tracked yet, you can hardcode it as 'Unknown' in the geminiService until onboarding captures it.

---

## File 4: pages/ChapterBlackPage.tsx - Display Resonance Info (Optional)

### Location: Around line 150, before renderDailyChronicle()

### Change: Add resonance profile display

Add this function inside the component:

```typescript
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
```

Then in the return statement, add this after the `<h1>` tag:

```typescript
return (
    <div>
        <h1 className="text-4xl font-bold font-orbitron text-center mb-6">Chapter Black</h1>
        
        {renderResonanceInfo()}  {/* ADD THIS */}

        <div className="mb-6">
            {renderDailyChronicle()}
        </div>
        
        {/* ... rest of component unchanged ... */}
    </div>
);
```

---

## File 5: GameStateContext.tsx - Populate mbtiType (Optional)

### Location: seedInitialState function (around line 217-226)

### Change: Capture MBTI type during onboarding

**BEFORE:**
```typescript
seedInitialState: (stats, xp = 0, calibrationAnalysis, initialStatsSnapshot, username, talentDna, talentArchetype, biometrics, resonanceVector) => {
    // ...
    userName: name, 
    hasOnboarded: true, 
    rank: calculatedRank, 
    xp, 
    stats, 
    // ...
}
```

**AFTER:**
```typescript
seedInitialState: (stats, xp = 0, calibrationAnalysis, initialStatsSnapshot, username, talentDna, talentArchetype, biometrics, resonanceVector, mbtiType) => {
    // ...
    userName: name, 
    hasOnboarded: true, 
    mbtiType,  // ADD THIS
    rank: calculatedRank, 
    xp, 
    stats, 
    // ...
}
```

Also update the function signature if needed:
```typescript
seedInitialState: (
    stats: Stat[], 
    xp?: number, 
    calibrationAnalysis?: GameState['calibrationAnalysis'], 
    initialStatsSnapshot?: Stat[] | null, 
    username?: string, 
    talentDna?: TalentDna, 
    talentArchetype?: string, 
    biometrics?: GameState['biometrics'], 
    resonanceVector?: ResonanceVector,
    mbtiType?: string  // ADD THIS
) => void;
```

---

## Testing Changes

### Quick Test: Chapter Generation

Test by calling the endpoint directly:

```bash
curl -X POST http://localhost:5001/genesis-protocol-test/us-central1/generateChapterV2 \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "TestOperative",
    "rankName": "C",
    "previousChapterCount": 0,
    "resonanceType": "Catalyst",
    "resonanceTier": 2,
    "topStats": ["Leadership", "Insight"],
    "mbti": "INTJ"
  }'
```

Expected: Should receive a JSON response with a narrative that reflects Catalyst resonance type.

### Test Checklist

- [ ] Juggernaut narrative feels aggressive and momentum-focused
- [ ] Catalyst narrative feels transformative and energetic
- [ ] Virtuoso narrative feels precise and controlled
- [ ] Chameleon narrative feels adaptive and shifting
- [ ] Cipher narrative feels subtle and hidden
- [ ] Joker narrative feels chaotic and unconventional
- [ ] Unawakened narrative feels uncertain and potential-focused
- [ ] Resonance info displays in Chapter Black UI
- [ ] Chapters link to previous narrative when available

---

## Deployment Notes

### Before Deploying:
1. Test all resonance types with sample requests
2. Verify Cloud Function has access to GEMINI_API_KEY
3. Ensure frontend can reach /api/generateChapter endpoint
4. Check that lore array is properly initialized in GameState

### Deployment Steps:
1. Deploy Cloud Functions: `firebase deploy --only functions`
2. Deploy frontend: `npm run build && firebase deploy`
3. Monitor logs for any generation errors
4. Test in staging environment first
5. Gradual rollout to production

### Rollback Plan:
If issues occur:
1. Revert Cloud Function to previous prompt
2. Frontend will still work (just with less detailed narratives)
3. No data loss; narratives are purely generative

---

## Estimated Implementation Time

| Task | Time |
|------|------|
| Review & understand current code | 30 min |
| Update Cloud Function | 30 min |
| Update frontend service | 15 min |
| Update types.ts | 10 min |
| Update ChapterBlackPage UI | 30 min |
| Test all resonance types | 45 min |
| Fix any issues | 30 min |
| **Total** | **~3.5 hours** |

---

**Note:** Code examples provided are TypeScript/JavaScript. Adjust syntax as needed for your environment.

**Last Updated:** 2025-01-19
