// services/analyticsService.ts
import { Stat } from '../types';

export interface StatsTrend {
    statName: string;
    trend: 'up' | 'down' | 'flat';
    changePercent: number;
    daysToNextLevel: number;
}

export interface EfficiencyMetrics {
    xpPerMinute: number;
    taskCompletionRate: number;
    averageTaskValue: number;
    streakMultiplier: number;
}

export interface PredictiveInsights {
    daysToNextRank: number;
    daysToMaxStat: number;
    estimatedRankDate: string;
    confidence: number;
}

export interface WeakPointAnalysis {
    weakestSubstats: Array<{ name: string; value: number; rank: string }>;
    improvementPotential: number;
    recommendedFocus: string[];
}

export function calculateStatsTrends(
    stats: Stat[],
    statHistory: any[],
    daysToAnalyze: number = 7
): StatsTrend[] {
    const recentHistory = statHistory.slice(-daysToAnalyze);

    return stats.map(stat => {
        if (recentHistory.length === 0) {
            return {
                statName: stat.name,
                trend: 'flat' as const,
                changePercent: 0,
                daysToNextLevel: 999
            };
        }

        // Calculate trend
        const oldValue = recentHistory[0]?.stats?.find((s: any) => s.name === stat.name)?.value || stat.value;
        const newValue = stat.value;
        const change = newValue - oldValue;
        const changePercent = oldValue > 0 ? (change / oldValue) * 100 : 0;

        let trend: 'up' | 'down' | 'flat';
        if (changePercent > 5) trend = 'up';
        else if (changePercent < -5) trend = 'down';
        else trend = 'flat';

        // Estimate days to next level (assuming linear progression)
        const nextLevelThreshold = stat.value + 50;
        const dailyGain = Math.max(changePercent / daysToAnalyze, 0.1);
        const daysToNextLevel = dailyGain > 0 ? Math.ceil(50 / dailyGain) : 999;

        return {
            statName: stat.name,
            trend,
            changePercent,
            daysToNextLevel
        };
    });
}

export function calculateEfficiencyMetrics(
    totalXP: number,
    totalMinutesSpent: number,
    tasksCompleted: number,
    totalTasksAvailable: number,
    currentStreak: number
): EfficiencyMetrics {
    const xpPerMinute = totalMinutesSpent > 0 ? totalXP / totalMinutesSpent : 0;
    const taskCompletionRate = totalTasksAvailable > 0 ? (tasksCompleted / totalTasksAvailable) * 100 : 0;
    const averageTaskValue = tasksCompleted > 0 ? totalXP / tasksCompleted : 0;
    const streakMultiplier = 1 + (currentStreak * 0.05); // 5% bonus per day

    return {
        xpPerMinute: Math.round(xpPerMinute * 100) / 100,
        taskCompletionRate: Math.round(taskCompletionRate),
        averageTaskValue: Math.round(averageTaskValue),
        streakMultiplier: Math.round(streakMultiplier * 100) / 100
    };
}

export function calculatePredictiveInsights(
    currentRankScore: number,
    nextRankThreshold: number,
    statHistory: any[],
    currentStreak: number
): PredictiveInsights {
    const recentHistory = statHistory.slice(-14); // Last 2 weeks
    const averageDailyGain = recentHistory.length > 1
        ? (currentRankScore - (recentHistory[0]?.apexIndex || currentRankScore)) / recentHistory.length
        : 5;

    const rankPointsNeeded = nextRankThreshold - currentRankScore;
    const daysToNextRank = averageDailyGain > 0 ? Math.ceil(rankPointsNeeded / averageDailyGain) : 365;

    // Estimate max stat achievement (assume 100 is max)
    const daysToMaxStat = Math.max(daysToNextRank * 2, 90);

    const today = new Date();
    const estimatedDate = new Date(today.getTime() + daysToNextRank * 24 * 60 * 60 * 1000);

    // Confidence: higher if consistent streak
    const confidence = Math.min(100, 50 + currentStreak * 3);

    return {
        daysToNextRank: Math.max(1, daysToNextRank),
        daysToMaxStat: Math.max(1, daysToMaxStat),
        estimatedRankDate: estimatedDate.toISOString().split('T')[0],
        confidence: Math.round(confidence)
    };
}

export function analyzeWeakPoints(stats: Stat[]): WeakPointAnalysis {
    const allSubstats = stats.flatMap(stat =>
        stat.subStats.map(substat => ({
            name: substat.name,
            statName: stat.name,
            value: substat.value,
            rank: substat.rank
        }))
    );

    const weakestSubstats = allSubstats
        .sort((a, b) => a.value - b.value)
        .slice(0, 5)
        .map(s => ({
            name: `${s.name} (${s.statName})`,
            value: s.value,
            rank: s.rank
        }));

    // Calculate improvement potential
    const avgSubstatValue = allSubstats.reduce((sum, s) => sum + s.value, 0) / allSubstats.length;
    const improvementPotential = Math.round(
        (weakestSubstats.reduce((sum, s) => sum + (avgSubstatValue - s.value), 0) / weakestSubstats.length) * 10
    ) / 10;

    // Recommend focus areas
    const recommendedFocus = weakestSubstats
        .slice(0, 3)
        .map(s => s.name.split(' ')[0]);

    return {
        weakestSubstats,
        improvementPotential,
        recommendedFocus
    };
}

export function generateProgressSummary(
    stats: Stat[],
    statHistory: any[],
    currentStreak: number,
    daysLogged: number
): string {
    const trends = calculateStatsTrends(stats, statHistory, 7);
    const upTrends = trends.filter(t => t.trend === 'up').length;
    const downTrends = trends.filter(t => t.trend === 'down').length;

    let summary = `📊 Progress Report:\n`;
    summary += `✅ ${upTrends} stats trending up | ⚠️ ${downTrends} stats declining\n`;
    summary += `🔥 ${currentStreak}-day streak | 📅 ${daysLogged} days logged\n`;

    if (upTrends > downTrends) {
        summary += `🚀 Great momentum! Keep it up!`;
    } else if (downTrends > upTrends) {
        summary += `⏰ Time to refocus on weak stats`;
    } else {
        summary += `➡️ Steady pace - maintain consistency`;
    }

    return summary;
}
