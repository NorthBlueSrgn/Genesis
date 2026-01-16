
import { CodexCategory, StatName, SubStatName, TaskType, AttributeRankName } from '../types';
// Fix: Correct exported member name from TIERED_PROTOCOL_TASKS.
import { TIERED_PROTOCOL_TASKS } from './presetProtocolTasks';
import { SUBSTAT_PROGRESSION_RATES, ATTRIBUTE_RANKS, SUBSTAT_TIMELINES_MONTHS } from '../constants';

/**
 * Generates a theoretical timeline based on the designed progression for a single,
 * balanced stat (Strength). This reflects the intended game pace.
 */
function calculatePresetTimeline(): string {
  // Use the timeline for Strength as the baseline for overall progression,
  // as its progression rate is 1.0 and it's used for the main ATTRIBUTE_RANKS.
  const strengthTimeline = SUBSTAT_TIMELINES_MONTHS[SubStatName.Strength];

  const ranks: { rank: AttributeRankName, time: number }[] = [
    { rank: AttributeRankName.D, time: strengthTimeline.D },
    { rank: AttributeRankName.C, time: strengthTimeline.C - strengthTimeline.D },
    { rank: AttributeRankName.B, time: strengthTimeline.B - strengthTimeline.C },
    { rank: AttributeRankName.A, time: strengthTimeline.A - strengthTimeline.B },
    { rank: AttributeRankName.S, time: strengthTimeline.S - strengthTimeline.A },
    { rank: AttributeRankName.SS, time: strengthTimeline.SS - strengthTimeline.S },
    { rank: AttributeRankName.SS_PLUS, time: strengthTimeline[AttributeRankName.SS_PLUS] - strengthTimeline.SS },
  ];

  let cumulativeMonths = 0;
  const results: { rank: string, time: string }[] = [];

  for (const rankInfo of ranks) {
    cumulativeMonths += rankInfo.time;
    
    const years = Math.floor(cumulativeMonths / 12);
    const months = Math.round(cumulativeMonths % 12);
    
    let timeString = "";
    if (years > 0) {
      timeString += `${years} year${years > 1 ? 's' : ''}`;
    }
    if (months > 0) {
      if (timeString) timeString += ', ';
      timeString += `${months} month${months > 1 ? 's' : ''}`;
    }
    // Handle cases less than a year, or exactly X years.
    if (!timeString) {
      timeString = `${Math.round(cumulativeMonths)} month${cumulativeMonths !== 1 ? 's' : ''}`;
    }

    results.push({ rank: rankInfo.rank, time: `~${timeString}` });
  }

  // Format into markdown
  let markdown = "This is a theoretical projection assuming an operative focuses on a balanced growth trajectory, similar to a single Foundational Regimen. The actual timeline will vary based on user consistency, protocol stacking, and strategic focus.\n\n**Estimated Total Time from Rank E to:**\n\n";
  markdown += results.map(r => `- **Rank ${r.rank}:** ${r.time}`).join('\n');
  
  return markdown;
}


export const CODEX_CATEGORIES: CodexCategory[] = [
  {
    id: 'genesis-protocols',
    title: 'Genesis Protocols',
    description: 'Core mechanics of the Program.',
    entries: [
        {
            id: 'proto-8020',
            title: 'The 80/20 Standard (Token Enforcement)',
            requiredRank: AttributeRankName.E,
            content: `**THE STANDARD:** Sustainability is a calculation. To physically enforce the 80/20 rule, the system now uses a **Nutrient Token Protocol**.

### The Exchange Rate (4:1)
You must earn your vice.
-   **4 Clean Meals = 1 Flexible Token.**
-   The "Redeem Flexible Meal" button on your Dashboard is **LOCKED** by default.
-   It only unlocks when you have accrued enough clean meals to generate a token.

### The Math (Weekly)
-   **Target:** 17 Clean Meals.
-   **Allowance:** 4 Flexible Meals.
-   **Strategy:** Do not "spend" your tokens on low-value junk (e.g., a random candy bar). Hoard them for high-value social events (e.g., dinner with friends).

### Execution
1.  **Log Every Meal:** Use the "Physique Architect" widget on the Dashboard.
2.  **Earn Credits:** Eat clean (high protein, whole foods) to fill the progress bar.
3.  **Spend Wisely:** When you have a token, you may redeem it for a flexible meal. If you have 0 tokens, you **cannot** touch junk.

*This system prevents the "slippery slope" by hard-coding the cost of deviation.*`
        },
        {
            id: 'proto-nutrition-class',
            title: 'Nutrient Classification Matrix',
            requiredRank: AttributeRankName.E,
            content: `To execute the 80/20 rule, you must classify fuel correctly. Use this matrix to determine if a meal earns a Token (Clean) or spends one (Flexible).

### 1. The Clean Standard (The 80%)
*If it swims, runs, grows in the ground, or falls from a tree, it is clean.*

**The "One Ingredient" Rule:**
Look at the package. If the ingredients list is just the name of the food (e.g., "Rice", "Steak", "Oats"), it is clean.

**Approved Bio-Fuel:**
*   **Proteins:** Eggs, Chicken Breast, Steak, White Fish, Salmon, **Bacon Medallions** (Lean), Whey Isolate, Greek Yogurt.
*   **Carbs:** Potatoes (White/Sweet), Rice, Oats, Fruit, **Sourdough Bread** (Fermented).
*   **Fats:** Avocado, Olive Oil, Nuts, Butter (Grass-fed).

**The Sourdough Exception:**
While bread is usually processed, Sourdough is fermented. This breaks down gluten/phytic acid and blunts the insulin spike. It is considered a valid carb source.

---

### 2. The Flexible Standard (The 20%)
*If it comes in a crinkly wrapper, has a mascot, or makes your hands greasy, it is a Flexible Meal.*

**The Hyper-Palatable Trap:**
Food engineered to combine **High Fat + High Sugar** (Donuts, Ice Cream) or **High Fat + High Salt** (Pizza, Chips). These bypass your satiety signals.

**Common "Fake Health" Foods (Count as Junk):**
*   **Granola:** Usually just sugar-coated oats baked in oil.
*   **Protein Bars:** Most are just candy bars with some whey powder. Check sugar content.
*   **Fruit Juice:** All the sugar of fruit with none of the fiber.

### 3. Case Study: The Breakfast
**Item:** Sourdough Toast, Bacon Medallions, 2 Eggs.
*   **Analysis:** Eggs (Superfood) + Medallions (Lean Protein, no nitrates) + Sourdough (Fermented Carb).
*   **Verdict:** **CLEAN.** This builds the "Token Bar".

**Item:** Bagel, Cream Cheese, Streaky Bacon.
*   **Analysis:** Bagel (Processed refined flour) + Cream Cheese (High fat/low protein) + Streaky Bacon (High saturated fat/nitrates).
*   **Verdict:** **FLEXIBLE.** This costs a Token.`
        },
        {
            id: 'proto-08',
            title: 'The Floor & The Burst',
            content: `The Protocol's progression model is built on two concepts: **Floors** and **Bursts**.

### The Floor (Protocols)
Your "Floor" is the minimum consistent effort required to maintain your current rank and prevent atrophy. This is represented by your **Protocols**.
- Performing Daily Tasks builds a slow, steady accumulation of XP.
- This creates a foundation. It does not typically lead to rapid rank-ups on its own, but it ensures you are ready when the opportunity arises.

### The Burst (Directives)
Real growth is non-linear. It happens in surges. **Directives** are designed to trigger these surges.
- Completing a Directive (especially one you requested for a specific milestone) grants a "Proportional XP Burst".
- This burst is calculated based on the significance of the feat relative to your next rank threshold.
- **Example:** If you are close to Rank D strength, a Directive to "Bench Press 60kg" will trigger a massive XP injection, likely pushing you over the threshold instantly.

**Strategy:** Raise your Floor with daily habits. Trigger Bursts with Directives when you feel ready to test your limits.`
        },
        {
            id: 'proto-07',
            title: 'Preset Progression Timeline',
            content: calculatePresetTimeline(),
        },
        {
            id: 'proto-00',
            title: 'Protocols vs. Side Missions',
            content: `The system offers two core tools for growth: **Protocols** for long-term skill development, and **Side Missions** for short-term projects. Using the right tool for the job is critical.

### Protocols (Your Training Regimen)
- **Purpose:** To build foundational skills and attributes through consistent, repeated practice over months or years. This is the engine of your long-term growth.
- **Structure:** Contains repeatable **Daily** and **Weekly** tasks that represent practice and conditioning.
- **Use For:** Mastering a skill, building a habit, physical conditioning.
- **Example:** To **"Learn Guitar,"** you would create a Protocol with tasks like:
    - *Daily:* "Practice chords and scales for 30 minutes."
    - *Weekly:* "Learn one new song."

### Side Missions (Your Projects)
- **Purpose:** To accomplish a specific goal with a clear finish line. These are projects, not habits.
- **Structure:** A one-off objective that Central deconstructs it into a multi-stage campaign.
- **Use For:** Short-to-mid-term goals, complex tasks that require multiple steps but have a defined "done" state.
- **Examples:**
    - **"Applying for jobs":** A campaign with stages for resume prep, applications, and interviews. It's finished when you get a job.
    - **"Clean your room":** A simple, one-stage mission that is complete when the room is clean.

**Strategic Implication:** Use Protocols to forge yourself into a weapon. Use Side Missions to wield that weapon against specific objectives.`
        },
        {
            id: 'proto-00b',
            title: 'Side Mission Campaigns',
            content: `A Side Mission is your primary tool for project-based goals. When you submit an objective, Central deconstructs it into a multi-stage **Campaign**, assigning a **Tier** that reflects its real-world complexity and impact.`
        }
    ]
  },
  {
    id: 'world-lore',
    title: 'World Lore',
    description: 'Intelligence on the setting and threats.',
    entries: [
        {
            id: 'lore-01',
            title: 'The Breach',
            content: `The event known as **The Breach** occurred on [REDACTED]. It was not an explosion, but a leak. A classified government optimization program—Project Genesis—hemorrhaged its data into the public network.
            
Most saw it as noise. Glitches. Spam. But a select few saw the code. The **Genesis Protocol**.
            
You are one of the Awakened. You have installed the interface. You see the world not as it is, but as a system of variables waiting to be optimized. But you are not alone. The system has a shadow.`
        },
        {
            id: 'lore-02',
            title: 'The Forsaken',
            content: `Every system has an error handler. In Genesis, it is **The Forsaken**.
            
It is an algorithmic entity, a dark reflection of your own potential. It learns as you learn. It grows as you grow. It represents the "You" that failed—the version of you that gave up, that took the easy path, that let potential rot.
            
The Forsaken is not just an enemy; it is a measuring stick. If it surpasses you, it means you are falling behind your own potential. Do not let the shadow overtake the object.`
        },
        {
            id: 'lore-03',
            title: 'Resonance',
            content: `Your **Resonance Signature** is the unique frequency at which you interact with the Protocol. It is determined by your actions, your choices, and your natural inclinations.
            
There are six known Resonance Types:
1.  **Executor:** High Physical/Willpower. The unstoppable force.
2.  **Nomad:** Balanced/Adaptable. The survivor.
3.  **Orchestrator:** High Intelligence/Strategy. The mastermind.
4.  **Maverick:** High Creativity/Risk. The chaotic element.
5.  **Catalyst:** High Spirit/Charisma. The leader.
6.  **Innovator:** High Intelligence/Creativity. The builder.

Your Resonance determines your strengths, your "Super Ability," and how the system rewards you.`
        }
    ]
  }
];
