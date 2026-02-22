# Stat Rank Thresholds - Fixed Point System

## Overview

The Genesis Protocol uses **fixed point thresholds** for all stat ranks, not percentiles. This ensures consistent, predictable progression and rank assignments.

---

## Main Stat Ranks (Physical, Vitality, Intelligence, Creativity, Spirit, Psyche)

| Rank | Grade | Point Threshold | Time Estimate | Description |
|------|-------|----------------|---------------|-------------|
| **E** | Echo (Dormant) | **0** | Initial Phase | Baseline activation confirmed. Dormant potential. |
| **D** | Delta (Learning) | **1,400** | ~3-6 Months | Learning, trainable; basic competence achieved. |
| **C** | Charlie (Standard) | **5,600** | ~6-12 Months | Average human ability; handles structured tasks reliably. |
| **B** | Bravo (Elite) | **18,000** | ~1-2 Years | Above-average; independent problem-solving, rapid growth. |
| **A** | Alpha (Command) | **40,000** | ~2-4 Years | Exceptional skill; orchestrates complex tasks; leads teams. |
| **S** | The Complete One | **92,000** | ~4-7 Years | Peak human integration across all attributes; rare and aspirational. |
| **SS** | Omega (Anomaly) | **134,000** | ~7-10 Years | Near-singular anomaly; global-level mastery; extremely rare. |
| **SS+** | Transcendent | **156,000** | 10+ Years | Ultimate human potential; flawless integration; unmatched. |

---

## Substat Ranks (All 30 substats)

Substats use **1/5 of the main stat thresholds**:

| Rank | Substat Threshold | Main Stat Equivalent |
|------|------------------|---------------------|
| **E** | **0** | 0 |
| **D** | **280** | 1,400 |
| **C** | **1,120** | 5,600 |
| **B** | **3,600** | 18,000 |
| **A** | **8,000** | 40,000 |
| **S** | **18,400** | 92,000 |
| **SS** | **26,800** | 134,000 |
| **SS+** | **31,200** | 156,000 |

### Examples
- If a substat has **value = 1,500**, its rank is **C** (≥1,120, <3,600)
- If a substat has **value = 20,000**, its rank is **S** (≥18,400, <26,800)

---

## Apex Threat Index (Overall Rank)

The Apex Threat Index is a **percentile score** (0-100%) calculated from the average of all six main stat percentiles. It uses **fixed percentile thresholds**:

| Rank | Percentile Threshold | Description |
|------|---------------------|-------------|
| **E** | **0-19%** | Dormant potential |
| **D** | **20-39%** | Learning phase |
| **C** | **40-59%** | Average ability |
| **B** | **60-74%** | Elite performance |
| **A** | **75-89%** | Command level |
| **S** | **90-96%** | Peak human |
| **SS** | **97-99%** | Anomaly |
| **SS+** | **≥99.9%** | Transcendent |

### How It Works
1. Each main stat value is converted to a percentile based on its threshold position
2. The six percentiles are averaged to get the Apex Threat Index
3. The index is mapped to a rank using the fixed percentile thresholds above

---

## Implementation Details

### Functions

1. **`getRankForMainStatValue(value, statName)`** - Returns rank for main stat based on point value
2. **`getRankForSubstatValue(value, subStatName)`** - Returns rank for substat based on point value  
3. **`mapScoreToRank(percentile)`** - Returns rank for Apex Threat Index based on percentile

### Code Location

- **Point thresholds defined in:** `/constants.ts`
  - `ATTRIBUTE_RANKS` - Main stat thresholds
  - `SUBSTAT_RANK_THRESHOLDS` - Substat thresholds (auto-calculated as 1/5 of main)
  
- **Ranking functions defined in:**
  - `/constants.ts` - `getRankForMainStatValue`, `getRankForSubstatValue`
  - `/services/scoringService.ts` - `mapScoreToRank`, `calculateScores`

---

## Abas Profile Stats (Default/Skip Profile)

When a user skips onboarding, they receive the predetermined "Abas" profile with these stat values:

### Main Stats
- **Physical**: 600 (E rank)
- **Vitality**: 600 (E rank)
- **Intelligence**: 600 (E rank)
- **Creativity**: 600 (E rank)
- **Spirit**: 600 (E rank)
- **Psyche**: 600 (E rank)

### Substats (120 each = E rank)
All 30 substats start at **120 points**, which equals **E rank** (0 ≤ 120 < 280).

---

## Testing & Verification

To verify rank assignment is working correctly:

1. Check a user's stat values in Firestore
2. Compare against the thresholds above
3. Verify the rank displayed matches the expected threshold range

### Example Test Cases

| Stat Value | Expected Rank | Reason |
|-----------|---------------|--------|
| 500 | E | 0 ≤ 500 < 1,400 |
| 1,500 | D | 1,400 ≤ 1,500 < 5,600 |
| 6,000 | C | 5,600 ≤ 6,000 < 18,000 |
| 20,000 | B | 18,000 ≤ 20,000 < 40,000 |
| 50,000 | A | 40,000 ≤ 50,000 < 92,000 |
| 100,000 | S | 92,000 ≤ 100,000 < 134,000 |
| 140,000 | SS | 134,000 ≤ 140,000 < 156,000 |
| 200,000 | SS+ | 156,000 ≤ 200,000 |

---

## Summary

✅ **All ranks use fixed thresholds**, not percentiles  
✅ **Main stats** use the 8-tier point threshold system  
✅ **Substats** use 1/5 of main stat thresholds  
✅ **Apex Threat Index** uses fixed percentile thresholds (0-100%)  
✅ **Consistent and predictable** progression for all users  
✅ **No dynamic adjustments** based on population statistics
