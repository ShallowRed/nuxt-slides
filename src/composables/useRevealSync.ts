/**
 * Composable for syncing Reveal.js from child components
 *
 * Use this in MDC components that need to trigger a Reveal.js sync
 * after dynamic content changes (e.g., lazy-loaded images, async content)
 *
 * @example
 * ```vue
 * <script setup>
 * const { sync } = useRevealSync()
 *
 * onMounted(() => {
 *   // After some async operation that changes DOM
 *   sync()
 * })
 * </script>
 * ```
 */
export function useRevealSync() {
  const sync = inject<() => void>('revealSync', () => {
    // No-op if not within a RevealPresentation context
  })

  const getInstance = inject<() => any>('revealInstance', () => null)

  return {
    sync,
    getInstance,
  }
}
