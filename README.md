# Nuxt Slides

A modern presentation system built with Nuxt 3, MDC, and reveal.js that converts Markdown Component files into beautiful slide decks.

## Features

- 🚀 **Nuxt 3** - Modern Vue framework with SSR/SSG support
- 📝 **MDC Support** - Write presentations in Markdown with Vue components
- 🎨 **Multiple Themes** - DSFR and Minimal themes included
- 📊 **reveal.js** - Professional presentation framework
- 🔧 **Custom Components** - Alert, Columns, Divider, Centered directives
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
│   │   └── mdc/           # Custom MDC components
│   │       ├── Alert.vue
│   │       ├── ThreeColumns.vue
│   │       ├── Divider.vue
│   │       └── Centered.vue
│   └── server/
│       └── api/           # API endpoints
│           ├── presentations.get.ts
│           └── presentations/
│               └── [slug].get.ts
├── presentations/         # Your presentation files (.md)
├── themes/               # Theme SCSS source files
└── public/
    └── themes/          # Compiled CSS themes
        ├── dsfr.css
        └── minimal.css
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

### Alert

```markdown
::alert{type="info"}
This is an informational alert
::

::alert{type="success"}
Success message
::

::alert{type="warning"}
Warning message
::

::alert{type="error"}
Error message
::
```

### Three Columns

```markdown
::columns{count="3"}

### Column 1
Content here

### Column 2
Content here

### Column 3
Content here

::
```

### Divider (Section Slide)

```markdown
::divider
# Section Title
Subtitle or description
::
```

### Centered

```markdown
::centered
# Centered Content
This content is centered vertically and horizontally
::
```

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

This project supports deploying private/protected presentations without exposing them in the public repository.

### Publication Statuses

Presentations are organized by status:
- **public/** - Open access, SSG pre-rendered, versioned in git
- **semi-private/** - Password/auth protected, SSR on-demand
- **draft/** - Admin only, SSR on-demand
- **private/** - Full GitHub auth required, SSR on-demand

### Deploying Private Content

To deploy private presentations on Vercel without publishing them:

1. Create a private repository (e.g., `nuxt-slides-content`)
2. Configure Vercel environment variables:
   ```
   PRESENTATIONS_REPO=your-org/nuxt-slides-content
   PRESENTATIONS_REPO_TOKEN=ghp_xxxxxxxxxxxx
   ```
3. The build automatically syncs private content before deployment

**Benefits:**
- ✅ Main repository stays 100% open source
- ✅ Private presentations deployed to production
- ✅ No git submodules complexity
- ✅ Simple token-based authentication

For detailed setup instructions:
- [Quick Start Guide](./docs/QUICKSTART-PRIVATE.md) - 5 minute setup
- [Full Documentation](./docs/private-presentations.md) - Complete guide
- [Token Permissions](./docs/GITHUB-TOKEN-PERMISSIONS.md) - Security best practices

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
