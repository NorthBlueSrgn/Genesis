# Genesis Protocol – Substat Testing & Calculation Mapping

## Overview
This document maps each onboarding test to the specific substats it measures, ensuring accurate and comprehensive stat initialization.

---

## Physical Stats (Strength, Speed, Endurance, Dexterity, Agility)

### Test: Physical Performance Metrics (Step 5)
- **Strength:** Bench Press, Squat, Deadlift
- **Speed:** Sprint 100m time
- **Endurance:** 5k Run time
- **Dexterity:** Typing Speed (fine motor control)
- **Agility:** Pro Agility Shuttle (5-10-5 test)

### Test: Fitts Law Test (Step 6 - Dexterity/CNS Twitch)
- **Dexterity:** Reaction time, target accuracy, movement precision
- **Focus:** Sustained attention on moving targets
- **Agility:** Quick directional changes

---

## Vitality Stats (Stamina, Regeneration, Adherence, Balance, Longevity)

### Test: Vitality Questionnaire (Step 9)
- **Regeneration:** Sleep hours, sleep quality
- **Adherence:** Diet consistency (how disciplined with nutrition)
- **Longevity:** Lifestyle habits (caffeine, alcohol, smoking)
- **Balance:** Stress levels (inverse = tranquility)

### Test: Breath Hold Test (Step 8 - CO2 Tolerance)
- **Stamina:** Time held (CO2 tolerance = respiratory capacity)
- **Longevity:** Oxygen efficiency (baseline health)

### Test: Simon Says (Step 7 - Cognitive Adaptability)
- **Balance:** Pattern recognition under pressure
- **Stamina:** Sustained mental effort across levels

---

## Intelligence Stats (Reason, Knowledge, Adaptability, Strategy, Perception)

### Test: MBTI Assessment (Step 3)
- **Reason:** Logic & thinking preference
- **Adaptability:** Openness to new experiences
- **Perception:** Sensing vs. Intuition (how they perceive info)

### Test: Hobby Selection (Step 4)
- **Knowledge:** Domain expertise areas
- **Perception:** Awareness of skill categories
- **Strategy:** Types of hobbies (strategic vs. physical vs. creative)

### Test: Adaptive Reasoning Gauntlet (Step 15 - AI-Powered)
- **Reason:** Logic puzzles, deduction
- **Knowledge:** General knowledge application
- **Strategy:** Multi-step problem solving
- **Perception:** Pattern recognition

### Test: Adaptive Knowledge Matrix (Step 16)
- **Knowledge:** Direct knowledge testing (domain-specific)
- **Adaptability:** Can learn and adjust to new material

### Test: Simon Says Test (Step 7)
- **Adaptability:** Adapt to pattern changes
- **Perception:** Visual pattern recognition

---

## Creativity Stats (Imagination, Innovation, Style, Expression, Vision)

### Test: Creative Protocol Test (Step 14 - 5 Prompts)
- **Imagination:** Imagination prompt (divergent thinking)
- **Innovation:** Innovation prompt (novel solutions)
- **Style:** Style prompt (aesthetic consistency)
- **Expression:** Expression prompt (communication clarity)
- **Vision:** Vision prompt (future perspective, big-picture thinking)

---

## Spirit Stats (Faith, Purpose, Tranquility, Empathy, Conviction)

### Test: Psycho-Social Questionnaire (Step 10)
- **Faith:** Religiosity slider (belief system strength)
- **Conviction:** Conflict resolution (standing ground under pressure)
- **Charisma:** Social confidence (indirectly affects empathy reading)

### Test: Vitality Questionnaire (Step 9)
- **Tranquility:** Stress levels (inverse: high stress = low tranquility)

### Test: Dilemma Screening (Step 13 - Moral Matrix)
- **Conviction:** Moral stance consistency (belief durability)
- **Purpose:** Action-ideal alignment (choosing based on values)
- **Faith:** Spiritual/existential philosophy choices
- **Empathy:** Choices showing empathy toward suffering

### Test: Narrative Projection (Step 1)
- **Purpose:** Clarity of goals and "why" behind ambitions
- **Vision:** Describing the future self shows forward-thinking

### Test: Labyrinth Assessment (Step 11 - Deep Psychometric)
- **Purpose:** Sense of direction/meaning (labyrinth navigation = life navigation)
- **Conviction:** Persistence through uncertainty
- **Empathy:** How they treat NPCs and allies

---

## Psyche Stats (Resilience, Charisma, Focus, Willpower, Composure)

### Test: Psycho-Social Questionnaire (Step 10)
- **Charisma:** Social confidence slider
- **Composure:** Conflict resolution slider

### Test: Resilience Stroop Test (Step 12 - Inhibitory Control)
- **Resilience:** Bounce-back from errors, recovery rate
- **Composure:** Tension control (managing frustration)
- **Focus:** Sustained attention despite distraction
- **Willpower:** Self-discipline to follow rules (Stroop inhibition)

### Test: High-Stakes War Room (Step 17 - Strategy Game)
- **Willpower:** Consistency of decision-making under pressure
- **Composure:** Maintaining logical output under stress
- **Resilience:** Recovery from tactical mistakes
- **Focus:** Attention to strategic details
- **Charisma:** Leadership projection in scenario decisions

### Test: Simon Says (Step 7)
- **Resilience:** Learning from pattern breaks
- **Focus:** Sustained attention on changing patterns
- **Composure:** Managing frustration as levels increase

### Test: Fitts Law (Step 6)
- **Focus:** Concentrated attention on targets
- **Composure:** Accuracy under time pressure

### Test: Equilibrium Reasoning (AI-Adaptive - Step 15)
- **Resilience:** Bouncing back from incorrect answers
- **Composure:** Time pressure management (timer running down)
- **Focus:** Concentration on complex logic problems

---

## Summary by Test

| Step | Test Name | Primary Substats | Secondary Substats |
|------|-----------|-----------------|-------------------|
| 1 | Narrative Projection | Purpose, Vision | Conviction, Empathy |
| 2 | Biometric Input | (All physical baseline) | Longevity |
| 3 | MBTI Assessment | Reason, Adaptability, Perception | Knowledge |
| 4 | Hobby Selection | Knowledge, Perception, Strategy | Reason, Adaptability |
| 5 | Physical Performance | Strength, Speed, Endurance, Dexterity, Agility | Stamina, Focus |
| 6 | Fitts Law Test | Dexterity, Focus, Agility | Composure, Perception |
| 7 | Simon Says | Adaptability, Balance, Resilience | Focus, Perception |
| 8 | Breath Hold | Stamina, Longevity | Composure |
| 9 | Vitality Questionnaire | Regeneration, Adherence, Longevity, Tranquility | Balance |
| 10 | Psycho-Social | Charisma, Composure, Faith, Conviction | Empathy |
| 11 | Labyrinth Assessment | Purpose, Conviction, Empathy | Resilience, Vision |
| 12 | Resilience Stroop | Resilience, Composure, Focus, Willpower | Charisma |
| 13 | Dilemma Screening | Conviction, Purpose, Faith, Empathy | (Spirit calibration) |
| 14 | Creative Protocol | Imagination, Innovation, Style, Expression, Vision | Reason |
| 15 | Adaptive Reasoning | Reason, Knowledge, Strategy, Perception | Adaptability, Resilience |
| 16 | Adaptive Knowledge | Knowledge, Adaptability | Perception, Reason |
| 17 | War Room Strategy | Willpower, Composure, Resilience, Focus, Charisma | Strategy |

---

## Calculation Rules

### 1. **Stat-Level Calculation** (For main 6 stats)
- Each stat = average of its 5 substats
- Each substat is tested by 1-3 tests
- Substat percentile = average of all tests measuring it
- Avoid double-counting when a test hits multiple substats

### 2. **Substat-Level Calculation** (For 31 substats)
- Extract raw percentile from each applicable test
- Average percentiles from multiple tests for same substat
- Apply percentile-to-value conversion: `convertPercentileToSubstatValue(percentile)`
- Assign rank based on final value using `mapScoreToRank(percentile)`

### 3. **Priority Rules**
- **Direct tests** (specific slider/game) have higher weight (100% credit)
- **Derived tests** (multi-skill tests) have lower weight (50-70% credit) to avoid inflation
- **Questionnaire responses** should be direct 1-100 values, not normalized
- **Mini-games** output should be converted to 0-100 percentile scale

### 4. **Inflation Prevention**
- Cap substat percentiles at 95 max (leave room for growth)
- Don't allow compound bonus (avoid double-counting)
- Use averaging when multiple tests hit same substat

---

## Current Issues & Fixes

### Issue 1: Inflated Ranks (S, SS from start)
**Cause:** Dividing by 5 in non-proportional way  
**Fix:** Use proper averaging for substat percentiles before converting to values

### Issue 2: Missing Substats (Composure, Focus)
**Cause:** Not extracting data from Stroop Test and Fitts Law Test  
**Fix:** Add mappings for all mini-game outputs to their tested substats

### Issue 3: Inconsistent Calculations
**Cause:** Some tests converted to percentile, others used raw  
**Fix:** Standardize all inputs to 0-100 percentile, then convert via `convertPercentileToSubstatValue()`

---

## Implementation Checklist

- [ ] Extract all mini-game scores (Fitts, Simon, Stroop, War Room, Equilibrium, etc.)
- [ ] Convert mini-game scores to percentiles (0-100)
- [ ] Map each percentile to corresponding substat(s)
- [ ] Average percentiles for substats hit by multiple tests
- [ ] Cap percentiles at 95 to prevent inflation
- [ ] Convert percentile → substat value for all 31 substats
- [ ] Calculate main stat value = average of 5 substat values
- [ ] Assign ranks based on final values
- [ ] Verify no double-counting across tests
- [ ] Test with edge cases (all perfect, all failing, mixed)

