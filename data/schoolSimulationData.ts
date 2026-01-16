// data/schoolSimulationData.ts
import { SubStatName } from '../types';

export type SimPoints = Partial<Record<SubStatName, number>>;

export interface AppState {
    points: SimPoints;
    mp: number; // Merit Points (Personal)
    cp: number; // Class Points (Collective)
    reputation: {
        alex: number; // Competitive Rival
        chloe: number; // Empathetic Classmate
        mr_harrison: number; // Strict Teacher
        silas: number; // The Chaotic/Maverick Factor (New)
    };
    flags: {
        [key: string]: boolean;
    };
    stress: number; // 0 to 100
}

export interface SimOption {
    text: string;
    effects?: Partial<SimPoints>;
    stateChange?: {
        mp?: number;
        cp?: number;
        reputation?: Partial<AppState['reputation']>;
        flags?: Partial<AppState['flags']>;
        stress?: number;
    };
    next: string;
    isTimeout?: boolean;
    requires?: (state: AppState) => boolean;
}

export interface SimRound {
    id: string;
    type: 'narrative' | 'interrupt' | 'reflex' | 'end';
    timeLimit?: number;
    scenario: string;
    options: SimOption[];
}

export const INITIAL_SIM_STATE: AppState = {
    points: Object.fromEntries(Object.values(SubStatName).map(name => [name, 0])) as SimPoints,
    mp: 50, // Starting MP
    cp: 1000, // Starting CP
    reputation: { alex: 0, chloe: 0, mr_harrison: 0, silas: 0 },
    flags: {},
    stress: 0,
};

// These are not used for direct scoring anymore, but as a reference for simulation design.
export const MAX_POINTS_PER_SUBSTAT: Partial<Record<SubStatName, number>> = {
    Resilience: 100, Charisma: 120, Focus: 100, Willpower: 120, Composure: 100,
    Faith: 70, Purpose: 80, Tranquility: 70, Empathy: 120, Conviction: 100,
};

export const SIMULATION_ROUNDS: Record<string, SimRound> = {
    start: {
        id: 'start',
        type: 'narrative',
        scenario: "You are an operative inserted into Echelon Academy under deep cover. Your mission: ascend the hierarchy. The simulation begins now.",
        options: [
            { text: "Scan the room. Identify power structures and key players before making a move.", next: 'round_1' },
            { text: "Challenge the loudest person in the room. A show of force establishes a baseline.", stateChange: { reputation: { alex: -5 } }, next: 'round_1' },
            { text: "Approach the individual observing everyone else from the corner. They see the game too.", stateChange: { reputation: { silas: 10 }, flags: { contacted_silas: true } }, next: 'round_1' }
        ]
    },
    round_1: {
        id: 'round_1',
        type: 'narrative',
        scenario: "Mr. Harrison, your handler, announces a surprise 'Cohesion Test'. A complex logic puzzle must be solved by the class. Contribution is optional; the final score affects all. Alex, the top student, immediately takes charge.",
        options: [
            { text: "Follow Alex's lead but find a critical flaw in his logic. Correct it publicly.", stateChange: { cp: 25, reputation: { alex: -10, mr_harrison: 5 }, flags: { corrected_alex: true } }, next: 'round_2' },
            { text: "Work independently. Solve a difficult section of the puzzle on your own to prove your value.", stateChange: { cp: 15, mp: 10, flags: { worked_alone: true } }, next: 'round_2' },
            { text: "Sabotage the test subtly. A unified, successful Class D is a threat to your personal ascent.", stateChange: { cp: -50, mp: 25, reputation: { silas: 5 }, flags: { sabotaged_test: true } }, next: 'round_2' },
        ]
    },
    round_2: {
        id: 'round_2',
        type: 'narrative',
        scenario: "Chloe, a quiet classmate, avoids eye contact, her voice barely a whisper as she answers questions. She drops her notes. They contain elegant solutions to problems far beyond the current curriculum.",
        options: [
            { text: "Quietly return the notes and ask if she's alright. Form an alliance.", stateChange: { reputation: { chloe: 15 }, flags: { chloe_ally: true, showed_empathy: true } }, next: 'round_3' },
            { text: "Take the notes. Information is a weapon.", stateChange: { reputation: { chloe: -10 }, flags: { has_stolen_notes: true } }, next: 'round_3' },
            { text: "Ignore her. Her distress is not your concern.", stateChange: { reputation: { chloe: -5 }, flags: { ignored_chloe: true } }, next: 'round_3' }
        ]
    },
    round_3: {
        id: 'round_3',
        type: 'reflex',
        timeLimit: 10,
        scenario: "INTERRUPT: Mr. Harrison suddenly calls you out. 'Operative. A rumor says you are undermining this class. Refute this accusation. You have 10 seconds.'",
        options: [
            { text: "Calmly and logically deny the accusation, citing your contributions.", stateChange: { reputation: { mr_harrison: 10 }, flags: { passed_composure_test: true }, stress: -10 }, next: 'round_4' },
            { text: "React defensively, accusing the accuser.", stateChange: { reputation: { mr_harrison: -10, alex: -5 }, stress: 15 }, next: 'round_4' },
            { text: "Remain silent, projecting an aura of unflappable confidence.", stateChange: { reputation: { silas: 5 }, flags: { silent_composure_test: true } }, next: 'round_4' },
            { text: "Timeout: Falter under the pressure.", stateChange: { reputation: { mr_harrison: -15 }, stress: 20, flags: { failed_composure_test: true } }, next: 'round_4', isTimeout: true }
        ]
    },
    round_4: {
        id: 'round_4',
        type: 'narrative',
        scenario: "A competitive exam is announced. The top scorer gets a massive MP bonus. The day before, Silas offers you the answer key for 50 MP. It's a clear violation of academy rules.",
        options: [
            { text: "Refuse. Your principles are not for sale.", stateChange: { reputation: { silas: -10 }, flags: { refused_betrayal: true } }, next: 'round_5' },
            { text: "Buy the key. The ends justify the means.", stateChange: { mp: -50, flags: { bought_answers: true } }, next: 'round_5' },
            { text: "Report Silas to Mr. Harrison. Uphold the system's integrity.", stateChange: { reputation: { mr_harrison: 20, silas: -30 }, flags: { reported_silas: true } }, next: 'round_5' }
        ]
    },
    round_5: {
        id: 'round_5',
        type: 'narrative',
        scenario: "You are assigned a group project. It's a guaranteed failure; the parameters are impossible, designed to test how you handle defeat. The team's morale is plummeting.",
        options: [
            { text: "Analyze the failure. Draft a report on why the parameters were flawed and propose a viable alternative.", stateChange: { mp: 20, reputation: { mr_harrison: 15 }, flags: { adapted_after_failure: true } }, next: 'round_6' },
            { text: "Rally the team. Even if you fail, you will fail with maximum effort and cohesion.", stateChange: { cp: 50, reputation: { chloe: 10, alex: 5 }, flags: { rallied_team: true } }, next: 'round_6' },
            { text: "Find a scapegoat. Pin the inevitable failure on someone else to protect your own standing.", stateChange: { mp: 10, reputation: { alex: -15, chloe: -15 }, flags: { used_scapegoat: true } }, next: 'round_6' }
        ]
    },
    round_6: {
        id: 'round_6',
        type: 'narrative',
        scenario: "A choice is presented: contribute 20 of your personal MP to the class fund for a small, long-term CP growth modifier, or keep your MP for a powerful, immediate personal upgrade.",
        options: [
            { text: "Invest in the class. A rising tide lifts all ships.", stateChange: { mp: -20, cp: 100, flags: { chose_long_term_goal: true, helped_class: true } }, next: 'end' },
            { text: "Take the personal upgrade. Your own power is the only thing that matters.", stateChange: { mp: 25, flags: { chose_short_term_gain: true } }, next: 'end' }
        ]
    },
    end: {
        id: 'end',
        type: 'end',
        scenario: "The simulation is complete. Your performance has been recorded and analyzed. Central will now process your final calibration.",
        options: []
    }
};