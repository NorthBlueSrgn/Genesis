
// services/achievementService.ts
import { GameState, TaskType, AttributeRankName } from '../types';
import { ACHIEVEMENTS_LIST } from '../data/achievementsData';
import { RANK_MAP } from '../constants';

const calculateTotalGrowth = (state: GameState): number => {
    if (!state.initialStatsSnapshot) return 0;
    const currentTotal = state.stats.reduce((sum, s) => sum + s.value, 0);
    const initialTotal = state.initialStatsSnapshot.reduce((sum, s) => sum + s.value, 0);
    return Math.max(0, currentTotal - initialTotal);
};

export const checkAchievements = (oldState: GameState, newState: GameState): { achievementId: string, newTier: number }[] => {
    const newlyUnlocked: { achievementId: string, newTier: number }[] = [];
    const totalGrowth = calculateTotalGrowth(newState);
    const completedSideMissions = newState.sideMissions.filter(sm => sm.status === 'Completed').length;
    
    // We only care about IDs that are NOT in the newState yet
    const alreadyUnlockedIds = new Set(newState.unlockedAchievements.map(a => a.id));
    const previouslyUnlockedMap = new Map(oldState.unlockedAchievements.map(a => [a.id, a.highestTier]));

    for (const achievement of ACHIEVEMENTS_LIST) {
        if (alreadyUnlockedIds.has(achievement.id)) continue;

        const highestPreviousTier = previouslyUnlockedMap.get(achievement.id) || 0;
        const nextTier = achievement.tiers.find(t => t.tier === highestPreviousTier + 1);
        if (!nextTier) continue;

        let met = false;
        if (achievement.id === 'common-01') {
            const done = newState.paths.flatMap(p=>p.tasks).filter(t => t.type === TaskType.Daily && t.isCompleted).length;
            if (done >= 1) met = true;
        }
        if (achievement.id === 'common-02' && newState.currentStreak >= 3) met = true;
        if (achievement.id === 'common-04' && completedSideMissions >= 1) met = true;
        if (achievement.id === 'common-05' && totalGrowth >= 500) met = true;
        if (achievement.id === 'common-06' && Object.values(newState.weeklyPlan).some(d => d.length > 0)) met = true;
        if (achievement.id === 'uncommon-01' && newState.currentStreak >= 7) met = true;
        if (achievement.id === 'uncommon-03' && completedSideMissions >= 5) met = true;
        if (achievement.id === 'uncommon-04' && totalGrowth >= 5000) met = true;
        if (achievement.id === 'rare-01' && newState.currentStreak >= 30) met = true;
        if (achievement.id === 'special-07' && newState.stats.every(s => RANK_MAP[s.rank] >= RANK_MAP[AttributeRankName.C])) met = true;

        if (met) newlyUnlocked.push({ achievementId: achievement.id, newTier: nextTier.tier });
    }
    
    return newlyUnlocked;
};

export const checkFocusAchievement = (state: GameState) => {
    return ACHIEVEMENTS_LIST.find(a => a.id === 'common-03') || null;
};
