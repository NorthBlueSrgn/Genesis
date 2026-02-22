import { StatProgression } from '../types';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001/genesis-protocol-staging/us-central1';

export async function recordBenchmark(
    userName: string,
    metricId: string,
    metricName: string,
    stat: string,
    subStat: string,
    previousValue: number,
    newValue: number,
    targetValue: number,
    unit: string
): Promise<StatProgression> {
    const response = await fetch(`${BACKEND_URL}/recordBenchmarkV2`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userName,
            metricId,
            metricName,
            stat,
            subStat,
            previousValue,
            newValue,
            targetValue,
            unit
        })
    });

    if (!response.ok) {
        throw new Error('Failed to record benchmark');
    }

    return response.json();
}

/**
 * Calculate proportional stat boost based on improvement toward target
 */
export function calculateProportionalBoost(
    previousValue: number,
    newValue: number,
    targetValue: number,
    maxBoost: number = 25
): number {
    if (targetValue <= previousValue) {
        return 0; // Already at/past target
    }

    const progressRange = targetValue - previousValue;
    const improvement = newValue - previousValue;
    
    if (improvement <= 0) {
        return 0; // No improvement
    }

    const percentProgress = Math.min(1, improvement / progressRange);
    return Math.round(percentProgress * maxBoost);
}

/**
 * Calculate percentile based on current vs target
 */
export function calculatePercentile(
    currentValue: number,
    targetValue: number
): number {
    return Math.min(100, Math.round((currentValue / targetValue) * 100));
}

/**
 * Benchmark tiers for different stats/substats
 */
export const BENCHMARK_TIERS = {
    // Physical - Strength
    benchPress: {
        archetype: 'Intermediate',
        E: 185,
        D: 205,
        C: 225,
        B: 245,
        A: 265,
        S: 285,
        SS: 305,
        SS_PLUS: 325
    },
    squat: {
        archetype: 'Intermediate',
        E: 225,
        D: 245,
        C: 265,
        B: 285,
        A: 305,
        S: 325,
        SS: 345,
        SS_PLUS: 365
    },
    deadlift: {
        archetype: 'Intermediate',
        E: 315,
        D: 335,
        C: 355,
        B: 375,
        A: 395,
        S: 415,
        SS: 435,
        SS_PLUS: 455
    },
    // Physical - Endurance
    fiveKRun: {
        archetype: 'Intermediate',
        E: 30, // minutes
        D: 27,
        C: 24,
        B: 21,
        A: 18,
        S: 15,
        SS: 12,
        SS_PLUS: 10,
        lowerIsBetter: true
    },
    // Physical - Speed
    fortyYardDash: {
        archetype: 'Intermediate',
        E: 5.5, // seconds
        D: 5.2,
        C: 4.9,
        B: 4.6,
        A: 4.3,
        S: 4.0,
        SS: 3.7,
        SS_PLUS: 3.5,
        lowerIsBetter: true
    },
    // Mental - Strategy (Chess ELO)
    chessRating: {
        archetype: 'Intermediate',
        E: 800,
        D: 1000,
        C: 1200,
        B: 1400,
        A: 1600,
        S: 1800,
        SS: 2000,
        SS_PLUS: 2200
    },
    // Mental - Willpower/Psyche (streak days)
    streakDays: {
        archetype: 'General',
        E: 7,
        D: 14,
        C: 30,
        B: 60,
        A: 90,
        S: 180,
        SS: 365,
        SS_PLUS: 730
    }
};
