# Strategy Test Grading & Onboarding Completion Flow

## How the Strategy Test is Graded

### 1. **Per-Choice Scoring** (Lines 953-963)

When you select a choice, the system calculates:

```typescript
const score = (choice.efficiency + choice.foresight + choice.balance) / 3;
```

**Example**: If you choose option 2 in "Resource Allocation":
- Efficiency: 80
- Foresight: 85
- Balance: 85
- **Choice Score = (80 + 85 + 85) / 3 = 83.33 → 83/100**

This happens **6 times** (once per scenario).

### 2. **Running Total Accumulation** (Lines 964-971)

After each choice, the test accumulates:
```typescript
const newTotalScore = totalScore + score;
```

**Progress Example**:
```
Scenario 1: 83/100 (Running total: 83)
Scenario 2: 88/100 (Running total: 171)
Scenario 3: 85/100 (Running total: 256)
Scenario 4: 87/100 (Running total: 343)
Scenario 5: 90/100 (Running total: 433)
Scenario 6: 85/100 (Running total: 518)
```

### 3. **Final Average Calculation** (Lines 976-979)

When you click "COMPLETE ANALYSIS" on the 6th scenario:

```typescript
const avgScore = Math.round(totalScore / scenarios.length);
onComplete({ strategyScore: avgScore, history });
```

**Final Calculation**:
- Total Score: 518
- Number of Scenarios: 6
- **Final Score = 518 / 6 = 86.33 → 86/100**

### 4. **What Gets Stored**

The test returns:
```typescript
{
    strategyScore: 86,  // 0-100 average
    history: [
        {
            scenario: "RESOURCE ALLOCATION",
            chosen: "40% product, 30% team, 20% marketing, 10% legal",
            score: 83,
            feedback: "Balanced allocation. Team stability, legal compliance..."
        },
        // ... 5 more entries
    ]
}
```

---

## How It Flows to the Dossier & Main App

### Step-by-Step Flow

```
┌─────────────────────────────────────────────────────┐
│ Strategy Test Completes (step 17 of 17)             │
│ onComplete({ strategyScore: 86, history: [...] })  │
└──────────────────────┬──────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────┐
│ handleStepComplete(data) is called (Line 1272)      │
│ - Stores data under step.id: 'high-stakes-war-room'│
│ - Check: stepIndex (16) < CALIBRATION_BENCHMARKS.  │
│         length (17)?                               │
│ - Result: NO → Go to finalizeOnboarding()          │
└──────────────────────┬──────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────┐
│ finalizeOnboarding(inputs) starts (Line 1283)       │
│ - Sets isFinalizing = true                          │
│ - Extracts all test data from inputs object         │
│ - Processes: physical, knowledge, reasoning, etc.   │
│ - Calculates substats percentiles                   │
│ - Builds comprehensive stats array                  │
└──────────────────────┬──────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────┐
│ Create FullCalibrationReport (Line 1362)            │
│ - Trait analysis                                     │
│ - Codename generation                               │
│ - Ceiling rank calculation                          │
│ - Talent DNA distribution                           │
│ - Notable feats/achievements                        │
└──────────────────────┬──────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────┐
│ setReport(finalReport) (Line 1379)                  │
└──────────────────────┬──────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────┐
│ if (report) → Render ClassifiedDossier (Line 1381) │
│ - Shows full assessment results                     │
│ - Displays talent class, archetype, TPI score       │
│ - Shows all substats and their values               │
│ - Includes narrative dossier entry                  │
└──────────────────────┬──────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────┐
│ User clicks "Proceed" button in ClassifiedDossier   │
│ onProceed callback is triggered (Line 1381)         │
└──────────────────────┬──────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────┐
│ seedInitialState(report) called (Line 1381)         │
│ - Initializes game state with calibration data      │
│ - Sets initial stats snapshot                       │
│ - Creates user's talent DNA                         │
│ - Stores assessment report in game context          │
└──────────────────────┬──────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────┐
│ ✅ Main App is Now Accessible                       │
│ - User is now logged in with their profile          │
│ - Can navigate to Dashboard, Missions, etc.         │
│ - Full game world is unlocked                       │
└─────────────────────────────────────────────────────┘
```

---

## The Key Code Sections

### Strategy Test Result (Lines 953-979)

```typescript
const handleChoice = (choiceIndex: number) => {
    const scenario = scenarios[scenarioIndex];
    const choice = scenario.choices[choiceIndex];
    
    // Score = average of three dimensions
    const score = (choice.efficiency + choice.foresight + choice.balance) / 3;
    const newTotalScore = totalScore + score;
    
    // Store history entry
    const newHistory = [...history, {
        scenario: scenario.title,
        chosen: choice.text,
        score: Math.round(score),
        feedback: choice.reasoning
    }];

    setSelectedChoice(choiceIndex);
    setFeedback({ score: Math.round(score), reasoning: choice.reasoning, metrics: { ... } });
    setTotalScore(newTotalScore);
    setHistory(newHistory);
};

const handleNextScenario = () => {
    if (scenarioIndex >= scenarios.length - 1) {
        // Final calculation when last scenario complete
        const avgScore = Math.round(totalScore / scenarios.length);
        onComplete({ strategyScore: avgScore, history });
    } else {
        // Move to next scenario
        setScenarioIndex(scenarioIndex + 1);
        setSelectedChoice(null);
        setFeedback(null);
    }
};
```

### Handling Completion (Lines 1272-1281)

```typescript
const handleStepComplete = (data: any) => {
    const step = CALIBRATION_BENCHMARKS[stepIndex];
    const newInputs = { ...allInputs, [step.id]: data };
    setAllInputs(newInputs);
    
    if (stepIndex < CALIBRATION_BENCHMARKS.length - 1) {
        // More tests to go
        setStepIndex(stepIndex + 1);
    } else {
        // All 17 tests complete → Finalize
        finalizeOnboarding(newInputs);
    }
};
```

### Dossier Display (Line 1381)

```typescript
if (report) {
    return (
        <ClassifiedDossier 
            report={report} 
            onProceed={() => seedInitialState(
                report.initialStatsSnapshot, 
                0, 
                report, 
                report.initialStatsSnapshot, 
                gameState?.userName, 
                report.talentDna, 
                report.archetypeTitle, 
                allInputs['biometric-data']
            )} 
            userName={gameState?.userName} 
        />
    );
}
```

---

## What Happens to Strategy Score

### In the Calibration Report

The strategy score is **NOT** directly used as a main stat like Intelligence or Creativity. Instead, it influences:

1. **Strategy Substat** - Part of the Intelligence stat
2. **Trait Analysis** - Contributes to overall talent class assessment
3. **Archetype Determination** - Helps determine user's role/class
4. **Dossier Narrative** - Included in strategic strengths/weaknesses analysis

### Strategy Score Ranges & Interpretation

| Score Range | Interpretation | Archetype Tendency |
|-------------|-----------------|-------------------|
| 85-100 | Exceptional strategic thinker | Leader, Commander |
| 70-84 | Strong strategic ability | Strategist, Tactician |
| 50-69 | Average strategic thinking | Balanced, Adapter |
| 30-49 | Below average strategy | Specialist, Reactive |
| 0-29 | Minimal strategic thinking | Support, Intuitive |

---

## Full Data Path

```
Strategy Test Input
    ↓
Per-Choice Scores (6x) = Efficiency + Foresight + Balance / 3
    ↓
Total Accumulated Score
    ↓
Final Average = Total / 6
    ↓
Stored as: inputs['high-stakes-war-room'] = { strategyScore, history }
    ↓
Passed to: finalizeOnboarding(inputs)
    ↓
Used in: calculateSubstatsFromAllTests(inputs)
    ↓
Becomes: SubStatName.Strategy percentile
    ↓
Rolled into: StatName.Intelligence (avg of 5 substats)
    ↓
Final Report includes: Strategy capability assessment
    ↓
Dossier displays: Strategic thinking profile
    ↓
Game State initialized with: Complete talent profile
    ↓
Main App starts with: User stats and capabilities ready
```

---

## Summary

✅ **Strategy Test Scoring**:
- Each scenario choice rated on 3 dimensions (0-100 each)
- Average of 3 dimensions = choice score
- 6 choices accumulated = total
- Final = average of 6 choice scores

✅ **Flow to Dossier**:
- Last test completes → `handleStepComplete` called
- All tests collected → `finalizeOnboarding` runs
- Report generated → `ClassifiedDossier` displayed
- User clicks Proceed → `seedInitialState` initializes game
- Main app unlocked ✨

**YES, it goes to the dossier and main screen!** The strategy test is the 17th and final calibration step, so when it completes, the entire onboarding finalizes, the dossier is generated and displayed, and the user can proceed to the main application.
