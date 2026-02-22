// Direct Firestore seed script - bypasses Cloud Functions
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function seedAccount() {
  const uid = 'ftQr1kAlTsOmZmJZrSzM995eEb73';
  const now = new Date().toISOString();
  
  console.log('🚀 Seeding fully calibrated account...');
  console.log('UID:', uid);
  
  const profileData = {
    "uid": uid,
    "userName": "Abas",
    "email": "abasukanga4@gmail.com",
    "hasOnboarded": true,
    "createdAt": now,
    "alignment": {
      "lawfulChaotic": -60,
      "goodEvil": 0,
      "profile": "Lawful Neutral"
    },
    "abasProfile": {
      "userName": "Abas",
      "email": "abasukanga4@gmail.com",
      "codename": "Black Swan",
      "dateOfBirth": "2002/06/04",
      "age": 23,
      "gender": "Male",
      "screeningTestSummary": {
        "physicalBaseline": {
          "benchPress1RM": 120,
          "squat1RM": 160,
          "deadlift1RM": 220,
          "sprint100m": 13.6
        },
        "cognitiveBaseline": {
          "iqEstimate": 120,
          "adaptiveReasoningPercentile": 86,
          "patternLearningPercentile": 85
        },
        "vitalityBaseline": {
          "sleepQuality": "High (82%)",
          "breathHold": "65th percentile",
          "dietConsistency": "70th percentile"
        },
        "psychosocialBaseline": {
          "purposeClarity": "85th percentile",
          "empathyScore": "80th percentile",
          "composureUnderPressure": "75th percentile",
          "willpower": "50th percentile",
          "charisma": "58th percentile"
        }
      }
    },
    "gameState": {
      "userName": "Abas",
      "hasOnboarded": true,
      "xp": 1000,
      "rank": {
        "name": "D",
        "threatLevel": "Delta (Emerging)",
        "attributeThreshold": 60,
        "timeEstimate": "Phase 2",
        "threatDescription": "Baseline capacity confirmed. Potential pathway unlocked."
      },
      "resonanceSignature": {
        "type": "Unawakened",
        "tier": 1
      },
      "stats": [
        {
          "name": "Physical",
          "value": 71,
          "rank": "B",
          "lastIncreased": now,
          "subStats": [
            {"name": "Strength", "value": 71, "rank": "B", "lastIncreased": now},
            {"name": "Speed", "value": 70, "rank": "B", "lastIncreased": now},
            {"name": "Endurance", "value": 45, "rank": "D", "lastIncreased": now},
            {"name": "Dexterity", "value": 81, "rank": "B", "lastIncreased": now},
            {"name": "Agility", "value": 70, "rank": "B", "lastIncreased": now}
          ]
        },
        {
          "name": "Vitality",
          "value": 72,
          "rank": "B",
          "lastIncreased": now,
          "subStats": [
            {"name": "Stamina", "value": 65, "rank": "C", "lastIncreased": now},
            {"name": "Regeneration", "value": 82, "rank": "A", "lastIncreased": now},
            {"name": "Adherence", "value": 70, "rank": "B", "lastIncreased": now},
            {"name": "Balance", "value": 72, "rank": "B", "lastIncreased": now},
            {"name": "Longevity", "value": 60, "rank": "C", "lastIncreased": now}
          ]
        },
        {
          "name": "Intelligence",
          "value": 84,
          "rank": "A",
          "lastIncreased": now,
          "subStats": [
            {"name": "Reason", "value": 86, "rank": "A", "lastIncreased": now},
            {"name": "Knowledge", "value": 75, "rank": "B", "lastIncreased": now},
            {"name": "Adaptability", "value": 85, "rank": "A", "lastIncreased": now},
            {"name": "Strategy", "value": 86, "rank": "A", "lastIncreased": now},
            {"name": "Perception", "value": 78, "rank": "B", "lastIncreased": now}
          ]
        },
        {
          "name": "Creativity",
          "value": 71,
          "rank": "B",
          "lastIncreased": now,
          "subStats": [
            {"name": "Imagination", "value": 70, "rank": "B", "lastIncreased": now},
            {"name": "Innovation", "value": 72, "rank": "B", "lastIncreased": now},
            {"name": "Style", "value": 60, "rank": "C", "lastIncreased": now},
            {"name": "Expression", "value": 74, "rank": "B", "lastIncreased": now},
            {"name": "Vision", "value": 78, "rank": "B", "lastIncreased": now}
          ]
        },
        {
          "name": "Spirit",
          "value": 72,
          "rank": "B",
          "lastIncreased": now,
          "subStats": [
            {"name": "Faith", "value": 55, "rank": "D", "lastIncreased": now},
            {"name": "Purpose", "value": 85, "rank": "A", "lastIncreased": now},
            {"name": "Tranquility", "value": 68, "rank": "C", "lastIncreased": now},
            {"name": "Empathy", "value": 80, "rank": "A", "lastIncreased": now},
            {"name": "Conviction", "value": 70, "rank": "B", "lastIncreased": now}
          ]
        },
        {
          "name": "Psyche",
          "value": 67,
          "rank": "C",
          "lastIncreased": now,
          "subStats": [
            {"name": "Resilience", "value": 75, "rank": "B", "lastIncreased": now},
            {"name": "Charisma", "value": 58, "rank": "D", "lastIncreased": now},
            {"name": "Focus", "value": 65, "rank": "C", "lastIncreased": now},
            {"name": "Willpower", "value": 50, "rank": "D", "lastIncreased": now},
            {"name": "Composure", "value": 75, "rank": "B", "lastIncreased": now}
          ]
        }
      ],
      "initialStatsSnapshot": [],
      "chapters": [],
      "chapterCount": 0
    }
  };
  
  try {
    await db.collection('userStates').doc(uid).set(profileData, { merge: true });
    console.log('✅ Account seeded successfully!');
    console.log('📊 Stats initialized:');
    console.log('  - Physical: B (71)');
    console.log('  - Vitality: B (72)');
    console.log('  - Intelligence: A (84)');
    console.log('  - Creativity: B (71)');
    console.log('  - Spirit: B (72)');
    console.log('  - Psyche: C (67)');
    console.log('\n🎯 hasOnboarded: true');
    console.log('🔥 You can now login and the screening test will be SKIPPED!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding account:', error);
    process.exit(1);
  }
}

seedAccount();
