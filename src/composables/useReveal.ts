/**
 * Composable for managing Reveal.js instance
 * Handles initialization, configuration, and lifecycle
 *
 * Important: Reveal.js needs to be synced after dynamic content changes
 * to properly handle:
 * - Preview overlays (data-preview-image, data-preview-video, data-preview-link)
 * - Fragments (.fragment elements)
 * - Auto-animate (data-auto-animate)
 * - Embedded content (iframes, videos, audio)
 * - Slide backgrounds
 */

import type { Ref } from 'vue'
import type { RevealConfig } from '~/types/presentation'
import { DEFAULT_REVEAL_CONFIG } from '~/config/presentation'
import { EMBED_SANDBOX } from '~/utils/storybook'

export function useReveal(
  container: Ref<HTMLElement | null>,
  config: Partial<RevealConfig> = {},
) {
  let revealInstance: any = null
  let overlayObserver: MutationObserver | null = null

  /**
   * Reveal's built-in preview overlay (`data-preview-link` / `data-preview-image`)
   * creates its OWN iframe that we don't render — so it escapes the `sandbox`
   * we put on inline embeds. Without containment, an internal Storybook link
   * clicked *inside the lightbox* navigates the whole slides window away.
   *
   * This watches for the overlay iframe and applies the same `EMBED_SANDBOX`
   * (no `allow-top-navigation`), re-loading it under the policy. Result: every
   * embed — inline `:layout`, `<StoryFrame>`, and lightbox — shares one pattern.
   */
  function sandboxOverlayIframes() {
    const root = container.value
    if (!root)
      return
    const iframes = root.querySelectorAll<HTMLIFrameElement>(
      '.r-overlay iframe:not([data-embed-sandboxed])',
    )
    iframes.forEach((iframe) => {
      iframe.setAttribute('sandbox', EMBED_SANDBOX)
      iframe.setAttribute('data-embed-sandboxed', '')
      // Re-trigger the load so the sandbox policy applies to the document.
      const src = iframe.getAttribute('src')
      if (src)
        iframe.setAttribute('src', src)
    })
  }

  function observeOverlays() {
    if (typeof window === 'undefined' || !container.value)
      return
    overlayObserver = new MutationObserver(() => sandboxOverlayIframes())
    overlayObserver.observe(container.value, { childList: true, subtree: true })
  }

  /**
   * Initialize Reveal.js with the provided configuration
   */
  async function initialize() {
    if (!container.value)
      return

    // Dynamic import to avoid SSR issues
    const { default: Reveal } = await import('reveal.js')

    const mergedConfig = {
      ...DEFAULT_REVEAL_CONFIG,
      ...config,
    }

    revealInstance = new Reveal(container.value, mergedConfig)
    await revealInstance.initialize()

    // Sync after initialization to pick up dynamically rendered content
    // This is crucial for Vue/Nuxt apps where content is rendered after mount
    // Without this, the following features won't work:
    // - Lightbox (data-preview-image)
    // - Video preview (data-preview-video)
    // - Link preview (data-preview-link)
    // - Fragment animations
    revealInstance.sync()

    // Contain navigation inside reveal's lightbox overlay iframe.
    observeOverlays()

    return revealInstance
  }

  /**
   * Sync Reveal.js with the current DOM state
   * Call this after dynamically adding/removing slides or content
   */
  function sync() {
    if (revealInstance) {
      revealInstance.sync()
    }
  }

  /**
   * Sync a specific slide after content changes
   */
  function syncSlide(slide: HTMLElement) {
    if (revealInstance) {
      revealInstance.syncSlide(slide)
    }
  }

  /**
   * Destroy the Reveal.js instance
   */
  function destroy() {
    if (overlayObserver) {
      overlayObserver.disconnect()
      overlayObserver = null
    }
    if (revealInstance) {
      revealInstance.destroy()
      revealInstance = null
    }
  }

  /**
   * Get the current Reveal.js instance
   */
  function getInstance() {
    return revealInstance
  }

  /**
   * Navigate to a specific slide
   */
  function slide(indexh: number, indexv?: number, indexf?: number) {
    if (revealInstance) {
      revealInstance.slide(indexh, indexv, indexf)
    }
  }

  /**
   * Get current slide indices
   */
  function getIndices() {
    return revealInstance?.getIndices() || { h: 0, v: 0, f: 0 }
  }

  /**
   * Add event listener to Reveal.js
   */
  function on(event: string, callback: (event: any) => void) {
    if (revealInstance) {
      revealInstance.on(event, callback)
    }
  }

  /**
   * Remove event listener from Reveal.js
   */
  function off(event: string, callback: (event: any) => void) {
    if (revealInstance) {
      revealInstance.off(event, callback)
    }
  }

  return {
    initialize,
    destroy,
    getInstance,
    sync,
    syncSlide,
    slide,
    getIndices,
    on,
    off,
  }
}
