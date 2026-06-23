/**
 * Storybook embed URL helpers (audit §5.9 / Axe H) — pure string functions, moved
 * to the shared render layer so the live renderer, the (future) frozen embed
 * adapter, and tests share one definition of the iframe URL shape.
 *
 * A deck declares a single Storybook root in its frontmatter (`storybook: …`);
 * slides reference a story id via `:layout{story="…"}` or `<StoryFrame>`. Both
 * resolve through `buildStoryUrl` so there is exactly one URL-shape source.
 */

export interface StoryUrlOptions {
  /** Reveal Storybook UI chrome (toolbar) instead of the bare canvas. */
  full?: boolean
  /** Extra Storybook globals, e.g. `{ backgrounds: '!hex(fff)' }`. */
  globals?: Record<string, string>
}

/**
 * Build the embeddable URL for a Storybook story.
 *
 * @param base  Frontmatter `storybook` root (trailing slashes tolerated).
 * @param story Story id, e.g. `vitrine-accueil-scenario-a--page`.
 * @returns The `iframe.html?id=…` URL, or `undefined` when base/story missing.
 */
export function buildStoryUrl(
  base?: string,
  story?: string,
  options: StoryUrlOptions = {},
): string | undefined {
  if (!base || !story)
    return undefined
  const clean = base.replace(/\/+$/, '')
  const path = options.full ? 'index.html?path=/story' : 'iframe.html?id'
  const sep = options.full ? '/' : '='
  const params = new URLSearchParams()
  if (!options.full)
    params.set('viewMode', 'story')
  if (options.globals && Object.keys(options.globals).length > 0) {
    const globals = Object.entries(options.globals)
      .map(([k, v]) => `${k}:${v}`)
      .join(';')
    params.set('globals', globals)
  }
  const query = params.toString()
  return `${clean}/${path}${sep}${story}${query ? `&${query}` : ''}`
}

/**
 * Named aspect ratios for media frames, plus passthrough for raw `w/h`.
 * Returns a CSS `aspect-ratio` value.
 */
export function resolveAspectRatio(ratio?: string): string | undefined {
  if (!ratio)
    return undefined
  const named: Record<string, string> = {
    desktop: '16 / 10',
    wide: '16 / 9',
    classic: '4 / 3',
    photo: '3 / 2',
    square: '1 / 1',
    mobile: '9 / 16',
    portrait: '3 / 4',
  }
  if (named[ratio])
    return named[ratio]
  // Accept "16/9" or "16 / 9"
  if (/^\d+\s*\/\s*\d+$/.test(ratio))
    return ratio.replace(/\s+/g, ' ')
  return undefined
}
