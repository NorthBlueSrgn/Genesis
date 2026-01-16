# Strategy Test: FAQs & Examples

## Frequently Asked Questions

### General Questions

**Q: What is the Strategic Optimization Protocol?**
A: It's the final calibration test in Genesis Protocol's onboarding. Users navigate 6 realistic business scenarios and make strategic decisions. Each decision is evaluated on three dimensions: Efficiency (resource optimization), Foresight (long-term thinking), and Balance (holistic approach). The average score feeds directly into the player's Strategy substat.

**Q: Why is it the last test?**
A: Strategy is a synthesizing skill that builds on all other attributes (reasoning, perception, imagination, etc.). Testing it last allows it to reflect the player's integrated capabilities. It's also the "capstone" that determines how the player will approach the main game.

**Q: How long does the test take?**
A: Approximately 10-15 minutes. Each scenario takes ~1-2 minutes to read, decide, and review feedback.

**Q: Can players skip it?**
A: No. It's mandatory for onboarding completion. Players cannot proceed to the main game without completing all calibration tests.

---

### Scoring Questions

**Q: How is each scenario scored?**
A: Each choice has three metrics (Efficiency, Foresight, Balance), each rated 0-100. The scenario score is the average of these three: `(E + F + B) / 3`.

**Q: What does "Efficiency" mean?**
A: How well the choice optimizes resources and time. Does it get maximum output with minimum waste? High efficiency = pragmatic, action-oriented. Low efficiency = wasteful, inefficient.

**Example:**
- "Spend 60% on product, 0% on legal" = High efficiency (lean), Low foresight (risky), Low balance (lopsided)
- "Spend 40% on product, 10% on legal" = Good efficiency, High foresight, High balance

**Q: What does "Foresight" mean?**
A: How well the choice anticipates long-term consequences and second-order effects. Does it think beyond immediate impact? High foresight = strategic, future-aware. Low foresight = reactive, short-term focused.

**Example:**
- "Go all-in on pivot" = High efficiency, Moderate foresight (risky if wrong), Low balance (all-or-nothing)
- "Hedge: 40% to new market exploration" = Moderate efficiency, High foresight, High balance

**Q: What does "Balance" mean?**
A: How well the choice balances competing interests and maintains sustainability. Does it avoid extremes? High balance = sustainable, respectful of constraints. Low balance = fragile, creates blind spots.

**Example:**
- "Match competitor's salary" = Low balance (expensive precedent), Low foresight (doesn't address real motivation)
- "Offer equity + project leadership + sabbatical" = High balance (multiple incentives), High foresight (addresses growth needs)

**Q: Can a choice be high in one metric but low in another?**
A: Yes! That's the whole point. It teaches players that different approaches have different trade-offs.

- "Go all-in on market pivot" = High efficiency (clear focus), Medium foresight (growth potential), Low balance (all eggs in one basket)
- "Let best engineer leave, hire juniors" = Medium efficiency, Low foresight (lose knowledge), Medium balance (pragmatic cost-cutting)

**Q: What's a "perfect" score?**
A: There's no perfect 100 across all three, but the "best" choice is usually high in all three. For example, Scenario 2 (hybrid tech stack) has scores of 85-85-90 = 87/100. That's balanced excellence.

**Q: Can players score higher than the "intended" answer?**
A: No, the scenarios are designed so all 4 options have pre-set metrics. Players can't score higher than 100, and the "balanced" option is always highest.

**Q: What if a player gets all 6 scenarios "wrong"?**
A: They can still have a respectable score if they choose consistently, but they'll get lower-balanced options. Minimum scenario score is around 55-60 (if choosing very reactive options), maximum is ~87 (balanced options).

---

### Feedback Questions

**Q: Why does the test show feedback immediately?**
A: Unlike IQ and Knowledge tests (which hide feedback to prevent answer-shifting), strategy test benefits from transparency. Strategic thinking improves through feedback loops, and each scenario is independent—seeing Scenario 1's feedback doesn't help optimize Scenario 2.

**Q: Can players use feedback to "game" the system?**
A: No. Each scenario is presented fresh, and feedback is shown only after the choice is locked. Players can't revise their answer based on feedback.

**Q: What exactly is shown in the feedback?**
A: 
- Reasoning text (explanation of why the choice is strategic/problematic)
- All three metric values (Efficiency, Foresight, Balance)
- Final score for that scenario
- Progress indicator (e.g., "3/6")

**Q: Is the feedback detailed or generic?**
A: Detailed and scenario-specific. Each choice has unique reasoning explaining strategic merit or weakness.

---

### Integration Questions

**Q: How does the strategy test score flow into the dossier?**
A: 
1. Test calculates `strategyScore` (0-100)
2. Stored in `allInputs['high-stakes-war-room'].strategyScore`
3. During finalization, `calculateSubstatsFromAllTests()` retrieves it
4. Combines with reasoning score: `average([strategyScore, reasonScore * 0.7])`
5. Result capped at 95 percentile
6. Becomes the `Strategy` substat value
7. Displayed in dossier under Intelligence stat

**Q: What if a player scores 100 on the strategy test?**
A: The final Strategy substat can be at most 95 (to allow room for growth). So a 100 on strategy test + reasoning score would still be capped at 95 percentile.

**Q: Does the strategy score affect other stats?**
A: Indirectly. Strategy is one of five substats under Intelligence. A high Strategy score boosts the overall Intelligence stat, which influences:
- Overall TPI (Threat/Talent Index)
- Archetype determination (e.g., "Strategic Leader" vs. "Tactical Executor")
- Recommended game paths/missions
- Dossier strengths/weaknesses

**Q: What if a player has high Strategy but low Reasoning?**
A: The formula accounts for this: `average([strategyScore, reasonScore * 0.7])`. A high strategy score (85) + low reason score (30) = average of (85, 21) = 53. So they're seen as naturally strategic but perhaps not logically rigorous.

---

### Technical Questions

**Q: Where is the test component code?**
A: `/pages/OnboardingPage.tsx`, lines 910-1050. The component is `OptimizationStrategyTest`.

**Q: Where is the test data (scenarios)?**
A: Inside the `OptimizationStrategyTest` component, hardcoded as the `scenarios` array. Each scenario has: title, context, problem, choices (with efficiency/foresight/balance/reasoning).

**Q: Can scenarios be randomized?**
A: Currently no, all users see the same 6 scenarios in the same order. This is intentional for fairness and consistency. Randomization could be added as a future enhancement.

**Q: Can the test be taken again after onboarding?**
A: Currently no, tests are only during onboarding. Players can't re-calibrate. This is by design to maintain consistency of the initial dossier.

**Q: How is the test data validated?**
A: 
- All 6 scenarios must be answered
- Score must be 0-100
- historyarray must have exactly 6 entries
- If any data is null/undefined, fallback to 50

**Q: What happens if the test data is corrupted or lost?**
A: The finalization function uses a fallback: `const strategyScore = strategyWar.strategyScore || 50;`. If data is missing, Strategy substat defaults to 50 percentile.

---

### Player Experience Questions

**Q: What type of player scores highest?**
A: Players who think holistically and balance competing interests. They choose options like:
- Hybrid tech stack (not all-in on cutting-edge)
- Balanced allocation (not extremes)
- Data-driven triage (not reactive)
- Negotiated partnerships (not extreme takes)
- Growth-focused retention (not pure cost-cutting)

**Q: What type of player scores lowest?**
A: Players who think reactively or in extremes. They choose options like:
- All-in on one approach
- Reactive crisis responses
- Cost-cutting without strategy
- Ignoring long-term implications
- Overcommitting resources

**Q: Can a player intentionally sabotage their score?**
A: Yes, but it's not advantageous. The game doesn't punish low scores; it just gives them a lower Strategy substat. Low strategy players are positioned differently in the game narrative (as "Tactical Executors" rather than "Strategic Leaders"), but both paths are valid.

**Q: Does the strategy score affect difficulty?**
A: Indirectly. Strategy influences overall TPI, which may affect:
- Mission difficulty scaling
- NPC interactions
- Available paths/routes
- Resource management challenges

But there's no hard gate based on strategy score.

---

### Narrative & Lore Questions

**Q: Why is the test called "Strategic Optimization Protocol"?**
A: "Protocol" fits the cyberpunk/military aesthetic of the game. "Optimization" reflects that players are being optimized/calibrated. "Strategic" emphasizes decision-making over tactics.

**Q: Are the scenarios inspired by real situations?**
A: Yes. They're based on common challenges faced by founders, managers, and leaders:
- Resource allocation (startup lifecycle)
- Team conflict (tech stack decisions)
- Crisis management (competitive threats)
- Partnership negotiations (business development)
- Talent retention (scaling teams)
- Market pivots (strategic growth)

**Q: Do the scenarios have "correct" answers?**
A: Not in an absolute sense, but there are "more balanced" answers that score higher. This reflects the game's philosophy: there are trade-offs, and wisdom comes from balancing competing interests.

**Q: How do the scenarios reflect the game's world?**
A: The game positions players as emerging leaders or talents in a competitive world. The scenarios mirror that world—decision-making under constraint, competing priorities, long-term vs. short-term thinking. The dossier will interpret their strategy score as an aspect of their "talent DNA."

---

### Accessibility & Inclusion Questions

**Q: Is the test fair to non-business-minded players?**
A: The scenarios use business language (revenue share, allocation, etc.), but the underlying principles are universal: resource management, conflict resolution, risk assessment. A player without business background can still score well by thinking holistically.

**Q: Can a player be "too young" or "too old" for the strategic thinking tested?**
A: Strategy is independent of age. The game doesn't gate based on age demographics. A 16-year-old can score as high as a 50-year-old if they think holistically.

**Q: Is language a barrier?**
A: The scenario text is in English. Non-native speakers might find it challenging, but the core concepts (efficiency, foresight, balance) are intuitive. Consider adding language options as a future feature.

**Q: Are there scenarios that favor specific cultures or worldviews?**
A: The scenarios are intentionally culture-neutral, focusing on universal principles (resource allocation, risk, sustainability). They don't assume specific cultural values.

---

## Worked Examples

### Example 1: Balanced Player

**Player Profile:** Emma, 28, project manager, thinks strategically about team dynamics.

**Scenario 1: Resource Allocation**
- Chooses: "40% product, 30% team, 20% marketing, 10% legal"
- Reasoning: "We need a strong product and team foundation, with market visibility and legal buffer."
- Metrics: E:80, F:85, B:85 → Score: 83

**Scenario 2: Team Conflict**
- Chooses: "Hybrid tech stack"
- Reasoning: "This respects both engineers' perspectives and de-risks the core."
- Metrics: E:85, F:85, B:90 → Score: 87

**Scenario 3: Crisis Triage**
- Chooses: "Analyze why users left, address root causes"
- Reasoning: "Data-driven approach avoids guessing."
- Metrics: E:85, F:90, B:85 → Score: 87

**Scenario 4: Partnership**
- Chooses: "Negotiate better terms"
- Reasoning: "40/3yr is too constraining. Negotiate for flexibility."
- Metrics: E:85, F:85, B:88 → Score: 86

**Scenario 5: Talent Retention**
- Chooses: "Offer growth role, equity, sabbatical"
- Reasoning: "Values their growth, shows we understand their needs."
- Metrics: E:85, F:85, B:90 → Score: 87

**Scenario 6: Market Pivot**
- Chooses: "Hedge: 40% resources to exploration"
- Reasoning: "Balanced approach, preserves base, allows learning."
- Metrics: E:80, F:85, B:85 → Score: 83

**Final Score:** (83+87+87+86+87+83)/6 = **86**

**Dossier Impact:**
- Strategy Substat: ~85 percentile
- Archetype: "Strategic Leader / Wise Manager"
- Strengths: "Holistic thinking, stakeholder awareness, sustainable decisions"
- In-game Positioning: Emma is positioned as a player who makes long-term bets and considers multiple perspectives. Missions may emphasize stakeholder management, partnership negotiation, team dynamics.

---

### Example 2: Efficient Player

**Player Profile:** Marcus, 35, founder, wants to move fast and optimize.

**Scenario 1: Resource Allocation**
- Chooses: "60% product, 30% team, 10% marketing, 0% legal"
- Reasoning: "Product is everything. MVP first, worry about legal later."
- Metrics: E:85, F:70, B:60 → Score: 72

**Scenario 2: Team Conflict**
- Chooses: "Mandate cutting-edge tech"
- Reasoning: "Speed wins. Cut the debate, move forward."
- Metrics: E:75, F:40, B:50 → Score: 55

**Scenario 3: Crisis Triage**
- Chooses: "Immediately rebuild lost features"
- Reasoning: "Keep users by matching competitor. Act fast."
- Metrics: E:70, F:50, B:60 → Score: 60

**Scenario 4: Partnership**
- Chooses: "Accept the deal"
- Reasoning: "Distribution is scarce. Take it and scale fast."
- Metrics: E:70, F:50, B:55 → Score: 58

**Scenario 5: Talent Retention**
- Chooses: "Match their salary"
- Reasoning: "Keep them. Cost of losing them is higher."
- Metrics: E:50, F:60, B:55 → Score: 55

**Scenario 6: Market Pivot**
- Chooses: "Go all-in on the pivot"
- Reasoning: "5x market. Bet the company, move fast."
- Metrics: E:70, F:65, B:50 → Score: 62

**Final Score:** (72+55+60+58+55+62)/6 = **60**

**Dossier Impact:**
- Strategy Substat: ~55 percentile
- Archetype: "Tactical Executor / Speed-focused Founder"
- Strengths: "Fast decision-making, action bias, efficiency-focused"
- Weaknesses: "Limited long-term planning, stakeholder awareness, risk balance"
- In-game Positioning: Marcus is positioned as a player who moves fast and cuts corners. Missions may be time-pressure focused, with rewards for quick action but penalties for poor long-term consequences.

---

### Example 3: Conservative Player

**Player Profile:** Aisha, 42, risk-averse, prefers stability.

**Scenario 1: Resource Allocation**
- Chooses: "50% product, 40% team, 5% marketing, 5% legal"
- Reasoning: "Strong team is essential. Product and team are linked."
- Metrics: E:75, F:60, B:70 → Score: 68

**Scenario 2: Team Conflict**
- Chooses: "Go with proven tech"
- Reasoning: "Stability matters. We can innovate later when foundation is solid."
- Metrics: E:70, F:55, B:75 → Score: 67

**Scenario 3: Crisis Triage**
- Chooses: "Focus on retention of remaining users"
- Reasoning: "Build moat with loyal users, consolidate before growth."
- Metrics: E:75, F:70, B:80 → Score: 75

**Scenario 4: Partnership**
- Chooses: "Decline and bootstrap"
- Reasoning: "Independence is worth the slower growth. Avoids lock-in risk."
- Metrics: E:75, F:75, B:70 → Score: 73

**Scenario 5: Talent Retention**
- Chooses: "Offer lead role on moonshot project"
- Reasoning: "Respects their growth without overspending. Sustainable retention."
- Metrics: E:85, F:85, B:90 → Score: 87

**Scenario 6: Market Pivot**
- Chooses: "Stay focused on current market"
- Reasoning: "Profitable niche is valuable. Diversification is riskier."
- Metrics: E:75, F:50, B:70 → Score: 65

**Final Score:** (68+67+75+73+87+65)/6 = **72**

**Dossier Impact:**
- Strategy Substat: ~70 percentile
- Archetype: "Cautious Builder / Sustainable Leader"
- Strengths: "Risk awareness, stakeholder care, team stability"
- Weaknesses: "Slow to market, misses growth opportunities, conservative bias"
- In-game Positioning: Aisha is positioned as a player who builds slowly but sustainably. Missions reward long-term planning, loyalty systems, and conservative resource management. Growth might be slower but more stable.

---

## Key Takeaways

1. **No Single "Right" Answer:** The test reflects different strategic philosophies. Efficient players score differently than balanced players, and both are valid.

2. **Transparency Builds Trust:** Showing feedback immediately (unlike hidden IQ tests) demonstrates fairness and teaches strategic concepts.

3. **Integration is Seamless:** The strategy score flows directly into the dossier without interrupting the onboarding flow.

4. **Mobile-Friendly:** Despite the complex scenarios, the test works equally well on mobile (responsive text, readable buttons, clear progress).

5. **Last But Not Least:** As the final test, strategy encapsulates the player's integrated thinking before entering the main game.

6. **Replayability:** While the test is only during onboarding, a player's strategy score influences how the main game unfolds, creating emergent playstyles.

---

**Need more clarification? Check the other documentation:**
- `STRATEGY_TEST_COMPLETE_GUIDE.md` — Full technical specification
- `STRATEGY_TEST_VISUAL_FLOWS.md` — Flow diagrams and state machines
- Code: `pages/OnboardingPage.tsx` (line 910) and `services/scoringService.ts` (line 286)
