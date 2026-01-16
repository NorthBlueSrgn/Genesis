# Strategy Test: Complete Grading & Integration Guide

## Overview

The **Strategic Optimization Protocol** is the final test in Genesis Protocol's onboarding calibration. It's a scenario-based strategic decision-making assessment that directly feeds into the player's **Strategy substat** and influences their final dossier profile.

---

## Part 1: Test Structure

### Test Type
- **Name:** Strategic Optimization Protocol
- **ID:** `high-stakes-war-room`
- **Type:** `strategy-optimization`
- **Position:** Last test in the calibration sequence (Step 16 of 16)

### Test Content: 6 Business Scenarios

Each scenario presents a strategic dilemma that a founder, manager, or business leader might face. The user selects one of 4 options per scenario.

#### Scenario 1: Resource Allocation
**Context:** Startup with $100k runway must allocate across team, product, marketing, and legal.

**Options:**
1. **60% Product, 30% Team, 10% Marketing, 0% Legal**
   - Efficiency: 85 | Foresight: 70 | Balance: 60
   - Reasoning: "High product focus but underfunded team and legal—risky."

2. **40% Product, 30% Team, 20% Marketing, 10% Legal** ⭐ Best balanced
   - Efficiency: 80 | Foresight: 85 | Balance: 85
   - Reasoning: "Balanced allocation. Team stability, legal compliance, market awareness."

3. **50% Product, 40% Team, 5% Marketing, 5% Legal**
   - Efficiency: 75 | Foresight: 60 | Balance: 70
   - Reasoning: "Strong team but weak marketing presence and legal buffer."

4. **30% Product, 30% Team, 30% Marketing, 10% Legal**
   - Efficiency: 70 | Foresight: 75 | Balance: 80
   - Reasoning: "Evenly distributed but underinvests in core product."

#### Scenario 2: Team Conflict Resolution
**Context:** Two engineers disagree on tech stack (proven vs. cutting-edge) with 8-week deadline.

**Best Option:** Use hybrid approach
- Efficiency: 85 | Foresight: 85 | Balance: 90
- Reasoning: "Smart compromise. De-risks core, allows innovation. Builds consensus."

#### Scenario 3: Crisis Triage
**Context:** Platform loses 30% of users to competitor. Must prioritize 3 initiatives.

**Best Option:** Analyze why users left, then strategically address top 3 reasons
- Efficiency: 85 | Foresight: 90 | Balance: 85
- Reasoning: "Data-driven. Targets root causes. Efficient resource use."

#### Scenario 4: Partnership Decision
**Context:** Large company offers partnership (40% revenue share, 3-year exclusivity).

**Best Option:** Negotiate better terms (1 year, 25%, non-exclusive adjacent segments)
- Efficiency: 85 | Foresight: 85 | Balance: 88
- Reasoning: "Strategic. Reduces risk. Keeps optionality. Better long-term position."

#### Scenario 5: Talent Retention
**Context:** Best engineer has offer elsewhere (25% higher salary). How to retain?

**Best Option:** Offer lead role on moonshot project + equity bump + sabbatical
- Efficiency: 85 | Foresight: 85 | Balance: 90
- Reasoning: "Values their growth. Offers agency. Equity upside. Respects life balance."

#### Scenario 6: Market Pivot
**Context:** Current market is $2M ARR but plateaued. New market is 5x larger.

**Best Option:** Hedge with 40% resources to new market exploration while sustaining current business
- Efficiency: 80 | Foresight: 85 | Balance: 85
- Reasoning: "Balanced risk. Allows learning. Preserves base. Positions for growth."

---

## Part 2: Grading Mechanism

### Scoring System

Each choice is evaluated on **three dimensions:**

1. **Efficiency (0-100)**
   - How well the decision optimizes resources/time
   - Reflects pragmatism and execution capability
   - High: minimal waste, maximum output
   - Low: wasteful, inefficient resource use

2. **Foresight (0-100)**
   - How well the decision anticipates long-term consequences
   - Reflects strategic vision and risk awareness
   - High: considers downstream impacts, second-order effects
   - Low: reactive, ignores future implications

3. **Balance (0-100)**
   - How well the decision balances competing interests
   - Reflects holistic thinking and stakeholder awareness
   - High: sustainable, maintains optionality, respects constraints
   - Low: imbalanced, creates fragility, ignores hidden costs

### Score Calculation per Scenario

```
Per-Scenario Score = (Efficiency + Foresight + Balance) / 3
Range: 33.3 to 100 (where 100 is perfect balance of all three)
```

**Example:** 
- Choice with Efficiency 85, Foresight 85, Balance 90
- Score = (85 + 85 + 90) / 3 = 260 / 3 = 86.67 → Rounded to **87/100**

### Test-Level Score

After all 6 scenarios are complete:

```
Test Score = Average of all 6 scenario scores
Range: 33 to 100
```

**Example:**
If scores across 6 scenarios are: 87, 82, 85, 88, 80, 84
- Test Score = (87 + 82 + 85 + 88 + 80 + 84) / 6 = 86

### Feedback During Test

**After each choice:**
- User sees immediate feedback on that choice
- Displays all three metrics (Efficiency, Foresight, Balance)
- Shows reasoning explaining why that choice scores as it does
- Provides next scenario button

**No hidden feedback:** All scoring is transparent. User can see their metrics after each decision.

---

## Part 3: Integration into Dossier

### Direct Influence: Strategy Substat

The strategy test result flows directly into the **Strategy substat** in the final calibration:

**Location:** `services/scoringService.ts` → `calculateSubstatsFromAllTests()` function

```typescript
const strategyWar = inputs['high-stakes-war-room'] || {};
const strategyScore = strategyWar.strategyScore || 50;
const strategyReasoning = reasonScore * 0.7; // Strategy partially from reasoning

substats[SubStatName.Strategy] = average([strategyScore, strategyReasoning]);
```

**Formula:**
- Strategy Substat = Average of:
  1. Strategy Test Score (full weight)
  2. Reasoning Test Score × 0.7 (reasoning contributes to strategy)

**Cap:** Capped at 95 percentile to allow for growth

### Strategic Thinking Indicator

The strategy test also contributes to the player's **Talent DNA** and **Archetype Assessment**:

- High Strategy scores → Player characterized as **strategic thinker**, **long-term planner**
- Low Strategy scores → Player characterized as **reactive**, **tactical executor**

This information appears in:
- Dossier "Strengths" section (if Strategy is high percentile)
- Dossier "Development Areas" section (if Strategy is low)
- Archetype/Role recommendations

---

## Part 4: Onboarding Flow After Test Completion

### Flow Diagram

```
User selects choice in Scenario 6
    ↓
Test calculates final score (avg of 6 scenarios)
    ↓
onComplete() callback triggered with {strategyScore, history}
    ↓
handleStepComplete() stores data in allInputs['high-stakes-war-room']
    ↓
stepIndex incremented to 17 (past final benchmark)
    ↓
finalizeOnboarding() called automatically
    ↓
All test data processed → Dossier generated
    ↓
ClassifiedDossier component rendered
    ↓
User clicks "PROCEED" in dossier
    ↓
Main app unlocked, game begins
```

### Code Flow

**1. Test Completion (OnboardingPage.tsx line 1019)**
```typescript
const handleNextScenario = () => {
    if (scenarioIndex >= scenarios.length - 1) {
        // Test complete
        const avgScore = Math.round(totalScore / scenarios.length);
        onComplete({ strategyScore: avgScore, history });
    } else {
        setScenarioIndex(scenarioIndex + 1);
        // ... continue to next scenario
    }
};
```

**2. Step Complete Handling (line 1272)**
```typescript
const handleStepComplete = (data: any) => {
    const step = CALIBRATION_BENCHMARKS[stepIndex];
    const newInputs = { ...allInputs, [step.id]: data };
    setAllInputs(newInputs);
    
    if (stepIndex < CALIBRATION_BENCHMARKS.length - 1) {
        setStepIndex(stepIndex + 1);  // Move to next test
    } else {
        finalizeOnboarding(newInputs);  // All tests done, finalize
    }
};
```

**3. Finalization (line 1278)**
```typescript
const finalizeOnboarding = async (inputs: any) => {
    setIsFinalizing(true);
    try {
        // Process all test data, including strategy test
        const substatsPercentiles = calculateSubstatsFromAllTests(inputs);
        
        // Calculate final stats, traits, dossier
        const finalReport = { ...fullReport, ... };
        setReport(finalReport);
    } finally {
        setIsFinalizing(false);
    }
};
```

**4. Dossier Display (line 1414)**
```typescript
if (report) {
    return (
        <ClassifiedDossier 
            report={report} 
            onProceed={() => seedInitialState(...)} 
            userName={gameState?.userName} 
        />
    );
}
```

---

## Part 5: What Data Gets Stored

### Test Results Structure

When the strategy test completes, it sends:

```typescript
{
    strategyScore: 86,              // Final avg score (0-100)
    history: [
        {
            scenario: "RESOURCE ALLOCATION",
            chosen: "40% product, 30% team, 20% marketing, 10% legal",
            score: 87,
            feedback: "Balanced allocation. Team stability, legal compliance..."
        },
        {
            scenario: "TEAM CONFLICT RESOLUTION",
            chosen: "Use hybrid: core in proven tech, new features in cutting-edge",
            score: 88,
            feedback: "Smart compromise. De-risks core, allows innovation..."
        },
        // ... 4 more scenarios
    ]
}
```

### Storage in Dossier

This data is accessible in the final report via:
- `report.initialStatsSnapshot.Strategy` → The substat value
- Strategy percentile appears in dossier breakdown
- Can be logged/analyzed for gameplay progression

---

## Part 6: Feedback Architecture

### Why Show Feedback for Strategy Test?

Unlike **IQ (Equilibrium Reasoning)** and **Knowledge** tests which hide all real-time feedback to prevent answer-shifting, the strategy test **shows transparent feedback because:**

1. **Not a Knowledge Test:** Strategy isn't about recalling facts. Feedback won't cause users to "game" the system by changing answers based on scoring patterns.

2. **Learning Value:** Strategic thinking improves through feedback. Seeing why a decision was efficient/foresightful helps users learn strategic reasoning.

3. **Narrative Purpose:** The feedback creates a story—the test teaches while evaluating. It's part of the experience, not a measurement that could be contaminated.

4. **Scenario Isolation:** Each scenario is independent. Seeing the score on Scenario 1 doesn't help optimize Scenario 2's answer (unlike knowledge where learning one fact helps the next question).

### Feedback Components Shown

After each choice:
- **Metrics Display:** Efficiency, Foresight, Balance (all visible)
- **Reasoning:** Explanation of the choice's strategic merit
- **Score:** Rounded final score for that scenario
- **Progress:** Shows which scenario you're on (e.g., "3/6")

**No Hidden Feedback:** All information is transparent.

---

## Part 7: Testing Scenarios & Expected Scores

### Perfect Playthrough
If user selects the "best balanced" option for all 6 scenarios:

| Scenario | Best Option | Efficiency | Foresight | Balance | Score |
|----------|-------------|------------|-----------|---------|-------|
| 1        | Balanced allocation | 80 | 85 | 85 | 83 |
| 2        | Hybrid tech stack | 85 | 85 | 90 | 87 |
| 3        | Data-driven crisis | 85 | 90 | 85 | 87 |
| 4        | Negotiate partnership | 85 | 85 | 88 | 86 |
| 5        | Growth + agency | 85 | 85 | 90 | 87 |
| 6        | Hedged pivot | 80 | 85 | 85 | 83 |
| **Average** | | | | | **86** |

### Poor Playthrough
If user selects unbalanced, reactive options:

| Scenario | Choice | Efficiency | Foresight | Balance | Score |
|----------|--------|------------|-----------|---------|-------|
| 1        | 60% product | 85 | 70 | 60 | 72 |
| 2        | Mandate cutting-edge | 75 | 40 | 50 | 55 |
| 3        | Rebuild features immediately | 70 | 50 | 60 | 60 |
| 4        | Accept without negotiating | 70 | 50 | 55 | 58 |
| 5        | Match salary increase | 50 | 60 | 55 | 55 |
| 6        | Stay in current market | 75 | 50 | 70 | 65 |
| **Average** | | | | | **61** |

---

## Part 8: Integration with Other Substats

### Related Substats Affected

| Substat | Direct Impact | Calculation |
|---------|---------------|-------------|
| **Strategy** | ✅ Direct | Average of (Strategy Test Score + Reasoning Score × 0.7) |
| **Reason** | ❌ Indirect | From IQ/Reasoning test; contributes to Strategy |
| **Perception** | ❌ Indirect | From physical tests; can enhance strategic analysis |
| **Imagination** | ❌ Indirect | From creativity test; alternative approaches |
| **Vision** | ❌ Indirect | From creative + strategic alignment |

### Why These Relationships?

- **Strategy + Reason:** Both fundamental to strategic thinking. Reason provides the logical foundation.
- **Strategy + Perception:** Strategic execution requires accurate perception of situations.
- **Strategy + Imagination:** Creative problem-solving enhances strategic options.

---

## Part 9: Validation & Error Handling

### Error Cases

**Case 1: User completes test but connection drops**
- Data is stored in `allInputs` state
- `handleStepComplete` runs before network operations
- If finalization fails, user sees retry toast
- Dossier generation rolls back gracefully

**Case 2: Invalid strategy score returned**
- Fallback: If strategyScore is null/undefined, defaults to 50
- Code: `const strategyScore = strategyWar.strategyScore || 50;`
- Ensures no broken calculations downstream

**Case 3: User backs out of test**
- Currently not implemented (tests are mandatory)
- If implemented, would trigger `handleStepComplete` with null/undefined
- Fallback handling would use defaults

### Validation Checks

✅ All 6 scenarios must be answered before test completion
✅ Score must be within 0-100 range
✅ Score is automatically capped at 95 percentile in final stats
✅ History array must have exactly 6 entries

---

## Part 10: Visual Flow in UI

### Test Briefing Screen
```
╔════════════════════════════════════════╗
║  STRATEGIC_ANALYSIS // OPTIMIZATION   ║
║           (Title bar with scanlines)  ║
╠════════════════════════════════════════╣
║                                        ║
║          🎯 OPTIMIZATION PROTOCOL     ║
║                                        ║
║  Navigate 6 strategic scenarios.       ║
║  Each demands efficiency, foresight,   ║
║  and balance. Your decisions reveal    ║
║  your strategic thinking.              ║
║                                        ║
║         [INITIATE ANALYSIS]            ║
║                                        ║
╚════════════════════════════════════════╝
```

### Active Scenario Screen
```
╔════════════════════════════════════════╗
║  SCENARIO_ANALYSIS // LIVE_DECISION   ║
║           (Title bar with scanlines)  ║
╠════════════════════════════════════════╣
║ ▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 1/6 ║
║                                        ║
║ RESOURCE ALLOCATION                    ║
║ Your startup has $100k runway...      ║
║                                        ║
║ What allocation gives you the best... ║
║                                        ║
║ ┌──────────────────────────────────┐  ║
║ │ ☑ 60% product, 30% team...       │  ║
║ └──────────────────────────────────┘  ║
║ ┌──────────────────────────────────┐  ║
║ │ ○ 40% product, 30% team...       │  ║
║ └──────────────────────────────────┘  ║
║ ┌──────────────────────────────────┐  ║
║ │ ○ 50% product, 40% team...       │  ║
║ └──────────────────────────────────┘  ║
║ ┌──────────────────────────────────┐  ║
║ │ ○ 30% product, 30% team...       │  ║
║ └──────────────────────────────────┘  ║
║                                        ║
║ 💡 STRATEGIC ANALYSIS                 ║
║ High product focus but underfunded...  ║
║                                        ║
║ Efficiency: 85 | Foresight: 70        ║
║                                        ║
║         Score: 72/100                 ║
║                                        ║
║       [NEXT SCENARIO] ►                ║
║                                        ║
╚════════════════════════════════════════╝
```

### Post-Test: Dossier Screen
User is immediately transitioned to ClassifiedDossier component, which displays:
- Full calibration report with all stats
- Strategy substat highlighted in Intelligence section
- Narrative assessment of strategic thinking
- "PROCEED TO MAIN INTERFACE" button to unlock game

---

## Part 11: Summary Table

| Aspect | Details |
|--------|---------|
| **Test Type** | Scenario-based strategic decision-making |
| **Number of Scenarios** | 6 |
| **Scoring Dimensions** | Efficiency, Foresight, Balance |
| **Score Range** | 33-100 per scenario; 33-100 overall |
| **Primary Substat** | Strategy (Intelligence stat) |
| **Feedback** | Transparent (shown after each choice) |
| **Position in Flow** | Last test in calibration (Step 16/16) |
| **Transition** | Auto → Dossier generation on completion |
| **Mobile-Friendly** | ✅ Yes (responsive terminal shell) |
| **Adaptive** | ✅ No (fixed scenarios, same for all users) |
| **Can Skip** | ❌ No (mandatory) |
| **Repeatable** | ❌ No (only during onboarding) |

---

## Part 12: Technical Details

### File Locations
- **Test Component:** `/pages/OnboardingPage.tsx` (lines 910-1050)
- **Test Data:** `/data/calibrationData.ts` (test definition at `id: 'high-stakes-war-room'`)
- **Score Integration:** `/services/scoringService.ts` (lines 286-400)
- **Main Flow:** `/pages/OnboardingPage.tsx` (lines 1272-1320)

### Data Flow
```
OptimizationStrategyTest
    ↓ (onComplete)
handleStepComplete
    ↓ (stored in allInputs['high-stakes-war-room'])
finalizeOnboarding
    ↓ (calculateSubstatsFromAllTests processes strategy data)
generateFullCalibrationReport
    ↓ (creates dossier with Strategy substat)
ClassifiedDossier
    ↓ (user clicks PROCEED)
seedInitialState + LabyrinthPage
    ↓ (game begins)
```

### Key Exports
- `OptimizationStrategyTest` component (internal to OnboardingPage)
- `calculateSubstatsFromAllTests` function (exported from scoringService)
- Strategy substat accessible via `stats[StatName.Intelligence].subStats[SubStatName.Strategy]`

---

## Conclusion

The **Strategic Optimization Protocol** is the final calibration test, evaluating how users think strategically across 6 realistic business scenarios. It provides transparent feedback on Efficiency, Foresight, and Balance—three pillars of strategic thinking. The test score directly feeds into the Strategy substat and influences the player's archetype and dossier profile. Upon completion, the onboarding finalizes, the dossier is generated, and the main game is unlocked.

The test is designed to be:
- ✅ **Fair:** All users see same scenarios; scoring is transparent
- ✅ **Insightful:** Feedback teaches strategic concepts
- ✅ **Integrated:** Results seamlessly flow into game progression
- ✅ **Mobile-Friendly:** Responsive, no platform-specific issues
