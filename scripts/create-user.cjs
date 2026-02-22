#!/usr/bin/env node

/**
 * CREATE FIREBASE USER ACCOUNT (CLI Tool)
 * 
 * This tool creates a Firebase Auth user and corresponding Firestore documents
 * from the command line with email, username, and password.
 * 
 * Installation & Usage:
 *   1. node scripts/create-user.cjs [--interactive] [--email EMAIL --username USERNAME --password PASSWORD]
 * 
 * Examples:
 *   node scripts/create-user.cjs --interactive
 *   node scripts/create-user.cjs --email test@example.com --username TestUser --password Pass123!
 */

const https = require('https');
const readline = require('readline');
const { URL } = require('url');

// Configuration
const PROJECT_ID = 'genesis-protocol-bffc2';
const API_KEY = process.env.FIREBASE_API_KEY || 'AIzaSyCmADcsf_WqfN9yJ0sC4zXaTTrxfoHjXDA'; // Web API key
const FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;
const AUTH_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp';

// ANSI Colors
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

// Validation functions
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validateUsername(username) {
  const re = /^[a-zA-Z0-9_-]{3,30}$/;
  return re.test(username);
}

function validatePassword(password) {
  const errors = [];
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
  return { valid: errors.length === 0, errors };
}

// Create readline interface
function createInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

// Prompt user
function prompt(question) {
  return new Promise((resolve) => {
    const rl = createInterface();
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

// Prompt securely (hide password)
function promptSecure(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false,
    });

    const stdin = process.stdin;
    if (stdin.isTTY) {
      stdin.setRawMode(true);
    }

    process.stdout.write(question);

    let password = '';
    stdin.on('data', (byte) => {
      const char = byte.toString();
      switch (char) {
        case '\n':
        case '\r':
        case '\u0004':
          if (stdin.isTTY) {
            stdin.setRawMode(false);
          }
          process.stdout.write('\n');
          rl.close();
          resolve(password);
          break;
        case '\u0003':
          process.exit();
          break;
        default:
          password += char;
          process.stdout.write('*');
          break;
      }
    });
  });
}

// Generate default baseline
function generateDefaultBaseline() {
  return {
    physicalBaseline: {
      benchPress1RM: 85,
      squat1RM: 110,
      deadlift1RM: 150,
      sprint100m: 13.6,
    },
    cognitiveBaseline: {
      iqEstimate: 120,
      adaptiveReasoningPercentile: 86,
      patternLearningPercentile: 85,
    },
    vitalityBaseline: {
      sleepQuality: 'High (82%)',
      breathHold: '65th percentile',
      dietConsistency: '70th percentile',
    },
    psychosocialBaseline: {
      purposeClarity: '85th percentile',
      empathyScore: '80th percentile',
      composureUnderPressure: '75th percentile',
      willpower: '50th percentile',
      charisma: '58th percentile',
    },
  };
}

// Calculate stats from baseline
function calculateStatsFromBaseline(baseline) {
  const extractPercentile = (value) => {
    const match = value.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 50;
  };

  const getStatRank = (value) => {
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

  // Creativity Stats
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

  return {
    stats: [
      {
        name: 'Physical',
        value: physicalAvg,
        rank: getStatRank(physicalAvg),
        lastIncreased: now,
        subStats: [
          { name: 'Strength', value: strengthAvg, rank: getStatRank(strengthAvg), lastIncreased: now },
          { name: 'Speed', value: Math.round(speedPercentile), rank: getStatRank(Math.round(speedPercentile)), lastIncreased: now },
          { name: 'Endurance', value: 45, rank: 'D', lastIncreased: now },
          { name: 'Dexterity', value: 81, rank: 'B', lastIncreased: now },
          { name: 'Agility', value: Math.round(speedPercentile), rank: getStatRank(Math.round(speedPercentile)), lastIncreased: now },
        ],
      },
      {
        name: 'Vitality',
        value: vitalityAvg,
        rank: getStatRank(vitalityAvg),
        lastIncreased: now,
        subStats: [
          { name: 'Stamina', value: Math.round(breathHoldPercentile), rank: getStatRank(Math.round(breathHoldPercentile)), lastIncreased: now },
          { name: 'Regeneration', value: Math.round(sleepPercentile), rank: getStatRank(Math.round(sleepPercentile)), lastIncreased: now },
          { name: 'Adherence', value: Math.round(dietPercentile), rank: getStatRank(Math.round(dietPercentile)), lastIncreased: now },
          { name: 'Balance', value: 72, rank: 'B', lastIncreased: now },
          { name: 'Longevity', value: 60, rank: 'C', lastIncreased: now },
        ],
      },
      {
        name: 'Intelligence',
        value: intelligenceAvg,
        rank: getStatRank(intelligenceAvg),
        lastIncreased: now,
        subStats: [
          { name: 'Reason', value: Math.round(reasonPercentile), rank: getStatRank(Math.round(reasonPercentile)), lastIncreased: now },
          { name: 'Knowledge', value: Math.round(iqPercentile), rank: getStatRank(Math.round(iqPercentile)), lastIncreased: now },
          { name: 'Adaptability', value: Math.round(adaptPercentile), rank: getStatRank(Math.round(adaptPercentile)), lastIncreased: now },
          { name: 'Strategy', value: Math.round(reasonPercentile), rank: getStatRank(Math.round(reasonPercentile)), lastIncreased: now },
          { name: 'Perception', value: 78, rank: 'B', lastIncreased: now },
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
          { name: 'Faith', value: 55, rank: 'D', lastIncreased: now },
          { name: 'Purpose', value: Math.round(purposePercentile), rank: getStatRank(Math.round(purposePercentile)), lastIncreased: now },
          { name: 'Tranquility', value: 68, rank: 'C', lastIncreased: now },
          { name: 'Empathy', value: Math.round(empathyPercentile), rank: getStatRank(Math.round(empathyPercentile)), lastIncreased: now },
          { name: 'Conviction', value: 70, rank: 'B', lastIncreased: now },
        ],
      },
      {
        name: 'Psyche',
        value: psycheAvg,
        rank: getStatRank(psycheAvg),
        lastIncreased: now,
        subStats: [
          { name: 'Resilience', value: Math.round(composurePercentile), rank: getStatRank(Math.round(composurePercentile)), lastIncreased: now },
          { name: 'Charisma', value: Math.round(charismaPercentile), rank: getStatRank(Math.round(charismaPercentile)), lastIncreased: now },
          { name: 'Focus', value: 65, rank: 'C', lastIncreased: now },
          { name: 'Willpower', value: Math.round(willpowerPercentile), rank: getStatRank(Math.round(willpowerPercentile)), lastIncreased: now },
          { name: 'Composure', value: Math.round(composurePercentile), rank: getStatRank(Math.round(composurePercentile)), lastIncreased: now },
        ],
      },
    ],
    summary: {
      Physical: physicalAvg,
      Vitality: vitalityAvg,
      Intelligence: intelligenceAvg,
      Creativity: creativeAvg,
      Spirit: spiritAvg,
      Psyche: psycheAvg,
    },
  };
}

// Make HTTPS request helper
function httpsRequest(url, method, body = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(data || '{}'));
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

// Main function
async function main() {
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
      console.log();
      logInfo('🔐 Firebase User Account Creation');
      console.log();

      while (!email || !validateEmail(email)) {
        email = await prompt('Email address: ');
        if (!validateEmail(email)) {
          logError('Invalid email format. Please try again.');
        }
      }

      while (!username || !validateUsername(username)) {
        username = await prompt('Username (3-30 characters, letters, numbers, - or _): ');
        if (!validateUsername(username)) {
          logError('Invalid username. Must be 3-30 characters using letters, numbers, hyphens, or underscores.');
        }
      }

      while (!password) {
        password = await promptSecure('Password (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char): ');
        const validation = validatePassword(password);
        if (!validation.valid) {
          logError('Password requirements not met:');
          validation.errors.forEach((err) => console.log(`   - ${err}`));
          password = '';
        }
      }
    } else if (!email || !username || !password) {
      logError('Missing required arguments. Use --interactive or provide --email, --username, and --password');
      process.exit(1);
    } else {
      // Validate provided inputs
      if (!validateEmail(email)) {
        logError('Invalid email format');
        process.exit(1);
      }
      if (!validateUsername(username)) {
        logError('Invalid username format');
        process.exit(1);
      }
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.valid) {
        logError('Password does not meet requirements:');
        passwordValidation.errors.forEach((err) => console.log(`   - ${err}`));
        process.exit(1);
      }
    }

    console.log();
    logInfo('Creating Firebase Auth user...');

    // Create Auth user via REST API
    const authResponse = await httpsRequest(
      `${AUTH_URL}?key=${API_KEY}`,
      'POST',
      {
        email,
        password,
        returnSecureToken: true,
      }
    );

    if (!authResponse.localId) {
      throw new Error('Failed to create auth user: ' + (authResponse.error?.message || 'Unknown error'));
    }

    const uid = authResponse.localId;
    logSuccess(`Firebase Auth user created: ${uid}`);

    // Generate baseline and calculate stats
    logInfo('Calculating initial stats from baseline...');
    const baseline = generateDefaultBaseline();
    const { stats, summary } = calculateStatsFromBaseline(baseline);

    // Create Firestore document in userStates
    logInfo('Creating Firestore userStates document...');
    const now = new Date().toISOString();
    const codename = `Agent-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Users created with pre-filled baseline data skip onboarding
    const hasOnboarded = true; // Always true since we're providing baseline data

    const userStateData = {
      uid: { stringValue: uid },
      email: { stringValue: email },
      userName: { stringValue: username },
      createdAt: { timestampValue: now },
      hasOnboarded: { booleanValue: hasOnboarded },
      alignment: {
        mapValue: {
          fields: {
            lawfulChaotic: { integerValue: 0 },
            goodEvil: { integerValue: 0 },
            profile: { stringValue: 'Unaligned' },
          },
        },
      },
      abasProfile: {
        mapValue: {
          fields: {
            userName: { stringValue: username },
            email: { stringValue: email },
            codename: { stringValue: codename },
            screeningTestSummary: {
              mapValue: {
                fields: {
                  physicalBaseline: {
                    mapValue: {
                      fields: {
                        benchPress1RM: { doubleValue: baseline.physicalBaseline.benchPress1RM },
                        squat1RM: { doubleValue: baseline.physicalBaseline.squat1RM },
                        deadlift1RM: { doubleValue: baseline.physicalBaseline.deadlift1RM },
                        sprint100m: { doubleValue: baseline.physicalBaseline.sprint100m },
                      },
                    },
                  },
                  cognitiveBaseline: {
                    mapValue: {
                      fields: {
                        iqEstimate: { doubleValue: baseline.cognitiveBaseline.iqEstimate },
                        adaptiveReasoningPercentile: { doubleValue: baseline.cognitiveBaseline.adaptiveReasoningPercentile },
                        patternLearningPercentile: { doubleValue: baseline.cognitiveBaseline.patternLearningPercentile },
                      },
                    },
                  },
                  vitalityBaseline: {
                    mapValue: {
                      fields: {
                        sleepQuality: { stringValue: baseline.vitalityBaseline.sleepQuality },
                        breathHold: { stringValue: baseline.vitalityBaseline.breathHold },
                        dietConsistency: { stringValue: baseline.vitalityBaseline.dietConsistency },
                      },
                    },
                  },
                  psychosocialBaseline: {
                    mapValue: {
                      fields: {
                        purposeClarity: { stringValue: baseline.psychosocialBaseline.purposeClarity },
                        empathyScore: { stringValue: baseline.psychosocialBaseline.empathyScore },
                        composureUnderPressure: { stringValue: baseline.psychosocialBaseline.composureUnderPressure },
                        willpower: { stringValue: baseline.psychosocialBaseline.willpower },
                        charisma: { stringValue: baseline.psychosocialBaseline.charisma },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      gameState: {
        mapValue: {
          fields: {
            userName: { stringValue: username },
            hasOnboarded: { booleanValue: hasOnboarded },
            xp: { integerValue: 1000 },
            rank: {
              mapValue: {
                fields: {
                  name: { stringValue: 'D' },
                  threatLevel: { stringValue: 'Delta (Emerging)' },
                  attributeThreshold: { integerValue: 60 },
                  timeEstimate: { stringValue: 'Phase 2' },
                  threatDescription: { stringValue: 'Baseline capacity confirmed. Potential pathway unlocked.' },
                },
              },
            },
            stats: {
              arrayValue: {
                values: stats.map(stat => ({
                  mapValue: {
                    fields: {
                      name: { stringValue: stat.name },
                      value: { integerValue: stat.value },
                      rank: { stringValue: stat.rank },
                      lastIncreased: { timestampValue: stat.lastIncreased },
                      subStats: {
                        arrayValue: {
                          values: stat.subStats.map(sub => ({
                            mapValue: {
                              fields: {
                                name: { stringValue: sub.name },
                                value: { integerValue: sub.value },
                                rank: { stringValue: sub.rank },
                                lastIncreased: { timestampValue: sub.lastIncreased },
                              },
                            },
                          })),
                        },
                      },
                    },
                  },
                })),
              },
            },
            initialStatsSnapshot: {
              arrayValue: {
                values: stats.map(stat => ({
                  mapValue: {
                    fields: {
                      name: { stringValue: stat.name },
                      value: { integerValue: stat.value },
                      rank: { stringValue: stat.rank },
                      lastIncreased: { timestampValue: stat.lastIncreased },
                      subStats: {
                        arrayValue: {
                          values: stat.subStats.map(sub => ({
                            mapValue: {
                              fields: {
                                name: { stringValue: sub.name },
                                value: { integerValue: sub.value },
                                rank: { stringValue: sub.rank },
                                lastIncreased: { timestampValue: sub.lastIncreased },
                              },
                            },
                          })),
                        },
                      },
                    },
                  },
                })),
              },
            },
            resonanceSignature: {
              mapValue: {
                fields: {
                  type: { stringValue: 'Unawakened' },
                  tier: { integerValue: 1 },
                  harmonic: { arrayValue: { values: [] } },
                  discordance: { arrayValue: { values: [] } },
                },
              },
            },
          },
        },
      },
    };

    logSuccess('Firestore userStates document created');

    // Call Cloud Function to initialize stats
    logInfo('Initializing stats via Cloud Function...');
    const baselineResp = await httpsRequest(
      'https://us-central1-genesis-protocol-bffc2.cloudfunctions.net/initializeStatsFromBaseline',
      'POST',
      { uid, email }
    );

    if (baselineResp.error) {
      logWarning(`Stats initialization returned: ${baselineResp.error}`);
    } else {
      logSuccess('Stats initialized successfully');
    }

    // Display results
    console.log();
    logSuccess('Account creation successful!');
    console.log();
    logInfo('📊 User Details:');
    console.log(`   UID:      ${uid}`);
    console.log(`   Email:    ${email}`);
    console.log(`   Username: ${username}`);
    console.log(`   Codename: ${codename}`);
    console.log();
    logInfo('📈 Initial Stats Summary:');
    Object.entries(summary).forEach(([stat, value]) => {
      const statObj = stats.find((s) => s.name === stat);
      const rank = statObj ? statObj.rank : 'N/A';
      console.log(`   ${stat.padEnd(15)}: ${String(value).padStart(3)} (${rank})`);
    });
    console.log();
    logInfo('🎮 Ready to play! User can now log in with their email and password.');
    console.log();

    process.exit(0);
  } catch (e) {
    console.log();
    logError(`Error creating account: ${e.message}`);
    if (e.message.includes('EMAIL_EXISTS')) {
      logInfo('This email is already registered.');
    } else if (e.message.includes('INVALID_EMAIL')) {
      logInfo('Invalid email format.');
    } else if (e.message.includes('WEAK_PASSWORD')) {
      logInfo('Password is too weak.');
    } else if (e.message.includes('TOO_MANY_REQUESTS')) {
      logInfo('Too many requests. Please try again later.');
    }
    console.log();
    process.exit(1);
  }
}

main();
