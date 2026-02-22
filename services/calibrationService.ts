/**
 * GENESIS SCREENING TEST (CALIBRATION SERVICE)
 * 
 * Enhanced multi-vector analysis using all 30 substats
 * 
 * TALENT CLASS (Tk): Multi-dimensional competency analysis
 * - Maps to population rarity: Genius (1 in 1,000), Gifted (1 in 100), etc.
 * - Non-linear formula with 1.3 exponent emphasizes outliers
 * - See: BIOMETRICS_AND_PROTOCOLS_GUIDE.md → "Statistical Rarity Framework"
 * 
 * OBSESSION LEVEL (Ok): Drive, commitment, and resilience analysis
 * - Maps to population frequency: Compulsive (~2%), Relentless (~8%), etc.
 * - Psyche/Spirit synergy multiplier reflects aligned willpower + purpose
 * - More mutable than Talent Class (responds to environmental design)
 * 
 * HATI (Human Apex Threat Index): Holistic threat assessment
 * - Weighted percentile across 6 attributes (Physical, Vitality, Intelligence, Creativity, Spirit, Psyche)
 * - Transparent and deterministic; no hidden algorithms
 * 
 * All calculations use percentile-based scoring with synergy multipliers
 * and non-linear scaling to identify outliers and high-potential individuals.
 * 
 * DOCUMENTATION: See BIOMETRICS_AND_PROTOCOLS_GUIDE.md for complete explanation
 */

import { SubStatName, StatName } from '../types';

export interface SubstatPercentiles {
  [SubStatName.Strength]?: number;
  [SubStatName.Speed]?: number;
  [SubStatName.Endurance]?: number;
  [SubStatName.Dexterity]?: number;
  [SubStatName.Agility]?: number;
  [SubStatName.Stamina]?: number;
  [SubStatName.Regeneration]?: number;
  [SubStatName.Adherence]?: number;
  [SubStatName.Balance]?: number;
  [SubStatName.Longevity]?: number;
  [SubStatName.Reason]?: number;
  [SubStatName.Knowledge]?: number;
  [SubStatName.Adaptability]?: number;
  [SubStatName.Strategy]?: number;
  [SubStatName.Perception]?: number;
  [SubStatName.Imagination]?: number;
  [SubStatName.Innovation]?: number;
  [SubStatName.Style]?: number;
  [SubStatName.Expression]?: number;
  [SubStatName.Vision]?: number;
  [SubStatName.Faith]?: number;
  [SubStatName.Purpose]?: number;
  [SubStatName.Tranquility]?: number;
  [SubStatName.Empathy]?: number;
  [SubStatName.Conviction]?: number;
  [SubStatName.Resilience]?: number;
  [SubStatName.Charisma]?: number;
  [SubStatName.Focus]?: number;
  [SubStatName.Willpower]?: number;
  [SubStatName.Composure]?: number;
}

export interface CalibrationAnalysis {
  talentScore: number; // Raw talent score (0-100)
  talentClass: 'Laggard' | 'Average' | 'Talented Learner' | 'Gifted' | 'Genius';
  talentConfidence: number; // 0-1, confidence in classification
  
  obsessionScore: number; // Raw obsession score (0-100)
  obsessionLevel: 'Lazy' | 'Average' | 'Locked-In' | 'Relentless' | 'Compulsive';
  obsessionConfidence: number; // 0-1, confidence in classification
  
  hati: number; // Human Apex Threat Index (0-100)
  hatiBreakdown: {
    baseStats?: number;
    missionXP?: number;
    bonuses?: number;
    physical: number;
    vitality: number;
    intelligence: number;
    creativity: number;
    spirit: number;
    psyche: number;
  };
  baselineAdjusted?: boolean; // True if HATI was boosted to B-rank baseline
  
  synergies: {
    name: string;
    multiplier: number;
    substats: string[];
    bonus?: number;
  }[];
  
  strengths: string[];
  weaknesses: string[];
  vectorAnalysis: string;
}

/**
 * TALENT CLASS CALCULATION
 * 
 * Multi-vector analysis of competency:
 * - Physical: Strength, Speed, Endurance, Dexterity, Agility, Stamina (6 substats)
 * - Intelligence: Reason, Knowledge, Adaptability, Strategy, Perception (5 substats)
 * - Vitality: Balance, Adherence, Longevity, Regeneration, Stamina (5 substats - overlap)
 * 
 * Scoring:
 * - High performers (>85th percentile) signal true competency
 * - Multiple peaks indicate specialization
 * - Consistency across vectors indicates deep talent
 * - Non-linear scaling emphasizes outliers
 */
function calculateTalentClass(substats: SubstatPercentiles): { score: number; talentClass: 'Laggard' | 'Average' | 'Talented Learner' | 'Gifted' | 'Genius'; confidence: number } {
  // Physical Competency Vector (6 substats)
  const physicalSubstats = [
    substats[SubStatName.Strength] || 0,
    substats[SubStatName.Speed] || 0,
    substats[SubStatName.Endurance] || 0,
    substats[SubStatName.Dexterity] || 0,
    substats[SubStatName.Agility] || 0,
    substats[SubStatName.Stamina] || 0,
  ];
  const physicalAvg = physicalSubstats.reduce((a, b) => a + b, 0) / physicalSubstats.length;
  const physicalPeaks = physicalSubstats.filter(s => s > 85).length;
  const physicalConsistency = 1 + (physicalPeaks * 0.15); // Bonus for multiple peaks

  // Intelligence Competency Vector (5 substats)
  const intelligenceSubstats = [
    substats[SubStatName.Reason] || 0,
    substats[SubStatName.Knowledge] || 0,
    substats[SubStatName.Adaptability] || 0,
    substats[SubStatName.Strategy] || 0,
    substats[SubStatName.Perception] || 0,
  ];
  const intelligenceAvg = intelligenceSubstats.reduce((a, b) => a + b, 0) / intelligenceSubstats.length;
  const intelligencePeaks = intelligenceSubstats.filter(s => s > 85).length;
  const intelligenceConsistency = 1 + (intelligencePeaks * 0.15);

  // Vitality Resilience Vector (reflects capacity to learn and adapt)
  const vitalitySubstats = [
    substats[SubStatName.Balance] || 0,
    substats[SubStatName.Adherence] || 0,
    substats[SubStatName.Longevity] || 0,
    substats[SubStatName.Regeneration] || 0,
  ];
  const vitalityAvg = vitalitySubstats.reduce((a, b) => a + b, 0) / vitalitySubstats.length;

  // Non-linear scaling: emphasize high performers
  const physicalScore = Math.pow(physicalAvg / 100, 1.3) * 100 * physicalConsistency;
  const intelligenceScore = Math.pow(intelligenceAvg / 100, 1.3) * 100 * intelligenceConsistency;
  const vitalityScore = vitalityAvg * 0.5; // Lower weight but important for sustainability

  // Combined talent score (weighted)
  const talentScore = (physicalScore * 0.3 + intelligenceScore * 0.45 + vitalityScore * 0.25);

  // Determine talent class based on percentile distribution
  // Population frequencies: Laggard 20%, Average 65%, Talented 10%, Gifted 4.9%, Genius 0.1%
  let talentClass: 'Laggard' | 'Average' | 'Talented Learner' | 'Gifted' | 'Genius' = 'Average';
  let confidence = 0.5;

  if (talentScore >= 94) {
    // Genius: top 0.1% (1 in 1,000)
    talentClass = 'Genius';
    confidence = Math.min(1.0, (talentScore - 94) / 6 + 0.94);
  } else if (talentScore >= 85) {
    // Gifted: top 4.9% (roughly 1 in 20)
    talentClass = 'Gifted';
    confidence = Math.min(1.0, (talentScore - 85) / 9 + 0.85);
  } else if (talentScore >= 65) {
    // Talented Learner: 10% (1 in 10)
    talentClass = 'Talented Learner';
    confidence = Math.min(1.0, (talentScore - 65) / 20 + 0.65);
  } else if (talentScore >= 35) {
    // Average: 65% (bulk of population)
    talentClass = 'Average';
    confidence = Math.min(1.0, (talentScore - 35) / 30 + 0.35);
  } else {
    // Laggard: 20% (bottom performers)
    talentClass = 'Laggard';
    confidence = Math.min(1.0, talentScore / 35);
  }

  return { score: Math.min(100, talentScore), talentClass, confidence };
}

/**
 * OBSESSION LEVEL CALCULATION
 * 
 * Multi-vector analysis of drive and commitment:
 * - Psyche: Resilience, Conviction, Willpower, Composure, Focus (5 substats)
 * - Spirit: Faith, Purpose, Empathy, Charisma, Tranquility (5 substats)
 * - Vitality: Adherence (commitment to practices) (1 substat)
 * 
 * Scoring:
 * - High Resilience + Willpower indicates relentless drive
 * - High Conviction + Faith indicates unshakeable commitment
 * - High Focus + Composure indicates discipline
 * - Synergy between psyche and spirit indicates deeper obsession
 */
function calculateObsessionLevel(substats: SubstatPercentiles): { score: number; obsessionLevel: 'Lazy' | 'Average' | 'Locked-In' | 'Relentless' | 'Compulsive'; confidence: number } {
  // Psyche Vector: Inner Drive and Mental Fortitude (5 substats)
  const psycheSubstats = [
    substats[SubStatName.Resilience] || 0,     // Recovery from setbacks
    substats[SubStatName.Conviction] || 0,     // Unwavering belief
    substats[SubStatName.Willpower] || 0,      // Force of will
    substats[SubStatName.Composure] || 0,      // Emotional control
    substats[SubStatName.Focus] || 0,          // Concentration ability
  ];
  const psycheAvg = psycheSubstats.reduce((a, b) => a + b, 0) / psycheSubstats.length;
  const psychePeaks = psycheSubstats.filter(s => s > 80).length;

  // Spirit Vector: Purpose and Commitment (5 substats)
  const spiritSubstats = [
    substats[SubStatName.Faith] || 0,          // Belief in possibility
    substats[SubStatName.Purpose] || 0,        // Clear sense of mission
    substats[SubStatName.Empathy] || 0,        // Connection to impact
    substats[SubStatName.Charisma] || 0,       // Ability to inspire/persist
    substats[SubStatName.Tranquility] || 0,    // Peace with commitment
  ];
  const spiritAvg = spiritSubstats.reduce((a, b) => a + b, 0) / spiritSubstats.length;
  const spiritPeaks = spiritSubstats.filter(s => s > 80).length;

  // Adherence: Consistency and follow-through
  const adherence = substats[SubStatName.Adherence] || 0;

  // Non-linear scaling
  const psycheScore = Math.pow(psycheAvg / 100, 1.2) * 100 * (1 + psychePeaks * 0.1);
  const spiritScore = Math.pow(spiritAvg / 100, 1.2) * 100 * (1 + spiritPeaks * 0.1);
  const adherenceBonus = adherence * 0.3; // Practical follow-through

  // Synergy: When both psyche and spirit are high, obsession compounds
  const psycheSpiritSynergy = psycheAvg > 70 && spiritAvg > 70 ? 1.2 : 1.0;

  const obsessionScore = (psycheScore * 0.4 + spiritScore * 0.35 + adherenceBonus * 0.25) * psycheSpiritSynergy;

  // Determine obsession level based on population distribution
  // Population frequencies: Lazy ~20%, Average ~50%, Locked-In ~20%, Relentless ~8%, Compulsive ~2%
  let obsessionLevel: 'Lazy' | 'Average' | 'Locked-In' | 'Relentless' | 'Compulsive' = 'Average';
  let confidence = 0.5;

  if (obsessionScore >= 90) {
    // Compulsive: top 2% - Protocol becomes entire identity
    obsessionLevel = 'Compulsive';
    confidence = Math.min(1.0, (obsessionScore - 90) / 10 + 0.90);
  } else if (obsessionScore >= 78) {
    // Relentless: ~8% - Severe drive, synergy active, 95%+ adherence
    obsessionLevel = 'Relentless';
    confidence = Math.min(1.0, (obsessionScore - 78) / 12 + 0.78);
  } else if (obsessionScore >= 62) {
    // Locked-In: ~20% - High discipline, 85%+ adherence
    obsessionLevel = 'Locked-In';
    confidence = Math.min(1.0, (obsessionScore - 62) / 16 + 0.62);
  } else if (obsessionScore >= 40) {
    // Average: ~50% - Standard consistency, 65% completion
    obsessionLevel = 'Average';
    confidence = Math.min(1.0, (obsessionScore - 40) / 22 + 0.40);
  } else {
    // Lazy: ~20% - Low adherence, 40% completion
    obsessionLevel = 'Lazy';
    confidence = Math.min(1.0, obsessionScore / 40);
  }

  return { score: Math.min(100, obsessionScore), obsessionLevel, confidence };
}

/**
 * HATI (HUMAN APEX THREAT INDEX) CALCULATION
 * 
 * Solo Leveling-inspired progression system combining:
 * - Base Stats (40%): Weighted average of all 30 substats
 * - Mission XP (40%): Accumulated experience from completed tasks/missions
 * - Bonuses (20%): Synergies, achievements, special conditions
 * 
 * BASELINE: New users start at B-rank floor (60%) - "Hunter Awakening"
 * 
 * RANK THRESHOLDS (Percentile-Based):
 * - E: 0-19%   "Dormant"
 * - D: 20-39%  "Stirring" 
 * - C: 40-59%  "Awakening"
 * - B: 60-74%  "Elite Hunter" (Starting rank for new users)
 * - A: 75-89%  "S-Class Hunter"
 * - S: 90-96%  "National Level"
 * - SS: 97-99.8% "Monarch Candidate"
 * - SS+: 99.9%+ "Shadow Monarch"
 * 
 * PROGRESSION TIMELINE (Realistic):
 * - B→A: 2-3 months (consistent daily engagement)
 * - A→S: 4-6 months (specialized training + missions)
 * - S→SS: 6-12 months (elite performance + rare achievements)
 * - SS→SS+: Reserved for top 0.1% (12+ months sustained excellence)
 */
function calculateHATI(substats: SubstatPercentiles, missionXP: number = 0, achievementBonuses: number = 0): { hati: number; breakdown: Record<string, number>; synergies: any[]; baselineAdjusted: boolean } {
  // ===========================
  // PART 1: BASE STATS (40%)
  // ===========================
  
  // Physical Vector (6 substats) - Weight: 15%
  const physical = [
    substats[SubStatName.Strength] || 0,
    substats[SubStatName.Speed] || 0,
    substats[SubStatName.Endurance] || 0,
    substats[SubStatName.Dexterity] || 0,
    substats[SubStatName.Agility] || 0,
    substats[SubStatName.Stamina] || 0,
  ];
  const physicalAvg = physical.reduce((a, b) => a + b, 0) / 6;

  // Vitality Vector (5 substats) - Weight: 12%
  const vitality = [
    substats[SubStatName.Balance] || 0,
    substats[SubStatName.Adherence] || 0,
    substats[SubStatName.Longevity] || 0,
    substats[SubStatName.Regeneration] || 0,
    substats[SubStatName.Stamina] || 0,
  ];
  const vitalityAvg = vitality.reduce((a, b) => a + b, 0) / 5;

  // Intelligence Vector (5 substats) - Weight: 20%
  const intelligence = [
    substats[SubStatName.Reason] || 0,
    substats[SubStatName.Knowledge] || 0,
    substats[SubStatName.Adaptability] || 0,
    substats[SubStatName.Strategy] || 0,
    substats[SubStatName.Perception] || 0,
  ];
  const intelligenceAvg = intelligence.reduce((a, b) => a + b, 0) / 5;

  // Creativity Vector (5 substats) - Weight: 18%
  const creativity = [
    substats[SubStatName.Imagination] || 0,
    substats[SubStatName.Innovation] || 0,
    substats[SubStatName.Style] || 0,
    substats[SubStatName.Expression] || 0,
    substats[SubStatName.Vision] || 0,
  ];
  const creativityAvg = creativity.reduce((a, b) => a + b, 0) / 5;

  // Spirit Vector (2 substats) - Weight: 15%
  const spiritAvg = (substats[SubStatName.Faith] || 0) * 0.6 + (substats[SubStatName.Purpose] || 0) * 0.4;

  // Psyche Vector (2 substats) - Weight: 20%
  const psycheAvg = (substats[SubStatName.Willpower] || 0) * 0.6 + (substats[SubStatName.Resilience] || 0) * 0.4;

  // Weighted Base Stats Score (0-100)
  const baseStatsScore = (
    physicalAvg * 0.15 +
    vitalityAvg * 0.12 +
    intelligenceAvg * 0.20 +
    creativityAvg * 0.18 +
    spiritAvg * 0.15 +
    psycheAvg * 0.20
  );

  // ===========================
  // PART 2: MISSION XP (40%)
  // ===========================
  // Mission XP converts to percentile (0-100)
  // Scaling: 1000 XP = 10 percentile points
  // Expected: ~100 XP/day = 30% gain over 3 months
  const missionXPScore = Math.min(100, missionXP / 10);

  // ===========================
  // PART 3: BONUSES (20%)
  // ===========================
  let bonusScore = 0;
  const synergies = [];

  // Synergy 1: Strategic Athlete (Physical 80+ & Intelligence 80+)
  if (physical.some(p => p > 80) && intelligence.some(i => i > 80)) {
    bonusScore += 3;
    synergies.push({
      name: 'Strategic Athlete',
      multiplier: 1.15,
      substats: ['Strength/Speed', 'Strategy/Perception'],
      bonus: 3
    });
  }

  // Synergy 2: Visionary Technologist (Creativity 80+ & Intelligence 80+)
  if (creativity.some(c => c > 80) && intelligence.some(i => i > 80)) {
    bonusScore += 4;
    synergies.push({
      name: 'Visionary Technologist',
      multiplier: 1.25,
      substats: ['Innovation/Vision', 'Reason/Adaptability'],
      bonus: 4
    });
  }

  // Synergy 3: Uncompromising Creator (Willpower 80+ & Innovation 80+)
  if ((substats[SubStatName.Willpower] || 0) > 80 && (substats[SubStatName.Innovation] || 0) > 80) {
    bonusScore += 3.5;
    synergies.push({
      name: 'Uncompromising Creator',
      multiplier: 1.2,
      substats: ['Willpower', 'Innovation/Expression'],
      bonus: 3.5
    });
  }

  // Synergy 4: Apex Threat (3+ vectors at 70+)
  const vectorAverages = [physicalAvg, vitalityAvg, intelligenceAvg, creativityAvg];
  const highVectorCount = vectorAverages.filter(v => v > 70).length;
  if (highVectorCount >= 3) {
    bonusScore += 5;
    synergies.push({
      name: 'Apex Threat',
      multiplier: 1.3,
      substats: ['All vectors aligned'],
      bonus: 5
    });
  }

  // Achievement bonuses (from system)
  bonusScore += achievementBonuses;
  bonusScore = Math.min(20, bonusScore); // Cap at 20%

  // ===========================
  // FINAL HATI CALCULATION
  // ===========================
  let hati = (baseStatsScore * 0.40) + (missionXPScore * 0.40) + (bonusScore);
  
  // BASELINE ADJUSTMENT: Ensure new users start at B-rank floor (60%)
  let baselineAdjusted = false;
  if (missionXP === 0 && hati < 60) {
    hati = 60;
    baselineAdjusted = true;
  }
  
  hati = Math.min(100, Math.max(0, hati));

  const breakdown = {
    baseStats: baseStatsScore * 0.40,
    missionXP: missionXPScore * 0.40,
    bonuses: bonusScore,
    physical: physicalAvg,
    vitality: vitalityAvg,
    intelligence: intelligenceAvg,
    creativity: creativityAvg,
    spirit: spiritAvg,
    psyche: psycheAvg,
  };

  return { hati, breakdown, synergies, baselineAdjusted };
}

/**
 * Identify strengths and weaknesses
 */
function analyzeStrengthsWeaknesses(substats: SubstatPercentiles): { strengths: string[]; weaknesses: string[] } {
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  const entries = Object.entries(substats);
  const sorted = entries.sort((a, b) => (b[1] || 0) - (a[1] || 0));

  // Top 5 strengths
  for (let i = 0; i < Math.min(5, sorted.length); i++) {
    const [substat, value] = sorted[i];
    if ((value || 0) > 70) {
      strengths.push(`${substat} (${Math.round(value || 0)}%)`);
    }
  }

  // Bottom 5 weaknesses
  const reversed = [...sorted].reverse();
  for (let i = 0; i < Math.min(5, reversed.length); i++) {
    const [substat, value] = reversed[i];
    if ((value || 0) < 40) {
      weaknesses.push(`${substat} (${Math.round(value || 0)}%)`);
    }
  }

  return { strengths, weaknesses };
}

/**
 * Generate human-readable vector analysis
 */
function generateVectorAnalysis(talentScore: number, obsessionScore: number, hati: number): string {
  const talent = talentScore > 75 ? 'High' : talentScore > 50 ? 'Moderate' : 'Low';
  const obsession = obsessionScore > 75 ? 'High' : obsessionScore > 50 ? 'Moderate' : 'Low';
  const threat = hati > 75 ? 'Apex' : hati > 60 ? 'Elite' : hati > 40 ? 'Significant' : 'Standard';

  let analysis = `${talent} talent, ${obsession} obsession → ${threat} threat vector.`;

  // Add nuances
  if (talentScore > 75 && obsessionScore > 75) {
    analysis += ' Exceptional synergy: Rare combination of capability and drive.';
  } else if (talentScore > 75 && obsessionScore < 40) {
    analysis += ' High potential but lacks drive. Requires external motivation or awakening.';
  } else if (talentScore < 40 && obsessionScore > 75) {
    analysis += ' Driven individual compensating through sheer willpower and persistence.';
  }

  return analysis;
}

/**
 * PUBLIC API: Perform complete calibration analysis
 */
export const performEnhancedCalibration = (substats: SubstatPercentiles, missionXP: number = 0, achievementBonuses: number = 0): CalibrationAnalysis => {
  // Calculate all three metrics
  const { score: talentScore, talentClass, confidence: talentConfidence } = calculateTalentClass(substats);
  const { score: obsessionScore, obsessionLevel, confidence: obsessionConfidence } = calculateObsessionLevel(substats);
  const { hati, breakdown, synergies, baselineAdjusted } = calculateHATI(substats, missionXP, achievementBonuses);

  // Analyze strengths and weaknesses
  const { strengths, weaknesses } = analyzeStrengthsWeaknesses(substats);

  // Generate vector analysis
  const vectorAnalysis = generateVectorAnalysis(talentScore, obsessionScore, hati);

  return {
    talentScore,
    talentClass,
    talentConfidence,
    obsessionScore,
    obsessionLevel,
    obsessionConfidence,
    hati,
    hatiBreakdown: breakdown as any,
    baselineAdjusted,
    synergies,
    strengths,
    weaknesses,
    vectorAnalysis,
  };
};

/**
 * LEGACY COMPATIBILITY: Map enhanced calibration to old format
 */
export const mapToLegacyFormat = (calibration: CalibrationAnalysis) => {
  return {
    talentClass: calibration.talentClass,
    obsessionLevel: calibration.obsessionLevel,
    rarity: calculateRarity(calibration.talentScore, calibration.obsessionScore),
    archetypeTitle: generateArchetype(calibration.talentClass, calibration.obsessionLevel),
    traitScores: {
      IP: calibration.hati, // Innovation/Potential
      LE: calibration.talentScore, // Learning Efficacy
      RE: calibration.obsessionScore, // Resilience/Efficiency
      FO: Math.min(100, (calibration.talentScore + calibration.obsessionScore) / 2), // Focus
      EX: calibration.hati, // Expression
      CO: calibration.talentScore, // Competency
    },
  };
};

/**
 * Calculate rarity (legacy)
 */
function calculateRarity(talentScore: number, obsessionScore: number): string {
  // Convert to 1-5 scale like original Tk/Ok
  const Tk = 1 + (talentScore / 100) * 4;
  const Ok = 1 + (obsessionScore / 100) * 4;

  let n = Tk + Ok - 2;
  if (Tk >= 4.0) {
    n = Math.max(n, Tk);
  }

  const rarityVal = Math.pow(10, n);
  if (rarityVal < 1000) {
    return `1 in ${Math.round(rarityVal)}`;
  } else if (rarityVal < 1000000) {
    return `1 in ${(rarityVal / 1000).toFixed(1)}k`;
  } else {
    return `1 in ${(rarityVal / 1000000).toFixed(1)}M`;
  }
}

/**
 * Generate archetype (legacy)
 */
function generateArchetype(talentClass: string, obsessionLevel: string): string {
  if (talentClass === 'Genius' && obsessionLevel === 'Compulsive') {
    return 'Unawakened Prodigy';
  } else if (talentClass === 'Genius' || talentClass === 'Gifted') {
    return 'High Potential Entity';
  } else if (obsessionLevel === 'Compulsive' || obsessionLevel === 'Relentless') {
    return 'Obsessive Specialist';
  }
  return 'Calibrated Operative';
}
