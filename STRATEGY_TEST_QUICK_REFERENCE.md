# Genesis Protocol - New Strategy Test Quick Reference

## Component Overview

**Component Name**: `OptimizationStrategyTest`  
**Location**: `/pages/OnboardingPage.tsx` (lines 910-1070)  
**Type**: Strategic Decision-Making Assessment  
**Duration**: ~3-4 minutes  
**Scenarios**: 6  
**Score Range**: 0-100

---

## The 6 Scenarios

### 1️⃣ Resource Allocation
**$100k startup budget - How do you distribute?**
- Optimal: 40% product, 30% team, 20% marketing, 10% legal (Score: 85)
- Teaches: Balanced resource distribution, team stability importance

### 2️⃣ Team Conflict Resolution  
**Engineers disagree on tech stack - 8-week deadline**
- Optimal: Hybrid (proven core + cutting-edge features) (Score: 90)
- Teaches: Consensus-building, risk mitigation, stakeholder management

### 3️⃣ Crisis Triage
**30% user loss to competitor - Limited focus**
- Optimal: Analyze root causes, address top 3 reasons (Score: 85)
- Teaches: Data-driven decisions under pressure, root cause analysis

### 4️⃣ Partnership Decision
**40% revenue cut, 3-year exclusivity - Good deal?**
- Optimal: Negotiate (1 year, 25%, non-exclusive) (Score: 88)
- Teaches: Contract negotiation, maintaining optionality, long-term thinking

### 5️⃣ Talent Retention
**Best engineer has competing offer (25% higher salary)**
- Optimal: Lead role + equity + sabbatical (Score: 90)
- Teaches: Understanding intrinsic motivation, retention strategy, growth pathways

### 6️⃣ Market Pivot
**Niche plateau ($2M ARR) vs. emerging market (5x larger)**
- Optimal: Hedge with 40% resources to new market (Score: 85)
- Teaches: Growth vs. safety, calculated risk-taking, hedging strategies

---

## Scoring Breakdown

### Three Scoring Dimensions

**EFFICIENCY** (0-100)
- How well the choice allocates resources and achieves goals
- Reactive choices: 60-75
- Strategic choices: 80-85

**FORESIGHT** (0-100)
- How well it anticipates long-term consequences
- Myopic choices: 40-60
- Forward-thinking: 85-90

**BALANCE** (0-100)
- How well it manages competing interests
- Lopsided choices: 50-70
- Balanced choices: 85-90

### Final Calculation
```
Final Score = (Sum of all 6 choice scores) / 6
Range: 0-100
```

---

## Test Flow

```
┌─────────────────────────────────┐
│      BRIEFING PHASE             │
│  - Explains test purpose        │
│  - Shows duration (6 scenarios) │
│  - User clicks START            │
└─────────────────────────────────┘
           ↓
┌─────────────────────────────────┐
│      ACTIVE PHASE (×6)          │
│  - Scenario displayed           │
│  - Context provided             │
│  - 4 choice options             │
│  - User selects one             │
└─────────────────────────────────┘
           ↓
┌─────────────────────────────────┐
│      FEEDBACK PHASE (×6)        │
│  - Reasoning displayed          │
│  - Metrics shown                │
│  - Score for choice: /100       │
│  - User clicks NEXT             │
└─────────────────────────────────┘
           ↓
┌─────────────────────────────────┐
│      COMPLETION                 │
│  - Final average score: /100    │
│  - History saved                │
│  - Onboarding continues         │
└─────────────────────────────────┘
```

---

## Feedback Example

After selecting choice:
```
┌────────────────────────────────────┐
│ 💡 STRATEGIC ANALYSIS              │
├────────────────────────────────────┤
│ "Balanced approach. Team stability,│
│  market awareness, legal buffer."  │
├────────────────────────────────────┤
│ Efficiency:  80    |     Foresight: 85     │
│ Balance:     85    |     Score:     85/100 │
└────────────────────────────────────┘
```

---

## Key Differences from Previous War Room Test

| Feature | Old War Room | New Optimization |
|---------|-------------|------------------|
| Scenarios | 8 geopolitical | 6 business-focused |
| Duration | 5-8 minutes | 3-4 minutes |
| API Calls | Yes (Gemini) | None (pre-built) |
| Feedback | Delayed/opaque | Immediate/transparent |
| Metrics | Implicit (nation stats) | Explicit (3 dimensions) |
| Failure Mode | Complete crash | N/A |
| Learning Value | Low | High |
| Mobile-Friendly | Partial | Full |

---

## Integration Details

### In OnboardingPage.tsx
```tsx
// Component definition (line 910)
const OptimizationStrategyTest: React.FC<...>

// Component usage (line 1437)
{step.id === 'high-stakes-war-room' && <OptimizationStrategyTest onComplete={handleStepComplete} />}
```

### In calibrationData.ts
```typescript
{
    id: 'high-stakes-war-room',
    type: 'strategy-optimization',
    title: 'Strategic Optimization Protocol',
}
```

### Data Passed to Handler
```typescript
{
    strategyScore: 78,  // Final average (0-100)
    history: [
        {
            scenario: "RESOURCE ALLOCATION",
            chosen: "40% product, 30% team...",
            score: 85,
            feedback: "Balanced allocation..."
        },
        // ... 5 more entries
    ]
}
```

---

## Testing Checklist

- [x] Component renders without errors
- [x] All 6 scenarios display correctly
- [x] Each scenario has 4 functional choices
- [x] Feedback displays after selection
- [x] Scoring calculates correctly
- [x] Final score returned to handler
- [x] Mobile layout responsive
- [x] No external API calls needed
- [x] Instant feedback (no loading)
- [x] Onboarding continues after completion

---

## User Experience

**What Users See**:
1. Brief explanation of test
2. 6 business dilemmas, one at a time
3. Immediate feedback on each decision
4. Clear reasoning for scores
5. Final overall score
6. Progress to calibration report

**What Users Learn**:
- How they approach resource allocation
- Their conflict resolution style
- How they handle crises
- Their negotiation instincts
- Their people management philosophy
- Their risk tolerance

---

## Technical Notes

**Performance**:
- No async operations (instant feedback)
- Minimal re-renders
- Smooth mobile scrolling
- ~2KB additional bundle size

**Browser Support**:
- Chrome/Edge: ✅
- Firefox: ✅
- Safari: ✅
- Mobile browsers: ✅

**Accessibility**:
- Semantic HTML
- Proper contrast ratios
- Readable font sizes
- Touch-friendly buttons

---

## Future Enhancement Ideas

1. **Scenario Randomization**: Different order per user
2. **Dynamic Difficulty**: Adjust based on reasoning score
3. **Expert Analysis**: Show optimal choice after test
4. **A/B Testing**: Test scenario variations
5. **Performance Analytics**: Track decision patterns by cohort

---

**Ready for Production**: ✅ YES  
**Build Status**: ✅ PASSING  
**Last Updated**: Current Session
