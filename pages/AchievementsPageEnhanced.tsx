import React, { useMemo, useState } from 'react';
import { useGameState } from '../contexts/GameStateContext';
import { 
  getAchievementsByCategory, 
  getAchievementStats, 
  getUnlockedTitles, 
  getUnlockedBadges, 
  calculateAchievementProgress 
} from '../services/achievementService';
import { AchievementCategory, AchievementRarity } from '../types';
import { Award, Lock, Star, TrendingUp, Flame, Zap, Crown, Trophy } from 'lucide-react';
import { ICON_MAP } from '../constants';

const rarityColors: Record<AchievementRarity, string> = {
  [AchievementRarity.Common]: 'text-gray-400 border-gray-600',
  [AchievementRarity.Uncommon]: 'text-green-400 border-green-600',
  [AchievementRarity.Rare]: 'text-blue-400 border-blue-600',
  [AchievementRarity.Epic]: 'text-purple-400 border-purple-600',
  [AchievementRarity.Legendary]: 'text-amber-400 border-amber-600',
};

const categoryIcons: Record<AchievementCategory, any> = {
  [AchievementCategory.Protocol]: Trophy,
  [AchievementCategory.Stats]: TrendingUp,
  [AchievementCategory.Streaks]: Flame,
  [AchievementCategory.XP]: Zap,
  [AchievementCategory.Mastery]: Crown,
  [AchievementCategory.Exploration]: Star,
  [AchievementCategory.Special]: Award,
  [AchievementCategory.Legacy]: Crown,
};

const AchievementsPage: React.FC = () => {
  const { gameState } = useGameState();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const stats = useMemo(() => {
    if (!gameState) return null;
    return getAchievementStats(gameState);
  }, [gameState]);

  const achievements = useMemo(() => {
    if (!gameState) return {};
    return getAchievementsByCategory(gameState);
  }, [gameState]);

  const titles = useMemo(() => {
    if (!gameState) return [];
    return getUnlockedTitles(gameState);
  }, [gameState]);

  const badges = useMemo(() => {
    if (!gameState) return [];
    return getUnlockedBadges(gameState);
  }, [gameState]);

  const filteredAchievements = selectedCategory 
    ? { [selectedCategory]: achievements[selectedCategory] || [] }
    : achievements;

  if (!gameState || !stats) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Award className="w-8 h-8 text-amber-400" />
          Achievement Archives
        </h1>
        <p className="text-gray-400">Track your legendary accomplishments</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <div className="text-gray-400 text-sm mb-2">Unlocked</div>
          <div className="text-3xl font-bold text-cyan-400">
            {stats.unlockedCount}/{stats.totalAchievements}
          </div>
          <div className="text-xs text-gray-500 mt-1">{stats.completionPercentage.toFixed(1)}% complete</div>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <div className="text-gray-400 text-sm mb-2">Total Tiers</div>
          <div className="text-3xl font-bold text-purple-400">
            {stats.unlockedTiers}/{stats.totalTiers}
          </div>
          <div className="text-xs text-gray-500 mt-1">Achievement tiers unlocked</div>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <div className="text-gray-400 text-sm mb-2">Titles Earned</div>
          <div className="text-3xl font-bold text-amber-400">{titles.length}</div>
          <div className="text-xs text-gray-500 mt-1">Prestigious titles</div>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <div className="text-gray-400 text-sm mb-2">Badges</div>
          <div className="text-3xl font-bold text-green-400">{badges.length}</div>
          <div className="text-xs text-gray-500 mt-1">Rare badges collected</div>
        </div>
      </div>

      {/* Titles & Badges Section */}
      {(titles.length > 0 || badges.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Titles */}
          {titles.length > 0 && (
            <div className="bg-gray-800/50 border border-amber-600/30 rounded-lg p-6">
              <h2 className="text-xl font-bold text-amber-400 mb-4 flex items-center gap-2">
                <Crown className="w-5 h-5" />
                Unlocked Titles
              </h2>
              <div className="flex flex-wrap gap-2">
                {titles.map((title, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-amber-900/30 border border-amber-600/50 rounded-full text-amber-300 text-sm font-medium"
                  >
                    {title}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Badges */}
          {badges.length > 0 && (
            <div className="bg-gray-800/50 border border-cyan-600/30 rounded-lg p-6">
              <h2 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5" />
                Unlocked Badges
              </h2>
              <div className="flex flex-wrap gap-3">
                {badges.map((badge, index) => (
                  <span key={index} className="text-4xl">{badge}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-lg border transition-colors ${
            !selectedCategory
              ? 'bg-cyan-900/50 border-cyan-500 text-cyan-300'
              : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-600'
          }`}
        >
          All Categories
        </button>
        {Object.keys(achievements).map((category) => {
          const Icon = categoryIcons[category as AchievementCategory] || Award;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg border transition-colors flex items-center gap-2 ${
                selectedCategory === category
                  ? 'bg-cyan-900/50 border-cyan-500 text-cyan-300'
                  : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              {category}
            </button>
          );
        })}
      </div>

      {/* Achievements Grid */}
      <div className="space-y-8">
        {Object.entries(filteredAchievements).map(([category, items]) => {
          const Icon = categoryIcons[category as AchievementCategory] || Award;
          return (
            <div key={category}>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Icon className="w-6 h-6 text-cyan-400" />
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map((item: any) => (
                  <AchievementCard key={item.achievement.id} item={item} gameState={gameState} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const AchievementCard: React.FC<{ item: any; gameState: any }> = ({ item, gameState }) => {
  const { achievement, isUnlocked } = item;
  
  if (isUnlocked) {
    // Unlocked achievement
    const { currentTierData, nextTier, progress, nextTierTarget } = item;
    const Icon = (currentTierData?.icon && ICON_MAP[currentTierData.icon as keyof typeof ICON_MAP]) || Award;
    const rarityColor = (currentTierData?.rarity && rarityColors[currentTierData.rarity as AchievementRarity]) || rarityColors[AchievementRarity.Common];

    return (
      <div className={`bg-gray-800/50 border ${rarityColor} rounded-lg p-4 hover:bg-gray-800 transition-colors`}>
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 w-14 h-14 rounded-full border-2 ${rarityColor} flex items-center justify-center bg-gray-900/50`}>
            <Icon className={`w-7 h-7 ${rarityColor.split(' ')[0]}`} />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold flex items-center gap-2">
              {achievement.name}
              {currentTierData.badge && <span className="text-2xl">{currentTierData.badge}</span>}
            </h3>
            <p className="text-sm text-gray-400 mt-1">{currentTierData.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-xs font-bold ${rarityColor.split(' ')[0]}`}>
                Tier {currentTierData.tier} - {currentTierData.rarity}
              </span>
              {currentTierData.title && (
                <span className="text-xs px-2 py-0.5 bg-amber-900/30 border border-amber-600/50 rounded-full text-amber-300">
                  {currentTierData.title}
                </span>
              )}
            </div>

            {/* Progress to next tier */}
            {nextTier && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                  <span>Next: {nextTier.description}</span>
                  <span>{progress}/{nextTierTarget}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((progress / (nextTierTarget || 1)) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } else {
    // Locked achievement
    const { progress, target, percentage } = item;
    const firstTier = achievement.tiers[0];
    const Icon = achievement.isSecret ? Lock : (firstTier?.icon && ICON_MAP[firstTier.icon as keyof typeof ICON_MAP]) || Award;
    const rarityColor = (firstTier?.rarity && rarityColors[firstTier.rarity as AchievementRarity]) || rarityColors[AchievementRarity.Common];

    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 opacity-60 hover:opacity-80 transition-opacity">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-14 h-14 rounded-full border-2 border-gray-700 flex items-center justify-center bg-gray-900/50">
            <Icon className="w-7 h-7 text-gray-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-gray-400 font-bold">
              {achievement.isSecret ? '???' : achievement.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {achievement.isSecret ? 'Secret achievement - unlock to reveal' : achievement.description}
            </p>
            {!achievement.isSecret && (
              <>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>{firstTier.description}</span>
                    <span>{progress}/{target}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-gray-600 to-gray-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
};

export default AchievementsPage;
