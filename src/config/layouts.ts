/**
 * Layout registry for slide rendering strategies.
 *
 * Two rendering strategies exist:
 * - 'full'    : The entire slide content is rendered by a single MDCRenderer
 *               (no header/body split, no media pane). Used for layouts that
 *               take over the whole slide area (e.g. FullScreenImage).
 * - 'default' : Standard header / article structure with an optional media pane
 *               added via CSS grid. Used for all media-* layouts and the bare
 *               (no-layout) case.
 *
 * To add a new layout that requires its own component tree, add a 'full'-like
 * strategy value here and handle it in SlideContent.vue.
 * To add a new layout that is purely CSS-driven, register it as 'default' —
 * no template change needed.
 */

export type LayoutStrategy = 'full' | 'default'

export const SLIDE_LAYOUT_REGISTRY: Record<string, LayoutStrategy> = {
  full: 'full',
  'media-right': 'default',
  'media-left': 'default',
  'media-right-wide': 'default',
  'media-left-wide': 'default',
}

/**
 * Returns the rendering strategy for a given layout name.
 * Falls back to 'default' for unregistered or absent layouts.
 */
export function getLayoutStrategy(layout?: string): LayoutStrategy {
  if (!layout)
    return 'default'
  return SLIDE_LAYOUT_REGISTRY[layout] ?? 'default'
}
