// services/smartTaskService.ts
import { Task, TaskType, Stat } from '../types';

export interface SmartTaskSuggestion {
    task: Task;
    reason: string;
    confidence: number; // 0-100
    estimatedValue: number; // XP value
    priority: 'high' | 'medium' | 'low';
}

export interface TaskPattern {
    bestTimeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
    completionRate: number;
    averageDurationMinutes: number;
    preferredDifficulty: 'easy' | 'medium' | 'hard';
}

export function analyzeUserPatterns(
    statHistory: any[],
    currentHour: number
): TaskPattern {
    // Calculate completion rate by time of day
    const timeOfDay = getTimeOfDay(currentHour);

    // Calculate average session duration and completion patterns
    const recentHistory = statHistory.slice(-30); // Last 30 days
    const avgDuration = recentHistory.length > 0
        ? recentHistory.reduce((sum: number, h: any) => sum + (h.durationMinutes || 15), 0) / recentHistory.length
        : 15;

    return {
        bestTimeOfDay: timeOfDay,
        completionRate: 0.75, // Placeholder - would analyze from history
        averageDurationMinutes: avgDuration,
        preferredDifficulty: avgDuration < 10 ? 'easy' : avgDuration < 30 ? 'medium' : 'hard'
    };
}

function getTimeOfDay(hour: number): 'morning' | 'afternoon' | 'evening' | 'night' {
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
}

export function rankTasksBySmartness(
    tasks: Task[],
    stats: Stat[],
    statHistory: any[],
    pattern: TaskPattern,
    currentHour: number
): SmartTaskSuggestion[] {
    const currentHourCategory = getTimeOfDay(currentHour);
    const weakestStats = getWeakestStats(stats, 3);

    return tasks
        .map(task => {
            let confidence = 50;
            let reason = '';
            let priority: 'high' | 'medium' | 'low' = 'medium';

            // Priority: Lowest stats first
            if (task.statBoost && weakestStats.some(s => s.name === task.statBoost.stat)) {
                confidence += 30;
                reason += `Addresses weak stat (${task.statBoost.stat}). `;
                priority = 'high';
            }

            // Priority: Time-appropriate tasks
            if (pattern.bestTimeOfDay === currentHourCategory) {
                confidence += 20;
                reason += `Matches your peak activity time (${currentHourCategory}). `;
            }

            // Priority: Difficulty match
            if (task.type === TaskType.Daily && pattern.preferredDifficulty === 'easy') {
                confidence += 15;
                reason += `Quick win - fits your available time. `;
            }

            // Priority: Streak maintenance
            if (task.type === TaskType.Daily && !task.isCompleted) {
                confidence += 10;
                reason += `Completes today's streak. `;
            }

            // Penalty: Already completed
            if (task.isCompleted) {
                confidence -= 50;
                priority = 'low';
            }

            // Penalty: Takes too long
            if (pattern.averageDurationMinutes < 10 && task.description.toLowerCase().includes('long')) {
                confidence -= 15;
            }

            const estimatedValue = calculateTaskValue(task, stats);

            return {
                task,
                reason: reason.trim() || 'Available task',
                confidence: Math.max(0, Math.min(100, confidence)),
                estimatedValue,
                priority
            };
        })
        .sort((a, b) => {
            // Sort by: priority first, then confidence
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            }
            return b.confidence - a.confidence;
        });
}

function getWeakestStats(stats: Stat[], count: number): Stat[] {
    return [...stats]
        .sort((a, b) => a.value - b.value)
        .slice(0, count);
}

function calculateTaskValue(task: Task, stats: Stat[]): number {
    let value = task.xp || 50;

    // Boost value for weak stats
    if (task.statBoost) {
        const relevantStat = stats.find(s => s.name === task.statBoost.stat);
        if (relevantStat && relevantStat.value < 50) {
            value *= 1.5; // 50% boost for weak stats
        }
    }

    // Boost for weekly tasks (more impactful)
    if (task.type === TaskType.Weekly) {
        value *= 1.3;
    }

    return Math.round(value);
}

export function getQuickWinTasks(
    tasks: Task[],
    maxDurationMinutes: number = 5
): SmartTaskSuggestion[] {
    const suggestions = tasks
        .filter(t => !t.isCompleted && t.type === TaskType.Daily)
        .map(task => ({
            task,
            reason: `Quick ${maxDurationMinutes}-minute task to maintain momentum`,
            confidence: 85,
            estimatedValue: task.xp || 40,
            priority: 'high' as const
        }))
        .slice(0, 3);

    return suggestions;
}

export function getStreakSaverTasks(
    tasks: Task[],
    streakDaysRemaining: number
): SmartTaskSuggestion[] {
    if (streakDaysRemaining > 2) return [];

    return tasks
        .filter(t => !t.isCompleted && t.type === TaskType.Daily)
        .map(task => ({
            task,
            reason: `🔥 STREAK SAVER: Complete to maintain your ${streakDaysRemaining}-day streak!`,
            confidence: 95,
            estimatedValue: (task.xp || 50) * 1.5,
            priority: 'high' as const
        }))
        .slice(0, 2);
}
