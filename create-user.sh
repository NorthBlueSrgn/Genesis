#!/bin/bash

#
# CREATE FIREBASE USER ACCOUNT
# 
# This script creates a Firebase Auth user and initializes corresponding Firestore documents.
# It supports both interactive and non-interactive modes.
#
# Usage:
#   ./create-user.sh [--interactive] [--email EMAIL --username USERNAME --password PASSWORD]
#
# Examples:
#   ./create-user.sh --interactive
#   ./create-user.sh --email user@example.com --username MyUser --password Pass123!
#

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID="genesis-protocol-bffc2"
SERVICE_ACCOUNT_KEY="./functions/serviceAccountKey.json"

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Function to validate email
validate_email() {
    local email=$1
    if [[ "$email" =~ ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ ]]; then
        return 0
    else
        return 1
    fi
}

# Function to validate username
validate_username() {
    local username=$1
    if [[ "$username" =~ ^[a-zA-Z0-9_-]{3,30}$ ]]; then
        return 0
    else
        return 1
    fi
}

# Function to validate password
validate_password() {
    local password=$1
    if [[ ${#password} -lt 8 ]]; then
        print_error "Password must be at least 8 characters long"
        return 1
    fi
    if [[ ! "$password" =~ [A-Z] ]]; then
        print_error "Password must contain at least one uppercase letter"
        return 1
    fi
    if [[ ! "$password" =~ [a-z] ]]; then
        print_error "Password must contain at least one lowercase letter"
        return 1
    fi
    if [[ ! "$password" =~ [0-9] ]]; then
        print_error "Password must contain at least one number"
        return 1
    fi
    if [[ ! "$password" =~ [!@#$%^&*] ]]; then
        print_error "Password must contain at least one special character (!@#\$%^&*)"
        return 1
    fi
    return 0
}

# Function to prompt for input
read_input() {
    local prompt=$1
    local var_name=$2
    read -p "$prompt: " -r input
    eval "$var_name='$input'"
}

# Function to prompt securely (hidden input)
read_secure() {
    local prompt=$1
    local var_name=$2
    read -sp "$prompt: " -r input
    echo
    eval "$var_name='$input'"
}

# Check if service account key exists
if [[ ! -f "$SERVICE_ACCOUNT_KEY" ]]; then
    print_error "Service account key not found at $SERVICE_ACCOUNT_KEY"
    print_info "Please download it from Firebase Console > Project Settings > Service Accounts"
    exit 1
fi

# Parse command line arguments
INTERACTIVE=false
EMAIL=""
USERNAME=""
PASSWORD=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --interactive)
            INTERACTIVE=true
            shift
            ;;
        --email)
            EMAIL="$2"
            shift 2
            ;;
        --username)
            USERNAME="$2"
            shift 2
            ;;
        --password)
            PASSWORD="$2"
            shift 2
            ;;
        *)
            print_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# If no arguments or interactive flag, use interactive mode
if [[ -z "$EMAIL" ]] || [[ -z "$USERNAME" ]] || [[ -z "$PASSWORD" ]]; then
    INTERACTIVE=true
fi

# Get user input
if [[ "$INTERACTIVE" == true ]]; then
    echo
    print_info "🔐 Firebase User Account Creation"
    echo
    
    while [[ -z "$EMAIL" ]] || ! validate_email "$EMAIL"; do
        read_input "Email address" EMAIL
        if ! validate_email "$EMAIL"; then
            print_error "Invalid email format. Please try again."
            EMAIL=""
        fi
    done
    
    while [[ -z "$USERNAME" ]] || ! validate_username "$USERNAME"; do
        read_input "Username (3-30 characters, letters, numbers, - or _)" USERNAME
        if ! validate_username "$USERNAME"; then
            print_error "Invalid username. Must be 3-30 characters using letters, numbers, hyphens, or underscores."
            USERNAME=""
        fi
    done
    
    while [[ -z "$PASSWORD" ]]; do
        read_secure "Password (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char)" PASSWORD
        if ! validate_password "$PASSWORD"; then
            PASSWORD=""
        fi
    done
else
    # Validate provided inputs
    if ! validate_email "$EMAIL"; then
        print_error "Invalid email format"
        exit 1
    fi
    if ! validate_username "$USERNAME"; then
        print_error "Invalid username format"
        exit 1
    fi
    if ! validate_password "$PASSWORD"; then
        exit 1
    fi
fi

echo
print_info "Creating Firebase Auth user..."

# Use Node.js/TypeScript script to create the account
# First, we need to set up the environment
cat > /tmp/create_account_temp.ts << 'EOF'
import * as admin from 'firebase-admin';
import * as fs from 'fs';

const EMAIL = process.env.USER_EMAIL || '';
const USERNAME = process.env.USER_USERNAME || '';
const PASSWORD = process.env.USER_PASSWORD || '';
const PROJECT_ID = process.env.PROJECT_ID || 'genesis-protocol-bffc2';

async function main() {
  try {
    const serviceAccountPath = process.env.SERVICE_ACCOUNT_PATH || './functions/serviceAccountKey.json';
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: PROJECT_ID
    });

    const auth = admin.auth();
    const db = admin.firestore();

    // Create Auth user
    const userRecord = await auth.createUser({
      email: EMAIL,
      password: PASSWORD,
      displayName: USERNAME,
      emailVerified: false,
    });

    const uid = userRecord.uid;
    console.log(`uid:${uid}`);

    // Generate default baseline
    const baseline = {
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

    // Create Firestore document
    const now = new Date().toISOString();
    const userStateData = {
      uid,
      email: EMAIL,
      userName: USERNAME,
      createdAt: now,
      hasOnboarded: true,
      alignment: {
        lawfulChaotic: 0,
        goodEvil: 0,
        profile: 'Unaligned'
      },
      abasProfile: {
        userName: USERNAME,
        email: EMAIL,
        codename: `Agent-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        screeningTestSummary: baseline,
      },
      gameState: {
        userName: USERNAME,
        hasOnboarded: true,
        xp: 1000,
        rank: {
          name: 'D',
          threatLevel: 'Delta (Emerging)',
          attributeThreshold: 60,
          timeEstimate: 'Phase 2',
          threatDescription: 'Baseline capacity confirmed. Potential pathway unlocked.',
        },
        resonanceSignature: {
          type: 'Unawakened',
          tier: 1,
          harmonic: [],
          discordance: [],
        },
      },
    };

    await db.collection('userStates').doc(uid).set(userStateData);
    console.log(`created:success`);
    process.exit(0);
  } catch (error: any) {
    console.log(`error:${error.message}`);
    process.exit(1);
  }
}

main();
EOF

# Run the TypeScript script with ts-node
export USER_EMAIL="$EMAIL"
export USER_USERNAME="$USERNAME"
export USER_PASSWORD="$PASSWORD"
export PROJECT_ID="$PROJECT_ID"
export SERVICE_ACCOUNT_PATH="$SERVICE_ACCOUNT_KEY"

# Try to find ts-node
if command -v npx &> /dev/null; then
    # Try npx first
    if OUTPUT=$(cd functions && npx ts-node ../`/tmp/create_account_temp.ts 2>&1); then
        UID=$(echo "$OUTPUT" | grep "^uid:" | cut -d: -f2)
        RESULT=$(echo "$OUTPUT" | grep "^created:" | cut -d: -f2)
        
        if [[ "$RESULT" == "success" ]]; then
            print_success "Firebase Auth user created"
            print_success "Firestore userStates document created"
            echo
            print_info "🎮 Account Creation Successful!"
            echo
            print_info "User Details:"
            echo "   UID:      $UID"
            echo "   Email:    $EMAIL"
            echo "   Username: $USERNAME"
            echo
            print_info "Ready to play! User can now log in with their email and password."
            rm /tmp/create_account_temp.ts
            exit 0
        else
            ERROR=$(echo "$OUTPUT" | grep "^error:" | cut -d: -f2-)
            print_error "Failed to create account: $ERROR"
            rm /tmp/create_account_temp.ts
            exit 1
        fi
    else
        print_error "Failed to run setup script"
        echo "$OUTPUT"
        rm /tmp/create_account_temp.ts
        exit 1
    fi
else
    print_error "npx command not found. Please ensure Node.js is installed."
    exit 1
fi
