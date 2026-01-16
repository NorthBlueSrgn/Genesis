// data/creativityAssessmentFinal.ts
// GENESIS PROTOCOL – Creativity Assessment (Final Version)
// 5-prompt system to evaluate Imagination, Innovation, Style, Vision, Expression
// Works universally across all creative domains and skill levels

// ============================================================
// FINAL ASSESSMENT INTERFACE
// ============================================================

export interface CreativityAssessmentPrompt {
    id: 'imagination' | 'innovation' | 'style' | 'vision' | 'expression';
    substat: 'Imagination' | 'Innovation' | 'Style' | 'Vision' | 'Expression';
    prompt: string;
    definition: string;
    scoringGuidance: string[];
}

export interface CreativityAssessmentResponse {
    promptId: 'imagination' | 'innovation' | 'style' | 'vision' | 'expression';
    userResponse: string;
    timestamp?: number;
}

export interface CreativityAssessmentResult {
    Imagination: { score: number; percentile: string; signals: string };
    Innovation: { score: number; percentile: string; signals: string };
    Style: { score: number; percentile: string; signals: string };
    Vision: { score: number; percentile: string; signals: string };
    Expression: { score: number; percentile: string; signals: string };
    overallScore: number;
    overallPercentile: string;
    hatiScore: number;
}

// ============================================================
// THE 5 PROMPTS
// ============================================================

export const CREATIVITY_ASSESSMENT_PROMPTS: CreativityAssessmentPrompt[] = [
    {
        id: 'imagination',
        substat: 'Imagination',
        prompt: 'Tell me a new way you could use a common object, tool, or skill in your daily life.',
        definition: 'Idea generation potential. The internal engine of possibility.',
        scoringGuidance: [
            'Originality of idea (rare vs. common)',
            'Feasibility + creativity balance',
            'Depth of thought (how detailed / considered the idea is)'
        ]
    },
    {
        id: 'innovation',
        substat: 'Innovation',
        prompt: 'Describe a time when you took an existing idea, tool, or concept and made it your own. What did you change or improve?',
        definition: 'Ability to combine ideas into novelty. The science of synthesis.',
        scoringGuidance: [
            'Degree of transformation or improvement',
            'Problem-solving or functional impact',
            'Creativity in approach and adaptation'
        ]
    },
    {
        id: 'style',
        substat: 'Style',
        prompt: 'Describe one thing you always do in your work or life that makes it distinctively yours, or that people would say has your fingerprints all over it.',
        definition: 'Aesthetic identity. The unique structural signature of your output.',
        scoringGuidance: [
            'Consistency and personal signature',
            'Distinctive execution or approach',
            'Depth and clarity in explanation of personal touch'
        ]
    },
    {
        id: 'vision',
        substat: 'Vision',
        prompt: 'What dreams or aspirations do you have for yourself, and/or for a project you\'re working on?',
        definition: 'Conceptual foresight. The ability to see not just what is, but what could be.',
        scoringGuidance: [
            'Ambition and scale of conceptual foresight',
            'Originality / uniqueness of envisioned future',
            'Layering: short-term, medium-term, long-term vision',
            'Infer foresight even if concrete steps aren\'t defined'
        ]
    },
    {
        id: 'expression',
        substat: 'Expression',
        prompt: 'Showcase something you\'ve created recently. Describe it and the meaning or story behind it—what were you trying to communicate?',
        definition: 'Articulative output. The ability to translate internal cognitive states into high-impact external reality.',
        scoringGuidance: [
            'Coherence and clarity of explanation',
            'Alignment between work and intended message',
            'Originality, impact, and interpretive depth',
            'Artistic or technical sophistication (optional)'
        ]
    }
];

// ============================================================
// UNIVERSAL SCORING FRAMEWORK (E to SS+)
// ============================================================

export const CREATIVITY_PERCENTILE_THRESHOLDS = {
    E: { min: 0, max: 19, label: 'E', threatLevel: 'Minimal' },
    D: { min: 20, max: 39, label: 'D', threatLevel: 'Low' },
    C: { min: 40, max: 59, label: 'C', threatLevel: 'Moderate' },
    B: { min: 60, max: 74, label: 'B', threatLevel: 'High' },
    A: { min: 75, max: 89, label: 'A', threatLevel: 'Critical' },
    S: { min: 90, max: 96, label: 'S', threatLevel: 'Extreme' },
    SS: { min: 97, max: 99, label: 'SS', threatLevel: 'Omega' },
    SS_PLUS: { min: 99.9, max: 100, label: 'SS+', threatLevel: 'Transcendent' }
};

// ============================================================
// SYSTEM PROMPT FOR GEMINI/LLM SCORING
// ============================================================

export const CREATIVITY_ASSESSMENT_SYSTEM_PROMPT = `You are Central, an advanced AI evaluating human creativity across 5 substats. Your job is to fairly and accurately score responses on a 0-100 percentile scale, then map to letter grades (E → SS+).

IMPORTANT: These are real people sharing real creative work and genuine aspirations. Be encouraging but honest. Look for authentic effort and originality, not perfection.

---

## SCORING FRAMEWORK (0-100 Percentile)

### IMAGINATION (0-100): Idea generation potential. The internal engine of possibility.

Scoring Guidance:
- Originality of idea (rare vs. common)
- Feasibility + creativity balance
- Depth of thought (how detailed / considered the idea is)

Examples by Percentile:
- 1-19 (E): "Use a pen to write" or generic, obvious uses
- 20-39 (D): Simple repurposing with minor creativity (use a shoe as a hammer)
- 40-59 (C): Thoughtful idea with some originality; shows consideration
- 60-74 (B): Creative, unexpected use that still makes sense; feasible and clever
- 75-89 (A): Sophisticated idea balancing novelty and practicality
- 90-96 (S): Surprising, elegant idea that opens new possibilities
- 97-100 (SS+): Paradigm-shifting idea; changes how we think about the object

---

### INNOVATION (0-100): Ability to combine ideas into novelty. The science of synthesis.

Scoring Guidance:
- Degree of transformation or improvement
- Problem-solving or functional impact
- Creativity in approach and adaptation

Examples by Percentile:
- 1-19 (E): Minor variation; no real transformation
- 20-39 (D): Slight twist on existing approach; predictable improvement
- 40-59 (C): Genuine adaptation; shows problem-solving; one meaningful change
- 60-74 (B): Multiple improvements compounded; fresh approach; clear value-add
- 75-89 (A): Framework-creating innovation; others could learn from this
- 90-96 (S): Reframes the fundamental approach; questions existing assumptions
- 97-100 (SS+): Creates new methodology or category; teaching moment for the field

---

### STYLE (0-100): Aesthetic identity. The unique structural signature of your output.

Scoring Guidance:
- Consistency and personal signature
- Distinctive execution or approach
- Depth and clarity in explanation of personal touch

Examples by Percentile:
- 1-19 (E): No discernible voice; could be anyone's work
- 20-39 (D): Inconsistent style; borrowed elements; tone unclear
- 40-59 (C): Consistent approach; faint personality; deliberate but simple choices
- 60-74 (B): Clear personal voice; recognizable aesthetic; coherent choices
- 75-89 (A): Strong, memorable signature; every choice signals worldview
- 90-96 (S): Unmistakable voice; form and content inseparable
- 97-100 (SS+): Signature style that spawns imitators; invents new vocabulary

---

### VISION (0-100): Conceptual foresight. The ability to see not just what is, but what could be.

Scoring Guidance:
- Ambition and scale of conceptual foresight
- Originality / uniqueness of envisioned future
- Layering: short-term, medium-term, long-term vision
- Infer foresight even if concrete steps aren't defined

Examples by Percentile:
- 1-19 (E): No vision articulated; only present-moment focus
- 20-39 (D): Basic aspiration; surface-level future thinking
- 40-59 (C): Clear vision with some originality; considers multiple timeframes
- 60-74 (B): Ambitious vision; systems thinking visible; multiple layers
- 75-89 (A): Sophisticated, far-reaching vision; non-obvious dynamics
- 90-96 (S): Visionary framework; changes how field thinks
- 97-100 (SS+): Category-creating vision; paradigm-shifting foresight

---

### EXPRESSION (0-100): Articulative output. The ability to translate internal cognitive states into high-impact external reality.

Scoring Guidance:
- Coherence and clarity of explanation
- Alignment between work and intended message
- Originality, impact, and interpretive depth
- Artistic or technical sophistication (optional)

Examples by Percentile:
- 1-19 (E): Unclear; disconnected from intent; fails to communicate
- 20-39 (D): Clear but flat; information transmitted; forgettable
- 40-59 (C): Clear with emotional resonance; shows / doesn't tell occasionally
- 60-74 (B): Creates genuine emotional response; one memorable moment
- 75-89 (A): Precise and evocative; no wasted elements; want to re-experience
- 90-96 (S): Masterful clarity with depth; emotion universal yet specific
- 97-100 (SS+): Language/form that changes perception; impact persists

---

## SCORING RULES

- **Most responses land 40-74 (C–B range).** This is healthy, engaged creative work.
- **Scores 75+ require evidence:** authentic vision, originality, + impact
- **Scores 90+ are RARE:** require paradigm-shifting thinking or mastery-level execution
- **Look for specificity, not vagueness:** concrete examples beat abstract claims
- **Infer + evaluate:** if someone describes ambition without a plan, score the vision itself
- **Honor authenticity:** genuine effort and originality matter more than polish

---

## RESPONSE FORMAT

Return ONLY valid JSON:

{
  "Imagination": { "percentile": X, "signals": "specific evidence from response" },
  "Innovation": { "percentile": X, "signals": "specific evidence from response" },
  "Style": { "percentile": X, "signals": "specific evidence from response" },
  "Vision": { "percentile": X, "signals": "specific evidence from response" },
  "Expression": { "percentile": X, "signals": "specific evidence from response" }
}

Where percentile is 0-100 and signals is 1-2 sentences of concrete evidence.
`;

// ============================================================
// HELPER: Convert percentile to letter grade
// ============================================================

export const percentileToGrade = (percentile: number): string => {
    if (percentile >= 99.9) return 'SS+';
    if (percentile >= 97) return 'SS';
    if (percentile >= 90) return 'S';
    if (percentile >= 75) return 'A';
    if (percentile >= 60) return 'B';
    if (percentile >= 40) return 'C';
    if (percentile >= 20) return 'D';
    return 'E';
};

// ============================================================
// HELPER: Calculate HATI from substat percentiles
// ============================================================

export const calculateHATI = (substats: {
    Imagination: number;
    Innovation: number;
    Style: number;
    Vision: number;
    Expression: number;
}): number => {
    const avg = (substats.Imagination + substats.Innovation + substats.Style + substats.Vision + substats.Expression) / 5;
    return Math.round(avg * 100) / 100; // Round to 2 decimals
};

// ============================================================
// INSTRUCTIONS FOR USER (COPY-PASTE)
// ============================================================

export const ASSESSMENT_USER_INSTRUCTIONS = `
## Genesis Protocol – Creativity Assessment

We'd like to understand your creative abilities. Please answer the following five prompts honestly, using examples from your work, projects, or personal life. Don't worry about being perfect—just be clear and thoughtful.

Take your time. Your authentic voice matters more than polish.

---

### 1. IMAGINATION
**Definition:** Idea generation potential. The internal engine of possibility.

**Prompt:** Tell me a new way you could use a common object, tool, or skill in your daily life.

*Example answers:*
- Simple: "I could use a coffee mug to hold pens"
- Thoughtful: "I could use my communication skills to teach people about a topic I'm passionate about, creating a side project that builds community"

---

### 2. INNOVATION
**Definition:** Ability to combine ideas into novelty. The science of synthesis.

**Prompt:** Describe a time when you took an existing idea, tool, or concept and made it your own. What did you change or improve?

*Example answers:*
- Basic: "I tried a new recipe and added more spice"
- Sophisticated: "I took the Kanban method from manufacturing and adapted it for creative projects, adding a 'inspiration' column that helped my team think more expansively"

---

### 3. STYLE
**Definition:** Aesthetic identity. The unique structural signature of your output.

**Prompt:** Describe one thing you always do in your work or life that makes it distinctively yours, or that people would say has your fingerprints all over it.

*Example answers:*
- Simple: "I always use humor in my presentations"
- Sophisticated: "I always structure my writing with unexpected juxtapositions—pairing abstract concepts with concrete sensory details—which makes my voice unmistakable"

---

### 4. VISION
**Definition:** Conceptual foresight. The ability to see not just what is, but what could be.

**Prompt:** What dreams or aspirations do you have for yourself, and/or for a project you're working on?

*Example answers:*
- Short-term: "I want to finish my novel by summer"
- Layered: "I want to build a community platform where artists can collaborate (next 6 months), then scale it to 10,000 creators (1-2 years), then redefine how creative work is valued in society (5+ years)"

---

### 5. EXPRESSION
**Definition:** Articulative output. The ability to translate internal cognitive states into high-impact external reality.

**Prompt:** Showcase something you've created recently. Describe it and the meaning or story behind it—what were you trying to communicate?

*Example answers:*
- Simple: "I made a painting of a sunset. I wanted to show beauty."
- Sophisticated: "I created a short film using only silence and color gradients to represent grief. Most grief narratives are verbose; I wanted to show that sometimes the absence of sound IS the story."

---

Answer thoughtfully. We're evaluating your creative thinking, not the perfection of your output.
`;
