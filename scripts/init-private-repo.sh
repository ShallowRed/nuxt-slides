#!/bin/bash

# Script to initialize the private presentations repository
# Usage: ./scripts/init-private-repo.sh [repo-name]

set -e

REPO_NAME="${1:-nuxt-slides-content}"
REPO_OWNER="${2:-ShallowRed}"
FULL_REPO="${REPO_OWNER}/${REPO_NAME}"

echo "🚀 Initializing private presentations repository: ${FULL_REPO}"
echo ""

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed"
    echo "   Install it from: https://cli.github.com/"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ Not authenticated with GitHub CLI"
    echo "   Run: gh auth login"
    exit 1
fi

# Create temporary directory
TEMP_DIR=$(mktemp -d)
cd "$TEMP_DIR"

echo "📁 Creating repository structure..."

# Create folder structure
mkdir -p presentations/{private,semi-private,draft}

# Add .gitkeep files
touch presentations/private/.gitkeep
touch presentations/semi-private/.gitkeep
touch presentations/draft/.gitkeep

# Create README
cat > README.md << 'EOF'
# Nuxt Slides - Private Content Repository

This repository contains private presentations for the nuxt-slides project.

## Structure

```
presentations/
├── private/         # Fully private (GitHub auth required)
├── semi-private/    # Password-protected
└── draft/           # Work-in-progress
```

## Usage

Add your `.md` presentation files to the appropriate folder.

When the main repository builds on Vercel, these presentations are automatically synced.

## More Information

See: https://github.com/ShallowRed/nuxt-slides/blob/main/docs/private-presentations.md
EOF

# Initialize git
git init
git add .
git commit -m "Initial commit: repository structure"

echo ""
echo "📤 Creating private GitHub repository..."

# Create private repo
gh repo create "$FULL_REPO" --private --source=. --remote=origin --push

echo ""
echo "✅ Repository created successfully!"
echo ""
echo "📋 Next steps:"
echo ""
echo "1. Copy your existing presentations:"
echo "   cd $(pwd)"
echo "   cp -r /path/to/nuxt-slides/presentations/private/* presentations/private/"
echo "   cp -r /path/to/nuxt-slides/presentations/semi-private/* presentations/semi-private/"
echo "   cp -r /path/to/nuxt-slides/presentations/draft/* presentations/draft/"
echo "   git add ."
echo "   git commit -m 'Add existing presentations'"
echo "   git push"
echo ""
echo "2. Create a GitHub Personal Access Token:"
echo "   - Go to: https://github.com/settings/tokens"
echo "   - Create new token (classic)"
echo "   - Name: Vercel Presentations Sync"
echo "   - Scopes: repo (Full control)"
echo "   - Copy the generated token"
echo ""
echo "3. Configure Vercel environment variables:"
echo "   PRESENTATIONS_REPO=${FULL_REPO}"
echo "   PRESENTATIONS_REPO_TOKEN=ghp_xxxxxxxxxxxx"
echo ""
echo "Repository location: $(pwd)"
echo ""
