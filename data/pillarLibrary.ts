
import { StatName, SubStatName, Task, TaskType } from '../types';

export interface PillarOption extends Omit<Task, 'id' | 'isCompleted' | 'lastCompleted'> {
    category: string;
}

export const PILLAR_LIBRARY: PillarOption[] = [
    // --- Mental / Psychological ---
    { description: 'Wake at fixed time (±30m)', type: TaskType.Daily, xp: 50, statBoost: { stat: StatName.Psyche, subStat: SubStatName.Willpower, amount: 5 }, category: 'Mental', isNonNegotiable: true },
    { description: 'No phone 1st 60 mins', type: TaskType.Daily, xp: 60, statBoost: { stat: StatName.Psyche, subStat: SubStatName.Focus, amount: 6 }, category: 'Mental', isNonNegotiable: true },
    { description: 'Journal 3 sentences', type: TaskType.Daily, xp: 40, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Reason, amount: 4 }, category: 'Mental', isNonNegotiable: true },
    { description: '5m silence/reflection', type: TaskType.Daily, xp: 40, statBoost: { stat: StatName.Spirit, subStat: SubStatName.Tranquility, amount: 4 }, category: 'Mental', isNonNegotiable: true },
    { description: 'Zero doomscroll bed', type: TaskType.Daily, xp: 70, statBoost: { stat: StatName.Psyche, subStat: SubStatName.Willpower, amount: 7 }, category: 'Mental', isNonNegotiable: true },

    // --- Spiritual / Values ---
    { description: 'Morning & Night Prayer', type: TaskType.Daily, xp: 80, statBoost: { stat: StatName.Spirit, subStat: SubStatName.Faith, amount: 8 }, category: 'Spiritual', isNonNegotiable: true },
    { description: 'Daily Act of Gratitude', type: TaskType.Daily, xp: 40, statBoost: { stat: StatName.Spirit, subStat: SubStatName.Purpose, amount: 4 }, category: 'Spiritual', isNonNegotiable: true },
    { description: 'Read 1 Verse/Passage', type: TaskType.Daily, xp: 30, statBoost: { stat: StatName.Spirit, subStat: SubStatName.Conviction, amount: 3 }, category: 'Spiritual', isNonNegotiable: true },

    // --- Physical / Health ---
    { description: 'Consume 2–3L water', type: TaskType.Daily, xp: 40, statBoost: { stat: StatName.Vitality, subStat: SubStatName.Balance, amount: 4 }, category: 'Physical', isNonNegotiable: true },
    { description: 'Walk 8k–10k steps', type: TaskType.Daily, xp: 60, statBoost: { stat: StatName.Physical, subStat: SubStatName.Stamina, amount: 6 }, category: 'Physical', isNonNegotiable: true },
    { description: 'Stretch for 5 minutes', type: TaskType.Daily, xp: 30, statBoost: { stat: StatName.Physical, subStat: SubStatName.Agility, amount: 3 }, category: 'Physical', isNonNegotiable: true },
    { description: 'Cold Shower/Rinse', type: TaskType.Daily, xp: 50, statBoost: { stat: StatName.Vitality, subStat: SubStatName.Regeneration, amount: 5 }, category: 'Physical', isNonNegotiable: true },

    // --- Discipline / Structure ---
    { description: 'Make your bed', type: TaskType.Daily, xp: 20, statBoost: { stat: StatName.Psyche, subStat: SubStatName.Willpower, amount: 2 }, category: 'Discipline', isNonNegotiable: true },
    { description: 'Clear your workspace', type: TaskType.Daily, xp: 30, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Focus, amount: 3 }, category: 'Discipline', isNonNegotiable: true },
    { description: 'One uncomfy action', type: TaskType.Daily, xp: 80, statBoost: { stat: StatName.Psyche, subStat: SubStatName.Resilience, amount: 8 }, category: 'Discipline', isNonNegotiable: true },

    // --- Digital Hygiene ---
    { description: 'No phone in bed', type: TaskType.Daily, xp: 60, statBoost: { stat: StatName.Psyche, subStat: SubStatName.Willpower, amount: 6 }, category: 'Digital', isNonNegotiable: true },
    { description: 'Inbox zero/Review', type: TaskType.Daily, xp: 40, statBoost: { stat: StatName.Intelligence, subStat: SubStatName.Strategy, amount: 4 }, category: 'Digital', isNonNegotiable: true },

    // --- Character & Identity ---
    { description: 'Keep your word', type: TaskType.Daily, xp: 100, statBoost: { stat: StatName.Spirit, subStat: SubStatName.Conviction, amount: 10 }, category: 'Character', isNonNegotiable: true },
    { description: 'Show up on time', type: TaskType.Daily, xp: 50, statBoost: { stat: StatName.Psyche, subStat: SubStatName.Charisma, amount: 5 }, category: 'Character', isNonNegotiable: true },
];
