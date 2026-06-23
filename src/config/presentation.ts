/**
 * Default configuration for presentations
 */

import type { PresentationMetadata } from '~/types/presentation'
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
 * Add any future full-slide components here to extend parser support.
 */
export const FULL_SLIDE_COMPONENTS = ['FullScreenImage', 'full-screen-image']

/**
 * MDC component mappings
 * Maps markdown component names to Vue components
 *
 * Note: `slide-background` is intentionally NOT listed here.
 * It is intercepted and filtered out in `utils/slide-ast.ts` before
 * the MDCRenderer ever sees it, so registering it would have no effect
 * and could cause unexpected rendering.
 */
export const MDC_COMPONENTS = {
  Quote: 'Quote',
  FullScreenImage: 'FullScreenImage',
  Iframe: 'Iframe',
  Image: 'Image',
  Mermaid: 'Mermaid',
  PreviewLink: 'PreviewLink',
  IconInline: 'IconInline',
  i: 'IconInline',
  Columns: 'Columns',
  Highlight: 'Highlight',
  // Storybook-aware media embeds
  StoryFrame: 'StoryFrame',
  Screens: 'Screens',
  // Backward-compat aliases — resolved to Columns
  TwoColumns: 'Columns',
  ThreeColumns: 'Columns',
} as const
