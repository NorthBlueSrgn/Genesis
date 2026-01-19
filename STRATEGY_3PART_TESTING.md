# Strategy 3-Part Module: Testing Guide

## Overview
This guide provides test cases for the `StrategyAssessment3Part` component covering all three parts, validation logic, scoring, and edge cases.

---

## Part 1: River Crossing (Warm-Up)

### Test Case 1.1 – Optimal Solution
**Input:**
```
1. I take the goat across the river
2. I return alone
3. I take the wolf across
4. I bring the goat back to prevent the wolf from eating it
5. I take the cabbage across
6. I return alone
7. I take the goat across finally
```
**Expected Outcome:**
- ✅ Passes all validation checks
- Score: **28–30/30**
- Feedback: "Excellent! You understood the contingency..."
- Level: **OPTIMAL**

### Test Case 1.2 – Partial Solution (Missing Goat-Back)
**Input:**
```
1. Take goat
2. Take wolf
3. Take cabbage
4. Done
```
**Expected Outcome:**
- ⚠️ Fails because no "bring back" understanding
- Score: **8–15/30**
- Feedback: "Partial success. Key insight: you must bring something BACK..."
- Level: **PARTIAL**

### Test Case 1.3 – Too Brief
**Input:** `Take goat, then wolf, then cabbage`
**Expected Outcome:**
- ✗ Rejects (length < 50 chars)
- Score: **0–5/30**
- Feedback: "Response too brief. You need to describe the full sequence..."
- Level: **INCOMPLETE**

### Test Case 1.4 – Wrong/Impossible
**Input:**
```
I take the wolf and goat together. 
Wait, the wolf eats the goat. 
Let me try again... I give up.
```
**Expected Outcome:**
- ✗ Fails logic
- Score: **0–4/30**
- Feedback: "✗ Partial success. The goat must return to prevent eating..."
- Level: **STUCK**

### Test Case 1.5 – Good but Minor Inefficiency
**Input:**
```
1. Take goat across
2. Return
3. Take wolf across and bring goat back
4. Take cabbage across
5. Return and get goat
```
**Expected Outcome:**
- ✅ Logic is sound, minor sequencing gaps
- Score: **20–24/30**
- Feedback: "✓ Good logic! You grasped the key principle..."
- Level: **GOOD**

---

## Part 2: Chess Tactics (Core)

### Test Case 2.1 – Correct Move (Puzzle 1)
**Puzzle:** "Material Gain" → Best move: Qh7
**Input:** `Qh7`
**Expected Outcome:**
- ✅ Correct answer
- Feedback: "✓ Correct! Queen sacrifice threatens checkmate..."
- Score contribution: **+25 pts**
- Proceeds to reflection

### Test Case 2.2 – Correct Move (Case Insensitive)
**Input:** `qh7` or `QH7`
**Expected Outcome:**
- ✅ Accepts (case-insensitive)
- Same as 2.1

### Test Case 2.3 – Wrong Move
**Input:** `Nf3` (instead of Qh7)
**Expected Outcome:**
- ✗ Incorrect
- Feedback: "✗ Not quite. The best move is Qh7..."
- Score contribution: **0 pts**
- Shows reflection prompt anyway

### Test Case 2.4 – Invalid Notation
**Input:** `take queen` or `q-h-7`
**Expected Outcome:**
- ✗ Invalid notation
- Feedback: "✗ Invalid notation. Use algebraic (e.g., Nxe5, e4, O-O)..."
- Validation catches format error

### Test Case 2.5 – Valid Special Moves
| Input | Status | Notes |
|-------|--------|-------|
| `O-O` | ✅ Valid | Kingside castling |
| `O-O-O` | ✅ Valid | Queenside castling |
| `e8=Q` | ✅ Valid | Promotion to Queen |
| `Nxe5+` | ✅ Valid | Knight capture with check |
| `Qxh7#` | ✅ Valid | Queen capture with checkmate |

### Test Case 2.6 – Reflection Depth Scoring
**First Puzzle (correct answer):**
- Reflection: "A fork attacks two pieces." → Captures move
- Reflection: "This is a classic knight fork pattern. It wins material decisively because the queen and rook cannot both escape. By recognizing this pattern, I can apply it to other positions where pieces are on the same diagonal or knight-move apart." → Depth bonus +10–15 pts

### Test Case 2.7 – Multiple Puzzles Flow
1. User solves Puzzle 1 (Qh7) ✅
2. Reflects on fork concept ✅
3. Clicks "NEXT PUZZLE"
4. Puzzle 2 displays (Nf7)
5. Progress bar updates to 50%
6. User solves Puzzle 2 (Nf7) ✅
7. Reflects on material gain
8. Clicks "NEXT TO PART 3"
9. Transitions to Part 3

---

## Part 3: Resource Prioritization (Closer)

### Test Case 3.1 – Optimal Ranking
**Ranking:** `A, C, B, D`
**Justification:** "Critical bugs block all users, so fixing the bug (A) is essential. Market research (C) validates our direction before investing in features. Feature development (B) comes next as it drives revenue. Competitor analysis (D) is lower priority as internal issues matter more."
**Contingency:** "If the critical bug proves more complex than expected, I would shift to market research to validate the feature roadmap in parallel, then return to the bug once the research informs priorities."

**Expected Outcome:**
- ✅ All validations pass
- Score: **20/20**
- Feedback: "✓ Excellent strategic thinking! You prioritized impact (critical bug), showed trade-off awareness, and articulated contingencies."

### Test Case 3.2 – Missing Contingency
**Ranking:** `A, B, C, D` (correct)
**Justification:** "Critical bugs first." (< 30 chars? Let's say it's >30 but weak)
**Contingency:** "" (empty)

**Expected Outcome:**
- ✗ Validation fails (contingency required)
- Error: "✗ Please describe a contingency plan."
- User can retry

### Test Case 3.3 – Incomplete Ranking
**Ranking:** `A, B` (only 2 items)
**Justification:** "Full explanation..."
**Contingency:** "Full backup plan..."

**Expected Outcome:**
- ✗ Validation fails (all 4 required)
- Error: "✗ Please rank all 4 items."

### Test Case 3.4 – Suboptimal Priority (Bug not first)
**Ranking:** `C, A, B, D` (market research first)
**Justification:** "Market research is critical to validate product-market fit before investing in features."
**Contingency:** "If market research shows weak demand, we pivot to fixing bugs."

**Expected Outcome:**
- ✅ Validations pass
- Score: **5–9/20**
- Feedback: "✗ Reconsider: critical bugs block users. That usually comes first. Strategic foresight means addressing threats before opportunities."

### Test Case 3.5 – Risk Language Bonus
**Ranking:** `A, B, C, D` (correct)
**Justification:** "The critical bug poses **high risk** (blocks 50% users), so it has the highest **impact**. Feature development creates **opportunity**, but only if the platform is stable. Market research **mitigates risk** of wasting effort on wrong features."
**Contingency:** "If the bug fix causes a regression, we **fall back** to rolling back and re-prioritizing market research."

**Expected Outcome:**
- ✅ Validates
- Score: **18–20/20**
- Risk language (critical, impact, risk, opportunity) detected
- Contingency logic clear (if/then)
- Feedback acknowledges risk framing

---

## Integration & Output Testing

### Test Case 4.1 – Final Score Calculation
**Inputs:**
- Part 1: 28/30
- Part 2: 50/50 (2 puzzles × 25 pts)
- Part 3: 20/20

**Expected Output:**
```typescript
{
  strategyScore: 98,  // avg([28, 50, 20]) → 98
  totalScore: 98,
  partScores: {
    warmup: 28,
    core: 50,
    closer: 20
  },
  substatContributions: {
    Strategy: 94,      // avg(28 + 50) = 39 → min(95, 39) = 39... wait, needs scaling
    Reason: 85,
    Perception: 95,
    Conviction: 80,
    Resilience: 90
  },
  // ... history data
}
```

**Note:** Substat mapping should scale part scores appropriately. Current implementation clamps to 0–95.

### Test Case 4.2 – Substat to Intelligence Integration
All substats (Strategy, Reason, Perception, Conviction, Resilience) contribute to Intelligence stat:
```
Intelligence = avg(Reason, Knowledge, Adaptability, Strategy, Perception)
```

**Verification:** Check `calculateSubstatsFromAllTests()` in `scoringService.ts`

---

## UI/UX Testing

### Test Case 5.1 – Progress Bar Progression
| Part | Expected Width | Color |
|------|-----------------|-------|
| Part 1 intro | 33% | Yellow |
| Part 1 result | 33% | Yellow |
| Part 2 briefing | 67% | Green |
| Part 2 puzzles | 67% | Green |
| Part 3 | 100% | Purple |

### Test Case 5.2 – Phase Transitions
```
'intro' → 'part1_input' → 'part1_feedback' → 'part2_briefing' 
→ 'part2_puzzle' → 'part2_reflection' → 'part3_input' 
→ 'part3_feedback' → 'complete'
```

### Test Case 5.3 – Terminal Shell Styling
- ✅ `TerminalShell` wraps each phase
- ✅ Title updates per phase
- ✅ Scanlines + grain overlay visible
- ✅ Accent color changes (yellow → green → purple)
- ✅ Responsive on mobile (sm breakpoints)

### Test Case 5.4 – Buttons Disabled States
- Part 1 submit: Disabled if input < 50 chars ✅
- Part 2 submit: Disabled if move empty ✅
- Part 3 submit: Disabled if validation fails ✅

---

## Edge Cases & Error Handling

### Test Case 6.1 – Rapid Submission
**Scenario:** User clicks "SUBMIT" multiple times quickly
**Expected:** Debounced or state-locked (not double-submitted)

### Test Case 6.2 – Browser Back Button
**Scenario:** User navigates back mid-assessment
**Expected:** Returns to last saved phase (or graceful restart)

### Test Case 6.3 – Long Text Input
**Part 1:** Input > 1000 chars
**Part 3:** Justification > 500 chars
**Expected:** Accepts (textarea allows scrolling)

### Test Case 6.4 – Special Characters
**Input:** `Qh7+ (checkmate threat!)` or `A&B&C&D`
**Expected:** Handles gracefully (chars stripped or kept as-is)

---

## Performance Testing

### Test Case 7.1 – Load Time
- Component renders in < 500ms
- No lag when transitioning between phases

### Test Case 7.2 – Total Duration
- Part 1: 1–2 min (confirmed via timer)
- Part 2: 2–4 min
- Part 3: 1–2 min
- **Total: 5–7 min** ✅

### Test Case 7.3 – Memory
- No memory leaks when cycling through phases
- State cleanup on completion

---

## Accessibility & Localization

### Test Case 8.1 – Keyboard Navigation
- Tab through inputs ✅
- Enter to submit ✅
- Focus visible on all buttons ✅

### Test Case 8.2 – Screen Reader
- Terminal shell title read aloud ✅
- Form labels associated ✅
- Feedback messages announced ✅

### Test Case 8.3 – Language
- All text in English (no i18n currently)
- Chess notation universal (Qh7, Nf7, etc.)

---

## Regression Testing Checklist

Before release, verify:
- ✅ No compile errors (TypeScript)
- ✅ No console warnings
- ✅ Part 1 scoring logic correct
- ✅ Part 2 chess move validation
- ✅ Part 3 ranking requirements enforced
- ✅ All phase transitions working
- ✅ Final output structure matches expected schema
- ✅ Substats integrate into Intelligence stat
- ✅ UI responsive on mobile (375px–1920px)
- ✅ Performance < 7 min total
- ✅ No external API calls (all local validation)

---

## Example Test Run

### Full Happy Path
```
1. User clicks "BEGIN ASSESSMENT" on intro screen
2. Part 1: Enters river crossing solution → Score 28/30
3. Proceeds to Part 2
4. Puzzle 1: Enters Qh7 ✅ → Reflects → Next
5. Puzzle 2: Enters Nf7 ✅ → Reflects → Next to Part 3
6. Part 3: Ranks A, C, B, D → Justifies → Contingency → Score 20/20
7. Completes with:
   - Total: 98/100
   - Substats mapped
   - History saved
   - Returns to GameState
```

---

## Known Limitations / Future Work
- ✅ Chess board visuals not included (text-based only)
- ✅ No dynamic difficulty adjustment between parts
- ✅ Part 1 validation is heuristic (not perfect at detecting all solutions)
- ⚠️ Substat scaling needs review (ensure 0–95 range honored)

---

**Last Updated:** January 19, 2026
**Component:** `StrategyAssessment3Part` in `OnboardingPage.tsx`
