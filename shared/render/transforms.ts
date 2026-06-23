import type { AssetRef, DeckModel, Slide } from '../deck/model'
import type { DeckMeta, ThemeBackgrounds } from '../deck/schema'
import { getThemeTokens } from '../theme/tokens'
import { buildStoryUrl } from './storybook'

/**
 * Named transformation pipeline (audit §7 P2 #8 / §4.3 Slidev preparser,
 * §4.5 Pandoc filters).
 *
 * The "semantic transformations" (resolve a `:layout{story=…}` to an iframe URL,
 * decide media scaling, pick a slide background by heading level, collect embedded
 * assets) used to be scattered across `SlideContent.vue`, `slide-rendering.ts`,
 * `storybook.ts`, and the bundle plugin. Here each one is a **named, pure,
 * composable** step over the deck model — a home for them, and the unit of test.
 */

// ---------------------------------------------------------------------------
// Slide media resolution (was inlined in SlideContent.vue `mediaParts`)
// ---------------------------------------------------------------------------

export interface SlideMedia {
  src: string
  type?: string
  title: string
  alt: string
  fit: 'cover' | 'contain'
  scaled: boolean
  interactive: boolean
  previewWidth: number
  hasLightbox: boolean
  hint?: string
  previewLink?: string
  previewImage?: string
}

/** Object-fit strategy for a media pane (`contain` only when explicitly asked). */
export function getMediaFit(layoutProps?: Record<string, string>): 'cover' | 'contain' {
  return layoutProps?.fit === 'contain' ? 'contain' : 'cover'
}

/**
 * Resolve a slide's media pane from its `layoutProps` and the deck's `storybook`
 * base. Faithful to the original `SlideContent.mediaParts` logic, extracted so it
 * is shared and testable. Returns `null` when the slide has no media.
 */
export function resolveSlideMedia(
  layoutProps: Record<string, string> | undefined,
  opts: { storybook?: string } = {},
): SlideMedia | null {
  const lp = layoutProps
  if (!lp)
    return null

  // Storybook shortcut: `:layout{story="<id>"}` resolves against the frontmatter
  // `storybook` base URL and embeds as an iframe; falls back to explicit src/type.
  const storySrc = lp.story ? buildStoryUrl(opts.storybook, lp.story) : undefined
  const src = storySrc ?? lp.src
  if (!src)
    return null

  const type = storySrc ? 'iframe' : lp.type
  const fit = getMediaFit(lp)
  // `previewWidth` (logical desktop px) drives the iframe zoom-out. MDC kebab-cases
  // camelCase attribute keys, so `previewWidth="1600"` arrives as `preview-width` —
  // check that first, with the camel/lower forms as fallbacks.
  const previewWidthRaw = lp['preview-width'] ?? lp.previewWidth ?? lp.previewwidth
  const parsed = previewWidthRaw ? Number.parseInt(previewWidthRaw, 10) : 1440
  const previewWidth = Number.isFinite(parsed) && parsed > 0 ? parsed : 1440
  const scaled = type === 'iframe' && lp.raw == null && fit !== 'contain'
  const hasLightbox = Boolean(lp.lightbox)

  return {
    src,
    type,
    title: lp.title || '',
    alt: lp.alt || '',
    fit,
    scaled,
    // Without a lightbox, a scaled story embed is interactive in place: clicks
    // browse *inside* the iframe (sandboxed, so it can't escape the slides).
    interactive: scaled && !hasLightbox,
    previewWidth,
    hasLightbox,
    hint: lp.hint || undefined,
    previewLink: (lp.lightbox && type === 'iframe') ? src : undefined,
    previewImage: (lp.lightbox && type !== 'iframe') ? src : undefined,
  }
}

// ---------------------------------------------------------------------------
// Background resolution (mirrors slide-rendering.resolveSlideBackground)
// ---------------------------------------------------------------------------

/**
 * Resolve a slide's background image, preserving the original precedence:
 *   1. an explicit slide-level `backgroundImage` override;
 *   2. the deck frontmatter `backgrounds` map (`customBackgrounds`), if given;
 *   3. otherwise the theme tokens' per-heading-level background (audit §5.5).
 * Pure, so it works the same on client, server, and in the IR.
 */
export function resolveSlideBackground(
  slide: Pick<Slide, 'headingLevel' | 'backgroundImage'>,
  theme?: string,
  customBackgrounds?: ThemeBackgrounds,
): string | undefined {
  if (slide.backgroundImage)
    return slide.backgroundImage
  const backgrounds = customBackgrounds ?? getThemeTokens(theme)?.backgrounds
  if (!backgrounds)
    return undefined
  const level = slide.headingLevel as keyof ThemeBackgrounds | undefined
  if (level && backgrounds[level])
    return backgrounds[level]
  return backgrounds.default
}

// ---------------------------------------------------------------------------
// Asset collection (populates DeckModel.assets for centralized rebasing)
// ---------------------------------------------------------------------------

/**
 * Walk a deck's slides and collect the external assets they reference (storybook
 * iframes, layout media, slide backgrounds). This is what lets a renderer rebase
 * every asset in one place (audit §5.8/§5.9) instead of re-deriving them per path.
 */
export function collectAssets(slides: Slide[], meta: Pick<DeckMeta, 'storybook' | 'theme' | 'backgrounds'>): AssetRef[] {
  const assets: AssetRef[] = []
  const seen = new Set<string>()
  const push = (kind: AssetRef['kind'], url: string | undefined, origin: string) => {
    if (!url || seen.has(`${kind}:${url}`))
      return
    seen.add(`${kind}:${url}`)
    assets.push({ kind, url, origin })
  }

  const visit = (slide: Slide, origin: string) => {
    const media = resolveSlideMedia(slide.layoutProps, { storybook: meta.storybook })
    if (media) {
      if (media.type === 'iframe')
        push(slide.layoutProps?.story ? 'storybook' : 'iframe', media.src, origin)
      else
        push('image', media.src, origin)
    }
    push('image', resolveSlideBackground(slide, meta.theme, meta.backgrounds), `${origin}/background`)
    slide.verticalSlides?.forEach((vs, i) => visit(vs, `${origin}/v${i}`))
  }

  slides.forEach((slide, i) => visit(slide, `slide[${i}]`))
  return assets
}

// ---------------------------------------------------------------------------
// Named pipeline runner + DeckModel builder
// ---------------------------------------------------------------------------

/** A named transform step over a deck model (Pandoc-style AST→AST filter). */
export interface DeckTransform {
  readonly name: string
  apply: (model: DeckModel) => DeckModel
}

/** Run an ordered list of named transforms over a model. */
export function runTransforms(model: DeckModel, transforms: readonly DeckTransform[]): DeckModel {
  return transforms.reduce((acc, t) => t.apply(acc), model)
}

/** Transform: (re)compute `assets` from the current slides + meta. */
export const collectAssetsTransform: DeckTransform = {
  name: 'collect-assets',
  apply: model => ({ ...model, assets: collectAssets(model.slides, model.meta) }),
}

/** The default transform pipeline applied when building a `DeckModel`. */
export const DEFAULT_TRANSFORMS: readonly DeckTransform[] = [collectAssetsTransform]

/**
 * Build a normalized `DeckModel` (IR) from resolved meta + parsed slides, running
 * the named transform pipeline (audit §5.8 + §7 P2 #8). The single place that
 * assembles "what this deck is" for serialization and renderers.
 */
export function buildDeckModel(
  meta: DeckMeta,
  slides: Slide[],
  options: { parser?: string, source?: string, transforms?: readonly DeckTransform[] } = {},
): DeckModel {
  const base: DeckModel = {
    meta,
    slides,
    assets: [],
    provenance: { parser: options.parser ?? 'heading', source: options.source },
  }
  return runTransforms(base, options.transforms ?? DEFAULT_TRANSFORMS)
}
