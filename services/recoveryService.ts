// services/recoveryService.ts
import { Stat, Task } from '../types';

export interface RecoveryTask {
    id: string;
    title: string;
    description: string;
    duration: number; // minutes
    xpReward: number;
    difficulty: 'easy' | 'medium' | 'hard';
    affectedStats: string[];
}

export interface RecoveryOpportunity {
    availableTasks: RecoveryTask[];
    recoveryWindow: number; // minutes remaining
    totalRecoveryPotential: number; // total XP recoverable
    urgency: 'low' | 'medium' | 'critical';
}

const QUICK_RECOVERY_TASKS: RecoveryTask[] = [
    {
        id: 'quick-listen-5',
        title: 'Quick Listen',
        description: 'Listen to 5 mins of immersion content',
        duration: 5,
        xpReward: 50,
        difficulty: 'easy',
        affectedStats: ['Listening']
    },
    {
        id: 'vocab-drill-5',
        title: 'Vocab Sprint',
        description: 'Rapid vocabulary review (5 mins)',
        duration: 5,
        xpReward: 45,
        difficulty: 'easy',
        affectedStats: ['Vocabulary']
    },
    {
        id: 'reading-quick-10',
        title: 'Speed Read',
        description: 'Read 10 minutes of simple content',
        duration: 10,
        xpReward: 80,
        difficulty: 'medium',
        affectedStats: ['Reading']
    },
    {
        id: 'speaking-drill-5',
        title: 'Speak Out',
        description: 'Practice speaking for 5 minutes',
        duration: 5,
        xpReward: 60,
        difficulty: 'medium',
        affectedStats: ['Speaking']
    },
    {
        id: 'culture-quick-10',
        title: 'Cultural Immersion',
        description: 'Watch 10 mins of cultural content',
        duration: 10,
        xpReward: 75,
        difficulty: 'easy',
        affectedStats: ['Culture']
    },
    {
        id: 'grammar-quick-5',
        title: 'Grammar Quick Fix',
        description: 'Review grammar rules (5 mins)',
        duration: 5,
        xpReward: 55,
        difficulty: 'medium',
        affectedStats: ['Grammar']
    }
];

export function getRecoveryOpportunities(
    decayMinutesLeft: number,
    decayedStats: string[],
    currentXP: number
): RecoveryOpportunity {
    // Filter tasks that help with decayed stats
    const relevantTasks = QUICK_RECOVERY_TASKS.filter(task =>
        task.affectedStats.some(stat => decayedStats.includes(stat))
    );

    // If no relevant tasks, include all easy tasks
    const availableTasks = relevantTasks.length > 0 ? relevantTasks : QUICK_RECOVERY_TASKS.filter(t => t.difficulty === 'easy');

    const totalRecoveryPotential = availableTasks.reduce((sum, task) => sum + task.xpReward, 0);

    // Determine urgency based on time remaining
    let urgency: 'low' | 'medium' | 'critical';
    if (decayMinutesLeft <= 30) urgency = 'critical';
    else if (decayMinutesLeft <= 60) urgency = 'medium';
    else urgency = 'low';

    return {
        availableTasks,
        recoveryWindow: decayMinutesLeft,
        totalRecoveryPotential,
        urgency
    };
}

export function calculateRecoveryBonus(
    tasksCompleted: number,
    timeSpentMinutes: number,
    urgency: 'low' | 'medium' | 'critical'
): number {
    let bonus = 0;

    // Bonus for completing tasks before decay completes
    if (urgency === 'critical') bonus += 50; // 50% bonus if critical
    else if (urgency === 'medium') bonus += 25; // 25% bonus if medium

    // Bonus for multiple recovery tasks
    if (tasksCompleted >= 3) bonus += 30;
    else if (tasksCompleted >= 2) bonus += 15;

    // Time efficiency bonus
    if (timeSpentMinutes < 15) bonus += 20;

    return bonus;
}

export function getRecoveryMessage(urgency: 'low' | 'medium' | 'critical', statsAtRisk: string[]): string {
    const statList = statsAtRisk.join(', ');

    if (urgency === 'critical') {
        return `⚠️ CRITICAL: ${statList} will decay in less than 30 minutes. Complete a recovery task NOW to save your progress!`;
    } else if (urgency === 'medium') {
        return `⏰ WARNING: ${statList} decay imminent (< 1 hour). Quick recovery tasks available to prevent loss.`;
    } else {
        return `💡 TIP: ${statList} are at risk of decay. Consider a quick recovery session to maintain your streak.`;
    }
}
