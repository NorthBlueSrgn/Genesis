# Strategy Test: Visual Flow Diagrams

## 1. User Journey Through Strategy Test

```
┌─────────────────────────────────────────────────────────────┐
│                  ONBOARDING STARTS                          │
│            (User completes 15 tests before this)            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│    STEP 16 OF 16: STRATEGY TEST BEGINS                      │
│         "Strategic Optimization Protocol"                   │
│                                                             │
│  Display: Briefing screen with description                 │
│  User reads about 6 strategic scenarios                    │
│  Button: "INITIATE ANALYSIS"                               │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼ (user clicks button)
┌─────────────────────────────────────────────────────────────┐
│         SCENARIO 1: RESOURCE ALLOCATION                     │
│                                                             │
│  Context: $100k startup runway                             │
│  Question: How to allocate across team/product/etc?        │
│                                                             │
│  4 Options:                                                │
│  ○ 60% product, 30% team, 10% mkt, 0% legal              │
│  ○ 40% product, 30% team, 20% mkt, 10% legal   ⭐ BEST   │
│  ○ 50% product, 40% team, 5% mkt, 5% legal               │
│  ○ 30% product, 30% team, 30% mkt, 10% legal             │
│                                                             │
│  (user selects one option)                                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼ (option selected)
┌─────────────────────────────────────────────────────────────┐
│           FEEDBACK REVEALED                                 │
│                                                             │
│  💡 STRATEGIC ANALYSIS                                     │
│  "Balanced allocation. Team stability, legal compliance..."│
│                                                             │
│  Efficiency:  80/100                                       │
│  Foresight:   85/100                                       │
│  Balance:     85/100                                       │
│  ─────────────────────                                     │
│  Score:       83/100                                       │
│                                                             │
│  [NEXT SCENARIO →]                                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼ (user clicks next)
┌─────────────────────────────────────────────────────────────┐
│    SCENARIO 2-6: REPEAT SAME PATTERN                        │
│                                                             │
│  ✓ Scenario 1: Resource Allocation      Score: 83         │
│  → Scenario 2: Team Conflict            (IN PROGRESS)      │
│  ○ Scenario 3: Crisis Triage                              │
│  ○ Scenario 4: Partnership Decision                        │
│  ○ Scenario 5: Talent Retention                            │
│  ○ Scenario 6: Market Pivot                                │
│                                                             │
│  Progress: 1/6 → 2/6 → 3/6 → 4/6 → 5/6 → 6/6             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼ (after scenario 6 feedback)
┌─────────────────────────────────────────────────────────────┐
│        FINAL SCENARIO 6 FEEDBACK + COMPLETION               │
│                                                             │
│  [COMPLETE ANALYSIS]                                       │
│        (button changes from NEXT SCENARIO)                 │
│                                                             │
│  User clicks to complete test                             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│       TEST DATA PROCESSED                                   │
│                                                             │
│  Calculate:                                                │
│  Scenario 1: 83                                            │
│  Scenario 2: 87                                            │
│  Scenario 3: 87                                            │
│  Scenario 4: 86                                            │
│  Scenario 5: 87                                            │
│  Scenario 6: 83                                            │
│  ──────────────────                                        │
│  FINAL SCORE: 86/100                                       │
│                                                             │
│  Store in allInputs:                                       │
│  allInputs['high-stakes-war-room'] = {                    │
│    strategyScore: 86,                                     │
│    history: [ {...}, {...}, ... ] (6 entries)             │
│  }                                                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│   ONBOARDING FINALIZATION TRIGGERED                         │
│                                                             │
│  1. Detect: stepIndex >= CALIBRATION_BENCHMARKS.length   │
│  2. Call: finalizeOnboarding(allInputs)                   │
│  3. Process: All test data from 16 steps                  │
│  4. Calculate: Substats including Strategy               │
│  5. Generate: Full Calibration Report (Dossier)          │
│                                                             │
│  Status: "FINALIZING DOSSIER..."                          │
│  Show: Loader animation                                   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│        CLASSIFIED DOSSIER RENDERED                          │
│                                                             │
│  Display complete player profile:                          │
│  • Name / Codename                                        │
│  • Stats (Physical, Vitality, Intelligence, etc.)        │
│  • Strategy Substat: PERCENTILE XX                       │
│  • Talent DNA                                             │
│  • Archetype Assessment                                   │
│  • Strengths / Development Areas                          │
│  • Full calibration narrative                             │
│                                                             │
│         [PROCEED TO MAIN INTERFACE]                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼ (user clicks PROCEED)
┌─────────────────────────────────────────────────────────────┐
│  GAME STATE INITIALIZED                                     │
│                                                             │
│  seedInitialState() called with:                           │
│  • Report (dossier data)                                  │
│  • Stats snapshot                                         │
│  • Player name                                            │
│  • Talent DNA                                             │
│                                                             │
│  Redux/Context stores the data                            │
│  Player enters MAIN GAME                                  │
│  (Labyrinth, Dashboard, Missions, etc.)                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Score Calculation Flow

```
USER SELECTS OPTION FOR SCENARIO
         │
         ▼
RETRIEVE CHOICE METRICS:
├─ efficiency: 80 (0-100)
├─ foresight:  85 (0-100)
└─ balance:    85 (0-100)
         │
         ▼
CALCULATE SCENARIO SCORE:
  score = (efficiency + foresight + balance) / 3
  score = (80 + 85 + 85) / 3
  score = 250 / 3
  score = 83.33
         │
         ▼
ROUND TO INTEGER:
  Math.round(83.33) = 83
         │
         ▼
ADD TO RUNNING TOTAL:
  totalScore = previous + 83
         │
         ▼
RECORD IN HISTORY:
  history.push({
    scenario: "RESOURCE ALLOCATION",
    chosen: "40% product, 30% team...",
    score: 83,
    feedback: "Balanced allocation..."
  })
         │
         ▼
DISPLAY FEEDBACK TO USER:
├─ Reasoning text
├─ Three metric breakdowns
└─ Score display
         │
         ▼
AFTER SCENARIO 6:
  avgScore = totalScore / 6
  avgScore = (83+87+87+86+87+83) / 6
  avgScore = 513 / 6
  avgScore = 85.5
         │
         ▼
FINAL TEST SCORE:
  strategyScore = Math.round(85.5) = 86
         │
         ▼
onComplete({
  strategyScore: 86,
  history: [ 6 entry array ]
})
```

---

## 3. Integration into Substats

```
STRATEGY TEST COMPLETE
     │
     └─→ strategyScore = 86 (raw test result)
              │
              ▼
    STORED: inputs['high-stakes-war-room']
              │
              ▼
    CALLED: calculateSubstatsFromAllTests(inputs)
              │
              ├─ Extracts: strategyWar = inputs['high-stakes-war-room']
              ├─ Gets: strategyScore = strategyWar.strategyScore (86)
              ├─ Gets: reasonScore = inputs['ai-adaptive-reasoning'].score
              │
              ├─ Calculates:
              │  const strategyReasoning = reasonScore * 0.7
              │
              └─ COMBINES:
                 substats[SubStatName.Strategy] = average([
                   strategyScore: 86,        (full weight)
                   strategyReasoning: XX    (70% of reason score)
                 ])
              
              └─ RESULT:
                 substats[Strategy] = XX (0-95 range, capped at 95)
              
              ▼
    USED IN: Final stats calculation
              │
              ├─ Displayed in Dossier
              │  "Intelligence Stat: XXX"
              │  └─ Strategy Substat: Percentile YY
              │
              └─ Contributes to:
                 • Overall TPI (Threat/Talent Index)
                 • Archetype assessment
                 • Recommended roles/paths
```

---

## 4. Test Data Storage & Retrieval

```
DURING TEST:
┌────────────────────────────────────┐
│  Component State                   │
│  (OptimizationStrategyTest)        │
├────────────────────────────────────┤
│ const [scenarioIndex, ...]         │
│ const [totalScore, ...]            │
│ const [history, ...]               │
│ const [selectedChoice, ...]        │
│ const [feedback, ...]              │
└────────────────────────────────────┘

AFTER TEST COMPLETION:
onComplete({ strategyScore: 86, history: [...] })
        │
        ▼
┌────────────────────────────────────┐
│  Passed to Handler                 │
│  (handleStepComplete)              │
├────────────────────────────────────┤
│ data = {                           │
│   strategyScore: 86,               │
│   history: [                       │
│     {scenario, chosen, score, ...},│
│     {scenario, chosen, score, ...},│
│     ...                            │
│   ]                                │
│ }                                  │
└────────────────────────────────────┘
        │
        ▼
┌────────────────────────────────────┐
│  Stored in allInputs               │
│  (onboarding state)                │
├────────────────────────────────────┤
│ allInputs['high-stakes-war-room']  │
│ = {                                │
│   strategyScore: 86,               │
│   history: [...]                   │
│ }                                  │
└────────────────────────────────────┘
        │
        ▼
┌────────────────────────────────────┐
│  Passed to Finalization            │
│  (finalizeOnboarding)              │
├────────────────────────────────────┤
│ function finalizeOnboarding(inputs)│
│   const strategyWar = inputs       │
│     ['high-stakes-war-room']       │
│   const strategyScore =            │
│     strategyWar.strategyScore      │
│   // Use in calculateSubstats      │
└────────────────────────────────────┘
        │
        ▼
┌────────────────────────────────────┐
│  Final Dossier Report              │
│  (ClassifiedDossier props)         │
├────────────────────────────────────┤
│ report = {                         │
│   stats: {                         │
│     Intelligence: {                │
│       value: ...,                  │
│       subStats: [                  │
│         Strategy: { value: XX, ... │
│         ...                        │
│       ]                            │
│     }                              │
│   }                                │
│   // strategy data accessible      │
│ }                                  │
└────────────────────────────────────┘
```

---

## 5. Mobile Responsiveness Flow

```
DESKTOP (1200px+)
┌─────────────────────────────────────┐
│  STRATEGY_ANALYSIS // OPTIMIZATION  │
├─────────────────────────────────────┤
│  [Progress Bar]              S16/16  │
│                                     │
│  SCENARIO TITLE                     │
│  Long context text with full details│
│  Problem statement                  │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Option 1 (full width button)  │ │
│  └───────────────────────────────┘ │
│  ┌───────────────────────────────┐ │
│  │ Option 2                      │ │
│  └───────────────────────────────┘ │
│  ┌───────────────────────────────┐ │
│  │ Option 3                      │ │
│  └───────────────────────────────┘ │
│  ┌───────────────────────────────┐ │
│  │ Option 4                      │ │
│  └───────────────────────────────┘ │
│                                     │
│  [FEEDBACK SECTION - EXPANDED]      │
│  Efficiency: 85 | Foresight: 85    │
│  Balance: 90                        │
│  Score: 87/100                      │
│                                     │
│  [NEXT SCENARIO] Button             │
└─────────────────────────────────────┘

MOBILE (< 640px)
┌──────────────────────┐
│ STRATEGY..// OPTIM  │  (truncated title)
├──────────────────────┤
│  Progress:   S16/16  │
│              1/6     │
│                      │
│  SCENARIO TITLE      │
│  (text-sm, wrapped)  │
│                      │
│  Context text        │
│  (text-xs, wrapped)  │
│                      │
│  Problem statement   │
│  (text-sm, italic)   │
│                      │
│  ┌────────────────┐  │
│  │ Option 1 Text  │  │
│  │ (text-[10px])  │  │
│  └────────────────┘  │
│  ┌────────────────┐  │
│  │ Option 2       │  │
│  └────────────────┘  │
│  ┌────────────────┐  │
│  │ Option 3       │  │
│  └────────────────┘  │
│  ┌────────────────┐  │
│  │ Option 4       │  │
│  └────────────────┘  │
│                      │
│  [FEEDBACK - COMPACT]│
│  Eff:85│Frs:85      │
│  Bal:90│Scr:87      │
│                      │
│ [NEXT SCENARIO]      │
└──────────────────────┘

TABLET (640px - 1200px)
┌────────────────────────────┐
│ STRATEGY_ANALYSIS // OPTIM │
├────────────────────────────┤
│  [Progress Bar]      S16/16│
│                            │
│  SCENARIO TITLE            │
│  Context text (medium wrap)│
│  Problem statement         │
│                            │
│  ┌──────────────────────┐  │
│  │ Option 1 (longer)    │  │
│  └──────────────────────┘  │
│  ┌──────────────────────┐  │
│  │ Option 2             │  │
│  └──────────────────────┘  │
│  ┌──────────────────────┐  │
│  │ Option 3             │  │
│  └──────────────────────┘  │
│  ┌──────────────────────┐  │
│  │ Option 4             │  │
│  └──────────────────────┘  │
│                            │
│  [FEEDBACK SECTION]        │
│  Efficiency: 85 | Foresight│
│  Balance: 90               │
│  Score: 87/100             │
│                            │
│  [NEXT SCENARIO →]         │
└────────────────────────────┘
```

---

## 6. State Transitions

```
PHASE STATES IN COMPONENT:

Initial: phase = 'briefing'
┌─────────────────────────────┐
│  Briefing Screen Rendered   │
│  "INITIATE ANALYSIS" button │
└────────────┬────────────────┘
             │
             ▼ (onClick)
        setPhase('active')
             │
             ▼

Active: phase = 'active'
┌─────────────────────────────┐
│  Scenario rendered          │
│  4 options available        │
│  selectedChoice = null      │
└────────────┬────────────────┘
             │
             ▼ (user selects option)
        setSelectedChoice(idx)
        setFeedback(data)
        setTotalScore(...)
        setHistory(...)
             │
             ▼ (user clicks NEXT/COMPLETE)
      handleNextScenario()
             │
             ├─ if (scenarioIndex < 5):
             │  └─ setScenarioIndex(+1)
             │     selectedChoice = null
             │     feedback = null
             │     (show next scenario in 'active' phase)
             │
             └─ if (scenarioIndex >= 5):
                └─ onComplete(...)
                   (exit component)

Post-Test: (component unmounts)
┌─────────────────────────────┐
│  handleStepComplete runs    │
│  Data stored in allInputs   │
│  Either:                    │
│  - Next step displayed      │
│  - OR finalizeOnboarding    │
└─────────────────────────────┘
```

---

## 7. Score Distribution Visualization

```
OPTIMAL PLAYER (All balanced choices):
Score Distribution:
100 ├
    │
 90 ├        ███
    │       ████
 80 ├    ███████
    │   ████████
 70 ├  ████████
    │  ████████
 60 ├
    │
    └─────────────────────
      S1 S2 S3 S4 S5 S6
      
Average: 86 (High percentile)
Strategy Substat: ~85 percentile


MEDIOCRE PLAYER (Mixed choices):
Score Distribution:
100 ├
    │
 80 ├   ██
    │   ██    ██
 60 ├   ██ ██ ██
    │   ██ ██ ██
 40 ├
    │
    └─────────────────────
      S1 S2 S3 S4 S5 S6

Average: 60 (Middle percentile)
Strategy Substat: ~55 percentile


POOR PLAYER (All reactive choices):
Score Distribution:
100 ├
    │
 70 ├
    │ ██
 50 ├ ██  ██
    │ ██  ██ ██
 30 ├     ██
    │
    └─────────────────────
      S1 S2 S3 S4 S5 S6

Average: 45 (Low percentile)
Strategy Substat: ~40 percentile
```

---

## 8. Integration with Full Onboarding

```
CALIBRATION BENCHMARKS SEQUENCE (16 total):

1.  Narrative Projection
2.  Biometric Data Entry
3.  MBTI Assessment
4.  Hobby Selection
5.  Physical Performance
6.  Fitts Law Test (Dexterity)
7.  Simon Says (Adaptability)
8.  Breath Hold Test (Vitality)
9.  Vitality Questionnaire
10. Psyche/Social Questionnaire
11. Psychometric Evaluation (Labyrinth)
12. Resilience Stroop Test
13. Dilemma Screening
14. Creative Protocol Test
15. Adaptive Reasoning (IQ Test)
16. Adaptive Knowledge Test
[17. STRATEGY TEST] ← LAST STEP (index 16)
       │
       └─→ Test Complete
           │
           └─→ finalizeOnboarding() triggered
               │
               └─→ All 17 inputs processed
                   │
                   └─→ Dossier generated
                       │
                       └─→ Game unlocked

Flow in Code:
for (stepIndex = 0; stepIndex < CALIBRATION_BENCHMARKS.length; stepIndex++) {
  render currentBenchmark
  wait for user completion
  handleStepComplete(data)
  
  if (stepIndex < 16):
    stepIndex++
    loop back
  else:
    finalizeOnboarding(allInputs)
    display dossier
}
```

---

## 9. Error Handling Flow

```
USER COMPLETES STRATEGY TEST
         │
         ▼
    Send onComplete({...})
         │
         ├─ Connection Lost?
         │  └─ State not lost (in-component state)
         │     Data already stored in parent
         │
         ├─ Invalid Data?
         │  └─ strategyScore || 50 (fallback)
         │     history || [] (empty array)
         │
         ├─ finalization() fails?
         │  └─ Catch error
         │     addToast("Calibration error...", "error")
         │     Try again button shown
         │
         └─ Success?
            └─ setReport(finalReport)
               ClassifiedDossier rendered
```

---

## 10. Performance & Rendering

```
COMPONENT RENDERS:

1. Initial Render: OptimizationStrategyTest
   ├─ State initialized
   ├─ phase = 'briefing'
   └─ Briefing screen shown

2. User clicks "INITIATE"
   ├─ setPhase('active')
   ├─ setScenarioIndex(0)
   └─ RERENDER: Scenario 1 shown

3. User selects option
   ├─ setSelectedChoice(idx)
   ├─ setFeedback(...)
   ├─ setTotalScore(...)
   ├─ setHistory(...)
   └─ RERENDER: Feedback section appears

4. User clicks "NEXT SCENARIO"
   ├─ if (scenarioIndex < 5):
   │  ├─ setScenarioIndex(+1)
   │  ├─ setSelectedChoice(null)
   │  ├─ setFeedback(null)
   │  └─ RERENDER: New scenario shown
   │
   └─ if (scenarioIndex >= 5):
      └─ onComplete() (EXIT COMPONENT)
         Parent: handleStepComplete runs
         RERENDER: Parent component updates state

Performance Notes:
- No heavy computations in component (all in handler)
- State updates batched efficiently
- No memory leaks (component unmounts cleanly)
- Mobile-friendly CSS prevents layout thrashing
```

---

## Summary

The strategy test flows seamlessly through:
1. **Briefing** → User understands the test
2. **Scenario Loop** (1-6) → User makes decisions, sees feedback
3. **Score Calculation** → Automatic, transparent
4. **Completion** → Data passed to parent
5. **Integration** → Scores merged into final stats
6. **Dossier** → User sees complete profile
7. **Game Start** → Main application unlocked

All stages are mobile-responsive, error-handled, and provide clear visual feedback to the user.
