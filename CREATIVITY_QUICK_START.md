# Quick Start: Using the New Creativity Assessment

## For Developers

### Import the Assessment System
```typescript
import { 
  CREATIVITY_ASSESSMENT_PROMPTS,
  CREATIVITY_ASSESSMENT_SYSTEM_PROMPT,
  CREATIVITY_PERCENTILE_THRESHOLDS,
  calculateHATI,
  percentileToGrade
} from './data/creativityAssessmentFinal';

import { evaluateCreativityAnswers } from './services/geminiService';
```

### Evaluate User Responses
```typescript
// User completes 5 prompts
const responses = {
  imagination: "I could use a coffee mug to store small tools...",
  innovation: "I adapted the Pomodoro technique by...",
  style: "My unique approach is always adding humor...",
  vision: "I want to build a platform that helps...",
  expression: "I created a short film where..."
};

// Get AI evaluation (0-100 percentile for each substat)
const evaluation = await evaluateCreativityAnswers(responses);

// Result structure:
{
  Imagination: { percentile: 65, signals: "Shows feasible, creative repurposing..." },
  Innovation: { percentile: 72, signals: "Clear framework-level thinking..." },
  Style: { percentile: 58, signals: "Consistent voice but less distinctive..." },
  Vision: { percentile: 80, signals: "Multi-layered timeframe thinking..." },
  Expression: { percentile: 70, signals: "Clear narrative with emotional depth..." }
}
```

### Calculate HATI and Grade
```typescript
import { calculateHATI, percentileToGrade } from './data/creativityAssessmentFinal';

const hati = calculateHATI({
  Imagination: 65,
  Innovation: 72,
  Style: 58,
  Vision: 80,
  Expression: 70
});
// Result: 69 (average percentile)

const grade = percentileToGrade(hati);
// Result: "B" (B = 60-74)
```

### Access the Prompts
```typescript
CREATIVITY_ASSESSMENT_PROMPTS.forEach((prompt) => {
  console.log(`${prompt.substat}: ${prompt.prompt}`);
  console.log(`Definition: ${prompt.definition}`);
  console.log(`Guidance: ${prompt.scoringGuidance.join(', ')}`);
});
```

## For UI/UX

### User-Facing Instructions
The system is transparent about what's being evaluated:
```
Prompt 1/5: IMAGINATION
Definition: Idea generation potential. The internal engine of possibility.
"Tell me a new way you could use a common object, tool, or skill in your daily life."

[Timer: 90s] [Word count: 42]
```

### Displaying Results
```
HATI: 69.0%
Grade: B (High Threat Level)

Substats:
- Imagination: 65% (C)
- Innovation: 72% (B)
- Style: 58% (C)
- Vision: 80% (A)
- Expression: 70% (B)
```

## For Integration

### Step 1: Confirm CreativeProtocolTest Works
- Navigate to onboarding
- Complete all 5 prompts
- Check that responses are collected correctly

### Step 2: Verify API Calls
- Check network tab for POST to Gemini API
- Confirm response includes all 5 substats
- Verify fallback works if API fails

### Step 3: Check Stat Initialization
- After onboarding, open RankPage
- Verify Creativity stat matches evaluation
- Check HATI calculation in console

## Common Tasks

### Add Custom Prompts (if needed)
```typescript
const customPrompts = [
  {
    id: 'custom_1' as const,
    substat: 'Imagination' as const,
    prompt: "Your custom question here",
    definition: "What this measures",
    scoringGuidance: ["Criteria 1", "Criteria 2"]
  }
];
```

### Adjust Percentile Thresholds (if needed)
```typescript
// In creativityAssessmentFinal.ts
export const CREATIVITY_PERCENTILE_THRESHOLDS = {
  E: { min: 0, max: 24, label: 'E', threatLevel: 'Minimal' },  // Changed from 19
  // ... etc
};
```

### Enable Re-Assessment
```typescript
// Create a side mission or button to restart creativity assessment
const handleCreativityReassessment = async () => {
  // Show CreativeProtocolTest again
  // Update Creativity stat with new score
  // Log to Firestore for tracking
};
```

## Testing Checklist

- [ ] User can complete all 5 prompts without errors
- [ ] Empty responses are handled gracefully
- [ ] API evaluates responses and returns normalized scores
- [ ] Fallback works when API fails
- [ ] HATI is calculated correctly as average
- [ ] Grade mapping matches percentile ranges
- [ ] RankPage displays updated Creativity stat
- [ ] Onboarding completes successfully

## Troubleshooting

### "Failed to parse JSON" in geminiService
- Check that Gemini response includes all 5 substats
- Verify system prompt is being passed correctly
- Check for malformed JSON in response

### Scores are all 50 (fallback)
- API likely failed silently
- Check Gemini API key in environment
- Verify network connectivity

### Wrong grade for percentile
- Check `percentileToGrade()` mapping
- Verify percentile is being calculated as average
- Check CREATIVITY_PERCENTILE_THRESHOLDS values

## Support

For questions or issues:
1. Check CREATIVITY_ASSESSMENT_INTEGRATION.md (full docs)
2. Review creativityAssessmentFinal.ts (spec)
3. Check geminiService.ts evaluateCreativityAnswers() (implementation)
