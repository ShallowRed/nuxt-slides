# Nuxt Slides

A modern presentation system built with Nuxt 3, MDC, and reveal.js that converts Markdown Component files into beautiful slide decks.

## Features

- 🚀 **Nuxt 3** - Modern Vue framework with SSR/SSG support
- 📝 **MDC Support** - Write presentations in Markdown with Vue components
- 🎨 **Multiple Themes** - DSFR and Minimal themes included
- 📊 **reveal.js** - Professional presentation framework
- 🔧 **Custom Components** - Columns, Quote, Image, media layouts, and more
- 🎯 **File-based Routing** - Auto-discover presentations from `presentations/` folder
- ⬇️ **Vertical Slides** - Support for both `----` markers and `###` headings
- 🎭 **Dynamic Theming** - Per-presentation theme selection

## Quick Start

### Installation

```bash
# Clone the repository
cd nuxt-slides

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Visit `http://localhost:3000` to see the list of presentations.

### Create a Presentation

Create a new `.md` file in the `presentations/` directory:

```markdown
---
title: "My Presentation"
theme: dsfr  # or 'minimal'
---

# First Slide

Welcome to my presentation

---

# Second Slide

This is the second slide
```

## Project Structure

```
nuxt-slides/
├── src/
│   ├── app.vue            # Root component
│   ├── pages/
│   │   ├── index.vue      # List all presentations
│   │   └── slides/
│   │       └── [slug].vue # Dynamic presentation route
│   ├── components/
│   │   ├── RevealPresentation.vue  # reveal.js wrapper
│   │   ├── IconInline.vue          # Inline icon (Iconify)
│   │   └── mdc/           # Custom MDC components
│   │       ├── Columns.vue
│   │       ├── Quote.vue
│   │       ├── Image.vue
│   │       ├── FullScreenImage.vue
│   │       ├── Iframe.vue
│   │       ├── Mermaid.vue
│   │       └── PreviewLink.vue
│   ├── composables/       # Reusable logic
│   ├── config/            # Presentation & theme config
│   └── server/
│       └── api/           # API endpoints
├── presentations/         # Your presentation files (.md)
├── themes/               # Theme SCSS source files
└── public/
    └── themes/          # Compiled CSS themes
```

## Presentation Format

### Frontmatter

Every presentation should start with frontmatter:

```yaml
---
title: Presentation Title
theme: dsfr # or 'minimal'
transition: slide # optional
center: true # optional
---
```

### Horizontal Slides

Separate slides with `---` (3 dashes):

```markdown
# First Slide

---

# Second Slide

---

# Third Slide
```

### Vertical Slides

Within a horizontal slide, create vertical slides using:

**Method 1: Four dashes**
```markdown
# Main Topic

----

More details

----

Even more details
```

**Method 2: H3 headings**
```markdown
### First Vertical

Content

### Second Vertical

Content
```

## MDC Components

### Columns

```markdown
:::Columns
::column
Left content
::
::column
Right content
::
:::
```

### Quote

```markdown
::Quote{author="Author Name" source="Source"}
Quoted text here
::
```

### Image

```markdown
::Image{src="/path/to/image.png" alt="Description" width="60%"}
Optional caption text
::
```

### Media Layout

```markdown
### Slide Title
:layout{name="media-right" src="https://example.com" type="iframe"}

Description text next to the iframe.
```

Supported layouts: `media-right`, `media-left`, `media-right-wide`, `media-left-wide`, `media-right-xwide`, `media-left-xwide` (caption rail + dominant media), `media-below` / `media-above` (stacked), `media-cover` (full-bleed with floating caption). The heading and body render in a content column alongside the media.

Supported props: `src` (required unless `story` is set), `type` (`iframe` or `image`), `alt`, `title`, `lightbox`, `fit` (`cover` by default, or `contain` for a floating image without container chrome).

#### Several screens on one slide

Compare multiple stories or screenshots side by side with `Screens` + `StoryFrame`:

```markdown
:::Screens{cols="3" gap="1rem"}
::StoryFrame{story="my-component--a" ratio="desktop" label="Option A" lightbox}
::
::StoryFrame{story="my-component--b" ratio="desktop" label="Option B" lightbox}
::
::StoryFrame{story="my-component--c" ratio="desktop" label="Option C" lightbox}
::
:::
```

`StoryFrame` resolves a `story` id against the frontmatter `storybook` root (or takes a raw `src`), with `ratio` (`desktop`, `wide`, `mobile`, `portrait`, `16/9`…), `fit`, `label`, and `lightbox` props.

#### Live Storybook embeds

Declare a `storybook` base URL in the frontmatter, then reference a story by id with the `story` prop:

```markdown
---
title: "Design iterations"
storybook: http://localhost:6006
---

### My component, live
:layout{name="media-right-wide" story="my-component--page" lightbox="true"}

What we are testing, next to the live story.
```

The `story` value (`<componentId>--<storyName>`) resolves to `<storybook>/iframe.html?id=<story>&viewMode=story` and renders as a live iframe — slides stay in sync with the design system, no screenshots to regenerate.

For the full component reference, see [docs/presentation-format.llm.txt](./docs/presentation-format.llm.txt).

## Themes

### DSFR Theme
Based on the French Government Design System (Système de Design de l'État Français):
- Professional and official
- Blue color scheme
- Marianne font family

### Minimal Theme
Clean and modern design:
- Simple and elegant
- Light color scheme
- Helvetica font family

## Private Presentations

Non-public presentations (private, semi-private, draft) are stored in a separate private repository and synced at build time on Vercel via `scripts/fetch-presentations.js`. The main repository stays fully open source.

| Status | Access | Rendering |
|--------|--------|-----------|
| public | open | SSG |
| semi-private | password/auth | SSR |
| draft | admin | SSR |
| private | GitHub OAuth | SSR |

See [docs/private-presentations.md](./docs/private-presentations.md) for setup.

## Two-Repository Setup

This project spans two codebases:

| Repo | Role | Local path |
|------|------|------------|
| `ShallowRed/nuxt-slides` | Presentation renderer (Nuxt 3) | `~/Projects/nuxt-slides` |
| `ShallowRed/codimd` | Live markdown editor (CodiMD fork) | `~/Projects/codimd` |

The CodiMD fork adds MDC component preview (syntax highlighting, layout rendering) so authors can preview slides while editing. It deploys to Scalingo separately.

**Remotes for CodiMD:**
- `origin` → `ShallowRed/codimd` (our fork on GitHub)
- `upstream` → `hackmdio/codimd` (upstream)
- `scalingo` → Scalingo deployment

A VS Code multi-root workspace file (`nuxt-slides.code-workspace`) includes both repos for unified search and editing.

## Development

```bash
# Development server with theme compilation
pnpm dev

# Watch and rebuild specific theme during development
pnpm dev:theme dsfr

# Build for production (SSR)
pnpm build

# Generate static site (SSG)
pnpm generate

# Preview static build
pnpm preview:static

# Preview production build
pnpm preview
```

## Static Site Generation (SSG)

This project fully supports static site generation. All presentations are automatically discovered and pre-rendered at build time.

```bash
# Generate static site
pnpm generate

# Output is in .output/public/ - ready to deploy!
```

**Deployment options:**
- Netlify, Vercel, Cloudflare Pages
- GitHub Pages
- Any static hosting service

For detailed SSG configuration and deployment guides, see [SSG.md](./SSG.md).

## Architecture

This project follows clean architecture principles with clear separation of concerns:
- **Types**: Centralized type definitions
- **Config**: Configuration constants
- **Composables**: Reusable business logic
- **Components**: Presentational components
- **Pages**: Route pages

For detailed architecture documentation, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## Navigation

### Keyboard Shortcuts
- `→` / `←` - Navigate horizontal slides
- `↓` / `↑` - Navigate vertical slides
- `Space` - Next slide
- `Esc` - Slide overview
- `F` - Fullscreen
- `S` - Speaker notes (if enabled)

## Technologies

- [Nuxt 3](https://nuxt.com/) - The Intuitive Vue Framework
- [@nuxtjs/mdc](https://github.com/nuxt-content/mdc) - MDC Parser for Nuxt
- [reveal.js](https://revealjs.com/) - HTML Presentation Framework
- [Sass](https://sass-lang.com/) - CSS Preprocessor

## License

MIT

## Credits

Built with ❤️ using Nuxt + MDC + reveal.js
