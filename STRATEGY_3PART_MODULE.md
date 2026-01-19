# Strategy Assessment: 3-Part Mini-Module

## Overview
The new **StrategyAssessment3Part** component replaces the previous single-puzzle chess-only approach with a comprehensive 3-part mini-module designed to measure strategic foresight, tactical thinking, and decision-making under constraints. Total time: **5–7 minutes**.

---

## Architecture

### Part 1: Warm-Up (River Crossing Puzzle) — 1–2 min
**Purpose:** Ease in non-chess players, test pure planning without board rules.

**Task:** Classic river-crossing logic puzzle
- User must transport a wolf, goat, and cabbage across a river
- Boat holds only the user + one item
- Constraints: Wolf eats goat if alone; goat eats cabbage if alone
- User describes the step-by-step sequence of moves

**Optimal Solution (7 moves):**
1. Take goat to other side (leave wolf + cabbage)
2. Return alone
3. Take wolf or cabbage to other side
4. **Bring goat BACK** (key insight: contingency thinking)
5. Take the remaining item to other side
6. Return alone
7. Take goat to final side

**Scoring (0–30 points):**
- **Optimal (25–30):** Correct 7-move sequence with explicit understanding of contingencies
- **Minor Inefficiency (15–24):** Works but suboptimal, missing the "bring back" insight
- **Partial Success (5–14):** Has some moves right, partially stuck
- **Wrong/Fails (0–4):** Fails the test
- **Bonus (+5–10):** Clear explanation of contingencies (e.g., "I bring goat back to prevent eating")

**Why This First?**
- Tests **forward planning** and **anticipating threats** without chess board complexity
- Measures ability to think multiple moves ahead
- Reveals **contingency thinking** (reversing moves for safety)—a core strategic skill

---

### Part 2: Core (Chess Tactics Puzzle) — 2–4 min
**Purpose:** Measure tactical calculation depth, pattern recognition, and candidate-move evaluation (cognitive studies link these to planning/executive function).

**Task Format:**
- Present **2 short chess puzzles** (mate-in-2 or win-material-in-3)
- User identifies the best move for White using algebraic notation
- User reflects on the strategic principle demonstrated

**Puzzle Examples:**
1. **"Material Gain"** – Queen sacrifice that threatens checkmate, forces win
   - Best move: Qh7
   - Strategic concept: Recognize forcing moves (checks, captures, threats in sequence)

2. **"Tactical Fork"** – Knight forks queen and rook
   - Best move: Nf7
   - Strategic concept: Master tactical patterns (forks, pins, skewers)

**Scoring Per Puzzle (0–50 points total, ~25 per puzzle):**
- **Optimal + Correct Line (35–50):** Best move, forces win
- **Good but Suboptimal (20–34):** Valid move, misses deeper continuation
- **Partial Calculation (10–19):** Sees threat but misses defense
- **Wrong/No Plan (0–9):** Incorrect move
- **Bonus for Verbal Explanation (+10–15):** Depth of thinking ("seeing moves ahead," contingencies, evaluating alternatives)
- **Time Factor:** Bonus +5–10 if solved under 2 min; slight penalty if >4 min (capped to avoid punishing deep thinkers)

**Why Chess?**
- Excellent at measuring **strategic foresight**, **pattern recognition**, **calculation depth**, **candidate-move evaluation**
- Backed by cognitive studies linking chess skills to planning/executive function
- Provides objective feedback (best move is deterministic)
- Naturally forces "explain your thinking" reflection (verbal depth = strategic sophistication)

---

### Part 3: Closer (Resource/Decision Scenario) — 1–2 min
**Purpose:** Test resource prioritization under constraints, trade-off awareness, and contingency planning.

**Task:** Prioritize 4 project tasks with limited resources
```
Tasks:
A) Fix critical bug      → Blocks 50% of users
B) Add new feature       → Revenue potential +20%
C) Market research       → Validates product-market fit
D) Competitor analysis   → Informs strategy
```

**User Input:**
1. **Rank by priority** (optimal: A, C, B, D or A, B, C, D)
2. **Justify the ranking** (must explain trade-offs and risk impact)
3. **Contingency plan** (if top priority fails, what's Plan B?)

**Scoring (0–20 points):**
- **Logical prioritization + risk/trade-off awareness + backup plan depth:**
  - **Excellent (15–20):** A first (critical bug), clear risk framing, detailed contingency
  - **Good (10–14):** Correct priority, identifies risks, adequate contingency
  - **Adequate (5–9):** Prioritizes correctly but weak justification
  - **Weak (0–4):** Wrong priority or no contingency thinking

**Rubric Components:**
- **Prioritization correctness:** Critical bug (A) should come first—blocks core functionality
- **Risk awareness:** Justification must mention impact, urgency, or dependencies
- **Contingency depth:** If/then logic, fallback plan clarity, evidence of "Plan B" thinking

---

## Integration with GameState

### Substat Contributions
The assessment outputs mapped substat scores:

| Substat | Source | Calculation |
|---------|--------|-------------|
| **Strategy** | Part 1 + Part 2 | Avg of river crossing + chess puzzle scores |
| **Reason** | Part 2 + Part 3 | Avg of chess + resource prioritization |
| **Perception** | Part 2 | Chess puzzle accuracy + speed bonus |
| **Conviction** | Part 3 + Part 1 | Resource decision confidence + river crossing certainty |
| **Resilience** | Part 1 + Part 3 | Contingency depth + backup planning |

### Output Structure
```typescript
{
  strategyScore: number;              // 0-100, average of 3 parts
  totalScore: number;                 // Raw points (max ~70)
  partScores: {
    warmup: number;                   // 0-30 (river crossing)
    core: number;                     // 0-50 (chess puzzles)
    closer: number;                   // 0-20 (resource scenario)
  };
  substatContributions: {
    Strategy: number;                 // 0-95
    Reason: number;                   // 0-95
    Perception: number;               // 0-95
    Conviction: number;               // 0-95
    Resilience: number;               // 0-95
  };
  chessHistory: any[];                // Puzzle history with reflections
  riverSolution: string;              // User's river crossing answer
  resourceRanking: string[];          // Task prioritization
  resourceJustification: string;      // Why user ranked that way
  resourceContingency: string;        // Plan B if top priority fails
}
```

---

## Scoring Philosophy

### Why 3-Part Structure?
1. **Accessibility:** Part 1 (non-chess warm-up) includes non-chess players
2. **Depth:** Part 2 (chess) measures the specific domain you wanted
3. **Breadth:** Part 3 (decision-making) generalizes strategy beyond games
4. **Progression:** Simple → Complex, building confidence

### Why These Ranges?
- **Part 1 (0–30):** Quick warm-up, doesn't dominate overall score
- **Part 2 (0–50):** Double-weighted to reflect chess expertise value
- **Part 3 (0–20):** Decision-making reality check, emphasizes contingency thinking

### Final Score Calculation
```
Average Strategy Score = (Part1 + Part2 + Part3) / 3
                       = (0-30 + 0-50 + 0-20) / 3
                       → 0-100 scaled
```

---

## Gameplay Flow

```
┌─────────────────────────────────────────────────────────────┐
│ INTRO: 3-Part Briefing (Strategy Matrix 3.0)                │
│ Explains structure, time estimates, scoring overview         │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ PART 1: Warm-Up (River Crossing)                            │
│ - Display puzzle                                             │
│ - User enters solution (text)                               │
│ - Immediate feedback with sample solution                   │
│ - Score: 0-30 points                                        │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ PART 2: Core (Chess Tactics, 2 puzzles)                    │
│ - Briefing screen                                            │
│ - Puzzle 1: User enters move → Reflection → Feedback       │
│ - Puzzle 2: User enters move → Reflection → Feedback       │
│ - Score: 0-50 points                                        │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ PART 3: Closer (Resource Prioritization)                    │
│ - Display scenario & 4 tasks                                │
│ - User ranks, justifies, provides contingency               │
│ - Score: 0-20 points                                        │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ COMPLETE: Results & Analysis                                │
│ - Overall Strategy Score (0-100)                            │
│ - Part scores & substat contributions                       │
│ - Integration into Intelligence stat                        │
└─────────────────────────────────────────────────────────────┘
```

---

## Implementation Notes

### Validation Rules
- **Part 1:** Natural language analysis (length, keywords: "back," "return," step count)
- **Part 2:** Algebraic notation validation using regex
- **Part 3:** Requires all 4 tasks ranked, justification >30 chars, contingency >20 chars

### Bonus Mechanics
- **Part 1:** +5–10 for explaining contingencies explicitly
- **Part 2:** +5–10 for speed (under 2 min), +10–15 for verbal depth
- **Part 3:** +5 for risk language ("critical," "impact," "dependency")

### Time Optimization
- **Part 1:** 1–2 min (simple text input)
- **Part 2:** 2–4 min (2 puzzles, reflections)
- **Part 3:** 1–2 min (ranking, short text)
- **Total:** 5–7 min, well-balanced for assessment fatigue

---

## Files Modified
- **OnboardingPage.tsx:** Replaced `ChessStrategyTest` with `StrategyAssessment3Part`
- Updated component reference in step handler (line ~2377)

---

## Testing Checklist
- [ ] Part 1 validation: River crossing detects optimal/partial solutions
- [ ] Part 1 feedback: Shows correct solution example
- [ ] Part 2 chess moves: Accepts/rejects valid algebraic notation
- [ ] Part 2 reflection: Captures user's strategic reasoning
- [ ] Part 3 ranking: Enforces all 4 items ranked
- [ ] Part 3 feedback: Scores based on priority correctness & contingency depth
- [ ] Final output: Substats correctly mapped to Intelligence stat
- [ ] UI: Progress bars show 33%, 67%, 100% for each part
- [ ] Performance: Total time ~5-7 min, no lag

---

## Future Enhancements
1. **Dynamic difficulty:** Adjust chess puzzle difficulty based on Part 1 performance
2. **Chess visualization:** Optional board diagram for Part 2 (SVG/Canvas)
3. **More scenarios:** Expand Part 3 with domain-specific scenarios (tech, business, etc.)
4. **Percentile comparison:** Show how user ranks vs. other players in each part
5. **Cognitive profiling:** Generate "Strategic Profile" describing user's decision style

---

## Questions & Feedback
For issues or feature requests, see the STRATEGY_3PART_MODULE.md discussion thread.
