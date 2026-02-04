/**
 * Composable for managing presentation themes
 * Handles dynamic theme loading and switching
 */

import type { Ref } from 'vue'

export function useTheme(themeName: Ref<string> | string) {
  let themeLink: HTMLLinkElement | null = null

  /**
   * Load a theme CSS file
   */
  function loadTheme(theme: string) {
    // Remove existing theme link
    if (themeLink?.parentNode) {
      themeLink.parentNode.removeChild(themeLink)
    }

    // Create and append new theme link
    themeLink = document.createElement('link')
    themeLink.rel = 'stylesheet'
    themeLink.href = `/themes/${theme}.css`
    document.head.appendChild(themeLink)
  }

  /**
   * Remove the theme CSS file
   */
  function unloadTheme() {
    if (themeLink?.parentNode) {
      themeLink.parentNode.removeChild(themeLink)
      themeLink = null
    }
  }

  /**
   * Watch for theme changes if it's a ref
   */
  function watchTheme() {
    if (isRef(themeName)) {
      watch(themeName, (newTheme: string) => {
        if (newTheme)
          loadTheme(newTheme)
      })
    }
  }

  return {
    loadTheme,
    unloadTheme,
    watchTheme,
  }
}
