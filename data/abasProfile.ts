// data/abasProfile.ts
/**
 * Abas - Test/Demo User Profile
 * 
 * Created with alignment-based stat adjustments and screening test data.
 * Abas serves as an exemplary profile for testing and demonstration purposes.
 */

import { AlignmentScores } from '../types';

export interface AbasProfile {
    username: string;
    email: string;
    dateOfBirth?: string;
    age?: number;
    gender?: string;
    mbti?: string;
    talents?: string[];
    hobbies?: Array<{ name: string; proficiency: string }>;
    alignment: AlignmentScores;
    screeningTestSummary?: {
        physicalBaseline: Record<string, number>;
        mentalBaseline: Record<string, number>;
        socialBaseline: Record<string, number>;
        spiritualBaseline: Record<string, number>;
    };
    talentClass?: string;
    obsessionLevel?: string;
    codename?: string;
}

/**
 * Abas Profile Configuration
 * 
 * Alignment Story:
 * - Lawful Neutral: Prefers order and structure, follows rules, but pursues neutral goals
 * - Values: Discipline, consistency, self-improvement within established frameworks
 * - Weakness: May be inflexible; struggles with spontaneity or rule-breaking for good
 * 
 * This alignment grants:
 * - HIGH Willpower (+80), Focus (+80), Composure (+25)
 * - BALANCED Empathy, Faith (neither boosted nor reduced)
 * - NEUTRAL Resilience, Tranquility
 */
export const ABAS_PROFILE: AbasProfile = {
    username: 'Abas',
    email: 'abas.genesis@protocol.test',
    dateOfBirth: '1996/05/15',
    age: 29,
    gender: 'Male',
    mbti: 'ISTJ',
    talents: ['Systematic Analysis', 'Physical Discipline', 'Strategic Planning'],
    hobbies: [
        { name: 'Weightlifting', proficiency: 'Advanced' },
        { name: 'Chess', proficiency: 'Intermediate' },
        { name: 'Technical Writing', proficiency: 'Advanced' },
        { name: 'Programming', proficiency: 'Intermediate' }
    ],
    alignment: {
        lawfulChaotic: -60, // Lawful (toward order and structure)
        goodEvil: 0, // Neutral (neither altruistic nor selfish)
        profile: 'Lawful Neutral'
    },
    screeningTestSummary: {
        physicalBaseline: {
            benchPress1RM: 275, // lbs
            squat1RM: 365,
            deadlift1RM: 405,
            benchPressReps: 315, // 5 reps
            pullups: 12,
            fortyYardDash: 4.9, // seconds
            verticalJump: 28, // inches
            flexibility: 68 // percentile
        },
        mentalBaseline: {
            chessRating: 1650,
            logicPuzzlesCompletedCorrectly: 18,
            logicPuzzlesAccuracyPercent: 90,
            verbalIQ: 125,
            analyticalIQ: 128,
            spacialIQ: 118
        },
        socialBaseline: {
            conversationInitiations: 3, // per week
            leadershipScores: 72,
            empathyScore: 68,
            charismaScore: 65,
            networkSize: 12 // close connections
        },
        spiritualBaseline: {
            willpowerScore: 85, // Lawful alignment boost
            focusScore: 82,
            resilience: 76,
            purposeScore: 71,
            faithScore: 60 // Neutral, no alignment boost
        }
    },
    talentClass: 'Talented Learner',
    obsessionLevel: 'Locked-In',
    codename: 'SENTINEL'
};

/**
 * Abas's initial stat baselines (before alignment modifiers)
 * Based on screening test and MBTI profile
 */
export const ABAS_INITIAL_STAT_BASELINES = {
    Physical: 420,
    Vitality: 385,
    Intelligence: 410,
    Creativity: 330,
    Spirit: 390,
    Psyche: 415
};

/**
 * Description of Abas's profile
 */
export const ABAS_DESCRIPTION = `
OPERATIVE DESIGNATION: Abas
STATUS: Full Clearance - Profile Complete

PROFILE SUMMARY:
Abas is a Lawful Neutral operative with an ISTJ temperament. Systematically disciplined, 
with strong analytical and physical capabilities. Excels in structured environments and 
long-term planning. Primary strength in willpower and focus; slight weakness in spontaneity 
and emotional expression.

ALIGNMENT: Lawful Neutral
• Favors order, structure, and predictable systems
• Self-directed within rule-based frameworks
• Not motivated by altruism or self-interest exclusively; pragmatic
• Stat Impact: Excellent Willpower (+80), Focus (+80), Composure (+25)

TALENT: Talented Learner | OBSESSION: Locked-In
CODENAME: SENTINEL
MBTI: ISTJ (The Logistician)

KEY METRICS:
• Bench Press 1RM: 275 lbs
• Chess Rating: 1650 (Intermediate)
• Verbal IQ: 125 | Analytical IQ: 128
• Willpower: 85 | Focus: 82 | Resilience: 76

ARCHETYPE: The Disciplined Ascetic
A methodical operator who achieves mastery through consistency and systematic effort.
`;
