#!/bin/bash

# Genesis Protocol - Game State Setup Script
# This script will guide you through the entire setup process

set -e  # Exit on error

echo "🎮 Genesis Protocol - Game State Initialization"
echo "================================================"
echo ""

PROJECT_DIR="/Users/sylviaukanga/Desktop/Genesis-Protocol"
SERVICE_ACCOUNT="genesis-protocol-firebase-adminsdk.json"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo -e "${RED}❌ Error: Not in Genesis Protocol directory${NC}"
  echo "Please run this script from: $PROJECT_DIR"
  exit 1
fi

echo -e "${BLUE}📁 Working directory: $(pwd)${NC}"
echo ""

# Step 1: Check for service account key
echo "Step 1: Checking for Firebase Admin SDK key..."
if [ -f "$SERVICE_ACCOUNT" ]; then
  echo -e "${GREEN}✅ Service account key found${NC}"
else
  echo -e "${YELLOW}⚠️  Service account key not found${NC}"
  echo ""
  echo "Please download your Firebase Admin SDK key:"
  echo "1. Go to: https://console.firebase.google.com/project/genesis-protocol/settings/serviceaccounts/adminsdk"
  echo "2. Click 'Generate new private key'"
  echo "3. Rename the downloaded file to: $SERVICE_ACCOUNT"
  echo "4. Move it to: $PROJECT_DIR"
  echo ""
  read -p "Press Enter once you've downloaded the key..."
  
  if [ ! -f "$SERVICE_ACCOUNT" ]; then
    echo -e "${RED}❌ Service account key still not found. Exiting.${NC}"
    exit 1
  fi
  echo -e "${GREEN}✅ Service account key found${NC}"
fi

echo ""

# Step 2: Check for firebase-admin dependency
echo "Step 2: Checking for firebase-admin package..."
if npm list firebase-admin &> /dev/null; then
  echo -e "${GREEN}✅ firebase-admin already installed${NC}"
else
  echo -e "${YELLOW}⚠️  firebase-admin not installed${NC}"
  echo "Installing firebase-admin..."
  npm install firebase-admin
  echo -e "${GREEN}✅ firebase-admin installed${NC}"
fi

echo ""

# Step 3: Verify game state (before initialization)
echo "Step 3: Checking current game state..."
if [ -f "verify-game-state.js" ]; then
  node verify-game-state.js || true
else
  echo -e "${YELLOW}⚠️  verify-game-state.js not found${NC}"
fi

echo ""

# Step 4: Ask if user wants to proceed with initialization
echo "Step 4: Initialize game state"
echo ""
read -p "Do you want to initialize/reset your game state? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
  if [ -f "force-initialize-game-state.js" ]; then
    echo ""
    echo "Running initialization script..."
    node force-initialize-game-state.js
    echo ""
  else
    echo -e "${RED}❌ force-initialize-game-state.js not found${NC}"
    exit 1
  fi
else
  echo "Skipping initialization."
  exit 0
fi

# Step 5: Verify game state (after initialization)
echo "Step 5: Verifying game state..."
if [ -f "verify-game-state.js" ]; then
  node verify-game-state.js
else
  echo -e "${YELLOW}⚠️  verify-game-state.js not found${NC}"
fi

echo ""
echo "================================================"
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "1. Clear your browser cache:"
echo "   - Press Cmd+Shift+Delete (Mac)"
echo "   - Select 'Cached images and files'"
echo "   - Select 'All time'"
echo "   - Click 'Clear data'"
echo ""
echo "2. Or use Incognito/Private mode"
echo ""
echo "3. Log in to your app and verify:"
echo "   - Stats show A/B/C ranks (not all E)"
echo "   - Classified Dossier is visible"
echo "   - Radar chart displays correctly"
echo ""
echo -e "${GREEN}✅ You're all set!${NC}"
echo ""
