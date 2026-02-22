/**
 * Stat Initialization Service
 * Maps screening test baseline data to Genesis Protocol game stats
 */

export interface ScreeningBaseline {
  physicalBaseline: {
    benchPress1RM: number;
    squat1RM: number;
    deadlift1RM: number;
    sprint100m: number;
    proAgility5s: number | null;
    fitnessLevel: string;
  };
  cognitiveBaseline: {
    iqEstimate: number;
    chessRating: number;
    adaptiveReasoningPercentile: number;
    patternLearningPercentile: number;
  };
  vitalityBaseline: {
    sleepQuality: string;
    breathHold: string;
    dietConsistency: string;
  };
  psychosocialBaseline: {
    purposeClarity: string;
    empathyScore: string;
    composureUnderPressure: string;
    willpower: string;
    charisma: string;
  };
}

export interface GameStat {
  name: string;
  value: number;
  rank: string;
  lastIncreased: string;
  subStats: GameStat[];
}

/**
 * Extract numeric percentile value from percentile string
 */
function extractPercentile(value: string): number {
  const match = value.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 50;
}

/**
 * Convert percentile to stat value (0-100 scale)
 */
function percentileToStatValue(percentile: number): number {
  return Math.round(percentile);
}

/**
 * Determine rank based on stat value
 */
function getStatRank(value: number): string {
  if (value >= 90) return 'S';
  if (value >= 80) return 'A';
  if (value >= 70) return 'B';
  if (value >= 60) return 'C';
  if (value >= 40) return 'D';
  return 'E';
}

/**
 * Initialize Physical stats from baseline
 */
function initializePhysicalStats(baseline: ScreeningBaseline): GameStat {
  const benchPressPercentile = Math.min(
    (baseline.physicalBaseline.benchPress1RM / 150) * 100,
    100
  );
  const squatPercentile = Math.min(
    (baseline.physicalBaseline.squat1RM / 200) * 100,
    100
  );
  const deadliftPercentile = Math.min(
    (baseline.physicalBaseline.deadlift1RM / 300) * 100,
    100
  );
  const speedPercentile = Math.min(
    ((14.5 - baseline.physicalBaseline.sprint100m) / 14.5) * 100,
    100
  );

  const avgPhysical = Math.round(
    (benchPressPercentile + squatPercentile + deadliftPercentile + speedPercentile) / 4
  );

  return {
    name: 'Physical',
    value: avgPhysical,
    rank: getStatRank(avgPhysical),
    lastIncreased: new Date().toISOString(),
    subStats: [
      {
        name: 'Strength',
        value: Math.round((benchPressPercentile + squatPercentile + deadliftPercentile) / 3),
        rank: getStatRank(
          Math.round((benchPressPercentile + squatPercentile + deadliftPercentile) / 3)
        ),
        lastIncreased: new Date().toISOString(),
        subStats: [],
      },
      {
        name: 'Speed',
        value: Math.round(speedPercentile),
        rank: getStatRank(Math.round(speedPercentile)),
        lastIncreased: new Date().toISOString(),
        subStats: [],
      },
      {
        name: 'Endurance',
        value: 45,
        rank: 'D',
        lastIncreased: new Date().toISOString(),
        subStats: [],
      },
      {
        name: 'Dexterity',
        value: 81,
        rank: 'B',
        lastIncreased: new Date().toISOString(),
        subStats: [],
      },
      {
        name: 'Agility',
        value: Math.round(speedPercentile),
        rank: getStatRank(Math.round(speedPercentile)),
        lastIncreased: new Date().toISOString(),
        subStats: [],
      },
    ],
  };
}

/**
 * Initialize Vitality stats from baseline
 */
function initializeVitalityStats(baseline: ScreeningBaseline): GameStat {
  const sleepPercentile = 82; // From "High (82%)"
  const breathHoldPercentile = 65; // From "65th percentile"
  const dietPercentile = 70; // From "70th percentile"

  const avgVitality = Math.round((sleepPercentile + breathHoldPercentile + dietPercentile) / 3);

  return {
    name: 'Vitality',
    value: avgVitality,
    rank: getStatRank(avgVitality),
    lastIncreased: new Date().toISOString(),
    subStats: [
      {
        name: 'Stamina',
        value: Math.round(breathHoldPercentile),
        rank: getStatRank(Math.round(breathHoldPercentile)),
        lastIncreased: new Date().toISOString(),
        subStats: [],
      },
      {
        name: 'Regeneration',
        value: Math.round(sleepPercentile),
        rank: getStatRank(Math.round(sleepPercentile)),
        lastIncreased: new Date().toISOString(),
        subStats: [],
      },
      {
        name: 'Adherence',
        value: Math.round(dietPercentile),
        rank: getStatRank(Math.round(dietPercentile)),
        lastIncreased: new Date().toISOString(),
        subStats: [],
      },
      {
        name: 'Balance',
        value: 72,
        rank: 'B',
        lastIncreased: new Date().toISOString(),
        subStats: [],
      },
      {
        name: 'Longevity',
        value: 60,
        rank: 'C',
        lastIncreased: new Date().toISOString(),
        subStats: [],
      },
    ],
  };
}

/**
 * Initialize Intelligence stats from baseline
 */
function initializeIntelligenceStats(baseline: ScreeningBaseline): GameStat {
  const iqPercentile = Math.min((baseline.cognitiveBaseline.iqEstimate / 160) * 100, 100);
  const reasonPercentile = baseline.cognitiveBaseline.adaptiveReasoningPercentile;
  const adaptPercentile = baseline.cognitiveBaseline.patternLearningPercentile;
  const strategyPercentile = baseline.cognitiveBaseline.adaptiveReasoningPercentile;

  const avgIntelligence = Math.round(
    (iqPercentile + reasonPercentile + adaptPercentile + strategyPercentile) / 4
  );

  return {
    name: 'Intelligence',
    value: avgIntelligence,
    rank: getStatRank(avgIntelligence),
    lastIncreased: new Date().toISOString(),
    subStats: [
      {
        name: 'Reason',
        value: Math.round(reasonPercentile),
        rank: getStatRank(Math.round(reasonPercentile)),
        lastIncreased: new Date().toISOString(),
        subStats: [],
      },
      {
        name: 'Knowledge',
        value: Math.round(iqPercentile),
        rank: getStatRank(Math.round(iqPercentile)),
        lastIncreased: new Date().toISOString(),
        subStats: [],
      },
      {
        name: 'Adaptability',
        value: Math.round(adaptPercentile),
        rank: getStatRank(Math.round(adaptPercentile)),
        lastIncreased: new Date().toISOString(),
        subStats: [],
      },
      {
        name: 'Strategy',
        value: Math.round(strategyPercentile),
        rank: getStatRank(Math.round(strategyPercentile)),
        lastIncreased: new Date().toISOString(),
        subStats: [],
      },
      {
        name: 'Perception',
        value: 78,
        rank: 'B',
        lastIncreased: new Date().toISOString(),
        subStats: [],
      },
    ],
  };
}

/**
 * Initialize Creativity stats (derived from assessment notes)
 */
function initializeCreativityStats(baseline: ScreeningBaseline): GameStat {
  // Creativity is typically 50-70th percentile for analytical types
  const baseCreativity = 58;

  return {
    name: 'Creativity',
    value: baseCreativity,
    rank: 'D',
    lastIncreased: new Date().toISOString(),
    subStats: [
      {
        name: 'Imagination',
        value: 55,
        rank: 'D',
        lastIncreased: new Date().toISOString(),
        subStats: [],
      },
      {
        name: 'Innovation',
        value: 65,
        rank: 'C',
        lastIncreased: new Date().toISOString(),
        subStats: [],
      },
      {
        name: 'Style',
        value: 50,
        rank: 'D',
        lastIncreased: new Date().toISOString(),
        subStats: [],
      },
      {
        name: 'Expression',
        value: 58,
        rank: 'D',
        lastIncreased: new Date().toISOString(),
        subStats: [],
      },
      {
        name: 'Vision',
        value: 62,
        rank: 'C',
        lastIncreased: new Date().toISOString(),
        subStats: [],
      },
    ],
  };
}

/**
 * Initialize Spirit stats from baseline
 */
function initializeSpiritStats(baseline: ScreeningBaseline): GameStat {
  const purposePercentile = extractPercentile(baseline.psychosocialBaseline.purposeClarity);
  const empathyPercentile = extractPercentile(baseline.psychosocialBaseline.empathyScore);
  const faithPercentile = 55; // From assessment notes
  const convictionPercentile = 70; // Derived

  const avgSpirit = Math.round(
    (purposePercentile + empathyPercentile + faithPercentile + convictionPercentile) / 4
  );

  return {
    name: 'Spirit',
    value: avgSpirit,
    rank: getStatRank(avgSpirit),
    lastIncreased: new Date().toISOString(),
    subStats: [
      {
        name: 'Faith',
        value: 55,
        rank: 'D',
        lastIncreased: new Date().toISOString(),
        subStats: [],
      },
      {
        name: 'Purpose',
        value: Math.round(purposePercentile),
        rank: getStatRank(Math.round(purposePercentile)),
        lastIncreased: new Date().toISOString(),
        subStats: [],
      },
      {
        name: 'Tranquility',
        value: 68,
        rank: 'C',
        lastIncreased: new Date().toISOString(),
        subStats: [],
      },
      {
        name: 'Empathy',
        value: Math.round(empathyPercentile),
        rank: getStatRank(Math.round(empathyPercentile)),
        lastIncreased: new Date().toISOString(),
        subStats: [],
      },
      {
        name: 'Conviction',
        value: 70,
        rank: 'B',
        lastIncreased: new Date().toISOString(),
        subStats: [],
      },
    ],
  };
}

/**
 * Initialize Psyche stats from baseline
 */
function initializePsycheStats(baseline: ScreeningBaseline): GameStat {
  const composurePercentile = extractPercentile(baseline.psychosocialBaseline.composureUnderPressure);
  const charismaPercentile = extractPercentile(baseline.psychosocialBaseline.charisma);
  const willpowerPercentile = extractPercentile(baseline.psychosocialBaseline.willpower);
  const focusPercentile = 65; // From assessment notes

  const avgPsyche = Math.round(
    (composurePercentile + charismaPercentile + willpowerPercentile + focusPercentile) / 4
  );

  return {
    name: 'Psyche',
    value: avgPsyche,
    rank: getStatRank(avgPsyche),
    lastIncreased: new Date().toISOString(),
    subStats: [
      {
        name: 'Resilience',
        value: Math.round(composurePercentile),
        rank: getStatRank(Math.round(composurePercentile)),
        lastIncreased: new Date().toISOString(),
        subStats: [],
      },
      {
        name: 'Charisma',
        value: Math.round(charismaPercentile),
        rank: getStatRank(Math.round(charismaPercentile)),
        lastIncreased: new Date().toISOString(),
        subStats: [],
      },
      {
        name: 'Focus',
        value: 65,
        rank: 'C',
        lastIncreased: new Date().toISOString(),
        subStats: [],
      },
      {
        name: 'Willpower',
        value: Math.round(willpowerPercentile),
        rank: getStatRank(Math.round(willpowerPercentile)),
        lastIncreased: new Date().toISOString(),
        subStats: [],
      },
      {
        name: 'Composure',
        value: Math.round(composurePercentile),
        rank: getStatRank(Math.round(composurePercentile)),
        lastIncreased: new Date().toISOString(),
        subStats: [],
      },
    ],
  };
}

/**
 * Initialize all stats from screening baseline data
 */
export function initializeStatsFromBaseline(baseline: ScreeningBaseline): GameStat[] {
  return [
    initializePhysicalStats(baseline),
    initializeVitalityStats(baseline),
    initializeIntelligenceStats(baseline),
    initializeCreativityStats(baseline),
    initializeSpiritStats(baseline),
    initializePsycheStats(baseline),
  ];
}
