/**
 * Storybook embed helpers.
 *
 * A deck declares a single Storybook root in its frontmatter:
 *   storybook: http://localhost:6007
 *
 * Slides then reference a story by id (`<componentId>--<storyName>`) via the
 * `:layout{story="…"}` annotation or the `<StoryFrame story="…">` component.
 * Both resolve through `buildStoryUrl` so there is one source of truth for the
 * iframe URL shape.
 */

/**
 * `sandbox` value for embedded story/app iframes.
 *
 * Crucially OMITS `allow-top-navigation` (and its by-user-activation variant):
 * embedded apps that call `window.parent.location.assign(...)` — e.g. Storybook
 * stories wired for the Storybook manager — would otherwise replace the whole
 * slides window with the Storybook URL. The flags propagate to nested iframes,
 * so a story navigated *inside* the embed also stays contained. Self-navigation
 * (plain `<a href>`) still works, so internal links browse within the embed.
 */
export const EMBED_SANDBOX
  = 'allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-storage-access-by-user-activation'

export interface StoryUrlOptions {
  /** Reveal Storybook UI chrome (toolbar) instead of the bare canvas. */
  full?: boolean
  /** Extra Storybook globals, e.g. `{ backgrounds: '!hex(fff)' }`. */
  globals?: Record<string, string>
}

/**
 * Builds the embeddable URL for a Storybook story.
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
