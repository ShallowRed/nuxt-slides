# Nuxt Slides - Private Content

Private presentations for [nuxt-slides](https://github.com/ShallowRed/nuxt-slides).

## Structure

```
presentations/
├── private/         # GitHub auth required
├── semi-private/    # Password-protected
└── draft/           # Admin only
```

## Usage

Add `.md` files to the appropriate folder, commit, and push. Trigger a Vercel redeploy to sync.

For local development, copy content into the main repo's `presentations/` folder:

```bash
cd nuxt-slides
cp -r ../nuxt-slides-content/presentations/* presentations/
pnpm dev
```

## Vercel configuration

Required environment variables:

```
PRESENTATIONS_REPO=ShallowRed/nuxt-slides-content
PRESENTATIONS_REPO_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
```

See [private presentations docs](https://github.com/ShallowRed/nuxt-slides/blob/main/docs/private-presentations.md) for details.
