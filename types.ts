
// types.ts

import React from 'react';

export type IconName = 'Activity' | 'Award' | 'BarChart2' | 'Book' | 'BookOpen' | 'BookText' | 'BrainCircuit' | 'Calendar' | 'Check' | 'ChevronsUp' | 'Database' | 'Feather' | 'Figma' | 'Gem' | 'Heart' | 'HeartPulse' | 'HelpCircle' | 'LayoutDashboard' | 'Leaf' | 'ListChecks' | 'ListTodo' | 'MapPin' | 'MessageSquare' | 'Mic' | 'Palette' | 'PersonStanding' | 'Send' | 'Shield' | 'Sparkles' | 'Star' | 'Swords' | 'Target' | 'TrendingUp' | 'UserMinus' | 'Users' | 'Wrench' | 'Zap' | 'Anchor' | 'BarChart' | 'Code' | 'Gamepad2' | 'Wind' | 'Flame' | 'CheckCircle' | 'Layers' | 'Clock' | 'Eye' | 'Unlock' | 'AlertTriangle' | 'Box' | 'Cpu' | 'Crosshair' | 'Terminal' | 'Droplets' | 'Footprints' | 'UtensilsCrossed' | 'Moon' | 'Binary' | 'ShieldAlert' | 'Lightbulb' | 'Music' | 'Hammer' | 'Scale' | 'Dna' | 'Globe';

export enum StatName {
  Physical = 'Physical',
  Vitality = 'Vitality',
  Intelligence = 'Intelligence',
  Creativity = 'Creativity',
  Spirit = 'Spirit',
  Psyche = 'Psyche',
}

export enum SubStatName {
  Strength = 'Strength',
  Speed = 'Speed',
  Endurance = 'Endurance',
  Dexterity = 'Dexterity',
  Agility = 'Agility',
  Stamina = 'Stamina',
  Regeneration = 'Regeneration',
  Adherence = 'Adherence',
  Balance = 'Balance',
  Longevity = 'Longevity',
  Reason = 'Reason',
  Knowledge = 'Knowledge',
  Adaptability = 'Adaptability',
  Strategy = 'Strategy',
  Perception = 'Perception',
  Imagination = 'Imagination',
  Innovation = 'Innovation',
  Style = 'Style',
  Expression = 'Expression',
  Vision = 'Vision',
  Faith = 'Faith',
  Purpose = 'Purpose',
  Tranquility = 'Tranquility',
  Empathy = 'Empathy',
  Conviction = 'Conviction',
  Resilience = 'Resilience',
  Charisma = 'Charisma',
  Focus = 'Focus',
  Willpower = 'Willpower',
  Composure = 'Composure',
}

export enum AttributeRankName {
    E = 'E',
    D = 'D',
    C = 'C',
    B = 'B',
    A = 'A',
    S = 'S',
    SS = 'SS',
    SS_PLUS = 'SS+',
}

export enum ProficiencyLevel {
    Novice = 'Novice',
    Intermediate = 'Intermediate',
    Advanced = 'Advanced',
    Master = 'Master'
}

export enum TaskType {
  Daily = 'Daily',
  Weekly = 'Weekly',
}

export enum ProtocolPhase {
    Morning = 'Morning',
    Growth = 'Growth',
    Nightly = 'Nightly',
    Void = 'Void'
}

export enum ResonanceType {
    Unawakened = 'Unawakened',
    Juggernaut = 'Juggernaut',
    Chameleon = 'Chameleon',
    Virtuoso = 'Virtuoso',
    Joker = 'Joker',
    Catalyst = 'Catalyst',
    Cipher = 'Cipher',
}

export type ResonanceVector = Record<ResonanceType, number>;

export enum AchievementRarity {
    Common = 'Common',
    Uncommon = 'Uncommon',
    Rare = 'Rare',
    Epic = 'Epic',
    Legendary = 'Legendary',
}

export type ToastType = 'success' | 'error' | 'info' | 'special';

export interface ToastNotification {
  id: number;
  message: string;
  type: ToastType;
}

export type LogType = 'SYSTEM' | 'COMBAT' | 'GROWTH' | 'WARNING' | 'NET';

export interface LogEntry {
    id: string;
    timestamp: string;
    type: LogType;
    message: string;
}

export interface Rank {
  name: AttributeRankName;
  threatLevel: string;
  attributeThreshold: number;
  timeEstimate: string;
  threatDescription: string;
}

export interface SubStat {
  name: SubStatName;
  value: number;
  rank: AttributeRankName;
  lastIncreased: string;
}

export interface Stat {
  name: StatName;
  value: number;
  rank: AttributeRankName;
  subStats: SubStat[];
  lastIncreased: string;
  decay?: {
    pointsLostToday: number;
    daysInactive: number;
  }
}

export interface Task {
  id: string;
  description: string;
  type: TaskType;
  phase?: ProtocolPhase;
  xp: number;
  statBoost: {
    stat: StatName;
    subStat: SubStatName;
    amount: number;
  };
  isCompleted: boolean;
  lastCompleted?: string;
  isNonNegotiable?: boolean;
}

export interface Path {
  id: string;
  name: string;
  description: string;
  icon: IconName;
  phase?: ProtocolPhase;
  tier: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
  tasks: Task[];
  specializationId?: string;
  proficiency?: ProficiencyLevel;
}

export interface VoidHabit {
    id: string;
    name: string;
    severity: 'Amber' | 'Red';
}

export interface Mission {
    id: string;
    title: string;
    description: string;
    xp: number;
    statBoost: {
        stat: StatName;
        subStat?: SubStatName;
        amount: number;
    };
    isCompleted: boolean;
    completedAt?: string;
    isPromotionExam?: boolean;
    benchmarkTarget?: {
        metric: string;
        targetValue: number;
        currentBaseline: number;
        originalPercentile: number;
        targetPercentile: number;
    };
    expiresAt?: string;
}

export interface PromotionExam {
    missionId: string;
    targetRank: AttributeRankName;
    objectives: {
        description: string;
        isCompleted: boolean;
    }[];
}

export interface JournalEntry {
    id: string;
    date: string;
    title: string;
    content: string;
    isApexFeat?: boolean;
}

export interface LoreEntry {
    id: string;
    date: string;
    chapterNumber: number;
    title: string;
    content: string;
    choices?: string[] | null;
    userChoice?: string;
}

export interface CodexCategory {
    id: string;
    title: string;
    description: string;
    entries: CodexEntry[];
}

export interface CodexEntry {
    id: string;
    title: string;
    content: string;
    requiredRank?: AttributeRankName;
    isRandomUnlock?: boolean;
    author?: string;
    date?: string;
    type?: string;
}

export interface StatSnapshot {
    date: string;
    stats: Record<StatName, number>;
    sleepScore?: number;
    sleepHours?: number;
    weightKg?: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
}

export interface PlannedTask {
    hour: number;
    taskId: string;
    pathId: string;
}

export interface ForsakenState {
    stats: { name: StatName, value: number }[];
    baseStats: { name: StatName, value: number }[];
    dailyCompletionTarget: number;
    focusStat: StatName;
}

export type SpecialEventType = {
    type: 'rankUp';
    rank: Rank;
} | {
    type: 'resonanceAwakened';
    profile: ResonanceSignature;
} | {
    type: 'milestoneAchieved';
    metric: string;
    value: number;
};

export interface ResonanceSignature {
    type: ResonanceType;
    tier: number;
    rankBand: string;
    awakened: boolean;
    description: string;
    auraManifestation: string;
    traits: string[];
    signatureAbility: string;
    domain: string;
    statAffinities: StatName[];
}

export interface UnlockedAchievement {
    id: string;
    highestTier: number;
    unlockedAt: string;
}

export interface AchievementTier {
    tier: number;
    target: number;
    description: string;
    rarity: AchievementRarity;
    icon: IconName;
}

export interface Achievement {
    id: string;
    name: string;
    isSecret?: boolean;
    tiers: AchievementTier[];
}

export interface TalentDna {
    BP: number; 
    LV: number; 
    DR: number; 
}

export interface TraitScores {
    IP: number; 
    LE: number; 
    RE: number; 
    FO: number; 
    EX: number; 
    CO: number; 
}

export type TalentClass = 'Laggard' | 'Average' | 'Talented Learner' | 'Gifted' | 'Genius';
export type ObsessionLevel = 'Lazy' | 'Average' | 'Locked-In' | 'Relentless' | 'Compulsive';

export interface TraitAnalysisResult {
    talentClass: TalentClass;
    obsessionLevel: ObsessionLevel;
    archetypeTitle: string;
    rarity: string;
    traitScores: TraitScores;
}

export interface FullCalibrationReport extends TraitAnalysisResult {
    codename: string;
    mbtiProfile: string;
    symbolicProfile: string;
    threatLevel: string;
    foreshadowing: string;
    ceilingRarity: string;
    deviation: string;
    notes: string;
    resonanceStability: string;
    centralInsight: string;
    rarityBand: 'Singularity' | 'Outlier' | 'Abnormality' | 'Exceptional' | 'Optimized';
    candidateTitles: { title: string; justification: string }[];
    tpi: number;
    percentile: number;
    overallRank: AttributeRankName;
    initialStatsSnapshot: Stat[];
    estimatedCeilingRank: AttributeRankName;
    talentDna: TalentDna;
    primaryFailureNode: string;
    failureNodeRisk: string;
    successProbability: number;
    dropoutProbability: number;
    historicalPrecedent: {
        name: string;
        matchPercentage: number;
        alignment: string;
    };
    biometricModifiers: {
        label: string;
        impact: string;
        value: string;
    }[];
    noteworthyFeats?: {
        label: string;
        value: string;
        rarity: 'Common' | 'Elite' | 'Mythic';
        desc: string;
    }[];
}

export interface TaskReport {
    type: 'BINARY' | 'NON_BINARY';
    metricValue?: number;
    metricUnit?: string;
    intent?: string;
    action?: string;
    outcome?: string;
    lessons?: string;
}

export interface EvaluationResult {
    pass: boolean;
    xpAwarded: number;
    statAmount: number;
    critique: string;
    newBenchmark?: number;
}

export interface NutritionAnalysis {
    isClean: boolean;
    explanation: string;
    estimatedMacros: {
        calories: number;
        protein: number;
        carbs: number;
        fats: number;
    };
}

export interface DailyMetrics {
    waterIntake: number; 
    steps: number;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    sleepScore: number;
    sleepHours: number;
    weightKg: number;
    immersionHours: number; // Daily immersion log
}

export interface LabyrinthSubtest {
    id: string;
    title: string;
    description: string;
    uiMode: 'logic_grid' | 'flux_reaction' | 'stress_clock' | 'incentive_gamble' | 'trust_signal' | 'zero_sum';
    substats: SubStatName[];
    rounds?: number;
    config?: any;
}

export interface LabyrinthFloor {
    id: string;
    title: string;
    subtitle: string;
    coreConcepts: string[];
    subtests: LabyrinthSubtest[];
}

export interface HabitHistoryRecord {
    [date: string]: {
        [habitId: string]: boolean | 'breach'; // true = completed/avoided, false = missed, 'breach' = void habit triggered
    }
}

export interface GameState {
    userName: string;
    hasOnboarded: boolean;
    rank: Rank;
    xp: number;
    stats: Stat[];
    initialStatsSnapshot: Stat[] | null;
    paths: Path[];
    voidHabits: VoidHabit[];
    habitHistory: HabitHistoryRecord;
    dailyNotes: Record<string, string>; // 1-sentence highlights for the Ledger
    missions: Mission[];
    promotionExam: PromotionExam | null;
    sideMissions: SideMission[];
    journal: JournalEntry[]; // Deep long-form reflections
    lore: LoreEntry[];
    unlockedCodexEntryIds: string[];
    unlockedAchievements: UnlockedAchievement[];
    codex: CodexCategory[];
    chapterBlack: {
        isUnlockedToday: boolean;
        dailyTaskCompletionPercentage: number;
        hasHadRandomLoreDropToday: boolean;
    };
    resonanceSignature: ResonanceSignature;
    resonanceVector?: ResonanceVector;
    statHistory: StatSnapshot[];
    chatSessions: ChatSession[];
    weeklyPlan: Record<number, PlannedTask[]>;
    forsaken: ForsakenState;
    currentStreak: number;
    longestStreak: number;
    dailyXpGain: number;
    totalTasksCompleted: number;
    isTourActive: boolean;
    tourStep: number;
    specialEvent: SpecialEventType | null;
    calibrationAnalysis?: FullCalibrationReport;
    notificationPermission: 'default' | 'granted' | 'denied';
    talentDna?: TalentDna;
    archetypeTitle?: string;
    biometrics?: any;
    logs: LogEntry[];
    benchmarks: Record<string, number>;
    dailyMetrics: DailyMetrics;
    totalImmersionHours: number; // Cumulative for Dreaming Spanish level tracking
}

export interface PresetProtocol {
    id: string;
    name: string;
    description: string;
    icon: IconName;
    primaryStat: StatName;
    phase: ProtocolPhase;
    isNonNegotiable?: boolean;
    specializationId?: string;
}

export interface SideMissionObjective {
    description: string;
    isCompleted: boolean;
    type: 'action' | 'counter' | 'outcome';
    target?: number;
    current?: number;
}

export interface SideMissionStage {
    title: string;
    description: string;
    objectives: SideMissionObjective[];
    isCompleted: boolean;
}

export interface SideMission {
    id: string;
    title: string;
    userDescription: string;
    tier: 'D' | 'C' | 'B' | 'A' | 'S';
    xp: number;
    statBoost: {
        stat: StatName;
        subStat: SubStatName;
        amount: number;
    };
    stages: SideMissionStage[];
    status: 'Active' | 'Completed';
    createdAt: string;
    estimatedCompletionTime: string;
}

export interface CalibrationBenchmark {
    id: string;
    type: string;
    title: string;
    prompt?: string;
    questions?: any[];
}

export interface Hobby {
    name: string;
    category: string;
    proficiency: string;
    substats: SubStatName[];
}

export type GameAction =
  | { type: 'SET_STATE'; payload: GameState }
  | { type: 'COMPLETE_TASK'; payload: { pathId: string; taskId: string; evaluation?: EvaluationResult } }
  | { type: 'DAILY_RESET' }
  | { type: 'ADD_PATH'; payload: Path }
  | { type: 'DELETE_PATH'; payload: string }
  | { type: 'UPDATE_PATH'; payload: { pathId: string; updates: Partial<Path> } }
  | { type: 'EVOLVE_PATH'; payload: { pathId: string; newPathData: { name: string; description: string; tasks: Omit<Task, 'id' | 'isCompleted' | 'lastCompleted'>[] } } }
  | { type: 'ADD_TASK_TO_PATH'; payload: { pathId: string; task: Task } }
  | { type: 'UPDATE_TASKS_FOR_PATH'; payload: { pathId: string; tasks: Task[] } }
  | { type: 'DELETE_TASK_FROM_PATH'; payload: { pathId: string; taskId: string } }
  | { type: 'TOGGLE_HISTORICAL_HABIT'; payload: { date: string; habitId: string; status: boolean | 'breach' } }
  | { type: 'SET_DAILY_NOTE'; payload: { date: string; note: string } }
  | { type: 'ADD_VOID_HABIT'; payload: VoidHabit }
  | { type: 'DELETE_VOID_HABIT'; payload: string }
  | { type: 'START_NEW_CHAT'; payload: ChatSession }
  | { type: 'ADD_MESSAGE_TO_CHAT'; payload: { sessionId: string; message: ChatMessage } }
  | { type: 'SET_CHAT_TITLE'; payload: { sessionId: string; title: string } }
  | { type: 'DELETE_CHAT'; payload: string }
  | { type: 'APPLY_SCHEDULE'; payload: { dayOfWeek: number; schedule: PlannedTask[] } }
  | { type: 'SET_FULL_SCHEDULE'; payload: Record<number, PlannedTask[]> }
  | { type: 'ADD_MISSION'; payload: Mission }
  | { type: 'COMPLETE_MISSION'; payload: { missionId: string; evaluation?: EvaluationResult } }
  | { type: 'SET_PROMOTION_EXAM'; payload: { mission: Mission; exam: PromotionExam } }
  | { type: 'UPDATE_PROMOTION_EXAM_OBJECTIVE'; payload: { objectiveIndex: number; isCompleted: boolean } }
  | { type: 'COMPLETE_PROMOTION_EXAM'; payload: { nextRank: Rank; newProfile?: ResonanceSignature } }
  | { type: 'ADD_JOURNAL_ENTRY'; payload: JournalEntry }
  | { type: 'ADD_LORE_ENTRY'; payload: LoreEntry }
  | { type: 'MAKE_STORY_CHOICE'; payload: { chapterId: string; choice: string } }
  | { type: 'FLAG_LORE_DROP' }
  | { type: 'ADD_SIDE_MISSION'; payload: SideMission }
  | { type: 'DELETE_SIDE_MISSION'; payload: { missionId: string } }
  | { type: 'COMPLETE_SIDE_MISSION'; payload: { missionId: string; evaluation?: EvaluationResult } }
  | { type: 'UPDATE_SIDE_MISSION_OBJECTIVE'; payload: { missionId: string; stageIndex: number; objectiveIndex: number; isCompleted: boolean } }
  | { type: 'INCREMENT_SIDE_MISSION_COUNTER'; payload: { missionId: string; stageIndex: number; objectiveIndex: number; amount: number } }
  | { type: 'INSERT_SIDE_MISSION_STAGE'; payload: { missionId: string; afterStageIndex: number; newStage: SideMissionStage } }
  | { type: 'APPLY_STAT_BOOST'; payload: { stat: StatName; subStat: SubStatName | undefined; amount: number } }
  | { type: 'UPDATE_FORSAKEN_STATS'; payload: { name: StatName, value: number }[] }
  | { type: 'ADD_CODEX_ENTRY'; payload: { categoryId: string; entry: CodexEntry } }
  | { type: 'UNLOCK_ACHIEVEMENT_TIER'; payload: { achievementId: string; tier: number } }
  | { type: 'START_TOUR' }
  | { type: 'NEXT_TOUR_STEP' }
  | { type: 'END_TOUR' }
  | { type: 'TRIGGER_SPECIAL_EVENT'; payload: SpecialEventType }
  | { type: 'DISMISS_SPECIAL_EVENT' }
  | { type: 'SET_NOTIFICATION_PERMISSION'; payload: 'default' | 'granted' | 'denied' }
  | { type: 'ADD_LOG'; payload: LogEntry }
  | { type: 'UPDATE_DAILY_METRICS'; payload: Partial<DailyMetrics> };
