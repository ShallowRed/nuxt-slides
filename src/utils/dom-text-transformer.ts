/**
 * DOM Text Transformer
 *
 * Generic utility for applying text transformations to DOM nodes.
 * Framework-agnostic: works with any JavaScript environment that has DOM access.
 */

// =============================================================================
// TYPES
// =============================================================================

/**
 * Function signature for text transformation.
 */
export type TextTransformer = (text: string) => string

/**
 * Configuration options for DOM text processing.
 */
export interface DomTextTransformerOptions {
  /**
   * Function that transforms text content.
   */
  transform: TextTransformer

  /**
   * HTML tag names to skip (their content won't be transformed).
   * @default ['script', 'style', 'code', 'pre', 'textarea', 'input']
   */
  skipElements?: string[]
}

// =============================================================================
// DEFAULT CONFIGURATION
// =============================================================================

const DEFAULT_SKIP_ELEMENTS = [
  'script',
  'style',
  'code',
  'pre',
  'textarea',
  'input',
]

// =============================================================================
// DOM TEXT TRANSFORMER CLASS
// =============================================================================

/**
 * Utility class for applying text transformations to DOM elements.
 *
 * Features:
 * - Recursive processing of all text nodes
 * - Configurable element skipping
 * - MutationObserver support for dynamic content
 *
 * @example
 * const transformer = new DomTextTransformer({
 *   transform: (text) => text.toUpperCase(),
 *   skipElements: ['code', 'pre']
 * })
 *
 * transformer.processNode(document.body)
 */
export class DomTextTransformer {
  private readonly transform: TextTransformer
  private readonly skipElements: Set<string>

  constructor(options: DomTextTransformerOptions) {
    this.transform = options.transform
    this.skipElements = new Set(
      (options.skipElements ?? DEFAULT_SKIP_ELEMENTS).map(tag => tag.toLowerCase()),
    )
  }

  /**
   * Process a DOM node and all its descendants, applying the text transformation.
   *
   * @param node - The DOM node to process
   */
  processNode(node: Node): void {
    if (node.nodeType === Node.TEXT_NODE && node.textContent) {
      const transformed = this.transform(node.textContent)
      if (transformed !== node.textContent) {
        node.textContent = transformed
      }
    }
    else if (node.nodeType === Node.ELEMENT_NODE) {
      const tagName = (node as Element).tagName.toLowerCase()

      if (this.skipElements.has(tagName)) {
        return
      }

      node.childNodes.forEach(child => this.processNode(child))
    }
  }

  /**
   * Create a MutationObserver that automatically processes new content.
   *
   * @param element - The element to observe
   * @returns The configured MutationObserver (already started)
   */
  createObserver(element: HTMLElement): MutationObserver {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        // Process newly added nodes
        mutation.addedNodes.forEach((node) => {
          this.processNode(node)
        })

        // Process modified text content
        if (mutation.type === 'characterData' && mutation.target.textContent) {
          const transformed = this.transform(mutation.target.textContent)
          if (transformed !== mutation.target.textContent) {
            mutation.target.textContent = transformed
          }
        }
      })
    })

    observer.observe(element, {
      childList: true,
      subtree: true,
      characterData: true,
    })

    return observer
  }
}

// =============================================================================
// CONVENIENCE FUNCTIONS
// =============================================================================

/**
 * Create a DOM text transformer with the given options.
 *
 * @param options - Transformer configuration
 * @returns A new DomTextTransformer instance
 */
export function createDomTextTransformer(
  options: DomTextTransformerOptions,
): DomTextTransformer {
  return new DomTextTransformer(options)
}
