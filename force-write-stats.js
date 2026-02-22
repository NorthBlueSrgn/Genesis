// Force Write Stats to Firestore
// Run this script to manually write predetermined stats to your Firestore account

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // You'll need to download this from Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Your user ID
const userId = 'bKGGHbe6Szdo0oSx3OOVrDFhUmq1';

// Predetermined stats (Abas profile)
const predeterminedStats = [
  {
    name: 'Physical',
    value: 300,
    rank: 'C',
    lastIncreased: new Date().toISOString(),
    subStats: [
      { name: 'Strength', value: 62, rank: 'C', lastIncreased: new Date().toISOString() },
      { name: 'Speed', value: 58, rank: 'D', lastIncreased: new Date().toISOString() },
      { name: 'Endurance', value: 55, rank: 'D', lastIncreased: new Date().toISOString() },
      { name: 'Dexterity', value: 68, rank: 'C', lastIncreased: new Date().toISOString() },
      { name: 'Agility', value: 57, rank: 'D', lastIncreased: new Date().toISOString() }
    ]
  },
  {
    name: 'Vitality',
    value: 340,
    rank: 'C',
    lastIncreased: new Date().toISOString(),
    subStats: [
      { name: 'Stamina', value: 82, rank: 'A', lastIncreased: new Date().toISOString() },
      { name: 'Regeneration', value: 70, rank: 'B', lastIncreased: new Date().toISOString() },
      { name: 'Adherence', value: 60, rank: 'C', lastIncreased: new Date().toISOString() },
      { name: 'Balance', value: 68, rank: 'C', lastIncreased: new Date().toISOString() },
      { name: 'Longevity', value: 60, rank: 'C', lastIncreased: new Date().toISOString() }
    ]
  },
  {
    name: 'Intelligence',
    value: 415,
    rank: 'A',
    lastIncreased: new Date().toISOString(),
    subStats: [
      { name: 'Reason', value: 88, rank: 'A', lastIncreased: new Date().toISOString() },
      { name: 'Knowledge', value: 84, rank: 'A', lastIncreased: new Date().toISOString() },
      { name: 'Adaptability', value: 78, rank: 'B', lastIncreased: new Date().toISOString() },
      { name: 'Strategy', value: 86, rank: 'A', lastIncreased: new Date().toISOString() },
      { name: 'Perception', value: 79, rank: 'B', lastIncreased: new Date().toISOString() }
    ]
  },
  {
    name: 'Creativity',
    value: 350,
    rank: 'B',
    lastIncreased: new Date().toISOString(),
    subStats: [
      { name: 'Imagination', value: 72, rank: 'B', lastIncreased: new Date().toISOString() },
      { name: 'Innovation', value: 68, rank: 'C', lastIncreased: new Date().toISOString() },
      { name: 'Style', value: 74, rank: 'B', lastIncreased: new Date().toISOString() },
      { name: 'Expression', value: 70, rank: 'B', lastIncreased: new Date().toISOString() },
      { name: 'Vision', value: 66, rank: 'C', lastIncreased: new Date().toISOString() }
    ]
  },
  {
    name: 'Spirit',
    value: 345,
    rank: 'B',
    lastIncreased: new Date().toISOString(),
    subStats: [
      { name: 'Faith', value: 55, rank: 'D', lastIncreased: new Date().toISOString() },
      { name: 'Purpose', value: 85, rank: 'A', lastIncreased: new Date().toISOString() },
      { name: 'Tranquility', value: 63, rank: 'C', lastIncreased: new Date().toISOString() },
      { name: 'Empathy', value: 72, rank: 'B', lastIncreased: new Date().toISOString() },
      { name: 'Conviction', value: 70, rank: 'B', lastIncreased: new Date().toISOString() }
    ]
  },
  {
    name: 'Psyche',
    value: 360,
    rank: 'B',
    lastIncreased: new Date().toISOString(),
    subStats: [
      { name: 'Resilience', value: 75, rank: 'B', lastIncreased: new Date().toISOString() },
      { name: 'Charisma', value: 58, rank: 'D', lastIncreased: new Date().toISOString() },
      { name: 'Focus', value: 65, rank: 'C', lastIncreased: new Date().toISOString() },
      { name: 'Willpower', value: 50, rank: 'D', lastIncreased: new Date().toISOString() },
      { name: 'Composure', value: 80, rank: 'A', lastIncreased: new Date().toISOString() }
    ]
  }
];

async function forceWriteStats() {
  try {
    console.log('🔥 Force writing stats to Firestore...');
    console.log(`User ID: ${userId}`);
    
    const gameStateRef = db.collection('gameStates').doc(userId);
    
    // Update only the stats field
    await gameStateRef.set({
      stats: predeterminedStats,
      hasOnboarded: true,
      userName: 'Abas'
    }, { merge: true });
    
    console.log('✅ Stats successfully written to Firestore!');
    console.log('📊 Stats summary:');
    predeterminedStats.forEach(stat => {
      console.log(`  - ${stat.name}: ${stat.value} (${stat.rank})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error writing stats:', error);
    process.exit(1);
  }
}

forceWriteStats();
