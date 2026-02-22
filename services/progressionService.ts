// services/progressionService.ts
import { SubStatName, AttributeRankName, Task, Stat } from '../types';
import { SUBSTAT_RANK_THRESHOLDS, ATTRIBUTE_RANKS } from '../constants';

/**
 * Calculates how many days it would take to reach the next substat rank
 * based on average daily XP earned from tasks
 */
export const estimateDaysToNextSubstatRank = (
  substat: SubStatName,
  currentValue: number,
  currentRank: AttributeRankName,
  averageDailyXp: number = 50 // Default assumption: ~50 XP/day from typical task completion
): { days: number; pointsNeeded: number; nextRank: AttributeRankName } | null => {
  const thresholds = SUBSTAT_RANK_THRESHOLDS[substat];
  
  if (!thresholds || thresholds.length === 0) return null;
  
  const currentRankIndex = thresholds.findIndex(r => r.name === currentRank);
  if (currentRankIndex === -1 || currentRankIndex >= thresholds.length - 1) {
    // Already at max rank or invalid rank
    return null;
  }
  
  const nextRankThreshold = thresholds[currentRankIndex + 1];
  const pointsNeeded = Math.max(0, nextRankThreshold.threshold - currentValue);
  
  const daysNeeded = averageDailyXp > 0 ? Math.ceil(pointsNeeded / averageDailyXp) : Infinity;
  
  return {
    days: daysNeeded,
    pointsNeeded,
    nextRank: nextRankThreshold.name
  };
};

/**
 * Formats days into a human-readable time estimate
 * e.g., 7 days -> "~1 week", 180 days -> "~6 months"
 */
export const formatProgressionEstimate = (days: number): string => {
  if (days === Infinity) return "Unable to estimate";
  if (days <= 1) return "< 1 day";
  if (days < 7) return `~${days} day${days !== 1 ? 's' : ''}`;
  if (days < 30) {
    const weeks = Math.round(days / 7);
    return `~${weeks} week${weeks !== 1 ? 's' : ''}`;
  }
  if (days < 365) {
    const months = Math.round(days / 30);
    return `~${months} month${months !== 1 ? 's' : ''}`;
  }
  
  const years = Math.round(days / 365);
  const remainingMonths = Math.round((days % 365) / 30);
  
  if (remainingMonths === 0) {
    return `~${years} year${years !== 1 ? 's' : ''}`;
  }
  
  return `~${years} yr ${remainingMonths}m`;
};

/**
 * Calculates average daily XP based on current tasks
 * Sums up all task XP and divides by 7 (typical weekly average)
 */
export const calculateAverageDailyXp = (tasks: Task[]): number => {
  const weeklyXp = tasks.reduce((sum, task) => {
    if (task.type === 'Weekly') {
      // Weekly tasks contribute their XP spread across the week
      const count = task.targetCount || 1;
      return sum + (task.xp * count);
    } else {
      // Daily tasks contribute 7x per week
      return sum + (task.xp * 7);
    }
  }, 0);
  
  return Math.round(weeklyXp / 7);
};

/**
 * Gets progression info for a specific substat
 * Returns current progress, next rank, and time estimate
 */
export const getSubstatProgressionInfo = (
  substat: SubStatName,
  currentValue: number,
  currentRank: AttributeRankName,
  tasks: Task[]
): {
  currentRank: AttributeRankName;
  nextRank: AttributeRankName | null;
  currentValue: number;
  nextRankThreshold: number;
  pointsNeeded: number;
  percentToNextRank: number;
  timeEstimate: string;
  averageDailyXp: number;
  daysNeeded: number;
} | null => {
  const thresholds = SUBSTAT_RANK_THRESHOLDS[substat];
  
  if (!thresholds || thresholds.length === 0) return null;
  
  const currentRankIndex = thresholds.findIndex(r => r.name === currentRank);
  if (currentRankIndex === -1) return null;
  
  const isMaxRank = currentRankIndex >= thresholds.length - 1;
  const nextRankInfo = !isMaxRank ? thresholds[currentRankIndex + 1] : null;
  
  const currentThreshold = thresholds[currentRankIndex].threshold;
  const nextThreshold = nextRankInfo?.threshold ?? currentValue;
  
  const pointsNeeded = !isMaxRank ? Math.max(0, nextThreshold - currentValue) : 0;
  const rangeSize = !isMaxRank ? nextThreshold - currentThreshold : 1;
  const percentToNextRank = rangeSize > 0 ? Math.min(100, ((currentValue - currentThreshold) / rangeSize) * 100) : 100;
  
  const averageDailyXp = calculateAverageDailyXp(tasks);
  const estimateInfo = !isMaxRank
    ? estimateDaysToNextSubstatRank(substat, currentValue, currentRank, averageDailyXp)
    : null;
  
  return {
    currentRank,
    nextRank: nextRankInfo?.name ?? null,
    currentValue,
    nextRankThreshold: nextThreshold,
    pointsNeeded,
    percentToNextRank,
    timeEstimate: estimateInfo ? formatProgressionEstimate(estimateInfo.days) : '— Complete',
    averageDailyXp,
    daysNeeded: estimateInfo?.days ?? 0
  };
};
