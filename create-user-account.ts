#!/usr/bin/env node

import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as readline from 'readline';

/**
 * CREATE USER ACCOUNT UTILITY
 * 
 * This script creates a Firebase Auth user and corresponding Firestore documents
 * from the command line with email, username, and password.
 * 
 * Usage:
 *   npx ts-node create-user-account.ts [--interactive] [--email EMAIL --username USERNAME --password PASSWORD]
 * 
 * Examples:
 *   npx ts-node create-user-account.ts --interactive
 *   npx ts-node create-user-account.ts --email test@example.com --username TestUser --password Pass123!
 */

// Initialize Firebase Admin
const serviceAccountPath = './functions/serviceAccountKey.json';
if (!fs.existsSync(serviceAccountPath)) {
  console.error(`❌ Service account key not found at ${serviceAccountPath}`);
  console.error('Please ensure you have downloaded the service account key from Firebase Console.');
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'genesis-protocol-bffc2'
  });
} catch (e: any) {
  if (!e.message.includes('already initialized')) {
    throw e;
  }
}

const db = admin.firestore();
const auth = admin.auth();

// Utility to create readline interface
function createReadlineInterface(): readline.Interface {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

// Utility to prompt user
function prompt(question: string): Promise<string> {
  const rl = createReadlineInterface();
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

// Validate email format
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate password strength
function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*)');
  }
  return {
    valid: errors.length === 0,
    errors
  };
}

// Validate username
function validateUsername(username: string): boolean {
  return /^[a-zA-Z0-9_-]{3,30}$/.test(username);
}

// Get user input interactively
async function getInteractiveInput(): Promise<{ email: string; username: string; password: string }> {
  console.log('\n🔐 Firebase User Account Creation\n');
  
  let email = '';
  while (!email || !validateEmail(email)) {
    email = await prompt('Email address: ');
    if (!validateEmail(email)) {
      console.log('❌ Invalid email format. Please try again.');
    }
  }

  let username = '';
  while (!username || !validateUsername(username)) {
    username = await prompt('Username (3-30 characters, letters, numbers, - or _): ');
    if (!validateUsername(username)) {
      console.log('❌ Invalid username. Must be 3-30 characters using letters, numbers, hyphens, or underscores.');
    }
  }

  let password = '';
  let passwordValid = false;
  while (!passwordValid) {
    password = await prompt('Password (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char): ');
    const validation = validatePassword(password);
    if (!validation.valid) {
      console.log('❌ Password requirements not met:');
      validation.errors.forEach(err => console.log(`   - ${err}`));
    } else {
      passwordValid = true;
    }
  }

  return { email, username, password };
}

// Generate default baseline data (for new users without screening test)
function generateDefaultBaseline() {
  return {
    physicalBaseline: {
      benchPress1RM: 85,
      squat1RM: 110,
      deadlift1RM: 150,
      sprint100m: 13.6
    },
    cognitiveBaseline: {
      iqEstimate: 120,
      adaptiveReasoningPercentile: 86,
      patternLearningPercentile: 85
    },
    vitalityBaseline: {
      sleepQuality: 'High (82%)',
      breathHold: '65th percentile',
      dietConsistency: '70th percentile'
    },
    psychosocialBaseline: {
      purposeClarity: '85th percentile',
      empathyScore: '80th percentile',
      composureUnderPressure: '75th percentile',
      willpower: '50th percentile',
      charisma: '58th percentile'
    }
  };
}

// Calculate initial stats from baseline
function calculateStatsFromBaseline(baseline: any) {
  const extractPercentile = (value: string): number => {
    const match = value.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 50;
  };

  const getStatRank = (value: number): string => {
    if (value >= 90) return 'S';
    if (value >= 80) return 'A';
    if (value >= 70) return 'B';
    if (value >= 60) return 'C';
    if (value >= 40) return 'D';
    return 'E';
  };

  const now = new Date().toISOString();

  // Physical Stats
  const benchPressPercentile = Math.min(
    (baseline.physicalBaseline.benchPress1RM / 100) * 85,
    100
  );
  const squatPercentile = Math.min(
    (baseline.physicalBaseline.squat1RM / 140) * 85,
    100
  );
  const deadliftPercentile = Math.min(
    (baseline.physicalBaseline.deadlift1RM / 180) * 85,
    100
  );
  const speedPercentile = Math.min(
    ((13.8 - baseline.physicalBaseline.sprint100m) / 13.8) * 90,
    100
  );
  const strengthAvg = Math.round(
    (benchPressPercentile + squatPercentile + deadliftPercentile) / 3
  );
  const physicalAvg = Math.round(strengthAvg * 0.6 + speedPercentile * 0.4);

  // Vitality Stats
  const sleepPercentile = 82;
  const breathHoldPercentile = 65;
  const dietPercentile = 70;
  const vitalityAvg = Math.round(
    (sleepPercentile + breathHoldPercentile + dietPercentile) / 3
  );

  // Intelligence Stats
  const iqPercentile = Math.min(
    (baseline.cognitiveBaseline.iqEstimate / 160) * 100,
    100
  );
  const reasonPercentile = baseline.cognitiveBaseline.adaptiveReasoningPercentile;
  const adaptPercentile = baseline.cognitiveBaseline.patternLearningPercentile;
  const intelligenceAvg = Math.round(
    (iqPercentile + reasonPercentile + adaptPercentile + reasonPercentile) / 4
  );

  // Creativity Stats - Default values
  const creativeAvg = Math.round((70 + 72 + 60 + 74 + 78) / 5);

  // Spirit Stats
  const purposePercentile = extractPercentile(baseline.psychosocialBaseline.purposeClarity);
  const empathyPercentile = extractPercentile(baseline.psychosocialBaseline.empathyScore);
  const faithPercentile = 55;
  const spiritAvg = Math.round(
    (purposePercentile + empathyPercentile + faithPercentile + 70) / 4
  );

  // Psyche Stats
  const composurePercentile = extractPercentile(
    baseline.psychosocialBaseline.composureUnderPressure
  );
  const charismaPercentile = extractPercentile(baseline.psychosocialBaseline.charisma);
  const willpowerPercentile = extractPercentile(baseline.psychosocialBaseline.willpower);
  const focusPercentile = 65;
  const psycheAvg = Math.round(
    (composurePercentile + charismaPercentile + willpowerPercentile + focusPercentile) / 4
  );

  return [
    {
      name: 'Physical',
      value: physicalAvg,
      rank: getStatRank(physicalAvg),
      lastIncreased: now,
      subStats: [
        {
          name: 'Strength',
          value: strengthAvg,
          rank: getStatRank(strengthAvg),
          lastIncreased: now,
        },
        {
          name: 'Speed',
          value: Math.round(speedPercentile),
          rank: getStatRank(Math.round(speedPercentile)),
          lastIncreased: now,
        },
        {
          name: 'Endurance',
          value: 45,
          rank: 'D',
          lastIncreased: now,
        },
        {
          name: 'Dexterity',
          value: 81,
          rank: 'B',
          lastIncreased: now,
        },
        {
          name: 'Agility',
          value: Math.round(speedPercentile),
          rank: getStatRank(Math.round(speedPercentile)),
          lastIncreased: now,
        },
      ],
    },
    {
      name: 'Vitality',
      value: vitalityAvg,
      rank: getStatRank(vitalityAvg),
      lastIncreased: now,
      subStats: [
        {
          name: 'Stamina',
          value: Math.round(breathHoldPercentile),
          rank: getStatRank(Math.round(breathHoldPercentile)),
          lastIncreased: now,
        },
        {
          name: 'Regeneration',
          value: Math.round(sleepPercentile),
          rank: getStatRank(Math.round(sleepPercentile)),
          lastIncreased: now,
        },
        {
          name: 'Adherence',
          value: Math.round(dietPercentile),
          rank: getStatRank(Math.round(dietPercentile)),
          lastIncreased: now,
        },
        {
          name: 'Balance',
          value: 72,
          rank: 'B',
          lastIncreased: now,
        },
        {
          name: 'Longevity',
          value: 60,
          rank: 'C',
          lastIncreased: now,
        },
      ],
    },
    {
      name: 'Intelligence',
      value: intelligenceAvg,
      rank: getStatRank(intelligenceAvg),
      lastIncreased: now,
      subStats: [
        {
          name: 'Reason',
          value: Math.round(reasonPercentile),
          rank: getStatRank(Math.round(reasonPercentile)),
          lastIncreased: now,
        },
        {
          name: 'Knowledge',
          value: Math.round(iqPercentile),
          rank: getStatRank(Math.round(iqPercentile)),
          lastIncreased: now,
        },
        {
          name: 'Adaptability',
          value: Math.round(adaptPercentile),
          rank: getStatRank(Math.round(adaptPercentile)),
          lastIncreased: now,
        },
        {
          name: 'Strategy',
          value: Math.round(reasonPercentile),
          rank: getStatRank(Math.round(reasonPercentile)),
          lastIncreased: now,
        },
        {
          name: 'Perception',
          value: 78,
          rank: 'B',
          lastIncreased: now,
        },
      ],
    },
    {
      name: 'Creativity',
      value: creativeAvg,
      rank: getStatRank(creativeAvg),
      lastIncreased: now,
      subStats: [
        {
          name: 'Imagination',
          value: 70,
          rank: 'B',
          lastIncreased: now,
        },
        {
          name: 'Innovation',
          value: 72,
          rank: 'B',
          lastIncreased: now,
        },
        {
          name: 'Style',
          value: 60,
          rank: 'C',
          lastIncreased: now,
        },
        {
          name: 'Expression',
          value: 74,
          rank: 'B',
          lastIncreased: now,
        },
        {
          name: 'Vision',
          value: 78,
          rank: 'B',
          lastIncreased: now,
        },
      ],
    },
    {
      name: 'Spirit',
      value: spiritAvg,
      rank: getStatRank(spiritAvg),
      lastIncreased: now,
      subStats: [
        {
          name: 'Faith',
          value: 55,
          rank: 'D',
          lastIncreased: now,
        },
        {
          name: 'Purpose',
          value: Math.round(purposePercentile),
          rank: getStatRank(Math.round(purposePercentile)),
          lastIncreased: now,
        },
        {
          name: 'Tranquility',
          value: 68,
          rank: 'C',
          lastIncreased: now,
        },
        {
          name: 'Empathy',
          value: Math.round(empathyPercentile),
          rank: getStatRank(Math.round(empathyPercentile)),
          lastIncreased: now,
        },
        {
          name: 'Conviction',
          value: 70,
          rank: 'B',
          lastIncreased: now,
        },
      ],
    },
    {
      name: 'Psyche',
      value: psycheAvg,
      rank: getStatRank(psycheAvg),
      lastIncreased: now,
      subStats: [
        {
          name: 'Resilience',
          value: Math.round(composurePercentile),
          rank: getStatRank(Math.round(composurePercentile)),
          lastIncreased: now,
        },
        {
          name: 'Charisma',
          value: Math.round(charismaPercentile),
          rank: getStatRank(Math.round(charismaPercentile)),
          lastIncreased: now,
        },
        {
          name: 'Focus',
          value: 65,
          rank: 'C',
          lastIncreased: now,
        },
        {
          name: 'Willpower',
          value: Math.round(willpowerPercentile),
          rank: getStatRank(Math.round(willpowerPercentile)),
          lastIncreased: now,
        },
        {
          name: 'Composure',
          value: Math.round(composurePercentile),
          rank: getStatRank(Math.round(composurePercentile)),
          lastIncreased: now,
        },
      ],
    },
  ];
}

// Main function
async function createUserAccount() {
  try {
    // Parse command line arguments
    const args = process.argv.slice(2);
    let email = '';
    let username = '';
    let password = '';
    let interactive = false;

    for (let i = 0; i < args.length; i++) {
      if (args[i] === '--email' && args[i + 1]) {
        email = args[++i];
      } else if (args[i] === '--username' && args[i + 1]) {
        username = args[++i];
      } else if (args[i] === '--password' && args[i + 1]) {
        password = args[++i];
      } else if (args[i] === '--interactive') {
        interactive = true;
      }
    }

    // Use interactive mode if no args or --interactive flag
    if (interactive || (!email && !username && !password)) {
      ({ email, username, password } = await getInteractiveInput());
    } else if (!email || !username || !password) {
      console.error('❌ Missing required arguments. Use --interactive or provide --email, --username, and --password');
      process.exit(1);
    }

    // Validate inputs
    if (!validateEmail(email)) {
      console.error('❌ Invalid email format');
      process.exit(1);
    }
    if (!validateUsername(username)) {
      console.error('❌ Invalid username format');
      process.exit(1);
    }
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      console.error('❌ Password does not meet requirements:');
      passwordValidation.errors.forEach(err => console.error(`   - ${err}`));
      process.exit(1);
    }

    console.log('\n📝 Creating Firebase Auth user...');

    // Create Firebase Auth user
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: username,
      emailVerified: false,
    });

    const uid = userRecord.uid;
    console.log(`✅ Firebase Auth user created: ${uid}`);

    // Generate baseline data
    const baseline = generateDefaultBaseline();

    // Calculate initial stats
    const stats = calculateStatsFromBaseline(baseline);

    // Create user document in userStates collection
    console.log('\n📝 Creating Firestore userStates document...');

    const userStateData = {
      uid,
      email,
      userName: username,
      createdAt: new Date().toISOString(),
      hasOnboarded: true,
      alignment: {
        lawfulChaotic: 0,
        goodEvil: 0,
        profile: 'Unaligned'
      },
      abasProfile: {
        userName: username,
        email,
        codename: `Agent-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        screeningTestSummary: baseline,
      },
      gameState: {
        userName: username,
        hasOnboarded: true,
        xp: 1000,
        rank: {
          name: 'D',
          threatLevel: 'Delta (Emerging)',
          attributeThreshold: 60,
          timeEstimate: 'Phase 2',
          threatDescription: 'Baseline capacity confirmed. Potential pathway unlocked.',
        },
        stats,
        initialStatsSnapshot: stats,
        resonanceSignature: {
          type: 'Unawakened',
          tier: 1,
          harmonic: [],
          discordance: [],
        },
      },
    };

    await db.collection('userStates').doc(uid).set(userStateData);
    console.log(`✅ Firestore userStates document created`);

    // Display results
    console.log('\n✅ Account creation successful!\n');
    console.log('📊 User Details:');
    console.log(`   UID:      ${uid}`);
    console.log(`   Email:    ${email}`);
    console.log(`   Username: ${username}`);
    console.log(`   Codename: ${userStateData.abasProfile.codename}`);
    console.log(`\n📈 Initial Stats Summary:`);
    stats.forEach(stat => {
      console.log(`   ${stat.name}: ${stat.value} (${stat.rank})`);
    });
    console.log(`\n🎮 Ready to play! User can now log in with their email and password.`);
    
    process.exit(0);
  } catch (e: any) {
    console.error('\n❌ Error creating account:', e.message);
    if (e.code === 'auth/email-already-exists') {
      console.error('   This email is already registered.');
    } else if (e.code === 'auth/invalid-email') {
      console.error('   Invalid email format.');
    } else if (e.code === 'auth/weak-password') {
      console.error('   Password is too weak.');
    } else if (e.code === 'auth/too-many-requests') {
      console.error('   Too many requests. Please try again later.');
    }
    process.exit(1);
  }
}

// Run the script
createUserAccount();
