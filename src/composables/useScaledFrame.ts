import type { Ref } from 'vue'

/**
 * useScaledFrame — render an iframe at a logical "desktop" width, then scale it
 * down to fit its container with a CSS transform.
 *
 * Story/app iframes render their own responsive layout at whatever pixel width
 * the iframe element has. In a small slide frame that means we only see the
 * top-left corner at 1:1. Instead we give the iframe a large logical width
 * (`previewWidth`, e.g. 1440px → desktop layout) and visually shrink it so the
 * whole page is visible. Lower `previewWidth` → bigger content; higher →
 * "zoom out" to show more.
 *
 * Returns refs to bind:
 *   container → the clipping box (overflow hidden, real on-screen size)
 *   frameStyle → width/height/transform for the iframe (logical size + scale)
 */
export function useScaledFrame(
  container: Ref<HTMLElement | null>,
  previewWidth: Ref<number>,
  enabled: Ref<boolean>,
) {
  const scale = ref(1)
  const box = ref({ w: 0, h: 0 })
  let ro: ResizeObserver | null = null

  function measure() {
    const el = container.value
    if (!el)
      return
    const w = el.clientWidth
    const h = el.clientHeight
    if (w === 0)
      return
    box.value = { w, h }
    scale.value = w / previewWidth.value
  }

  onMounted(() => {
    if (typeof ResizeObserver === 'undefined')
      return
    measure()
    ro = new ResizeObserver(() => measure())
    if (container.value)
      ro.observe(container.value)
  })

  watch([previewWidth, enabled], () => measure())

  onBeforeUnmount(() => {
    ro?.disconnect()
    ro = null
  })

  /** Inline style for the scaled iframe (logical size + transform). */
  const frameStyle = computed(() => {
    if (!enabled.value)
      return undefined
    const s = scale.value || 1
    // Logical height that, once scaled, exactly fills the container height.
    const logicalHeight = s > 0 ? box.value.h / s : box.value.h
    return {
      width: `${previewWidth.value}px`,
      height: `${logicalHeight}px`,
      transform: `scale(${s})`,
      transformOrigin: 'top left',
    }
  })

  return { scale, frameStyle, measure }
}
