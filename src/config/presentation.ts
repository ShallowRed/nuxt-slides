/**
 * Default configuration for presentations
 */

import type { PresentationMetadata } from '~/types/presentation'
import { buildComponentMap, FULL_SLIDE_COMPONENT_NAMES } from '#shared/deck'
import { DEFAULT_REVEAL_CONFIG } from '#shared/render'
import { THEME_BACKGROUNDS } from '#shared/theme/tokens'

export const DEFAULT_METADATA: PresentationMetadata = {
  theme: 'minimal',
  transition: 'slide',
  center: true,
}

/**
 * Theme-specific background images.
 *
 * Re-exported from the single theme tokens manifest (`shared/theme/tokens.ts`,
 * audit §5.5) so there is no longer a hand-maintained second copy here. Kept as a
 * named export for backward compatibility with existing imports.
 */
export { THEME_BACKGROUNDS }

/**
 * Default Reveal.js init config.
 *
 * Re-exported from the shared render utilities (`shared/render/reveal.ts`,
 * audit §5.8) so the live composable, the SSG component, and the frozen bundle
 * plugin all init Reveal from one definition instead of three.
 */
export { DEFAULT_REVEAL_CONFIG }

/**
 * Components that occupy the full slide content area.
 * When the parser detects any of these as a top-level node, it keeps all
 * children in `body` without splitting into header/body.
 *
 * Derived from the single component contract (`shared/deck/components.ts`,
 * audit §5.8 / #13) — add the `fullSlide: true` flag there to extend support.
 */
export const FULL_SLIDE_COMPONENTS = FULL_SLIDE_COMPONENT_NAMES

/**
 * MDC component mappings — maps markdown component names (and aliases) to Vue
 * components, derived from the single component contract
 * (`shared/deck/components.ts`, audit §5.8 / #13) so there is no longer a
 * hand-maintained second list that can drift from the parser/preview.
 *
 * Note: `slide-background` is intentionally NOT a component — it is a slide
 * annotation (see `DECK_ANNOTATIONS`), intercepted and filtered out in
 * `utils/slide-ast.ts` before the MDCRenderer ever sees it.
 */
export const MDC_COMPONENTS = buildComponentMap()
