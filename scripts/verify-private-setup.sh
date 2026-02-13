#!/bin/bash

# Verification script for private presentations setup
# Usage: ./scripts/verify-private-setup.sh

set -e

echo "🔍 Verifying private presentations setup..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
PASS=0
FAIL=0
WARN=0

check_pass() {
    echo -e "${GREEN}✅ $1${NC}"
    PASS=$((PASS + 1))
}

check_fail() {
    echo -e "${RED}❌ $1${NC}"
    FAIL=$((FAIL + 1))
}

check_warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    WARN=$((WARN + 1))
}

echo "1️⃣  Checking local repository structure..."
echo ""

# Check presentations folder structure
if [ -d "presentations" ]; then
    check_pass "presentations/ folder exists"
else
    check_fail "presentations/ folder not found"
fi

if [ -d "presentations/public" ]; then
    check_pass "presentations/public/ folder exists"
else
    check_fail "presentations/public/ folder not found"
fi

if [ -d "presentations/private" ]; then
    check_pass "presentations/private/ folder exists"
else
    check_warn "presentations/private/ folder not found (will be created at build)"
fi

if [ -d "presentations/semi-private" ]; then
    check_pass "presentations/semi-private/ folder exists"
else
    check_warn "presentations/semi-private/ folder not found (will be created at build)"
fi

if [ -d "presentations/draft" ]; then
    check_pass "presentations/draft/ folder exists"
else
    check_warn "presentations/draft/ folder not found (will be created at build)"
fi

echo ""
echo "2️⃣  Checking scripts..."
echo ""

if [ -f "scripts/fetch-presentations.js" ]; then
    check_pass "scripts/fetch-presentations.js exists"
else
    check_fail "scripts/fetch-presentations.js not found"
fi

if [ -x "scripts/init-private-repo.sh" ]; then
    check_pass "scripts/init-private-repo.sh is executable"
elif [ -f "scripts/init-private-repo.sh" ]; then
    check_warn "scripts/init-private-repo.sh exists but not executable (run: chmod +x scripts/init-private-repo.sh)"
else
    check_warn "scripts/init-private-repo.sh not found (optional)"
fi

echo ""
echo "3️⃣  Checking package.json scripts..."
echo ""

if grep -q '"prebuild"' package.json; then
    check_pass "prebuild script configured"
else
    check_fail "prebuild script not found in package.json"
fi

if grep -q '"pregenerate"' package.json; then
    check_pass "pregenerate script configured"
else
    check_warn "pregenerate script not found (optional but recommended)"
fi

echo ""
echo "4️⃣  Checking .gitignore..."
echo ""

if grep -q "presentations/private/\*" .gitignore; then
    check_pass "presentations/private/* is ignored"
else
    check_fail "presentations/private/* not in .gitignore"
fi

if grep -q "presentations/semi-private/\*" .gitignore; then
    check_pass "presentations/semi-private/* is ignored"
else
    check_fail "presentations/semi-private/* not in .gitignore"
fi

if grep -q "presentations/draft/\*" .gitignore; then
    check_pass "presentations/draft/* is ignored"
else
    check_fail "presentations/draft/* not in .gitignore"
fi

if grep -q ".presentations-temp" .gitignore; then
    check_pass "Temp clone directory is ignored"
else
    check_warn "Temp clone directory not in .gitignore (add: .presentations-temp)"
fi

echo ""
echo "5️⃣  Checking environment configuration..."
echo ""

if [ -f ".env.example" ]; then
    check_pass ".env.example exists"
    
    if grep -q "PRESENTATIONS_REPO" .env.example; then
        check_pass "PRESENTATIONS_REPO documented in .env.example"
    else
        check_fail "PRESENTATIONS_REPO not in .env.example"
    fi
    
    if grep -q "PRESENTATIONS_REPO_TOKEN" .env.example; then
        check_pass "PRESENTATIONS_REPO_TOKEN documented in .env.example"
    else
        check_fail "PRESENTATIONS_REPO_TOKEN not in .env.example"
    fi
else
    check_warn ".env.example not found"
fi

if [ -f ".env" ]; then
    if grep -q "PRESENTATIONS_REPO_TOKEN=ghp_" .env; then
        check_pass "PRESENTATIONS_REPO_TOKEN configured in .env (local testing)"
        
        # Test if we can fetch
        echo ""
        echo "6️⃣  Testing presentation fetch..."
        echo ""
        
        if node scripts/fetch-presentations.js; then
            check_pass "Successfully fetched presentations from private repo"
        else
            check_fail "Failed to fetch presentations (check token permissions)"
        fi
    else
        check_warn "PRESENTATIONS_REPO_TOKEN not configured in .env (normal for production-only setup)"
    fi
else
    check_warn ".env not found (normal for production-only setup)"
fi

echo ""
echo "7️⃣  Checking documentation..."
echo ""

if [ -f "docs/private-presentations.md" ]; then
    check_pass "Private presentations documentation exists"
else
    check_warn "docs/private-presentations.md not found"
fi

if [ -f "docs/QUICKSTART-PRIVATE.md" ]; then
    check_pass "Quick start guide exists"
else
    check_warn "docs/QUICKSTART-PRIVATE.md not found"
fi

if [ -f "presentations/README.md" ]; then
    check_pass "presentations/README.md exists"
else
    check_warn "presentations/README.md not found"
fi

echo ""
echo "8️⃣  Checking for common issues..."
echo ""

# Check if private presentations are accidentally committed
PRIVATE_FILES=$(git ls-files presentations/private/*.md 2>/dev/null | wc -l)
if [ "$PRIVATE_FILES" -gt 0 ]; then
    check_fail "Private presentations found in git history! ($PRIVATE_FILES files)"
    echo "       Run: git rm --cached presentations/private/*.md"
else
    check_pass "No private presentations in git (good!)"
fi

SEMI_PRIVATE_FILES=$(git ls-files presentations/semi-private/*.md 2>/dev/null | wc -l)
if [ "$SEMI_PRIVATE_FILES" -gt 0 ]; then
    check_fail "Semi-private presentations found in git history! ($SEMI_PRIVATE_FILES files)"
    echo "       Run: git rm --cached presentations/semi-private/*.md"
else
    check_pass "No semi-private presentations in git (good!)"
fi

DRAFT_FILES=$(git ls-files presentations/draft/*.md 2>/dev/null | wc -l)
if [ "$DRAFT_FILES" -gt 0 ]; then
    check_warn "Draft presentations found in git history ($DRAFT_FILES files)"
    echo "       Consider: git rm --cached presentations/draft/*.md"
else
    check_pass "No draft presentations in git (good!)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Summary:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ Passed: $PASS${NC}"
echo -e "${YELLOW}⚠️  Warnings: $WARN${NC}"
echo -e "${RED}❌ Failed: $FAIL${NC}"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}🎉 Setup looks good!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Create private repository: ./scripts/init-private-repo.sh"
    echo "2. Copy presentations to private repo"
    echo "3. Configure Vercel environment variables"
    echo "4. Deploy!"
    echo ""
    echo "See: docs/QUICKSTART-PRIVATE.md for detailed instructions"
    exit 0
else
    echo -e "${RED}⚠️  Some checks failed. Please fix the issues above.${NC}"
    echo ""
    echo "See: docs/private-presentations.md for help"
    exit 1
fi
