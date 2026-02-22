// services/geminiService_secure.ts
// SECURE VERSION - NO DIRECT GEMINI SDK USAGE IN BROWSER
// All API calls go through backend endpoints for security

import { GameState, Rank, Stat, ChatMessage, Mission, PromotionExam, LoreEntry, StatName, Path, Task, SubStatName, TaskType, IconName, AttributeRankName, ResonanceSignature, ResonanceType, CodexEntry, SideMission, SideMissionStage, SideMissionObjective, PlannedTask, FullCalibrationReport, TalentDna, TraitAnalysisResult, TaskReport, EvaluationResult, NutritionAnalysis, DailyMetrics } from '../types';
import { RANKS } from "../constants";

const getCleanJson = (text: string) => {
    try {
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleaned);
    } catch (e) {
        console.error("Failed to parse JSON:", text);
        return {};
    }
};

// DEBUG: Log API key availability
export const checkApiKeyAvailability = (): boolean => {
    console.log('[Gemini Service] Using secure backend endpoints (no API key in browser)');
    return true;
};

/**
 * Get companion greeting from backend endpoint
 * NEVER uses Gemini SDK directly in browser
 */
export const getCompanionGreeting = async (rank: Rank, stats: Stat[], userName: string): Promise<string> => {
    try {
        const params = { userName, rankName: rank?.name || 'Unranked' };
        const resp = await fetch('/api/companionGreetingV2', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params),
        });
        if (resp.ok) {
            const data = await resp.json();
            if (data?.text) return String(data.text).trim();
        }
        return "System online. Awaiting directive.";
    } catch (error) {
        console.error('[Gemini Service] Error in getCompanionGreeting:', error);
        return "Connection stable. Operational parameters normal.";
    }
};

/**
 * Send message to Gemini via backend endpoint
 * DO NOT use Gemini SDK directly
 */
export const orderChat = async (gameState: GameState, message: string, history: ChatMessage[]): Promise<string> => {
    try {
        const params = {
            userName: gameState.userName,
            rankName: gameState.rank?.name || 'Unranked',
            message,
            history: history.map(m => ({ role: m.role, content: m.content }))
        };
        const resp = await fetch('/api/orderChatV2', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params),
        });
        if (resp.ok) {
            const data = await resp.json();
            if (data?.text) return String(data.text).trim();
        }
        return "Central is currently unresponsive.";
    } catch (error) {
        console.error('[Gemini Service] Error in orderChat:', error);
        return "Connection error. Try again later.";
    }
};

// NOTE: createOrderChatSession is deprecated
// Use orderChat() async function instead
export const createOrderChatSession = (gameState: GameState, history: ChatMessage[]): any => {
    throw new Error('Direct Gemini chat sessions are no longer supported in the browser. Use orderChat() async function with backend endpoints instead.');
};

/**
 * Stub functions that previously used Gemini SDK directly
 * These should be implemented as backend endpoints if needed
 */

export const generateFullCalibrationReport = async (context: { metrics: Record<StatName, number>, traits: TraitAnalysisResult, narrative: string, mbtType?: string, codename: string, biometrics?: any }): Promise<FullCalibrationReport> => {
    // Fallback implementation - returns complete structure with safe defaults
    console.warn('[Gemini Service] generateFullCalibrationReport: using fallback implementation');
    
    const metricsArray = Object.values(context.metrics || {});
    const avgMetric = metricsArray.length > 0 ? Math.round(metricsArray.reduce((a, b) => a + b, 0) / metricsArray.length) : 50;
    
    return {
        codename: context.codename || 'Agent-Unknown',
        mbtiProfile: context.mbtType || 'INTJ',
        symbolicProfile: 'Emerging Operative',
        threatLevel: 'Delta (Learning)',
        foreshadowing: 'Potential unlocked through baseline assessment.',
        ceilingRarity: 'Exceptional',
        deviation: 'Standard operational parameters',
        notes: 'Baseline assessment complete. Ready for protocol deployment.',
        resonanceStability: 'Stable',
        centralInsight: 'Operative demonstrates viable baseline across core domains.',
        rarityBand: 'Optimized' as const,
        candidateTitles: [
            { title: 'Operative', justification: 'Meets baseline threshold for Genesis Protocol' }
        ],
        tpi: avgMetric,
        percentile: avgMetric,
        overallRank: avgMetric >= 80 ? 'A' : avgMetric >= 70 ? 'B' : avgMetric >= 60 ? 'C' : 'D',
        initialStatsSnapshot: [],
        estimatedCeilingRank: 'B',
        talentDna: {
            BP: 65,
            LV: 70,
            DR: 60
        },
        primaryFailureNode: 'Discipline',
        failureNodeRisk: 'Low to Moderate',
        successProbability: 0.72,
        dropoutProbability: 0.15,
        historicalPrecedent: {
            name: 'Asset Prime',
            matchPercentage: 65,
            alignment: 'Emerging operative with broad competency'
        },
        biometricModifiers: [
            { label: 'Baseline', impact: 'None', value: 'Standard parameters' }
        ],
        // TraitAnalysisResult fields
        talentClass: context.traits?.talentClass || ('Balanced' as any),
        obsessionLevel: context.traits?.obsessionLevel || ('Moderate' as any),
        archetypeTitle: context.traits?.archetypeTitle || 'The Operative',
        rarity: context.traits?.rarity || 'Standard',
        traitScores: context.traits?.traitScores || { IP: 50, LE: 50, RE: 50, FO: 50, EX: 50, CO: 50 }
    } as FullCalibrationReport;
};

export const evaluateKnowledgeAnswer = async (question: string, userAnswer: string): Promise<boolean> => {
    // Stub - Complex evaluation, can be implemented with dedicated endpoint
    console.warn('[Gemini Service] evaluateKnowledgeAnswer: stub implementation');
    return false;
};

export const generateAdaptiveQuestion = async (subject: 'Reasoning' | 'Knowledge', answerFormat: 'multiple-choice' | 'short-answer', difficulty: number, history: any[]): Promise<any> => {
    // Stub - Complex adaptive system, can be implemented with dedicated endpoint
    console.warn('[Gemini Service] generateAdaptiveQuestion: stub implementation');
    return { questionText: "Fallback question", domain: "General" };
};

export const generateWarRoomScenario = async (round: number, history: any[], nationStats: any): Promise<any> => {
    // Stub - Complex strategic scenario, can be implemented with dedicated endpoint
    console.warn('[Gemini Service] generateWarRoomScenario: stub implementation');
    return {};
};

export const evaluateEquilibriumPerformance = async (telemetry: any): Promise<any> => {
    // Stub - Complex metric evaluation, can be implemented with dedicated endpoint
    console.warn('[Gemini Service] evaluateEquilibriumPerformance: stub implementation');
    return { score: 50 };
};

export const evaluateCreativityAnswers = async (inputs: Record<string, string>): Promise<any> => {
    // Stub - Complex creative evaluation, can be implemented with dedicated endpoint
    console.warn('[Gemini Service] evaluateCreativityAnswers: stub implementation');
    return {
        Imagination: { percentile: 50, signals: 'Assessment unavailable.' },
        Innovation: { percentile: 50, signals: 'Assessment unavailable.' },
        Style: { percentile: 50, signals: 'Assessment unavailable.' },
        Vision: { percentile: 50, signals: 'Assessment unavailable.' },
        Expression: { percentile: 50, signals: 'Assessment unavailable.' }
    };
};

/**
 * Evaluate task completion via backend endpoint
 */
export const evaluateTaskReport = async (report: TaskReport, taskContext: { description: string; expectedXp: number; statName: string; subStatName: string; rank: string }): Promise<EvaluationResult> => {
    try {
        const resp = await fetch('/api/evaluateTaskReport', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                taskDescription: taskContext.description,
                report,
                expectedXp: taskContext.expectedXp,
                statName: taskContext.statName,
                rankName: taskContext.rank
            }),
        });
        if (resp.ok) {
            const data = await resp.json();
            return data;
        }
        // Fallback
        return { pass: true, xpAwarded: taskContext.expectedXp, statAmount: 5, critique: "Network error. Default rewards issued." };
    } catch (error) {
        console.error('[Gemini Service] Error in evaluateTaskReport:', error);
        return { pass: true, xpAwarded: taskContext.expectedXp, statAmount: 5, critique: "Network error. Default rewards issued." };
    }
};

/**
 * Generate new mission via backend endpoint
 */
export const generateNewMission = async (gameState: GameState, userRequest?: string): Promise<Mission> => {
    try {
        const resp = await fetch('/api/generateNewMission', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userName: gameState.userName,
                rankName: gameState.rank?.name || 'Unranked',
                userRequest
            }),
        });
        if (resp.ok) {
            const data = await resp.json();
            return data;
        }
        // Fallback
        return {
            id: `mission-${Date.now()}`,
            isCompleted: false,
            title: "Directive Delta",
            description: "Maintain protocol.",
            xp: 150,
            statBoost: { stat: StatName.Physical, subStat: SubStatName.Strength, amount: 10 },
            expiresAt: new Date().toISOString()
        };
    } catch (error) {
        console.error('[Gemini Service] Error in generateNewMission:', error);
        return {
            id: `mission-${Date.now()}`,
            isCompleted: false,
            title: "Directive Delta",
            description: "Maintain protocol.",
            xp: 150,
            statBoost: { stat: StatName.Physical, subStat: SubStatName.Strength, amount: 10 },
            expiresAt: new Date().toISOString()
        };
    }
};

export const generatePromotionExam = async (gameState: GameState): Promise<{ mission: Mission, exam: PromotionExam }> => {
    // Stub - Can be implemented with dedicated endpoint if needed
    console.warn('[Gemini Service] generatePromotionExam: stub implementation');
    const mission = {
        id: `exam-${Date.now()}`,
        title: "Grade Trial",
        description: "Final evaluation.",
        xp: 1000,
        statBoost: { stat: StatName.Intelligence, amount: 50 },
        isCompleted: false,
        isPromotionExam: true
    };
    const exam = {
        missionId: mission.id,
        targetRank: AttributeRankName.D,
        objectives: [{ description: "Complete primary objective.", isCompleted: false }]
    };
    return { mission, exam };
};

/**
 * Generate new chapter via backend endpoint
 * Now includes full player context: resonance, alignment, HATI, and prior lore for serialization
 */
export const generateNewChapter = async (gameState: GameState): Promise<LoreEntry> => {
    try {
        const resp = await fetch('/api/generateChapter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userName: gameState.userName || 'Operative',
                rankName: gameState.rank?.name || 'Unranked',
                previousChapterCount: gameState.lore?.length || 0,
                lastChapters: (gameState.lore || []).slice(-3).map(ch => ({
                    id: ch.id,
                    chapterNumber: ch.chapterNumber,
                    title: ch.title,
                    content: ch.content,
                    userChoice: ch.userChoice || null,
                })),
                resonanceType: gameState.resonanceSignature?.type || 'Unawakened',
                alignment: gameState.alignment?.profile || 'Neutral',
                hati: gameState.rank?.attributeThreshold || 0
            }),
        });
        if (resp.ok) {
            const data = await resp.json();
            return data;
        }
        // Fallback
        const nextNum = (gameState.lore?.length || 0) + 1;
        return {
            id: `chapter-${Date.now()}`,
            date: new Date().toISOString(),
            chapterNumber: nextNum,
            title: "Static Interference",
            content: "The recording is corrupted."
        };
    } catch (error) {
        console.error('[Gemini Service] Error in generateNewChapter:', error);
        const nextNum = (gameState.lore?.length || 0) + 1;
        return {
            id: `chapter-${Date.now()}`,
            date: new Date().toISOString(),
            chapterNumber: nextNum,
            title: "Static Interference",
            content: "The recording is corrupted."
        };
    }
};

/**
 * Generate side mission via backend endpoint
 */
export const generateSideMission = async (description: string, gameState: GameState): Promise<SideMission> => {
    try {
        const resp = await fetch('/api/generateSideMission', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                description,
                userName: gameState.userName,
                rankName: gameState.rank?.name || 'Unranked'
            }),
        });
        if (resp.ok) {
            const data = await resp.json();
            return data;
        }
        // Fallback
        return {
            id: `sm-${Date.now()}`,
            title: "Direct Action",
            userDescription: description,
            tier: 'D',
            xp: 200,
            statBoost: { stat: StatName.Physical, subStat: SubStatName.Strength, amount: 10 },
            stages: [{
                title: "Execution",
                description: "Perform the described action.",
                isCompleted: false,            objectives: [{ description: "Action verified.", isCompleted: false, type: 'action' }]
        }],
        status: 'Active',
        createdAt: new Date().toISOString(),
        estimatedCompletionTime: '24h'
        };
    } catch (error) {
        console.error('[Gemini Service] Error in generateSideMission:', error);
        return {
            id: `sm-${Date.now()}`,
            title: "Direct Action",
            userDescription: description,
            tier: 'D',
            xp: 200,
            statBoost: { stat: StatName.Physical, subStat: SubStatName.Strength, amount: 10 },
            stages: [{
                title: "Execution",
                description: "Perform the described action.",
                isCompleted: false,
                objectives: [{ description: "Action verified.", isCompleted: false, type: 'action' }]
            }],
            status: 'Active',
            createdAt: new Date().toISOString(),
            estimatedCompletionTime: '24h'
        };
    }
};

export const evaluatePsychometricData = async (data: any): Promise<any> => {
    // Stub - Complex psychometric analysis
    console.warn('[Gemini Service] evaluatePsychometricData: stub implementation');
    return {};
};

/**
 * Generate tactical suggestions via backend endpoint
 */
export const generateTacticalSuggestions = async (stats: Stat[], archetype: string): Promise<{ title: string; suggestions: string[] }> => {
    try {
        const resp = await fetch('/api/generateTacticalSuggestions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userName: 'Player',
                rankName: 'General',
                stats: stats.map(s => ({ name: s.name, value: s.value })),
                archetype
            }),
        });
        if (resp.ok) {
            const data = await resp.json();
            return data;
        }
        // Fallback
        return {
            title: "Tactical Fallback",
            suggestions: ["Maintain consistency.", "Prioritize the Floor.", "Monitor objectives."]
        };
    } catch (error) {
        console.error('[Gemini Service] Error in generateTacticalSuggestions:', error);
        return {
            title: "Tactical Fallback",
            suggestions: ["Maintain consistency.", "Prioritize the Floor.", "Monitor objectives."]
        };
    }
};

export const generateAutomatedSchedule = async (gameState: GameState): Promise<any> => {
    // Stub - Schedule optimization is complex
    console.warn('[Gemini Service] generateAutomatedSchedule: stub implementation');
    return {};
};

export const generateAutomaticEvolution = async (path: Path): Promise<any> => {
    // Stub - Path evolution is complex
    console.warn('[Gemini Service] generateAutomaticEvolution: stub implementation');
    return {};
};

export const generateAdaptiveStage = async (mission: SideMission, currentStageIndex: number, failedObjectiveIndex: number, gameState: GameState): Promise<any> => {
    // Stub - Adaptive stages can be complex
    console.warn('[Gemini Service] generateAdaptiveStage: stub implementation');
    return {};
};

export const analyzeNutrition = async (input: string, currentMetrics?: DailyMetrics, targets?: any): Promise<NutritionAnalysis> => {
    // Stub - Nutrition analysis
    console.warn('[Gemini Service] analyzeNutrition: stub implementation');
    return {
        isClean: true,
        explanation: "Fallback estimation.",
        estimatedMacros: { calories: 500, protein: 30, carbs: 40, fats: 15 }
    };
};

export const generateSpecializedReasoningQuestion = async (difficulty: number, domain?: string): Promise<any> => {
    // Stub - Reasoning question generation
    console.warn('[Gemini Service] generateSpecializedReasoningQuestion: stub implementation');
    return {
        text: "Fallback: Solve 2x + 3 = 11",
        options: ["2", "4", "6", "8"],
        correct: 2,
        domain: "Math",
        explanation: "Basic algebra: x = 4"
    };
};

export const generateKnowledgeDomainChallenge = async (difficulty: number, previousDomains?: string[]): Promise<any> => {
    // TODO: Implement backend endpoint for this
    console.warn('[Gemini Service] generateKnowledgeDomainChallenge: stub implementation');
    return {
        question: "What is the scientific name for the Great White Shark?",
        domain: "Biology",
        answer: "Carcharodon carcharias",
        alternatives: ["Squalus carcharias", "Lamna nasus"],
        explanation: "Established binomial nomenclature."
    };
};

export const generateStrategicScenario = async (round: number, previousActions?: any[], difficulty?: any): Promise<any> => {
    // TODO: Implement backend endpoint for this
    console.warn('[Gemini Service] generateStrategicScenario: stub implementation');
    return {
        scenario: "Your team faces resource constraints.",
        context: "Limited budget for the quarter.",
        options: {
            opt_1: { text: "Prioritize infrastructure", impact: "Efficiency +15%, morale -10%" },
            opt_2: { text: "Invest in training", impact: "Capability +20%, risk +5%" },
            opt_3: { text: "Allocate equally", impact: "Balanced" }
        },
        consequenceIfSelected: "Consequences will shape resilience."
    };
};

export const evaluateReasoningQuality = async (question: string, userAnswer: string, correctAnswer: string): Promise<any> => {
    // TODO: Implement backend endpoint for this
    console.warn('[Gemini Service] evaluateReasoningQuality: stub implementation');
    return { correct: false, score: 0, feedback: "Unable to evaluate." };
};

export const evaluateStrategyDecision = async (scenario: string, decision: string, context: string): Promise<any> => {
    // TODO: Implement backend endpoint for this
    console.warn('[Gemini Service] evaluateStrategyDecision: stub implementation');
    return {
        score: 50,
        reasoning: "Assessment unavailable.",
        strengths: [],
        weaknesses: []
    };
};
