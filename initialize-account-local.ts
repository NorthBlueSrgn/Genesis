import * as admin from 'firebase-admin';
import * as fs from 'fs';

// Initialize Firebase Admin
const serviceAccount = JSON.parse(
  fs.readFileSync('./functions/serviceAccountKey.json', 'utf8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'genesis-protocol-bffc2'
});

const db = admin.firestore();

async function initializeAccount() {
  try {
    // Read your profile export
    const profileExport = JSON.parse(
      fs.readFileSync('./abas-profile-export.json', 'utf8')
    );

    const uid = 'bdZaaACPPcVUG2yoe11Wss2ZwNk1';
    const email = 'abasukanga4@gmail.com';

    console.log('Writing profile to Firebase...');
    await db.collection('users').doc(uid).set(profileExport, { merge: true });

    console.log('✅ Profile written!');
    console.log('Now initializing stats from baseline...\n');

    // Get the baseline data
    const baseline = profileExport.abasProfile.screeningTestSummary;

    // Calculate stats (same logic as the function)
    const benchPressPercentile = Math.min((85 / 100) * 85, 100);
    const squatPercentile = Math.min((110 / 140) * 85, 100);
    const deadliftPercentile = Math.min((150 / 180) * 85, 100);
    const speedPercentile = Math.min(((13.8 - 13.6) / 13.8) * 90, 100);
    
    const strengthAvg = Math.round((benchPressPercentile + squatPercentile + deadliftPercentile) / 3);
    const physicalAvg = Math.round(strengthAvg * 0.6 + speedPercentile * 0.4);

    const vitalityAvg = Math.round((82 + 65 + 70) / 3);
    
    const iqPercentile = Math.min((120 / 160) * 100, 100);
    const intelligenceAvg = Math.round((iqPercentile + 86 + 85 + 86) / 4);
    
    const creativeAvg = Math.round((70 + 72 + 60 + 74 + 78) / 5);
    
    const spiritAvg = Math.round((85 + 80 + 55 + 70) / 4);
    
    const psycheAvg = Math.round((75 + 58 + 65 + 50) / 4);

    console.log('Calculated Stats:');
    console.log(`  Physical: ${physicalAvg}`);
    console.log(`  Vitality: ${vitalityAvg}`);
    console.log(`  Intelligence: ${intelligenceAvg}`);
    console.log(`  Creativity: ${creativeAvg}`);
    console.log(`  Spirit: ${spiritAvg}`);
    console.log(`  Psyche: ${psycheAvg}`);

    console.log('\n✅ Stats initialized successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

initializeAccount();
