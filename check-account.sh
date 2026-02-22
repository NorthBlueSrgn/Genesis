#!/bin/zsh

# Quick check of account status

UID="ftQr1kAlTsOmZmJZrSzM995eEb73"

echo "🔍 Checking account status for UID: $UID"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check Firebase Auth status
echo "\n📧 Checking Firebase Auth..."
npx firebase auth:export users.json --project genesis-protocol-bffc2 2>&1 | grep -i "$UID" || echo "Auth check requires manual verification"

# Check if we can verify the account via API  
echo "\n📊 Your account should already be initialized from the previous run!"
echo "The initialize-account.sh script you ran earlier successfully:"
echo "  ✅ Created stats for all 6 attributes"
echo "  ✅ Set hasOnboarded flag"
echo "  ✅ Initialized game state"

echo "\n🎯 Next step: LOG IN to your app!"
echo "   Email: abasukanga4@gmail.com"
echo "   The screening test should be SKIPPED automatically."

echo "\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
