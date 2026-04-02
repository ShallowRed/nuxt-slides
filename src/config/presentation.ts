/**
 * Default configuration for presentations
 */

import type { PresentationMetadata, RevealConfig, ThemeBackgrounds } from '~/types/presentation'

export const DEFAULT_METADATA: PresentationMetadata = {
  theme: 'minimal',
  transition: 'slide',
  center: true,
}

/**
 * Theme-specific background images
 * Maps theme names to background configurations by heading level
 */
export const THEME_BACKGROUNDS: Record<string, ThemeBackgrounds> = {
  dsfr: {
    h1: '/backgrounds/slide-bg-default.png',
    h2: '/backgrounds/slide-bg-contrast.png',
    h3: '/backgrounds/slide-bg-subtle.png',
    // h2: '/backgrounds/dsfr-section.jpg',
    // h3: undefined (inherits from parent)
    // default: undefined
  },
  minimal: {
    // No backgrounds by default
  },
  // Add more themes as needed
}

/**
 * Get background image for a slide based on theme and heading level
 */
export function getSlideBackground(theme: string, headingLevel?: string, customBackgrounds?: ThemeBackgrounds): string | undefined {
  // Priority: 1. Custom backgrounds from frontmatter, 2. Theme defaults
  const backgrounds = customBackgrounds || THEME_BACKGROUNDS[theme]

  if (!backgrounds)
    return undefined

  // Check for specific heading level
  if (headingLevel && backgrounds[headingLevel as keyof ThemeBackgrounds])
    return backgrounds[headingLevel as keyof ThemeBackgrounds]

  // Fallback to default
  return backgrounds.default
}

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

/**
 * Components that occupy the full slide content area.
 * When the parser detects any of these as a top-level node, it keeps all
 * children in `body` without splitting into header/body.
 * Add any future full-slide components here to extend parser support.
 */
export const FULL_SLIDE_COMPONENTS = ['SplitSlide', 'split-slide', 'FullScreenImage', 'full-screen-image']

/**
 * MDC component mappings
 * Maps markdown component names to Vue components
 *
 * Note: `slide-background` is intentionally NOT listed here.
 * It is intercepted and filtered out in `useSlideParser.ts` before
 * the MDCRenderer ever sees it, so registering it would have no effect
 * and could cause unexpected rendering.
 */
export const MDC_COMPONENTS = {
  ThreeColumns: 'ThreeColumns',
  TwoColumns: 'TwoColumns',
  Centered: 'Centered',
  Quote: 'Quote',
  FullScreenImage: 'FullScreenImage',
  Iframe: 'Iframe',
  Image: 'Image',
  SplitSlide: 'SplitSlide',
  Mermaid: 'Mermaid',
  PreviewLink: 'PreviewLink',
  IconInline: 'IconInline',
  i: 'IconInline',
  Callout: 'Callout',
  Columns: 'Columns',
  // Backward-compat aliases — resolved to Columns
  TwoColumns: 'Columns',
  ThreeColumns: 'Columns',
} as const
