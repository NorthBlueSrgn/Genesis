#!/bin/zsh

# Bootstrap Abas Account - Quick Setup
# This calls the bootstrapAbasAccount Cloud Function to seed your account

set -e

echo "🚀 Bootstrapping Genesis Protocol Account..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

BOOTSTRAP_URL="https://bootstrapabasaccount-rsaz7xkotq-uc.a.run.app"

echo "\n📡 Calling bootstrap endpoint..."
echo "URL: $BOOTSTRAP_URL"

RESPONSE=$(curl -sS -X POST "$BOOTSTRAP_URL" \
  -H "Content-Type: application/json" \
  -d '{}')

echo "\n✅ Response:"
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"

if echo "$RESPONSE" | grep -q '"success".*true'; then
  echo "\n🎯 SUCCESS! Account fully bootstrapped with:"
  echo "  ✓ Complete stats (all 6 attributes)"
  echo "  ✓ hasOnboarded: true"
  echo "  ✓ Screening test data"
  echo "  ✓ ABAS profile"
  echo "  ✓ Ready to use!"
  echo "\n🔥 You can now login and skip the screening test!"
else
  echo "\n⚠️  Bootstrap may have failed. Check response above."
  exit 1
fi

echo "\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ Account initialization complete!"
