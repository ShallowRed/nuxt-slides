# Presentations

Presentation files organized by publication status.

## Structure

| Folder | In git | Rendering | Access |
|--------|--------|-----------|--------|
| `public/` | yes | SSG (pre-rendered) | open |
| `semi-private/` | no (synced at build) | SSR | password or auth |
| `draft/` | no (synced at build) | SSR | admin |
| `private/` | no (synced at build) | SSR | GitHub OAuth |

Non-public folders are excluded via `.gitignore` and synced from a private repository at build time on Vercel. See [docs/private-presentations.md](../docs/private-presentations.md).

## Creating a presentation

Add a `.md` file in the appropriate folder. The filename becomes the slug: `presentations/public/my-talk.md` is served at `/slides/my-talk`.

## Configuration

- Access control: `server/utils/presentations.ts`
- SSG route rules: `nuxt.config.ts`
- Presentation format: [docs/presentation-format.llm.txt](../docs/presentation-format.llm.txt)
