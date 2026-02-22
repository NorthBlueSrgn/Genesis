# Proportional Stat Progression System

## Overview

Instead of a **linear "do task → get XP → rank up"** flow, the Genesis Protocol should track **real-world metrics** (bench press, squat, deadlift, run time, etc.) and convert improvements into **proportional stat gains**.

### Key Concept

**One improvement ≠ automatic rank-up.** For example:
- Improve bench press → +5 Strength
- But Strength needs to go from 400 → 500 to reach next tier
- So one lift improvement is ~5% of the way there
- Need 10 distinct improvements across multiple lifts to rank up

This creates **granular, realistic progression** where users must develop **multiple competencies** to advance ranks.

---

## Current Problem

The current system:
```
Task completion → Fixed XP gain → HATI increases → Rank up
```

**Issues**:
- Linear and predictable
- No differentiation between "one pushup" and "serious training"
- Stats don't reflect real-world capability variance
- No feedback loop for **specific metric improvements**

---

## Proposed System: Benchmark Tracking

### 1. **Define Key Benchmarks by Stat**

#### **Physical**
- **Strength** (Primary Lift):
  - Bench Press 1RM
  - Squat 1RM
  - Deadlift 1RM
  
- **Speed**:
  - 40-yard dash time
  - 400m sprint time
  
- **Endurance**:
  - 5K run time
  - 12-minute run distance
  - Max pull-ups (continuous)

- **Dexterity**:
  - Reaction time (games, tests)
  - Hand-eye coordination score
  
- **Agility**:
  - T-test time (lateral quickness)
  - 3-cone drill time

#### **Mental**
- **Reason**:
  - Logic puzzles solved/time
  - Math problem accuracy
  
- **Knowledge**:
  - Books read
  - Study hours
  - Test scores
  
- **Adaptability**:
  - Novel problem-solving attempts
  - Skill switches (learning new things)
  
- **Strategy**:
  - Chess rating/ELO
  - Strategy game wins
  
- **Perception**:
  - Pattern recognition tests
  - Detail observation accuracy

#### **Social**
- **Charisma**:
  - Conversations initiated/quality
  - Group facilitation events
  
- **Empathy**:
  - Mentoring hours
  - Helping others (documented)

#### **Spiritual/Psyche**
- **Willpower**:
  - Streak length (consecutive days without breach)
  - Cold shower days
  - Fasting duration
  
- **Resilience**:
  - Recovery time from failure
  - Comeback completions
  
- **Purpose**:
  - Goal clarity assessments
  - Aligned action completions

---

## Benchmark Improvement → Stat Boost Mapping

### Formula

```
StatBoost = (NewValue - OldValue) / (TargetValue - OldValue) × TargetBoost
```

**Example: Bench Press Improvement**

```
Current: 185 lbs
New: 195 lbs (+10 lbs)
Target (next tier): 225 lbs

Progress = (195 - 185) / (225 - 185) × 25 points
Progress = 10 / 40 × 25
Progress = 6.25 Strength points

Strength goes from 392 → 398.25 (not enough to rank up alone)
```

### Tier Thresholds by Fitness Level

Based on realistic strength standards:

#### **Bench Press Strength Tiers**

| Tier | Bodyweight | Beginner | Intermediate | Advanced | Elite |
|------|---|---|---|---|---|
| E (0%) | 160 lbs | 135 | 185 | 225 | 275 |
| D (20%) | 180 | 155 | 205 | 245 | 295 |
| C (40%) | 200 | 175 | 225 | 265 | 315 |
| B (60%) | 220 | 195 | 245 | 285 | 335 |
| A (75%) | 240 | 215 | 265 | 305 | 355 |
| S (90%) | 260 | 235 | 285 | 325 | 375 |
| SS (97%) | 280 | 255 | 305 | 345 | 395 |
| SS+ (99.9%) | 300+ | 275+ | 325+ | 365+ | 415+ |

**User selects their archetype** (Beginner/Intermediate/Advanced/Elite) on onboarding, and benchmarks are calibrated accordingly.

---

## Implementation Architecture

### 1. **Data Structure: Benchmark Tracking**

```typescript
interface BenchmarkMetric {
  id: string;
  name: string;
  stat: StatName;
  subStat: SubStatName;
  unit: string; // "lbs", "seconds", "reps", etc.
  currentValue: number;
  personalRecord: number;
  targetValue: number; // Next tier threshold
  lastMeasured: string; // ISO date
  history: Array<{ date: string; value: number }>;
}

interface StatProgression {
  metric: BenchmarkMetric;
  previousValue: number;
  newValue: number;
  improvement: number;
  statBoostAwarded: number;
  timestamp: string;
}
```

### 2. **Backend Endpoint: Record Benchmark**

New endpoint: `recordBenchmarkV2`

```typescript
type RecordBenchmarkRequest = {
  userName: string;
  metricId: string;
  newValue: number;
  notes?: string;
};

export const recordBenchmarkV2 = onRequest(
  { secrets: [geminiApiKey] },
  (req, res) => {
    // 1. Retrieve user's benchmark history
    // 2. Calculate improvement proportionally
    // 3. Award stat boost
    // 4. Check if substat changed ranks
    // 5. Return feedback with percentile
    // 6. Log to StatProgression history
  }
);
```

### 3. **Frontend: Benchmark Input UI**

New page: **"Calibration Lab"** or **"Metrics Dashboard"**

```tsx
<BenchmarkCard metric={benchmarkMetric}>
  <InputField 
    label="Bench Press 1RM"
    unit="lbs"
    value={benchmarkValue}
    onChange={(v) => recordBenchmark(v)}
  />
  <ProgressBar 
    current={195}
    target={225}
    label="Next Tier: 225 lbs"
  />
  <StatBoost 
    stat="Strength"
    amount={6.25}
    subtitle="Proportional increase"
  />
  <ComparisonChart 
    history={benchmarkHistory}
    percentile={calculatePercentile(195)}
  />
</BenchmarkCard>
```

### 4. **Stat Calculation Update**

Modify `calculateScores` in `scoringService.ts` to:
- Weight benchmark metrics heavily
- Give proportional credit for partial improvements
- Create a **velocity component** (rate of improvement)

```typescript
export const calculateBenchmarkScore = (benchmarks: BenchmarkMetric[]): number => {
  let totalScore = 0;
  
  benchmarks.forEach(b => {
    const percentToTarget = (b.currentValue - b.previousValue) / (b.targetValue - b.previousValue);
    const tier = getTierFromValue(b.currentValue, b.targetValue);
    
    totalScore += (tier * percentToTarget);
  });
  
  return Math.min(100, totalScore / benchmarks.length);
};
```

---

## Rank Progression Example: Physical → Strength

### **Scenario: User at B-Rank, trying to reach A-Rank**

**Current Strength Value**: 3850 (of 4000 to rank up)

**Starting Benchmarks**:
- Bench: 245 lbs (at B-tier)
- Squat: 315 lbs (at B-tier)
- Deadlift: 385 lbs (at B-tier)

**A-Rank Benchmarks** (targets):
- Bench: 265 lbs
- Squat: 335 lbs
- Deadlift: 405 lbs

**Week 1-2: User trains hard**

| Metric | Previous | New | Gain | Strength +? | Total Strength |
|--------|----------|-----|------|-------------|---|
| Bench | 245 | 250 | +5 | +6.25 | 3856.25 |
| Squat | 315 | 320 | +5 | +5 | 3861.25 |
| Deadlift | 385 | 390 | +5 | +5 | 3866.25 |

**Week 3-4: More progress**

| Metric | Previous | New | Gain | Strength +? | Total |
|--------|----------|-----|------|-------------|---|
| Bench | 250 | 258 | +8 | +10 | 3876.25 |
| Squat | 320 | 328 | +8 | +8 | 3884.25 |
| Deadlift | 390 | 400 | +10 | +10 | 3894.25 |

**Week 5-6: Push harder**

| Metric | Previous | New | Gain | Strength +? | Total |
|--------|----------|-----|------|-------------|---|
| Bench | 258 | 265 | +7 | +17.5 | 3911.75 |
| Squat | 328 | 335 | +7 | +17.5 | 3929.25 |
| Deadlift | 400 | 405 | +5 | +12.5 | **3941.75** ✅ |

**Result**: After **6 weeks of consistent, proportional improvement**, user reaches A-Rank.

---

## Integration with Directives

Promotion Exams can now be **benchmark-based**:

### **Example E→D Directive**

```json
{
  "title": "Initiation Assessment",
  "description": "Establish baseline fitness",
  "objectives": [
    "Record benchmark: Bench Press (any weight)",
    "Record benchmark: 5K Run Time",
    "Record benchmark: Read 1 Book",
    "Complete 10 daily tasks"
  ]
}
```

### **Example C→B Directive**

```json
{
  "title": "Elite Candidacy Trial",
  "description": "Demonstrate elite-tier performance",
  "objectives": [
    "Bench Press: 225 lbs (current: 215)",
    "Squat: 315 lbs (current: 295)",
    "5K Run: <24 min (current: 28 min)",
    "Chess Rating: 1600+ (current: 1500)",
    "Books Read: 12 (current: 8)"
  ]
}
```

Users can **track progress toward each benchmark** and see how close they are to rank-up.

---

## Benefits of This System

1. **Proportional Progression**: Small improvements count, but don't create instant rank-ups
2. **Real-World Metrics**: Benchmarks map to actual fitness/skill levels
3. **Multiple Pathways**: Can rank up via Physical, Mental, Social, or Spiritual—not just one
4. **Motivating Feedback**: See exact progress (225/245 lbs = 92% to next tier)
5. **Long-Term Commitment**: A-Rank now requires **weeks/months of consistent training**, not days
6. **Specialization**: User can focus on specific lifts, but must develop breadth for full rank-up
7. **Realistic Timelines**: ~5 years to A-Rank feels achievable with 1-2 hrs/day training

---

## Implementation Phases

### **Phase 1: Core Benchmark Tracking** (Immediate)
- [ ] Define benchmark metrics for each stat/substat
- [ ] Create `BenchmarkMetric` data type
- [ ] Implement `recordBenchmarkV2` backend endpoint
- [ ] Create basic "Log Benchmark" UI

### **Phase 2: Proportional Calculation** (Week 1-2)
- [ ] Implement stat boost calculation formula
- [ ] Update `calculateScores` to weight benchmarks
- [ ] Add StatProgression history tracking
- [ ] Create progress charts

### **Phase 3: Directives Integration** (Week 2-3)
- [ ] Update `generatePromotionExamV2` to create benchmark-based exams
- [ ] Add benchmark targets to exam objectives
- [ ] Create "Benchmark Progress" card on Missions page

### **Phase 4: UI Dashboard** (Week 3-4)
- [ ] Create "Metrics Dashboard" or "Calibration Lab" page
- [ ] Show all benchmarks with progress bars
- [ ] Display percentile rankings
- [ ] Add historical charts (improvement over time)

---

## Example: Bench Press Progression Curve

```
Week 1: 185 lbs  [====         ]  Current → Target (225)
Week 2: 190 lbs  [======       ]
Week 3: 195 lbs  [========     ]
Week 4: 200 lbs  [==========   ]
Week 5: 210 lbs  [==============]
Week 6: 218 lbs  [================]
Week 7: 225 lbs  [==================] ✅ Tier Up!
```

Each increment = +proportional Strength stat.
After 6-7 weeks, user has gained +40 Strength total.
With similar progress on Squat/Deadlift, hits rank-up threshold.

---

## References

This system is inspired by:
- **Solo Leveling**: Detailed stat progression tied to effort/achievement
- **RPG Character Progression**: Proportional XP gains, not linear thresholds
- **Real-World Fitness**: Actual strength standards (NSCA, Rippetoe)
- **Skill Learning Curves**: Logarithmic progress (fast early, slower later)

---

## Next Steps

1. **Define benchmark tiers** for all stats (archetype-specific)
2. **Implement `recordBenchmarkV2` endpoint** in Cloud Functions
3. **Create frontend UI** for logging benchmarks
4. **Update promotion exam logic** to use benchmarks
5. **Test with real progression curve** to verify 5-year timeline to A-Rank

This creates a **much richer, more rewarding system** that reflects real-world capability development!
