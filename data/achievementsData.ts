
import { Achievement, AchievementRarity } from '../types';

export const ACHIEVEMENTS_LIST: Achievement[] = [
  // --- Common (Getting Started) ---
  { 
    id: 'common-01', 
    name: 'Initiated', 
    tiers: [{ tier: 1, target: 1, description: 'Complete your first Daily Task.', rarity: AchievementRarity.Common, icon: 'Check' }] 
  },
  { 
    id: 'common-02', 
    name: 'Momentum', 
    tiers: [{ tier: 1, target: 3, description: 'Maintain a 3-day daily completion streak.', rarity: AchievementRarity.Common, icon: 'Flame' }] 
  },
  { 
    id: 'common-03', 
    name: 'Deep Dive', 
    tiers: [{ tier: 1, target: 1, description: 'Complete a Focus Mode session.', rarity: AchievementRarity.Common, icon: 'BrainCircuit' }] 
  },
  { 
    id: 'common-04', 
    name: 'Contractor', 
    tiers: [{ tier: 1, target: 1, description: 'Complete 1 Side Mission.', rarity: AchievementRarity.Common, icon: 'ListTodo' }] 
  },
  { 
    id: 'common-05', 
    name: 'Growth Spurt', 
    tiers: [{ tier: 1, target: 500, description: 'Gain 500 Stat Points during your active service.', rarity: AchievementRarity.Common, icon: 'TrendingUp' }] 
  },
  { 
    id: 'common-06', 
    name: 'Planner', 
    tiers: [{ tier: 1, target: 1, description: 'Fill your daily schedule in the Planner.', rarity: AchievementRarity.Common, icon: 'Calendar' }] 
  },

  // --- Uncommon (Consistency & Effort) ---
  { 
    id: 'uncommon-01', 
    name: 'Unbroken Chain', 
    tiers: [{ tier: 1, target: 7, description: 'Maintain a 7-day daily completion streak.', rarity: AchievementRarity.Uncommon, icon: 'Flame' }] 
  },
  { 
    id: 'uncommon-02', 
    name: 'Perfect Week', 
    tiers: [{ tier: 1, target: 1, description: 'Achieve 100% daily task completion for 7 consecutive days.', rarity: AchievementRarity.Uncommon, icon: 'Star' }] 
  },
  { 
    id: 'uncommon-03', 
    name: 'Veteran Contractor', 
    tiers: [{ tier: 1, target: 5, description: 'Complete 5 Side Missions.', rarity: AchievementRarity.Uncommon, icon: 'ListTodo' }] 
  },
  { 
    id: 'uncommon-04', 
    name: 'Significant Gains', 
    tiers: [{ tier: 1, target: 5000, description: 'Gain 5,000 Stat Points during your active service.', rarity: AchievementRarity.Uncommon, icon: 'TrendingUp' }] 
  },
  { 
    id: 'uncommon-05', 
    name: 'Awakened', 
    tiers: [{ tier: 1, target: 1, description: 'Unlock your Resonance Signature.', rarity: AchievementRarity.Uncommon, icon: 'Sparkles' }] 
  },
  { 
    id: 'uncommon-06', 
    name: 'Chronicler', 
    tiers: [{ tier: 1, target: 5, description: 'Unlock 5 entries in Chapter Black.', rarity: AchievementRarity.Uncommon, icon: 'Book' }] 
  },

  // --- Rare (Dedication) ---
  { 
    id: 'rare-01', 
    name: 'Iron Discipline', 
    tiers: [{ tier: 1, target: 30, description: 'Maintain a 30-day daily completion streak.', rarity: AchievementRarity.Rare, icon: 'Shield' }] 
  },
  { 
    id: 'rare-02', 
    name: 'Evolution', 
    tiers: [{ tier: 1, target: 1, description: 'Evolve a Protocol to a higher tier.', rarity: AchievementRarity.Rare, icon: 'Zap' }] 
  },
  { 
    id: 'rare-03', 
    name: 'Mercenary', 
    tiers: [{ tier: 1, target: 10, description: 'Complete 10 Side Missions.', rarity: AchievementRarity.Rare, icon: 'Swords' }] 
  },
  { 
    id: 'rare-04', 
    name: 'Power Surge', 
    tiers: [{ tier: 1, target: 20000, description: 'Gain 20,000 Stat Points during your active service.', rarity: AchievementRarity.Rare, icon: 'TrendingUp' }] 
  },
  { 
    id: 'rare-05', 
    name: 'Lorekeeper', 
    tiers: [{ tier: 1, target: 20, description: 'Unlock 20 entries in Chapter Black.', rarity: AchievementRarity.Rare, icon: 'BookOpen' }] 
  },
  { 
    id: 'rare-06', 
    name: 'Deep Worker', 
    tiers: [{ tier: 1, target: 50, description: 'Complete 50 Focus Mode sessions.', rarity: AchievementRarity.Rare, icon: 'BrainCircuit' }] 
  },

  // --- Epic (Elite Performance) ---
  { 
    id: 'epic-01', 
    name: 'Centurion', 
    tiers: [{ tier: 1, target: 100, description: 'Maintain a 100-day daily completion streak.', rarity: AchievementRarity.Epic, icon: 'Award' }] 
  },
  { 
    id: 'epic-02', 
    name: 'Metamorphosis', 
    tiers: [{ tier: 1, target: 50000, description: 'Gain 50,000 Stat Points during your active service.', rarity: AchievementRarity.Epic, icon: 'TrendingUp' }] 
  },
  { 
    id: 'epic-03', 
    name: 'Protocol Master', 
    tiers: [{ tier: 1, target: 5, description: 'Evolve 5 distinct Protocols.', rarity: AchievementRarity.Epic, icon: 'Wrench' }] 
  },
  { 
    id: 'epic-04', 
    name: 'Nemesis', 
    tiers: [{ tier: 1, target: 1, description: 'Surpass The Forsaken in total stats for 3 consecutive days.', rarity: AchievementRarity.Epic, icon: 'UserMinus' }] 
  },
  { 
    id: 'epic-05', 
    name: 'Campaigner', 
    tiers: [{ tier: 1, target: 1, description: 'Complete an S-Tier Side Mission.', rarity: AchievementRarity.Epic, icon: 'Star' }] 
  },

  // --- Legendary (The Apex) ---
  { 
    id: 'legend-01', 
    name: 'The Immortal', 
    tiers: [{ tier: 1, target: 365, description: 'Maintain a 365-day daily completion streak.', rarity: AchievementRarity.Legendary, icon: 'CheckCircle' }] 
  },
  { 
    id: 'legend-02', 
    name: 'Singularity', 
    tiers: [{ tier: 1, target: 200000, description: 'Gain 200,000 Stat Points during your active service.', rarity: AchievementRarity.Legendary, icon: 'Gem' }] 
  },
  { 
    id: 'legend-03', 
    name: 'Grandmaster', 
    tiers: [{ tier: 1, target: 100, description: 'Complete 100 Side Missions.', rarity: AchievementRarity.Legendary, icon: 'Swords' }] 
  },
  { 
    id: 'legend-04', 
    name: 'Omega', 
    isSecret: true,
    tiers: [{ tier: 1, target: 1, description: 'Promote to Grade SS+ from a lower grade.', rarity: AchievementRarity.Legendary, icon: 'Zap' }] 
  },

  // --- Special / Cool (Hybrid & Mastery) ---
  {
    id: 'special-01',
    name: 'The Da Vinci',
    tiers: [{ tier: 1, target: 1, description: 'Achieve Grade B in Intelligence, Creativity, and Physical simultaneously.', rarity: AchievementRarity.Epic, icon: 'BrainCircuit' }]
  },
  {
    id: 'special-02',
    name: 'God Mode',
    tiers: [{ tier: 1, target: 1, description: 'Reach Grade SSS in any single Substat.', rarity: AchievementRarity.Legendary, icon: 'Zap' }]
  },
  {
    id: 'special-03',
    name: 'System Administrator',
    tiers: [{ tier: 1, target: 10, description: 'Recover 10 Data Fragments from the system.', rarity: AchievementRarity.Rare, icon: 'Database' }]
  },
  {
    id: 'special-04',
    name: 'Protocol Architect',
    tiers: [{ tier: 1, target: 5, description: 'Maintain 5 active Protocols simultaneously.', rarity: AchievementRarity.Rare, icon: 'Layers' }]
  },
  {
    id: 'special-05',
    name: 'The 1%',
    tiers: [{ tier: 1, target: 99, description: 'Achieve an Apex Threat Index (ATI) of 99% or higher.', rarity: AchievementRarity.Legendary, icon: 'Crosshair' }]
  },
  {
    id: 'special-06',
    name: 'Limit Break',
    tiers: [{ tier: 1, target: 1500, description: 'Push beyond your limits. Earn 1,500 XP in a single daily cycle.', rarity: AchievementRarity.Epic, icon: 'Zap' }]
  },
  {
    id: 'special-07',
    name: 'Equilibrium',
    tiers: [{ tier: 1, target: 1, description: 'Achieve perfect balance. Raise all 6 Attributes to Grade C or higher.', rarity: AchievementRarity.Rare, icon: 'Activity' }]
  },
  {
    id: 'special-08',
    name: 'Glass Cannon',
    tiers: [{ tier: 1, target: 1, description: 'Extreme specialization. Reach Grade S in one Attribute while another remains at Grade D or below.', rarity: AchievementRarity.Rare, icon: 'Crosshair' }]
  },
  {
    id: 'special-09',
    name: 'The Architect',
    tiers: [{ tier: 1, target: 3, description: 'Use Central to construct 3 custom protocols tailored to your needs.', rarity: AchievementRarity.Uncommon, icon: 'Cpu' }]
  },
  {
    id: 'special-10',
    name: 'Operator',
    tiers: [{ tier: 1, target: 500, description: 'Complete 500 total tasks during your service.', rarity: AchievementRarity.Rare, icon: 'CheckCircle' }]
  }
];
