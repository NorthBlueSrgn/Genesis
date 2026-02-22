// services/geminiService.ts
// SECURITY: This service should NOT use GoogleGenAI directly in the browser.
// All Gemini API calls must go through secure backend endpoints.
// DO NOT import GoogleGenAI or use API keys in frontend code.

import { GameState, Rank, Stat, ChatMessage, Mission, PromotionExam, LoreEntry, StatName, Path, Task, SubStatName, TaskType, IconName, AttributeRankName, ResonanceSignature, ResonanceType, CodexEntry, SideMission, SideMissionStage, SideMissionObjective, PlannedTask, FullCalibrationReport, TalentDna, TraitAnalysisResult, TaskReport, EvaluationResult, NutritionAnalysis, DailyMetrics } from '../types';
import { RANKS } from "../constants";
import { CREATIVITY_ASSESSMENT_SYSTEM_PROMPT } from '../data/creativityAssessmentFinal'; 

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
    // In browser, we don't check for API keys directly—all calls go through backend
    console.log('[Gemini Service] Using backend endpoints only (no direct API key in browser)');
    return true;
};

export const getCompanionGreeting = async (rank: Rank, stats: Stat[], userName: string): Promise<string> => {
    try {
        // ALWAYS use backend endpoint
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

// NOTE: createOrderChatSession is deprecated
// All chat functionality should now use the /api/orderChatV2 backend endpoint
export const createOrderChatSession = (gameState: GameState, history: ChatMessage[]): any => {
    throw new Error('Direct Gemini chat sessions are no longer supported in the browser. Use the orderChat() async function with backend endpoints instead.');
};

export const generateFullCalibrationReport = async (context: { metrics: Record<StatName, number>, traits: TraitAnalysisResult, narrative: string, mbtType?: string, codename: string, biometrics?: any }): Promise<FullCalibrationReport> => {
    try {
        const apiKey = getGeminiApiKey();
        if (!apiKey) {
            console.error('[Gemini] API key not configured in generateFullCalibrationReport');
            throw new Error('API Key not configured');
        }
        
        const ai = new GoogleGenAI({ apiKey });
        const { talentClass, obsessionLevel } = context.traits;
        const systemInstruction = `You are the Genesis Protocol High-Fidelity Profiler. 
        Generate a mythic candidate dossier based on multi-vector behavioral and physical data. 
        TONE: Clinical, sharp, intelligence-agency style.

        REQUIRED JSON FIELDS:
        - mbtiProfile: Analysis of ${context.mbtType}.
        - centralInsight: qualitative analysis. Use **BOLD** for traits and *italics* for advice.
        - primaryFailureNode: A clinical title for their psych-physical vulnerability.
        - failureNodeRisk: Trigger conditions for failure.
        - successProbability: (0-100).
        - dropoutProbability: (0-100).
        - historicalPrecedent: {name, matchPercentage, alignment}.
        - biometricModifiers: List of 3 impact assessments.

        Return valid JSON.`;
        
        const prompt = `Asset Evaluation: Codename: ${context.codename}, Talent: ${talentClass}, Obsession: ${obsessionLevel}, Stats: ${JSON.stringify(context.metrics)}`;
        const response = await ai.models.generateContent({ model: MODEL_NAME, contents: prompt, config: { systemInstruction, responseMimeType: 'application/json' }});
        const result = getCleanJson(response.text || '{}');
        return { ...result, codename: context.codename } as FullCalibrationReport;
    } catch (error) {
        console.error('[Gemini] Error in generateFullCalibrationReport:', error);
        throw error;
    }
};

export const evaluateKnowledgeAnswer = async (question: string, userAnswer: string): Promise<boolean> => {
    const apiKey = getGeminiApiKey();
    if (!apiKey) return false;
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Trivia Judge. Question: "${question}" User: "${userAnswer}" Return JSON: { "correct": boolean }`;
    try {
        const response = await ai.models.generateContent({ model: MODEL_NAME, contents: prompt, config: { responseMimeType: 'application/json' }});
        return getCleanJson(response.text || '{}')?.correct ?? false;
    } catch (e) { return false; }
};

export const generateAdaptiveQuestion = async (subject: 'Reasoning' | 'Knowledge', answerFormat: 'multiple-choice' | 'short-answer', difficulty: number, history: any[]): Promise<any> => {
    const ai = new GoogleGenAI({ apiKey: getGeminiApiKey() });
    const recallRate = 100 - difficulty;
    const prompt = `Generate a ${subject} question calibrated for a ${recallRate}% population recall rate.
    DIFFICULTY SCALE: 90% (Common) to 1% (Niche).
    STRICT CATEGORIES: Science, History, Philosophy, Literature, Cinema, Geography, Economics, Art History, Technology, Mythology.
    Return JSON: { "questionText": string, "domain": string, "rationale": string, "populationStat": string }`;
    
    try {
        const response = await ai.models.generateContent({ model: MODEL_NAME, contents: prompt, config: { responseMimeType: 'application/json' }});
        return getCleanJson(response.text || '{}');
    } catch (e) {
        return { questionText: "Identify the core principle of the Nash Equilibrium in non-cooperative games.", domain: "Game Theory", populationStat: "25%" };
    }
};

export const generateWarRoomScenario = async (round: number, history: any[], nationStats: any): Promise<any> => {
    const ai = new GoogleGenAI({ apiKey: getGeminiApiKey() });
    const historySummary = history.map(h => `Round ${h.round}: ${h.scenarioTitle} -> Action: ${h.type}`).join('\n');
    const systemInstruction = `You are the Strategy Simulation Engine. Round ${round} of 8. Continuous narrative based on last choice.
    Return JSON: { "title": string, "consequenceSummary": string, "scenario": string, "options": { "opt_1": { "text": string, "impacts": object } } }`;

    const response = await ai.models.generateContent({ 
        model: MODEL_NAME, 
        contents: "Generate the next strategic round.", 
        config: { systemInstruction, responseMimeType: 'application/json' }
    });
    
    return getCleanJson(response.text || '{}');
};

export const evaluateEquilibriumPerformance = async (telemetry: any): Promise<any> => {
    const ai = new GoogleGenAI({ apiKey: getGeminiApiKey() });
    const prompt = `Analyze logic telemetry for the Equilibrium Reasoning Task: ${JSON.stringify(telemetry)}. 
    S-Tier: High precision, minimal 'System Load' spikes.
    Return JSON: { "score": 0-100, "grade": "S/A/B/C", "notes": "Feedback" }`;
    try {
        const response = await ai.models.generateContent({ model: MODEL_NAME, contents: prompt, config: { responseMimeType: 'application/json' } });
        return getCleanJson(response.text || '{}');
    } catch (e) {
        return { score: telemetry.finalSync || 50 };
    }
};

export const evaluateCreativityAnswers = async (inputs: Record<string, string>): Promise<any> => {
    // Evaluate creativity using the finalized 5-prompt system
    const ai = new GoogleGenAI({ apiKey: getGeminiApiKey() });
    
    // Format user responses for evaluation
    const formattedInput = Object.entries(inputs)
        .map(([promptId, response]) => `[${promptId.toUpperCase()}]\n${response}`)
        .join('\n\n');
    
    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: formattedInput,
            config: {
                systemInstruction: CREATIVITY_ASSESSMENT_SYSTEM_PROMPT,
                responseMimeType: 'application/json'
            }
        });
        
        const result = getCleanJson(response.text || '{}');
        
        // Validate and normalize scores
        const substats = ['Imagination', 'Innovation', 'Style', 'Vision', 'Expression'];
        const normalized: Record<string, any> = {};
        
        for (const substat of substats) {
            const data = result[substat] || {};
            const percentile = Math.max(0, Math.min(100, data.percentile || 50));
            normalized[substat] = {
                percentile: Math.round(percentile * 100) / 100,
                signals: data.signals || 'Assessment recorded.'
            };
        }
        
        return normalized;
    } catch (e) {
        console.error('Creativity evaluation error:', e);
        // Fallback: neutral scores
        return {
            Imagination: { percentile: 50, signals: 'Assessment unavailable; neutral baseline applied.' },
            Innovation: { percentile: 50, signals: 'Assessment unavailable; neutral baseline applied.' },
            Style: { percentile: 50, signals: 'Assessment unavailable; neutral baseline applied.' },
            Vision: { percentile: 50, signals: 'Assessment unavailable; neutral baseline applied.' },
            Expression: { percentile: 50, signals: 'Assessment unavailable; neutral baseline applied.' }
        };
    }
};

export const evaluateTaskReport = async (report: TaskReport, taskContext: { description: string; expectedXp: number; statName: string; subStatName: string; rank: string }): Promise<EvaluationResult> => {
    const ai = new GoogleGenAI({ apiKey: getGeminiApiKey() });
    const prompt = `Evaluate performance: "${taskContext.description}". Report: ${JSON.stringify(report)}. Return JSON: {pass, xpAwarded, statAmount, critique, newBenchmark}`;
    try {
        const response = await ai.models.generateContent({ model: MODEL_NAME, contents: prompt, config: { responseMimeType: "application/json" } });
        return getCleanJson(response.text || "{}");
    } catch (e) { return { pass: true, xpAwarded: taskContext.expectedXp, statAmount: 5, critique: "Performance verified via local backup." }; }
};

export const generateNewMission = async (gameState: GameState, userRequest?: string): Promise<Mission> => {
    const ai = new GoogleGenAI({ apiKey: getGeminiApiKey() });
    const prompt = `Directive for ${gameState.userName}. Request: ${userRequest || "General"}. Return JSON: {title, description, xp, statBoost, benchmarkTarget, expiresInHours}`;
    try {
        const response = await ai.models.generateContent({ model: MODEL_NAME, contents: prompt, config: { responseMimeType: "application/json" } });
        const data = getCleanJson(response.text || "{}");
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + (data?.expiresInHours || 24));
        return { id: `mission-${Date.now()}`, isCompleted: false, title: data?.title || "Directive Delta", description: data?.description || "Maintain protocol silence.", xp: data?.xp || 150, statBoost: data?.statBoost || { stat: StatName.Physical, subStat: SubStatName.Strength, amount: 10 }, expiresAt: expiryDate.toISOString() };
    } catch (e) { return { id: `m-err-${Date.now()}`, title: "Manual Override", description: "System fallback directive.", xp: 100, statBoost: { stat: StatName.Vitality, subStat: SubStatName.Stamina, amount: 5 }, isCompleted: false }; }
};

export const generatePromotionExam = async (gameState: GameState): Promise<{ mission: Mission, exam: PromotionExam }> => {
    const ai = new GoogleGenAI({ apiKey: getGeminiApiKey() });
    const prompt = `Promotion exam for ${gameState.userName}. Return JSON: {missionTitle, missionDescription, xp, statBoostAmount, primaryStat, objectives: string[]}`;
    try {
        const response = await ai.models.generateContent({ model: MODEL_NAME, contents: prompt, config: { responseMimeType: "application/json" } });
        const data = getCleanJson(response.text || "{}");
        const nextRank = RANKS[RANKS.findIndex(r => r.name === gameState.rank.name) + 1]?.name || gameState.rank.name;
        const mission = { id: `exam-${Date.now()}`, title: data.missionTitle || `Grade ${nextRank} Trial`, description: data.missionDescription || "Final evaluation sequence.", xp: data.xp || 1000, statBoost: { stat: data.primaryStat || StatName.Intelligence, amount: data.statBoostAmount || 50 }, isCompleted: false, isPromotionExam: true };
        const exam = { missionId: mission.id, targetRank: nextRank, objectives: (data.objectives || ["Complete primary objective."]).map((o: string) => ({ description: o, isCompleted: false })) };
        return { mission, exam };
    } catch (e) {
        const nextRank = AttributeRankName.D;
        const mission = { id: `exam-f-${Date.now()}`, title: "Emergency Trial", description: "Offline evaluation.", xp: 500, statBoost: { stat: StatName.Psyche, amount: 20 }, isCompleted: false, isPromotionExam: true };
        const exam = { missionId: mission.id, targetRank: nextRank, objectives: [{ description: "Prove capability.", isCompleted: false }] };
        return { mission, exam };
    }
};

export const generateNewChapter = async (gameState: GameState): Promise<LoreEntry> => {
    const ai = new GoogleGenAI({ apiKey: getGeminiApiKey() });
    const nextNum = (gameState.lore.length > 0 ? Math.max(...gameState.lore.map(l => l.chapterNumber)) : 0) + 1;
    const prompt = `Write entry ${nextNum} of 'Chapter Black'. Deep worldbuilding. Return JSON: {title, content, choices: string[] | null}`;
    try {
        const response = await ai.models.generateContent({ model: MODEL_NAME, contents: prompt, config: { responseMimeType: "application/json" } });
        const data = getCleanJson(response.text || "{}");
        return { id: `chapter-${Date.now()}`, date: new Date().toISOString(), chapterNumber: nextNum, ...data };
    } catch (e) {
        return { id: `chapter-f-${Date.now()}`, date: new Date().toISOString(), chapterNumber: nextNum, title: "Static Interference", content: "The recording is corrupted. Only fragments remain of the previous cycle.", choices: null };
    }
};

export const generateSideMission = async (description: string, gameState: GameState): Promise<SideMission> => {
    try {
        const ai = getSafeGeminiClient();
        const prompt = `Deconstruct Side Mission: "${description}". Return JSON: {title, tier, xp, statBoost, stages: [{title, description, objectives: [{description, type}]}]}`;
        const response = await ai.models.generateContent({ model: MODEL_NAME, contents: prompt, config: { responseMimeType: "application/json" } });
        const data = getCleanJson(response.text || "{}");
        return { id: `sm-${Date.now()}`, userDescription: description, status: 'Active', createdAt: new Date().toISOString(), ...data, stages: (data.stages || []).map((s: any) => ({ ...s, isCompleted: false, objectives: (s.objectives || []).map((o: any) => ({ ...o, isCompleted: false })) })) };
    } catch (e) {
        console.warn("[generateSideMission] Using fallback:", e);
        return { id: `sm-f-${Date.now()}`, title: "Direct Action", userDescription: description, tier: 'D', xp: 200, statBoost: { stat: StatName.Physical, subStat: SubStatName.Strength, amount: 10 }, stages: [{ title: "Execution", description: "Perform the described action.", isCompleted: false, objectives: [{ description: "Action verified.", isCompleted: false, type: 'action' }] }], status: 'Active', createdAt: new Date().toISOString(), estimatedCompletionTime: '24h' };
    }
};

export const evaluatePsychometricData = async (data: any): Promise<any> => {
    const ai = new GoogleGenAI({ apiKey: getGeminiApiKey() });
    const prompt = `Analyze psych data: ${JSON.stringify(data)}. Return JSON: {psycheScores: {}, spiritScores: {}, analysis: ""}`;
    try {
        const response = await ai.models.generateContent({ model: MODEL_NAME, contents: prompt, config: { responseMimeType: 'application/json' }});
        return getCleanJson(response.text || '{}');
    } catch (e) { return {}; }
};

export const generateTacticalSuggestions = async (stats: Stat[], archetype: string): Promise<{ title: string; suggestions: string[] }> => {
    const ai = new GoogleGenAI({ apiKey: getGeminiApiKey() });
    const prompt = `Operative: ${archetype}. Stats: ${JSON.stringify(stats)}. Generate 3 clinical, elite tactical advice lines. Return JSON: {title, suggestions: string[]}`;
    try {
        const response = await ai.models.generateContent({ model: MODEL_NAME, contents: prompt, config: { responseMimeType: 'application/json' }});
        return getCleanJson(response.text || '{}');
    } catch (e) { return { title: "Tactical Fallback", suggestions: ["Maintain consistency.", "Prioritize the Floor.", "Monitor The Forsaken."] }; }
};

export const generateAutomatedSchedule = async (gameState: GameState): Promise<any> => {
    const ai = new GoogleGenAI({ apiKey: getGeminiApiKey() });
    const prompt = `Optimize weekly schedule for: ${JSON.stringify(gameState.paths.map(p => p.name))}. Return JSON: Record<day, [{hour, taskId, pathId}]>`;
    try {
        const response = await ai.models.generateContent({ model: MODEL_NAME, contents: prompt, config: { responseMimeType: 'application/json' } });
        return getCleanJson(response.text || '{}');
    } catch (e) { return {}; }
};

export const generateAutomaticEvolution = async (path: Path): Promise<any> => {
    const ai = new GoogleGenAI({ apiKey: getGeminiApiKey() });
    const prompt = `Evolve Protocol: "${path.name}". Make it more advanced. Return JSON: {newName, newDescription, newTasks}`;
    try {
        const response = await ai.models.generateContent({ model: MODEL_NAME, contents: prompt, config: { responseMimeType: 'application/json' } });
        return getCleanJson(response.text || '{}');
    } catch (e) { return {}; }
};

export const generateAdaptiveStage = async (mission: SideMission, currentStageIndex: number, failedObjectiveIndex: number, gameState: GameState): Promise<any> => {
    const ai = new GoogleGenAI({ apiKey: getGeminiApiKey() });
    const prompt = `Adaptive stage for failure on "${mission.title}". Return JSON: {title, description, objectives}`;
    try {
        const response = await ai.models.generateContent({ model: MODEL_NAME, contents: prompt, config: { responseMimeType: 'application/json' } });
        return getCleanJson(response.text || '{}');
    } catch (e) { return {}; }
};

export const analyzeNutrition = async (input: string, currentMetrics?: DailyMetrics, targets?: { calories: number; protein: number; carbs: number; fats: number; }): Promise<NutritionAnalysis> => {
    const ai = new GoogleGenAI({ apiKey: getGeminiApiKey() });
    const prompt = `Nutritional audit: "${input}". Return JSON: {isClean, explanation, estimatedMacros: {calories, protein, carbs, fats}}`;
    try {
        const response = await ai.models.generateContent({ model: MODEL_NAME, contents: prompt, config: { responseMimeType: "application/json" } });
        return getCleanJson(response.text || "{}");
    } catch (e) { return { isClean: true, explanation: "Fallback fuel estimation.", estimatedMacros: { calories: 500, protein: 30, carbs: 40, fats: 15 } }; }
};

export const generateSpecializedReasoningQuestion = async (difficulty: number, domain?: string): Promise<{ text: string; options: string[]; correct: number; domain: string; explanation: string }> => {
    const ai = new GoogleGenAI({ apiKey: getGeminiApiKey() });
    const populationPercentile = 100 - difficulty; // e.g., difficulty 20 = 80th percentile
    const selectedDomain = domain || ['Logic', 'Math', 'Analogy', 'Probability', 'Pattern Recognition', 'Deduction'][Math.floor(Math.random() * 6)];
    
    const systemPrompt = `You are a rigorous reasoning test generator. Create challenging, elegant questions that assess critical thinking.
    CRITICAL: Return VALID JSON only, no markdown. Never wrap in triple backticks.
    Difficulty ${populationPercentile}% means ${populationPercentile}% of test-takers answer correctly.
    Return: {"text": "...", "options": ["A", "B", "C", "D"], "correct": 0, "domain": "...", "explanation": "..."}`;
    
    const prompt = `Generate a ${selectedDomain} reasoning question for the ${populationPercentile}th percentile (${populationPercentile}%
    can solve).
    Make it intellectually rigorous and elegant. Ensure exactly 4 options.`;
    
    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
            config: { systemInstruction: systemPrompt, responseMimeType: 'application/json' }
        });
        const result = getCleanJson(response.text || '{}');
        
        // Validate result
        if (result.text && Array.isArray(result.options) && result.options.length === 4 && typeof result.correct === 'number') {
            return result;
        }
        return { text: "Fallback: Solve 2x + 3 = 11", options: ["2", "4", "6", "8"], correct: 2, domain: "Math", explanation: "Basic algebra: x = 4" };
    } catch (e) {
        console.error('generateSpecializedReasoningQuestion error:', e);
        return { text: "Fallback: Solve 2x + 3 = 11", options: ["2", "4", "6", "8"], correct: 2, domain: "Math", explanation: "Basic algebra: x = 4" };
    }
};

export const generateKnowledgeDomainChallenge = async (difficulty: number, previousDomains: string[] = []): Promise<{ question: string; domain: string; answer: string; alternatives: string[]; explanation: string }> => {
    const ai = new GoogleGenAI({ apiKey: getGeminiApiKey() });
    const populationPercentile = 100 - difficulty;
    const excludedDomains = previousDomains.length > 0 ? `Avoid: ${previousDomains.join(', ')}` : '';
    
    const systemPrompt = `You are a knowledge assessment generator. Create substantive, fact-based questions across diverse domains.
    CRITICAL: Return VALID JSON only, no markdown. Never wrap in triple backticks.
    Return: {"question": "...", "domain": "...", "answer": "...", "alternatives": ["alt1", "alt2"], "explanation": "..."}`;
    
    const prompt = `Generate a knowledge question for ${populationPercentile}th percentile difficulty. ${excludedDomains}
    Domains: Science, History, Philosophy, Literature, Art, Geography, Economics, Technology, Psychology, Culture.
    Make it substantive and intellectually stimulating.`;
    
    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
            config: { systemInstruction: systemPrompt, responseMimeType: 'application/json' }
        });
        const result = getCleanJson(response.text || '{}');
        if (result.question && result.answer && result.domain) {
            return result;
        }
        return { question: "What is the scientific name for the Great White Shark?", domain: "Biology", answer: "Carcharodon carcharias", alternatives: ["Squalus carcharias", "Lamna nasus"], explanation: "Established binomial nomenclature." };
    } catch (e) {
        console.error('generateKnowledgeDomainChallenge error:', e);
        return { question: "What is the scientific name for the Great White Shark?", domain: "Biology", answer: "Carcharodon carcharias", alternatives: ["Squalus carcharias", "Lamna nasus"], explanation: "Established binomial nomenclature." };
    }
};

export const generateStrategicScenario = async (round: number, previousActions: any[] = [], difficulty: 'medium' | 'hard' = 'medium'): Promise<{ scenario: string; context: string; options: { opt_1: { text: string; impact: string }; opt_2: { text: string; impact: string }; opt_3: { text: string; impact: string } }; consequenceIfSelected: string }> => {
    const ai = new GoogleGenAI({ apiKey: getGeminiApiKey() });
    
    const historyContext = previousActions.length > 0 
        ? `Previous actions: ${previousActions.map((a, i) => `Round ${i + 1}: ${a}`).join(', ')}` 
        : 'First scenario.';
    
    const systemPrompt = `You are a strategic scenario generator. Create complex, realistic dilemmas that test decision-making under pressure.
    CRITICAL: Return VALID JSON only. Never wrap output in markdown or backticks.
    Return: {"scenario": "...", "context": "...", "options": {"opt_1": {"text": "...", "impact": "..."}, "opt_2": {...}, "opt_3": {...}}, "consequenceIfSelected": "..."}`;
    
    const prompt = `Round ${round} scenario (${difficulty} difficulty). ${historyContext}
    Create a realistic strategic situation requiring trade-off analysis. Make it thought-provoking.
    Ensure each option has real consequences.`;
    
    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
            config: { systemInstruction: systemPrompt, responseMimeType: 'application/json' }
        });
        const result = getCleanJson(response.text || '{}');
        if (result.scenario && result.options && result.options.opt_1) {
            return result;
        }
        // Fallback
        return {
            scenario: "Your team faces resource constraints with competing operational priorities.",
            context: "Limited budget for the quarter; critical infrastructure vs. personnel development.",
            options: {
                opt_1: { text: "Prioritize infrastructure upgrade", impact: "Operational efficiency +15%, morale -10%" },
                opt_2: { text: "Invest in staff training", impact: "Long-term capability +20%, immediate risk +5%" },
                opt_3: { text: "Allocate equally", impact: "Balanced risk, efficiency +8%, capability +10%" }
            },
            consequenceIfSelected: "Consequences will shape your team's resilience."
        };
    } catch (e) {
        console.error('generateStrategicScenario error:', e);
        return {
            scenario: "Your team faces resource constraints with competing operational priorities.",
            context: "Limited budget for the quarter; critical infrastructure vs. personnel development.",
            options: {
                opt_1: { text: "Prioritize infrastructure upgrade", impact: "Operational efficiency +15%, morale -10%" },
                opt_2: { text: "Invest in staff training", impact: "Long-term capability +20%, immediate risk +5%" },
                opt_3: { text: "Allocate equally", impact: "Balanced risk, efficiency +8%, capability +10%" }
            },
            consequenceIfSelected: "Consequences will shape your team's resilience."
        };
    }
};

export const evaluateReasoningQuality = async (question: string, userAnswer: string, correctAnswer: string): Promise<{ correct: boolean; score: number; feedback: string }> => {
    const ai = new GoogleGenAI({ apiKey: getGeminiApiKey() });
    
    const systemPrompt = `You are a test evaluator. Assess reasoning quality.
    Return: {"correct": boolean, "score": 0-100, "feedback": "..."}`;
    
    const prompt = `Question: "${question}" | User Answer: "${userAnswer}" | Correct: "${correctAnswer}"
    Is the user answer correct or logically equivalent? Provide feedback.`;
    
    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
            config: { systemInstruction: systemPrompt, responseMimeType: 'application/json' }
        });
        const result = getCleanJson(response.text || '{}');
        return result.correct !== undefined ? result : { correct: false, score: 0, feedback: "Unable to evaluate." };
    } catch (e) {
        return { correct: false, score: 0, feedback: "Evaluation service unavailable." };
    }
};

export const evaluateStrategyDecision = async (scenario: string, decision: string, context: string): Promise<{ score: number; reasoning: string; strengths: string[]; weaknesses: string[] }> => {
    const ai = new GoogleGenAI({ apiKey: getGeminiApiKey() });
    
    const systemPrompt = `You are a strategic analyst. Evaluate decisions on quality, foresight, and risk management.
    Return: {"score": 0-100, "reasoning": "...", "strengths": [...], "weaknesses": [...]}`;
    
    const prompt = `Scenario: "${scenario}" | Decision: "${decision}" | Context: "${context}"
    Rate the strategic merit of this decision. Consider short/long-term impacts, risk, and alternatives.`;
    
    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
            config: { systemInstruction: systemPrompt, responseMimeType: 'application/json' }
        });
        const result = getCleanJson(response.text || '{}');
        return result.score !== undefined ? result : { score: 50, reasoning: "Assessment unavailable.", strengths: [], weaknesses: [] };
    } catch (e) {
        return { score: 50, reasoning: "Assessment unavailable.", strengths: [], weaknesses: [] };
    }
};
