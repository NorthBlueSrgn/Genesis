# Strategy 3-Part Module: Quick Reference

## Component: `StrategyAssessment3Part`
**Location:** `pages/OnboardingPage.tsx`

---

## Part-by-Part Breakdown

### 🟡 PART 1: Warm-Up (River Crossing)
**Time:** 1–2 min | **Max Score:** 30 pts | **Color:** Yellow

| Aspect | Details |
|--------|---------|
| **Puzzle** | Transport wolf, goat, cabbage across river (boat holds 1 item + you) |
| **Optimal Solution** | 7 moves: Goat → Return → Wolf/Cabbage → **Goat BACK** → Other → Return → Goat |
| **Key Insight** | Must bring goat back (contingency) to prevent predation |
| **Scoring** | 25–30 (optimal) \| 15–24 (good) \| 5–14 (partial) \| 0–4 (wrong) |
| **Bonus** | +5–10 for explaining contingencies |
| **Tests** | Forward planning, threat anticipation, contingency thinking |

---

### 🟢 PART 2: Core (Chess Tactics)
**Time:** 2–4 min | **Max Score:** 50 pts | **Color:** Green

| Aspect | Details |
|--------|---------|
| **Format** | 2 short chess puzzles (mate-in-2 or win-material-in-3) |
| **Per Puzzle** | Enter move (algebraic) + reflect on strategic principle |
| **Puzzle 1** | **"Material Gain"** → Qh7 (queen sacrifice, forces win) |
| **Puzzle 2** | **"Tactical Fork"** → Nf7 (knight forks queen + rook) |
| **Scoring (per puzzle)** | ~25 pts each |
| **Bonus** | +5–10 speed (under 2 min) \| +10–15 verbal depth |
| **Tests** | Tactical calculation, pattern recognition, forcing moves, candidate evaluation |

---

### 🟣 PART 3: Closer (Resource Prioritization)
**Time:** 1–2 min | **Max Score:** 20 pts | **Color:** Purple

| Aspect | Details |
|--------|---------|
| **Scenario** | Limited time/budget/team. Prioritize 4 tasks. |
| **Tasks** | A) Critical bug (blocks 50% users) \| B) New feature (+20% revenue) \| C) Market research \| D) Competitor analysis |
| **User Input** | 1) Rank (optimal: A, C, B, D) \| 2) Justify trade-offs \| 3) Contingency plan |
| **Scoring** | 15–20 (A first + risk awareness + backup) \| 10–14 (good logic) \| 5–9 (partial) \| 0–4 (wrong priority) |
| **Tests** | Prioritization under constraints, risk framing, contingency planning |

---

## Score Aggregation

### Individual Part Scores
```
Part 1 (Warmup):    0–30 pts  (River Crossing)
Part 2 (Core):      0–50 pts  (Chess Puzzles)
Part 3 (Closer):    0–20 pts  (Resource Decision)
────────────────────────────
TOTAL:              0–100 pts  (averaged to 0-100 scale)
```

### Substat Mapping
| Substat | Contribution | Formula |
|---------|--------------|---------|
| **Strategy** | Primary | avg(Part1 + Part2) → 0–95 |
| **Reason** | Secondary | avg(Part2 + Part3) → 0–95 |
| **Perception** | Secondary | Part2 accuracy + speed → 0–95 |
| **Conviction** | Tertiary | avg(Part1 + Part3 depth) → 0–95 |
| **Resilience** | Tertiary | Contingency depth → 0–95 |

---

## User Flow (UI)

```
[INTRO: "3-Part Calibration" briefing]
    ↓
[PART 1: River Crossing input → Score feedback]
    ↓
[PART 2: Chess puzzle 1 & 2 → Reflections → Scores]
    ↓
[PART 3: Resource ranking → Justification → Contingency → Score]
    ↓
[COMPLETE: Final score + substat breakdown]
```

---

## Validation Checklist

### Part 1 (River Crossing)
- ✅ Response >50 chars
- ✅ Contains keywords: "back" or "return"
- ✅ Has step descriptions (>=5 steps)
- ✅ Shows goat-first understanding
- ✅ Detects suboptimal vs. optimal solutions

### Part 2 (Chess)
- ✅ Accepts valid algebraic notation (Nxe5, e4, O-O, Qh7, etc.)
- ✅ Case-insensitive matching
- ✅ Rejects invalid notation
- ✅ Captures reflection text (any length OK, bonus for depth)
- ✅ Tracks per-puzzle history

### Part 3 (Resource)
- ✅ Requires all 4 tasks ranked (A, B, C, D)
- ✅ Justification >30 chars required
- ✅ Contingency >20 chars required
- ✅ Scores based on: prioritization + risk language + backup logic
- ✅ Feedback explains why ranking is optimal

---

## CSS Classes Used
- **Progress bar:** `bg-[color]-500 w-[33%|67%|100%]`
- **Part wrappers:** `border-[color]-900/50` (yellow/green/purple)
- **Terminal shell:** `font-orbitron` + `tracking-widest` for authenticity
- **Color scheme:** Yellow (warm-up) → Green (core) → Purple (closer)

---

## Sample Outputs

### Part 1 Score Feedback
```
✓ Excellent! You understood the contingency: bring the goat back 
  to prevent predation. This is forward planning and risk mitigation.
  
SCORE: 28/30 (OPTIMAL)
```

### Part 2 Score Feedback
```
✓ Correct! Knight forks queen and rook, winning material decisively.
  Strategic Concept: Master tactical patterns (forks, pins, skewers).
```

### Part 3 Score Feedback
```
✓ Excellent strategic thinking! You prioritized impact (critical bug),
  showed trade-off awareness, and articulated contingencies.
  
SCORE: 20/20 (EXCELLENT)
```

---

## Performance Targets
- **Part 1:** 1–2 min (text input, simple validation)
- **Part 2:** 2–4 min (2 puzzles, reflections)
- **Part 3:** 1–2 min (ranking + text fields)
- **Total:** **5–7 min** (optimal for assessment without fatigue)

---

## Key Innovation: Why 3-Part?

| Why | Benefit |
|-----|---------|
| **Non-chess warmup** | Includes non-chess players, tests pure planning |
| **Double-weighted chess core** | Measures domain expertise you care about |
| **Real-world scenario** | Grounds strategy in practical decision-making |
| **Progressive difficulty** | Simple → Complex builds confidence |
| **Separate scoring** | Each part scored independently + combined fairly |
| **Contingency focus** | All 3 parts test "Plan B" thinking (core strategy skill) |

---

## Files
- `OnboardingPage.tsx` – Main component (`StrategyAssessment3Part`)
- `STRATEGY_3PART_MODULE.md` – Full documentation
- `STRATEGY_3PART_QUICK_REF.md` – This file

---

**Last Updated:** January 19, 2026
