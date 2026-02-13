# Vercel Configuration Checklist

Use this checklist to ensure your Vercel deployment is properly configured for private presentations.

## 📋 Pre-Deployment Checklist

### 1. Private Repository Setup

- [ ] Private repository created on GitHub
  - Repository name: `___________________________`
  - Format: `owner/repo-name`
  - Visibility: Private ✅

- [ ] Repository structure created:
  ```
  presentations/
  ├── private/
  ├── semi-private/
  └── draft/
  ```

- [ ] Presentations copied to private repo
- [ ] Changes committed and pushed

### 2. GitHub Personal Access Token

- [ ] Token created at https://github.com/settings/tokens
- [ ] Token name: `Vercel Presentations Sync` (or similar)
- [ ] Scopes selected:
  - [ ] `repo` - Full control of private repositories
- [ ] Token copied: `ghp_________________________________`
- [ ] Token tested locally (optional):
  ```bash
  export PRESENTATIONS_REPO_TOKEN=ghp_xxx
  node scripts/fetch-presentations.js
  ```

### 3. Vercel Environment Variables

Go to: **Vercel Project → Settings → Environment Variables**

#### Required Variables

| Variable Name | Value | Environments |
|--------------|--------|--------------|
| `PRESENTATIONS_REPO` | `owner/repo-name` | ✅ Production<br>✅ Preview<br>✅ Development |
| `PRESENTATIONS_REPO_TOKEN` | `ghp_xxxxx` | ✅ Production<br>✅ Preview<br>✅ Development |

#### Optional Variables (with defaults)

| Variable Name | Default | Custom Value | Environments |
|--------------|---------|--------------|--------------|
| `PRESENTATIONS_BRANCH` | `main` | `___________` | ✅ Production<br>✅ Preview<br>✅ Development |
| `PRESENTATIONS_FOLDERS` | `private,semi-private,draft` | `___________` | ✅ Production<br>✅ Preview<br>✅ Development |

### 4. Environment Variable Configuration

Copy these values to Vercel:

```bash
# Required
PRESENTATIONS_REPO=your-org/your-repo-name
PRESENTATIONS_REPO_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Optional (only if different from defaults)
PRESENTATIONS_BRANCH=main
PRESENTATIONS_FOLDERS=private,semi-private,draft
```

**Apply to:**
- [x] Production
- [x] Preview
- [x] Development

## 🚀 Deployment Steps

### Step 1: Configure Environment Variables

1. Go to Vercel dashboard
2. Select your project
3. Click **Settings** → **Environment Variables**
4. Add each variable:
   - Click **Add**
   - Enter **Key** name
   - Enter **Value**
   - Select environments: Production, Preview, Development
   - Click **Save**

### Step 2: Trigger Initial Deploy

Option A: **Push to trigger deploy**
```bash
git commit --allow-empty -m "Configure private presentations"
git push origin main
```

Option B: **Manual redeploy**
1. Go to **Deployments** tab
2. Click **⋯** on latest deployment
3. Click **Redeploy**

### Step 3: Verify Deployment

#### Check Build Logs

1. Go to **Deployments** → Select latest deployment
2. Click **Building** → View **Build Logs**
3. Look for these messages:

```
✅ Expected output:
🔄 Fetching presentations from private repository...
📥 Cloning owner/repo...
✅ Synced presentations/private
✅ Synced presentations/semi-private
✅ Synced presentations/draft
✨ Successfully fetched all presentations!
```

```
❌ Error indicators:
❌ Failed to fetch presentations
⚠️ No PRESENTATIONS_REPO_TOKEN found
Authentication failed
```

#### Check Deployed Site

Visit your deployed URL and verify:

- [ ] Public presentations accessible (e.g., `/slides/example`)
- [ ] Private presentations accessible (e.g., `/slides/your-private-slide`)
- [ ] Semi-private presentations require authentication
- [ ] Draft presentations require admin access

## 🔍 Troubleshooting

### Issue: "No PRESENTATIONS_REPO_TOKEN found"

**Cause:** Token not configured or not applied to correct environment

**Fix:**
1. Verify token is in Environment Variables
2. Check it's applied to the environment being deployed
3. Redeploy after adding the variable

### Issue: "Authentication failed"

**Cause:** Token doesn't have access or has expired

**Fix:**
1. Verify token has `repo` scope
2. Check token hasn't been revoked
3. Verify repo name is correct (`owner/repo`)
4. Generate new token if needed

### Issue: "Folder not found"

**Cause:** Private repo structure doesn't match expected folders

**Fix:**
1. Check `PRESENTATIONS_FOLDERS` matches actual folders
2. Verify folders exist in private repo
3. Check branch name in `PRESENTATIONS_BRANCH`

### Issue: Presentations not updating

**Cause:** Changes pushed to private repo but not redeployed

**Fix:**
1. Push changes to private repo
2. Manually trigger redeploy on Vercel
3. Or: Make a change to main repo to trigger auto-deploy

## 🔐 Security Checklist

- [ ] Token has minimal required permissions (`repo` only)
- [ ] Token is never committed to git
- [ ] Token is stored only in Vercel secrets
- [ ] Private repository has restricted access
- [ ] `.gitignore` prevents committing sensitive files
- [ ] Token expiration date noted: `___________`
- [ ] Token rotation schedule set: `___________`

## 📊 Verification Tests

### Local Test (Optional)

```bash
# Set environment variables
export PRESENTATIONS_REPO=owner/repo
export PRESENTATIONS_REPO_TOKEN=ghp_xxx

# Run fetch script
node scripts/fetch-presentations.js

# Expected output:
# 🔄 Fetching presentations from private repository...
# ✅ Synced presentations/private
# ✅ Synced presentations/semi-private
# ✅ Synced presentations/draft
# ✨ Successfully fetched all presentations!

# Start dev server
pnpm dev

# Visit http://localhost:3000
```

### Production Test

- [ ] Visit production URL
- [ ] Check `/slides` lists presentations
- [ ] Open a public presentation
- [ ] Try opening a private presentation (should require auth)
- [ ] Check Vercel logs for sync messages

## 📝 Notes

**Deployment Date:** ___________________

**Private Repo URL:** ___________________

**Token Created:** ___________________

**Token Expires:** ___________________

**Deployed URL:** ___________________

**Issues Encountered:**
________________________________________________
________________________________________________
________________________________________________

**Resolution:**
________________________________________________
________________________________________________
________________________________________________

## ✅ Final Checklist

Before marking as complete:

- [ ] All environment variables configured
- [ ] Build succeeds without errors
- [ ] Sync messages appear in build logs
- [ ] Public presentations accessible
- [ ] Private presentations accessible (with auth)
- [ ] No sensitive data in public repo
- [ ] Documentation reviewed
- [ ] Team members informed
- [ ] Token stored securely (password manager)

## 📚 Resources

- [Full Setup Guide](./private-presentations.md)
- [Quick Start](./QUICKSTART-PRIVATE.md)
- [Architecture Diagram](./private-presentations-architecture.md)
- [Vercel Environment Variables Docs](https://vercel.com/docs/concepts/projects/environment-variables)
- [GitHub Token Management](https://github.com/settings/tokens)

## 🆘 Getting Help

If you encounter issues:

1. Run the verification script:
   ```bash
   ./scripts/verify-private-setup.sh
   ```

2. Check the troubleshooting section above

3. Review build logs in Vercel dashboard

4. Consult the full documentation

---

**Setup completed:** ☐ Yes ☐ No

**Verified by:** ___________________

**Date:** ___________________
