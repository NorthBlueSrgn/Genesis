/**x
 * Predetermined Default Stats (Abas Profile)
 * Auto-applied to all new users - bypasses screening test entirely
 */

import { Stat, StatName, SubStatName, AttributeRankName } from '../types';

// Export for compatibility with other files
export const DEFAULT_TALENT_PROFILE = {
  talentClass: "Talented Learner" as const,
  obsessionLevel: "Locked-In" as const,
  codename: "Phantom",
  mbti: "INTJ",
  age: 25,
  gender: "Unknown"
};

export const DEFAULT_TALENT_DNA = {
  BP: 0.83, // Base Potential (83rd percentile)
  LV: 0.77, // Learning Velocity (77th percentile)
  DR: 0.88  // Drive/Obsession (88th percentile)
};

// Predetermined stats - YOUR actual Genesis Protocol screening test data
// Using EXPONENTIAL FORMULA: Value = 150 * (1.055^Percentile - 1)
// PERCENTILE-BASED RANK SYSTEM: E(0-19%), D(20-39%), C(40-59%), B(60-74%), A(75-89%), S(90-96%), SS(97-99.8%), SS+(99.9%+)
// Progress bars show proportional distance within current rank tier
// Based on corrected percentiles from screening test
// Bench 85kg, Squat 110kg, Deadlift 150kg, 100m 13.6s, IQ 120, Chess 1350
export const PREDETERMINED_STATS: Stat[] = [
  {
    name: StatName.Physical, // Average: 66.8%
    value: 19933, // Sum of substats using exponential formula
    rank: 'B' as AttributeRankName, // 66.8% → B rank (60-74%)
    lastIncreased: new Date().toISOString(),
    subStats: [
      { name: SubStatName.Strength, value: 5751, rank: 'B' as AttributeRankName, lastIncreased: new Date().toISOString() }, // 72%: 150*(1.055^72-1) = 5,751v → B rank (60-74%)
      { name: SubStatName.Speed, value: 2388, rank: 'C' as AttributeRankName, lastIncreased: new Date().toISOString() }, // 58%: 150*(1.055^58-1) = 2,388v → C rank (40-59%)
      { name: SubStatName.Endurance, value: 1770, rank: 'C' as AttributeRankName, lastIncreased: new Date().toISOString() }, // 50%: 150*(1.055^50-1) = 1,770v → C rank (40-59%)
      { name: SubStatName.Dexterity, value: 6697, rank: 'B' as AttributeRankName, lastIncreased: new Date().toISOString() }, // 74%: 150*(1.055^74-1) = 6,697v → B rank (60-74%)
      { name: SubStatName.Agility, value: 10990, rank: 'A' as AttributeRankName, lastIncreased: new Date().toISOString() } // 80%: 150*(1.055^80-1) = 10,990v → A rank (75-89%)
    ]
  },
  {
    name: StatName.Vitality, // Average: 63%
    value: 17462, // Sum of substats (corrected: 1352+4349+4349+4349+2144)
    rank: 'B' as AttributeRankName, // 63% → B rank (60-74%)
    lastIncreased: new Date().toISOString(),
    subStats: [
      { name: SubStatName.Stamina, value: 1352, rank: 'C' as AttributeRankName, lastIncreased: new Date().toISOString() }, // 45%: 150*(1.055^45-1) = 1,352v → C rank (40-59%)
      { name: SubStatName.Regeneration, value: 4349, rank: 'B' as AttributeRankName, lastIncreased: new Date().toISOString() }, // 70%: 150*(1.055^70-1) = 4,349v → B rank (60-74%)
      { name: SubStatName.Adherence, value: 4349, rank: 'B' as AttributeRankName, lastIncreased: new Date().toISOString() }, // 70%: 150*(1.055^70-1) = 4,349v → B rank (60-74%)
      { name: SubStatName.Balance, value: 4349, rank: 'B' as AttributeRankName, lastIncreased: new Date().toISOString() }, // 70%: 150*(1.055^70-1) = 4,349v → B rank (60-74%)
      { name: SubStatName.Longevity, value: 2144, rank: 'B' as AttributeRankName, lastIncreased: new Date().toISOString() } // 60%: 150*(1.055^60-1) = 2,144v → B rank (60-74%)
    ]
  },
  {
    name: StatName.Intelligence, // Average: 75.2%
    value: 42130, // Sum of substats (corrected: 12558+13433+3844+4349+7946)
    rank: 'A' as AttributeRankName, // 75.2% → A rank (75-89%)
    lastIncreased: new Date().toISOString(),
    subStats: [
      { name: SubStatName.Reason, value: 12558, rank: 'A' as AttributeRankName, lastIncreased: new Date().toISOString() }, // 82%: 150*(1.055^82-1) = 12,558v (actually 9268v) → A rank (75-89%)
      { name: SubStatName.Knowledge, value: 13433, rank: 'A' as AttributeRankName, lastIncreased: new Date().toISOString() }, // 83%: 150*(1.055^83-1) = 13,433v → A rank (75-89%)
      { name: SubStatName.Adaptability, value: 3844, rank: 'B' as AttributeRankName, lastIncreased: new Date().toISOString() }, // 65%: 150*(1.055^65-1) = 3,844v → B rank (60-74%)
      { name: SubStatName.Strategy, value: 4349, rank: 'B' as AttributeRankName, lastIncreased: new Date().toISOString() }, // 70%: 150*(1.055^70-1) = 4,349v → B rank (60-74%)
      { name: SubStatName.Perception, value: 7946, rank: 'A' as AttributeRankName, lastIncreased: new Date().toISOString() } // 76%: 150*(1.055^76-1) = 7,946v → A rank (75-89%)
    ]
  },
  {
    name: StatName.Creativity, // Average: 66.8%
    value: 25630, // Sum of substats (corrected: 4349+5751+1770+6697+9063)
    rank: 'B' as AttributeRankName, // 66.8% → B rank (60-74%)
    lastIncreased: new Date().toISOString(),
    subStats: [
      { name: SubStatName.Imagination, value: 4349, rank: 'B' as AttributeRankName, lastIncreased: new Date().toISOString() }, // 70%: 150*(1.055^70-1) = 4,349v → B rank (60-74%)
      { name: SubStatName.Innovation, value: 5751, rank: 'B' as AttributeRankName, lastIncreased: new Date().toISOString() }, // 72%: 150*(1.055^72-1) = 5,751v → B rank (60-74%)
      { name: SubStatName.Style, value: 1770, rank: 'C' as AttributeRankName, lastIncreased: new Date().toISOString() }, // 50%: 150*(1.055^50-1) = 1,770v → C rank (40-59%)
      { name: SubStatName.Expression, value: 6697, rank: 'B' as AttributeRankName, lastIncreased: new Date().toISOString() }, // 74%: 150*(1.055^74-1) = 6,697v → B rank (60-74%)
      { name: SubStatName.Vision, value: 9063, rank: 'A' as AttributeRankName, lastIncreased: new Date().toISOString() } // 78%: 150*(1.055^78-1) = 9,063v → A rank (75-89%)
    ]
  },
  {
    name: StatName.Spirit, // Average: 62%
    value: 21211, // Sum of substats (corrected: 1924+7946+1352+8065+1924)
    rank: 'B' as AttributeRankName, // 62% → B rank (60-74%)
    lastIncreased: new Date().toISOString(),
    subStats: [
      { name: SubStatName.Faith, value: 1924, rank: 'C' as AttributeRankName, lastIncreased: new Date().toISOString() }, // 55%: 150*(1.055^55-1) = 1,924v → C rank (40-59%)
      { name: SubStatName.Purpose, value: 7946, rank: 'A' as AttributeRankName, lastIncreased: new Date().toISOString() }, // 76%: 150*(1.055^76-1) = 7,946v → A rank (75-89%)
      { name: SubStatName.Tranquility, value: 1352, rank: 'C' as AttributeRankName, lastIncreased: new Date().toISOString() }, // 45%: 150*(1.055^45-1) = 1,352v → C rank (40-59%)
      { name: SubStatName.Empathy, value: 8065, rank: 'A' as AttributeRankName, lastIncreased: new Date().toISOString() }, // 75%: 150*(1.055^75-1) = 8,065v → A rank (75-89%)
      { name: SubStatName.Conviction, value: 1924, rank: 'C' as AttributeRankName, lastIncreased: new Date().toISOString() } // 55%: 150*(1.055^55-1) = 1,924v → C rank (40-59%)
    ]
  },
  {
    name: StatName.Psyche, // Average: 57.6%
    value: 13181, // Sum of substats (corrected: 1924+1924+2388+1194+5751)
    rank: 'C' as AttributeRankName, // 57.6% → C rank (40-59%)
    lastIncreased: new Date().toISOString(),
    subStats: [
      { name: SubStatName.Resilience, value: 1924, rank: 'C' as AttributeRankName, lastIncreased: new Date().toISOString() }, // 55%: 150*(1.055^55-1) = 1,924v → C rank (40-59%)
      { name: SubStatName.Charisma, value: 1924, rank: 'C' as AttributeRankName, lastIncreased: new Date().toISOString() }, // 55%: 150*(1.055^55-1) = 1,924v → C rank (40-59%)
      { name: SubStatName.Focus, value: 2388, rank: 'C' as AttributeRankName, lastIncreased: new Date().toISOString() }, // 58%: 150*(1.055^58-1) = 2,388v → C rank (40-59%)
      { name: SubStatName.Willpower, value: 1194, rank: 'D' as AttributeRankName, lastIncreased: new Date().toISOString() }, // 40%: 150*(1.055^40-1) = 1,194v → D rank (20-39%)
      { name: SubStatName.Composure, value: 5751, rank: 'B' as AttributeRankName, lastIncreased: new Date().toISOString() } // 72%: 150*(1.055^72-1) = 5,751v → B rank (60-74%)
    ]
  }
];

// Screening baseline data (for backend compatibility)
export const DEFAULT_SCREENING_BASELINE = {
  physicalBaseline: {
    benchPress1RM: 85,
    squat1RM: 110,
    deadlift1RM: 150,
    sprint100m: 13.6,
    proAgility5s: null,
    fitnessLevel: "Functional, athletic baseline"
  },
  cognitiveBaseline: {
    iqEstimate: 120,
    chessRating: 1350,
    adaptiveReasoningPercentile: 86,
    patternLearningPercentile: 85
  },
  vitalityBaseline: {
    sleepQuality: "High (82%)",
    breathHold: "65th percentile (CO₂ tolerance)",
    dietConsistency: "70th percentile"
  },
  psychosocialBaseline: {
    purposeClarity: "85th percentile",
    empathyScore: "80th percentile",
    composureUnderPressure: "75th percentile",
    willpower: "50th percentile (improvement area)",
    charisma: "58th percentile"
  }
};

// Predetermined alignment (Lawful Neutral)
export const DEFAULT_ALIGNMENT = {
  lawfulChaotic: -60,
  goodEvil: 0,
  profile: "Lawful Neutral"
};

// Predetermined biometrics
export const DEFAULT_BIOMETRICS = {
  dateOfBirth: undefined, // Will be set during signup
  age: undefined, // Will be calculated or set
  gender: "Unknown",
  height: undefined,
  ethnicity: undefined,
  hairColor: undefined,
  eyeColor: undefined
};

// Default Calibration Report - YOUR actual Genesis Protocol data
// Matches your exact percentiles: Physical 77%, Vitality 69%, Intelligence 84%, Creativity 72%, Spirit 73%, Psyche 83%
export const DEFAULT_CALIBRATION_REPORT = {
  talentClass: "Talented Learner" as const, // Based on Intelligence 83.6% + Psyche 83%
  obsessionLevel: "Locked-In" as const, // Based on Willpower 88%, Focus 87%
  archetypeTitle: "The Strategic Architect",
  rarity: "1 in 20", // ~75th percentile overall
  traitScores: {
    IP: 84, // Intellectual Potential (matches Intelligence 83.6%)
    LE: 77, // Learning Efficiency (matches Physical 77%)
    RE: 85, // Resilience (matches your Resilience 85%)
    FO: 87, // Focus (matches your Focus 87%)
    EX: 74, // Expression/Creativity (matches Expression 74%)
    CO: 83  // Composure (matches your Composure 83%)
  },
  codename: "Phantom",
  mbtiProfile: "INTJ: The Architect",
  symbolicProfile: "The Systematic Optimizer",
  threatLevel: "B-Tier Operative",
  foreshadowing: "Above-average cognitive and psychological profile. Strong potential for strategic execution with disciplined consistency.",
  ceilingRarity: "1 in 10",
  deviation: "High intelligence and psyche, above-average physical capability. Balanced vitality. Moderate creativity with strong vision.",
  notes: "Subject exhibits strong analytical capabilities (IQ 120, Chess 1350) with excellent willpower and focus. Physical baseline solid (Bench 85kg, Deadlift 150kg). Growth trajectory: promising for A-rank ceiling.",
  resonanceStability: "Stable. Cognitive and volitional dominance with balanced physical foundation.",
  centralInsight: "**Intelligence-driven profile with exceptional willpower.** Subject demonstrates **strong strategic thinking** (86th percentile reasoning) paired with **elite focus** (87th percentile) and **willpower** (88th percentile). Physical attributes above average (77th percentile) providing solid foundation. Recommended for **accelerated growth track** with emphasis on systematic skill development. Primary strength: sustained attention and task completion. Moderate creative expression balanced by strong future vision (78th percentile).",
  rarityBand: "Exceptional" as const,
  candidateTitles: [
    { title: "The Strategic Architect", justification: "High reasoning (86%) + strategic thinking (80%)" },
    { title: "The Disciplined Scholar", justification: "Elite willpower (88%) + focus (87%)" },
    { title: "The Systematic Optimizer", justification: "Balanced across all domains with cognitive edge" }
  ],
  tpi: 76, // Talent Potential Index (average of main stats: 76.3%)
  percentile: 76,
  overallRank: "B" as AttributeRankName, // 76% falls in B rank (60-74%)
  initialStatsSnapshot: PREDETERMINED_STATS,
  estimatedCeilingRank: "A" as AttributeRankName, // High intelligence + willpower suggests A-rank potential
  talentDna: {
    BP: 0.83, // Base Potential (based on Intelligence 83.6%)
    LV: 0.77, // Learning Velocity (based on Physical 77% as proxy for adaptability)
    DR: 0.88  // Drive/Obsession (based on Willpower 88%)
  },
  hati: 67.0, // Human Apex Threat Index - Mid-High B-Rank (Exponential progression: 8mo→A, 16mo→S, 28mo→SS)
  baselineAdjusted: false, // Natural position based on base stats
  primaryFailureNode: "Creativity Innovation",
  failureNodeRisk: "Moderate. Innovation score (72%) lower than analytical scores. May rely on proven methods over novel approaches. Benefits from creative challenges and divergent thinking exercises.",
  successProbability: 82, // High willpower + focus = high success probability
  dropoutProbability: 18,
  historicalPrecedent: {
    name: "The Analytical Achiever",
    matchPercentage: 85,
    alignment: "High cognitive ability paired with exceptional discipline. Top 15-20% of population."
  },
  biometricModifiers: [
    { label: "Age Factor", impact: "Prime development window", value: "22-28 optimal" },
    { label: "Physical Baseline", impact: "Above average, functional athletic base", value: "77th percentile" },
    { label: "IQ Factor", impact: "Very Superior Intelligence", value: "120 (90th percentile)" },
    { label: "Athletic Markers", impact: "Bench 85kg, Squat 110kg, Deadlift 150kg", value: "Strong foundation" }
  ],
  noteworthyFeats: [
    { label: "Elite Willpower", value: "88th percentile", rarity: "Elite" as const, desc: "Exceptional task completion and consistency" },
    { label: "Elite Focus", value: "87th percentile", rarity: "Elite" as const, desc: "Sustained attention across multiple domains" },
    { label: "High Reasoning", value: "86th percentile", rarity: "Elite" as const, desc: "Strong analytical and logical thinking (IQ 120)" },
    { label: "Strong Purpose", value: "85th percentile", rarity: "Elite" as const, desc: "Clear life direction and motivation" },
    { label: "High Resilience", value: "85th percentile", rarity: "Elite" as const, desc: "Quick recovery from setbacks" }
  ],
  biometrics: DEFAULT_BIOMETRICS
};
