# Quick Start: Private Presentations Setup

This guide will get your private presentations deployed on Vercel in ~5 minutes.

## TL;DR

```bash
# 1. Create private repo (automated)
./scripts/init-private-repo.sh

# 2. Create GitHub token
# → https://github.com/settings/tokens
# → Scope: repo

# 3. Configure Vercel
# → PRESENTATIONS_REPO=ShallowRed/nuxt-slides-content
# → PRESENTATIONS_REPO_TOKEN=ghp_xxxxxxxxxxxx

# 4. Deploy!
git push origin main
```

## Step-by-Step Guide

### 1. Create the Private Repository

**Option A: Automated (recommended)**
```bash
./scripts/init-private-repo.sh
```

**Option B: Manual**
```bash
# Create repo on GitHub (private)
gh repo create ShallowRed/nuxt-slides-content --private

# Clone and setup structure
git clone https://github.com/ShallowRed/nuxt-slides-content.git
cd nuxt-slides-content
mkdir -p presentations/{private,semi-private,draft}
touch presentations/{private,semi-private,draft}/.gitkeep
git add . && git commit -m "Initial structure" && git push
```

### 2. Copy Existing Presentations

```bash
# From your nuxt-slides project
cp -r presentations/private/* ../nuxt-slides-content/presentations/private/
cp -r presentations/semi-private/* ../nuxt-slides-content/presentations/semi-private/
cp -r presentations/draft/* ../nuxt-slides-content/presentations/draft/

cd ../nuxt-slides-content
git add presentations/
git commit -m "Add existing presentations"
git push
```

### 3. Create GitHub Personal Access Token

1. Go to: https://github.com/settings/tokens/new
2. Token name: `Vercel Presentations Sync`
3. Expiration: No expiration (or custom)
4. Scopes: Check **`repo`** (Full control of private repositories)
5. Click "Generate token"
6. **Copy the token** (you won't see it again!)

### 4. Configure Vercel

Go to your Vercel project → Settings → Environment Variables

Add these variables for **Production**, **Preview**, and **Development**:

```bash
PRESENTATIONS_REPO=ShallowRed/nuxt-slides-content
PRESENTATIONS_REPO_TOKEN=ghp_xxxxxxxxxxxx
PRESENTATIONS_BRANCH=main
PRESENTATIONS_FOLDERS=private,semi-private,draft
```

### 5. Test the Setup

**Local test:**
```bash
# Export token temporarily
export PRESENTATIONS_REPO_TOKEN=ghp_xxxxxxxxxxxx
pnpm prebuild  # Should clone and sync presentations
pnpm dev       # Should show all presentations
```

**Vercel test:**
```bash
# Trigger a deploy
git commit --allow-empty -m "Test private presentations sync"
git push origin main
```

Check Vercel logs for:
```
🔄 Fetching presentations from private repository...
📥 Cloning ShallowRed/nuxt-slides-content...
✅ Synced presentations/private
✅ Synced presentations/semi-private
✅ Synced presentations/draft
✨ Successfully fetched all presentations!
```

## Verification Checklist

- [ ] Private repo created and accessible
- [ ] Presentations copied to private repo
- [ ] GitHub token created with `repo` scope
- [ ] All 4 environment variables added to Vercel
- [ ] Build logs show successful sync
- [ ] Private presentations accessible on deployed site
- [ ] Public repo doesn't contain sensitive presentations

## Troubleshooting

### Build fails with "Authentication failed"

**Issue:** GitHub token doesn't have access to the private repo

**Solution:**
1. Verify token has `repo` scope
2. Verify token hasn't expired
3. Verify repo name is correct in `PRESENTATIONS_REPO`

### Presentations not syncing

**Issue:** Script can't find presentations folders

**Solution:**
1. Verify folder structure in private repo:
   ```
   presentations/
   ├── private/
   ├── semi-private/
   └── draft/
   ```
2. Check `PRESENTATIONS_FOLDERS` variable matches folders
3. Check branch name in `PRESENTATIONS_BRANCH`

### Local development: presentations missing

**Issue:** No token configured locally

**Solution:**
This is normal! Private presentations are only synced in production.

For local development:
```bash
# Option 1: Export token
export PRESENTATIONS_REPO_TOKEN=ghp_xxxxxxxxxxxx
pnpm prebuild

# Option 2: Manual copy
cp -r ../nuxt-slides-content/presentations/* presentations/

# Option 3: Work only with public presentations
```

### Different content in production vs local

**Expected behavior!**

- **Local:** Only public presentations (unless you manually sync)
- **Production:** All presentations (auto-synced from private repo)

## Updating Presentations

### Production
```bash
cd nuxt-slides-content
# Edit your presentation
vim presentations/private/my-presentation.md
git add .
git commit -m "Update presentation"
git push

# Trigger Vercel redeploy (automatic or manual)
```

### Local
```bash
# Work directly in presentations/ folder
# Changes are not committed (ignored by .gitignore)
vim presentations/private/my-presentation.md
pnpm dev
```

## Security Best Practices

1. **Never commit the token** to git
2. **Use least privilege** - token only needs `repo` scope for one private repo
3. **Rotate tokens** periodically
4. **Use environment-specific tokens** if possible
5. **Review branch protection** rules on private repo

## Next Steps

- [ ] Setup authentication for semi-private presentations
- [ ] Configure password protection
- [ ] Customize access control in `server/utils/presentations.ts`
- [ ] Add more presentations!

## Resources

- [Full documentation](./private-presentations.md)
- [GitHub Tokens](https://github.com/settings/tokens)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Architecture overview](./architecture.llm.txt)
