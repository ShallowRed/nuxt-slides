import type { Slide } from '~/types/presentation'
import type { ThemeBackgrounds } from '~/types/presentation'
import { getSlideBackground } from '~/config/presentation'

/**
 * Splits a quicklink text like "Pressé·e ? Ce qui a changé" into
 * { prefix: "Pressé·e ?", label: "Ce qui a changé" }.
 * Returns null when no " ? " separator is found.
 */
export function quicklinkParts(text: string): { prefix: string, label: string } | null {
  const idx = text.indexOf(' ? ')
  if (idx === -1)
    return null
  return { prefix: text.slice(0, idx + 2), label: text.slice(idx + 3) }
}

/**
 * Returns the object-fit strategy for a media pane.
 * Defaults to 'cover'; use 'contain' when layoutProps.fit === 'contain'.
 */
export function getMediaFit(layoutProps?: Record<string, string>): 'cover' | 'contain' {
  return layoutProps?.fit === 'contain' ? 'contain' : 'cover'
}

/**
 * Returns the CSS class list for a slide <section>.
 * Combines heading-level class and optional layout class.
 */
export function getSlideClasses(slide: Pick<Slide, 'headingLevel' | 'layout'>): string[] {
  const classes: string[] = []
  if (slide.headingLevel)
    classes.push(`slide-${slide.headingLevel}`)
  if (slide.layout)
    classes.push(`layout-${slide.layout}`)
  return classes
}

/**
 * Resolves the background image for a slide.
 * Slide-level override takes priority over theme defaults.
 */
export function resolveSlideBackground(
  slide: Pick<Slide, 'headingLevel' | 'backgroundImage'>,
  theme: string,
  customBackgrounds?: ThemeBackgrounds,
): string | undefined {
  if (slide.backgroundImage)
    return slide.backgroundImage
  return getSlideBackground(theme, slide.headingLevel, customBackgrounds)
}
