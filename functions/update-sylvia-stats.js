// Direct Firestore update for Sylvia's account
const admin = require('firebase-admin');

// Initialize with existing service account
const serviceAccount = require('./genesis-protocol-bffc2-firebase-adminsdk-mpsmi-73e3f69db3.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'genesis-protocol-bffc2'
});

const db = admin.firestore();

async function updateSylviaStats() {
  const uid = '5CV9Q1rkUZTmqJsaMckBV3eI8H82';
  const now = new Date().toISOString();

  const updatedStats = [
    {
      name: "Physical",
      value: 79,
      rank: "B",
      lastIncreased: now,
      subStats: [
        { name: "Strength", value: 80, rank: "B", lastIncreased: now },
        { name: "Speed", value: 78, rank: "B", lastIncreased: now },
        { name: "Endurance", value: 75, rank: "B", lastIncreased: now },
        { name: "Dexterity", value: 82, rank: "A", lastIncreased: now },
        { name: "Agility", value: 80, rank: "B", lastIncreased: now }
      ]
    },
    {
      name: "Vitality",
      value: 72,
      rank: "B",
      lastIncreased: now,
      subStats: [
        { name: "Stamina", value: 70, rank: "B", lastIncreased: now },
        { name: "Regeneration", value: 75, rank: "B", lastIncreased: now },
        { name: "Adherence", value: 72, rank: "B", lastIncreased: now },
        { name: "Balance", value: 70, rank: "B", lastIncreased: now },
        { name: "Longevity", value: 73, rank: "B", lastIncreased: now }
      ]
    },
    {
      name: "Intelligence",
      value: 83,
      rank: "A",
      lastIncreased: now,
      subStats: [
        { name: "Reason", value: 85, rank: "A", lastIncreased: now },
        { name: "Knowledge", value: 82, rank: "A", lastIncreased: now },
        { name: "Adaptability", value: 84, rank: "A", lastIncreased: now },
        { name: "Strategy", value: 83, rank: "A", lastIncreased: now },
        { name: "Perception", value: 81, rank: "A", lastIncreased: now }
      ]
    },
    {
      name: "Creativity",
      value: 71,
      rank: "B",
      lastIncreased: now,
      subStats: [
        { name: "Imagination", value: 72, rank: "B", lastIncreased: now },
        { name: "Innovation", value: 70, rank: "B", lastIncreased: now },
        { name: "Style", value: 68, rank: "C", lastIncreased: now },
        { name: "Expression", value: 73, rank: "B", lastIncreased: now },
        { name: "Vision", value: 72, rank: "B", lastIncreased: now }
      ]
    },
    {
      name: "Spirit",
      value: 73,
      rank: "B",
      lastIncreased: now,
      subStats: [
        { name: "Faith", value: 70, rank: "B", lastIncreased: now },
        { name: "Purpose", value: 75, rank: "B", lastIncreased: now },
        { name: "Tranquility", value: 72, rank: "B", lastIncreased: now },
        { name: "Empathy", value: 74, rank: "B", lastIncreased: now },
        { name: "Conviction", value: 74, rank: "B", lastIncreased: now }
      ]
    },
    {
      name: "Psyche",
      value: 62,
      rank: "C",
      lastIncreased: now,
      subStats: [
        { name: "Resilience", value: 65, rank: "C", lastIncreased: now },
        { name: "Charisma", value: 60, rank: "C", lastIncreased: now },
        { name: "Focus", value: 62, rank: "C", lastIncreased: now },
        { name: "Willpower", value: 60, rank: "C", lastIncreased: now },
        { name: "Composure", value: 63, rank: "C", lastIncreased: now }
      ]
    }
  ];

  try {
    console.log(`\n🔄 Updating stats for Sylvia (UID: ${uid})...`);
    
    await db.collection('userStates').doc(uid).update({
      stats: updatedStats,
      'rank.name': 'B',
      'rank.threatLevel': 'Beta (Competent)',
      'rank.attributeThreshold': 70,
      'rank.threatDescription': 'Above average capacity. Consistent performance trajectory confirmed.',
      updatedAt: now
    });

    console.log('✅ SUCCESS! Stats updated in Firestore.');
    console.log('\n📊 New Stats:');
    console.log('  Physical: 79% (B)');
    console.log('  Vitality: 72% (B)');
    console.log('  Intelligence: 83% (A)');
    console.log('  Creativity: 71% (B)');
    console.log('  Spirit: 73% (B)');
    console.log('  Psyche: 62% (C)');
    console.log('  Overall Rank: B');
    console.log('\n🔥 Refresh your browser to see the changes!\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  process.exit(0);
}

updateSylviaStats();
