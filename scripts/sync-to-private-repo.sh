#!/bin/bash

# Script to sync local presentations to the private repository
# Usage: ./scripts/sync-to-private-repo.sh

set -e

PRIVATE_REPO="ShallowRed/nuxt-slides-content"
CLONE_DIR="../nuxt-slides-content"

echo "📦 Syncing presentations to private repository..."
echo ""

# Check if clone directory already exists
if [ -d "$CLONE_DIR" ]; then
    echo "📁 Directory $CLONE_DIR already exists"
    echo "   Using existing clone..."
    cd "$CLONE_DIR"
    git pull origin main
else
    echo "📥 Cloning $PRIVATE_REPO..."
    cd ..
    gh repo clone "$PRIVATE_REPO"
    cd nuxt-slides-content
fi

echo ""
echo "📋 Copying presentations..."

# Count files
SEMI_PRIVATE_COUNT=$(find ../nuxt-slides/presentations/semi-private -name "*.md" -type f 2>/dev/null | wc -l | tr -d ' ')
PRIVATE_COUNT=$(find ../nuxt-slides/presentations/private -name "*.md" -type f 2>/dev/null | wc -l | tr -d ' ')
DRAFT_COUNT=$(find ../nuxt-slides/presentations/draft -name "*.md" -type f 2>/dev/null | wc -l | tr -d ' ')

# Copy files
if [ "$SEMI_PRIVATE_COUNT" -gt 0 ]; then
    echo "  → Copying $SEMI_PRIVATE_COUNT semi-private presentation(s)..."
    cp ../nuxt-slides/presentations/semi-private/*.md presentations/semi-private/ 2>/dev/null || true
fi

if [ "$PRIVATE_COUNT" -gt 0 ]; then
    echo "  → Copying $PRIVATE_COUNT private presentation(s)..."
    cp ../nuxt-slides/presentations/private/*.md presentations/private/ 2>/dev/null || true
fi

if [ "$DRAFT_COUNT" -gt 0 ]; then
    echo "  → Copying $DRAFT_COUNT draft presentation(s)..."
    cp ../nuxt-slides/presentations/draft/*.md presentations/draft/ 2>/dev/null || true
fi

echo ""
echo "📊 Summary:"
echo "  - Semi-private: $SEMI_PRIVATE_COUNT file(s)"
echo "  - Private: $PRIVATE_COUNT file(s)"
echo "  - Draft: $DRAFT_COUNT file(s)"

# Check if there are changes
if git status --porcelain | grep -q "^"; then
    echo ""
    echo "💾 Committing changes..."
    git add presentations/
    git commit -m "Add presentations from main repository"
    
    echo ""
    echo "📤 Pushing to GitHub..."
    git push origin main
    
    echo ""
    echo "✅ Done! Presentations synced to $PRIVATE_REPO"
else
    echo ""
    echo "ℹ️  No changes detected - all presentations are already in sync"
fi

echo ""
echo "🔗 View repository: https://github.com/$PRIVATE_REPO"
echo ""
echo "Next steps:"
echo "1. Configure Vercel environment variables:"
echo "   PRESENTATIONS_REPO=$PRIVATE_REPO"
echo "   PRESENTATIONS_REPO_TOKEN=ghp_xxxxx"
echo "2. Deploy your site!"
