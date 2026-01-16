# Strategy Test Documentation Index

## Overview

This documentation suite provides comprehensive explanation of Genesis Protocol's **Strategic Optimization Protocol** — the final calibration test that evaluates strategic thinking and feeds directly into the player's dossier and main gameplay experience.

---

## Documentation Structure

### 1. **STRATEGY_TEST_COMPLETE_GUIDE.md** (Main Reference)
**Purpose:** Comprehensive technical and conceptual guide  
**Length:** ~2,500 words  
**Best for:** Understanding the complete system

**Contents:**
- Test structure (6 scenarios with detailed context)
- Grading mechanism (Efficiency, Foresight, Balance metrics)
- Integration into dossier (how scores become substats)
- Onboarding flow (step-by-step after test completion)
- Data storage structure
- Feedback architecture (why show feedback?)
- Testing scenarios with expected score ranges
- Integration with other substats
- Validation & error handling
- Visual UI flow examples
- Summary table

**Key Sections:**
- Part 2: How each scenario is graded
- Part 3: How results flow into the dossier
- Part 4: Onboarding flow after test completion
- Part 7: Testing scenarios with expected scores

---

### 2. **STRATEGY_TEST_VISUAL_FLOWS.md** (Diagrams & Flowcharts)
**Purpose:** Visual representation of data and state flows  
**Length:** ~1,500 words  
**Best for:** Understanding architecture and system behavior

**Contents:**
- User journey through test (ASCII flowchart)
- Score calculation flow (step-by-step computation)
- Integration into substats (how raw score becomes stat value)
- Test data storage & retrieval (state management)
- Mobile responsiveness flow (responsive design at different breakpoints)
- Test state transitions (phase changes in component)
- Score distribution visualization (histograms for different player types)
- Full onboarding sequence (all 16 steps + strategy test)
- Error handling flow (what happens when things go wrong)
- Performance & rendering notes

**Key Diagrams:**
1. Full user journey (briefing → scenarios → dossier → game)
2. Score calculation formula
3. Data flow through storage and integration
4. State machine (briefing → active → feedback → next)
5. Mobile vs. desktop vs. tablet layouts
6. Score distribution for optimal/mediocre/poor players

---

### 3. **STRATEGY_TEST_FAQS_EXAMPLES.md** (Practical Guide)
**Purpose:** Answer common questions with concrete examples  
**Length:** ~2,000 words  
**Best for:** Designers, players, QA testers

**Contents:**
- Frequently Asked Questions (30+ questions across 8 categories)
- Detailed explanations of Efficiency, Foresight, Balance
- Three worked examples (Emma the Balanced, Marcus the Efficient, Aisha the Conservative)
- Score impact on dossier and gameplay
- Accessibility & inclusion considerations
- Key takeaways

**FAQ Categories:**
1. General Questions (what, why, how long, can skip?)
2. Scoring Questions (how scored, metrics, perfect score)
3. Feedback Questions (why transparent, feedback content)
4. Integration Questions (how scores flow, affect other stats)
5. Technical Questions (where's the code, can randomize, retry)
6. Player Experience Questions (who scores high/low, difficulty)
7. Narrative & Lore Questions (why these scenarios, are they realistic)
8. Accessibility & Inclusion Questions (fair to all players, language, culture)

**Worked Examples:**
- Emma (Balanced Thinker): 86/100 final score
- Marcus (Efficiency-focused): 60/100 final score
- Aisha (Conservative): 72/100 final score

---

## Quick Navigation

### By Use Case

**I need to understand the test grading system:**
→ `STRATEGY_TEST_COMPLETE_GUIDE.md`, Part 2

**I need to see how data flows through the system:**
→ `STRATEGY_TEST_VISUAL_FLOWS.md`, Sections 2-4

**I need to understand how the test integrates into the dossier:**
→ `STRATEGY_TEST_COMPLETE_GUIDE.md`, Part 3

**I want to understand the onboarding flow after this test:**
→ `STRATEGY_TEST_COMPLETE_GUIDE.md`, Part 4 or `STRATEGY_TEST_VISUAL_FLOWS.md`, Section 8

**I want to know what scores mean for the game:**
→ `STRATEGY_TEST_FAQS_EXAMPLES.md`, Worked Examples section

**I want to understand mobile responsiveness:**
→ `STRATEGY_TEST_VISUAL_FLOWS.md`, Section 5

**I need to see state transitions and phase changes:**
→ `STRATEGY_TEST_VISUAL_FLOWS.md`, Section 6

**I want examples of different player types:**
→ `STRATEGY_TEST_FAQS_EXAMPLES.md`, Worked Examples

**I need technical code locations and function names:**
→ `STRATEGY_TEST_COMPLETE_GUIDE.md`, Part 12

**I need to know about feedback architecture:**
→ `STRATEGY_TEST_COMPLETE_GUIDE.md`, Part 6

---

### By Audience

**For Game Designers:**
1. `STRATEGY_TEST_FAQS_EXAMPLES.md` — Understand player experience and archetypes
2. `STRATEGY_TEST_COMPLETE_GUIDE.md`, Parts 3-4 — How results affect gameplay
3. `STRATEGY_TEST_VISUAL_FLOWS.md`, Section 7 — Score distributions

**For Engineers/Developers:**
1. `STRATEGY_TEST_COMPLETE_GUIDE.md`, Part 12 — Technical details and code locations
2. `STRATEGY_TEST_VISUAL_FLOWS.md`, Sections 2-4 — Data and state flows
3. `STRATEGY_TEST_COMPLETE_GUIDE.md`, Part 2 — Scoring algorithm

**For QA Testers:**
1. `STRATEGY_TEST_COMPLETE_GUIDE.md`, Part 9 — Validation and error cases
2. `STRATEGY_TEST_VISUAL_FLOWS.md`, Section 9 — Error handling flow
3. `STRATEGY_TEST_FAQS_EXAMPLES.md`, Accessibility section

**For Product Managers:**
1. `STRATEGY_TEST_COMPLETE_GUIDE.md`, Overview and Part 4 — Product flow
2. `STRATEGY_TEST_FAQS_EXAMPLES.md` — Player experience and impact
3. `STRATEGY_TEST_VISUAL_FLOWS.md`, Section 1 — User journey

**For Writers/Narrative Designers:**
1. `STRATEGY_TEST_FAQS_EXAMPLES.md`, Narrative & Lore section
2. `STRATEGY_TEST_COMPLETE_GUIDE.md`, Part 1 — Scenario content
3. `STRATEGY_TEST_FAQS_EXAMPLES.md`, Worked Examples — Character archetypes

---

## The Three Metrics Explained

### Efficiency (Resource Optimization)
- **High:** Maximizes output with minimum waste
- **Low:** Wasteful, inefficient resource use
- **Example High:** Hybrid tech stack (de-risks core, allows innovation)
- **Example Low:** Go all-in on cutting-edge tech (all-or-nothing, risky)

### Foresight (Long-term Thinking)
- **High:** Anticipates second-order effects and future consequences
- **Low:** Reactive, ignores downstream implications
- **Example High:** Data-driven crisis response (targets root causes)
- **Example Low:** Immediately rebuild lost features (reactive chasing)

### Balance (Holistic Approach)
- **High:** Balances competing interests, maintains optionality
- **Low:** Extreme, lopsided, creates fragility
- **Example High:** Hedged market pivot (preserves base, allows learning)
- **Example Low:** Stay in current market only (ignores opportunity)

---

## Score Interpretation

| Final Score | Percentile | Archetype | Play Style | Strengths | Weaknesses |
|-------------|-----------|-----------|-----------|-----------|-----------|
| 85-100 | 85-100 | Strategic Leader | Long-term, holistic | Balanced thinking, foresight | Slower decisions |
| 70-84 | 70-84 | Wise Manager | Mixed approach | Good balance, competent | Some blind spots |
| 55-69 | 55-69 | Pragmatic Executor | Efficiency-focused | Fast action, efficiency | Limited planning |
| 40-54 | 40-54 | Tactical Doer | Reactive, short-term | Immediate execution | Poor long-term strategy |
| <40 | <40 | Impulsive Actor | Extreme, erratic | Quick decisions | Chaotic, unbalanced |

---

## Code Reference

### Component Location
**File:** `/pages/OnboardingPage.tsx`  
**Lines:** 910-1050  
**Component:** `OptimizationStrategyTest`

### Data Definition
**File:** `/data/calibrationData.ts`  
**Benchmark ID:** `high-stakes-war-room`  
**Type:** `strategy-optimization`

### Score Integration
**File:** `/services/scoringService.ts`  
**Function:** `calculateSubstatsFromAllTests()`  
**Lines:** 286-400  
**Key Line:** `substats[SubStatName.Strategy] = average([strategyScore, strategyReasoning]);`

### Test Rendering
**File:** `/pages/OnboardingPage.tsx`  
**Line:** 1437  
```tsx
{step.id === 'high-stakes-war-room' && <OptimizationStrategyTest onComplete={handleStepComplete} />}
```

---

## Data Flow Summary

```
OptimizationStrategyTest Component
    ↓
    User completes 6 scenarios
    ↓
    onComplete({ strategyScore: 86, history: [...] })
    ↓
handleStepComplete()
    ↓
    Stored in: allInputs['high-stakes-war-room']
    ↓
    if (stepIndex >= 15): finalizeOnboarding(allInputs)
    ↓
calculateSubstatsFromAllTests(inputs)
    ↓
    Extracts: strategyWar = inputs['high-stakes-war-room']
    ↓
    Combines: average([strategyScore, reasonScore * 0.7])
    ↓
    Result: substats[SubStatName.Strategy] = XX (capped at 95)
    ↓
generateFullCalibrationReport()
    ↓
    Creates: FullCalibrationReport with Strategy substat
    ↓
ClassifiedDossier Component
    ↓
    Displays player profile with Strategy substat
    ↓
seedInitialState()
    ↓
    Game begins with Strategy data accessible
```

---

## Feedback Approach

### Why Show Feedback for Strategy (vs. Hidden for IQ/Knowledge)?

| Test | Feedback | Rationale |
|------|----------|-----------|
| **Strategy** | ✅ Transparent | Not knowledge-based; won't contaminate results; teaches strategic thinking; each scenario is independent |
| **IQ/Reasoning** | ❌ Hidden | Knowledge-based; feedback could cause answer-shifting; single correct answer model |
| **Knowledge** | ❌ Hidden | Factual; feedback would let players learn and adjust; violates single-attempt paradigm |
| **Creativity** | ✅ Transparent | Subjective scoring; feedback is interpretive; no "right answer" to corrupt |
| **Physical** | ✅ Transparent | Performance-based; immediate feedback is motivating; no answer-shifting risk |

---

## Mobile Responsiveness Checklist

- ✅ TerminalShell responsive padding (p-2 sm:p-4)
- ✅ Font sizes scale (text-[10px] sm:text-[12px])
- ✅ Buttons full-width on mobile, constrained on desktop
- ✅ Scenarios readable on all screen sizes
- ✅ Feedback section compact on mobile, expanded on desktop
- ✅ Progress bar visible at all sizes
- ✅ No horizontal scrolling required
- ✅ Touch-friendly button sizes (min 44px)
- ✅ Text wrapping proper at all breakpoints

---

## Error Handling Cases

| Case | Handling | Fallback |
|------|----------|----------|
| Missing strategyScore | `strategyScore \|\| 50` | Default to 50 |
| Incomplete history array | Use available entries | Calculate with what's available |
| Network loss | Data stays in state | Can retry finalization |
| Finalization fails | Show toast error | Retry button offered |
| Invalid data type | Type guard in handler | Skip corrupted entry |
| NaN/Infinity in calculation | Math.min/Math.max clamps | Keep in 0-100 range |

---

## Testing Checklist

- [ ] Test with all 6 scenario options (24 total paths)
- [ ] Verify score calculation on each option
- [ ] Confirm feedback displays correctly
- [ ] Test progress bar updates
- [ ] Verify state resets between scenarios
- [ ] Test final score calculation (average of 6)
- [ ] Confirm onboarding advances after completion
- [ ] Verify dossier displays strategy substat
- [ ] Test mobile/tablet/desktop responsiveness
- [ ] Test error cases (missing data, network loss)
- [ ] Verify data storage in allInputs
- [ ] Confirm integration with other test results

---

## Related Documentation Files

**Other Strategy Test Files:**
- `STRATEGY_TEST_IMPLEMENTATION.md` — Initial implementation details
- `STRATEGY_TEST_GRADING_GUIDE.md` — Grading philosophy and approach
- `STRATEGY_TEST_QUICK_REFERENCE.md` — One-page reference

**Broader System Documentation:**
- `IMPLEMENTATION_COMPLETE.md` — Full onboarding system
- `FINAL_VALIDATION_REPORT.md` — Test validation results
- `SUBSTAT_CALCULATION_SYSTEM.md` — How substats are calculated
- `CREATIVITY_DOCUMENTATION_GUIDE.md` — Creative test approach (for comparison)

---

## Key Takeaways

1. **Strategic Test = Final Calibration Step**
   - Tests integrated strategic thinking across 6 realistic scenarios
   - Score feeds directly into Strategy substat
   - No feedback hiding (unlike knowledge tests)

2. **Three-Metric Framework**
   - Efficiency: Resource optimization
   - Foresight: Long-term thinking
   - Balance: Holistic approach
   - Each scenario evaluates all three

3. **Transparent Scoring**
   - Users see metrics immediately after each choice
   - Builds trust and teaches strategic thinking
   - Doesn't contaminate results (unlike knowledge tests)

4. **Seamless Integration**
   - Test score automatically processed in finalization
   - Results appear in dossier without friction
   - Influences game progression and NPC interactions

5. **Mobile-First Design**
   - Full responsive implementation
   - Same experience across devices
   - No platform-specific breaks

6. **Accessible & Fair**
   - Same scenarios for all players
   - No cultural or demographic bias
   - Language is clear and universal

---

## Glossary

- **Efficiency:** How well the choice optimizes resources and execution
- **Foresight:** How well the choice anticipates long-term consequences
- **Balance:** How well the choice balances competing interests
- **Strategy Substat:** One of 5 substats under Intelligence stat
- **TPI:** Threat/Talent Index (overall player capability score)
- **Archetype:** Character role/playstyle (e.g., "Strategic Leader")
- **Dossier:** Full player profile generated after onboarding
- **Calibration:** Onboarding process (16 tests total)
- **Finalization:** Process of computing final stats from all test data

---

## Quick Links

- **View Scenarios & Grading:** STRATEGY_TEST_COMPLETE_GUIDE.md, Part 1-2
- **View Data Flows:** STRATEGY_TEST_VISUAL_FLOWS.md, All sections
- **View Worked Examples:** STRATEGY_TEST_FAQS_EXAMPLES.md, Examples section
- **View Code:** /pages/OnboardingPage.tsx, line 910
- **View Integration:** /services/scoringService.ts, line 286

---

**Last Updated:** Ongoing  
**Version:** 1.0 (Complete)  
**Status:** Ready for Production

---

## Support

For questions about:
- **Scenario Content:** See STRATEGY_TEST_COMPLETE_GUIDE.md, Part 1
- **Grading Logic:** See STRATEGY_TEST_COMPLETE_GUIDE.md, Part 2
- **Dossier Integration:** See STRATEGY_TEST_COMPLETE_GUIDE.md, Part 3
- **Code Implementation:** See STRATEGY_TEST_COMPLETE_GUIDE.md, Part 12
- **Flowcharts & Diagrams:** See STRATEGY_TEST_VISUAL_FLOWS.md
- **Player Experience:** See STRATEGY_TEST_FAQS_EXAMPLES.md
