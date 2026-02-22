/**
 * Force Initialize Game State for User
 * This script writes the predetermined Abas profile stats and calibration report
 * directly to Firestore for a specific user.
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin
const serviceAccountPath = path.join(__dirname, 'genesis-protocol-firebase-adminsdk.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ ERROR: Service account key file not found!');
  console.error('Expected location:', serviceAccountPath);
  console.error('\nPlease download your Firebase Admin SDK key from:');
  console.error('https://console.firebase.google.com/project/genesis-protocol/settings/serviceaccounts/adminsdk');
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Your user ID
const USER_ID = 'bKGGHbe6Szdo0oSx3OOVrDFhUmq1';

// Predetermined stats (Abas profile)
const PREDETERMINED_STATS = {
  IP: { value: 88, rank: 'A' },
  LE: { value: 86, rank: 'A' },
  FP: { value: 83, rank: 'A' },
  KA: { value: 78, rank: 'B' },
  WM: { value: 82, rank: 'A' },
  PS: { value: 74, rank: 'B' },
  TC: { value: 75, rank: 'B' },
  AT: { value: 68, rank: 'C' },
  overallRank: 'A'
};

const DEFAULT_CALIBRATION_REPORT = {
  tpi: 89,
  overallRank: 'A',
  talentClass: 'Gifted',
  obsessionLevel: 'Relentless',
  rarity: '1 in 50',
  rarityBand: 'Exceptional',
  mbtiProfile: 'INTJ: The Architect',
  symbolicProfile: 'THE_STRATEGIST',
  codename: 'ABAS',
  percentile: 89,
  estimatedCeilingRank: 'S',
  primaryFailureNode: 'Burnout from overcommitment',
  failureNodeRisk: 'High pressure threshold breach',
  successProbability: 84,
  dropoutProbability: 16,
  traitScores: {
    IP: 88,
    LE: 86,
    FP: 83,
    KA: 78,
    WM: 82,
    PS: 74,
    TC: 75,
    AT: 68
  },
  talentDna: {
    BP: 0.89,
    LV: 0.85,
    DR: 0.82
  },
  historicalPrecedent: {
    name: 'Strategic Mastermind',
    matchPercentage: 87,
    alignment: 'High analytical capacity with systematic execution'
  },
  centralInsight: 'Profile indicates **exceptional analytical capacity** with strong systematic execution. Natural strategic thinker with above-average learning velocity. *Caution*: Risk of burnout from overcommitment—implement structured rest periods.',
  noteworthyFeats: [
    {
      label: 'High Analytical Bandwidth',
      value: 'IP: 88 (A-rank)',
      desc: 'Exceptional information processing capacity',
      rarity: 'Rare'
    },
    {
      label: 'Strategic Learning',
      value: 'LE: 86 (A-rank)',
      desc: 'Superior learning efficiency and pattern recognition',
      rarity: 'Rare'
    }
  ],
  biometrics: {
    dateOfBirth: '',
    age: null,
    gender: ''
  }
};

async function initializeGameState() {
  try {
    console.log('🚀 Starting game state initialization...\n');
    console.log(`User ID: ${USER_ID}`);
    console.log(`Profile: Abas (Predetermined Stats)\n`);

    const userRef = db.collection('users').doc(USER_ID);
    
    // Check if user exists
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      console.error('❌ ERROR: User not found in Firestore!');
      console.error('Make sure the user has logged in at least once.');
      process.exit(1);
    }

    console.log('✅ User found in database\n');

    // Prepare the complete game state
    const gameState = {
      stats: PREDETERMINED_STATS,
      calibrationAnalysis: DEFAULT_CALIBRATION_REPORT,
      onboardingComplete: true,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    };

    console.log('📝 Writing game state to Firestore...\n');
    console.log('Stats being set:');
    Object.entries(PREDETERMINED_STATS).forEach(([key, value]) => {
      if (key !== 'overallRank') {
        console.log(`  ${key}: ${value.value} (Rank: ${value.rank})`);
      }
    });
    console.log(`  Overall Rank: ${PREDETERMINED_STATS.overallRank}\n`);

    // Write to Firestore
    await userRef.update(gameState);

    console.log('✅ SUCCESS! Game state initialized.\n');
    console.log('📊 Summary:');
    console.log(`  - Stats: ${Object.keys(PREDETERMINED_STATS).length - 1} attributes set`);
    console.log(`  - Overall Rank: ${PREDETERMINED_STATS.overallRank}`);
    console.log(`  - Calibration Report: Complete`);
    console.log(`  - Onboarding: Marked complete\n`);
    
    console.log('🎯 Next Steps:');
    console.log('  1. Clear your browser cache (Cmd+Shift+Delete on Mac)');
    console.log('  2. Or use Incognito/Private mode');
    console.log('  3. Log in to see your stats and Classified Dossier\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  }
}

// Run the script
initializeGameState();
