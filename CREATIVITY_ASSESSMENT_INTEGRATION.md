# Genesis Protocol – Creativity Assessment System Integration

## Overview
The Genesis Protocol creativity assessment system has been overhauled with a **5-prompt, universal system** that evaluates creativity across:
- **Imagination** - Idea generation potential
- **Innovation** - Ability to combine ideas into novelty
- **Style** - Aesthetic identity and unique signature
- **Vision** - Conceptual foresight
- **Expression** - Articulative output and impact

## Files Modified

### 1. **data/creativityAssessmentFinal.ts** (NEW)
Complete assessment specification including:
- 5 prompts with definitions and scoring guidance
- System prompt for Gemini/LLM AI evaluation
- Percentile-to-grade mapping (E → SS+)
- Helper functions for HATI calculation
- User instructions (visible during onboarding)

**Key Exports:**
```typescript
CREATIVITY_ASSESSMENT_PROMPTS[] // The 5 prompts
CREATIVITY_ASSESSMENT_SYSTEM_PROMPT // AI system instruction
CREATIVITY_PERCENTILE_THRESHOLDS // Grade thresholds
calculateHATI() // Calculate Human Apex Threat Index
percentileToGrade() // Map percentile to letter grade
```

### 2. **services/geminiService.ts** (UPDATED)
Enhanced `evaluateCreativityAnswers()` function:
- Uses the new `CREATIVITY_ASSESSMENT_SYSTEM_PROMPT`
- Evaluates 5 responses and returns normalized scores (0-100 percentile)
- Includes fallback for API failures
- Returns detailed signals/evidence for each substat

**New Function Signature:**
```typescript
evaluateCreativityAnswers(
  inputs: Record<'imagination' | 'innovation' | 'style' | 'vision' | 'expression', string>
): Promise<{
  [substat]: {
    percentile: number;  // 0-100
    signals: string;     // Evidence from response
  }
}>
```

### 3. **pages/OnboardingPage.tsx** (UPDATED)
Replaced single-prompt `CreativeProtocolTest` with **5-prompt sequential system**:

#### Changes:
- User answers 5 separate prompts, 90 seconds each
- Clear briefing for each prompt with definition
- Progress indicator (Prompt X of 5)
- All responses collected before evaluation
- Integrated AI evaluation via `evaluateCreativityAnswers()`

#### Updated `finalizeOnboarding()`:
- Extracts creativity responses from `inputs['creative-protocol-test']`
- Calls `evaluateCreativityAnswers()` with all 5 responses
- Calculates average percentile across substats
- Uses result for Creativity stat initialization
- Fallback to 50 if evaluation fails

## Scoring System

### Percentile Thresholds (0-100)
| Grade | Percentile Range | Threat Level |
|-------|-----------------|--------------|
| E | 0-19 | Minimal |
| D | 20-39 | Low |
| C | 40-59 | Moderate |
| B | 60-74 | High |
| A | 75-89 | Critical |
| S | 90-96 | Extreme |
| SS | 97-99 | Omega |
| SS+ | 99.9-100 | Transcendent |

### AI Scoring Guidance
The Gemini system prompt includes:
- **Clear evaluation criteria** for each substat
- **Concrete examples** at each percentile level (reference only, not shown to users)
- **Scoring rules** emphasizing authenticity and originality
- **Fallback instructions** for edge cases

### HATI Integration
HATI (Human Apex Threat Index) is calculated as the **average of all 5 substats**:
```typescript
HATI = (Imagination + Innovation + Style + Vision + Expression) / 5
```

## User Experience Flow

### Step 1: Briefing (per prompt)
```
"IMAGINATION"
Definition: Idea generation potential. The internal engine of possibility.

Prompt: Tell me a new way you could use a common object, tool, or skill in your daily life.

[BEGIN] button
```

### Step 2: Response Collection (90 seconds per prompt)
- Textarea with word count
- Timer with red alert below 20 seconds
- Auto-submission on timeout
- Clear next/complete button

### Step 3: Evaluation (post-assessment)
- All 5 responses sent to Gemini
- System evaluates across all substats simultaneously
- Results integrate into Creativity stat

## Handling Edge Cases

### Missing or Invalid Responses
- If user skips a prompt → records as empty string
- Gemini evaluates empty string as 0-10 percentile (E grade)
- System continues without errors

### API Failures
- Falls back to neutral 50th percentile for all substats
- User is notified: "Assessment unavailable; neutral baseline applied"
- Does not block onboarding

### No Creativity Responses
- If user never reaches creative protocol test
- Defaults to 50th percentile (C grade)
- Game can proceed normally

## Deployment Checklist

- [x] Created `creativityAssessmentFinal.ts` with spec
- [x] Updated `evaluateCreativityAnswers()` in Gemini service
- [x] Replaced `CreativeProtocolTest` component with 5-prompt version
- [x] Updated `finalizeOnboarding()` to evaluate creativity scores
- [ ] Test end-to-end onboarding with creativity assessment
- [ ] Verify HATI displays correctly on RankPage
- [ ] Test API failures and fallbacks
- [ ] Document user instructions in-game

## Next Steps (Optional)

1. **Add Creativity Results Dashboard**
   - Display breakdown of all 5 substats
   - Show percentile and grade for each
   - Include "signals" (evidence) for transparency

2. **Store Creativity Assessments**
   - Save full results to Firestore
   - Track improvement over time
   - Compare to other players (anonymously)

3. **Tier-Up System**
   - Allow re-assessment of Creativity stat after X missions
   - Track progression separately from other stats

4. **Specialized Assessment Modes**
   - Domain-specific creativity (music, art, tech, writing, etc.)
   - Tailor prompts to user's domain of expertise

## References

**Key Files:**
- `/Users/sylviaukanga/Desktop/Genesis-Protocol/data/creativityAssessmentFinal.ts`
- `/Users/sylviaukanga/Desktop/Genesis-Protocol/data/creativityAssessmentData.ts` (legacy, can archive)
- `/Users/sylviaukanga/Desktop/Genesis-Protocol/services/geminiService.ts`
- `/Users/sylviaukanga/Desktop/Genesis-Protocol/pages/OnboardingPage.tsx`
- `/Users/sylviaukanga/Desktop/Genesis-Protocol/constants.ts` (RANK_PERCENTILES)

**Related Components:**
- `RankPage.tsx` - Displays HATI and grade progression
- `ClassifiedDossier.tsx` - Shows calibration results
- `CreativityAssessmentData.ts` - Legacy system (archive after validation)
