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
            { description: 'Form Foundation: 3 sets of 12 reps on primary lift with video review. Focus on 5-second negatives.', type: TaskType.Daily, xp: 100, statBoost: { stat: StatName.Physical, subStat: SubStatName.Strength, amount: 6 } },
            { description: 'Cardio Baseline: 25m Zone 2 (conversational pace). Maintain HR 120-140. Log distance/pace.', type: TaskType.Daily, xp: 80, statBoost: { stat: StatName.Vitality, subStat: SubStatName.Stamina, amount: 4 } },
            { description: 'Weekly Strength Test: Perform 1RM test on squat/bench/deadlift. Record max weight achieved.', type: TaskType.Weekly, xp: 300, statBoost: { stat: StatName.Psyche, subStat: SubStatName.Willpower, amount: 20 } },
        ],
        [ProficiencyLevel.NovicePlus]: [
            { description: 'Progressive Overload: 4×10@65% on main lift. Add 2.5-5kg from last session. Track weight progression.', type: TaskType.Daily, xp: 150, statBoost: { stat: StatName.Physical, subStat: SubStatName.Strength, amount: 9 } },
            { description: 'Endurance Build: 30m Zone 2 cardio + 15m core strength circuit. Log HR recovery time.', type: TaskType.Daily, xp: 120, statBoost: { stat: StatName.Vitality, subStat: SubStatName.Endurance, amount: 7 } },
            { description: 'Weekly Consistency: Complete all 5 training days without missing a session. Track adherence streak.', type: TaskType.Weekly, xp: 450, statBoost: { stat: StatName.Vitality, subStat: SubStatName.Adherence, amount: 28 } },
        ],
        [ProficiencyLevel.Intermediate]: [
            { description: 'Volume Circuit: 5×8@75% on main lift + 4 accessories. Track RPE for each set. Total session >45m.', type: TaskType.Daily, xp: 250, statBoost: { stat: StatName.Physical, subStat: SubStatName.Speed, amount: 15 } },
            { description: 'Weakness Protocol: 30m isolated work on your lowest lift. 3 sets of 10 reps with pauses. Log weakness metrics.', type: TaskType.Daily, xp: 200, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Strategy, amount: 12 } },
            { description: 'Weekly Volume Raid: 90m continuous strength session. Total tonnage must be 25% higher than daily average.', type: TaskType.Weekly, xp: 750, statBoost: { stat: StatName.Physical, subStat: SubStatName.Endurance, amount: 50 } },
        ],
        [ProficiencyLevel.IntermediatePlus]: [
            { description: 'Intensity Climb: 6×6@80% on main lift with 3m rest. Focus on explosive concentric. Video key sets.', type: TaskType.Daily, xp: 380, statBoost: { stat: StatName.Physical, subStat: SubStatName.Speed, amount: 22 } },
            { description: 'Technique Refinement: 45m session with coach or video analysis. Fix 2 specific form issues. Document corrections.', type: TaskType.Daily, xp: 320, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Perception, amount: 18 } },
            { description: 'Weekly Power Test: Perform 5×3@85% on competition lifts. Measure bar velocity. Track strength gains.', type: TaskType.Weekly, xp: 1100, statBoost: { stat: StatName.Physical, subStat: SubStatName.Strength, amount: 70 } },
        ],
        [ProficiencyLevel.Advanced]: [
            { description: 'Peak Performance: 90m compound + accessory work at RPE 8-9. 4-5 main sets, push near-maximal effort.', type: TaskType.Daily, xp: 600, statBoost: { stat: StatName.Physical, subStat: SubStatName.Endurance, amount: 35 } },
            { description: 'Biomechanics Deep Dive: Video record 3 max-effort sets. Analyze bar path, knee drive, hip mechanics. Document 3 cues.', type: TaskType.Daily, xp: 500, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Perception, amount: 25 } },
            { description: 'Weekly PR Attempt: Test a new 1RM or perform a heavy double (2RM) on primary lift. Must exceed previous baseline.', type: TaskType.Weekly, xp: 1500, statBoost: { stat: StatName.Physical, subStat: SubStatName.Strength, amount: 100 } },
        ],
        [ProficiencyLevel.AdvancedPlus]: [
            { description: 'Competition Prep: 2-hour session simulating meet conditions. Attempt opener/second/third attempts with strict timing.', type: TaskType.Daily, xp: 900, statBoost: { stat: StatName.Physical, subStat: SubStatName.Endurance, amount: 50 } },
            { description: 'Mentality Training: Visualize max attempts, practice walkout protocols, work with sports psychologist. Log mental state.', type: TaskType.Daily, xp: 750, statBoost: { stat: StatName.Psyche, subStat: SubStatName.Focus, amount: 40 } },
            { description: 'Weekly Peaking Block: Execute periodized deload or peak week. Test 90-95% singles on all main lifts.', type: TaskType.Weekly, xp: 2200, statBoost: { stat: StatName.Physical, subStat: SubStatName.Strength, amount: 140 } },
        ],
        [ProficiencyLevel.Master]: [
            { description: 'Elite Competition: Enter a local meet, set a personal record, or achieve top-5 lift in your category.', type: TaskType.Daily, xp: 1500, statBoost: { stat: StatName.Psyche, subStat: SubStatName.Willpower, amount: 80 } },
            { description: 'Periodization Mastery: Architect a 12-week peak cycle with macrocycles, mesocycles, and periodized deloads.', type: TaskType.Daily, xp: 1200, statBoost: { stat: StatName.Creativity, subStat: SubStatName.Innovation, amount: 60 } },
            { description: 'Weekly Dominance Event: 2-3 hour multi-lift gauntlet. Complete max-effort sequences on 3+ lifts with minimal rest.', type: TaskType.Weekly, xp: 4000, statBoost: { stat: StatName.Vitality, subStat: SubStatName.Longevity, amount: 250 } },
        ],
        [ProficiencyLevel.MasterPlus]: [
            { description: 'Record Breaking: Compete at national/international level. Attempt all-time PR or podium finish in sanctioned event.', type: TaskType.Daily, xp: 2200, statBoost: { stat: StatName.Physical, subStat: SubStatName.Strength, amount: 120 } },
            { description: 'Legacy Building: Coach elite athletes, publish training methodology, or innovate new techniques in strength sports.', type: TaskType.Daily, xp: 1800, statBoost: { stat: StatName.Spirit, subStat: SubStatName.Purpose, amount: 100 } },
            { description: 'Weekly Apex: Set world-class total, sponsor major event, or achieve hall-of-fame level recognition in your sport.', type: TaskType.Weekly, xp: 7000, statBoost: { stat: StatName.Spirit, subStat: SubStatName.Conviction, amount: 500 } },
        ]
    },
    'Intellectual': {
        [ProficiencyLevel.Novice]: [
            { description: 'Core Concepts: Study 1 textbook chapter (30m). Summarize 5 key definitions and core principles in notes.', type: TaskType.Daily, xp: 100, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Knowledge, amount: 7 } },
            { description: 'Drill Repetition: Solve 20 practice problems from current level. Track accuracy and time per problem.', type: TaskType.Daily, xp: 90, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Reason, amount: 6 } },
            { description: 'Weekly Checkpoint: Write a 300-word explanation of the week\'s hardest concept. Teach it to someone or record it.', type: TaskType.Weekly, xp: 400, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Strategy, amount: 30 } },
        ],
        [ProficiencyLevel.NovicePlus]: [
            { description: 'Concept Linking: Study 2 chapters (40m). Create visual connections between 5+ concepts. Map dependencies.', type: TaskType.Daily, xp: 150, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Knowledge, amount: 10 } },
            { description: 'Problem Acceleration: Solve 30 problems with increasing difficulty. Aim to reduce avg time by 10% vs last session.', type: TaskType.Daily, xp: 130, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Reason, amount: 9 } },
            { description: 'Weekly Application: Complete 1 mini-project applying the week\'s concepts. Document all decision points.', type: TaskType.Weekly, xp: 600, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Adaptability, amount: 40 } },
        ],
        [ProficiencyLevel.Intermediate]: [
            { description: 'Problem Gauntlet: Solve 45m of intermediate problems. Focus on multi-step scenarios. Must achieve 80%+ accuracy.', type: TaskType.Daily, xp: 280, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Reason, amount: 18 } },
            { description: 'Master Analysis: Study 1 expert solution or proof. Deconstruct their approach. Document 3 tactical insights you learned.', type: TaskType.Daily, xp: 240, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Strategy, amount: 15 } },
            { description: 'Weekly Deep Study: Read 1 technical paper/book (40+ pages). Create a mind-map of key concepts and connections.', type: TaskType.Weekly, xp: 1000, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Knowledge, amount: 80 } },
        ],
        [ProficiencyLevel.IntermediatePlus]: [
            { description: 'Cross-Domain Synthesis: 60m solving problems that blend 2+ areas of study. Document novel insights.', type: TaskType.Daily, xp: 420, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Adaptability, amount: 27 } },
            { description: 'Strategic Pattern Mining: Analyze 5+ expert solutions. Extract 3 meta-patterns applicable across domains.', type: TaskType.Daily, xp: 360, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Strategy, amount: 22 } },
            { description: 'Weekly Research Sprint: Read 2 technical papers. Write 500-word synthesis connecting both to your domain.', type: TaskType.Weekly, xp: 1400, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Knowledge, amount: 110 } },
        ],
        [ProficiencyLevel.Advanced]: [
            { description: 'Research Immersion: 90m studying bleeding-edge research or solving complex, ambiguous problems. Document process.', type: TaskType.Daily, xp: 700, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Knowledge, amount: 45 } },
            { description: 'Pattern Recognition: Identify and document 1 novel pattern, lemma, or meta-strategy across 3+ problems or papers.', type: TaskType.Daily, xp: 600, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Strategy, amount: 35 } },
            { description: 'Weekly Mastery Challenge: Compete in a competition, publish a solution, or contribute to advanced discourse.', type: TaskType.Weekly, xp: 2500, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Reason, amount: 150 } },
        ],
        [ProficiencyLevel.AdvancedPlus]: [
            { description: 'Original Research: 2h developing novel approaches to open problems. Document hypotheses and experimental results.', type: TaskType.Daily, xp: 1050, statBoost: { stat: StatName.Creativity, subStat: SubStatName.Innovation, amount: 65 } },
            { description: 'Peer Collaboration: Engage with researchers/experts. Present 1 original idea. Get critique and iterate.', type: TaskType.Daily, xp: 900, statBoost: { stat: StatName.Psyche, subStat: SubStatName.Charisma, amount: 55 } },
            { description: 'Weekly Contribution: Submit to journal, present at seminar, or publish significant findings in your field.', type: TaskType.Weekly, xp: 3500, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Reason, amount: 220 } },
        ],
        [ProficiencyLevel.Master]: [
            { description: 'Theoretical Innovation: Produce an original proof, algorithm, or theoretical framework in your domain.', type: TaskType.Daily, xp: 1800, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Innovation, amount: 100 } },
            { description: 'Legacy Mentorship: Mentor an emerging operative or publish a deep educational resource on advanced theory.', type: TaskType.Daily, xp: 1500, statBoost: { stat: StatName.Spirit, subStat: SubStatName.Purpose, amount: 80 } },
            { description: 'Weekly Paradigm Shift: Design a novel approach or framework that advances the field. Document and share findings.', type: TaskType.Weekly, xp: 6000, statBoost: { stat: StatName.Creativity, subStat: SubStatName.Vision, amount: 400 } },
        ],
        [ProficiencyLevel.MasterPlus]: [
            { description: 'Field-Defining Work: Publish groundbreaking research that changes fundamental understanding in your domain.', type: TaskType.Daily, xp: 2700, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Innovation, amount: 150 } },
            { description: 'Global Recognition: Receive awards, keynote major conferences, or establish new schools of thought.', type: TaskType.Daily, xp: 2200, statBoost: { stat: StatName.Spirit, subStat: SubStatName.Conviction, amount: 120 } },
            { description: 'Weekly Legacy: Lead research teams, establish institutes, or create work studied by future generations.', type: TaskType.Weekly, xp: 9000, statBoost: { stat: StatName.Spirit, subStat: SubStatName.Purpose, amount: 600 } },
        ]
    },
    'Technical': {
        [ProficiencyLevel.Novice]: [
            { description: 'Code Foundations: Complete 1 tutorial or documentation section (30m). Build 1 simple project. Document what you learned.', type: TaskType.Daily, xp: 100, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Knowledge, amount: 8 } },
            { description: 'Bug Squashing: Debug and fix 5 beginner coding problems. Trace the issue, understand the solution, move on.', type: TaskType.Daily, xp: 90, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Perception, amount: 6 } },
            { description: 'Weekly Build: Create a functional small project (calculator, to-do list, etc). Test all features. Commit code.', type: TaskType.Weekly, xp: 400, statBoost: { stat: StatName.Creativity, subStat: SubStatName.Expression, amount: 30 } },
        ],
        [ProficiencyLevel.NovicePlus]: [
            { description: 'Syntax Mastery: 40m building 2 small apps with proper structure. Use version control. Document setup process.', type: TaskType.Daily, xp: 150, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Knowledge, amount: 11 } },
            { description: 'Code Reading: Study 200+ lines of quality code. Trace logic flow. Document 5 patterns or idioms you learned.', type: TaskType.Daily, xp: 130, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Strategy, amount: 9 } },
            { description: 'Weekly Integration: Build an app with 2+ external libraries/APIs. Handle errors. Write basic tests.', type: TaskType.Weekly, xp: 600, statBoost: { stat: StatName.Creativity, subStat: SubStatName.Innovation, amount: 42 } },
        ],
        [ProficiencyLevel.Intermediate]: [
            { description: '60m coding sprint: Build 2-3 features for a medium project. Use proper design patterns. Code review your own work.', type: TaskType.Daily, xp: 280, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Reason, amount: 18 } },
            { description: 'System Design Study: Analyze 1 open-source project. Document architecture, key components, and 3 design decisions.', type: TaskType.Daily, xp: 240, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Strategy, amount: 15 } },
            { description: 'Weekly Optimization: Refactor a feature for performance. Measure speed improvement (profiling/benchmarking). Document gains.', type: TaskType.Weekly, xp: 1000, statBoost: { stat: StatName.Creativity, subStat: SubStatName.Innovation, amount: 80 } },
        ],
        [ProficiencyLevel.IntermediatePlus]: [
            { description: '90m feature development: Implement complex business logic with proper testing and error handling. Use TDD.', type: TaskType.Daily, xp: 420, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Reason, amount: 27 } },
            { description: 'Architecture Study: Deep dive into 1 design pattern or architectural style. Implement a working example.', type: TaskType.Daily, xp: 360, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Strategy, amount: 22 } },
            { description: 'Weekly Challenge: Build a production-ready feature with CI/CD, monitoring, and documentation.', type: TaskType.Weekly, xp: 1400, statBoost: { stat: StatName.Creativity, subStat: SubStatName.Innovation, amount: 110 } },
        ],
        [ProficiencyLevel.Advanced]: [
            { description: '2-hour architectural session: Design and implement a complex feature or microservice. Optimize for scale/performance.', type: TaskType.Daily, xp: 700, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Knowledge, amount: 45 } },
            { description: 'Debugging Mastery: Tackle a difficult bug in production-like code. Use profilers/logs. Document root cause and solution.', type: TaskType.Daily, xp: 600, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Perception, amount: 35 } },
            { description: 'Weekly Contribution: Contribute to open-source, publish a library, or complete a significant architectural overhaul.', type: TaskType.Weekly, xp: 2500, statBoost: { stat: StatName.Creativity, subStat: SubStatName.Expression, amount: 150 } },
        ],
        [ProficiencyLevel.AdvancedPlus]: [
            { description: '3-hour system design: Architect distributed system or complex infrastructure. Handle failure modes and scaling.', type: TaskType.Daily, xp: 1050, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Strategy, amount: 65 } },
            { description: 'Technical Leadership: Lead code review, write RFC, or make architecture decisions for team. Document rationale.', type: TaskType.Daily, xp: 900, statBoost: { stat: StatName.Psyche, subStat: SubStatName.Charisma, amount: 55 } },
            { description: 'Weekly Impact: Ship major feature to production. Monitor metrics. Present technical deep-dive to team.', type: TaskType.Weekly, xp: 3500, statBoost: { stat: StatName.Creativity, subStat: SubStatName.Expression, amount: 220 } },
        ],
        [ProficiencyLevel.Master]: [
            { description: 'System Design Innovation: Architect a novel system that solves a hard technical problem in production environment.', type: TaskType.Daily, xp: 1800, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Innovation, amount: 100 } },
            { description: 'Leadership Through Code: Mentor junior developers, lead a technical RFC, or influence architectural decisions for large systems.', type: TaskType.Daily, xp: 1500, statBoost: { stat: StatName.Spirit, subStat: SubStatName.Purpose, amount: 80 } },
            { description: 'Weekly Industry Impact: Publish a deep technical blog post, speak at a conference, or release major open-source contribution.', type: TaskType.Weekly, xp: 6000, statBoost: { stat: StatName.Spirit, subStat: SubStatName.Conviction, amount: 400 } },
        ],
        [ProficiencyLevel.MasterPlus]: [
            { description: 'Industry Innovation: Create frameworks, languages, or tools used by thousands. Solve unsolved technical problems.', type: TaskType.Daily, xp: 2700, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Innovation, amount: 150 } },
            { description: 'Thought Leadership: Keynote major conferences, publish books/courses, establish engineering standards.', type: TaskType.Daily, xp: 2200, statBoost: { stat: StatName.Spirit, subStat: SubStatName.Purpose, amount: 120 } },
            { description: 'Weekly Legacy: Create technologies that shape the industry. Build legendary open-source projects.', type: TaskType.Weekly, xp: 9000, statBoost: { stat: StatName.Spirit, subStat: SubStatName.Conviction, amount: 600 } },
        ]
    },
    'Craft': {
        [ProficiencyLevel.Novice]: [
            { description: 'Material Fundamentals: Practice 1 core craft technique (30m). Complete 3-5 small practice pieces. Keep samples.', type: TaskType.Daily, xp: 100, statBoost: { stat: StatName.Creativity, subStat: SubStatName.Expression, amount: 8 } },
            { description: 'Process Documentation: Record your workflow for 1 small project. Take photos of each stage. Document lessons learned.', type: TaskType.Daily, xp: 90, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Knowledge, amount: 6 } },
            { description: 'Weekly Creation: Complete 1 finished craft piece. Iterate at least once. Document time and materials used.', type: TaskType.Weekly, xp: 400, statBoost: { stat: StatName.Creativity, subStat: SubStatName.Style, amount: 30 } },
        ],
        [ProficiencyLevel.NovicePlus]: [
            { description: 'Technique Expansion: Practice 2 related techniques (45m). Create pieces combining both. Compare quality to earlier work.', type: TaskType.Daily, xp: 150, statBoost: { stat: StatName.Creativity, subStat: SubStatName.Expression, amount: 10 } },
            { description: 'Quality Focus: Refine finishing techniques. Complete 2-3 pieces emphasizing clean edges, uniform texture, or precision.', type: TaskType.Daily, xp: 130, statBoost: { stat: StatName.Physical, subStat: SubStatName.Dexterity, amount: 8 } },
            { description: 'Weekly Project: Create 1 piece using 3+ techniques. Document process improvements. Share with community for feedback.', type: TaskType.Weekly, xp: 600, statBoost: { stat: StatName.Creativity, subStat: SubStatName.Innovation, amount: 45 } },
        ],
        [ProficiencyLevel.Intermediate]: [
            { description: '60m focused craftsmanship: Create 1 medium-complexity piece using advanced techniques. Emphasize detail and finish.', type: TaskType.Daily, xp: 280, statBoost: { stat: StatName.Creativity, subStat: SubStatName.Expression, amount: 18 } },
            { description: 'Master Study: Replicate 1 technique from a master craftsperson. Analyze their methods. Document 3 refinements you\'d make.', type: TaskType.Daily, xp: 240, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Strategy, amount: 15 } },
            { description: 'Weekly Exhibition: Create a finished piece worthy of sharing. Photo/document it professionally. Get feedback from 2+ peers.', type: TaskType.Weekly, xp: 1000, statBoost: { stat: StatName.Creativity, subStat: SubStatName.Vision, amount: 80 } },
        ],
        [ProficiencyLevel.IntermediatePlus]: [
            { description: '90m craft intensive: Create multi-piece set with consistent quality. Focus on speed without sacrificing finish quality.', type: TaskType.Daily, xp: 400, statBoost: { stat: StatName.Creativity, subStat: SubStatName.Expression, amount: 25 } },
            { description: 'Design Iteration: Create 3 variations of the same piece. Test different approaches. Document what works best and why.', type: TaskType.Daily, xp: 350, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Adaptability, amount: 20 } },
            { description: 'Weekly Challenge: Complete a complex commissioned piece or participate in craft competition. Meet high standards under pressure.', type: TaskType.Weekly, xp: 1500, statBoost: { stat: StatName.Psyche, subStat: SubStatName.Focus, amount: 100 } },
        ],
        [ProficiencyLevel.Advanced]: [
            { description: '2-hour craft session: Create an advanced, multi-technique piece. Push technical limits. Refine to gallery-quality finish.', type: TaskType.Daily, xp: 700, statBoost: { stat: StatName.Creativity, subStat: SubStatName.Innovation, amount: 45 } },
            { description: 'Material Innovation: Experiment with an unconventional material or technique. Document successes/failures. Create 1 piece.', type: TaskType.Daily, xp: 600, statBoost: { stat: StatName.Creativity, subStat: SubStatName.Vision, amount: 35 } },
            { description: 'Weekly Exhibition: Exhibit work publicly (online gallery, local show, etc). Sell a piece or receive significant recognition.', type: TaskType.Weekly, xp: 2500, statBoost: { stat: StatName.Creativity, subStat: SubStatName.Expression, amount: 150 } },
        ],
        [ProficiencyLevel.AdvancedPlus]: [
            { description: '3-hour intensive: Create signature collection piece with unique style. Push boundaries of technique and materials.', type: TaskType.Daily, xp: 1000, statBoost: { stat: StatName.Creativity, subStat: SubStatName.Innovation, amount: 60 } },
            { description: 'Process Mastery: Develop and document your own technique or approach. Test it across 3+ pieces. Refine based on results.', type: TaskType.Daily, xp: 850, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Strategy, amount: 50 } },
            { description: 'Weekly Recognition: Achieve sales milestone, win craft award, or get featured in publication/gallery. Build reputation.', type: TaskType.Weekly, xp: 3500, statBoost: { stat: StatName.Spirit, subStat: SubStatName.Purpose, amount: 200 } },
        ],
        [ProficiencyLevel.Master]: [
            { description: 'Signature Style: Create a series (3-5 pieces) that establishes your unique artistic voice and technical mastery.', type: TaskType.Daily, xp: 1800, statBoost: { stat: StatName.Creativity, subStat: SubStatName.Vision, amount: 100 } },
            { description: 'Craft Leadership: Teach others (workshops, mentorship, documentation). Elevate emerging craftspeople in your field.', type: TaskType.Daily, xp: 1500, statBoost: { stat: StatName.Spirit, subStat: SubStatName.Purpose, amount: 80 } },
            { description: 'Weekly Legacy: Complete a commission, museum/gallery show, or create work that influences the craft industry.', type: TaskType.Weekly, xp: 6000, statBoost: { stat: StatName.Spirit, subStat: SubStatName.Conviction, amount: 400 } },
        ],
        [ProficiencyLevel.MasterPlus]: [
            { description: 'Industry Innovation: Pioneer new techniques, materials, or styles that advance the entire craft field. Document and share.', type: TaskType.Daily, xp: 2500, statBoost: { stat: StatName.Creativity, subStat: SubStatName.Innovation, amount: 150 } },
            { description: 'Legacy Building: Establish school, publish definitive guide, or create body of work that will outlast you. Build institution.', type: TaskType.Daily, xp: 2000, statBoost: { stat: StatName.Spirit, subStat: SubStatName.Conviction, amount: 120 } },
            { description: 'Weekly Legend Status: Achieve major award, museum acquisition, or become recognized authority in craft world.', type: TaskType.Weekly, xp: 8000, statBoost: { stat: StatName.Spirit, subStat: SubStatName.Purpose, amount: 500 } },
        ]
    },
    'Creative': {
        [ProficiencyLevel.Novice]: [
            { description: 'Daily Studio Time: 30m creative practice (writing, music, art). Complete 1 small work or exploration. No pressure for quality.', type: TaskType.Daily, xp: 100, statBoost: { stat: StatName.Creativity, subStat: SubStatName.Expression, amount: 8 } },
            { description: 'Inspiration Mining: Study 3 works by artists you admire. Document 1 technique, 1 theme, 1 emotion you\'d like to capture.', type: TaskType.Daily, xp: 90, statBoost: { stat: StatName.Creativity, subStat: SubStatName.Imagination, amount: 6 } },
            { description: 'Weekly Piece: Create 1 finished creative work. Record it (audio), photograph it (visual), or finalize it. Share for feedback.', type: TaskType.Weekly, xp: 400, statBoost: { stat: StatName.Creativity, subStat: SubStatName.Style, amount: 30 } },
        ],
        [ProficiencyLevel.NovicePlus]: [
            { description: '45m creative session: Create 2-3 pieces experimenting with different styles. Compare results. Keep best one.', type: TaskType.Daily, xp: 150, statBoost: { stat: StatName.Creativity, subStat: SubStatName.Expression, amount: 10 } },
            { description: 'Technique Practice: Focus on 1 specific skill (perspective, rhythm, dialogue). Complete 5 practice exercises.', type: TaskType.Daily, xp: 130, statBoost: { stat: StatName.Creativity, subStat: SubStatName.Innovation, amount: 8 } },
            { description: 'Weekly Portfolio: Create 2 finished pieces. Compare to earlier work. Document improvement areas.', type: TaskType.Weekly, xp: 600, statBoost: { stat: StatName.Creativity, subStat: SubStatName.Style, amount: 45 } },
        ],
        [ProficiencyLevel.Intermediate]: [
            { description: '60m creative sprint: Compose/write/paint 1 medium-length work. Push emotional depth. Iterate based on self-critique.', type: TaskType.Daily, xp: 280, statBoost: { stat: StatName.Creativity, subStat: SubStatName.Expression, amount: 18 } },
            { description: 'Deconstruction Session: Analyze 1 master work. What makes it resonate? Document story arc, color theory, lyrical density, etc.', type: TaskType.Daily, xp: 240, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Strategy, amount: 15 } },
            { description: 'Weekly Release: Finish a creative piece. Get feedback from 2+ people. Make 1 major revision. Share publicly or perform.', type: TaskType.Weekly, xp: 1000, statBoost: { stat: StatName.Creativity, subStat: SubStatName.Vision, amount: 80 } },
        ],
        [ProficiencyLevel.IntermediatePlus]: [
            { description: '90m creative deep work: Create complex multi-layer work. Focus on emotional resonance and technical execution.', type: TaskType.Daily, xp: 400, statBoost: { stat: StatName.Creativity, subStat: SubStatName.Expression, amount: 25 } },
            { description: 'Style Refinement: Create 3 works in your emerging signature style. Get feedback. Refine based on patterns you notice.', type: TaskType.Daily, xp: 350, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Perception, amount: 20 } },
            { description: 'Weekly Showcase: Participate in competition, exhibition, or publish work. Aim for recognition or measurable engagement.', type: TaskType.Weekly, xp: 1500, statBoost: { stat: StatName.Psyche, subStat: SubStatName.Resilience, amount: 100 } },
        ],
        [ProficiencyLevel.Advanced]: [
            { description: '2-hour intensive creation: Produce advanced work (EP, painting series, screenplay draft). Push thematic/technical boundaries.', type: TaskType.Daily, xp: 700, statBoost: { stat: StatName.Creativity, subStat: SubStatName.Innovation, amount: 45 } },
            { description: 'Experimental Fusion: Blend 2+ creative disciplines or genres. Create hybrid work. Document what you discovered.', type: TaskType.Daily, xp: 600, statBoost: { stat: StatName.Creativity, subStat: SubStatName.Vision, amount: 35 } },
            { description: 'Weekly Impact: Release/exhibit work (album, show, publication). Receive 10+ positive responses or measurable reach.', type: TaskType.Weekly, xp: 2500, statBoost: { stat: StatName.Creativity, subStat: SubStatName.Expression, amount: 150 } },
        ],
        [ProficiencyLevel.AdvancedPlus]: [
            { description: '3-hour creation marathon: Produce signature work pushing boundaries of your medium. Aim for career-best quality.', type: TaskType.Daily, xp: 1000, statBoost: { stat: StatName.Creativity, subStat: SubStatName.Innovation, amount: 60 } },
            { description: 'Artistic Voice: Define your unique perspective/philosophy. Create work that expresses it clearly. Document your approach.', type: TaskType.Daily, xp: 850, statBoost: { stat: StatName.Spirit, subStat: SubStatName.Purpose, amount: 50 } },
            { description: 'Weekly Milestone: Achieve major publication, exhibition, performance, or collaboration. Build professional network.', type: TaskType.Weekly, xp: 3500, statBoost: { stat: StatName.Psyche, subStat: SubStatName.Charisma, amount: 200 } },
        ],
        [ProficiencyLevel.Master]: [
            { description: 'Signature Collection: Create a cohesive body of work (10+ pieces) with distinct voice, theme, and technical mastery.', type: TaskType.Daily, xp: 1800, statBoost: { stat: StatName.Creativity, subStat: SubStatName.Vision, amount: 100 } },
            { description: 'Creative Mentorship: Teach workshops, publish a guide, or mentor emerging artists. Elevate your creative community.', type: TaskType.Daily, xp: 1500, statBoost: { stat: StatName.Spirit, subStat: SubStatName.Purpose, amount: 80 } },
            { description: 'Weekly Recognition: Win awards, sign publishing deals, get major platform feature, or create work with cultural impact.', type: TaskType.Weekly, xp: 6000, statBoost: { stat: StatName.Spirit, subStat: SubStatName.Conviction, amount: 400 } },
        ],
        [ProficiencyLevel.MasterPlus]: [
            { description: 'Cultural Impact: Create works that influence the creative field. Pioneer new styles, genres, or approaches.', type: TaskType.Daily, xp: 2500, statBoost: { stat: StatName.Creativity, subStat: SubStatName.Vision, amount: 150 } },
            { description: 'Institution Building: Establish creative school, movement, or platform. Develop next generation of artists.', type: TaskType.Daily, xp: 2000, statBoost: { stat: StatName.Spirit, subStat: SubStatName.Conviction, amount: 120 } },
            { description: 'Weekly Legend: Achieve major awards, retrospectives, or create work with lasting cultural significance.', type: TaskType.Weekly, xp: 8000, statBoost: { stat: StatName.Spirit, subStat: SubStatName.Purpose, amount: 500 } },
        ]
    },
    'Social': {
        [ProficiencyLevel.Novice]: [
            { description: 'Social Initiation: Have 1 meaningful conversation (15+ min) with someone new. Ask 3 genuine questions. Listen actively.', type: TaskType.Daily, xp: 100, statBoost: { stat: StatName.Psyche, subStat: SubStatName.Charisma, amount: 8 } },
            { description: 'Presence Practice: Attend 1 social event (group meal, meetup, party). Introduce yourself to 2 new people. Stay 90+ minutes.', type: TaskType.Daily, xp: 90, statBoost: { stat: StatName.Psyche, subStat: SubStatName.Expression, amount: 6 } },
            { description: 'Weekly Connection: Organize or facilitate 1 group activity. Invite 3+ people. Create a positive shared experience.', type: TaskType.Weekly, xp: 400, statBoost: { stat: StatName.Psyche, subStat: SubStatName.Empathy, amount: 30 } },
        ],
        [ProficiencyLevel.NovicePlus]: [
            { description: '45m social engagement: Have 2-3 quality conversations. Practice active listening. Ask follow-up questions.', type: TaskType.Daily, xp: 150, statBoost: { stat: StatName.Psyche, subStat: SubStatName.Charisma, amount: 10 } },
            { description: 'Networking: Attend event and collect 3 contacts. Follow up within 48h. Build genuine connections.', type: TaskType.Daily, xp: 130, statBoost: { stat: StatName.Psyche, subStat: SubStatName.Focus, amount: 8 } },
            { description: 'Weekly Leadership: Coordinate group outing or event. Handle logistics. Ensure everyone has good experience.', type: TaskType.Weekly, xp: 600, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Strategy, amount: 45 } },
        ],
        [ProficiencyLevel.Intermediate]: [
            { description: '60m focused social session: Lead a group discussion, host a dinner, or facilitate a workshop. Manage group dynamics.', type: TaskType.Daily, xp: 280, statBoost: { stat: StatName.Psyche, subStat: SubStatName.Charisma, amount: 18 } },
            { description: 'Influence Study: Observe 1 charismatic leader. Document 5 techniques they use. Practice 2 in your next interaction.', type: TaskType.Daily, xp: 240, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Strategy, amount: 15 } },
            { description: 'Weekly Impact: Host or organize something meaningful. Receive positive feedback. Build 1 new meaningful friendship/connection.', type: TaskType.Weekly, xp: 1000, statBoost: { stat: StatName.Psyche, subStat: SubStatName.Expression, amount: 80 } },
        ],
        [ProficiencyLevel.IntermediatePlus]: [
            { description: '90m social leadership: Host dinner party, run workshop, or facilitate group project. Create memorable experience.', type: TaskType.Daily, xp: 400, statBoost: { stat: StatName.Psyche, subStat: SubStatName.Charisma, amount: 25 } },
            { description: 'Influence Practice: Give presentation or lead discussion on topic you care about. Persuade others to your viewpoint.', type: TaskType.Daily, xp: 350, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Reason, amount: 20 } },
            { description: 'Weekly Network Growth: Expand circle by 5+ quality connections. Build relationships that could lead to opportunities.', type: TaskType.Weekly, xp: 1500, statBoost: { stat: StatName.Psyche, subStat: SubStatName.Empathy, amount: 100 } },
        ],
        [ProficiencyLevel.Advanced]: [
            { description: '2-hour leadership session: Moderate a debate, run a major event, or coach someone through a challenge. Drive real outcomes.', type: TaskType.Daily, xp: 700, statBoost: { stat: StatName.Psyche, subStat: SubStatName.Charisma, amount: 45 } },
            { description: 'Conflict Resolution: Navigate a complex group dynamic or interpersonal conflict. Find resolution. Document what you learned.', type: TaskType.Daily, xp: 600, statBoost: { stat: StatName.Psyche, subStat: SubStatName.Empathy, amount: 35 } },
            { description: 'Weekly Authority: Lead a major initiative that affects 10+ people positively. Earn respect and measurable influence.', type: TaskType.Weekly, xp: 2500, statBoost: { stat: StatName.Psyche, subStat: SubStatName.Expression, amount: 150 } },
        ],
        [ProficiencyLevel.AdvancedPlus]: [
            { description: '3-hour social impact: Lead major initiative affecting 20+ people. Navigate complex group dynamics. Deliver results.', type: TaskType.Daily, xp: 1000, statBoost: { stat: StatName.Psyche, subStat: SubStatName.Charisma, amount: 60 } },
            { description: 'Strategic Networking: Build relationships with influential people. Create mutually beneficial collaborations.', type: TaskType.Daily, xp: 850, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Strategy, amount: 50 } },
            { description: 'Weekly Authority Building: Establish yourself as go-to person in community/field. Earn respect and influence.', type: TaskType.Weekly, xp: 3500, statBoost: { stat: StatName.Spirit, subStat: SubStatName.Purpose, amount: 200 } },
        ],
        [ProficiencyLevel.Master]: [
            { description: 'Movement Building: Create a community or movement around shared values. Attract 20+ committed members. Establish culture.', type: TaskType.Daily, xp: 1800, statBoost: { stat: StatName.Psyche, subStat: SubStatName.Conviction, amount: 100 } },
            { description: 'Legacy Influence: Mentor future leaders. Publish thought leadership. Change organizational/community culture fundamentally.', type: TaskType.Daily, xp: 1500, statBoost: { stat: StatName.Spirit, subStat: SubStatName.Purpose, amount: 80 } },
            { description: 'Weekly Elevation: Host events/initiatives that attract influential people. Build strategic alliances. Shape industry/field discourse.', type: TaskType.Weekly, xp: 6000, statBoost: { stat: StatName.Spirit, subStat: SubStatName.Conviction, amount: 400 } },
        ],
        [ProficiencyLevel.MasterPlus]: [
            { description: 'Movement Leadership: Build lasting organization or community. Shape culture and values at scale (100+ people).', type: TaskType.Daily, xp: 2500, statBoost: { stat: StatName.Psyche, subStat: SubStatName.Conviction, amount: 150 } },
            { description: 'Legacy Influence: Change industry/field through thought leadership, policy, or institutional power. Create systemic impact.', type: TaskType.Daily, xp: 2000, statBoost: { stat: StatName.Spirit, subStat: SubStatName.Conviction, amount: 120 } },
            { description: 'Weekly Power: Host events attracting top influencers. Build alliances that shape discourse. Achieve legendary status.', type: TaskType.Weekly, xp: 8000, statBoost: { stat: StatName.Spirit, subStat: SubStatName.Purpose, amount: 500 } },
        ]
    },
    'Survival': {
        [ProficiencyLevel.Novice]: [
            { description: 'Resilience Training: 30m physical hardship (cold exposure, fasting, heat, etc). Document how you felt before/after.', type: TaskType.Daily, xp: 100, statBoost: { stat: StatName.Vitality, subStat: SubStatName.Resilience, amount: 8 } },
            { description: 'Knowledge Acquisition: Study 1 survival skill (knot-tying, navigation, first aid basics). Teach it to someone or demonstrate.', type: TaskType.Daily, xp: 90, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Knowledge, amount: 6 } },
            { description: 'Weekly Challenge: Complete 1 survival scenario (overnight hike, build shelter, extended fast). Document learnings.', type: TaskType.Weekly, xp: 400, statBoost: { stat: StatName.Vitality, subStat: SubStatName.Adherence, amount: 30 } },
        ],
        [ProficiencyLevel.NovicePlus]: [
            { description: '45m hardship training: Extended cold shower, longer fast, or heat exposure. Push beyond comfort zone.', type: TaskType.Daily, xp: 150, statBoost: { stat: StatName.Vitality, subStat: SubStatName.Resilience, amount: 10 } },
            { description: 'Skill Building: Practice 2 complementary survival skills. Create emergency kit. Test gear in field.', type: TaskType.Daily, xp: 130, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Adaptability, amount: 8 } },
            { description: 'Weekly Challenge: 48h camping trip. Build shelter, make fire, navigate. Document what you learned.', type: TaskType.Weekly, xp: 600, statBoost: { stat: StatName.Vitality, subStat: SubStatName.Endurance, amount: 45 } },
        ],
        [ProficiencyLevel.Intermediate]: [
            { description: '60m intense survival drill: Multi-skill challenge (navigation + shelter + fire). Perform under stress. Time yourself.', type: TaskType.Daily, xp: 280, statBoost: { stat: StatName.Vitality, subStat: SubStatName.Endurance, amount: 18 } },
            { description: 'Tactical Planning: Develop a detailed survival plan for a realistic scenario. Include contingencies. Refine 3x.', type: TaskType.Daily, xp: 240, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Strategy, amount: 15 } },
            { description: 'Weekly Expedition: 24h+ outdoor immersion (camping, hiking, multi-day trek). Navigate without GPS. Forage/build as needed.', type: TaskType.Weekly, xp: 1000, statBoost: { stat: StatName.Vitality, subStat: SubStatName.Longevity, amount: 80 } },
        ],
        [ProficiencyLevel.IntermediatePlus]: [
            { description: '90m multi-skill survival: Combine navigation, shelter, fire, and food procurement. Simulate emergency scenario.', type: TaskType.Daily, xp: 400, statBoost: { stat: StatName.Vitality, subStat: SubStatName.Endurance, amount: 25 } },
            { description: 'Advanced Techniques: Master complex skills (tracking, advanced first aid, weather prediction). Teach someone else.', type: TaskType.Daily, xp: 350, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Knowledge, amount: 20 } },
            { description: 'Weekly Expedition: 3-4 day wilderness trip. Minimal gear. Navigate challenges independently. Push limits.', type: TaskType.Weekly, xp: 1500, statBoost: { stat: StatName.Psyche, subStat: SubStatName.Resilience, amount: 100 } },
        ],
        [ProficiencyLevel.Advanced]: [
            { description: '2-hour extreme challenge: Multi-day expedition or intense environmental test. Navigate real danger. Track vitals/performance.', type: TaskType.Daily, xp: 700, statBoost: { stat: StatName.Vitality, subStat: SubStatName.Endurance, amount: 45 } },
            { description: 'Mastery Demonstration: Teach an advanced survival skill to group. Lead a challenging outdoor expedition. Ensure everyone excels.', type: TaskType.Daily, xp: 600, statBoost: { stat: StatName.Spirit, subStat: SubStatName.Purpose, amount: 35 } },
            { description: 'Weekly Authority: Lead a 3-5 day wilderness expedition for others. Navigate challenges. Build group confidence and capability.', type: TaskType.Weekly, xp: 2500, statBoost: { stat: StatName.Vitality, subStat: SubStatName.Resilience, amount: 150 } },
        ],
        [ProficiencyLevel.AdvancedPlus]: [
            { description: '3-hour extreme test: Multi-day expedition in harsh conditions. Navigate real danger. Document performance metrics.', type: TaskType.Daily, xp: 1000, statBoost: { stat: StatName.Vitality, subStat: SubStatName.Endurance, amount: 60 } },
            { description: 'Expert Instruction: Lead advanced survival course. Teach complex skills to experienced practitioners.', type: TaskType.Daily, xp: 850, statBoost: { stat: StatName.Spirit, subStat: SubStatName.Purpose, amount: 50 } },
            { description: 'Weekly Mastery: Complete week-long expedition in extreme environment. Lead team. Ensure safety and growth.', type: TaskType.Weekly, xp: 3500, statBoost: { stat: StatName.Vitality, subStat: SubStatName.Longevity, amount: 200 } },
        ],
        [ProficiencyLevel.Master]: [
            { description: 'Extreme Expedition: Lead a major expedition (2+ weeks) in extreme environment. Document discoveries. Push human limits.', type: TaskType.Daily, xp: 1800, statBoost: { stat: StatName.Vitality, subStat: SubStatName.Longevity, amount: 100 } },
            { description: 'Legacy Building: Establish survival training program or wilderness conservation initiative. Train future guides/leaders.', type: TaskType.Daily, xp: 1500, statBoost: { stat: StatName.Spirit, subStat: SubStatName.Purpose, amount: 80 } },
            { description: 'Weekly Recognition: Achieve public expedition feat, publish survival research, or establish yourself as leading wilderness authority.', type: TaskType.Weekly, xp: 6000, statBoost: { stat: StatName.Spirit, subStat: SubStatName.Conviction, amount: 400 } },
        ],
        [ProficiencyLevel.MasterPlus]: [
            { description: 'Legendary Expedition: Lead month+ expedition in most extreme environments. Push boundaries of human endurance.', type: TaskType.Daily, xp: 2500, statBoost: { stat: StatName.Vitality, subStat: SubStatName.Longevity, amount: 150 } },
            { description: 'Institution Creation: Establish survival training organization or conservation program. Train future wilderness leaders.', type: TaskType.Daily, xp: 2000, statBoost: { stat: StatName.Spirit, subStat: SubStatName.Conviction, amount: 120 } },
            { description: 'Weekly Recognition: Achieve historic expedition feats, publish survival research, establish yourself as world authority.', type: TaskType.Weekly, xp: 8000, statBoost: { stat: StatName.Spirit, subStat: SubStatName.Purpose, amount: 500 } },
        ]
    }
};

const DEFAULT_TASKS: Record<ProficiencyLevel, PresetTask[]> = {
    [ProficiencyLevel.Novice]: [
        { description: '20m focused practice on fundamentals. Document 3 key learnings in a log.', type: TaskType.Daily, xp: 100, statBoost: { stat: StatName.Vitality, subStat: SubStatName.Adherence, amount: 5 } },
        { description: 'Skill Drill: Complete 25 repetitions of a core mechanical movement or exercise. Track accuracy/speed.', type: TaskType.Daily, xp: 80, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Knowledge, amount: 4 } },
        { description: 'Weekly Review: Analyze your logs from the past 7 days. Identify 2 patterns and 1 improvement area.', type: TaskType.Weekly, xp: 300, statBoost: { stat: StatName.Psyche, subStat: SubStatName.Focus, amount: 20 } },
    ],
    [ProficiencyLevel.NovicePlus]: [
        { description: '30m focused practice expanding on fundamentals. Try 2-3 variations. Document which works best.', type: TaskType.Daily, xp: 150, statBoost: { stat: StatName.Vitality, subStat: SubStatName.Adherence, amount: 8 } },
        { description: 'Skill Progression: Complete 50 reps of core movement with focus on form improvement. Video record for analysis.', type: TaskType.Daily, xp: 120, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Adaptability, amount: 6 } },
        { description: 'Weekly Analysis: Compare current week to previous. Identify 1 major improvement and 1 persistent weakness.', type: TaskType.Weekly, xp: 450, statBoost: { stat: StatName.Psyche, subStat: SubStatName.Focus, amount: 30 } },
    ],
    [ProficiencyLevel.Intermediate]: [
        { description: '40m intensive practice on your identified weak point. Push form to 90% technical perfection. Record session.', type: TaskType.Daily, xp: 250, statBoost: { stat: StatName.Psyche, subStat: SubStatName.Focus, amount: 15 } },
        { description: 'Expert Reverse Engineering: Study 1 expert work. Document 3-5 specific techniques they use that you can replicate.', type: TaskType.Daily, xp: 200, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Strategy, amount: 12 } },
        { description: 'Weekly Mastery Block: 2-hour uninterrupted practice focused on velocity and refinement. Video yourself for review.', type: TaskType.Weekly, xp: 800, statBoost: { stat: StatName.Psyche, subStat: SubStatName.Willpower, amount: 60 } },
    ],
    [ProficiencyLevel.IntermediatePlus]: [
        { description: '60m deliberate practice on identified weakness. Push to 95% technical perfection. Log progress metrics.', type: TaskType.Daily, xp: 350, statBoost: { stat: StatName.Psyche, subStat: SubStatName.Focus, amount: 20 } },
        { description: 'Advanced Study: Analyze expert work in detail. Replicate 5 specific techniques. Document success rate.', type: TaskType.Daily, xp: 300, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Strategy, amount: 15 } },
        { description: 'Weekly Deep Dive: 3-hour practice block. Combine speed and precision. Review video analysis.', type: TaskType.Weekly, xp: 1200, statBoost: { stat: StatName.Psyche, subStat: SubStatName.Willpower, amount: 80 } },
    ],
    [ProficiencyLevel.Advanced]: [
        { description: '2-hour advanced application session. Tackle 3-5 complex problems or scenarios in your domain. Document approach.', type: TaskType.Daily, xp: 600, statBoost: { stat: StatName.Psyche, subStat: SubStatName.Willpower, amount: 35 } },
        { description: 'Efficiency Breakthrough: Isolate a 1-2% friction point in your workflow. Test and implement a solution. Log results.', type: TaskType.Daily, xp: 500, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Perception, amount: 30 } },
        { description: 'Weekly Output: Complete and finalize a finished piece of work. Share it for feedback or publish it publicly.', type: TaskType.Weekly, xp: 2000, statBoost: { stat: StatName.Creativity, subStat: SubStatName.Expression, amount: 120 } },
    ],
    [ProficiencyLevel.AdvancedPlus]: [
        { description: '3-hour mastery session: Tackle complex challenges requiring multiple advanced techniques. Push creative limits.', type: TaskType.Daily, xp: 850, statBoost: { stat: StatName.Psyche, subStat: SubStatName.Willpower, amount: 50 } },
        { description: 'System Optimization: Identify and eliminate 3-5% inefficiency in approach. Test new methods. Measure results.', type: TaskType.Daily, xp: 700, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Perception, amount: 40 } },
        { description: 'Weekly Showcase: Complete polished work for public review. Incorporate feedback. Publish or present.', type: TaskType.Weekly, xp: 2800, statBoost: { stat: StatName.Creativity, subStat: SubStatName.Expression, amount: 160 } },
    ],
    [ProficiencyLevel.Master]: [
        { description: 'Apex Performance: Submit competitive work, enter a public showcase, or demonstrate mastery in a live setting.', type: TaskType.Daily, xp: 1500, statBoost: { stat: StatName.Spirit, subStat: SubStatName.Purpose, amount: 80 } },
        { description: 'Excellence Redefinition: Document your evolving standards for "mastery" and implement 2 new excellence criteria.', type: TaskType.Daily, xp: 1200, statBoost: { stat: StatName.Creativity, subStat: SubStatName.Vision, amount: 60 } },
        { description: 'Weekly Legacy Building: Create a guide, tutorial, or mentorship that helps others accelerate in this domain.', type: TaskType.Weekly, xp: 5000, statBoost: { stat: StatName.Spirit, subStat: SubStatName.Conviction, amount: 350 } },
    ],
    [ProficiencyLevel.MasterPlus]: [
        { description: 'Peak Performance: Compete at highest level, submit breakthrough work, or demonstrate world-class mastery publicly.', type: TaskType.Daily, xp: 2000, statBoost: { stat: StatName.Spirit, subStat: SubStatName.Purpose, amount: 100 } },
        { description: 'Innovation Leadership: Push boundaries of what\'s possible in domain. Document new approaches. Share discoveries.', type: TaskType.Daily, xp: 1600, statBoost: { stat: StatName.Creativity, subStat: SubStatName.Vision, amount: 80 } },
        { description: 'Weekly Legacy: Create comprehensive resources, mentor multiple proteges, or achieve historic recognition in field.', type: TaskType.Weekly, xp: 6500, statBoost: { stat: StatName.Spirit, subStat: SubStatName.Conviction, amount: 450 } },
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
