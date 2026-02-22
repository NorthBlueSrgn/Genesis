/**
 * Verify Game State Setup
 * This script checks if your game state has been properly initialized in Firestore
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin
const serviceAccountPath = path.join(__dirname, 'genesis-protocol-firebase-adminsdk.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ ERROR: Service account key file not found!');
  console.error('Expected location:', serviceAccountPath);
  console.error('\nPlease download your Firebase Admin SDK key first.');
  console.error('See FORCE_INITIALIZE_SETUP.md for instructions.');
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Your user ID
const USER_ID = 'bKGGHbe6Szdo0oSx3OOVrDFhUmq1';

async function verifyGameState() {
  try {
    console.log('🔍 Verifying game state setup...\n');
    console.log(`User ID: ${USER_ID}\n`);

    const userRef = db.collection('users').doc(USER_ID);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      console.error('❌ ERROR: User not found in Firestore!');
      process.exit(1);
    }

    const userData = userDoc.data();
    console.log('✅ User found in database\n');

    // Check for authentication data
    console.log('📧 Authentication Data:');
    console.log(`  Email: ${userData.email || '❌ Missing'}`);
    console.log(`  Username: ${userData.username || '❌ Missing'}`);
    console.log(`  Display Name: ${userData.displayName || '❌ Missing'}`);
    console.log(`  Created: ${userData.createdAt ? new Date(userData.createdAt.seconds * 1000).toLocaleString() : '❌ Missing'}\n`);

    // Check for game state data
    let allGood = true;

    console.log('🎮 Game State Data:');
    
    // Check stats
    if (userData.stats) {
      console.log('  ✅ Stats found');
      const stats = userData.stats;
      const expectedStats = ['IP', 'LE', 'FP', 'KA', 'WM', 'PS', 'TC', 'AT'];
      
      console.log('\n  📊 Individual Stats:');
      expectedStats.forEach(stat => {
        if (stats[stat]) {
          const value = stats[stat].value || '?';
          const rank = stats[stat].rank || '?';
          const statusIcon = rank !== 'E' && value > 0 ? '✅' : '⚠️';
          console.log(`    ${statusIcon} ${stat}: ${value} (Rank: ${rank})`);
          if (rank === 'E' || value === 0) allGood = false;
        } else {
          console.log(`    ❌ ${stat}: Missing`);
          allGood = false;
        }
      });

      if (stats.overallRank) {
        console.log(`\n  📈 Overall Rank: ${stats.overallRank}`);
      } else {
        console.log(`\n  ❌ Overall Rank: Missing`);
        allGood = false;
      }
    } else {
      console.log('  ❌ Stats missing');
      allGood = false;
    }

    console.log('');

    // Check calibration analysis
    if (userData.calibrationAnalysis) {
      console.log('  ✅ Calibration Analysis found');
      const cal = userData.calibrationAnalysis;
      
      console.log(`    - Codename: ${cal.codename || '❌ Missing'}`);
      console.log(`    - Talent Class: ${cal.talentClass || '❌ Missing'}`);
      console.log(`    - Obsession Level: ${cal.obsessionLevel || '❌ Missing'}`);
      console.log(`    - Rarity: ${cal.rarity || '❌ Missing'}`);
      console.log(`    - MBTI Profile: ${cal.mbtiProfile || '❌ Missing'}`);
      console.log(`    - Success Probability: ${cal.successProbability !== undefined ? cal.successProbability + '%' : '❌ Missing'}`);
    } else {
      console.log('  ❌ Calibration Analysis missing');
      allGood = false;
    }

    console.log('');

    // Check onboarding status
    if (userData.onboardingComplete !== undefined) {
      console.log(`  ${userData.onboardingComplete ? '✅' : '⚠️'} Onboarding Complete: ${userData.onboardingComplete}`);
    } else {
      console.log('  ⚠️ Onboarding Complete: Not set');
    }

    console.log('\n' + '='.repeat(60) + '\n');

    // Final verdict
    if (allGood) {
      console.log('🎉 SUCCESS! Game state is properly initialized!\n');
      console.log('✅ All stats are set correctly');
      console.log('✅ Calibration report is complete');
      console.log('✅ Dossier should display correctly\n');
      console.log('🎯 Next Steps:');
      console.log('  1. Clear your browser cache (Cmd+Shift+Delete)');
      console.log('  2. Or use Incognito mode');
      console.log('  3. Log in to see your stats and Classified Dossier\n');
    } else {
      console.log('⚠️ WARNING: Game state is incomplete or incorrect!\n');
      console.log('🔧 Recommended Action:');
      console.log('  Run: node force-initialize-game-state.js\n');
      console.log('This will fix any missing or incorrect data.\n');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  }
}

// Run the verification
verifyGameState();
