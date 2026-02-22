import * as admin from 'firebase-admin';
import * as bcrypt from 'bcrypt';
import { initializeApp, cert } from 'firebase-admin/app';

// Initialize Firebase Admin
const serviceAccount = require('../firebaseConfig.json');
initializeApp({
  credential: cert(serviceAccount),
});

const db = admin.firestore();

// Comprehensive screening test data for Abas
const screeningData = {
  userName: 'Abas',
  email: 'abas@genesis-protocol.local',
  password: 'Zoro145%',
  
  // Physical / Kinetic
  physical: {
    benchPress: 85, // kg
    squat: 110, // kg
    deadlift: 150, // kg
    sprintTime100m: 13.6, // seconds
    run5kTime: '35m', // 35 minutes
    agility5sTest: 5, // seconds
  },

  // Fitts Law / Dexterity (Touchpad Test)
  fittsLaw: {
    totalTime: 52583, // ms
    totalError: 6.06, // %
    tests: [
      { width: 0.25, distance: 1, avgTime: 386.2, errors: 10 },
      { width: 0.25, distance: 4, avgTime: 422.8, errors: 0 },
      { width: 0.25, distance: 8, avgTime: 471.2, errors: 20 },
      { width: 1, distance: 4, avgTime: 316.7, errors: 10 },
      { width: 1, distance: 8, avgTime: 466.7, errors: 0 },
      { width: 2, distance: 4, avgTime: 483.8, errors: 0 },
      { width: 2, distance: 8, avgTime: 388.6, errors: 0 },
    ],
    device: 'touchpad',
    dimensions: { width: 31.26, height: 24.81 },
  },

  // Vitality / Lifestyle
  vitality: {
    waterIntake: 1.5, // L/week (below optimal)
    alcohol: 'occasional',
    smoking: false,
    coffee: 'minimal',
    sleepQuality: 7, // out of 10
    staminaSelfRating: 6, // out of 10
    co2Tolerance: 'moderate',
  },

  // MBTI + Cognitive Profile
  mbti: 'INTJ-T',
  mbtiScores: {
    mindfulness: 69,
    energy: 70,
    nature: 60,
    tactics: 64,
    identity: 51,
  },

  // Hobbies & Skills
  hobbies: [
    { name: 'Chess', rating: 1350, percentile: 80 },
    { name: 'Football', type: 'tactical' },
    { name: 'Basketball', type: 'recreational' },
    { name: 'Coding', proficiency: 'advanced' },
    { name: 'Video Editing', proficiency: 'intermediate' },
    { name: 'Gym/Fitness', frequency: 'regular' },
    { name: 'Gaming', type: 'competitive' },
  ],

  // Human Benchmark
  humanBenchmark: {
    memoryLevel: 12,
    reactionTime: 'above-average',
    responseTime: 'above-average',
  },

  // IQ Battery
  iqEstimate: 120,
  adaptiveReasoning: 'high',

  // Psycho-social / Spirit
  psychosocial: {
    faith: 55,
    purpose: 67,
    tranquility: 55,
    empathy: 60,
    conviction: 65,
    charisma: 58,
  },

  // Moral/Psychological Profile
  moralArchetype: 'pragmatic',
  decisionPatterns: ['morally-grey', 'help-if-able', 'brute-force-if-unsure'],

  // Strategy / Game Theory
  strategyPercentile: 80,
};

// Calculate substats from screening data
function calculateSubstats(screening: any) {
  const substats: Record<string, number> = {
    // Physical substats
    Strength: Math.min(100, (screening.physical.benchPress / 100) * 100 + 15),
    Speed: Math.min(100, ((20 - screening.physical.sprintTime100m) / 20) * 100 + 20),
    Endurance: Math.min(100, ((45 - parseFloat(screening.physical.run5kTime)) / 45) * 100 + 15),
    Dexterity: Math.min(100, ((600 - screening.fittsLaw.totalTime) / 600) * 100 + 25),
    Agility: Math.min(100, ((6 - screening.fittsLaw.tests[0].avgTime / 100) * 100) + 30),
    
    // Vitality substats
    Stamina: screening.vitality.staminaSelfRating * 8 + (screening.physical.deadlift / 150) * 20,
    Regeneration: (screening.vitality.sleepQuality * 7) + 15,
    Adherence: 60 + (screening.vitality.sleepQuality * 3),
    Balance: screening.vitality.sleepQuality * 8,
    Longevity: (screening.vitality.waterIntake < 2 ? 40 : 70) + screening.vitality.sleepQuality * 5,

    // Intelligence substats
    Reason: screening.iqEstimate - 20,
    Knowledge: 60 + (screening.hobbies.length * 5),
    Adaptability: screening.mbtiScores.tactics + 15,
    Strategy: screening.strategyPercentile + 10,
    Perception: (screening.humanBenchmark.reactionTime === 'above-average' ? 75 : 60),

    // Creativity substats
    Imagination: screening.mbtiScores.energy + 20,
    Innovation: 65 + (screening.hobbies.find((h: any) => h.name === 'Coding') ? 15 : 0),
    Style: 55,
    Expression: screening.mbtiScores.energy + 10,
    Vision: 70,

    // Spirit substats
    Faith: screening.psychosocial.faith,
    Purpose: screening.psychosocial.purpose,
    Tranquility: screening.psychosocial.tranquility,
    Empathy: screening.psychosocial.empathy,
    Conviction: screening.psychosocial.conviction,

    // Psyche substats
    Resilience: screening.psychosocial.conviction + 10,
    Charisma: screening.psychosocial.charisma + 5,
    Focus: screening.mbtiScores.mindfulness + 15,
    Willpower: screening.mbtiScores.identity + 25,
    Composure: screening.psychosocial.tranquility + 10,
  };

  return substats;
}

// Calculate main stats from substats
function calculateMainStats(substats: Record<string, number>) {
  const physicalSubs = ['Strength', 'Speed', 'Endurance', 'Dexterity', 'Agility'];
  const vitalitySubs = ['Stamina', 'Regeneration', 'Adherence', 'Balance', 'Longevity'];
  const intelligenceSubs = ['Reason', 'Knowledge', 'Adaptability', 'Strategy', 'Perception'];
  const creativitySubs = ['Imagination', 'Innovation', 'Style', 'Expression', 'Vision'];
  const spiritSubs = ['Faith', 'Purpose', 'Tranquility', 'Empathy', 'Conviction'];
  const psycheSubs = ['Resilience', 'Charisma', 'Focus', 'Willpower', 'Composure'];

  const avgStat = (subs: string[]) =>
    subs.reduce((sum, sub) => sum + (substats[sub] || 0), 0) / subs.length;

  return {
    Physical: avgStat(physicalSubs),
    Vitality: avgStat(vitalitySubs),
    Intelligence: avgStat(intelligenceSubs),
    Creativity: avgStat(creativitySubs),
    Spirit: avgStat(spiritSubs),
    Psyche: avgStat(psycheSubs),
  };
}

// Determine Talent & Obsession classes
function classifyTalent(stats: Record<string, number>, screening: any) {
  // Talent DNA calculation
  const maxStat = Math.max(...Object.values(stats));
  const avgStat = Object.values(stats).reduce((a, b) => a + b) / 6;
  const balance = 1 - (Math.max(...Object.values(stats)) - Math.min(...Object.values(stats))) / 100;

  let talentClass = 'Standard';
  if (maxStat > 90) talentClass = 'Prodigy';
  else if (maxStat > 80 && balance > 0.7) talentClass = 'Virtuoso';
  else if (maxStat > 75) talentClass = 'Advanced';
  else if (avgStat > 70) talentClass = 'Specialized';

  // Obsession level (based on MBTI identity score and conviction)
  let obsessionLevel = Math.round(
    (screening.mbtiScores.identity / 100) * 50 +
    (screening.psychosocial.conviction / 100) * 50
  );
  obsessionLevel = Math.max(10, Math.min(100, obsessionLevel));

  return { talentClass, obsessionLevel };
}

async function createUserProfile() {
  try {
    console.log('🚀 Creating user profile for Abas...\n');

    // Hash password
    const hashedPassword = await bcrypt.hash(screeningData.password, 10);

    // Calculate stats
    const substats = calculateSubstats(screeningData);
    const mainStats = calculateMainStats(substats);
    const { talentClass, obsessionLevel } = classifyTalent(mainStats, screeningData);

    // Calculate HATI (Apex Threat Index)
    const hati = Math.round(
      (Object.values(mainStats).reduce((a, b) => a + b) / 6 / 100) * 100
    );

    console.log('📊 Screening Data Analysis:');
    console.log(`   MBTI: ${screeningData.mbti}`);
    console.log(`   IQ Estimate: ${screeningData.iqEstimate}`);
    console.log(`   Chess Rating: ${screeningData.hobbies[0].rating} (${screeningData.hobbies[0].percentile}th percentile)`);
    console.log(`   Fitts Law Error Rate: ${screeningData.fittsLaw.totalError.toFixed(2)}%\n`);

    console.log('💪 Main Stats:');
    Object.entries(mainStats).forEach(([stat, value]) => {
      console.log(`   ${stat}: ${Math.round(value)}`);
    });
    console.log(`\n⚡ HATI (Apex Threat Index): ${hati}%`);
    console.log(`🧬 Talent Class: ${talentClass}`);
    console.log(`🔥 Obsession Level: ${obsessionLevel}/100\n`);

    // Create user document
    const userDoc = {
      userName: screeningData.userName,
      email: screeningData.email,
      passwordHash: hashedPassword,
      createdAt: new Date().toISOString(),
      lastLogin: null,
      rank: 'E',
      hati: hati,
      talentClass: talentClass,
      obsessionLevel: obsessionLevel,
      
      stats: Object.entries(mainStats).map(([name, value]) => ({
        name,
        value: Math.round(value),
        rank: 'E',
        subStats: Object.keys(substats)
          .filter(sub => {
            const statMap: Record<string, string[]> = {
              'Physical': ['Strength', 'Speed', 'Endurance', 'Dexterity', 'Agility'],
              'Vitality': ['Stamina', 'Regeneration', 'Adherence', 'Balance', 'Longevity'],
              'Intelligence': ['Reason', 'Knowledge', 'Adaptability', 'Strategy', 'Perception'],
              'Creativity': ['Imagination', 'Innovation', 'Style', 'Expression', 'Vision'],
              'Spirit': ['Faith', 'Purpose', 'Tranquility', 'Empathy', 'Conviction'],
              'Psyche': ['Resilience', 'Charisma', 'Focus', 'Willpower', 'Composure'],
            };
            return (statMap[name] || []).includes(sub);
          })
          .map(sub => ({
            name: sub,
            value: Math.round(substats[sub]),
            rank: 'E',
            lastIncreased: new Date().toISOString(),
          })),
        lastIncreased: new Date().toISOString(),
      })),

      screeningData: {
        physical: screeningData.physical,
        fittsLaw: screeningData.fittsLaw,
        vitality: screeningData.vitality,
        mbti: screeningData.mbti,
        mbtiScores: screeningData.mbtiScores,
        hobbies: screeningData.hobbies,
        humanBenchmark: screeningData.humanBenchmark,
        iqEstimate: screeningData.iqEstimate,
        psychosocial: screeningData.psychosocial,
        moralArchetype: screeningData.moralArchetype,
        decisionPatterns: screeningData.decisionPatterns,
        strategyPercentile: screeningData.strategyPercentile,
      },

      // Initialize empty game state
      xp: 0,
      paths: [],
      missions: [],
      sideMissions: [],
      chatSessions: [],
      journal: [],
      chapterBlack: { chapters: [], dailyTaskCompletionPercentage: 0 },
      dailyMetrics: {
        waterIntake: 0,
        steps: 0,
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        immersionHours: 0,
        sleepScore: 0,
        sleepHours: 0,
        weightKg: 0,
      },
      promotionExam: null,
      resonanceVector: {
        Unawakened: 0.2,
        Juggernaut: 0.1,
        Chameleon: 0.15,
        Virtuoso: 0.2,
        Joker: 0.15,
        Catalyst: 0.1,
        Cipher: 0.1,
      },
      talentDna: { class: talentClass, percentile: Math.min(95, hati + 5) },
      obsession: { level: obsessionLevel, type: 'Strategic' },
      calibrationAnalysis: null,
      codeName: 'STRATEGIST',
      archetype: 'INTJ-Analyst',
      totalTasksCompleted: 0,
      totalImmersionHours: 0,
      habitHistory: {},
      dailyNotes: {},
      statHistory: [],
      achievements: [],
      logs: [
        {
          id: new Date().getTime().toString(),
          timestamp: new Date().toISOString(),
          type: 'SYSTEM' as const,
          message: `OPERATIVE INITIALIZED: ${screeningData.userName} | Talent: ${talentClass} | Obsession: ${obsessionLevel}/100`,
        },
      ],
      weeklyPlan: {},
      voidHabits: [],
      specialEvent: null,
      benchmarks: [
        { id: 'bench_press', name: 'Bench Press', value: screeningData.physical.benchPress, unit: 'kg', stat: 'Physical', subStat: 'Strength' },
        { id: 'squat', name: 'Squat', value: screeningData.physical.squat, unit: 'kg', stat: 'Physical', subStat: 'Strength' },
        { id: 'deadlift', name: 'Deadlift', value: screeningData.physical.deadlift, unit: 'kg', stat: 'Physical', subStat: 'Strength' },
        { id: 'sprint_100m', name: '100m Sprint', value: screeningData.physical.sprintTime100m, unit: 's', stat: 'Physical', subStat: 'Speed' },
        { id: 'chess_rating', name: 'Chess Rating', value: screeningData.hobbies[0].rating, unit: 'ELO', stat: 'Intelligence', subStat: 'Strategy' },
      ],
    };

    // Write to Firestore
    await db.collection('users').doc(screeningData.userName).set(userDoc);

    console.log('✅ User profile created successfully!\n');
    console.log(`📁 Firestore Path: users/${screeningData.userName}`);
    console.log(`🔐 Login Credentials:`);
    console.log(`   Username: ${screeningData.userName}`);
    console.log(`   Password: ${screeningData.password}`);
    console.log(`\n🎯 Profile Summary:`);
    console.log(`   Rank: E (Starting)`);
    console.log(`   HATI: ${hati}%`);
    console.log(`   Talent: ${talentClass}`);
    console.log(`   Obsession: ${obsessionLevel}/100`);
    console.log(`   Code Name: STRATEGIST`);
    console.log(`   Archetype: INTJ-Analyst\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating user profile:', error);
    process.exit(1);
  }
}

createUserProfile();
