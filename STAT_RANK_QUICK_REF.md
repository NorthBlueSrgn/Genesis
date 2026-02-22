# Stat Rank System - Quick Reference

## Fixed Point Thresholds

### Main Stats (Physical, Vitality, Intelligence, Creativity, Spirit, Psyche)

| Rank | Points | Label |
|------|--------|-------|
| **E** | 0 - 1,399 | Echo (Dormant) |
| **D** | 1,400 - 5,599 | Delta (Learning) |
| **C** | 5,600 - 17,999 | Charlie (Standard) |
| **B** | 18,000 - 39,999 | Bravo (Elite) |
| **A** | 40,000 - 91,999 | Alpha (Command) |
| **S** | 92,000 - 133,999 | The Complete One |
| **SS** | 134,000 - 155,999 | Omega (Anomaly) |
| **SS+** | 156,000+ | Transcendent |

### Substats (All 30 substats)

| Rank | Points | Calculation |
|------|--------|------------|
| **E** | 0 - 279 | Main ÷ 5 |
| **D** | 280 - 1,119 | Main ÷ 5 |
| **C** | 1,120 - 3,599 | Main ÷ 5 |
| **B** | 3,600 - 7,999 | Main ÷ 5 |
| **A** | 8,000 - 18,399 | Main ÷ 5 |
| **S** | 18,400 - 26,799 | Main ÷ 5 |
| **SS** | 26,800 - 31,199 | Main ÷ 5 |
| **SS+** | 31,200+ | Main ÷ 5 |

### Apex Threat Index (Overall Rank)

| Rank | Percentile | Calculation |
|------|-----------|------------|
| **E** | 0% - 19% | Average of 6 main stat percentiles |
| **D** | 20% - 39% | " |
| **C** | 40% - 59% | " |
| **B** | 60% - 74% | " |
| **A** | 75% - 89% | " |
| **S** | 90% - 96% | " |
| **SS** | 97% - 99% | " |
| **SS+** | 99.9% - 100% | " |

---

## Abas Profile (Default/Skip Stats)

### Main Stats
- **All 6 stats:** 600 points → **E rank**

### Substats
- **All 30 substats:** 120 points → **E rank**

### Overall
- **Apex Threat Index:** ~10% → **E rank**

---

## Functions Reference

```typescript
// Point-based ranking (for stat values)
getRankForMainStatValue(value: number, statName: StatName): AttributeRankName
getRankForSubstatValue(value: number, subStatName: SubStatName): AttributeRankName

// Percentile-based ranking (for apex threat index)
mapScoreToRank(percentile: number): AttributeRankName
```

---

## Example Calculations

### Example 1: New User (Abas Profile)
- Physical: 600 → **E rank** ✓
- Strength substat: 120 → **E rank** ✓
- Apex Index: 10% → **E rank** ✓

### Example 2: Progressed User
- Physical: 20,000 → **B rank** ✓
- Strength substat: 4,000 → **B rank** ✓
- Apex Index: 65% → **B rank** ✓

### Example 3: Advanced User
- Physical: 95,000 → **S rank** ✓
- Strength substat: 19,000 → **S rank** ✓
- Apex Index: 92% → **S rank** ✓

---

## Key Points

✅ **Fixed thresholds** - No percentile-based ranking for stat values  
✅ **Consistent** - Same thresholds for all users  
✅ **Predictable** - Players know exact requirements for next rank  
✅ **Fair** - Not affected by other users' progress  
✅ **Transparent** - Clear progression path
