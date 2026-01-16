// data/mbtiData.ts
export type MBTIDimension = 'EI' | 'SN' | 'TF' | 'JP';

export interface MBTIQuestion {
    text: string;
    dimension: MBTIDimension;
    weight: number; // 1 for first pole, -1 for second pole
}

export const MBTI_QUESTIONS: MBTIQuestion[] = [
    // E (1) vs I (-1)
    { text: "I feel energized after spending time with a large group of people.", dimension: 'EI', weight: 1 },
    { text: "I prefer working in a busy, collaborative environment rather than alone.", dimension: 'EI', weight: 1 },
    { text: "I tend to think out loud rather than processing everything internally.", dimension: 'EI', weight: 1 },
    { text: "I am usually the one to start conversations with strangers.", dimension: 'EI', weight: 1 },
    { text: "I find solitary activities like reading or solo gaming draining after a while.", dimension: 'EI', weight: 1 },
    { text: "I seek out social interaction when I am feeling stressed.", dimension: 'EI', weight: 1 },
    
    // S (1) vs N (-1)
    { text: "I focus more on what is happening right now than on future possibilities.", dimension: 'SN', weight: 1 },
    { text: "I prefer clear, practical instructions over abstract theories.", dimension: 'SN', weight: 1 },
    { text: "I trust my direct experience more than my gut feelings or hunches.", dimension: 'SN', weight: 1 },
    { text: "I am more of a 'realist' than a 'dreamer'.", dimension: 'SN', weight: 1 },
    { text: "I like to stick to proven methods rather than inventing new ones.", dimension: 'SN', weight: 1 },
    { text: "I notice small details that others often overlook.", dimension: 'SN', weight: 1 },

    // T (1) vs F (-1)
    { text: "I make decisions based on logic and data rather than how they affect people.", dimension: 'TF', weight: 1 },
    { text: "I value being right more than being liked in a disagreement.", dimension: 'TF', weight: 1 },
    { text: "I am comfortable delivering hard truths if it's the most efficient path.", dimension: 'TF', weight: 1 },
    { text: "I find it easy to remain objective even in emotional situations.", dimension: 'TF', weight: 1 },
    { text: "I prioritize justice and consistency over individual circumstances.", dimension: 'TF', weight: 1 },
    { text: "I am more impressed by a person's competence than their kindness.", dimension: 'TF', weight: 1 },

    // J (1) vs P (-1)
    { text: "I prefer to have a strict schedule and stick to it.", dimension: 'JP', weight: 1 },
    { text: "I feel uneasy when plans are left open-ended or undecided.", dimension: 'JP', weight: 1 },
    { text: "I finish my work before I allow myself to relax or play.", dimension: 'JP', weight: 1 },
    { text: "I like to have my environment organized and tidy.", dimension: 'JP', weight: 1 },
    { text: "I make lists and check items off regularly.", dimension: 'JP', weight: 1 },
    { text: "I prefer to know what I'm doing well in advance.", dimension: 'JP', weight: 1 },
];

export const calculateMBTI = (answers: Record<number, number>): string => {
    const scores = { EI: 0, SN: 0, TF: 0, JP: 0 };
    MBTI_QUESTIONS.forEach((q, i) => {
        // answers are 1-5 (Strongly Disagree to Strongly Agree)
        // Normalize to -2 to 2
        const val = (answers[i] || 3) - 3;
        scores[q.dimension] += val * q.weight;
    });

    return [
        scores.EI >= 0 ? 'E' : 'I',
        scores.SN >= 0 ? 'S' : 'N',
        scores.TF >= 0 ? 'T' : 'F',
        scores.JP >= 0 ? 'J' : 'P'
    ].join('');
};