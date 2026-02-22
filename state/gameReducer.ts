// state/gameReducer.ts

import { GameState, GameAction, Task, Path, ChatSession, ChatMessage, PlannedTask, StatName, SubStatName, JournalEntry, SideMission, LoreEntry, Mission, PromotionExam, TaskType, ResonanceSignature, Rank, CodexEntry, AttributeRankName, SideMissionStage, UnlockedAchievement, StatSnapshot, ProtocolPhase, ProficiencyLevel } from '../types';
import { RANKS, ATTRIBUTE_RANKS, DECAY_CONSTANTS, getRankForSubstatValue, getRankForMainStatValue, SUBSTAT_PROGRESSION_RATES, calculateXpForNextLevel, FORSAKEN_BASE_DAILY_POTENTIAL } from '../constants';
import { CODEX_CATEGORIES } from '../data/codexData';
import { calculateScores, mapScoreToRank, driftResonance } from '../services/scoringService';
import { TIERED_PROTOCOL_TASKS } from '../data/presetProtocolTasks';

// Utility: Get ISO week key (e.g., "2026-W05")
const getWeekKey = (date: Date = new Date()): string => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    return `${d.getUTCFullYear()}-W${weekNo.toString().padStart(2, '0')}`;
};

const getPrimaryAttributeForPath = (path: Path): StatName | null => {
    if (!path.tasks || path.tasks.length === 0) return null;
    const boostCounts: Record<string, number> = {};
    for (const task of path.tasks) {
        boostCounts[task.statBoost.stat] = (boostCounts[task.statBoost.stat] || 0) + task.statBoost.amount;
    }
    let primaryStat: StatName | null = null;
    let maxBoost = -1;
    for (const entry of Object.entries(boostCounts)) {
        const [stat, count] = entry;
        if (count > maxBoost) {
            maxBoost = count;
            primaryStat = stat as StatName;
        }
    }
    return primaryStat;
};

export const calculateTaskRewards = (gameState: GameState, path: Path, task: Task): { finalXpGained: number, finalStatAmountGained: number, diminishingReturnMultiplier: number } => {
    const { subStat, amount } = task.statBoost;
    let diminishingReturnMultiplier = 1.0;
    const primaryAttr = getPrimaryAttributeForPath(path);
    if (primaryAttr) {
        const pathCount = gameState.paths.filter(p => getPrimaryAttributeForPath(p) === primaryAttr).length;
        if (pathCount === 2) diminishingReturnMultiplier = 0.9;
        else if (pathCount === 3) diminishingReturnMultiplier = 0.75;
        else if (pathCount >= 4) diminishingReturnMultiplier = 0.6;
    }
    const progressionRate = subStat ? (SUBSTAT_PROGRESSION_RATES[subStat] ?? 1.0) : 1.0;
    const finalXpGained = Math.round(task.xp * diminishingReturnMultiplier);
    const finalStatAmountGained = Math.round(amount * diminishingReturnMultiplier * progressionRate);
    return { finalXpGained, finalStatAmountGained, diminishingReturnMultiplier };
};

const calculateOverallRank = (stats: GameState['stats']): Rank => {
    if (!stats || stats.length === 0) return RANKS[0];
    const { apexThreatIndex } = calculateScores(stats);
    const rankName = mapScoreToRank(apexThreatIndex);
    const rankData = RANKS.find(r => r.name === rankName);
    return rankData || RANKS[0];
};

const applyStatBoost = (stats: GameState['stats'], statName: StatName, subStatName: SubStatName | undefined, amount: number): GameState['stats'] => {
    return stats.map(stat => {
        if (stat.name === statName) {
            const newSubStats = [...stat.subStats];
            let applied = false;
            if (subStatName) {
                const subStatIndex = newSubStats.findIndex(ss => ss.name === subStatName);
                if (subStatIndex > -1) {
                    const newSubStatValue = Math.max(0, newSubStats[subStatIndex].value + amount);
                    newSubStats[subStatIndex] = { 
                        ...newSubStats[subStatIndex], 
                        value: newSubStatValue,
                        rank: getRankForSubstatValue(newSubStatValue, newSubStats[subStatIndex].name)
                    };
                    applied = true;
                }
            }
            if (!applied && newSubStats.length > 0) {
                 const amountToDistribute = Math.round(amount);
                 if (amountToDistribute > 0) {
                    for (let i = 0; i < amountToDistribute; i++) {
                        const randomIndex = Math.floor(Math.random() * newSubStats.length);
                        const currentSubStat = newSubStats[randomIndex];
                        const newSubSubStatValue = currentSubStat.value + 1;
                        newSubStats[randomIndex] = { ...currentSubStat, value: newSubSubStatValue, rank: getRankForSubstatValue(newSubSubStatValue, currentSubStat.name) };
                    }
                 } else {
                    for (let i = 0; i > amountToDistribute; i--) {
                        const eligible = newSubStats.map((ss, i) => ({...ss, i})).filter(ss => ss.value > 0);
                        if (eligible.length > 0) {
                            const randomEligible = eligible[Math.floor(Math.random() * eligible.length)];
                            const newSubSubStatValue = randomEligible.value - 1;
                            newSubStats[randomEligible.i] = { ...newSubStats[randomEligible.i], value: newSubSubStatValue, rank: getRankForSubstatValue(newSubSubStatValue, newSubStats[randomEligible.i].name) };
                        }
                    }
                 }
            }
            const newValue = newSubStats.reduce((sum, ss) => sum + ss.value, 0);
            return { ...stat, value: newValue, rank: getRankForMainStatValue(newValue, stat.name), subStats: newSubStats, lastIncreased: amount > 0 ? new Date().toISOString() : stat.lastIncreased };
        }
        return stat;
    });
};

export function gameReducer(state: GameState | null, action: GameAction): GameState | null {
  if (action.type === 'SET_STATE') {
    const payload = action.payload as GameState | null;
    if (payload) {
      return {
        ...payload,
        statHistory: payload.statHistory || [],
        stats: payload.stats || [],
        paths: payload.paths || [],
        missions: payload.missions || [],
        sideMissions: payload.sideMissions || [],
        journal: payload.journal || [],
        lore: payload.lore || [],
        chatSessions: payload.chatSessions || [],
        unlockedCodexEntryIds: payload.unlockedCodexEntryIds || [],
        unlockedAchievements: payload.unlockedAchievements || [],
        voidHabits: payload.voidHabits || [],
        logs: payload.logs || [],
        benchmarkMetrics: payload.benchmarkMetrics || [],
        statProgressionHistory: payload.statProgressionHistory || [],
        weeklyTaskHistory: payload.weeklyTaskHistory || {},
        // NEW: ensure protocol breach ledger is initialised on load
        protocolBreachHistory: payload.protocolBreachHistory || {},
        dailySystemsSummaries: payload.dailySystemsSummaries || [],
      };
    }
    return payload;
  }
  if (state === null) return null;

  let newState: GameState = { ...state };
  const todayStr = new Date().toISOString().split('T')[0];

  switch (action.type) {
    case 'ADD_LOG': {
      const currentLogs = state.logs || [];
      newState.logs = [action.payload, ...currentLogs].slice(0, 100);
      break;
    }
    case 'APPLY_SCHEDULE': {
        newState.weeklyPlan = {
            ...state.weeklyPlan,
            [action.payload.dayOfWeek]: action.payload.schedule
        };
        break;
    }
    case 'SET_FULL_SCHEDULE': {
        newState.weeklyPlan = action.payload;
        break;
    }
    case 'COMPLETE_TASK': {
        let newXp = state.xp;
        let newStats = state.stats;
        let completedPath: Path | undefined;
        let earnedXp = 0;
        let evolved = false;
        let evolvedPathName = '';
        let newProficiency: ProficiencyLevel | undefined;

        newState.paths = state.paths.map(p => {
            if (p.id === action.payload.pathId) {
                completedPath = p;
                const task = p.tasks.find(t => t.id === action.payload.taskId);
                if (task && !task.isCompleted) {
                    let { finalXpGained, finalStatAmountGained } = action.payload.evaluation 
                        ? { finalXpGained: action.payload.evaluation.xpAwarded, finalStatAmountGained: action.payload.evaluation.statAmount }
                        : calculateTaskRewards(state, p, task);
                    newXp += finalXpGained;
                    earnedXp = finalXpGained;
                    newStats = applyStatBoost(newStats, task.statBoost.stat, task.statBoost.subStat, finalStatAmountGained);
                    let newPathXp = p.xp + finalXpGained;
                    let newPathLevel = p.level;
                    let newXpToNext = p.xpToNextLevel;
                    
                    const oldLevel = p.level;
                    while (newPathXp >= newXpToNext) {
                        newPathXp -= newXpToNext;
                        newPathLevel++;
                        newXpToNext = calculateXpForNextLevel(newPathLevel);
                    }
                    
                    let newTasks = p.tasks.map(t => t.id === action.payload.taskId ? { ...t, isCompleted: true, lastCompleted: new Date().toISOString() } : t);
                    newProficiency = p.proficiency;

                    // REALISTIC EVOLUTION: Every 10 levels across 8 tiers
                    // L10 → Novice+, L20 → Intermediate, L30 → Intermediate+, L40 → Advanced, L50 → Advanced+, L60 → Master, L70 → Master+
                    if (newPathLevel > oldLevel && newPathLevel % 10 === 0) {
                        evolved = true;
                        evolvedPathName = p.name;
                        
                        if (p.specializationId && TIERED_PROTOCOL_TASKS[p.specializationId]) {
                            const tiers = TIERED_PROTOCOL_TASKS[p.specializationId];
                            const currentProf = p.proficiency || ProficiencyLevel.Novice;
                            
                            // 8-tier progression
                            if (currentProf === ProficiencyLevel.Novice) newProficiency = ProficiencyLevel.NovicePlus;
                            else if (currentProf === ProficiencyLevel.NovicePlus) newProficiency = ProficiencyLevel.Intermediate;
                            else if (currentProf === ProficiencyLevel.Intermediate) newProficiency = ProficiencyLevel.IntermediatePlus;
                            else if (currentProf === ProficiencyLevel.IntermediatePlus) newProficiency = ProficiencyLevel.Advanced;
                            else if (currentProf === ProficiencyLevel.Advanced) newProficiency = ProficiencyLevel.AdvancedPlus;
                            else if (currentProf === ProficiencyLevel.AdvancedPlus) newProficiency = ProficiencyLevel.Master;
                            else if (currentProf === ProficiencyLevel.Master) newProficiency = ProficiencyLevel.MasterPlus;

                            if (newProficiency && tiers[newProficiency]) {
                                newTasks = tiers[newProficiency].map((t, i) => ({
                                    ...t,
                                    id: `task-auto-evolve-${Date.now()}-${i}`,
                                    isCompleted: false
                                }));
                            }
                        }
                    }

                    // Track completion in appropriate history
                    if (task.type === TaskType.Weekly) {
                        const currentWeek = getWeekKey();
                        const weekHistory = newState.weeklyTaskHistory[currentWeek] || {};
                        newState.weeklyTaskHistory[currentWeek] = { ...weekHistory, [task.id]: true };
                    } else {
                        const currentDayHistory = newState.habitHistory[todayStr] || {};
                        newState.habitHistory[todayStr] = { ...currentDayHistory, [task.id]: true };
                    }

                    // PROTOCOL TRACKING: Update metrics and history
                    const protocolId = p.id;
                    const protocolName = p.name;
                    const category = p.specializationId || 'custom';
                    
                    // Update or create protocol metrics
                    const existingMetricIndex = newState.protocolMetrics.findIndex(m => m.protocolId === protocolId);
                    const now = new Date().toISOString();
                    
                    if (existingMetricIndex >= 0) {
                        const metric = newState.protocolMetrics[existingMetricIndex];
                        const lastCompletedDate = metric.lastCompleted ? new Date(metric.lastCompleted) : null;
                        const today = new Date();
                        const isConsecutiveDay = lastCompletedDate && 
                            (today.getTime() - lastCompletedDate.getTime()) <= 86400000 * 2 && // Within 2 days
                            today.toDateString() !== lastCompletedDate.toDateString();
                        
                        newState.protocolMetrics[existingMetricIndex] = {
                            ...metric,
                            totalCompletions: metric.totalCompletions + 1,
                            currentStreak: isConsecutiveDay ? metric.currentStreak + 1 : 1,
                            bestStreak: Math.max(metric.bestStreak, isConsecutiveDay ? metric.currentStreak + 1 : 1),
                            lastCompleted: now,
                        };
                    } else {
                        newState.protocolMetrics.push({
                            protocolId,
                            protocolName,
                            category,
                            totalCompletions: 1,
                            currentStreak: 1,
                            bestStreak: 1,
                            completionRate: 0,
                            lastCompleted: now,
                            weeklyCompletions: [1, 0, 0, 0, 0, 0, 0, 0],
                            firstCompleted: now,
                        });
                    }

                    // Update protocol history for today
                    const existingHistoryIndex = newState.protocolHistory.findIndex(h => h.date === todayStr);
                    const completionData = {
                        protocolId,
                        protocolName,
                        xp: finalXpGained,
                        statBoost: task.statBoost,
                    };
                    
                    if (existingHistoryIndex >= 0) {
                        const history = newState.protocolHistory[existingHistoryIndex];
                        newState.protocolHistory[existingHistoryIndex] = {
                            ...history,
                            protocolsCompleted: [...history.protocolsCompleted, completionData],
                            totalXp: history.totalXp + finalXpGained,
                            dailyCompletionCount: history.dailyCompletionCount + 1,
                        };
                    } else {
                        newState.protocolHistory.push({
                            date: todayStr,
                            protocolsCompleted: [completionData],
                            totalXp: finalXpGained,
                            dailyCompletionCount: 1,
                        });
                    }
                    
                    return { ...p, level: newPathLevel, xp: newPathXp, xpToNextLevel: newXpToNext, tasks: newTasks, proficiency: newProficiency };
                }
            }
            return p;
        });

        if (evolved) {
            newState.logs = [{
                id: Date.now().toString(),
                timestamp: new Date().toISOString(),
                type: 'SYSTEM',
                message: `EVOLUTION BREAKTHROUGH: Protocol "${evolvedPathName}" has hit Level ${Math.floor(newState.paths.find(p=>p.name===evolvedPathName)?.level || 0)}. Proficiency upgraded to ${newProficiency}. Tasks recalibrated.`
            }, ...newState.logs];
        }

        if (completedPath) newState.resonanceVector = driftResonance(state.resonanceVector, 'complete_task', { path: completedPath });
        newState.xp = newXp;
        newState.stats = newStats;
        newState.dailyXpGain = (state.dailyXpGain || 0) + earnedXp;
        newState.totalTasksCompleted++;

        // Calculate daily task completion percentage for Chapter Black
        const allTasks = newState.paths.flatMap(p => p.tasks);
        const completedTasks = allTasks.filter(t => t.isCompleted).length;
        const completionPercentage = allTasks.length > 0 ? Math.round((completedTasks / allTasks.length) * 100) : 0;
        newState.chapterBlack = { ...state.chapterBlack, dailyTaskCompletionPercentage: completionPercentage };
        break;
    }
    case 'INCREMENT_WEEKLY_TASK': {
        let newXp = state.xp;
        let newStats = state.stats;
        let completedPath: Path | undefined;
        let earnedXp = 0;

        newState.paths = state.paths.map(p => {
            if (p.id === action.payload.pathId) {
                completedPath = p;
                const task = p.tasks.find(t => t.id === action.payload.taskId);
                
                if (task && task.type === TaskType.Weekly && task.targetCount) {
                    const newCount = (task.currentCount || 0) + 1;
                    const targetCount = task.targetCount;
                    
                    // Award partial XP for each completion
                    const partialXp = Math.round(task.xp / targetCount);
                    const partialStatBoost = Math.round(task.statBoost.amount / targetCount);
                    
                    let { finalXpGained, finalStatAmountGained } = calculateTaskRewards(state, p, {
                        ...task,
                        xp: partialXp,
                        statBoost: { ...task.statBoost, amount: partialStatBoost }
                    });
                    
                    newXp += finalXpGained;
                    earnedXp = finalXpGained;
                    newStats = applyStatBoost(newStats, task.statBoost.stat, task.statBoost.subStat, finalStatAmountGained);
                    
                    // Update path XP
                    let newPathXp = p.xp + finalXpGained;
                    let newPathLevel = p.level;
                    let newXpToNext = p.xpToNextLevel;
                    
                    const oldLevel = p.level;
                    while (newPathXp >= newXpToNext) {
                        newPathXp -= newXpToNext;
                        newPathLevel++;
                        newXpToNext = calculateXpForNextLevel(newPathLevel);
                    }
                    
                    // Mark as completed if target reached
                    const isNowCompleted = newCount >= targetCount;

                    // PROTOCOL TRACKING: Update metrics and history for weekly task increment
                    const protocolId = p.id;
                    const protocolName = p.name;
                    const category = p.specializationId || 'custom';
                    const now = new Date().toISOString();
                    
                    // Update or create protocol metrics
                    const existingMetricIndex = newState.protocolMetrics.findIndex(m => m.protocolId === protocolId);
                    
                    if (existingMetricIndex >= 0) {
                        const metric = newState.protocolMetrics[existingMetricIndex];
                        newState.protocolMetrics[existingMetricIndex] = {
                            ...metric,
                            totalCompletions: metric.totalCompletions + 1,
                            lastCompleted: now,
                        };
                    } else {
                        newState.protocolMetrics.push({
                            protocolId,
                            protocolName,
                            category,
                            totalCompletions: 1,
                            currentStreak: 0,
                            bestStreak: 0,
                            completionRate: 0,
                            lastCompleted: now,
                            weeklyCompletions: [1, 0, 0, 0, 0, 0, 0, 0],
                            firstCompleted: now,
                        });
                    }

                    // Update protocol history for today
                    const existingHistoryIndex = newState.protocolHistory.findIndex(h => h.date === todayStr);
                    const completionData = {
                        protocolId,
                        protocolName,
                        xp: finalXpGained,
                        statBoost: { ...task.statBoost, amount: partialStatBoost },
                    };
                    
                    if (existingHistoryIndex >= 0) {
                        const history = newState.protocolHistory[existingHistoryIndex];
                        newState.protocolHistory[existingHistoryIndex] = {
                            ...history,
                            protocolsCompleted: [...history.protocolsCompleted, completionData],
                            totalXp: history.totalXp + finalXpGained,
                            dailyCompletionCount: history.dailyCompletionCount + 1,
                        };
                    } else {
                        newState.protocolHistory.push({
                            date: todayStr,
                            protocolsCompleted: [completionData],
                            totalXp: finalXpGained,
                            dailyCompletionCount: 1,
                        });
                    }
                    
                    const updatedTasks = p.tasks.map(t => 
                        t.id === action.payload.taskId 
                            ? { ...t, currentCount: newCount, isCompleted: isNowCompleted, lastCompleted: new Date().toISOString() }
                            : t
                    );
                    
                    return { ...p, level: newPathLevel, xp: newPathXp, xpToNextLevel: newXpToNext, tasks: updatedTasks };
                }
            }
            return p;
        });

        if (completedPath) newState.resonanceVector = driftResonance(state.resonanceVector, 'complete_task', { path: completedPath });
        newState.xp = newXp;
        newState.stats = newStats;
        newState.dailyXpGain = (state.dailyXpGain || 0) + earnedXp;
        newState.totalTasksCompleted++;
        
        break;
    }
    case 'TOGGLE_HISTORICAL_HABIT': {
        const { date, habitId, status } = action.payload;
        const currentDayHistory = newState.habitHistory[date] || {};
        const oldStatus = currentDayHistory[habitId];
        newState.habitHistory[date] = { ...currentDayHistory, [habitId]: status };
        
        if (status === 'breach' && oldStatus !== 'breach') {
            newState.stats = applyStatBoost(newState.stats, StatName.Psyche, SubStatName.Willpower, -20);
            newState.logs = [{ id: Date.now().toString(), timestamp: new Date().toISOString(), type: 'WARNING', message: 'VOID BREACH: Willpower penalty applied.' }, ...newState.logs];
        } else if (status === true && oldStatus !== true) {
            newState.stats = applyStatBoost(newState.stats, StatName.Spirit, SubStatName.Purpose, 5);
        }
        break;
    }
    case 'SET_DAILY_NOTE': {
        const { date, note } = action.payload;
        newState.dailyNotes = { ...state.dailyNotes, [date]: note };
        break;
    }
    case 'ADD_VOID_HABIT':
        newState.voidHabits = [...(state.voidHabits || []), action.payload];
        break;
    case 'DELETE_VOID_HABIT':
        newState.voidHabits = (state.voidHabits || []).filter(v => v.id !== action.payload);
        break;
    case 'DAILY_RESET': {
        const now = new Date();
        const isMonday = now.getDay() === 1; // 1 is Monday
        
        const lastDayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        const lastDayHistory = newState.habitHistory[lastDayStr] || {};
        
        const activeTasks = state.paths.flatMap(p => p.tasks);
        activeTasks.forEach(task => {
            if (lastDayHistory[task.id] === undefined) {
                lastDayHistory[task.id] = task.isCompleted;
            }
        });
        
        (state.voidHabits || []).forEach(vh => {
            if (lastDayHistory[vh.id] === undefined) {
                lastDayHistory[vh.id] = true; 
            }
        });
        
        newState.habitHistory[lastDayStr] = lastDayHistory;

        const snapshot: StatSnapshot = { 
            date: new Date().toISOString(), 
            stats: state.stats.reduce((acc, s) => ({...acc, [s.name]: s.value}), {} as Record<StatName, number>),
            sleepScore: state.dailyMetrics.sleepScore || 70,
            sleepHours: state.dailyMetrics.sleepHours || 7,
            weightKg: state.dailyMetrics.weightKg || 0
        };
        newState.statHistory = [...state.statHistory, snapshot];

        // LOGIC: Clear Daily tasks every day at midnight. Clear Weekly tasks ONLY on Monday at midnight.
        newState.paths = state.paths.map(p => ({ 
            ...p, 
            tasks: p.tasks.map(t => {
                // Check if snoozed task should be unsnoozed
                let unsnoozed = t;
                if (t.isSnoozed && t.snoozedUntil) {
                    const snoozedUntilDate = new Date(t.snoozedUntil);
                    if (now >= snoozedUntilDate) {
                        unsnoozed = { ...t, isSnoozed: false, snoozedUntil: undefined };
                    }
                }
                
                if (unsnoozed.type === TaskType.Weekly) {
                    // On Monday at midnight, reset both completion AND counter for weekly tasks
                    if (isMonday) {
                        return { ...unsnoozed, isCompleted: false, currentCount: 0 };
                    }
                    // Not Monday, keep weekly task state as-is
                    return unsnoozed;
                }
                // Daily tasks always reset at midnight
                return { ...unsnoozed, isCompleted: false };
            }) 
        }));

        newState.dailyMetrics = {
            waterIntake: 0, steps: 0, calories: 0, protein: 0, carbs: 0, fats: 0, immersionHours: 0,
            sleepScore: state.dailyMetrics.sleepScore, sleepHours: state.dailyMetrics.sleepHours, weightKg: state.dailyMetrics.weightKg
        };
        newState.waterGoalReachedToday = false;
        newState.stepGoalReachedToday = false;
        newState.dailyXpGain = 0;
        
        // Reset Chapter Black daily flags
        newState.chapterBlack = {
            ...state.chapterBlack,
            isUnlockedToday: false,
            hasHadRandomLoreDropToday: false
        };
        
        // Add log for weekly reset if it's Monday
        if (isMonday) {
            newState.logs = [{
                id: Date.now().toString(),
                timestamp: new Date().toISOString(),
                type: 'SYSTEM',
                message: 'WEEKLY CYCLE RESET: All weekly protocol tasks and counters have been reset. New week begins.'
            }, ...newState.logs];
        }
        break;
    }
    case 'WEEKLY_RESET': {
        // Sunday 04:00 reset: Clear all weekly task completion states and reset counters
        newState.paths = state.paths.map(p => ({ 
            ...p, 
            tasks: p.tasks.map(t => ({ 
                ...t, 
                isCompleted: t.type === TaskType.Weekly ? false : t.isCompleted,
                currentCount: t.type === TaskType.Weekly ? 0 : t.currentCount // Reset weekly task counters
            })) 
        }));

        newState.logs = [{
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            type: 'SYSTEM',
            message: 'WEEKLY CYCLE RESET: All weekly protocol tasks and counters have been reset. New week begins.'
        }, ...newState.logs];
        break;
    }
    case 'UPDATE_DAILY_METRICS': {
        if (action.payload.immersionHours !== undefined) {
            const added = action.payload.immersionHours - (state.dailyMetrics.immersionHours || 0);
            newState.totalImmersionHours = (state.totalImmersionHours || 0) + added;
        }
        
        const oldWater = state.dailyMetrics.waterIntake || 0;
        const oldSteps = state.dailyMetrics.steps || 0;
        
        newState.dailyMetrics = { ...state.dailyMetrics, ...action.payload };
        
        const newWater = newState.dailyMetrics.waterIntake || 0;
        const newSteps = newState.dailyMetrics.steps || 0;
        
        // Check if water goal was just reached
        if (!state.waterGoalReachedToday && oldWater < state.waterGoal && newWater >= state.waterGoal) {
            newState.waterGoalReachedToday = true;
            // Award 5 XP and 2 Vitality (Regeneration) points
            newState.xp += 5;
            newState.stats = applyStatBoost(newState.stats, StatName.Vitality, SubStatName.Regeneration, 2);
            newState.logs = [{
                id: Date.now().toString(),
                timestamp: new Date().toISOString(),
                type: 'SYSTEM',
                message: `HYDRATION GOAL ACHIEVED: ${state.waterGoal}ml reached. +5 XP, +2 Regeneration awarded.`
            }, ...newState.logs];
        }
        
        // Check if step goal was just reached
        if (!state.stepGoalReachedToday && oldSteps < state.stepGoal && newSteps >= state.stepGoal) {
            newState.stepGoalReachedToday = true;
            // Award 5 XP and 2 Physical (Endurance) points
            newState.xp += 5;
            newState.stats = applyStatBoost(newState.stats, StatName.Physical, SubStatName.Endurance, 2);
            newState.logs = [{
                id: Date.now().toString(),
                timestamp: new Date().toISOString(),
                type: 'SYSTEM',
                message: `MOVEMENT GOAL ACHIEVED: ${state.stepGoal} steps reached. +5 XP, +2 Endurance awarded.`
            }, ...newState.logs];
        }
        break;
    }
    case 'SET_WATER_GOAL':
        newState.waterGoal = action.payload;
        newState.logs = [{
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            type: 'SYSTEM',
            message: `HYDRATION TARGET UPDATED: New daily goal set to ${action.payload}ml.`
        }, ...newState.logs];
        break;
    case 'SET_STEP_GOAL':
        newState.stepGoal = action.payload;
        newState.logs = [{
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            type: 'SYSTEM',
            message: `MOVEMENT TARGET UPDATED: New daily goal set to ${action.payload} steps.`
        }, ...newState.logs];
        break;
    case 'ADD_PATH': newState.paths = [...state.paths, action.payload]; break;
    case 'DELETE_PATH': newState.paths = state.paths.filter(p => p.id !== action.payload); break;
    case 'UPDATE_PATH': newState.paths = state.paths.map(p => p.id === action.payload.pathId ? { ...p, ...action.payload.updates } : p); break;
    case 'EDIT_TASK':
        newState.paths = state.paths.map(p => {
            if (p.id === action.payload.pathId) {
                return {
                    ...p,
                    tasks: p.tasks.map(t => t.id === action.payload.taskId ? { ...t, ...action.payload.updates } : t)
                };
            }
            return p;
        });
        break;
    case 'DELETE_TASK_FROM_PATH':
        newState.paths = state.paths.map(p => {
            if (p.id === action.payload.pathId) {
                return { ...p, tasks: p.tasks.filter(t => t.id !== action.payload.taskId) };
            }
            return p;
        });
        break;
    case 'REORDER_TASKS':
        newState.paths = state.paths.map(p => {
            if (p.id === action.payload.pathId) {
                const taskMap = new Map(p.tasks.map(t => [t.id, t]));
                const reorderedTasks = action.payload.taskIds
                    .map((id, index) => {
                        const task = taskMap.get(id);
                        return task ? { ...task, order: index } : null;
                    })
                    .filter(Boolean) as Task[];
                return { ...p, tasks: reorderedTasks };
            }
            return p;
        });
        break;
    case 'SNOOZE_TASK':
        newState.paths = state.paths.map(p => {
            if (p.id === action.payload.pathId) {
                return {
                    ...p,
                    tasks: p.tasks.map(t => t.id === action.payload.taskId ? { ...t, isSnoozed: true, snoozedUntil: action.payload.until } : t)
                };
            }
            return p;
        });
        break;
    case 'UNSNOOZE_TASK':
        newState.paths = state.paths.map(p => {
            if (p.id === action.payload.pathId) {
                return {
                    ...p,
                    tasks: p.tasks.map(t => t.id === action.payload.taskId ? { ...t, isSnoozed: false, snoozedUntil: undefined } : t)
                };
            }
            return p;
        });
        break;
    case 'START_NEW_CHAT': newState.chatSessions = [action.payload, ...state.chatSessions]; break;
    case 'ADD_MESSAGE_TO_CHAT': newState.chatSessions = state.chatSessions.map(s => s.id === action.payload.sessionId ? { ...s, messages: [...s.messages, action.payload.message] } : s); break;
    case 'ADD_JOURNAL_ENTRY': newState.journal = [...state.journal, action.payload]; break;
    case 'ADD_LORE_ENTRY': newState.lore = [...state.lore, action.payload]; break;
    case 'FLAG_LORE_DROP': newState.chapterBlack = { ...state.chapterBlack, isUnlockedToday: true, hasHadRandomLoreDropToday: true }; break;
    case 'MAKE_STORY_CHOICE': newState.lore = state.lore.map(entry => entry.id === action.payload.chapterId ? { ...entry, userChoice: action.payload.choice } : entry); break;
    case 'ADD_SIDE_MISSION': newState.sideMissions = [...state.sideMissions, action.payload]; break;
    case 'COMPLETE_SIDE_MISSION':
        const smToComplete = state.sideMissions.find(sm => sm.id === action.payload.missionId);
        if (smToComplete) {
            let { xpAwarded, statAmount } = action.payload.evaluation || { xpAwarded: smToComplete.xp, statAmount: smToComplete.statBoost.amount };
            newState.xp += xpAwarded;
            newState.stats = applyStatBoost(state.stats, smToComplete.statBoost.stat, smToComplete.statBoost.subStat, statAmount);
            newState.sideMissions = state.sideMissions.map(sm => sm.id === action.payload.missionId ? { ...sm, status: 'Completed' } : sm);
        }
        break;
    case 'APPLY_STAT_BOOST': newState.stats = applyStatBoost(newState.stats, action.payload.stat, action.payload.subStat, action.payload.amount); break;
    case 'RECORD_BENCHMARK': {
        const progression = action.payload;
        newState.statProgressionHistory = [...state.statProgressionHistory, progression];
        newState.stats = applyStatBoost(newState.stats, progression.stat as StatName, progression.subStat, progression.statBoostAwarded);
        newState.logs = [{
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            type: 'GROWTH',
            message: `BENCHMARK: ${progression.metricName} ${progression.previousValue}${progression.improvement > 0 ? '→' : '↓'} ${progression.newValue} (+${progression.statBoostAwarded} ${progression.stat})`
        }, ...newState.logs];
        break;
    }
    case 'DISMISS_SPECIAL_EVENT': newState.specialEvent = null; break;
    case 'START_TOUR':
        newState.isTourActive = true;
        newState.tourStep = 0;
        break;
    case 'NEXT_TOUR_STEP':
        newState.tourStep = (state.tourStep || 0) + 1;
        break;
    case 'END_TOUR':
        newState.isTourActive = false;
        newState.tourStep = 0;
        break;
    default: return state;
  }
  const newRank = calculateOverallRank(newState.stats);
  if (newRank.name !== newState.rank.name) {
    newState.rank = newRank;
    const oldIdx = RANKS.findIndex(r => r.name === state.rank.name);
    const newIdx = RANKS.findIndex(r => r.name === newRank.name);
    if (newIdx > oldIdx) newState.specialEvent = { type: 'rankUp', rank: newRank };
  }
  return newState;
}
