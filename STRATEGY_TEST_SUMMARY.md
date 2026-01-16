# Strategy Test: At-a-Glance Summary

## What is it?

The **Strategic Optimization Protocol** is the final (16th) test in Genesis Protocol's onboarding calibration. It evaluates how players think strategically by presenting 6 realistic business scenarios with 4 options each.

---

## How It Works

### The Test
```
User navigates 6 business scenarios
↓
For each scenario, selects one of 4 options
↓
Immediately sees transparent feedback (Efficiency, Foresight, Balance metrics + reasoning)
↓
Moves to next scenario
↓
After scenario 6, test completes with final score
```

### The Scoring
```
Each choice scored on 3 dimensions (0-100):
1. Efficiency (resource optimization)
2. Foresight (long-term thinking)  
3. Balance (holistic approach)

Per-scenario score = (E + F + B) / 3

Final test score = Average of 6 scenario scores
Range: 33-100 (higher is better)
```

### What Happens Next
```
Test score → Strategy substat percentile
↓
Combined with reasoning score (70% weight)
↓
Capped at 95 percentile (allow growth)
↓
Appears in player's final Dossier
↓
Influences game progression, NPC interactions, difficulty
```

---

## The 6 Scenarios

| # | Scenario | Best Choice | Reason |
|---|----------|-----------|--------|
| 1 | Resource Allocation | 40% product, 30% team, 20% mkt, 10% legal | Balanced across all needs |
| 2 | Team Conflict (tech stack) | Hybrid approach (proven core + new features) | De-risks + innovates |
| 3 | Crisis Triage | Data-driven root cause analysis | Targets real problems |
| 4 | Partnership Terms | Negotiate better deal (1yr, 25%, non-exclusive) | Keeps optionality |
| 5 | Talent Retention | Growth role + equity + sabbatical | Values growth & life balance |
| 6 | Market Pivot | Hedge: 40% exploration + 60% core business | Balances risk & growth |

**"Best" = Highest average of Efficiency, Foresight, Balance** (usually 85-90 combined)

---

## Score Ranges & Archetypes

| Score | Archetype | Play Style | Example |
|-------|-----------|-----------|---------|
| 85-100 | Strategic Leader | Long-term, balanced | Emma (guide: holistic, stakeholder-aware) |
| 70-84 | Wise Manager | Competent, mixed | Aisha (guide: stable, sustainable) |
| 55-69 | Pragmatic Executor | Efficiency-focused, reactive | Marcus (guide: fast, cuts corners) |
| 40-54 | Tactical Doer | Short-term, action-bias | |
| <40 | Impulsive Actor | Erratic, extreme | |

---

## Why Show Feedback? (Unlike IQ/Knowledge Tests)

| Test Type | Feedback | Why |
|-----------|----------|-----|
| **Strategy** | ✅ Yes | Not knowledge-based; each scenario independent; teaches strategy; no answer-shifting |
| **IQ/Reasoning** | ❌ No | Knowledge-based; feedback would contaminate results |
| **Knowledge** | ❌ No | Factual; feedback would let players learn and adjust |

---

## The Three Metrics

### 🎯 Efficiency (Pragmatism)
- How well optimizes resources/time
- High: Lean, minimal waste
- Low: Wasteful, inefficient
- Example: Hybrid tech (efficient) vs. all-in cutting-edge (wasteful)

### 🔮 Foresight (Vision)
- How well anticipates long-term consequences
- High: Strategic, thinks 5+ steps ahead
- Low: Reactive, ignores downstream effects
- Example: Data-driven triage (foresightful) vs. immediate feature rebuild (reactive)

### ⚖️ Balance (Holistic)
- How well balances competing interests
- High: Sustainable, maintains optionality
- Low: Extreme, creates fragility
- Example: Hedged pivot (balanced) vs. all-in bet (extreme)

**Sweet Spot:** High in all three = Best strategic thinking

---

## Data Flow (One Diagram)

```
OptimizationStrategyTest Component
    ↓ (user completes test)
    → strategyScore = 86 (final avg)
    ↓ (stored in allInputs['high-stakes-war-room'])
finalizeOnboarding()
    ↓ (processes all 16 test results)
calculateSubstatsFromAllTests(inputs)
    ↓ (extracts strategy + reasoning scores)
    → Strategy Substat = average([86, reasonScore × 0.7])
    ↓ (capped at 95 percentile)
generateFullCalibrationReport()
    ↓
ClassifiedDossier (player sees complete profile)
    ↓ (clicks PROCEED)
Game Starts (strategy data accessible in gameplay)
```

---

## Code Locations (Quick Reference)

| Component | File | Lines |
|-----------|------|-------|
| **Test Component** | `pages/OnboardingPage.tsx` | 910-1050 |
| **Test Definition** | `data/calibrationData.ts` | `id: 'high-stakes-war-room'` |
| **Score Integration** | `services/scoringService.ts` | 286-400 |
| **Test Rendering** | `pages/OnboardingPage.tsx` | 1437 |
| **Finalization** | `pages/OnboardingPage.tsx` | 1278-1340 |

---

## Mobile Responsiveness

✅ **Fully responsive** across all devices
- Text scales appropriately
- Buttons remain touchable (44px+ minimum)
- Progress bar visible
- Feedback readable on small screens
- No horizontal scrolling required

---

## Player Experience Examples

### Emma (Score: 86) - Strategic Thinker
- Chooses balanced options across all scenarios
- Dossier: "Strategic Leader, Wise Decision-Maker"
- Game Impact: Missions emphasize stakeholder management, negotiation, partnerships
- Strength: Holistic thinking, foresight, sustainability

### Marcus (Score: 60) - Efficient Executor
- Chooses fast, efficiency-focused options
- Dossier: "Tactical Executor, Speed-Focused Founder"
- Game Impact: Time-pressure missions, quick decisions, resource constraints
- Strength: Fast action, efficiency; Weakness: Limited long-term planning

### Aisha (Score: 72) - Cautious Builder
- Chooses stable, risk-aware options
- Dossier: "Cautious Builder, Sustainable Leader"
- Game Impact: Stability/loyalty systems, conservative resource management
- Strength: Team stability, risk awareness; Weakness: Slow growth, misses opportunities

---

## Validation Checklist

✅ Test is mandatory (cannot skip)  
✅ All 6 scenarios must be answered  
✅ Score automatically calculated and capped at 95  
✅ Data automatically integrated into dossier  
✅ Transparent feedback builds trust  
✅ Mobile-responsive design  
✅ Error handling for missing/corrupt data  
✅ No real-time feedback contamination (each scenario independent)  

---

## Key Insights

1. **No Single "Right" Answer**
   - Different strategies (balanced, efficient, conservative) all valid
   - Different archetypes lead to different game experiences

2. **Transparency Builds Trust**
   - Showing metrics immediately (Efficiency, Foresight, Balance)
   - Players understand why they scored as they did
   - Different from hidden IQ/knowledge tests

3. **Strategic Thinking is Teachable**
   - Feedback shows why balanced options outperform extremes
   - Players learn the value of considering second-order effects
   - Creates emergent understanding of strategy

4. **Scores Influence Gameplay**
   - High strategy → Strategic roles, negotiation-heavy missions
   - Medium strategy → Balanced challenges, mixed mission types
   - Low strategy → Action-heavy, short-term missions

5. **Integration is Seamless**
   - Test completes → Dossier auto-generates → Game starts
   - No friction, no manual steps
   - Strategy data accessible throughout game progression

---

## What Makes This Test Special

| Aspect | Advantage |
|--------|-----------|
| **Position** | Last test = integrates all prior attributes |
| **Feedback** | Transparent = trustworthy + educational |
| **Realism** | Business scenarios = relatable + applicable |
| **Balance** | Three metrics = captures strategic complexity |
| **Integration** | Auto-flows into dossier = seamless UX |
| **Adaptability** | Score-based archetypes = personalized gameplay |

---

## FAQ (Quick Answers)

**Q: Can players skip it?**  
A: No, mandatory for onboarding completion.

**Q: Can they retake it?**  
A: No, only during onboarding.

**Q: Are scenarios randomized?**  
A: No, all players see same 6 in same order (fairness).

**Q: Can they see feedback before choosing?**  
A: No, feedback appears only after choice is locked.

**Q: What if they score poorly?**  
A: Game doesn't punish low scores; just positions them as different archetype (e.g., "Tactical Executor" instead of "Strategic Leader").

**Q: Do scores affect difficulty?**  
A: Indirectly—strategy influences overall capability score, which may affect mission scaling.

**Q: How is it different from the Reasoning test?**  
A: Reasoning tests logical problem-solving (hidden feedback); Strategy tests decision-making under constraint with competing interests (transparent feedback).

---

## One-Sentence Summary

**The Strategic Optimization Protocol evaluates how players balance efficiency, foresight, and stakeholder concerns across 6 realistic business scenarios, feeding their strategic thinking into their archetype and gameplay experience.**

---

## Next Steps

- **To understand scenarios:** See STRATEGY_TEST_COMPLETE_GUIDE.md, Part 1
- **To understand grading:** See STRATEGY_TEST_COMPLETE_GUIDE.md, Part 2
- **To understand data flow:** See STRATEGY_TEST_VISUAL_FLOWS.md
- **To see examples:** See STRATEGY_TEST_FAQS_EXAMPLES.md
- **To dive into code:** See /pages/OnboardingPage.tsx, line 910

---

**Documentation Version:** 1.0  
**Status:** Complete & Production-Ready  
**Last Updated:** 2024
