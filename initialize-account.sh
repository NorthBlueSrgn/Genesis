#!/usr/bin/env bash

# Initialize your stats from your profile export

set -euo pipefail

USER_UID="${USER_UID:-ftQr1kAlTsOmZmJZrSzM995eEb73}"
EMAIL="${EMAIL:-abasukanga4@gmail.com}"
PROFILE_PATH="${PROFILE_PATH:-abas-profile-export.json}"

# Read your profile export
PROFILE=$(cat "$PROFILE_PATH")

echo "Step 1: Importing profile to Firebase (uid=$USER_UID)..."
RESP_1=$(curl -sS "https://importuserprofilefromjson-rsaz7xkotq-uc.a.run.app" \
  -X POST \
  -H "Content-Type: application/json" \
  -d @- <<EOF
{
  "uid": "$USER_UID",
  "email": "$EMAIL",
  "profileData": $PROFILE
}
EOF
)

echo "$RESP_1"

echo -e "\n\nStep 2: Initializing stats from baseline (uid=$USER_UID)..."
RESP_2=$(curl -sS "https://initializestatsfrombaseline-rsaz7xkotq-uc.a.run.app" \
  -X POST \
  -H "Content-Type: application/json" \
  -d "{\"uid\": \"$USER_UID\", \"email\": \"$EMAIL\"}")

echo "$RESP_2"

echo -e "\n\nDone!"
