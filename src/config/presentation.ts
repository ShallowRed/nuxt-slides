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
 * MDC component mappings
 * Maps markdown component names to Vue components
 */
export const MDC_COMPONENTS = {
  'three-columns': 'ThreeColumns',
  'ThreeColumns': 'ThreeColumns',
  'columns': 'ThreeColumns',
  'TwoColumns': 'TwoColumns',
  'two-columns': 'TwoColumns',
  'alert': 'Alert',
  'Alert': 'Alert',
  'divider': 'Divider',
  'Divider': 'Divider',
  'centered': 'Centered',
  'Centered': 'Centered',
  'Quote': 'Quote',
  'quote': 'Quote',
  'StatCard': 'StatCard',
  'stat-card': 'StatCard',
  'ImageWithCaption': 'ImageWithCaption',
  'image-with-caption': 'ImageWithCaption',
  'Timeline': 'Timeline',
  'timeline': 'Timeline',
  'Callout': 'Callout',
  'callout': 'Callout',
  'StepsList': 'StepsList',
  'steps-list': 'StepsList',
  'ComparisonTable': 'ComparisonTable',
  'comparison-table': 'ComparisonTable',
  'Tabs': 'Tabs',
  'tabs': 'Tabs',
  'AccordionList': 'AccordionList',
  'accordion-list': 'AccordionList',
  'FullScreenImage': 'FullScreenImage',
  'full-screen-image': 'FullScreenImage',
  'Iframe': 'Iframe',
  'iframe': 'Iframe',
  'Image': 'Image',
  'image': 'Image',
  'img': 'Image',
  'SplitSlide': 'SplitSlide',
  'split-slide': 'SplitSlide',
  'Lightbox': 'Lightbox',
  'lightbox': 'Lightbox',
  'Mermaid': 'Mermaid',
  'mermaid': 'Mermaid',
  'PreviewLink': 'PreviewLink',
  'preview-link': 'PreviewLink',
  'IconInline': 'IconInline',
  'icon-inline': 'IconInline',
  'icon': 'IconInline',
  'i': 'IconInline',
  'Column': 'Column',
  'column': 'Column',
  'col': 'Column',
} as const
