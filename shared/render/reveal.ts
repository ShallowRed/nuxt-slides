import type { RevealConfig } from '../deck/schema'

/**
 * Shared render utilities (audit §5.8 / §5.9, Axe G/H) — the "writer" side helpers
 * factored out of the three render targets that used to re-implement them.
 *
 * Before this, the same concerns were coded in several places:
 *   - `Reveal.initialize` config in `useReveal.ts`, `RevealPresentation.vue`,
 *     and the frozen bundle plugin (`server/plugins/nuxtout-deck.ts`);
 *   - the iframe `sandbox` policy in `utils/storybook.ts` and the overlay observer;
 *   - asset-URL rebasing by regex in the bundle plugin and the Storybook scripts.
 *
 * Centralizing them means a renderer concern is fixed once and shared by
 * `revealLive` and `revealFrozen` alike.
 */

/**
 * Default Reveal.js options forwarded to `Reveal.initialize()`.
 *
 * The single source for both the live composable and the frozen bundle (which no
 * longer hard-codes its own fallback). Per-deck `reveal:` frontmatter merges over
 * these via {@link mergeRevealConfig}.
 */
export const DEFAULT_REVEAL_CONFIG: RevealConfig = {
  hash: true,
  slideNumber: 'c/t',
  embedded: true,
  margin: 0.1,
  minScale: 0.2,
  maxScale: 2.0,
  center: false,
  controls: true,
  progress: true,
  keyboard: true,
  touch: true,
  loop: false,
  fragments: true,
  help: true,
  showNotes: false,
  autoPlayMedia: null,
  preloadIframes: null,
  autoSlide: 0,
}

/** Merge a deck's `reveal:` frontmatter over the shared defaults (one rule). */
export function mergeRevealConfig(config?: Partial<RevealConfig>): RevealConfig {
  return { ...DEFAULT_REVEAL_CONFIG, ...(config || {}) }
}

/**
 * `sandbox` value for embedded story/app iframes.
 *
 * Crucially OMITS `allow-top-navigation` (and its by-user-activation variant):
 * embedded apps that call `window.parent.location.assign(...)` — e.g. Storybook
 * stories wired for the Storybook manager — would otherwise replace the whole
 * slides window with the Storybook URL. The flags propagate to nested iframes,
 * so a story navigated *inside* the embed also stays contained. Self-navigation
 * (plain `<a href>`) still works, so internal links browse within the embed.
 *
 * The single definition for inline embeds (`StoryFrame`), the Reveal lightbox
 * overlay observer, and — going forward — the CodiMD preview.
 */
export const EMBED_SANDBOX
  = 'allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-storage-access-by-user-activation'

/**
 * Directories whose root-absolute URLs a self-contained bundle must rebase to a
 * location-relative prefix. Shared by the render hook and (conceptually) the
 * Storybook freeze scripts so the regex lives in exactly one place (Axe H).
 */
export const REBASEABLE_ASSET_DIRS = [
  '_storybook',
  'vitrine',
  'fonts',
  'images',
  'backgrounds',
  'geojson',
  'icons',
  'themes',
  'documents',
  'manifests',
] as const

/**
 * Rebase root-absolute asset URLs (`="/images/x.png"`) to `="<prefix>/images/x.png"`,
 * keyed on the PATH TARGET not the attribute name — so `src`, `href`, and the
 * Reveal lightbox's `data-preview-link` are all covered. Value rewriting only,
 * never tag removal.
 */
export function rebaseAssetUrls(html: string, prefix: string): string {
  const dirs = REBASEABLE_ASSET_DIRS.join('|')
  const re = new RegExp(`(=")/((?:${dirs})/[^"]*)`, 'g')
  return html.replace(re, `$1${prefix}/$2`)
}
