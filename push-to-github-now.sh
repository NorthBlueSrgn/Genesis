#!/bin/bash
# 🚀 Genesis Protocol - One-Command GitHub Push
# Usage: bash push-to-github-now.sh YOUR_USERNAME

set -e

if [ $# -eq 0 ]; then
    echo "❌ Missing GitHub username!"
    echo "Usage: bash push-to-github-now.sh YOUR_USERNAME"
    echo ""
    echo "Example: bash push-to-github-now.sh sylviaukanga"
    exit 1
fi

USERNAME=$1
REPO_NAME="Genesis-Protocol"
REPO_URL="https://github.com/${USERNAME}/${REPO_NAME}.git"

echo ""
echo "🚀 Genesis Protocol - GitHub Push"
echo "=================================="
echo ""
echo "📦 Repository: ${USERNAME}/${REPO_NAME}"
echo "🔗 URL: ${REPO_URL}"
echo ""
echo "⚠️  Make sure you have created the repository on GitHub first!"
echo "Visit: https://github.com/new"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Cancelled"
    exit 1
fi

echo ""
echo "📝 Configuring Git..."

# Configure git if not already done
if [ -z "$(git config user.name)" ]; then
    read -p "Enter your name: " NAME
    git config --global user.name "$NAME"
fi

if [ -z "$(git config user.email)" ]; then
    read -p "Enter your email: " EMAIL
    git config --global user.email "$EMAIL"
fi

echo "✅ Git configured"
echo ""

# Check if remote exists
if git remote get-url origin 2>/dev/null | grep -q "github.com"; then
    echo "🔄 Updating existing remote..."
    git remote set-url origin "$REPO_URL"
else
    echo "🔗 Adding remote origin..."
    git remote add origin "$REPO_URL"
fi

echo "✅ Remote configured"
echo ""

# Check current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "🌿 Current branch: $CURRENT_BRANCH"

if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "🔄 Renaming branch to 'main'..."
    git branch -M main
    echo "✅ Branch renamed"
fi

echo ""
echo "📤 Pushing to GitHub..."
echo ""

# Push with verbose output
git push -u origin main

echo ""
echo "✨ Success! Your code is now on GitHub!"
echo ""
echo "🎉 Next steps:"
echo "   1. Visit: https://github.com/${USERNAME}/${REPO_NAME}"
echo "   2. Add topics: psychometric, assessment, creativity, onboarding"
echo "   3. Add a description in repository settings"
echo "   4. Optional: Enable GitHub Pages for hosting"
echo ""
echo "📚 Documentation:"
echo "   - README: Project overview & setup"
echo "   - CONTRIBUTING: Guidelines for contributors"
echo "   - GITHUB_SETUP: Detailed setup instructions"
echo ""
