import { Achievement, AchievementCategory, AchievementRarity, GameState } from '../types';

export const ACHIEVEMENTS: Achievement[] = [
  // ===== PROTOCOL ACHIEVEMENTS =====
  {
    id: 'protocol_completions',
    name: 'Protocol Mastery',
    category: AchievementCategory.Protocol,
    description: 'Complete protocol tasks across all paths',
    trackingField: 'totalTasksCompleted',
    tiers: [
      { tier: 1, target: 10, description: 'Complete 10 tasks', rarity: AchievementRarity.Common, icon: 'Target' },
      { tier: 2, target: 50, description: 'Complete 50 tasks', rarity: AchievementRarity.Common, icon: 'Target' },
      { tier: 3, target: 100, description: 'Complete 100 tasks', rarity: AchievementRarity.Uncommon, icon: 'Target', title: 'The Dedicated' },
      { tier: 4, target: 250, description: 'Complete 250 tasks', rarity: AchievementRarity.Rare, icon: 'Target' },
      { tier: 5, target: 500, description: 'Complete 500 tasks', rarity: AchievementRarity.Epic, icon: 'Target', title: 'The Committed' },
      { tier: 6, target: 1000, description: 'Complete 1000 tasks', rarity: AchievementRarity.Legendary, icon: 'Award', title: 'The Unstoppable', badge: '🔥' },
    ],
  },
  {
    id: 'protocol_diversity',
    name: 'Renaissance Agent',
    category: AchievementCategory.Protocol,
    description: 'Master multiple protocol categories',
    customCheck: (gameState: GameState) => {
      const categories = new Set(gameState.protocolMetrics.map(m => m.category));
      return categories.size;
    },
    tiers: [
      { tier: 1, target: 3, description: 'Train in 3 different categories', rarity: AchievementRarity.Common, icon: 'Layers' },
      { tier: 2, target: 5, description: 'Train in 5 different categories', rarity: AchievementRarity.Uncommon, icon: 'Layers', title: 'The Versatile' },
      { tier: 3, target: 8, description: 'Train in 8 different categories', rarity: AchievementRarity.Rare, icon: 'Layers', title: 'The Polymath', badge: '🎭' },
    ],
  },
  {
    id: 'protocol_evolution',
    name: 'Evolution Catalyst',
    category: AchievementCategory.Mastery,
    description: 'Evolve protocols to higher proficiency tiers',
    customCheck: (gameState: GameState) => {
      return gameState.paths.filter(p => p.proficiency && p.proficiency !== 'Novice').length;
    },
    tiers: [
      { tier: 1, target: 1, description: 'Evolve 1 protocol', rarity: AchievementRarity.Common, icon: 'TrendingUp' },
      { tier: 2, target: 3, description: 'Evolve 3 protocols', rarity: AchievementRarity.Uncommon, icon: 'TrendingUp' },
      { tier: 3, target: 5, description: 'Evolve 5 protocols', rarity: AchievementRarity.Rare, icon: 'TrendingUp', title: 'The Ascendant' },
      { tier: 4, target: 10, description: 'Evolve 10 protocols', rarity: AchievementRarity.Epic, icon: 'TrendingUp', title: 'Evolution Master', badge: '⚡' },
    ],
  },

  // ===== STREAK ACHIEVEMENTS =====
  {
    id: 'daily_streak',
    name: 'Unstoppable Force',
    category: AchievementCategory.Streaks,
    description: 'Maintain daily completion streaks',
    trackingField: 'currentStreak',
    tiers: [
      { tier: 1, target: 3, description: '3-day streak', rarity: AchievementRarity.Common, icon: 'Flame' },
      { tier: 2, target: 7, description: '7-day streak', rarity: AchievementRarity.Common, icon: 'Flame', title: 'The Persistent' },
      { tier: 3, target: 14, description: '14-day streak', rarity: AchievementRarity.Uncommon, icon: 'Flame', title: 'The Relentless' },
      { tier: 4, target: 30, description: '30-day streak', rarity: AchievementRarity.Rare, icon: 'Flame', title: 'The Inevitable', badge: '🔥' },
      { tier: 5, target: 60, description: '60-day streak', rarity: AchievementRarity.Epic, icon: 'Flame', title: 'The Eternal' },
      { tier: 6, target: 100, description: '100-day streak', rarity: AchievementRarity.Legendary, icon: 'Flame', title: 'The Immortal', badge: '👑' },
    ],
  },
  {
    id: 'protocol_streaks',
    name: 'Flame Keeper',
    category: AchievementCategory.Streaks,
    description: 'Maintain active streaks across multiple protocols',
    customCheck: (gameState: GameState) => {
      return gameState.protocolMetrics.filter(m => m.currentStreak >= 7).length;
    },
    tiers: [
      { tier: 1, target: 2, description: '2 protocols with 7+ day streaks', rarity: AchievementRarity.Uncommon, icon: 'Flame' },
      { tier: 2, target: 3, description: '3 protocols with 7+ day streaks', rarity: AchievementRarity.Rare, icon: 'Flame', title: 'Flame Keeper' },
      { tier: 3, target: 5, description: '5 protocols with 7+ day streaks', rarity: AchievementRarity.Epic, icon: 'Flame', title: 'Inferno Master', badge: '🔥' },
    ],
  },

  // ===== XP ACHIEVEMENTS =====
  {
    id: 'xp_earned',
    name: 'Experience Hunter',
    category: AchievementCategory.XP,
    description: 'Accumulate total XP across all activities',
    trackingField: 'xp',
    tiers: [
      { tier: 1, target: 1000, description: 'Earn 1,000 XP', rarity: AchievementRarity.Common, icon: 'Zap' },
      { tier: 2, target: 5000, description: 'Earn 5,000 XP', rarity: AchievementRarity.Common, icon: 'Zap' },
      { tier: 3, target: 10000, description: 'Earn 10,000 XP', rarity: AchievementRarity.Uncommon, icon: 'Zap', title: 'XP Grinder' },
      { tier: 4, target: 25000, description: 'Earn 25,000 XP', rarity: AchievementRarity.Rare, icon: 'Zap' },
      { tier: 5, target: 50000, description: 'Earn 50,000 XP', rarity: AchievementRarity.Epic, icon: 'Zap', title: 'Apex Grinder' },
      { tier: 6, target: 100000, description: 'Earn 100,000 XP', rarity: AchievementRarity.Legendary, icon: 'Star', title: 'Legendary Grinder', badge: '⚡' },
    ],
  },
  {
    id: 'daily_xp',
    name: 'Daily Domination',
    category: AchievementCategory.XP,
    description: 'Earn massive XP in a single day',
    customCheck: (gameState: GameState) => {
      const history = gameState.protocolHistory || [];
      if (history.length === 0) return 0;
      return Math.max(...history.map(h => h.totalXp || 0));
    },
    tiers: [
      { tier: 1, target: 200, description: 'Earn 200 XP in one day', rarity: AchievementRarity.Uncommon, icon: 'Zap' },
      { tier: 2, target: 500, description: 'Earn 500 XP in one day', rarity: AchievementRarity.Rare, icon: 'Zap', title: 'The Focused' },
      { tier: 3, target: 1000, description: 'Earn 1,000 XP in one day', rarity: AchievementRarity.Epic, icon: 'Star', title: 'One-Day Legend', badge: '💎' },
    ],
  },

  // ===== STATS ACHIEVEMENTS =====
  {
    id: 'rank_progression',
    name: 'Ascension Path',
    category: AchievementCategory.Stats,
    description: 'Reach higher threat ranks',
    customCheck: (gameState: GameState) => {
      const rankOrder = ['E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SS+'];
      return rankOrder.indexOf(gameState.rank.name);
    },
    tiers: [
      { tier: 1, target: 2, description: 'Reach C Rank', rarity: AchievementRarity.Common, icon: 'TrendingUp' },
      { tier: 2, target: 3, description: 'Reach B Rank', rarity: AchievementRarity.Uncommon, icon: 'TrendingUp', title: 'Rising Threat' },
      { tier: 3, target: 4, description: 'Reach A Rank', rarity: AchievementRarity.Rare, icon: 'Star', title: 'Elite Operative' },
      { tier: 4, target: 5, description: 'Reach S Rank', rarity: AchievementRarity.Epic, icon: 'Star', title: 'Apex Predator', badge: '👁️' },
      { tier: 5, target: 6, description: 'Reach SS Rank', rarity: AchievementRarity.Legendary, icon: 'Award', title: 'Singularity', badge: '💀' },
    ],
  },
  {
    id: 'balanced_stats',
    name: 'Perfect Balance',
    category: AchievementCategory.Stats,
    description: 'Achieve balanced development across all stat categories',
    customCheck: (gameState: GameState) => {
      const mainStats = gameState.stats.map(s => s.value);
      const max = Math.max(...mainStats);
      const min = Math.min(...mainStats);
      const variance = max - min;
      if (variance < 5000) return 3;
      if (variance < 10000) return 2;
      if (variance < 20000) return 1;
      return 0;
    },
    tiers: [
      { tier: 1, target: 1, description: 'Keep stat variance under 20,000', rarity: AchievementRarity.Uncommon, icon: 'Scale' },
      { tier: 2, target: 2, description: 'Keep stat variance under 10,000', rarity: AchievementRarity.Rare, icon: 'Scale', title: 'The Balanced' },
      { tier: 3, target: 3, description: 'Keep stat variance under 5,000', rarity: AchievementRarity.Epic, icon: 'Scale', title: 'Perfect Equilibrium', badge: '⚖️' },
    ],
  },

  // ===== MASTERY ACHIEVEMENTS =====
  {
    id: 'master_proficiency',
    name: 'True Mastery',
    category: AchievementCategory.Mastery,
    description: 'Reach Master proficiency in protocols',
    customCheck: (gameState: GameState) => {
      return gameState.paths.filter(p => p.proficiency?.includes('Master')).length;
    },
    tiers: [
      { tier: 1, target: 1, description: 'Reach Master in 1 protocol', rarity: AchievementRarity.Rare, icon: 'Award', title: 'The Master' },
      { tier: 2, target: 3, description: 'Reach Master in 3 protocols', rarity: AchievementRarity.Epic, icon: 'Award', title: 'Triple Master' },
      { tier: 3, target: 5, description: 'Reach Master in 5 protocols', rarity: AchievementRarity.Legendary, icon: 'Award', title: 'Grandmaster', badge: '🏆' },
    ],
  },
  {
    id: 'max_level',
    name: 'Level Supremacy',
    category: AchievementCategory.Mastery,
    description: 'Reach extreme levels in any protocol',
    customCheck: (gameState: GameState) => {
      return Math.max(...gameState.paths.map(p => p.level), 0);
    },
    tiers: [
      { tier: 1, target: 20, description: 'Reach Level 20', rarity: AchievementRarity.Common, icon: 'TrendingUp' },
      { tier: 2, target: 50, description: 'Reach Level 50', rarity: AchievementRarity.Uncommon, icon: 'TrendingUp' },
      { tier: 3, target: 100, description: 'Reach Level 100', rarity: AchievementRarity.Rare, icon: 'Star', title: 'Century Mark' },
      { tier: 4, target: 200, description: 'Reach Level 200', rarity: AchievementRarity.Epic, icon: 'Star', title: 'Transcendent', badge: '✨' },
    ],
  },

  // ===== EXPLORATION ACHIEVEMENTS =====
  {
    id: 'water_master',
    name: 'Hydration Specialist',
    category: AchievementCategory.Exploration,
    description: 'Reach water intake goals consistently',
    customCheck: (gameState: GameState) => {
      const history = gameState.metricsHistory || [];
      return history.filter(h => h.waterGoalReached).length;
    },
    tiers: [
      { tier: 1, target: 7, description: '7 days of water goals', rarity: AchievementRarity.Common, icon: 'Droplets' },
      { tier: 2, target: 30, description: '30 days of water goals', rarity: AchievementRarity.Uncommon, icon: 'Droplets', title: 'Hydrated' },
      { tier: 3, target: 100, description: '100 days of water goals', rarity: AchievementRarity.Rare, icon: 'Droplets', title: 'Water Master', badge: '💧' },
    ],
  },
  {
    id: 'step_master',
    name: 'Movement Virtuoso',
    category: AchievementCategory.Exploration,
    description: 'Reach step goals consistently',
    customCheck: (gameState: GameState) => {
      const history = gameState.metricsHistory || [];
      return history.filter(h => h.stepGoalReached).length;
    },
    tiers: [
      { tier: 1, target: 7, description: '7 days of step goals', rarity: AchievementRarity.Common, icon: 'Footprints' },
      { tier: 2, target: 30, description: '30 days of step goals', rarity: AchievementRarity.Uncommon, icon: 'Footprints', title: 'Always Moving' },
      { tier: 3, target: 100, description: '100 days of step goals', rarity: AchievementRarity.Rare, icon: 'Footprints', title: 'Perpetual Motion', badge: '👟' },
    ],
  },

  // ===== SPECIAL ACHIEVEMENTS =====
  {
    id: 'chapter_black_explorer',
    name: 'Dark Archive',
    category: AchievementCategory.Special,
    description: 'Unlock and engage with Chapter Black',
    isSecret: true,
    customCheck: (gameState: GameState) => {
      return gameState.lore.length;
    },
    tiers: [
      { tier: 1, target: 5, description: 'Unlock 5 lore entries', rarity: AchievementRarity.Uncommon, icon: 'Book' },
      { tier: 2, target: 15, description: 'Unlock 15 lore entries', rarity: AchievementRarity.Rare, icon: 'Book', title: 'Lore Keeper' },
      { tier: 3, target: 30, description: 'Unlock 30 lore entries', rarity: AchievementRarity.Epic, icon: 'Book', title: 'Archive Master', badge: '📖' },
    ],
  },
  {
    id: 'journal_philosopher',
    name: 'Inner Reflection',
    category: AchievementCategory.Special,
    description: 'Document your journey through journal entries',
    customCheck: (gameState: GameState) => {
      return gameState.journal.length;
    },
    tiers: [
      { tier: 1, target: 5, description: 'Write 5 journal entries', rarity: AchievementRarity.Common, icon: 'PenLine' },
      { tier: 2, target: 20, description: 'Write 20 journal entries', rarity: AchievementRarity.Uncommon, icon: 'PenLine', title: 'The Reflective' },
      { tier: 3, target: 50, description: 'Write 50 journal entries', rarity: AchievementRarity.Rare, icon: 'PenLine', title: 'Philosopher', badge: '✍️' },
    ],
  },

  // ===== LEGACY ACHIEVEMENTS =====
  {
    id: 'first_steps',
    name: 'Genesis',
    category: AchievementCategory.Legacy,
    description: 'Begin your journey in the Genesis Protocol',
    trackingField: 'totalTasksCompleted',
    tiers: [
      { tier: 1, target: 1, description: 'Complete your first task', rarity: AchievementRarity.Common, icon: 'Sparkles', title: 'Initiated', badge: '🌟' },
    ],
  },
  {
    id: 'veteran_status',
    name: 'Veteran Operative',
    category: AchievementCategory.Legacy,
    description: 'Demonstrate long-term commitment',
    customCheck: (gameState: GameState) => {
      const daysSinceStart = gameState.statHistory.length;
      return daysSinceStart;
    },
    tiers: [
      { tier: 1, target: 30, description: '30 days in the protocol', rarity: AchievementRarity.Uncommon, icon: 'History' },
      { tier: 2, target: 90, description: '90 days in the protocol', rarity: AchievementRarity.Rare, icon: 'History', title: 'Veteran' },
      { tier: 3, target: 180, description: '180 days in the protocol', rarity: AchievementRarity.Epic, icon: 'History', title: 'Elite Veteran' },
      { tier: 4, target: 365, description: '365 days in the protocol', rarity: AchievementRarity.Legendary, icon: 'Award', title: 'Genesis Legend', badge: '👑' },
    ],
  },
];
