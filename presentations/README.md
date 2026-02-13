# Presentations Directory

This folder contains all presentation files organized by publication status.

## 📁 Structure

```
presentations/
├── public/          # Public presentations (versioned in git)
├── semi-private/    # Protected presentations (password/auth required)
├── draft/           # Work in progress presentations
└── private/         # Fully private presentations
```

## 🔒 Access Control

Each folder has different access rules:

| Folder | Git | Deployment | Access |
|--------|-----|------------|--------|
| `public/` | ✅ Versioned | ✅ SSG | Public |
| `semi-private/` | ❌ Ignored* | ✅ SSR | Password/Auth |
| `draft/` | ❌ Ignored* | ✅ SSR | Auth required |
| `private/` | ❌ Ignored* | ✅ SSR | GitHub auth |

\* Ignored in public repo, synced from private repo on Vercel

## 📝 Creating a Presentation

1. Create a new `.md` file in the appropriate folder
2. Follow the naming convention: `my-presentation.md`
3. The file will be accessible at `/slides/my-presentation`

### Example: Public presentation

```bash
# File: presentations/public/my-talk.md
```

Access: `https://yoursite.com/slides/my-talk` (anyone can view)

### Example: Protected presentation

```bash
# File: presentations/semi-private/internal-strategy.md
```

Access: `https://yoursite.com/slides/internal-strategy` (password required)

## 🚀 Deployment

### Local Development

Only `public/` presentations are versioned in git.

For `private/`, `semi-private/`, and `draft/`:
- Keep them in your local folder
- They won't be committed (see `.gitignore`)

### Production (Vercel)

All presentations are automatically deployed:
- `public/` presentations are pre-rendered (SSG)
- Other statuses are rendered on-demand (SSR)
- Private content is synced from a separate private repository

See [docs/private-presentations.md](../docs/private-presentations.md) for setup details.

## 🔐 Private Presentations Setup

To deploy private presentations on Vercel without exposing them publicly:

1. Create a private GitHub repository for presentations
2. Configure Vercel environment variables
3. The build script automatically syncs content

See the full guide: [docs/private-presentations.md](../docs/private-presentations.md)

## ⚙️ Configuration

Presentation behavior is configured in:
- Access control: `server/utils/presentations.ts`
- Build/SSG: `nuxt.config.ts` (routeRules)
- Password protection: `.env` file

## 📖 Documentation

For more details on the presentation system:
- [Architecture](../docs/architecture.llm.txt)
- [Presentation format](../docs/presentation-format.llm.txt)
- [Private presentations setup](../docs/private-presentations.md)
