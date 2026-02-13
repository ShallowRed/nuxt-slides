# Architecture: Private Presentations

## Overview

This document describes how private presentations are handled in the nuxt-slides project, allowing deployment of sensitive content without exposing it in the public repository.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         DEVELOPMENT                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Developer's Machine                                            │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ nuxt-slides/                                           │    │
│  │ ├── presentations/                                     │    │
│  │ │   ├── public/        ✅ In Git (public)            │    │
│  │ │   ├── draft/         ⚠️  Local only (ignored)      │    │
│  │ │   ├── semi-private/  ⚠️  Local only (ignored)      │    │
│  │ │   └── private/       ⚠️  Local only (ignored)      │    │
│  │ └── scripts/                                           │    │
│  │     └── fetch-presentations.js                        │    │
│  └────────────────────────────────────────────────────────┘    │
│         │                                                       │
│         │ git push                                             │
│         ↓                                                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         GITHUB REPOS                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────┐   ┌─────────────────────────┐   │
│  │ ShallowRed/nuxt-slides   │   │ ShallowRed/              │   │
│  │ 🌍 PUBLIC                │   │ nuxt-slides-content      │   │
│  │                          │   │ 🔒 PRIVATE               │   │
│  │ ✅ All code              │   │                          │   │
│  │ ✅ Public presentations  │   │ presentations/           │   │
│  │ ✅ Scripts               │   │ ├── private/            │   │
│  │ ✅ Documentation         │   │ ├── semi-private/       │   │
│  │                          │   │ └── draft/              │   │
│  │ ❌ Private presentations │   │                          │   │
│  └──────────────────────────┘   └─────────────────────────┘   │
│         │                                   ↑                   │
│         │                                   │                   │
└─────────┼───────────────────────────────────┼───────────────────┘
          │                                   │
          │ Webhook trigger                   │ Clone with token
          ↓                                   │
┌─────────────────────────────────────────────────────────────────┐
│                         VERCEL BUILD                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Build Process:                                                 │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ 1. Clone public repo                                   │    │
│  │    git clone ShallowRed/nuxt-slides                    │    │
│  └────────────────────────────────────────────────────────┘    │
│         │                                                       │
│         ↓                                                       │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ 2. Run prebuild script                                 │    │
│  │    node scripts/fetch-presentations.js                 │    │
│  │                                                         │    │
│  │    → Reads env: PRESENTATIONS_REPO_TOKEN               │    │
│  │    → Clones: nuxt-slides-content                       │    │
│  │    → Copies: private, semi-private, draft folders      │    │
│  └────────────────────────────────────────────────────────┘    │
│         │                                                       │
│         ↓                                                       │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ 3. Build Nuxt                                          │    │
│  │    pnpm build:themes && nuxt build                     │    │
│  │                                                         │    │
│  │    → SSG: Public presentations                         │    │
│  │    → SSR: Private/Semi-private/Draft                   │    │
│  └────────────────────────────────────────────────────────┘    │
│         │                                                       │
│         ↓                                                       │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ 4. Deploy                                              │    │
│  │    .output/ → Vercel Edge Network                      │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
          │
          ↓
┌─────────────────────────────────────────────────────────────────┐
│                         PRODUCTION                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  https://your-site.vercel.app                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ /slides/example              → 🌍 Public (SSG)        │    │
│  │ /slides/internal-strategy    → 🔐 Semi-private (SSR)  │    │
│  │ /slides/board-presentation   → 🔒 Private (SSR)       │    │
│  │ /slides/wip-feature          → 👤 Draft (SSR)         │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Environment Variables Flow

```
VERCEL Environment Variables
┌─────────────────────────────────────────┐
│ PRESENTATIONS_REPO                      │ → "ShallowRed/nuxt-slides-content"
│ PRESENTATIONS_REPO_TOKEN                │ → "ghp_xxxxxxxxxxxx"
│ PRESENTATIONS_BRANCH                    │ → "main"
│ PRESENTATIONS_FOLDERS                   │ → "private,semi-private,draft"
└─────────────────────────────────────────┘
         │
         ↓
scripts/fetch-presentations.js
         │
         ↓
┌─────────────────────────────────────────┐
│ 1. Validate token exists                │
│ 2. Clone private repo                   │
│ 3. Copy folders to presentations/       │
│ 4. Clean up temp files                  │
└─────────────────────────────────────────┘
```

## Access Control Matrix

| Folder | Git Status | Deployment | Rendering | Access Required |
|--------|-----------|------------|-----------|-----------------|
| public/ | ✅ Versioned | ✅ Deployed | SSG (pre-rendered) | None (public) |
| semi-private/ | ❌ Ignored | ✅ Deployed (via sync) | SSR (on-demand) | Password or Auth |
| draft/ | ❌ Ignored | ✅ Deployed (via sync) | SSR (on-demand) | Admin/Auth |
| private/ | ❌ Ignored | ✅ Deployed (via sync) | SSR (on-demand) | GitHub OAuth |

## Security Model

### Layers of Protection

1. **Repository Level**
   - Public repo: Open source code
   - Private repo: Restricted access via GitHub permissions

2. **Build Level**
   - Token-based access to private repo
   - Token stored in Vercel secrets (never in code)
   - Token scoped to single private repo

3. **Runtime Level**
   - Authentication required for private/draft routes
   - Password protection for semi-private routes
   - Session management via nuxt-auth-utils

### Token Security

```
GitHub Personal Access Token
├── Scope: repo (read-only sufficient)
├── Storage: Vercel Environment Variables
├── Exposure: Never in git, logs, or responses
├── Rotation: Recommended every 90 days
└── Fallback: Build continues without token (local dev)
```

## File Structure Comparison

### Public Repository (ShallowRed/nuxt-slides)

```
nuxt-slides/
├── src/                    ✅ Public
├── server/                 ✅ Public
├── scripts/                ✅ Public
│   └── fetch-presentations.js  ← Sync script
├── presentations/
│   ├── public/             ✅ Versioned in git
│   │   └── example.md
│   ├── draft/              ❌ In .gitignore
│   │   └── .gitkeep        ✅ Only .gitkeep
│   ├── semi-private/       ❌ In .gitignore
│   │   └── .gitkeep        ✅ Only .gitkeep
│   └── private/            ❌ In .gitignore
│       └── .gitkeep        ✅ Only .gitkeep
└── docs/                   ✅ Public
    └── private-presentations.md
```

### Private Repository (ShallowRed/nuxt-slides-content)

```
nuxt-slides-content/
└── presentations/
    ├── private/            🔒 Fully private
    │   ├── board-meeting.md
    │   └── financials-2026.md
    ├── semi-private/       🔒 Password protected
    │   ├── internal-roadmap.md
    │   └── team-strategy.md
    └── draft/              🔒 Work in progress
        ├── new-feature.md
        └── experiment.md
```

## Build Process Timeline

```
                    Local Development
                          │
                          │ git push
                          ↓
                    ┌───────────┐
                    │  GitHub   │
                    │  (public) │
                    └───────────┘
                          │
                   Webhook triggers
                          ↓
┌─────────────────────────────────────────────────────────┐
│                    VERCEL BUILD                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [0s]     Clone public repo                            │
│  [5s]     npm install / pnpm install                   │
│  [10s]    ⚡ RUN: prebuild script                      │
│           ├─ Check PRESENTATIONS_REPO_TOKEN            │
│           ├─ Clone private repo                        │
│           ├─ Sync presentations/                       │
│           └─ Cleanup temp files                        │
│  [15s]    Build themes (SCSS → CSS)                    │
│  [20s]    Nuxt build                                   │
│           ├─ Discover presentations                    │
│           ├─ Pre-render public/ (SSG)                  │
│           └─ Prepare SSR routes                        │
│  [45s]    Deploy to Edge Network                       │
│                                                         │
└─────────────────────────────────────────────────────────┘
                          │
                          ↓
                    🌍 Production
```

## Benefits of This Architecture

### ✅ Clean Separation
- Public code repository
- Private content repository
- No contamination

### ✅ Simple Workflow
- No git submodules complexity
- Standard git operations
- Easy to understand

### ✅ Secure
- Token-based authentication
- Minimal access scope
- Environment-specific configuration

### ✅ Flexible
- Easy to add/remove presentations
- Can customize sync logic
- Works with any private Git host

### ✅ Developer Friendly
- Works without token locally
- Fails gracefully
- Clear documentation

## Alternative Approaches Considered

### ❌ Git Submodules
- Complex setup
- Difficult for contributors
- CI/CD challenges
- Version synchronization issues

### ❌ Monorepo with Path Filtering
- Can't fully hide private content
- Git history still accessible
- Complex .gitignore management

### ✅ Current Approach (Separate Repos + Build Script)
- Clean separation
- Simple to understand
- Easy to maintain
- Secure by design

## Maintenance

### Adding a New Presentation

1. Add to private repo:
   ```bash
   cd nuxt-slides-content
   vim presentations/private/new-presentation.md
   git add . && git commit -m "Add new presentation" && git push
   ```

2. Trigger redeploy on Vercel (automatic or manual)

3. Access at: `https://your-site.vercel.app/slides/new-presentation`

### Rotating the GitHub Token

1. Create new token with same permissions
2. Update `PRESENTATIONS_REPO_TOKEN` in Vercel
3. Trigger a redeploy to verify
4. Revoke old token

### Changing Repository Structure

Update `PRESENTATIONS_FOLDERS` in Vercel environment variables to match your folder structure.

## References

- [Setup Guide](./private-presentations.md)
- [Quick Start](./QUICKSTART-PRIVATE.md)
- [Main README](../README.md)
