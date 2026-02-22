// services/achievementService.ts - Enhanced Achievement System
import { GameState, UnlockedAchievement } from '../types';
import { ACHIEVEMENTS } from '../data/enhancedAchievements';

/**
 * Calculate current progress for an achievement
 */
export const calculateAchievementProgress = (achievementId: string, gameState: GameState): number => {
  const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
  if (!achievement) return 0;

  // Use custom check if available
  if (achievement.customCheck) {
    return achievement.customCheck(gameState);
  }

  // Use tracking field if specified
  if (achievement.trackingField) {
    return (gameState as any)[achievement.trackingField] || 0;
  }

  return 0;
};

/**
 * Check all achievements and return newly unlocked ones
 */
export const checkAchievements = (oldState: GameState, newState: GameState): { achievementId: string; newTier: number }[] => {
  const newlyUnlocked: { achievementId: string; newTier: number }[] = [];
  
  for (const achievement of ACHIEVEMENTS) {
    const progress = calculateAchievementProgress(achievement.id, newState);
    const currentUnlocked = newState.unlockedAchievements.find(u => u.id === achievement.id);
    const currentTier = currentUnlocked?.highestTier || 0;
    
    // Check if we can unlock the next tier
    const nextTier = achievement.tiers.find(t => t.tier === currentTier + 1);
    if (nextTier && progress >= nextTier.target) {
      newlyUnlocked.push({ achievementId: achievement.id, newTier: nextTier.tier });
    }
  }

  return newlyUnlocked;
};

/**
 * Get all unlocked achievements with full data
 */
export const getUnlockedAchievementsWithData = (gameState: GameState) => {
  return gameState.unlockedAchievements.map(unlocked => {
    const achievement = ACHIEVEMENTS.find(a => a.id === unlocked.id);
    if (!achievement) return null;

    const progress = calculateAchievementProgress(achievement.id, gameState);
    const currentTierData = achievement.tiers.find(t => t.tier === unlocked.highestTier);
    const nextTier = achievement.tiers.find(t => t.tier === unlocked.highestTier + 1);

    return {
      ...unlocked,
      achievement,
      currentTierData,
      nextTier,
      progress,
      nextTierTarget: nextTier?.target,
    };
  }).filter(Boolean);
};

/**
 * Get all locked achievements with progress
 */
export const getLockedAchievementsWithProgress = (gameState: GameState) => {
  const unlockedIds = new Set(gameState.unlockedAchievements.map(u => u.id));
  
  return ACHIEVEMENTS
    .filter(achievement => !unlockedIds.has(achievement.id) && !achievement.isSecret)
    .map(achievement => {
      const progress = calculateAchievementProgress(achievement.id, gameState);
      const firstTier = achievement.tiers[0];

      return {
        achievement,
        progress,
        target: firstTier.target,
        percentage: (progress / firstTier.target) * 100,
      };
    });
};

/**
 * Get achievements by category
 */
export const getAchievementsByCategory = (gameState: GameState) => {
  const unlocked = getUnlockedAchievementsWithData(gameState);
  const locked = getLockedAchievementsWithProgress(gameState);

  const categories: Record<string, any[]> = {};

  // Group unlocked by category
  unlocked.forEach((item: any) => {
    const category = item.achievement.category;
    if (!categories[category]) categories[category] = [];
    categories[category].push({ ...item, isUnlocked: true });
  });

  // Group locked by category
  locked.forEach(item => {
    const category = item.achievement.category;
    if (!categories[category]) categories[category] = [];
    categories[category].push({ ...item, isUnlocked: false });
  });

  return categories;
};

/**
 * Get achievement stats
 */
export const getAchievementStats = (gameState: GameState) => {
  const totalAchievements = ACHIEVEMENTS.length;
  const unlockedCount = gameState.unlockedAchievements.length;
  const totalTiers = ACHIEVEMENTS.reduce((sum, a) => sum + a.tiers.length, 0);
  const unlockedTiers = gameState.unlockedAchievements.reduce((sum, u) => sum + u.highestTier, 0);

  const rarities = gameState.unlockedAchievements.map(u => {
    const achievement = ACHIEVEMENTS.find(a => a.id === u.id);
    const tier = achievement?.tiers.find(t => t.tier === u.highestTier);
    return tier?.rarity;
  }).filter(Boolean);

  const rarityCounts = rarities.reduce((acc: Record<string, number>, r) => {
    if (r) {
      acc[r] = (acc[r] || 0) + 1;
    }
    return acc;
  }, {});

  return {
    totalAchievements,
    unlockedCount,
    totalTiers,
    unlockedTiers,
    completionPercentage: (unlockedCount / totalAchievements) * 100,
    rarityCounts,
  };
};

/**
 * Get all unlocked titles
 */
export const getUnlockedTitles = (gameState: GameState): string[] => {
  const titles: string[] = [];
  
  gameState.unlockedAchievements.forEach(unlocked => {
    const achievement = ACHIEVEMENTS.find(a => a.id === unlocked.id);
    if (!achievement) return;

    const tier = achievement.tiers.find(t => t.tier === unlocked.highestTier);
    if (tier?.title) {
      titles.push(tier.title);
    }
  });

  return titles;
};

/**
 * Get all unlocked badges
 */
export const getUnlockedBadges = (gameState: GameState): string[] => {
  const badges: string[] = [];
  
  gameState.unlockedAchievements.forEach(unlocked => {
    const achievement = ACHIEVEMENTS.find(a => a.id === unlocked.id);
    if (!achievement) return;

    const tier = achievement.tiers.find(t => t.tier === unlocked.highestTier);
    if (tier?.badge) {
      badges.push(tier.badge);
    }
  });

  return badges;
};

export const checkFocusAchievement = (state: GameState) => {
  return ACHIEVEMENTS.find(a => a.id === 'protocol_completions') || null;
};