/**
 * The single component & syntax contract (audit §5.8 / Axe G, P1bis #13).
 *
 * "What components and annotations does deck markdown support, and how is an icon
 * written?" had no single answer: the slide parser hard-coded each annotation tag
 * as a string literal in ~7 places, the MDC component map + aliases lived in
 * `config/presentation.ts`, the icon-format reconciliation lived inside a Vue
 * component, and the CodiMD preview (a separate fork) re-implemented its OWN,
 * drifting take (`ri-home-line` CSS class vs `ri:home-line` Iconify; `::Image`
 * fence rules; styled-but-unimplemented "phantom" components — PLAN.md §3).
 *
 * This module is the ONE declarative spec. The slide parser consumes the
 * annotation list (no more scattered literals); the component map derives from
 * the component list; and the CodiMD preview can be *generated* from the same
 * data instead of hand-maintaining a third, diverging definition.
 *
 * Pure and framework-free on purpose: it is plain data + pure string functions,
 * so it is shared by the parser, the config, and (going forward) the preview
 * generator, and is unit-testable without a runtime.
 */

/**
 * A slide-level annotation: a `:tag{...}` directive the parser EXTRACTS into the
 * `Slide` structure and then removes from the body (it is metadata, not content).
 * These are deliberately NOT MDC components — they never reach `MDCRenderer`.
 */
export interface DeckAnnotation {
  /** The MDC directive tag, e.g. `pretitle` for `:pretitle{text="…"}`. */
  tag: string
  /** What the annotation contributes to the slide. */
  description: string
}

/** Every slide annotation the parser understands, in one place. */
export const DECK_ANNOTATIONS: readonly DeckAnnotation[] = [
  { tag: 'slide-background', description: 'Per-slide background image override (image="…")' },
  { tag: 'pretitle', description: 'Text shown above the heading (text="…")' },
  { tag: 'subtitle', description: 'Text shown below the heading (text="…")' },
  { tag: 'layout', description: 'Slide layout + props (name="…" …props)' },
  { tag: 'quicklink', description: 'Bottom-pinned navigation link (text="…" href="…")' },
] as const

/** The annotation tags as a plain array, for membership tests in the parser. */
export const ANNOTATION_TAGS: readonly string[] = DECK_ANNOTATIONS.map(a => a.tag)

/**
 * `slide-background` is extracted on its own pass (before MDC) because it carries
 * a background URL the renderer applies to the slide element, not the body — the
 * parser handles it separately from the other annotations.
 */
export const BACKGROUND_ANNOTATION_TAG = 'slide-background'

/**
 * Annotations the parser strips AFTER the background pass (everything that is not
 * `slide-background`). Replaces the inline `['pretitle','subtitle','layout','quicklink']`
 * literal in `filterAnnotationNodes`.
 */
export const STRIPPED_ANNOTATION_TAGS: readonly string[] = ANNOTATION_TAGS.filter(
  t => t !== BACKGROUND_ANNOTATION_TAG,
)

/**
 * A deck MDC component: the markdown name authored as `::Name` / `:name`, mapped
 * to the Vue component that renders it. `aliases` are alternative authoring names
 * that resolve to the SAME component (backward-compat or shorthand).
 */
export interface DeckComponent {
  /** Canonical authoring name (and Vue component name). */
  name: string
  /** The Vue component this resolves to (defaults to `name`). */
  component?: string
  /** Alternative authoring names resolving to the same component. */
  aliases?: readonly string[]
  /** Occupies the whole slide content area (no header/body split). */
  fullSlide?: boolean
}

/**
 * Every deck component, with its aliases and full-slide flag — the single source
 * the MDC component map and the full-slide-component list both derive from.
 */
export const DECK_COMPONENTS: readonly DeckComponent[] = [
  { name: 'Quote' },
  { name: 'FullScreenImage', aliases: ['full-screen-image'], fullSlide: true },
  { name: 'Iframe' },
  { name: 'Image' },
  { name: 'Mermaid' },
  { name: 'PreviewLink' },
  { name: 'IconInline', aliases: ['i'] },
  { name: 'Columns', aliases: ['TwoColumns', 'ThreeColumns'] },
  { name: 'Highlight' },
  { name: 'StoryFrame' },
  { name: 'Screens' },
] as const

/**
 * Build the MDC component map (`{ authoringName: VueComponent }`) from the
 * contract — every name and alias resolves to its component. Replaces the
 * hand-maintained `MDC_COMPONENTS` literal.
 */
export function buildComponentMap(): Record<string, string> {
  const map: Record<string, string> = {}
  for (const c of DECK_COMPONENTS) {
    const target = c.component || c.name
    map[c.name] = target
    for (const alias of c.aliases || [])
      map[alias] = target
  }
  return map
}

/**
 * The full-slide component authoring names (canonical + aliases) — the parser
 * keeps all children in `body` when it sees one. Replaces `FULL_SLIDE_COMPONENTS`.
 */
export const FULL_SLIDE_COMPONENT_NAMES: readonly string[] = DECK_COMPONENTS
  .filter(c => c.fullSlide)
  .flatMap(c => [c.name, ...(c.aliases || [])])

/**
 * Normalise an icon name to Iconify format (`ri:home-line`). Accepts both the
 * Iconify form (already has `:`) and the Remix CSS-class form (`ri-home-line`,
 * first hyphen → colon). The ONE definition of "what is an icon name", shared by
 * the inline-icon component and the CodiMD preview generator — ending the
 * `ri:` vs `ri-` drift (Axe G, annex #18).
 */
export function normalizeIconName(name: string): string {
  if (name.includes(':'))
    return name
  return name.replace('-', ':')
}
