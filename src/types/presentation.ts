/**
 * Core type definitions for the presentation system.
 *
 * The canonical `Slide`, `RevealConfig`, and `ThemeBackgrounds` shapes now live in
 * the framework-agnostic deck core (`shared/deck`, audit §5.8) so there is a single
 * definition consumed by parsers, renderers, the server, and tests alike. They are
 * re-exported here for backward compatibility with existing `~/types` imports.
 */

import type { RevealConfig, Slide, ThemeBackgrounds } from '#shared/deck'

export type { RevealConfig, Slide, ThemeBackgrounds }

/**
 * Publication status based on folder location
 * - public: Visible to everyone, prerendered (SSG)
 * - draft: Only visible to authenticated owner
 * - private: Only accessible to authenticated users
 * - semi-private: Accessible via password (no login required)
 */
export type PublicationStatus = 'public' | 'draft' | 'private' | 'semi-private'
export interface PresentationMeta {
  title?: string
  lang?: string
  theme?: string
  backgrounds?: ThemeBackgrounds
  /**
   * Base URL of a published Storybook (no trailing `iframe.html`).
   * When set, a slide's `:layout{story="<storyId>"}` resolves to
   * `<storybook>/iframe.html?id=<storyId>&viewMode=story` and is embedded
   * as an iframe in the media pane. Example: `https://storybook.example.com`
   * or `http://localhost:6006`.
   */
  storybook?: string
  /**
   * Slide parser mode:
   * - 'heading' (default): splits slides by H1/H2/H3 headings
   * - 'separator': splits by --- (horizontal) and ---- (vertical)
   */
  parser?: 'heading' | 'separator'
}

/**
 * Full presentation metadata from frontmatter
 * - reveal: Reveal.js configuration
 * - Everything else: custom metadata
 */
export interface PresentationMetadata extends PresentationMeta {
  reveal?: RevealConfig
  // Legacy support: flat Reveal.js options (deprecated)
  transition?: string
  center?: boolean
  // For semi-private presentations: hashed password
  accessPassword?: string
  [key: string]: any
}

export interface PresentationData {
  slides: Slide[]
  metadata: PresentationMetadata
  editUrl?: string
}

/**
 * Presentation list item returned by GET /api/presentations
 */
export interface PresentationListItem {
  slug: string
  title: string
  theme: string
  status: PublicationStatus
  filename: string
}
