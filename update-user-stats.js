const admin = require('firebase-admin');

// Initialize Firebase Admin
admin.initializeApp();

const updateUserStats = async () => {
  const userId = '5CV9Q1rkUZTmqJsaMckBV3eI8H82';
  
  const getStatRank = (value) => {
    if (value >= 90) return 'S';
    if (value >= 80) return 'A';
    if (value >= 70) return 'B';
    if (value >= 60) return 'C';
    if (value >= 40) return 'D';
    return 'E';
  };

  const now = new Date().toISOString();

  // Your exact stats
  const physicalAvg = 79;
  const vitalityAvg = 72;
  const intelligenceAvg = 83;
  const creativeAvg = 71;
  const spiritAvg = 73;
  const psycheAvg = 62;

  // Calculate overall rank from average
  const overallAvg = Math.round(
    (physicalAvg + vitalityAvg + intelligenceAvg + creativeAvg + spiritAvg + psycheAvg) / 6
  );
  const overallRank = getStatRank(overallAvg);

  const stats = [
    {
      name: 'Physical',
      value: physicalAvg,
      rank: getStatRank(physicalAvg),
      lastIncreased: now,
      subStats: [
        { name: 'Strength', value: 80, rank: 'A', lastIncreased: now },
        { name: 'Speed', value: 75, rank: 'B', lastIncreased: now },
        { name: 'Endurance', value: 78, rank: 'B', lastIncreased: now },
        { name: 'Dexterity', value: 81, rank: 'A', lastIncreased: now },
        { name: 'Agility', value: 82, rank: 'A', lastIncreased: now },
      ],
    },
    {
      name: 'Vitality',
      value: vitalityAvg,
      rank: getStatRank(vitalityAvg),
      lastIncreased: now,
      subStats: [
        { name: 'Stamina', value: 70, rank: 'B', lastIncreased: now },
        { name: 'Regeneration', value: 72, rank: 'B', lastIncreased: now },
        { name: 'Immunity', value: 74, rank: 'B', lastIncreased: now },
      ],
    },
    {
      name: 'Intelligence',
      value: intelligenceAvg,
      rank: getStatRank(intelligenceAvg),
      lastIncreased: now,
      subStats: [
        { name: 'IQ', value: 85, rank: 'A', lastIncreased: now },
        { name: 'Reasoning', value: 82, rank: 'A', lastIncreased: now },
        { name: 'Adaptability', value: 82, rank: 'A', lastIncreased: now },
      ],
    },
    {
      name: 'Creativity',
      value: creativeAvg,
      rank: getStatRank(creativeAvg),
      lastIncreased: now,
      subStats: [
        { name: 'Imagination', value: 70, rank: 'B', lastIncreased: now },
        { name: 'Innovation', value: 72, rank: 'B', lastIncreased: now },
        { name: 'Style', value: 60, rank: 'C', lastIncreased: now },
        { name: 'Expression', value: 74, rank: 'B', lastIncreased: now },
        { name: 'Vision', value: 78, rank: 'B', lastIncreased: now },
      ],
    },
    {
      name: 'Spirit',
      value: spiritAvg,
      rank: getStatRank(spiritAvg),
      lastIncreased: now,
      subStats: [
        { name: 'Purpose', value: 75, rank: 'B', lastIncreased: now },
        { name: 'Empathy', value: 72, rank: 'B', lastIncreased: now },
        { name: 'Faith', value: 70, rank: 'B', lastIncreased: now },
      ],
    },
    {
      name: 'Psyche',
      value: psycheAvg,
      rank: getStatRank(psycheAvg),
      lastIncreased: now,
      subStats: [
        { name: 'Composure', value: 60, rank: 'C', lastIncreased: now },
        { name: 'Charisma', value: 65, rank: 'C', lastIncreased: now },
        { name: 'Willpower', value: 62, rank: 'C', lastIncreased: now },
        { name: 'Focus', value: 60, rank: 'C', lastIncreased: now },
      ],
    },
  ];

  const updateData = {
    stats,
    overallRank,
    percentile: overallAvg,
    hasOnboarded: true,
    lastUpdated: now,
  };

  try {
    await admin.firestore().collection('users').doc(userId).update(updateData);
    console.log('✅ User stats updated successfully!');
    console.log('Stats:', {
      Physical: physicalAvg,
      Vitality: vitalityAvg,
      Intelligence: intelligenceAvg,
      Creativity: creativeAvg,
      Spirit: spiritAvg,
      Psyche: psycheAvg,
      Overall: overallAvg,
      Rank: overallRank,
    });
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating user stats:', error);
    process.exit(1);
  }
};

updateUserStats();
