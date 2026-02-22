# User Account Creation Guide

This guide explains how to create a new Firebase user account with initial stats and Firestore data from the command line.

## Overview

The Genesis Protocol provides two tools to create user accounts:

1. **Node.js Script** (`scripts/create-user.js`) - Recommended, cross-platform
2. **Bash Script** (`create-user.sh`) - Unix/macOS only

Both tools will:
- Create a Firebase Auth user with email, username, and password
- Validate input (email format, username format, password strength)
- Create a corresponding Firestore document in the `userStates` collection
- Initialize game stats based on default baseline data
- Assign a unique agent codename
- Set the user's initial rank to "D" (Delta - Emerging)

## Prerequisites

1. **Firebase Project**: Your `genesis-protocol-bffc2` Firebase project must be set up
2. **Service Account Key**: Download from Firebase Console:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project
   - Go to **Project Settings** > **Service Accounts**
   - Click **Generate New Private Key**
   - Save as `functions/serviceAccountKey.json` in your project root

3. **Node.js**: Installed and available in your PATH
4. **Dependencies**: Run `npm install` in the root directory

## Installation

```bash
# Install dependencies
npm install

# (Optional) For bash script support
chmod +x create-user.sh
chmod +x scripts/create-user.js
```

## Usage

### Option 1: Node.js Script (Recommended)

#### Interactive Mode
```bash
node scripts/create-user.js --interactive
```

You'll be prompted to enter:
- Email address
- Username (3-30 characters, letters, numbers, hyphens, underscores)
- Password (with strength validation)

#### Command Line Arguments
```bash
node scripts/create-user.js --email user@example.com --username MyUser --password Pass123!
```

#### Quick Test
```bash
node scripts/create-user.js --email test@example.com --username TestAgent --password Test123!@
```

### Option 2: Bash Script

#### Interactive Mode
```bash
./create-user.sh --interactive
```

#### Command Line Arguments
```bash
./create-user.sh --email user@example.com --username MyUser --password Pass123!
```

## Password Requirements

Passwords must contain:
- At least 8 characters
- At least 1 uppercase letter (A-Z)
- At least 1 lowercase letter (a-z)
- At least 1 number (0-9)
- At least 1 special character (!@#$%^&*)

### Valid Password Examples
- `MyPassword123!`
- `Genesis@2024Protocol`
- `Agent#SecurePass99`

### Invalid Password Examples
- `password` - No uppercase, number, or special character
- `Password1` - No special character
- `PASS!` - Too short, no lowercase or number
- `Pass1` - Too short, no special character

## Username Requirements

Usernames must be:
- 3-30 characters long
- Contain only letters (a-z, A-Z), numbers (0-9), hyphens (-), or underscores (_)

### Valid Username Examples
- `JohnDoe`
- `Agent_007`
- `test-user123`
- `Alpha1`

### Invalid Username Examples
- `ab` - Too short
- `user@domain` - Contains invalid characters
- `My Name` - Contains space
- `user.name` - Contains period

## Example: Create Your First User

### Interactive Mode
```bash
$ node scripts/create-user.js --interactive

ℹ️  🔐 Firebase User Account Creation

Email address: myuser@example.com
Username (3-30 characters, letters, numbers, - or _): MyAgent
Password (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char): *********

ℹ️  Creating Firebase Auth user...
✅ Firebase Auth user created: dFgHiJkLmNoPqRsTuVwXyZ1A
ℹ️  Calculating initial stats from baseline...
ℹ️  Creating Firestore userStates document...
✅ Firestore userStates document created

✅ Account creation successful!

📊 User Details:
   UID:      dFgHiJkLmNoPqRsTuVwXyZ1A
   Email:    myuser@example.com
   Username: MyAgent
   Codename: Agent-ABC123XYZ

📈 Initial Stats Summary:
   Physical      : 65 (C)
   Vitality      : 72 (B)
   Intelligence  : 90 (A)
   Creativity    : 71 (B)
   Spirit        : 70 (B)
   Psyche        : 65 (C)

🎮 Ready to play! User can now log in with their email and password.
```

### Non-Interactive Mode
```bash
node scripts/create-user.js --email agent@genesis.com --username Agent007 --password Secure#Pass123
```

## What Gets Created

### Firebase Auth User
- Email and password for login
- Display name (username)
- Email verified: false

### Firestore `userStates` Document
The script creates a complete document with:

```json
{
  "uid": "user_id",
  "email": "user@example.com",
  "userName": "Username",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "hasOnboarded": true,
  "alignment": {
    "lawfulChaotic": 0,
    "goodEvil": 0,
    "profile": "Unaligned"
  },
  "abasProfile": {
    "userName": "Username",
    "email": "user@example.com",
    "codename": "Agent-ABC123DEF",
    "screeningTestSummary": {
      "physicalBaseline": {...},
      "cognitiveBaseline": {...},
      "vitalityBaseline": {...},
      "psychosocialBaseline": {...}
    }
  },
  "gameState": {
    "userName": "Username",
    "hasOnboarded": true,
    "xp": 1000,
    "rank": {
      "name": "D",
      "threatLevel": "Delta (Emerging)",
      "attributeThreshold": 60,
      "timeEstimate": "Phase 2",
      "threatDescription": "Baseline capacity confirmed. Potential pathway unlocked."
    },
    "stats": [
      {
        "name": "Physical",
        "value": 65,
        "rank": "C",
        "lastIncreased": "2024-01-15T10:30:00.000Z",
        "subStats": [...]
      },
      ...
    ],
    "initialStatsSnapshot": [...],
    "resonanceSignature": {
      "type": "Unawakened",
      "tier": 1,
      "harmonic": [],
      "discordance": []
    }
  }
}
```

## 🎮 Important: Onboarding Skip

When you create a user account using these scripts, **the account is automatically set to skip the onboarding flow**. This is because:

- ✅ All baseline data is pre-filled (physical, cognitive, vitality, psychosocial)
- ✅ Initial stats are calculated from the baseline immediately
- ✅ The dossier is marked as complete (`hasOnboarded: true`)
- ✅ The user goes directly to the dashboard after login

**This means users won't see the screening test or any onboarding prompts.** They'll have a fully initialized account ready to use immediately upon login.

If you need to modify this behavior for specific users (e.g., to force them through onboarding), you can manually set `hasOnboarded: false` in the Firestore document.

## Troubleshooting

### Error: "Service account key not found"
**Solution**: Download your service account key from Firebase Console and save it to `functions/serviceAccountKey.json`

### Error: "email-already-exists"
**Solution**: The email is already registered. Use a different email address.

### Error: "weak-password"
**Solution**: Your password doesn't meet the strength requirements. Use a stronger password with uppercase, lowercase, numbers, and special characters.

### Error: "too-many-requests"
**Solution**: You've made too many requests to Firebase Auth. Wait a few minutes and try again.

### Error: "Invalid email format"
**Solution**: Enter a valid email address (e.g., user@example.com)

### Error: "Invalid username"
**Solution**: Username must be 3-30 characters using only letters, numbers, hyphens, or underscores.

### The script hangs or doesn't respond
**Solution**: 
- Ensure your `functions/serviceAccountKey.json` file is valid and has the correct permissions
- Check that your Firebase project is accessible and functional
- Verify your internet connection

## Advanced Usage

### Creating Multiple Users

```bash
# User 1
node scripts/create-user.js --email agent1@example.com --username Agent1 --password Pass123!@

# User 2
node scripts/create-user.js --email agent2@example.com --username Agent2 --password Pass123!@

# User 3
node scripts/create-user.js --email agent3@example.com --username Agent3 --password Pass123!@
```

### Integration with CI/CD

```bash
#!/bin/bash
# In your CI/CD pipeline
node scripts/create-user.js \
  --email "$TEST_USER_EMAIL" \
  --username "$TEST_USER_NAME" \
  --password "$TEST_USER_PASSWORD"
```

### Batch Creation with External Data

```bash
# Create a CSV file: users.csv
# email,username,password
# user1@example.com,User1,Pass123!@
# user2@example.com,User2,Pass456!@

# Create users from CSV
while IFS=',' read -r email username password; do
  node scripts/create-user.js --email "$email" --username "$username" --password "$password"
done < users.csv
```

## Initial Game State

Every new user starts with:

| Stat | Value | Rank | Description |
|------|-------|------|-------------|
| Physical | 65 | C | Standard baseline strength and speed |
| Vitality | 72 | B | Above average stamina and health |
| Intelligence | 90 | A | Exceptional cognitive ability |
| Creativity | 71 | B | Strong creative potential |
| Spirit | 70 | B | Solid purpose and empathy |
| Psyche | 65 | C | Standard resilience and focus |

**Rank**: D (Delta - Emerging)
**XP**: 1,000
**Codename**: Auto-generated Agent codename
**Resonance Type**: Unawakened
**Alignment**: Unaligned (Neutral on all axes)

## Next Steps

After creating a user account:

1. **Launch the web app** and have the user log in with their email and password
2. **Complete onboarding** to set alignment preferences and resonance type
3. **Take screening tests** to calibrate baseline stats
4. **Begin missions** and start accumulating XP
5. **Unlock resonance abilities** as they progress

## Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review your Firebase project settings and permissions
3. Ensure your service account key has the correct scope (Firestore, Auth, Admin)
4. Check the browser console and Firebase debug logs for detailed errors

## Additional Resources

- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Cloud Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Genesis Protocol Documentation](./README.md)
- [API Configuration Guide](./CHAPTER_BLACK_AI_INTEGRATION.md)
