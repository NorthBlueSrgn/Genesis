// services/decayService.ts
import { Stat, AttributeRankName } from '../types';
import { DECAY_CONSTANTS } from '../constants';

export interface DecayInfo {
  daysSinceLastActivity: number;
  daysUntilDecay: number;
  isDecayActive: boolean;
  isDecayImminent: boolean;
  pointsAtRisk: number[];
  affectedStats: string[];
  decayBreakdown: Array<{
    stat: string;
    rank: AttributeRankName;
    pointsToLose: number;
  }>;
}

/**
 * Calculate decay information based on last activity date
 */
export const calculateDecayInfo = (
  lastActivityDate: string | null,
  stats: Stat[]
): DecayInfo => {
  const now = new Date();
  const THRESHOLD_DAYS = DECAY_CONSTANTS.INACTIVITY_THRESHOLD_DAYS;
  
  // Calculate days since last activity
  let daysSinceLastActivity = 0;
  
  if (lastActivityDate) {
    const lastDate = new Date(lastActivityDate);
    const diffMs = now.getTime() - lastDate.getTime();
    daysSinceLastActivity = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  } else {
    // If no activity date, assume user just started
    daysSinceLastActivity = 0;
  }
  
  const daysUntilDecay = Math.max(0, THRESHOLD_DAYS - daysSinceLastActivity);
  const isDecayActive = daysSinceLastActivity >= THRESHOLD_DAYS;
  const isDecayImminent = daysSinceLastActivity >= THRESHOLD_DAYS - 1 && daysSinceLastActivity < THRESHOLD_DAYS;
  
  // Calculate which stats will lose points
  const decayBreakdown: DecayInfo['decayBreakdown'] = [];
  const affectedStats: string[] = [];
  const pointsAtRisk: number[] = [];
  
  stats.forEach(stat => {
    const decayPoints = DECAY_CONSTANTS.DECAY_POINTS_BY_RANK[stat.rank] || 0;
    
    if (decayPoints > 0) {
      decayBreakdown.push({
        stat: stat.name,
        rank: stat.rank,
        pointsToLose: decayPoints
      });
      affectedStats.push(stat.name);
      pointsAtRisk.push(decayPoints);
    }
  });
  
  return {
    daysSinceLastActivity,
    daysUntilDecay,
    isDecayActive,
    isDecayImminent,
    pointsAtRisk,
    affectedStats,
    decayBreakdown
  };
};

/**
 * Get a human-readable decay status message
 */
export const getDecayStatusMessage = (decayInfo: DecayInfo): string => {
  if (decayInfo.isDecayActive) {
    return `🚨 DECAY ACTIVE: ${decayInfo.daysSinceLastActivity} days inactive. Lost ${decayInfo.pointsAtRisk.reduce((a, b) => a + b, 0)} points today.`;
  }
  
  if (decayInfo.isDecayImminent) {
    return `⚠️ DECAY IMMINENT: ${decayInfo.daysUntilDecay} day until decay! Log activity now to prevent loss.`;
  }
  
  if (decayInfo.daysSinceLastActivity >= 1) {
    return `⏰ STAY ACTIVE: ${decayInfo.daysUntilDecay} days left before decay kicks in.`;
  }
  
  return '✅ SYSTEMS NOMINAL: Stay active to prevent decay.';
};

/**
 * Get color for decay status
 */
export const getDecayStatusColor = (decayInfo: DecayInfo): string => {
  if (decayInfo.isDecayActive) {
    return 'text-red-500';
  }
  
  if (decayInfo.isDecayImminent) {
    return 'text-yellow-500';
  }
  
  if (decayInfo.daysSinceLastActivity >= 1) {
    return 'text-orange-500';
  }
  
  return 'text-emerald-500';
};

/**
 * Get background color for decay status
 */
export const getDecayStatusBg = (decayInfo: DecayInfo): string => {
  if (decayInfo.isDecayActive) {
    return 'bg-red-900/20 border-red-500/50';
  }
  
  if (decayInfo.isDecayImminent) {
    return 'bg-yellow-900/20 border-yellow-500/50';
  }
  
  if (decayInfo.daysSinceLastActivity >= 1) {
    return 'bg-orange-900/20 border-orange-500/50';
  }
  
  return 'bg-emerald-900/20 border-emerald-500/50';
};
