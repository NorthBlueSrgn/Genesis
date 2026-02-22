#!/bin/bash
# Quick initialization script

UID="bdZaaACPPcVUG2yoe11Wss2ZwNk1"
EMAIL="abasukanga4@gmail.com"

echo "Initializing your Genesis Protocol account..."
echo "UID: $UID"
echo "Email: $EMAIL"
echo ""

# First: Import your profile to Firebase
echo "Step 1: Importing profile to Firebase Firestore..."
firebase firestore:import --import-path /Users/sylviaukanga/Desktop/Genesis-Protocol/abas-profile-export.json 2>/dev/null || echo "Note: Direct import may require manual setup"

echo ""
echo "Step 2: Calling stat initialization function..."
curl -s "https://initializestatsfrombaseline-rsaz7xkotq-uc.a.run.app" \
  -X POST \
  -H "Content-Type: application/json" \
  -d "{\"uid\": \"$UID\", \"email\": \"$EMAIL\"}" | jq .

echo ""
echo "✅ Done!"
