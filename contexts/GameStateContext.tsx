
// contexts/GameStateContext.tsx
import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
/* Added StatName and SubStatName to the imports from '../types' to resolve find name errors */
import { GameState, GameAction, Path, Task, Mission, ChatMessage, Stat, StatName, SubStatName, TalentDna, ResonanceVector, LogType, EvaluationResult, DailyMetrics, AttributeRankName, ResonanceType, ToastType, VoidHabit } from '../types';
import * as firebaseService from '../services/firebaseService';
import { gameReducer } from '../state/gameReducer';
import { RANKS, INITIAL_STATS, STAT_SUBSTAT_MAP, calculateXpForNextLevel, getRankForSubstatValue, getRankForMainStatValue } from '../constants';
import { calculateScores, mapScoreToRank } from '../services/scoringService';
import { generateAutomatedSchedule, generateNewMission, generatePromotionExam, generateNewChapter, generateSideMission, generateAdaptiveStage } from '../services/geminiService';
import { CODEX_CATEGORIES } from '../data/codexData';

export interface GameStateContextType {
  gameState: GameState | null;
  dispatch: React.Dispatch<GameAction>;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (username: string, password?: string) => Promise<boolean>;
  logout: () => void;
  seedInitialState: (stats: Stat[], xp: number, calibrationAnalysis?: GameState['calibrationAnalysis'], initialStatsSnapshot?: Stat[] | null, username?: string, talentDna?: TalentDna, talentArchetype?: string, biometrics?: GameState['biometrics'], resonanceVector?: ResonanceVector) => void;
  exportState: () => void;
  importState: (newState: GameState) => void;
  deleteAccount: () => void;
  addToast: (message: string, type: ToastType) => void;
  addLog: (message: string, type: LogType) => void;
  completeTask: (pathId: string, taskId: string, evaluation?: EvaluationResult) => void;
  toggleHistoricalHabit: (date: string, habitId: string, status: boolean | 'breach') => void;
  setDailyNote: (date: string, note: string) => void;
  addVoidHabit: (habit: VoidHabit) => void;
  deleteVoidHabit: (habitId: string) => void;
  addPath: (pathData?: Path) => void;
  evolvePath: (pathId: string, newPathData: { name: string; description: string; tasks: Omit<Task, 'id' | 'isCompleted' | 'lastCompleted'>[] }) => void;
  updatePath: (pathId: string, updates: Partial<Path>) => void;
  deletePath: (pathId: string) => void;
  addTaskToPath: (pathId: string, taskData: Omit<Task, 'id' | 'isCompleted'>) => void;
  updateTasksForPath: (pathId: string, tasksData: Omit<Task, 'id' | 'isCompleted' | 'lastCompleted'>[]) => void;
  deleteTaskFromPath: (pathId: string, taskId: string) => void;
  startNewChat: (firstUserMessage: string) => Promise<string>;
  addMessageToChat: (sessionId: string, message: ChatMessage) => void;
  setChatTitle: (sessionId: string, title: string) => void;
  deleteChat: (sessionId: string) => void;
  planTask: (day: number, hour: number, taskId: string, pathId: string) => void;
  unplanTask: (day: number, taskId: string) => void;
  automateSchedule: () => Promise<void>;
  requestNewMission: (userRequest?: string) => Promise<void>;
  completeMission: (missionId: string, evaluation?: EvaluationResult) => void;
  requestPromotionExam: () => Promise<void>;
  updatePromotionExamObjective: (objectiveIndex: number, isCompleted: boolean) => void;
  completePromotionExam: () => Promise<void>;
  addJournalEntry: (title: string, content: string, isApexFeat?: boolean) => void;
  generateAndRecordChapter: () => Promise<void>;
  makeStoryChoice: (chapterId: string, choice: string) => void;
  addSideMission: (description: string) => Promise<void>;
  updateSideMissionObjective: (missionId: string, stageIndex: number, objectiveIndex: number, isCompleted: boolean) => void;
  incrementSideMissionCounter: (missionId: string, stageIndex: number, objectiveIndex: number, amount: number) => void;
  requestAdaptiveStage: (missionId: string, stageIndex: number, objectiveIndex: number) => Promise<void>;
  completeSideMission: (missionId: string, evaluation?: EvaluationResult) => void;
  deleteSideMission: (missionId: string) => void;
  applyStatBoost: (stat: StatName, subStat: SubStatName | undefined, amount: number) => void;
  setSelectedPathId: (pathId: string | null) => void;
  startTour: () => void;
  nextTourStep: () => void;
  endTour: () => void;
  setNotificationPermission: (permission: 'default' | 'granted' | 'denied') => void;
  dismissSpecialEvent: () => void;
  updateDailyMetrics: (metrics: Partial<DailyMetrics>) => void;
}

export const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

export const useGameState = (): GameStateContextType => {
  const context = useContext(GameStateContext);
  if (!context) throw new Error('useGameState must be used within a GameStateProvider.');
  return context;
};

const processLoadedState = (savedState: any, username: string): GameState => {
    const defaultState: GameState = {
        userName: username,
        hasOnboarded: false,
        rank: RANKS[0],
        xp: 0,
        stats: INITIAL_STATS.map(s => ({
            ...s,
            rank: 'E' as AttributeRankName,
            subStats: STAT_SUBSTAT_MAP[s.name].map(ss => ({ name: ss, value: 0, rank: 'E' as AttributeRankName, lastIncreased: new Date().toISOString() })),
            lastIncreased: new Date().toISOString(),
        })),
        paths: [],
        voidHabits: [],
        habitHistory: {},
        dailyNotes: {},
        missions: [],
        promotionExam: null,
        sideMissions: [],
        journal: [],
        lore: [],
        unlockedCodexEntryIds: [],
        unlockedAchievements: [],
        codex: CODEX_CATEGORIES,
        chapterBlack: { isUnlockedToday: false, dailyTaskCompletionPercentage: 0, hasHadRandomLoreDropToday: false },
        resonanceSignature: { type: ResonanceType.Unawakened, tier: 1, rankBand: 'E-D', awakened: false, description: "Your core potential is yet to be unlocked.", auraManifestation: "A faint, colorless hum.", traits: [], signatureAbility: "N/A", domain: "N/A", statAffinities: [] },
        resonanceVector: undefined,
        statHistory: [],
        chatSessions: [],
        weeklyPlan: {},
        forsaken: { stats: [], baseStats: [], dailyCompletionTarget: 0.8, focusStat: StatName.Physical },
        currentStreak: 0,
        longestStreak: 0,
        dailyXpGain: 0,
        totalTasksCompleted: 0,
        isTourActive: false,
        tourStep: 0,
        specialEvent: null,
        calibrationAnalysis: undefined,
        initialStatsSnapshot: null,
        notificationPermission: 'default',
        logs: [],
        benchmarks: {},
        dailyMetrics: { waterIntake: 0, steps: 0, calories: 0, protein: 0, carbs: 0, fats: 0, sleepScore: 0, sleepHours: 0, weightKg: 0, immersionHours: 0 },
        totalImmersionHours: 0
    };

    const migratedState: GameState = { ...defaultState, ...savedState };
    if (!migratedState.dailyMetrics) migratedState.dailyMetrics = defaultState.dailyMetrics;
    if (!migratedState.habitHistory) migratedState.habitHistory = {};
    if (!migratedState.voidHabits) migratedState.voidHabits = [];
    if (!migratedState.dailyNotes) migratedState.dailyNotes = {};
    
    migratedState.stats = migratedState.stats.map(stat => {
        const newSubStats = stat.subStats.map(ss => ({ ...ss, rank: getRankForSubstatValue(ss.value, ss.name) }));
        const totalValue = newSubStats.reduce((sum, ss) => sum + ss.value, 0);
        return { ...stat, value: totalValue, subStats: newSubStats, rank: getRankForMainStatValue(totalValue, stat.name) };
    });
    const { apexThreatIndex } = calculateScores(migratedState.stats);
    migratedState.rank = RANKS.find(r => r.name === mapScoreToRank(apexThreatIndex)) || RANKS[0];
    return migratedState;
};

// Deep clone and strip 'undefined' for Firestore compatibility
const stripUndefined = (obj: any): any => {
    if (Array.isArray(obj)) return obj.map(stripUndefined);
    if (obj !== null && typeof obj === 'object') {
        return Object.fromEntries(
            Object.entries(obj)
                .filter(([_, v]) => v !== undefined)
                .map(([k, v]) => [k, stripUndefined(v)])
        );
    }
    return obj;
};

export const GameStateProvider: React.FC<{ children: React.ReactNode; notify: (message: string, type: ToastType) => void }> = ({ children, notify }) => {
    const [gameState, dispatch] = useReducer(gameReducer, null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    useEffect(() => {
        // Firebase-only authentication
        const unsubscribe = firebaseService.onAuthStateChangedHelper(async (user) => {
            if (user) {
                setIsLoggedIn(true);
                const cloudState = await firebaseService.loadGameState(user.uid);
                dispatch({ type: 'SET_STATE', payload: processLoadedState(cloudState || {}, user.displayName || 'Operative') });
            } else {
                setIsLoggedIn(false);
                dispatch({ type: 'SET_STATE', payload: null as any });
            }
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (gameState && isLoggedIn) {
            const timeoutId = setTimeout(() => {
                const safeState = stripUndefined(gameState);
                const uid = firebaseService.auth.currentUser?.uid;
                if (uid) firebaseService.saveGameState(uid, safeState);
            }, 2000);
            return () => clearTimeout(timeoutId);
        }
    }, [gameState, isLoggedIn]);

    const contextValue: GameStateContextType = {
        gameState, dispatch, isLoading, isLoggedIn: !!isLoggedIn,
        login: async (username, password) => {
            if (password && username.includes('@')) {
                try { await firebaseService.signIn(username, password); return true; } catch (e) { return false; }
            }
            return false;
        },
        logout: () => {
            firebaseService.signOutUser();
            setIsLoggedIn(false); dispatch({ type: 'SET_STATE', payload: null as any });
        },
        seedInitialState: (stats, xp = 0, calibrationAnalysis, initialStatsSnapshot, username, talentDna, talentArchetype, biometrics, resonanceVector) => {
            const name = username || "Operative";
            const initialForsakenStats = stats.map(s => ({ name: s.name, value: Math.round(s.value * 1.1) }));
            const newState: GameState = {
                userName: name, hasOnboarded: true, rank: RANKS[0], xp, stats, paths: [], voidHabits: [], habitHistory: {}, dailyNotes: {}, missions: [], promotionExam: null, sideMissions: [], journal: [], lore: [], unlockedCodexEntryIds: [], unlockedAchievements: [], codex: CODEX_CATEGORIES, chapterBlack: { isUnlockedToday: false, dailyTaskCompletionPercentage: 0, hasHadRandomLoreDropToday: false }, resonanceSignature: { type: ResonanceType.Unawakened, tier: 1, rankBand: 'E-D', awakened: false, description: "Your core potential is yet to be unlocked.", auraManifestation: "A faint, colorless hum.", traits: [], signatureAbility: "N/A", domain: "N/A", statAffinities: [] }, 
                resonanceVector: resonanceVector || undefined, 
                statHistory: [{ date: new Date().toISOString(), stats: stats.reduce((acc, s) => ({...acc, [s.name]: s.value}), {} as Record<StatName, number>) }], chatSessions: [], weeklyPlan: {}, forsaken: { stats: initialForsakenStats, baseStats: initialForsakenStats.map(s => ({...s})), dailyCompletionTarget: 0.8, focusStat: StatName.Physical }, currentStreak: 0, longestStreak: 0, dailyXpGain: 0, totalTasksCompleted: 0, isTourActive: true, tourStep: 0, specialEvent: null, calibrationAnalysis, initialStatsSnapshot: initialStatsSnapshot || stats, notificationPermission: 'default', talentDna, archetypeTitle: talentArchetype, biometrics, logs: [], benchmarks: {}, 
                dailyMetrics: { waterIntake: 0, steps: 0, calories: 0, protein: 0, carbs: 0, fats: 0, sleepScore: 0, sleepHours: 0, weightKg: 0, immersionHours: 0 },
                totalImmersionHours: 0
            };
            dispatch({ type: 'SET_STATE', payload: newState });
        },
        exportState: () => {}, importState: (ns) => dispatch({ type: 'SET_STATE', payload: ns }),
        deleteAccount: async () => { if (gameState && window.confirm("CRITICAL WARNING: Irreversible wipe?")) { await firebaseService.deleteUserAccount(); contextValue.logout(); } },
        addToast: (m, t) => notify ? notify(m, t) : console.log(m),
        addLog: (m, t) => dispatch({ type: 'ADD_LOG', payload: { id: Date.now().toString(), timestamp: new Date().toISOString(), type: t, message: m } }),
        completeTask: (p, t, e) => dispatch({ type: 'COMPLETE_TASK', payload: { pathId: p, taskId: t, evaluation: e } }),
        toggleHistoricalHabit: (d, h, s) => dispatch({ type: 'TOGGLE_HISTORICAL_HABIT', payload: { date: d, habitId: h, status: s } }),
        setDailyNote: (date, note) => dispatch({ type: 'SET_DAILY_NOTE', payload: { date, note } }),
        addVoidHabit: (h) => dispatch({ type: 'ADD_VOID_HABIT', payload: h }),
        deleteVoidHabit: (id) => dispatch({ type: 'DELETE_VOID_HABIT', payload: id }),
        addPath: (p) => p && dispatch({ type: 'ADD_PATH', payload: p }),
        evolvePath: (id, data) => dispatch({ type: 'EVOLVE_PATH', payload: { pathId: id, newPathData: data } }),
        updatePath: (id, u) => dispatch({ type: 'UPDATE_PATH', payload: { pathId: id, updates: u } }),
        deletePath: (id) => dispatch({ type: 'DELETE_PATH', payload: id }),
        addTaskToPath: (id, t) => dispatch({ type: 'ADD_TASK_TO_PATH', payload: { pathId: id, task: { ...t, id: `task-${Date.now()}`, isCompleted: false } } }),
        updateTasksForPath: (id, t) => dispatch({ type: 'UPDATE_TASKS_FOR_PATH', payload: { pathId: id, tasks: t.map((x, i) => ({...x, id: `t-${Date.now()}-${i}`, isCompleted: false})) } }),
        deleteTaskFromPath: (pid, tid) => dispatch({ type: 'DELETE_TASK_FROM_PATH', payload: { pathId: pid, taskId: tid } }),
        startNewChat: async (msg) => { const id = `chat-${Date.now()}`; dispatch({ type: 'START_NEW_CHAT', payload: { id, title: msg.substring(0,20), messages: [], createdAt: new Date().toISOString() } }); return id; },
        addMessageToChat: (sid, msg) => dispatch({ type: 'ADD_MESSAGE_TO_CHAT', payload: { sessionId: sid, message: msg } }),
        setChatTitle: (sid, t) => dispatch({ type: 'SET_CHAT_TITLE', payload: { sessionId: sid, title: t } }),
        deleteChat: (sid) => dispatch({ type: 'DELETE_CHAT', payload: sid }),
        planTask: (d, h, t, p) => {
            const currentDaySchedule = gameState?.weeklyPlan[d] || [];
            const filteredSchedule = currentDaySchedule.filter(item => item.taskId !== t);
            dispatch({ type: 'APPLY_SCHEDULE', payload: { dayOfWeek: d, schedule: [...filteredSchedule, { hour: h, taskId: t, pathId: p }] } });
        },
        unplanTask: (d, t) => dispatch({ type: 'APPLY_SCHEDULE', payload: { dayOfWeek: d, schedule: (gameState?.weeklyPlan[d] || []).filter(p => p.taskId !== t) } }),
        automateSchedule: async () => { if(gameState) dispatch({ type: 'SET_FULL_SCHEDULE', payload: await generateAutomatedSchedule(gameState) }) },
        requestNewMission: async (req) => { if(gameState) dispatch({ type: 'ADD_MISSION', payload: await generateNewMission(gameState, req) }) },
        completeMission: (id, ev) => dispatch({ type: 'COMPLETE_MISSION', payload: { missionId: id, evaluation: ev } }),
        requestPromotionExam: async () => { if(gameState) { const res = await generatePromotionExam(gameState); dispatch({ type: 'SET_PROMOTION_EXAM', payload: res }); } },
        updatePromotionExamObjective: (idx, c) => dispatch({ type: 'UPDATE_PROMOTION_EXAM_OBJECTIVE', payload: { objectiveIndex: idx, isCompleted: c } }),
        completePromotionExam: async () => {},
        addJournalEntry: (t, c, af) => dispatch({ type: 'ADD_JOURNAL_ENTRY', payload: { id: `j-${Date.now()}`, date: new Date().toISOString(), title: t, content: c, isApexFeat: af } }),
        generateAndRecordChapter: async () => { if(gameState) { dispatch({ type: 'ADD_LORE_ENTRY', payload: await generateNewChapter(gameState) }); dispatch({ type: 'FLAG_LORE_DROP' }); } },
        makeStoryChoice: (cid, c) => dispatch({ type: 'MAKE_STORY_CHOICE', payload: { chapterId: cid, choice: c } }),
        addSideMission: async (d) => { if(gameState) dispatch({ type: 'ADD_SIDE_MISSION', payload: await generateSideMission(d, gameState) }) },
        updateSideMissionObjective: (mid, si, oi, c) => dispatch({ type: 'UPDATE_SIDE_MISSION_OBJECTIVE', payload: { missionId: mid, stageIndex: si, objectiveIndex: oi, isCompleted: c } }),
        incrementSideMissionCounter: (mid, si, oi, a) => dispatch({ type: 'INCREMENT_SIDE_MISSION_COUNTER', payload: { missionId: mid, stageIndex: si, objectiveIndex: oi, amount: a } }),
        requestAdaptiveStage: async (mid, si, oi) => { if(gameState) { const m = gameState.sideMissions.find(x=>x.id===mid); if(m) dispatch({ type: 'INSERT_SIDE_MISSION_STAGE', payload: { missionId: mid, afterStageIndex: si, newStage: await generateAdaptiveStage(m, si, oi, gameState) } }) } },
        completeSideMission: (id, ev) => dispatch({ type: 'COMPLETE_SIDE_MISSION', payload: { missionId: id, evaluation: ev } }),
        deleteSideMission: (id) => dispatch({ type: 'DELETE_SIDE_MISSION', payload: { missionId: id } }),
        applyStatBoost: (s, ss, a) => dispatch({ type: 'APPLY_STAT_BOOST', payload: { stat: s, subStat: ss, amount: a } }),
        setSelectedPathId: () => {},
        startTour: () => dispatch({ type: 'START_TOUR' }),
        nextTourStep: () => dispatch({ type: 'NEXT_TOUR_STEP' }),
        endTour: () => dispatch({ type: 'END_TOUR' }),
        setNotificationPermission: (p) => dispatch({ type: 'SET_NOTIFICATION_PERMISSION', payload: p }),
        dismissSpecialEvent: () => dispatch({ type: 'DISMISS_SPECIAL_EVENT' }),
        updateDailyMetrics: (m) => dispatch({ type: 'UPDATE_DAILY_METRICS', payload: m }),
    };

    return <GameStateContext.Provider value={contextValue}>{children}</GameStateContext.Provider>;
};
