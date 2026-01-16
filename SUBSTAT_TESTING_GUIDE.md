# Substat Calculation Testing Guide

## Quick Verification Tests

Run these scenarios to verify the substat system is working correctly.

**BASELINE REFERENCE:** See `SUBSTAT_BASELINE_CALIBRATION.md` for C-tier (50%) benchmarks for all tests and substats.

---

## Test 1: Average Joe (C-Tier Baseline = 50%)

**Setup:** User scores exactly at C-tier (50%) on all tests – represents true average person

**Inputs:**
- Physical Performance: Bench 60kg, Squat 80kg, Deadlift 100kg, 100m Sprint 13sec, 5k 28min
- Fitts Law: 65% accuracy, 350ms reaction
- Simon Says: Level 12-13 of 25
- Breath Hold: 60 seconds
- Vitality Questionnaire: Sleep 6.5 hrs, Sleep Quality 5/10, Diet 5/10, Stress 6/10
- Stroop Test: 10/15 correct
- Knowledge Test: 50%
- Reasoning Test: 50%
- War Room: 50% accuracy
- Creativity: All 5 prompts at 50%
- Psycho-Social: All sliders at 50
- Dilemma: Mixed moral choices (50% consistent)

**Expected Results:**
- ✅ All substats: 45-55% (C-tier range)
- ✅ All main stats: 48-52% (C-tier average)
- ✅ All ranks: C or C+ (no variation)
- ✅ Clear baseline established
- ❌ Should NOT see: Any stat > 60% or < 40%

**Verify:**
```
IF all_substats_within_45_55:
  PASS - C-tier baseline established
ELIF any_substat < 40 OR > 60:
  FAIL - Baseline miscalibrated
ELIF all_main_stats_within_48_52:
  PASS - Averaging works correctly
ELSE:
  FAIL - Baseline not anchored
```

---

## Test 2: Elite Physical (High in Easy/Moderate Substats)

**Setup:** User excels at physical tests but average elsewhere

**Inputs:**
- Physical Performance: Bench 150kg, Squat 200kg, Deadlift 280kg, 100m 10sec, 5k 18min
- Fitts Law: 90% accuracy, 250ms reaction
- All others: 50% (C-tier)

**Expected Results:**
- ✅ Strength: 85-90% (A-tier)
- ✅ Speed: 80-85% (A-tier)
- ✅ Endurance: 80-85% (A-tier)
- ✅ Dexterity: 70-80% (B-tier)
- ✅ Agility: 75-85% (B-tier)
- ✅ Physical stat: 78-85% (A-tier) ← Average of 5 substats
- ✅ Other stats: 48-52% (C-tier, unchanged)
- ❌ Should NOT see: All stats > 70% (spillover inflation)

**Verify:**
```
IF Physical > 78 AND Intelligence == 50:
  PASS - Physical isolated
ELIF Vitality > 60:
  FAIL - Physical spillover
ELIF Strength > 90:
  FAIL - Inflation not capped
ELSE:
  PASS - Physical excellence achievable
```

**Setup:** User scores poorly on all tests

**Inputs:**
- Physical Performance: All lifts at minimal (20-30 kg)
- Fitts Law: <30% accuracy, >800ms
- Simon Says: Level 2-3
- Breath Hold: 30 seconds
- Vitality: Sleep 4 hrs, stress 90, poor diet
- Stroop: 3/15 correct
- Knowledge Test: 10%
- Reasoning Test: 15%
- War Room: 20%
- Creativity: Minimal effort
- Psycho-Social: 5-10 on all sliders
- Dilemma: Random choices

**Expected Results:**
- ✅ All substats: 15-30% (below C-tier floor)
- ✅ All main stats: 18-32% (below C-tier baseline)
- ✅ All ranks: D or E (NOT lower than E)
- ✅ Floor respected (minimum 10% to avoid zero)
- ❌ Should NOT see: Any stat < 10% or = 0%

**Verify:**
```
IF any_substat < 10:
  FAIL - Underflow (no negative scores)
ELIF all_stats_between_15_30:
  PASS - Floor maintained
ELIF any_main_stat < 18:
  FAIL - Main stat too low
ELSE:
  PASS - Graceful degradation
```

---

## Test 3: Athletic Genius (Moderate Difficulty Substats)

**Setup:** User excels at tests requiring sustained effort (Strength, Knowledge, Reason)

**Inputs:**
- Physical Performance: Bench 140kg, Squat 180kg, Deadlift 260kg (85% each)
- Knowledge Test: 85%
- Reasoning Test: 80%
- All others: 50% (C-tier)

**Expected Results:**
- ✅ Strength: 85% (A-tier)
- ✅ Knowledge: 85% (A-tier)
- ✅ Reason: 80% (A-tier)
- ✅ Physical stat: ~70% (B-tier, pulled down by others)
- ✅ Intelligence stat: ~70% (B-tier, pulled down by others)
- ✅ Other stats: 48-52% (C-tier)
- ❌ Should NOT see: All stats > 70% (no spillover)

**Verify:**
```
IF Strength == 85 AND Knowledge == 85 AND others_near_50:
  PASS - Moderate substats properly weighted
ELIF Spirit > 60:
  FAIL - Spillover between categories
ELIF Physical == 85:
  FAIL - Should be dragged down by weak Dexterity
ELSE:
  PASS - Moderate difficulty working
```

**Setup:** User performs well on Fitts Law but averagely everywhere else

**Inputs:**
- Fitts Law: 90% accuracy, <300ms
- Simon Says: Level 10 (medium)
- All others: Default/average (50-50%)

**Expected Results:**
- ✅ Dexterity: 70-80% (boosted)
- ✅ Focus: 65-75% (boosted)
- ✅ Perception: 60-70% (slightly boosted)
- ✅ Physical stat: 60-70% (average)
- ✅ Other stats: ~50% (unchanged)
- ❌ Should NOT see: All stats boosted equally

**Verify:**
```
IF Dexterity > Focus > Physical > Intelligence:
  PASS - Correct prioritization
ELIF all_stats > 55%:
  FAIL - Spillover inflation
ELIF Dexterity < 60%:
  FAIL - Fitts not counted
ELSE:
  PASS - Fitts properly integrated
```

---

## Test 4: Hard to Achieve (Willpower/Composure Specialist)

**Setup:** User excels at tests requiring extreme discipline (Stroop, War Room, Focus)

**Inputs:**
- Resilience Stroop: 14/15 correct (93%)
- War Room Strategy: 90% accuracy
- Focus during all tests: Exceptional (95%)
- All others: 50% (C-tier)

**Expected Results:**
- ✅ Focus: 90-95% (S-tier, very rare)
- ✅ Composure: 90-95% (S-tier, very rare)
- ✅ Willpower: 85-95% (S-tier)
- ✅ Resilience: 85-90% (A-tier)
- ✅ Psyche stat: 85-92% (S-tier, rare)
- ✅ Other stats: 48-52% (C-tier)
- ✅ Only Psyche boosted (no spillover)

**Verify:**
```
IF Focus > 90 AND Composure > 90 AND Psyche > 85:
  PASS - Hard substats properly gated
ELIF Focus == 50:
  FAIL - Stroop not integrated
ELIF Physical > Intelligence:
  FAIL - Improper crosstalk
ELSE:
  PASS - Hard substats achievable for elite players
```

**Setup:** User excels at tests requiring extreme discipline (Stroop, War Room, Focus)

**Inputs:**
- Resilience Stroop: 14/15 correct (93%)
- War Room Strategy: 90% accuracy
- Focus during all tests: Exceptional (95%)
- All others: 50% (C-tier)

**Expected Results:**
- ✅ Focus: 90-95% (S-tier, very rare)
- ✅ Composure: 90-95% (S-tier, very rare)
- ✅ Willpower: 85-95% (S-tier)
- ✅ Resilience: 85-90% (A-tier)
- ✅ Psyche stat: 85-92% (S-tier, rare)
- ✅ Other stats: 48-52% (C-tier)
- ✅ Only Psyche boosted (no spillover)

**Verify:**
```
IF Focus > 90 AND Composure > 90 AND Psyche > 85:
  PASS - Hard substats properly gated
ELIF Focus == 50:
  FAIL - Stroop not integrated
ELIF Physical > Intelligence:
  FAIL - Improper crosstalk
ELSE:
  PASS - Hard substats achievable for elite players
```

---

## Test 5: Spirit Questionnaire (Variable Substats - Faith)

**Setup:** User has high religiosity (wide variable range), low stress, high social confidence

**Inputs:**
- Religiosity slider: 90 (believer)
- Social Confidence: 85
- Conflict Resolution: 80
- Stress Levels: 20 (tranquility = 80)
- All others: 50% (C-tier)

**Expected Results:**
- ✅ Faith: 90% (A-tier) ← Direct, wide range (5-95%)
- ✅ Charisma: 85% (A-tier)
- ✅ Composure: 80% (A-tier)
- ✅ Tranquility: 80% (inverse stress)
- ✅ Empathy: 82% (avg of charisma + tranquility)
- ✅ Spirit stat: 83% (A-tier, boosted from 50%)
- ✅ Psyche stat: 70-75% (B-tier, composure boosted)
- ✅ Faith can range 5-95% (no gatekeeping for beliefs)

**Verify:**
```
IF Faith == 90 AND Spirit > 80 AND Tranquility == 80:
  PASS - Questionnaire properly mapped
ELIF Faith == 50:
  FAIL - Religiosity not counted
ELIF Spirit < 75:
  FAIL - Spirit substats not averaged
ELIF Faith_max != 95:
  FAIL - Faith range not wide enough
ELSE:
  PASS - Variable substat (Faith) working
```

---

## Test 6: Atheist/Secular Player (Variable Substat Opposite)

**Setup:** User has low religiosity (opposite of Test 5), high stress

**Inputs:**
- Religiosity slider: 5 (atheist/secular)
- Social Confidence: 85
- Conflict Resolution: 80
- Stress Levels: 85 (tranquility = 15)
- All others: 50% (C-tier)

**Expected Results:**
- ✅ Faith: 5% (E-tier) ← Same valid as 90%
- ✅ Charisma: 85% (A-tier, unchanged)
- ✅ Composure: 30% (D-tier, stress high)
- ✅ Tranquility: 15% (E-tier, inverse stress)
- ✅ Empathy: 50% (C-tier, avg)
- ✅ Spirit stat: 36% (C-tier, pulled down by Faith/Tranquility)
- ✅ No penalty for low Faith (personal choice)

**Verify:**
```
IF Faith == 5 AND Spirit < 40:
  PASS - Low Faith valid (not penalized)
ELIF Faith_penalty_exists:
  FAIL - Should not penalize beliefs
ELIF Charisma > 80:
  PASS - Charisma independent of Faith
ELSE:
  PASS - Variable substats culturally neutral
```

---

## Test 7: Creative Soul (Easy-to-Achieve Substats)

**Setup:** User excels at tests that feel achievable (Expression, Adherence, Empathy)

**Inputs:**
- Creativity Expression prompt: 90% (good writing)
- Diet Consistency: 90% (disciplined eater)
- Dilemma Empathy: 85% (consistently kind choices)
- All others: 50% (C-tier)

**Expected Results:**
- ✅ Expression: 90% (A-tier, easy achievable)
- ✅ Adherence: 90% (A-tier, easy achievable)
- ✅ Empathy: 85% (A-tier, easy achievable)
- ✅ Creativity stat: ~65% (B-tier, pulled down by Imagination/Innovation at 50%)
- ✅ Vitality stat: ~65% (B-tier, pulled down by others)
- ✅ Spirit stat: ~70% (B-tier, pulled down by Purpose/Conviction)
- ✅ Shows that some A-tiers don't pull main stat to A (design goal)

**Verify:**
```
IF Expression == 90 AND Adherence == 90 AND Empathy == 85:
  PASS - Easy substats properly counted
ELIF Creativity > 75:
  FAIL - Easy substats shouldn't inflate entire stat
ELIF Creativity == 50:
  FAIL - Easy substats should boost creative aspects
ELSE:
  PASS - Easy substats accessible but balanced
```

**Setup:** Creativity AI evaluation returns scores

**Inputs:**
- Creative Protocol Test: All 5 responses evaluated
- AI returns: { Imagination: {percentile: 75}, Innovation: {percentile: 68}, ...}

**Expected Results:**
- ✅ Imagination: 75% (from AI)
- ✅ Innovation: 68% (from AI)
- ✅ Style, Vision, Expression: Match AI output
- ✅ Creativity stat: Average of 5 = 70% (approx)
- ✅ Other stats: Unchanged at 50%

**Verify:**
```
IF Creativity > 65 AND < 75:
  PASS - Creativity properly evaluated
ELIF Imagination != 75:
  FAIL - AI evaluation not used
ELIF Creativity == 50:
  FAIL - Creativity not integrated
ELSE:
  PASS - 5-prompt system working
```

**Setup:** Creativity AI evaluation returns scores

**Inputs:**
- Creative Protocol Test: All 5 responses evaluated
- AI returns: { Imagination: {percentile: 75}, Innovation: {percentile: 68}, ...}

**Expected Results:**
- ✅ Imagination: 75% (from AI)
- ✅ Innovation: 68% (from AI)
- ✅ Style, Vision, Expression: Match AI output
- ✅ Creativity stat: Average of 5 = 70% (approx)
- ✅ Other stats: Unchanged at 50%

**Verify:**
```
IF Creativity > 65 AND < 75:
  PASS - Creativity properly evaluated
ELIF Imagination != 75:
  FAIL - AI evaluation not used
ELIF Creativity == 50:
  FAIL - Creativity not integrated
ELSE:
  PASS - 5-prompt system working
```

---

## Test 8: Full Integration Test (5 Persona Profiles)

**Setup:** User with varied performance across tests

**Inputs:**
- Strong: Physical (70), Knowledge (75), Dexterity (80)
- Average: Creativity (50), Reason (55)
- Weak: Focus (35), Stress (80)

**Expected Results:**
- ✅ Physical stat: 65-75%
- ✅ Intelligence stat: 55-65%
- ✅ Creativity stat: 45-55%
- ✅ Psyche stat: 40-55% (Focus drags it down)
- ✅ Spirit stat: 40-50% (Stress drags it down)
- ✅ No stat > 78 (inflation prevented)
- ✅ No stat < 20 (floor respected)
- ✅ Clear differentiation (not all equal)

**Verify:**
```
IF Physical > Intelligence > Spirit AND clear_ranking:
  PASS - Realistic differentiation
ELIF all_stats_equal:
  FAIL - No differentiation
ELIF any_stat_out_of_range:
  FAIL - Bounds violated
ELSE:
  PASS - Realistic mixing works
```

---

## Test 8: Persona 1 - Athletic Warrior (Physical 80, others 40)

**Inputs:**
- Physical Performance: All at 80%
- Fitts/Agility: 80%
- All others: 40% (below C-tier)

**Expected:**
- ✅ Physical stat: 78-82%
- ✅ Strength/Speed/Endurance all: 75-85%
- ✅ Other stats: 38-42%
- ✅ Clear role distinction (warrior, not scholar)

---

## Test 9: Persona 2 - Scholar Sage (Intelligence 80, others 40)

**Inputs:**
- Knowledge Test: 85%
- Reasoning Test: 80%
- MBTI: High logic score
- All physical/vitality: 40%

**Expected:**
- ✅ Intelligence stat: 78-82%
- ✅ Knowledge/Reason/Perception: 75-85%
- ✅ Physical stat: 38-42%
- ✅ Spirit stat: 38-42%
- ✅ Clear role distinction (scholar, not athlete)

---

## Test 10: Persona 3 - Creative Artist (Creativity 80, others 40)

**Inputs:**
- All 5 creativity prompts: 80%
- Imagination/Style/Expression: 80%
- All others: 40%

**Expected:**
- ✅ Creativity stat: 78-82%
- ✅ Expression/Imagination: 75-85%
- ✅ Physical stat: 38-42%
- ✅ Psyche stat: 38-42%
- ✅ Clear role distinction (artist, not warrior)

---

## Test 11: Persona 4 - Spiritual Seeker (Spirit 80, others 40)

**Inputs:**
- Religiosity: 80%
- Purpose: 80%
- Empathy: 80%
- Stress: 20 (Tranquility 80%)
- All physical/intelligence: 40%

**Expected:**
- ✅ Spirit stat: 78-82%
- ✅ Faith/Purpose/Empathy: 75-85%
- ✅ Physical stat: 38-42%
- ✅ Psyche stat: 38-42%
- ✅ Clear role distinction (mystic, not athlete)

---

## Test 12: Persona 5 - Balanced Generalist (all 55%)

**Inputs:**
- All tests: 55% (slightly above C-tier)

**Expected:**
- ✅ All stats: 52-58%
- ✅ All ranks: C+ or B-
- ✅ Clear baseline (no variation between categories)
- ✅ No specialization, but competent everywhere

**Verify:**
```
IF all_stats_within_52_58 AND all_ranks_equal:
  PASS - Generalist profile works
ELIF Physical > Spirit by 20+:
  FAIL - Differentiation too large
ELSE:
  PASS - Baseline variants working
```

---

## Test 8: Edge Case - No Creativity Responses

**Setup:** User skips or fails creativity protocol test

**Inputs:**
- Creative Protocol Test: Empty or null
- All other tests: Normal scores

**Expected Results:**
- ✅ Creativity substats: 50% (fallback)
- ✅ Creativity stat: 50% (fallback)
- ✅ Other stats: Normal calculations
- ✅ No errors or crashes
- ❌ Should NOT crash or skip stats

**Verify:**
```
IF Creativity == 50 AND no_exceptions:
  PASS - Fallback works
ELIF error_thrown:
  FAIL - Crash on missing data
ELIF Creativity < 10:
  FAIL - Improper fallback
ELSE:
  PASS - Graceful fallback
```

---

## Test 9: Edge Case - Min Sleep but Max Diet

**Setup:** User has terrible sleep but excellent diet

**Inputs:**
- Sleep Hours: 4
- Sleep Quality: 10/100
- Diet Consistency: 95

**Expected Results:**
- ✅ Regeneration: 20-30% (sleep terrible)
- ✅ Adherence: 95% (diet excellent)
- ✅ Vitality stat: ~50% (mixed factors)
- ✅ Regeneration ≠ Adherence (independent)

**Verify:**
```
IF Regeneration < 35 AND Adherence > 90:
  PASS - Independent calculations
ELIF Regeneration == Adherence:
  FAIL - Improper averaging
ELIF Vitality > 75:
  FAIL - Compensation math wrong
ELSE:
  PASS - Substat independence maintained
```

---

## Test 10: Double-Counting Check

**Setup:** Run full onboarding, check no double-weighting

**Verify:**
Check that each test is counted only as specified:
```
- Fitts Law: Dexterity (100%) + Focus (70%) + Perception (70%)
  NOT: Dexterity (100%) + all Physical (100%)
  
- Simon Says: Adaptability (100%) + Stamina (50%) + Balance (50%) + Perception (70%)
  NOT: Adaptability (100%) + Intelligence (100%)
  
- Stroop: Composure (100%) + Focus (80%) + Resilience (70%) + Willpower (70%)
  NOT: Stroop (100%) + all Psyche (100%)
```

**Verify:**
```
Calculate weight per test:
  IF any_test_weight > 150%:
    FAIL - Double-counting
  ELIF any_substat_sources > 4:
    FAIL - Too many sources
  ELSE:
    PASS - Proper weighting
```

---

## Automated Verification Script

```typescript
// Test: Verify substat calculation correctness
const testSubstatCalculation = (inputs: any) => {
  const substats = calculateSubstatsFromAllTests(inputs);
  
  // Check 1: All substats exist
  Object.values(SubStatName).forEach(ss => {
    if (!substats[ss]) throw new Error(`Missing: ${ss}`);
    if (substats[ss] < 1 || substats[ss] > 100) {
      throw new Error(`Out of range: ${ss} = ${substats[ss]}`);
    }
  });
  
  // Check 2: Main stats average correctly
  const spiritAvg = (
    substats[SubStatName.Faith] +
    substats[SubStatName.Purpose] +
    substats[SubStatName.Tranquility] +
    substats[SubStatName.Empathy] +
    substats[SubStatName.Conviction]
  ) / 5;
  
  if (Math.abs(spiritAvg - expectedSpirit) > 5) {
    throw new Error(`Spirit averaging incorrect: ${spiritAvg} vs ${expectedSpirit}`);
  }
  
  // Check 3: No inflation
  Object.entries(substats).forEach(([ss, value]) => {
    if (value > 95) {
      throw new Error(`Inflation detected: ${ss} = ${value}`);
    }
  });
  
  console.log("✅ All checks passed");
};
```

---

## Troubleshooting

### Issue: Some Substats Still 50
**Cause:** Test output not extracted properly  
**Fix:** Check inputs have correct key names (case-sensitive):
- `inputs['physical-performance']` (hyphenated, lowercase)
- `inputs['fitts-law-test']` (not `fitt`)
- `inputs['simon-says-test']` (not `simon`)

### Issue: Rank Inflation (All SS+)
**Cause:** Percentile not being capped at 95  
**Fix:** Verify `calculateSubstatsFromAllTests()` line with `Math.min(95, ...)`

### Issue: Missing Composure/Focus
**Cause:** Stroop test not mapped  
**Fix:** Check that `inputs['resilience-stroop']` exists and `stroopScore` is calculated

### Issue: Creativity Always 50
**Cause:** AI evaluation skipped or not integrated  
**Fix:** Check `creativitySubstats` is populated and applied to substats

---

## Key Testing Principles

### C-Tier Anchor (50%)
- Every substat baseline = 50% (true average)
- Tests should show clear deviation from baseline
- No stat should be exactly 50% unless all tests are C-tier

### Difficulty Distribution
- **Easy (Achievable B/A):** Adherence, Expression, Empathy
- **Moderate (Normal Curve):** Strength, Knowledge, Reason
- **Hard (Rare S/SS):** Willpower, Focus, Composure, Tranquility, Purpose
- **Variable (5-95%):** Faith, Charisma, Imagination, Vision

### Inflation Prevention
- Max cap: 95% (never 100%)
- Min floor: 10% (never 0% or negative)
- Easy substats can hit A (70-85%) without inflating full stat
- Hard substats should rarely hit S (85%+)

### Differentiation
- If user is Average Joe (50% all), all stats should be 48-52%
- If user excels in one category, only that category should be boosted
- No spillover inflation across categories
- Clear role distinction (athlete vs. scholar vs. artist, etc.)

---

**All Tests PASS = System Ready for Production ✅**

