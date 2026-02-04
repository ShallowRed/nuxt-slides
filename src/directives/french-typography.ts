/**
 * Vue Directive: French Typography
 *
 * Vue directive that applies French orthotypographic rules to element content.
 * Uses the generic DomTextTransformer with French-specific transformation rules.
 */

import type { Directive } from 'vue'
import { DomTextTransformer } from '~/utils/dom-text-transformer'
import { transformerTexte } from '~/utils/french-typography'

// =============================================================================
// OBSERVER STORAGE
// =============================================================================

/**
 * WeakMap to store MutationObservers associated with each element.
 * Using WeakMap prevents memory leaks: entries are automatically
 * removed when the element is garbage collected.
 */
const observers = new WeakMap<HTMLElement, MutationObserver>()

// =============================================================================
// TRANSFORMER INSTANCE
// =============================================================================

/**
 * Shared transformer instance configured with French typography rules.
 */
const frenchTypographyTransformer = new DomTextTransformer({
  transform: transformerTexte,
  skipElements: ['script', 'style', 'code', 'pre', 'textarea', 'input'],
})

// =============================================================================
// VUE DIRECTIVE
// =============================================================================

/**
 * Vue directive for French orthotypography.
 *
 * Automatically transforms text content within the element to follow
 * French typographic conventions (proper spacing around punctuation,
 * French quotes, typographic apostrophes, etc.).
 *
 * Also watches for dynamic content changes (useful for async MDC/Markdown
 * rendering) and applies transformations to newly added elements.
 *
 * @example
 * ```vue
 * <template>
 *   <article v-french-typography>
 *     <h1>Bienvenue !</h1>
 *     <p>Voici un exemple : « C'est magnifique ! »</p>
 *   </article>
 * </template>
 * ```
 */
export const vFrenchTypography: Directive<HTMLElement> = {
  /**
   * Called when the element is mounted to the DOM.
   * Processes existing content and sets up observer for dynamic content.
   */
  mounted(element: HTMLElement) {
    // Process initial content
    frenchTypographyTransformer.processNode(element)

    // Set up observer for dynamic content (MDC renders asynchronously)
    const observer = frenchTypographyTransformer.createObserver(element)
    observers.set(element, observer)
  },

  /**
   * Called when the element is unmounted from the DOM.
   * Cleans up the MutationObserver to prevent memory leaks.
   */
  unmounted(element: HTMLElement) {
    const observer = observers.get(element)
    if (observer) {
      observer.disconnect()
      observers.delete(element)
    }
  },
}
