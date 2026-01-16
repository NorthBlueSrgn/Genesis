#!/bin/bash
# Genesis Protocol - Push to GitHub Script

# Configuration
REPO_NAME="Genesis-Protocol"
YOUR_USERNAME="sylviaukanga"  # CHANGE THIS to your GitHub username
REPO_URL="https://github.com/${YOUR_USERNAME}/${REPO_NAME}.git"

echo "🚀 Genesis Protocol - GitHub Push Setup"
echo "========================================"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    echo "✅ Git initialized"
else
    echo "✅ Git repository already initialized"
fi

# Add all files
echo ""
echo "📁 Adding all files..."
git add .
echo "✅ Files staged"

# Initial commit
echo ""
echo "💾 Creating initial commit..."
git commit -m "Initial commit: Genesis Protocol - Adaptive psychometric and creativity assessment platform" --allow-empty
echo "✅ Initial commit created"

# Rename branch to main
echo ""
echo "🌿 Setting main branch..."
git branch -M main

# Add remote
echo ""
echo "🔗 Adding remote origin..."
git remote remove origin 2>/dev/null || true
git remote add origin "$REPO_URL"
echo "✅ Remote added: $REPO_URL"

# Push to GitHub
echo ""
echo "📤 Pushing to GitHub..."
git push -u origin main

echo ""
echo "✨ Done! Your repository is now on GitHub"
echo ""
echo "Next steps:"
echo "1. Visit: https://github.com/${YOUR_USERNAME}/${REPO_NAME}"
echo "2. Add a repository description"
echo "3. Set topics: psychometric, assessment, creativity, onboarding"
echo "4. Enable GitHub Pages if you want to host it"
echo ""
