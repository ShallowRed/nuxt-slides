import type { RevealConfig, ThemeBackgrounds } from '../deck/schema'

/**
 * Theme tokens manifest — the single source of truth for the *data* side of a
 * theme (audit §5.5 / Axe D, "Style Dictionary" pattern).
 *
 * Before this, "what theme X means" was scattered across three TS copies that
 * had to be kept in sync by hand:
 *   - `THEME_BACKGROUNDS` in `src/config/presentation.ts`
 *   - the per-preset `backgrounds`/`reveal` in `src/config/presets.ts`
 *   - the inlined preset definitions in `server/api/codimd/[noteId].get.ts`
 *
 * This manifest is now the one place. `shared/deck/presets.ts` and the client
 * `THEME_BACKGROUNDS` both *derive* from it, and `scripts/build-theme-tokens.ts`
 * generates an SCSS partial (`themes/shared/_tokens.generated.scss`) from the
 * same data — so backgrounds and Reveal dimensions are declared once and consumed
 * by SCSS, the client, and the server alike.
 *
 * Colors stay authored in each theme's SCSS (that remains their natural home);
 * this manifest covers the tokens that were genuinely duplicated in TS.
 */
export interface ThemeTokens {
  /** Theme name; must match `public/themes/<name>.css` and `themes/<name>/`. */
  name: string
  /** Per-heading-level background images (consumed by `getSlideBackground`). */
  backgrounds?: ThemeBackgrounds
  /** Reveal.js defaults specific to this theme (dimensions, slide numbers…). */
  reveal?: RevealConfig
  /** Default document language for preset-driven decks using this theme. */
  lang?: string
  /** Default parser mode for preset-driven decks using this theme. */
  parser?: 'heading' | 'separator'
}

export const THEME_TOKENS: Record<string, ThemeTokens> = {
  dsfr: {
    name: 'dsfr',
    lang: 'fr',
    parser: 'separator',
    backgrounds: {
      h1: '/backgrounds/slide-bg-default.png',
      h2: '/backgrounds/slide-bg-contrast.png',
      h3: '/backgrounds/slide-bg-subtle.png',
    },
    reveal: {
      slideNumber: true,
      width: 1200,
      height: 800,
    },
  },
  minimal: {
    name: 'minimal',
    lang: 'fr',
    parser: 'separator',
    reveal: {
      slideNumber: true,
    },
  },
  lee: {
    name: 'lee',
    lang: 'fr',
    parser: 'separator',
    backgrounds: {
      h1: '/backgrounds/lee-slide-contrast.png',
      h2: '/backgrounds/lee-slide-contrast.png',
      h3: '/backgrounds/lee-slide-subtle.png',
    },
    reveal: {
      slideNumber: true,
      width: 1200,
      height: 800,
    },
  },
}

/** Theme names known to the data layer (also used to validate frontmatter). */
export const KNOWN_THEMES = Object.keys(THEME_TOKENS)

/** Look up a theme's tokens, or `undefined` when the name is unknown. */
export function getThemeTokens(name?: string): ThemeTokens | undefined {
  return name ? THEME_TOKENS[name] : undefined
}

/**
 * Background images keyed by theme — derived from the manifest so the client
 * `THEME_BACKGROUNDS` no longer hand-maintains a second copy.
 */
export const THEME_BACKGROUNDS: Record<string, ThemeBackgrounds> = Object.fromEntries(
  Object.values(THEME_TOKENS).map(t => [t.name, t.backgrounds ?? {}]),
)
