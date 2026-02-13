# Private Presentations

## Architecture

Two-repository model: the public repo (`nuxt-slides`) contains all code, the private repo (`nuxt-slides-content`) contains sensitive presentations. At build time on Vercel, `scripts/fetch-presentations.js` clones the private repo and copies content into `presentations/` before Nuxt builds.

```
nuxt-slides (public)              nuxt-slides-content (private)
├── presentations/                └── presentations/
│   ├── public/     (in git)          ├── private/
│   ├── private/    (.gitignore)      ├── semi-private/
│   ├── semi-private/ (.gitignore)    └── draft/
│   └── draft/      (.gitignore)
```

The `prebuild` and `pregenerate` npm scripts run `fetch-presentations.js` automatically. Without a token (local dev), the script exits silently.

## Setup

### 1. Private repository

```bash
./scripts/init-private-repo.sh
# or manually:
gh repo create ShallowRed/nuxt-slides-content --private
```

The private repo contains only `presentations/{private,semi-private,draft}/`.

### 2. GitHub token

Create a [fine-grained personal access token](https://github.com/settings/personal-access-tokens/new) scoped to the private repo with **Contents: Read-only**. A classic token with `repo` scope also works.

### 3. Vercel environment variables

| Variable | Required | Default |
|----------|----------|---------|
| `PRESENTATIONS_REPO` | yes | `ShallowRed/nuxt-slides-content` |
| `PRESENTATIONS_REPO_TOKEN` | yes | -- |
| `PRESENTATIONS_BRANCH` | no | `main` |
| `PRESENTATIONS_FOLDERS` | no | `private,semi-private,draft` |

## Local development

Private presentations are not synced locally by default. Options:

```bash
# Use the fetch script with a token
export PRESENTATIONS_REPO_TOKEN=ghp_xxx
node scripts/fetch-presentations.js

# Or copy from a local clone
cp -r ../nuxt-slides-content/presentations/* presentations/
```

## Updating content

Push changes to the private repo, then trigger a Vercel redeploy (automatic on push to the main repo, or manual).

## Troubleshooting

- **"Authentication failed"**: token expired or missing `repo` / Contents scope
- **"Repository not found"**: wrong `PRESENTATIONS_REPO` value or token lacks access
- **Content missing after build**: check Vercel build logs for fetch script output
