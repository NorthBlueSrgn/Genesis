// services/scoringService.ts
import { Stat, AttributeRankName, StatName, SubStatName, TraitAnalysisResult, TraitScores, TalentClass, ObsessionLevel, TalentDna, ResonanceVector, ResonanceType } from '../types';
import { RANK_PERCENTILES, ATTRIBUTE_RANKS, RANK_MAP } from '../constants';

export const interpolate = (value: number, mapping: [number, number][]): number => {
    if (mapping.length < 2) return 0;
    const sortedMapping = [...mapping].sort((a, b) => a[0] - b[0]);
    if (value <= sortedMapping[0][0]) return sortedMapping[0][1];
    if (value >= sortedMapping[sortedMapping.length - 1][0]) return sortedMapping[sortedMapping.length - 1][1];

    for (let i = 0; i < sortedMapping.length - 1; i++) {
        const [v1, p1] = sortedMapping[i];
        const [v2, p2] = sortedMapping[i+1];
        if (value >= v1 && value <= v2) {
            const ratio = (value - v1) / (v2 - v1);
            return p1 + ratio * (p2 - p1);
        }
    }
    return 0;
};

export const mapScoreToRank = (score: number): AttributeRankName => {
    const ranks = [
        AttributeRankName.SS_PLUS,
        AttributeRankName.SS,
        AttributeRankName.S,
        AttributeRankName.A,
        AttributeRankName.B,
        AttributeRankName.C,
        AttributeRankName.D,
        AttributeRankName.E
    ];
    for (const rank of ranks) {
        if (score >= RANK_PERCENTILES[rank].min) return rank;
    }
    return AttributeRankName.E;
};

/**
 * MYTHIC CODENAME ENGINE
 * Generates cold, dossier-worthy designations based on username and behavioral signals.
 */
export const generateCodename = (username: string): string => {
    const name = username.trim();
    const lower = name.toLowerCase();
    
    // 1. High-Signal Extraction (Surgeon, Reaper, King, etc)
    if (lower.includes('surgeon')) return `Surgeon of the ${name.replace(/surgeon/i, '').trim() || 'Void'}`;
    if (lower.includes('reaper')) return `The ${name.replace(/reaper/i, '').trim() || 'Silent'} Reaper`;
    if (lower.includes('king')) return `The One-Eyed ${name.replace(/king/i, '').trim() || 'Ghost'}`;
    if (lower.includes('doc') || lower.includes('prof')) return `${name} Infinity`;
    
    // 2. Structural Signal (Short names, numbers)
    if (name.length <= 3) return `Subject: ${name.toUpperCase()}`;
    
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const modifiers = ['Black', 'Silent', 'Crimson', 'Phantom', 'Iron', 'Cold', 'Apex', 'Rogue', 'Void', 'Chrome'];
    const concepts = ['Paradox', 'Anomaly', 'Exception', 'Vanguard', 'Protocol', 'Catalyst', 'Asset', 'Fable', 'Echo', 'Zero'];
    
    // 3. Archetypal Templates
    const formats = [
        () => `${name} ${concepts[hash % concepts.length]}`,
        () => `The ${name} ${concepts[(hash + 1) % concepts.length]}`,
        () => `${modifiers[hash % modifiers.length]} ${name.split(' ')[0]}`,
        () => `${name}: The ${concepts[hash % concepts.length]}`,
        () => `Project ${name.toUpperCase()}`
    ];
    
    return formats[hash % formats.length]();
};

export const convertPercentileToSubstatValue = (percentile: number): number => {
    if (percentile <= 1) return 0;
    const base = 1.055; 
    const scalingFactor = 150; 
    return Math.floor(scalingFactor * (Math.pow(base, percentile) - 1));
};

export const percentileMappings: Record<string, Record<string, [number, number][]>> = {
    strength: {
        benchPress: [ [40, 10], [60, 30], [70, 50], [90, 75], [100, 85], [120, 90], [140, 97], [160, 99.5] ],
        squat: [ [50, 10], [80, 30], [100, 50], [130, 75], [150, 85], [170, 95], [200, 99] ],
        deadlift: [ [70, 10], [110, 30], [140, 50], [180, 75], [210, 85], [240, 95], [280, 99.9] ],
        pullUps: [ [0, 5], [5, 25], [10, 50], [15, 75], [20, 88], [25, 95], [30, 98], [40, 99.9] ],
        pushUps: [ [10, 10], [25, 30], [40, 50], [60, 75], [75, 85], [90, 95], [100, 99] ],
    },
    vitality: {
        breathHold: [ [30, 15], [45, 30], [60, 50], [90, 75], [120, 90], [150, 95], [180, 99.9] ],
    },
    dexterity: {
        fittsLaw: [ [900, 5], [750, 15], [600, 40], [500, 60], [400, 80], [300, 95], [250, 99], [200, 99.9] ]
    },
    creativity: {
        divergentCount: [ [5, 10], [10, 25], [15, 40], [20, 60], [25, 75], [30, 85], [35, 95], [40, 99.9] ]
    },
    knowledge: {
        adaptiveScore: [ [10, 10], [30, 30], [50, 50], [70, 70], [80, 85], [90, 95], [99, 99.9] ]
    },
    adaptability: {
        // Updated: Aggressive post-median scaling.
        // 10 tiles = 50% (C), 14 tiles = 75% (A), 18 tiles = 90% (S), 22 tiles = 97% (SS), 25 tiles = 99.9% (SS+)
        simonSays: [ [6, 10], [8, 30], [10, 50], [14, 75], [18, 90], [22, 97], [25, 99.9] ]
    }
};

export const performTraitAnalysis = (percentiles: Record<StatName, number>, inputs: any): TraitAnalysisResult => {
    const narrativeInput = inputs['narrative-prompt']?.['narrative-prompt'] || "";
    
    // GIBBERISH DEFENSE
    const isSpam = /(.)\1{5,}/.test(narrativeInput);
    const isTooShort = narrativeInput.trim().length < 20;
    const isGibberish = isSpam || isTooShort;

    const avgScore = isGibberish ? 0 : (Object.values(percentiles).reduce((a, b) => a + b, 0) / 6);
    const age = parseInt(inputs['biometric-data']?.age || '25');
    
    // Tk Mapping (Talent Class - Continuous)
    // 1: Laggard, 2: Average, 3: Talented Learner, 4: Gifted, 5: Genius
    const tkMapping: [number, number][] = [
        [0, 1.0], [25, 2.0], [50, 3.0], [75, 4.0], [95, 5.0]
    ];
    const Tk = interpolate(avgScore, tkMapping);

    let talentClass: TalentClass = 'Average';
    if (Tk >= 4.8) talentClass = 'Genius';
    else if (Tk >= 4.0) talentClass = 'Gifted';
    else if (Tk >= 3.0) talentClass = 'Talented Learner';
    else if (Tk >= 2.0) talentClass = 'Average';
    else talentClass = 'Laggard';

    // Ok Mapping (Obsession Class - Continuous)
    // 1: Lazy, 2: Average, 3: Locked-In, 4: Relentless, 5: Compulsive
    const psychData = inputs['psychometric-evaluation'] || {};
    const grit = psychData[SubStatName.Resilience] || 50;
    const willpower = psychData[SubStatName.Willpower] || 50;
    const obsessionScore = isGibberish ? 0 : (grit * 0.7 + willpower * 0.3);

    const okMapping: [number, number][] = [
        [0, 1.0], [30, 2.0], [60, 3.0], [80, 4.0], [95, 5.0]
    ];
    const Ok = interpolate(obsessionScore, okMapping);

    let obsessionLevel: ObsessionLevel = 'Average';
    if (Ok >= 4.8) obsessionLevel = 'Compulsive';
    else if (Ok >= 4.0) obsessionLevel = 'Relentless';
    else if (Ok >= 3.0) obsessionLevel = 'Locked-In';
    else if (Ok >= 2.0) obsessionLevel = 'Average';
    else obsessionLevel = 'Lazy';

    // Rarity Calculation: n = Tk + Ok - 2
    let n = Tk + Ok - 2;
    // Grace Rule: If Talent ≥ Gifted (Tk ≥ 4), then n = max(n, Tk)
    if (Tk >= 4.0) {
        n = Math.max(n, Tk);
    }

    const rarityVal = Math.pow(10, n);
    let rarityStr = "1 in 1";
    if (rarityVal < 1000) {
        rarityStr = `1 in ${Math.round(rarityVal)}`;
    } else if (rarityVal < 1000000) {
        rarityStr = `1 in ${(rarityVal / 1000).toFixed(1)}k`;
    } else {
        rarityStr = `1 in ${(rarityVal / 1000000).toFixed(1)}M`;
    }

    // Labeling: u18 + Gifted/Genius = Prodigy
    const isProdigyLabel = age < 18 && Tk >= 4.0;
    const archetypeTitle = isGibberish 
        ? "Inactive Shell" 
        : (isProdigyLabel ? "Unawakened Prodigy" : "Calibrated Operative");

    return {
        talentClass,
        obsessionLevel,
        archetypeTitle,
        rarity: isGibberish ? "N/A" : rarityStr,
        traitScores: { 
            IP: avgScore, 
            LE: grit, 
            RE: grit, 
            FO: willpower, 
            EX: avgScore, 
            CO: percentiles[StatName.Creativity] || 0 
        }
    };
};

export const calculateScores = (stats: Stat[]): { apexThreatIndex: number, attributePercentiles: Record<StatName, number> } => {
    const attributePercentiles = {} as Record<StatName, number>;
    stats.forEach(s => {
         const mapping: [number, number][] = ATTRIBUTE_RANKS.map((r) => {
             const pMap: Record<string, number> = { 'E': 10, 'D': 30, 'C': 50, 'B': 67, 'A': 82, 'S': 93, 'SS': 98, 'SS+': 100 };
             return [r.threshold, pMap[r.name] || 0];
         });
         attributePercentiles[s.name] = interpolate(s.value, mapping);
    });
    
    const apexThreatIndex = Object.values(attributePercentiles).reduce((a, b) => a + b, 0) / 6;
    return { apexThreatIndex, attributePercentiles };
};

export const calculateTalentDistribution = (percentiles: Record<StatName, number>, inputs: any): { dna: TalentDna, raw: TraitScores } => {
    const analysis = performTraitAnalysis(percentiles, inputs);
    return {
        dna: { 
            BP: analysis.traitScores.IP / 100, 
            LV: analysis.traitScores.LE / 100, 
            DR: analysis.traitScores.FO / 100 
        },
        raw: analysis.traitScores
    };
};

export const calculateCeilingRank = (startRank: AttributeRankName, talentClass: TalentClass): AttributeRankName => {
    const multipliers: Record<TalentClass, number> = {
        'Genius': 2.8,
        'Gifted': 2.2,
        'Talented Learner': 1.8,
        'Average': 1.4,
        'Laggard': 1.1
    };
    const rankVal = RANK_MAP[startRank];
    const ceilingVal = Math.min(7, Math.floor(rankVal * multipliers[talentClass]));
    const reverseMap: AttributeRankName[] = [AttributeRankName.E, AttributeRankName.D, AttributeRankName.C, AttributeRankName.B, AttributeRankName.A, AttributeRankName.S, AttributeRankName.SS, AttributeRankName.SS_PLUS];
    return reverseMap[ceilingVal];
};

export const calculateInitialResonanceVector = (inputs: any): ResonanceVector => {
    return {
        [ResonanceType.Unawakened]: 1,
        [ResonanceType.Juggernaut]: 0,
        [ResonanceType.Chameleon]: 0,
        [ResonanceType.Virtuoso]: 0,
        [ResonanceType.Joker]: 0,
        [ResonanceType.Catalyst]: 0,
        [ResonanceType.Cipher]: 0
    };
};

export const driftResonance = (current: ResonanceVector | undefined, action: string, context: any): ResonanceVector => {
    return current || calculateInitialResonanceVector({});
};

export const getBiometricCoefficient = (metric: string, biometrics: any): number => 1.0;

export const convertStatsToPercentiles = (stats: Stat[]): Record<StatName, number> => {
    const { attributePercentiles } = calculateScores(stats);
    return attributePercentiles;
};

export const getPercentileForMetric = (category: string, metric: string, value: number): number => {
    const mapping = percentileMappings[category]?.[metric];
    if (!mapping) return 50;
    return interpolate(value, mapping);
};

export const calculateBurstReward = (baseXp: number, multiplier: number = 1.0): number => {
    return Math.round(baseXp * multiplier);
};

export const calculateNutritionalTargets = (biometrics: any): { calories: number; protein: number; carbs: number; fats: number; } => {
    if (!biometrics) return { calories: 2000, protein: 150, carbs: 200, fats: 65 };
    const weightStr = biometrics.weight || '70kg';
    const weight = parseInt(weightStr.replace('kg', '')) || 70;
    const calories = weight * 33;
    const protein = weight * 2.0;
    const fats = weight * 0.9;
    const carbs = (calories - (protein * 4) - (fats * 9)) / 4;
    return { calories: Math.round(calories), protein: Math.round(protein), carbs: Math.round(carbs), fats: Math.round(fats) };
};

export const getPercentileForSubstat = (subStatName: SubStatName, inputs: any, context: any): number => {
    const { creativityXP, psycheScores, spiritScores } = context;
    if (creativityXP?.[subStatName] !== undefined) return creativityXP[subStatName];
    if (psycheScores?.[subStatName] !== undefined) return psycheScores[subStatName];
    if (spiritScores?.[subStatName] !== undefined) return spiritScores[subStatName];
    return 50;
};

/**
 * COMPREHENSIVE SUBSTAT CALCULATOR
 * Extracts all test results and accurately maps them to substats
 * with proper averaging, inflation prevention, and weighting
 */
export const calculateSubstatsFromAllTests = (inputs: any): Record<SubStatName, number> => {
    const substats: Record<SubStatName, number> = {
        [SubStatName.Strength]: 50,
        [SubStatName.Speed]: 50,
        [SubStatName.Endurance]: 50,
        [SubStatName.Dexterity]: 50,
        [SubStatName.Agility]: 50,
        [SubStatName.Stamina]: 50,
        [SubStatName.Regeneration]: 50,
        [SubStatName.Adherence]: 50,
        [SubStatName.Balance]: 50,
        [SubStatName.Longevity]: 50,
        [SubStatName.Reason]: 50,
        [SubStatName.Knowledge]: 50,
        [SubStatName.Adaptability]: 50,
        [SubStatName.Strategy]: 50,
        [SubStatName.Perception]: 50,
        [SubStatName.Imagination]: 50,
        [SubStatName.Innovation]: 50,
        [SubStatName.Style]: 50,
        [SubStatName.Expression]: 50,
        [SubStatName.Vision]: 50,
        [SubStatName.Faith]: 50,
        [SubStatName.Purpose]: 50,
        [SubStatName.Tranquility]: 50,
        [SubStatName.Empathy]: 50,
        [SubStatName.Conviction]: 50,
        [SubStatName.Resilience]: 50,
        [SubStatName.Charisma]: 50,
        [SubStatName.Focus]: 50,
        [SubStatName.Willpower]: 50,
        [SubStatName.Composure]: 50,
    };
    
    // Helper: Average multiple percentiles, cap at 95 to prevent inflation
    const average = (values: number[]): number => {
        const filtered = values.filter(v => v !== null && v !== undefined);
        if (filtered.length === 0) return 50;
        const avg = filtered.reduce((a, b) => a + b, 0) / filtered.length;
        return Math.min(95, avg); // Cap at 95 to allow for growth
    };

    // ===== PHYSICAL STATS =====
    const physical = inputs['physical-performance'] || {};
    const strengthBench = getPercentileForMetric('strength', 'benchPress', parseInt(physical.benchPress) || 0);
    const strengthSquat = getPercentileForMetric('strength', 'squat', parseInt(physical.squat) || 0);
    const strengthDeadlift = getPercentileForMetric('strength', 'deadlift', parseInt(physical.deadlift) || 0);
    substats[SubStatName.Strength] = average([strengthBench, strengthSquat, strengthDeadlift]);

    const speedSprint = getPercentileForMetric('strength', 'sprint100m', parseInt(physical.sprint100m) || 0);
    substats[SubStatName.Speed] = speedSprint;

    const endurance5k = getPercentileForMetric('strength', 'run5k', parseInt(physical.run5k) || 0);
    substats[SubStatName.Endurance] = endurance5k;

    const fittsLaw = inputs['fitts-law-test']?.avgReactionMs || 1000;
    const dexterityFitts = getPercentileForMetric('dexterity', 'fittsLaw', fittsLaw);
    const dexterityTyping = getPercentileForMetric('strength', 'typingSpeed', parseInt(physical.typingSpeed) || 0);
    substats[SubStatName.Dexterity] = average([dexterityFitts, dexterityTyping]);

    const agilityShuttle = getPercentileForMetric('strength', 'proAgility', parseInt(physical.proAgility) || 0);
    substats[SubStatName.Agility] = agilityShuttle;

    // ===== VITALITY STATS =====
    const breath = inputs['breath-hold-test']?.['vitality-breath-hold'] || {};
    const staminaBreath = getPercentileForMetric('vitality', 'breathHold', breath.timeSeconds || 0);
    const simonSays = inputs['simon-says-test'] || {};
    const simonLevel = simonSays.maxLevel || 1;
    const staminaSimon = getPercentileForMetric('adaptability', 'simonSays', simonLevel) * 0.5; // Secondary test, 50% weight
    substats[SubStatName.Stamina] = average([staminaBreath, staminaSimon]);

    const vitality = inputs['vitality-questionnaire'] || {};
    const sleepHours = parseInt(vitality.sleepHours) || 7;
    const sleepMapping: [number, number][] = [[4, 20], [5, 35], [6, 50], [7, 70], [8, 85], [9, 95], [10, 99]];
    const regenerationSleep = interpolate(sleepHours, sleepMapping);
    const sleepQuality = parseInt(vitality.sleepQuality) || 50;
    substats[SubStatName.Regeneration] = average([regenerationSleep, sleepQuality]);

    const dietConsistency = parseInt(vitality.dietConsistency) || 50;
    substats[SubStatName.Adherence] = dietConsistency;

    const balanceSimon = getPercentileForMetric('adaptability', 'simonSays', simonLevel) * 0.5; // Secondary
    const balanceStress = 100 - (parseInt(vitality.stressLevels) || 50); // Inverse: calm = balance
    substats[SubStatName.Balance] = average([balanceSimon, balanceStress]);

    const lifestyleSubstance = average([
        100 - (parseInt(vitality.caffeineReliance) || 50),
        100 - (parseInt(vitality.alcoholConsumption) || 50),
        100 - (parseInt(vitality.smokingHabits) || 50)
    ]);
    const longevityAge = parseInt(inputs['biometric-data']?.age || '25');
    const ageBonus = longevityAge < 30 ? 10 : (longevityAge > 60 ? -10 : 0);
    substats[SubStatName.Longevity] = Math.min(95, Math.max(10, average([lifestyleSubstance, 50]) + ageBonus));

    // ===== INTELLIGENCE STATS =====
    const knowledge = inputs['adaptive-knowledge-test'] || {};
    const knowledgeScore = knowledge.adaptiveKnowledgeScore || 50;
    const mbti = inputs['mbti-assessment'] || {};
    const mbtiKnowledge = 50; // MBTI doesn't directly test knowledge, neutral
    substats[SubStatName.Knowledge] = average([knowledgeScore, mbtiKnowledge]);

    const reasoning = inputs['ai-adaptive-reasoning'] || {};
    const reasonScore = reasoning.score || 50;
    substats[SubStatName.Reason] = reasonScore;

    const adaptabilitySimon = getPercentileForMetric('adaptability', 'simonSays', simonLevel);
    const adaptabilityMBTI = 50; // MBTI openness mapped to adaptability
    substats[SubStatName.Adaptability] = average([adaptabilitySimon, adaptabilityMBTI]);

    const strategyWar = inputs['high-stakes-war-room'] || {};
    const strategyScore = strategyWar.strategyScore || 50;
    const strategyReasoning = reasonScore * 0.7; // Strategy partially from reasoning
    substats[SubStatName.Strategy] = average([strategyScore, strategyReasoning]);

    const perceptionFitts = dexterityFitts * 0.7; // Fitts requires perception
    const perceptionSimon = adaptabilitySimon * 0.7; // Simon requires pattern perception
    const perceptionMBTI = 50; // Neutral baseline
    substats[SubStatName.Perception] = average([perceptionFitts, perceptionSimon, perceptionMBTI]);

    // ===== CREATIVITY STATS =====
    const creativityData = inputs['creative-protocol-test'] || {};
    // These are set separately via evaluateCreativityAnswers in onboarding
    // Fallback to 50 if not yet evaluated
    substats[SubStatName.Imagination] = creativityData.imagination || 50;
    substats[SubStatName.Innovation] = creativityData.innovation || 50;
    substats[SubStatName.Style] = creativityData.style || 50;
    substats[SubStatName.Expression] = creativityData.expression || 50;
    substats[SubStatName.Vision] = creativityData.vision || 50;

    // ===== SPIRIT STATS =====
    const psycheSocial = inputs['psyche-social-questionnaire'] || {};
    const religiosity = parseInt(psycheSocial.religiosity) || 50;
    substats[SubStatName.Faith] = religiosity;

    // Purpose: From narrative clarity + dilemma choices
    const narrative = inputs['narrative-prompt']?.['narrative-prompt'] || "";
    const narrativePurpose = narrative.length > 100 ? 60 : (narrative.length > 50 ? 50 : 30);
    const dilemmaData = inputs['dilemma-screening'] || {};
    const dilemmaConsistency = dilemmaData.spiritDilemmas ? 60 : 50; // Consistent moral stance
    substats[SubStatName.Purpose] = average([narrativePurpose, dilemmaConsistency]);

    // Tranquility: Inverse of stress
    const stressLevel = parseInt(vitality.stressLevels) || 50;
    substats[SubStatName.Tranquility] = Math.min(95, 100 - stressLevel);

    // Empathy: From social confidence + dilemma choices
    const socialConfidence = parseInt(psycheSocial.socialConfidence) || 50;
    const empathyDilemma = dilemmaData.spiritDilemmas ? 55 : 50; // Empathetic choices show
    substats[SubStatName.Empathy] = average([socialConfidence, empathyDilemma]);

    // Conviction: From conflict resolution + dilemma consistency
    const conflictResolution = parseInt(psycheSocial.conflictResolution) || 50;
    const convictionDilemma = dilemmaData.spiritDilemmas ? 65 : 50; // Moral certainty
    substats[SubStatName.Conviction] = average([conflictResolution, convictionDilemma]);

    // ===== PSYCHE STATS =====
    const stroop = inputs['resilience-stroop'] || {};
    const stroopScore = stroop.stroopScore || 0;
    const stroopPercentile = (stroopScore / 15) * 100; // Max 15 rounds
    substats[SubStatName.Composure] = average([conflictResolution, stroopPercentile]);

    // Resilience: From Stroop recovery + Simon learning
    const simonMaxLevel = simonLevel;
    const simonResilience = (simonMaxLevel / 25) * 100; // Progression shows resilience
    substats[SubStatName.Resilience] = average([stroopPercentile * 0.7, simonResilience, 50]);

    // Charisma: From social confidence + war room performance
    const charismaWar = (strategyScore * 0.6) + (socialConfidence * 0.4); // Presence in strategy
    substats[SubStatName.Charisma] = average([socialConfidence, charismaWar]);

    // Focus: From Fitts + Stroop + Knowledge
    const focusStroop = stroopPercentile * 0.8; // Stroop heavily tests focus
    const focusFitts = dexterityFitts * 0.7; // Fitts requires focus
    const focusKnowledge = knowledgeScore * 0.5; // Knowledge requires focus
    substats[SubStatName.Focus] = average([focusStroop, focusFitts, focusKnowledge]);

    // Willpower: From Adherence + Conflict Resolution + Stroop
    const adherenceWill = dietConsistency * 0.8; // Diet consistency = willpower
    const conflictWill = conflictResolution * 0.7; // Standing ground = willpower
    const stroopWill = stroopPercentile * 0.7; // Stroop inhibition = willpower
    substats[SubStatName.Willpower] = average([adherenceWill, conflictWill, stroopWill]);

    return substats;
};
