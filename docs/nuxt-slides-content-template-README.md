# Nuxt Slides - Private Content Repository

This repository contains private presentations for the [nuxt-slides](https://github.com/ShallowRed/nuxt-slides) project.

## 📁 Structure

```
presentations/
├── private/         # Fully private presentations (GitHub auth required)
├── semi-private/    # Password-protected presentations
└── draft/           # Work-in-progress presentations
```

## 🔄 Sync with Main Repository

This repository is automatically synced during the build process on Vercel.

### How it works

1. When Vercel builds the main `nuxt-slides` repository
2. The `scripts/fetch-presentations.js` script runs
3. It clones this private repo using a GitHub token
4. Content is copied to the `presentations/` folder
5. The site is built with all presentations included

## 📝 Adding a Presentation

Simply create a new `.md` file in the appropriate folder:

```bash
# Private presentation (GitHub auth required)
presentations/private/super-secret-strategy.md

# Password-protected (semi-private)
presentations/semi-private/internal-roadmap.md

# Draft (admin only)
presentations/draft/upcoming-feature.md
```

Commit and push:

```bash
git add presentations/
git commit -m "Add new presentation"
git push
```

Then trigger a redeploy on Vercel to sync the new content.

## 🚀 Local Development

To test presentations locally:

1. Clone both repositories:
```bash
git clone https://github.com/ShallowRed/nuxt-slides.git
git clone https://github.com/ShallowRed/nuxt-slides-content.git
```

2. Copy presentations to the main repo:
```bash
cd nuxt-slides
cp -r ../nuxt-slides-content/presentations/* presentations/
```

3. Run the development server:
```bash
pnpm dev
```

## 🔒 Access Control

| Folder | Requirement |
|--------|-------------|
| `private/` | GitHub OAuth (admin) |
| `semi-private/` | Password or GitHub auth |
| `draft/` | Admin access |

## ⚙️ Vercel Configuration

Required environment variables in Vercel:

```
PRESENTATIONS_REPO=ShallowRed/nuxt-slides-content
PRESENTATIONS_REPO_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
```

The token needs `repo` scope to access this private repository.

## 📖 More Information

See the main repository documentation:
- [Private Presentations Setup Guide](https://github.com/ShallowRed/nuxt-slides/blob/main/docs/private-presentations.md)
- [Architecture Documentation](https://github.com/ShallowRed/nuxt-slides)
