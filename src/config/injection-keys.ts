import type { ComputedRef, InjectionKey } from 'vue'

/**
 * Injection keys shared between the slide engine and MDC components.
 *
 * `STORYBOOK_BASE` carries the deck's frontmatter `storybook` root URL down to
 * components like `<StoryFrame>` / `<Screens>` so they can resolve story ids
 * without each author repeating the base URL.
 */
export const STORYBOOK_BASE: InjectionKey<ComputedRef<string | undefined>>
  = Symbol('storybookBase')
