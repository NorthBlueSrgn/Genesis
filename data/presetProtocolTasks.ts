
// data/presetProtocolTasks.ts
import { Task, TaskType, StatName, SubStatName, ProficiencyLevel } from '../types';
import { HOBBY_LIST } from './calibrationData';

type PresetTask = Omit<Task, 'id' | 'isCompleted' | 'lastCompleted'>;

/**
 * HIGH-FIDELITY LANGUAGE LEVELS (Based on Dreaming Spanish Roadmap)
 */
const LANGUAGE_LEVEL_MAP: Record<number, PresetTask[]> = {
    1: [
        { description: 'Immersion: 60m Superbeginner videos (100% visual support/drawings). No subtitles.', type: TaskType.Daily, xp: 150, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Knowledge, amount: 12 } },
        { description: 'Crosstalk: 15m session with native partner (You speak L1, they speak L2).', type: TaskType.Daily, xp: 100, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Adaptability, amount: 8 } },
        { description: 'Weekly Deep Dive: Watch a 2-hour playlist of Superbeginner content in one sitting.', type: TaskType.Weekly, xp: 500, statBoost: { stat: StatName.Psyche, subStat: SubStatName.Focus, amount: 30 } }
    ],
    2: [
        { description: 'Immersion: 60m Beginner videos. Identify common 2-word sentence chunks.', type: TaskType.Daily, xp: 200, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Knowledge, amount: 15 } },
        { description: 'Crosstalk: 20m interactive session focusing on concrete nouns and action verbs.', type: TaskType.Daily, xp: 120, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Adaptability, amount: 10 } },
        { description: 'Weekly Milestone: Transcribe 10 unfamiliar words and find their visual meaning via context.', type: TaskType.Weekly, xp: 600, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Perception, amount: 40 } }
    ],
    3: [
        { description: 'Immersion: 90m Intermediate videos (lower visual support). Listen for grammar intuition.', type: TaskType.Daily, xp: 300, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Knowledge, amount: 20 } },
        { description: 'Audio: 20m easy learner-adapted podcasts while performing low-cognition tasks.', type: TaskType.Daily, xp: 150, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Perception, amount: 12 } },
        { description: 'Weekly Synthesis: Listen to a technical podcast/video and summarize the core logic in L1.', type: TaskType.Weekly, xp: 800, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Reason, amount: 50 } }
    ],
    4: [
        { description: 'Immersion: 2h Intermediate+ content. No visual cues required. Focus on function words.', type: TaskType.Daily, xp: 450, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Knowledge, amount: 35 } },
        { description: 'Output: Practice a "Store Script" - say 3 simple sentences that come to mind easily.', type: TaskType.Daily, xp: 200, statBoost: { stat: StatName.Psyche, subStat: SubStatName.Charisma, amount: 15 } },
        { description: 'Weekly Challenge: Complete a 4-hour immersion sprint (any format).', type: TaskType.Weekly, xp: 1200, statBoost: { stat: StatName.Physical, subStat: SubStatName.Endurance, amount: 60 } }
    ],
    5: [
        { description: 'Native Flux: 2h "Easier Native Media" (Cartoons/Vlogs). Target 90% comprehension.', type: TaskType.Daily, xp: 600, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Knowledge, amount: 50 } },
        { description: 'Reading: 20m reading children\'s books or simple web articles. No dictionary.', type: TaskType.Daily, xp: 300, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Reason, amount: 25 } },
        { description: 'Weekly Native Link: Watch a native movie (no subs) and record a 2m voice log of your thoughts.', type: TaskType.Weekly, xp: 1500, statBoost: { stat: StatName.Psyche, subStat: SubStatName.Expression, amount: 100 } }
    ],
    6: [
        { description: 'Massive Input: 3h authentic media (TV, Radio, Movies). Engage with slang and idioms.', type: TaskType.Daily, xp: 1000, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Knowledge, amount: 80 } },
        { description: 'Social Link: Join a social activity/call and interact exclusively in L2 for 45m.', type: TaskType.Daily, xp: 800, statBoost: { stat: StatName.Psyche, subStat: SubStatName.Expression, amount: 60 } },
        { description: 'Weekly Mastery: Debate a topic for 15m in L2 with a native or advanced partner.', type: TaskType.Weekly, xp: 2500, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Adaptability, amount: 150 } }
    ],
    7: [
        { description: 'Deep Flux: 3h unscripted native media (Debates/Plots/Technical fields).', type: TaskType.Daily, xp: 1500, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Knowledge, amount: 120 } },
        { description: 'Technical Challenge: Read/Watch content in a specialized field (Space/Law/Philosophy).', type: TaskType.Daily, xp: 1000, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Reason, amount: 80 } },
        { description: 'Weekly Singularity: Read a 200+ page native novel or equivalent technical documentation.', type: TaskType.Weekly, xp: 5000, statBoost: { stat: StatName.Spirit, subStat: SubStatName.Purpose, amount: 300 } }
    ]
};

const TASK_TEMPLATES: Record<string, Record<ProficiencyLevel, PresetTask[]>> = {
    'Physical': {
        [ProficiencyLevel.Novice]: [
            { description: 'Mechanical Symmetry: 3 sets of 12 reps focusing on form and eccentric control.', type: TaskType.Daily, xp: 100, statBoost: { stat: StatName.Physical, subStat: SubStatName.Strength, amount: 6 } },
            { description: 'Aerobic Base: 20m LISS session. Target Heart Rate Zone 2.', type: TaskType.Daily, xp: 80, statBoost: { stat: StatName.Vitality, subStat: SubStatName.Stamina, amount: 4 } },
            { description: 'Weekly Max Test: Single set of maximum effort (reps) on a core mechanical movement.', type: TaskType.Weekly, xp: 300, statBoost: { stat: StatName.Psyche, subStat: SubStatName.Willpower, amount: 20 } },
        ],
        [ProficiencyLevel.Intermediate]: [
            { description: 'Volume Loading: 5 sets of 8 reps at 70% intensity. Log metrics for every set.', type: TaskType.Daily, xp: 250, statBoost: { stat: StatName.Physical, subStat: SubStatName.Speed, amount: 15 } },
            { description: 'Kinetic Isolate: 30m intensive practice on your weakest mechanical link.', type: TaskType.Daily, xp: 200, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Strategy, amount: 12 } },
            { description: 'Weekly Load Shift: 90m high-volume session. Total tonnage target must exceed daily avg by 25%.', type: TaskType.Weekly, xp: 750, statBoost: { stat: StatName.Physical, subStat: SubStatName.Endurance, amount: 50 } },
        ],
        [ProficiencyLevel.Advanced]: [
            { description: 'Intensive Output: 90m high-intensity session. Push to RPE 9 on final sequences.', type: TaskType.Daily, xp: 600, statBoost: { stat: StatName.Physical, subStat: SubStatName.Endurance, amount: 35 } },
            { description: 'Kinetic Audit: Video analysis of 3 peak sets. Identify and resolve power leaks.', type: TaskType.Daily, xp: 500, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Perception, amount: 25 } },
            { description: 'Weekly Overload: Attempt a new 3RM (3-Rep Max) on a primary specialization movement.', type: TaskType.Weekly, xp: 1500, statBoost: { stat: StatName.Physical, subStat: SubStatName.Strength, amount: 100 } },
        ],
        [ProficiencyLevel.Master]: [
            { description: 'Apex Feat: Attempt a personal best or enter elite level competitive testing.', type: TaskType.Daily, xp: 1500, statBoost: { stat: StatName.Psyche, subStat: SubStatName.Willpower, amount: 80 } },
            { description: 'Strategic Innovation: Design and execute a 4-week custom peak-performance block.', type: TaskType.Daily, xp: 1200, statBoost: { stat: StatName.Creativity, subStat: SubStatName.Innovation, amount: 60 } },
            { description: 'Weekly Dominance: Complete a 3-hour kinetic gauntlet or multi-phase endurance event.', type: TaskType.Weekly, xp: 4000, statBoost: { stat: StatName.Vitality, subStat: SubStatName.Longevity, amount: 250 } },
        ]
    },
    'Intellectual': {
        [ProficiencyLevel.Novice]: [
            { description: 'Theoretical Baseline: 30m study of core principles and fundamental theory.', type: TaskType.Daily, xp: 100, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Knowledge, amount: 7 } },
            { description: 'Pattern Drill: 15m low-complexity drills focusing on speed of recognition.', type: TaskType.Daily, xp: 90, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Reason, amount: 6 } },
            { description: 'Weekly Synthesis: Write a 3-paragraph summary of the primary logic learned this week.', type: TaskType.Weekly, xp: 400, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Strategy, amount: 30 } },
        ],
        [ProficiencyLevel.Intermediate]: [
            { description: 'Logic Matrix: 45m solving complex problems or scenarios in this domain.', type: TaskType.Daily, xp: 280, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Reason, amount: 18 } },
            { description: 'Model Deconstruction: Analyze 1 master-level work or game. Map their decision tree.', type: TaskType.Daily, xp: 240, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Strategy, amount: 15 } },
            { description: 'Weekly Theory Audit: Read 1 technical paper or complex book chapter and map it to current projects.', type: TaskType.Weekly, xp: 1000, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Knowledge, amount: 80 } },
        ],
        [ProficiencyLevel.Advanced]: [
            { description: 'Deep Research: 90m intensive research or gameplay against high-level simulation.', type: TaskType.Daily, xp: 700, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Knowledge, amount: 45 } },
            { description: 'Strategy Synthesis: Identify and document 1 systemic pattern or meta-strategy.', type: TaskType.Daily, xp: 600, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Strategy, amount: 35 } },
            { description: 'Weekly Simulation: Participate in a high-stakes competitive event or 3-hour technical deep-dive.', type: TaskType.Weekly, xp: 2500, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Reason, amount: 150 } },
        ],
        [ProficiencyLevel.Master]: [
            { description: 'Theoretical Expansion: Produce an original piece of theory or strategic analysis.', type: TaskType.Daily, xp: 1800, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Innovation, amount: 100 } },
            { description: 'Mastery Link: Mentor an operative or engage in top-tier public discourse.', type: TaskType.Daily, xp: 1500, statBoost: { stat: StatName.Spirit, subStat: SubStatName.Purpose, amount: 80 } },
            { description: 'Weekly Vision: Draft a 6-month roadmap for the evolution of your chosen domain.', type: TaskType.Weekly, xp: 6000, statBoost: { stat: StatName.Creativity, subStat: SubStatName.Vision, amount: 400 } },
        ]
    }
};

const DEFAULT_TASKS: Record<ProficiencyLevel, PresetTask[]> = {
    [ProficiencyLevel.Novice]: [
        { description: '15m Mechanical fundamental conditioning.', type: TaskType.Daily, xp: 100, statBoost: { stat: StatName.Vitality, subStat: SubStatName.Adherence, amount: 5 } },
        { description: 'Document 3 technical findings in your system log.', type: TaskType.Daily, xp: 80, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Knowledge, amount: 4 } },
        { description: 'Weekly Recap: Review daily logs and identify 1 repeatable success.', type: TaskType.Weekly, xp: 300, statBoost: { stat: StatName.Psyche, subStat: SubStatName.Focus, amount: 20 } },
    ],
    [ProficiencyLevel.Intermediate]: [
        { description: '40m Intensive drill session on your primary weak point.', type: TaskType.Daily, xp: 250, statBoost: { stat: StatName.Psyche, subStat: SubStatName.Focus, amount: 15 } },
        { description: 'Methodology Audit: Deconstruct one expert protocol and apply it.', type: TaskType.Daily, xp: 200, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Strategy, amount: 12 } },
        { description: 'Weekly Audit: Perform a 2-hour "Hard Block" session of uninterrupted work.', type: TaskType.Weekly, xp: 800, statBoost: { stat: StatName.Psyche, subStat: SubStatName.Willpower, amount: 60 } },
    ],
    [ProficiencyLevel.Advanced]: [
        { description: '2-hour Elite application of domain-specific skills.', type: TaskType.Daily, xp: 600, statBoost: { stat: StatName.Psyche, subStat: SubStatName.Willpower, amount: 35 } },
        { description: 'Efficiency Strip: Isolate and solve a 1% drag in your current workflow.', type: TaskType.Daily, xp: 500, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Perception, amount: 30 } },
        { description: 'Weekly Output: Publish or submit a finished piece of work or achievement.', type: TaskType.Weekly, xp: 2000, statBoost: { stat: StatName.Creativity, subStat: SubStatName.Expression, amount: 120 } },
    ],
    [ProficiencyLevel.Master]: [
        { description: 'Public Feat: Submit finished work or enter elite competition.', type: TaskType.Daily, xp: 1500, statBoost: { stat: StatName.Spirit, subStat: SubStatName.Purpose, amount: 80 } },
        { description: 'Standard Revision: Redefine your personal baseline for "Excellence".', type: TaskType.Daily, xp: 1200, statBoost: { stat: StatName.Creativity, subStat: SubStatName.Vision, amount: 60 } },
        { description: 'Weekly Legacy: Create a piece of documentation or content that aids others in the domain.', type: TaskType.Weekly, xp: 5000, statBoost: { stat: StatName.Spirit, subStat: SubStatName.Conviction, amount: 350 } },
    ]
};

const HOBBY_OVERRIDES: Record<string, Record<ProficiencyLevel, PresetTask[]>> = {};

const generateTasksForHobby = (hobby: typeof HOBBY_LIST[0], currentHours: number = 0): Record<ProficiencyLevel, PresetTask[]> => {
    const hobbyId = hobby.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    
    // LANGUAGE LOGIC OVERRIDE
    if (hobbyId === 'learning-languages') {
        const getDSLevel = (h: number) => {
            if (h >= 1500) return 7;
            if (h >= 1000) return 6;
            if (h >= 600) return 5;
            if (h >= 300) return 4;
            if (h >= 150) return 3;
            if (h >= 50) return 2;
            return 1;
        };
        const dsLevel = getDSLevel(currentHours);
        const tasks = LANGUAGE_LEVEL_MAP[dsLevel];
        
        const lMap: any = {};
        Object.values(ProficiencyLevel).forEach(p => lMap[p] = tasks);
        return lMap;
    }

    if (HOBBY_OVERRIDES[hobbyId]) return HOBBY_OVERRIDES[hobbyId];

    const categoryKey = hobby.category === 'Survival' ? 'Physical' : hobby.category;
    const categoryTemplates = TASK_TEMPLATES[categoryKey] || DEFAULT_TASKS;
    const hobbySpecificTasks: any = {};
    
    Object.values(ProficiencyLevel).forEach((level) => {
        const levelTemplates = categoryTemplates[level] || DEFAULT_TASKS[level];
        hobbySpecificTasks[level] = levelTemplates.map(template => {
            let desc = template.description;
            if (desc.includes('domain')) desc = desc.replace('domain', `${hobby.name} domain`);
            return { ...template, description: desc };
        });
    });
    return hobbySpecificTasks;
};

export const TIERED_PROTOCOL_TASKS: Record<string, Record<ProficiencyLevel, PresetTask[]>> = 
    Object.fromEntries(HOBBY_LIST.map(hobby => [
        hobby.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        generateTasksForHobby(hobby)
    ]));
