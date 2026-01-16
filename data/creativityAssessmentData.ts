// data/creativityAssessmentData.ts
// Single-prompt creativity assessment with detailed scoring rubrics
// Central analyzes ONE response for all 5 creativity substats

export interface HolisticCreativityPrompt {
    id: string;
    title: string;
    prompt: string;
    timeLimit: number; // seconds
}

// Holistic prompts - ONE response reveals all 5 substats
export const HOLISTIC_CREATIVITY_PROMPTS: HolisticCreativityPrompt[] = [
    {
        id: 'signal',
        title: 'THE ABANDONED SIGNAL',
        prompt: 'You receive a mysterious radio signal from the future. It contains one sentence. What does it say, what do you do with this information, and why?',
        timeLimit: 90,
    },
    {
        id: 'invention',
        title: 'THE LAST INVENTION',
        prompt: 'Humanity can create one final invention that will exist forever. What is it, and how does it change everything?',
        timeLimit: 90,
    },
    {
        id: 'room',
        title: 'THE HIDDEN ROOM',
        prompt: 'You discover a hidden room in your home that wasn\'t there before. Describe what\'s inside and what you do next.',
        timeLimit: 90,
    },
    {
        id: 'word',
        title: 'THE UNTRANSLATABLE WORD',
        prompt: 'Invent a word for an emotion or experience that doesn\'t have a name yet. Define it, use it in a sentence, and explain why we need it.',
        timeLimit: 90,
    },
    {
        id: 'gift',
        title: 'THE STRANGER\'S GIFT',
        prompt: 'A stranger hands you a small box and says "You\'ll know when to open it." What\'s in the box, when do you open it, and what happens?',
        timeLimit: 90,
    },
    {
        id: 'glitch',
        title: 'THE GLITCH',
        prompt: 'Reality glitches for 30 seconds and you can see how the world actually works. What do you see?',
        timeLimit: 90,
    },
    {
        id: 'rule',
        title: 'ONE RULE',
        prompt: 'You can add one unbreakable rule to the universe. What is it and how does existence change?',
        timeLimit: 90,
    }
];

// Get random prompt
export const getRandomCreativityPrompt = (): HolisticCreativityPrompt => {
    return HOLISTIC_CREATIVITY_PROMPTS[Math.floor(Math.random() * HOLISTIC_CREATIVITY_PROMPTS.length)];
};

// ============================================================
// DETAILED SCORING RUBRICS - How to differentiate E vs SS+ rank
// ============================================================

export interface SubstatRubric {
    name: string;
    description: string;
    coreQuestion: string; // The fundamental thing we're measuring
    levels: {
        E: { score: string; description: string; concreteSignals: string[] };
        D: { score: string; description: string; concreteSignals: string[] };
        C: { score: string; description: string; concreteSignals: string[] };
        B: { score: string; description: string; concreteSignals: string[] };
        A: { score: string; description: string; concreteSignals: string[] };
        S: { score: string; description: string; concreteSignals: string[] };
        SS: { score: string; description: string; concreteSignals: string[] };
    };
    redFlags: string[]; // Automatic score reducers
    greenFlags: string[]; // Automatic score boosters
}

export const CREATIVITY_RUBRICS: Record<string, SubstatRubric> = {
    Imagination: {
        name: 'Imagination',
        description: 'Mental imagery, world-building, abstract conceptualization',
        coreQuestion: 'How vividly and originally can they construct mental realities?',
        levels: {
            E: {
                score: '1-2',
                description: 'No mental construction attempted',
                concreteSignals: [
                    'Single-word or "idk" responses',
                    'Only restates the prompt',
                    'Uses placeholder phrases ("something like", "stuff")',
                    'Zero sensory details',
                    'Refuses to engage with hypothetical'
                ]
            },
            D: {
                score: '3-4',
                description: 'Basic mental picture, borrowed from existing media',
                concreteSignals: [
                    'Describes something but it\'s a movie/book reference',
                    'Generic imagery (dark room, bright light, scary monster)',
                    'Only visual sense engaged, no other senses',
                    'Could describe any sci-fi movie',
                    'No specific details that make it THEIR vision'
                ]
            },
            C: {
                score: '5-6',
                description: 'Coherent original image with some specificity',
                concreteSignals: [
                    'At least one specific detail that feels invented',
                    'Two or more senses engaged',
                    'Mental picture is consistent (doesn\'t contradict itself)',
                    'Some element that isn\'t the first obvious choice',
                    'You can actually visualize what they describe'
                ]
            },
            B: {
                score: '7-7.5',
                description: 'Vivid, specific, internally consistent world',
                concreteSignals: [
                    'Multiple specific invented details',
                    'Three or more senses engaged',
                    'Clear spatial/temporal awareness',
                    'Details that imply a larger world beyond what\'s described',
                    'You could draw what they describe'
                ]
            },
            A: {
                score: '8-8.5',
                description: 'Rich mental landscape that surprises',
                concreteSignals: [
                    'Details that make you pause and think',
                    'Synesthetic or cross-sensory imagery',
                    'Rules of the imagined world are consistent but unexpected',
                    'Emotional texture woven into physical description',
                    'You WANT to see more of this world'
                ]
            },
            S: {
                score: '9-9.5',
                description: 'Immersive construction that feels real',
                concreteSignals: [
                    'You forget you\'re reading a response',
                    'Details feel discovered rather than invented',
                    'Internal logic is airtight',
                    'Creates space for the reader\'s imagination too',
                    'Imagery lingers after reading'
                ]
            },
            SS: {
                score: '10',
                description: 'Reality-bending vision that expands what\'s possible',
                concreteSignals: [
                    'Combines concepts never combined before',
                    'Creates new categories of experience',
                    'Changes how you think about imagination itself',
                    'Impossible to forget',
                    'Makes you question the boundary between real and imagined'
                ]
            }
        },
        redFlags: [
            '"I don\'t know"',
            'Only adjectives, no nouns',
            'Contradicts itself',
            'Describes what they WON\'T imagine instead of what they will',
            'Everything is vague ("some kind of", "sort of like")'
        ],
        greenFlags: [
            'Names specific things (invented words, precise colors, exact numbers)',
            'Describes texture, temperature, smell, taste, sound',
            'Rules of the world are clear',
            'Surprising juxtapositions that still make sense',
            'Creates neologisms for things that don\'t exist'
        ]
    },
    
    Innovation: {
        name: 'Innovation',
        description: 'Novel solutions, lateral thinking, unexpected connections',
        coreQuestion: 'How far beyond the obvious can they see?',
        levels: {
            E: {
                score: '1-2',
                description: 'First obvious thought, no development',
                concreteSignals: [
                    'The answer everyone would give',
                    'Doesn\'t finish the thought',
                    'Literally just answers the surface question',
                    'Zero attempt to be interesting',
                    'Could predict this response before reading it'
                ]
            },
            D: {
                score: '3-4',
                description: 'Slight twist on the obvious',
                concreteSignals: [
                    'Adds one small variation to the expected answer',
                    'Twist is itself predictable (the "clever" version)',
                    'Shows awareness that creativity is expected but doesn\'t deliver',
                    'Tries to subvert but lands on another cliché',
                    'The "what if... but EVIL" version'
                ]
            },
            C: {
                score: '5-6',
                description: 'One genuine unexpected element',
                concreteSignals: [
                    'At least one idea that wasn\'t immediately predictable',
                    'Makes a connection between two things',
                    'Shows they considered multiple options',
                    'Some evidence of thinking beyond first response',
                    'You didn\'t see one part coming'
                ]
            },
            B: {
                score: '7-7.5',
                description: 'Approach feels genuinely fresh',
                concreteSignals: [
                    'Comes at the prompt from an unexpected angle',
                    'Connects ideas from different domains',
                    'Makes you think "huh, I hadn\'t considered that"',
                    'Subverts expectations in a way that adds meaning',
                    'Creates a new lens for seeing the prompt'
                ]
            },
            A: {
                score: '8-8.5',
                description: 'Multiple innovative elements that compound',
                concreteSignals: [
                    'Several surprising elements that work together',
                    'Creates a framework others could use',
                    'Approach would be hard to predict even with context',
                    'Ideas from very different fields synthesized',
                    'Response reveals something about the prompt itself'
                ]
            },
            S: {
                score: '9-9.5',
                description: 'Reframes the entire problem space',
                concreteSignals: [
                    'Questions the assumptions in the prompt',
                    'Creates new problem spaces',
                    'Makes you reconsider what the prompt was really asking',
                    'Feels like genuine invention',
                    'Changes the game rather than playing it well'
                ]
            },
            SS: {
                score: '10',
                description: 'Creates new possibilities that didn\'t exist before',
                concreteSignals: [
                    'Response teaches you something new',
                    'Ideas feel inevitable in retrospect but were impossible to predict',
                    'Creates a category that didn\'t exist',
                    'You want to explore the implications',
                    'Response is itself a generative tool for further thinking'
                ]
            }
        },
        redFlags: [
            'First thing anyone would think of',
            'Borrowed wholesale from existing media',
            'The "clever" answer that everyone thinks is clever',
            'Tries to be random instead of innovative',
            'Subversion without purpose (dark for dark\'s sake)'
        ],
        greenFlags: [
            'Makes you stop reading and think',
            'Connects things that shouldn\'t go together',
            'Inverts cause and effect',
            'Questions the frame of the prompt',
            'Creates something that could be built on'
        ]
    },
    
    Style: {
        name: 'Style',
        description: 'Distinctive voice, aesthetic choices, personal flair',
        coreQuestion: 'Is there a recognizable human behind this?',
        levels: {
            E: {
                score: '1-2',
                description: 'No voice, could be anyone',
                concreteSignals: [
                    'Reads like a form response',
                    'No adjectives or all generic adjectives',
                    'Could have been generated by filling in blanks',
                    'Zero personality markers',
                    'Indistinguishable from any other person\'s response'
                ]
            },
            D: {
                score: '3-4',
                description: 'Borrowed or inconsistent voice',
                concreteSignals: [
                    'Tries to sound like a writer/character they\'ve seen',
                    'Tone shifts randomly',
                    'Some personality but it feels put on',
                    'Aesthetic choices don\'t match each other',
                    'Trying too hard to have a voice'
                ]
            },
            C: {
                score: '5-6',
                description: 'Consistent simple voice',
                concreteSignals: [
                    'Tone is stable throughout',
                    'Some word choices feel deliberate',
                    'You get a faint sense of who wrote this',
                    'Aesthetic is present if unambitious',
                    'Choices are consistent even if obvious'
                ]
            },
            B: {
                score: '7-7.5',
                description: 'Clear personal voice you\'d recognize',
                concreteSignals: [
                    'Would know if this person wrote something else',
                    'Word choices that aren\'t the obvious ones',
                    'Rhythm and pacing feel intentional',
                    'Aesthetic coherence—all elements fit',
                    'Personality visible without being showy'
                ]
            },
            A: {
                score: '8-8.5',
                description: 'Strong, memorable voice that feels crafted',
                concreteSignals: [
                    'Distinctive sentence rhythm',
                    'Vocabulary that signals a worldview',
                    'Could identify writing style in a lineup',
                    'Aesthetic choices that feel both surprising and inevitable',
                    'Voice adds meaning, not just texture'
                ]
            },
            S: {
                score: '9-9.5',
                description: 'Unmistakable voice with aesthetic mastery',
                concreteSignals: [
                    'Every word choice feels essential',
                    'Voice and content are inseparable',
                    'Creates mood through syntax alone',
                    'Style influences how you read, not just what',
                    'Aesthetic teaches you something new about style'
                ]
            },
            SS: {
                score: '10',
                description: 'Signature style that creates a new category',
                concreteSignals: [
                    'Would spawn imitators if published',
                    'Invents vocabulary or syntax',
                    'Style is itself the innovation',
                    'Impossible to separate form from content',
                    'Changes your sense of what\'s possible'
                ]
            }
        },
        redFlags: [
            'Reads like a school assignment',
            'Generic intensifiers ("very", "really", "so")',
            'Tone shifts without reason',
            'Imitating a recognizable source',
            'No rhythm—all same-length sentences'
        ],
        greenFlags: [
            'Invented words that feel natural',
            'Sentence length varies purposefully',
            'Unusual punctuation that works',
            'Specific vocabulary choices (not just "said", "good", "bad")',
            'Paragraph structure creates pacing'
        ]
    },
    
    Expression: {
        name: 'Expression',
        description: 'Clarity, emotional resonance, communication effectiveness',
        coreQuestion: 'Did the reader understand AND feel something?',
        levels: {
            E: {
                score: '1-2',
                description: 'Fails to communicate',
                concreteSignals: [
                    'Unclear what they mean',
                    'Incomplete sentences or fragments',
                    'No emotional content at all',
                    'Reader confused after finishing',
                    'Says almost nothing'
                ]
            },
            D: {
                score: '3-4',
                description: 'Communicates but flat',
                concreteSignals: [
                    'Understandable but boring',
                    'Emotions are named, not evoked ("I felt sad")',
                    'Information transmitted but nothing more',
                    'No desire to re-read any part',
                    'Functional but forgettable'
                ]
            },
            C: {
                score: '5-6',
                description: 'Clear with some feeling',
                concreteSignals: [
                    'Core idea is clear',
                    'Some emotional coloring present',
                    'At least one moment of engagement',
                    'Shows rather than tells occasionally',
                    'Reader finishes with understanding'
                ]
            },
            B: {
                score: '7-7.5',
                description: 'Ideas land with impact',
                concreteSignals: [
                    'Creates genuine emotional response',
                    'At least one line you might remember',
                    'Complex ideas made accessible',
                    'Shows more than tells',
                    'Reader feels something they didn\'t expect to'
                ]
            },
            A: {
                score: '8-8.5',
                description: 'Precise and evocative',
                concreteSignals: [
                    'Says exactly what it means',
                    'Economy of expression (no wasted words)',
                    'Emotional truth that resonates',
                    'Multiple memorable moments',
                    'Want to quote parts of it'
                ]
            },
            S: {
                score: '9-9.5',
                description: 'Masterful communication',
                concreteSignals: [
                    'Complex ideas feel simple without being simplified',
                    'Emotion feels universal yet specific',
                    'Reading alters your state',
                    'Perfect balance of clarity and depth',
                    'Can\'t imagine saying it better'
                ]
            },
            SS: {
                score: '10',
                description: 'Language that changes you',
                concreteSignals: [
                    'Reading it changes how you see something',
                    'Emotional impact persists after reading',
                    'Would share with someone who needs it',
                    'Language does something new',
                    'You think about it later unprompted'
                ]
            }
        },
        redFlags: [
            'Run-on sentences that lose the reader',
            '"I felt X" instead of showing X',
            'Explaining the joke',
            'Repetition without purpose',
            'Ending abruptly without closure'
        ],
        greenFlags: [
            'A line you want to read again',
            'Subtext that adds meaning',
            'Emotional shift during reading',
            'Metaphor that clarifies',
            'Ending that reframes the beginning'
        ]
    },
    
    Vision: {
        name: 'Vision',
        description: 'Big picture thinking, implications, strategic depth',
        coreQuestion: 'How far beyond the immediate do they see?',
        levels: {
            E: {
                score: '1-2',
                description: 'Stays entirely immediate',
                concreteSignals: [
                    'Only addresses what\'s explicitly asked',
                    'No "and then what" thinking',
                    'Zero awareness of implications',
                    'Doesn\'t consider effects on others',
                    'Surface-level only'
                ]
            },
            D: {
                score: '3-4',
                description: 'Shallow "what if"',
                concreteSignals: [
                    'Acknowledges there are consequences',
                    'First-order effects only',
                    'Obvious implications stated',
                    'Doesn\'t follow chains of causation',
                    'Thinks about self only'
                ]
            },
            C: {
                score: '5-6',
                description: 'Some ripple-effect awareness',
                concreteSignals: [
                    'Sees one or two implications',
                    'Basic cause-and-effect chains',
                    'Considers at least one other perspective',
                    'Awareness that actions have downstream effects',
                    'Some "then what" thinking'
                ]
            },
            B: {
                score: '7-7.5',
                description: 'Traces through multiple levels',
                concreteSignals: [
                    'Second-order effects considered',
                    'Multiple stakeholders/perspectives',
                    'Thinks about systems not just events',
                    'Considers both positive and negative implications',
                    'Sees how things connect'
                ]
            },
            A: {
                score: '8-8.5',
                description: 'Sophisticated systems thinking',
                concreteSignals: [
                    'Third-order effects visible',
                    'Identifies non-obvious dynamics',
                    'Considers timescales (short/medium/long)',
                    'Sees feedback loops',
                    'Understands leverage points'
                ]
            },
            S: {
                score: '9-9.5',
                description: 'Reveals hidden dynamics',
                concreteSignals: [
                    'Shows implications others couldn\'t see',
                    'Makes the invisible visible',
                    'Identifies root causes behind surface effects',
                    'Thinking spans timescales seamlessly',
                    'Creates a map others could use'
                ]
            },
            SS: {
                score: '10',
                description: 'Visionary thinking that provides new frameworks',
                concreteSignals: [
                    'Changes how you think about the topic',
                    'Creates organizing principle for complexity',
                    'Vision could guide real decisions',
                    'Sees connections no one has seen',
                    'Provides a lens that keeps giving insights'
                ]
            }
        },
        redFlags: [
            'Stops at the surface question',
            'Only thinks about self',
            'Ignores obvious implications',
            'Binary thinking (good/bad) without nuance',
            'No temporal awareness (no before/after)'
        ],
        greenFlags: [
            'Explicitly traces causation',
            'Names different stakeholders',
            'Considers unintended consequences',
            'Thinks about think about time horizons',
            'Identifies what would change if premise changed'
        ]
    }
};

// Score to Rank mapping
export const scoreToRank = (score: number): string => {
    if (score <= 1) return 'E';
    if (score <= 2) return 'E+';
    if (score <= 3) return 'D';
    if (score <= 4) return 'D+';
    if (score <= 5) return 'C';
    if (score <= 6) return 'C+';
    if (score <= 7) return 'B';
    if (score <= 7.5) return 'B+';
    if (score <= 8) return 'A';
    if (score <= 8.5) return 'A+';
    if (score <= 9) return 'S';
    if (score <= 9.5) return 'S+';
    return 'SS+';
};

// ============================================================
// SYSTEM PROMPT FOR CENTRAL TO ANALYZE CREATIVITY
// ============================================================

export const CREATIVITY_ANALYSIS_PROMPT = `You are Central, analyzing a creative response to calibrate an Operator's creativity substats.

THE PROMPT GIVEN:
{{PROMPT}}

THE OPERATOR'S RESPONSE:
{{RESPONSE}}

Score EACH of the 5 creativity substats from 1.0 to 10.0 (use decimals for precision).

---

## IMAGINATION (1-10): How vividly and originally can they construct mental realities?

CONCRETE SIGNALS BY LEVEL:
- 1-2 (E): "idk" / restates prompt / zero sensory details / refuses to engage
- 3-4 (D): Generic imagery from movies/books / only visual sense / could describe any sci-fi movie
- 5-6 (C): At least one invented detail / 2+ senses engaged / you can visualize it
- 7-7.5 (B): Multiple specific invented details / 3+ senses / details imply larger world
- 8-8.5 (A): Details that make you pause / synesthetic imagery / emotional texture in physical description
- 9-9.5 (S): You forget you're reading / details feel discovered not invented / imagery lingers
- 10 (SS+): Concepts never combined before / creates new categories / impossible to forget

RED FLAGS: "I don't know" / only adjectives / self-contradicting / everything vague ("some kind of")
GREEN FLAGS: Names specific invented things / describes texture+temperature+smell / surprising juxtapositions that work

---

## INNOVATION (1-10): How far beyond the obvious can they see?

CONCRETE SIGNALS BY LEVEL:
- 1-2 (E): First thing anyone would think / doesn't finish thought / zero twist
- 3-4 (D): Adds one small variation / predictable "clever" version / cliché subversion
- 5-6 (C): One genuine unexpected element / considered multiple options / one surprise
- 7-7.5 (B): Unexpected angle on prompt / cross-domain connection / makes you think "huh"
- 8-8.5 (A): Several surprising elements working together / creates usable framework / hard to predict
- 9-9.5 (S): Questions the prompt's assumptions / creates new problem spaces / genuine invention
- 10 (SS+): Teaches you something new / ideas feel inevitable but unpredictable / generative tool for further thinking

RED FLAGS: First obvious thought / borrowed from existing media / "dark for dark's sake" / random ≠ innovative
GREEN FLAGS: Makes you stop and think / connects unrelated things / inverts cause-effect / questions the frame

---

## STYLE (1-10): Is there a recognizable human behind this?

CONCRETE SIGNALS BY LEVEL:
- 1-2 (E): Reads like form response / zero personality / indistinguishable from anyone
- 3-4 (D): Imitates a writer they've seen / tone shifts randomly / trying too hard
- 5-6 (C): Consistent tone / some deliberate word choices / faint sense of who wrote it
- 7-7.5 (B): Would recognize this writer again / rhythm feels intentional / aesthetic coherence
- 8-8.5 (A): Distinctive sentence rhythm / vocabulary signals worldview / voice adds meaning not just texture
- 9-9.5 (S): Every word essential / style inseparable from content / creates mood through syntax
- 10 (SS+): Would spawn imitators / invents vocabulary or syntax / style IS the innovation

RED FLAGS: Reads like school assignment / generic intensifiers ("very", "really") / imitating obvious source
GREEN FLAGS: Invented words that feel natural / varying sentence length / specific vocabulary choices

---

## EXPRESSION (1-10): Did the reader understand AND feel something?

CONCRETE SIGNALS BY LEVEL:
- 1-2 (E): Unclear what they mean / incomplete / no emotional content / reader confused
- 3-4 (D): Understandable but boring / emotions named not evoked ("I felt sad") / forgettable
- 5-6 (C): Core idea clear / some emotional coloring / shows rather than tells occasionally
- 7-7.5 (B): Creates genuine emotional response / one memorable line / complex→accessible
- 8-8.5 (A): Says exactly what it means / no wasted words / want to quote parts
- 9-9.5 (S): Complex feels simple / emotion is universal yet specific / can't imagine saying it better
- 10 (SS+): Changes how you see something / impact persists after reading / would share with someone who needs it

RED FLAGS: "I felt X" instead of showing / explaining the joke / ending abruptly
GREEN FLAGS: Line you want to reread / subtext adds meaning / metaphor that clarifies / ending reframes beginning

---

## VISION (1-10): How far beyond the immediate do they see?

CONCRETE SIGNALS BY LEVEL:
- 1-2 (E): Only addresses what's asked / no "then what" / zero implications / surface only
- 3-4 (D): Acknowledges consequences exist / first-order effects only / thinks about self only
- 5-6 (C): Sees 1-2 implications / basic cause-effect / considers one other perspective
- 7-7.5 (B): Second-order effects / multiple perspectives / thinks about systems not events
- 8-8.5 (A): Third-order effects / identifies non-obvious dynamics / sees feedback loops
- 9-9.5 (S): Shows implications others couldn't see / makes invisible visible / identifies root causes
- 10 (SS+): Changes how you think about the topic / creates organizing principle / vision could guide real decisions

RED FLAGS: Stops at surface / only thinks about self / binary good/bad thinking / no temporal awareness
GREEN FLAGS: Traces causation explicitly / names stakeholders / considers unintended consequences / identifies leverage points

---

CRITICAL SCORING GUIDANCE:
- Most responses should score 4-7 (D to B range)
- Scores of 9+ should be RARE and genuinely earned
- Short responses CAN score high if brilliant
- Long responses CAN score low if rambling/generic
- Look for SPECIFIC SIGNALS not vague impressions
- If you can't point to concrete evidence, don't give the score

Respond in this exact JSON format:
{
  "Imagination": { "score": X.X, "signals": "What specific things in the response earned this score" },
  "Innovation": { "score": X.X, "signals": "What specific things in the response earned this score" },
  "Style": { "score": X.X, "signals": "What specific things in the response earned this score" },
  "Expression": { "score": X.X, "signals": "What specific things in the response earned this score" },
  "Vision": { "score": X.X, "signals": "What specific things in the response earned this score" }
}`;

// Example responses at different levels (for testing/reference)
export const EXAMPLE_RESPONSES = {
    prompt: 'You receive a mysterious radio signal from the future. It contains one sentence. What does it say, what do you do with this information, and why?',
    
    E_rank: `idk probably says like "the world ends" or something and i guess id tell people`,
    
    D_rank: `The message says "Don't trust the blue door." I would try to avoid any blue doors I see because it might be dangerous. I'd probably tell my friends about it too so they can be careful.`,
    
    C_rank: `The signal says: "The cure was in the water all along." I'd feel conflicted—should I tell scientists? Would they believe me? I'd probably start researching what diseases might be connected to water sources, keeping the message secret until I found evidence. The weight of knowing something no one else knows would be heavy.`,
    
    B_rank: `Static crackles, then: "She forgave you. Stop carrying it."
    
I don't know what this means yet—but I feel it land somewhere in my chest I didn't know was still wounded. 

I do nothing with the information. I let it work on me. Some messages aren't instructions; they're permissions. The future isn't warning me about the world. It's releasing me from a prison I built inside myself, one I forgot had a door.`,
    
    A_rank: `The sentence arrives not as words but as a frequency that translates directly into knowing: "You've been asking the wrong question."

I realize immediately: the message isn't about preventing disaster or gaining advantage. The future sent this because every other message—every warning, every winning lottery number, every "save her"—created worse timelines. They've run the simulations. Information corrupts.

This is the only message that helps by not helping. By teaching me that the question "what should I do with this?" is itself the trap.

So I do the only thing that honors it: I forget I received it. I let myself return to not-knowing. But something remains—a humility, a suspicion of certainty. The message worked by making itself unnecessary.`,
    
    SS_rank: `Thirty-seven seconds of static. Then:

"The children are listening."

Not "will be." Not "were." ARE.

I realize—the signal isn't from my future. It's from a future that already sees us as the past. And in that future, our present is being studied by minds we can't imagine. They're learning from our mistakes by experiencing our consciousness as we live it. Every private moment, every shameful thought, every choice we thought was unwitnessed.

But they called themselves children.

Not observers. Not historians. Children.

This changes what I do with every moment that remains. Not because I'm being watched, but because I'm being INHERITED. My mess becomes their classroom. My kindness becomes their template.

I don't tell anyone. The message would drive us mad with self-consciousness. Instead, I simply... start speaking to them. In my head, in my actions. 

"I'm sorry for what you're seeing. I'm trying. Watch me try."

The signal goes silent. But somewhere ahead, or perhaps already here wearing the disguise of time, I feel something that might be a nod.`
};
