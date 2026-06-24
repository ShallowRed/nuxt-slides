/**
 * Scales a story iframe (rendered at a logical desktop `--preview-width`, default
 * 1440px) down to fit its pane. JS, not CSS: the exact fit needs the pane height,
 * and the CSS `cqh` route is unreliable in Firefox on grid items. Reads
 * clientWidth/Height directly. Shared by the live app (client plugin) and the
 * frozen bundle (inlined). Targets `.slide-media-pane.is-scaled` / `.story-frame__media.is-scaled`.
 */
;(function () {
  if (typeof window === 'undefined')
    return

  const SELECTOR = '.slide-media-pane.is-scaled, .story-frame__media.is-scaled'

  function measure(pane) {
    const iframe = pane.querySelector(':scope > iframe, :scope a > iframe')
    if (!iframe)
      return
    const w = pane.clientWidth
    const h = pane.clientHeight
    if (!w || !h)
      return
    const pw = Number.parseFloat(getComputedStyle(pane).getPropertyValue('--preview-width')) || 1440
    const scale = w / pw
    // Logical height that, once scaled, exactly fills the pane.
    const logicalH = scale > 0 ? h / scale : h
    iframe.style.position = 'absolute'
    iframe.style.top = '0'
    iframe.style.left = '0'
    iframe.style.width = `${pw}px`
    iframe.style.height = `${logicalH}px`
    iframe.style.transform = `scale(${scale})`
    iframe.style.transformOrigin = 'top left'
  }

  const ro = typeof ResizeObserver !== 'undefined'
    ? new ResizeObserver(entries => entries.forEach(e => measure(e.target)))
    : null

  function attach(pane) {
    measure(pane)
    ro && ro.observe(pane)
  }

  function scanAll(root) {
    (root || document).querySelectorAll(SELECTOR).forEach(attach)
  }

  function init() {
    scanAll(document)
    // Catch panes added later (Reveal/MDC render asynchronously).
    if (typeof MutationObserver !== 'undefined') {
      new MutationObserver((muts) => {
        for (const m of muts) {
          for (const node of m.addedNodes) {
            if (node.nodeType !== 1)
              continue
            if (node.matches && node.matches(SELECTOR))
              attach(node)
            if (node.querySelectorAll)
              scanAll(node)
          }
        }
      }).observe(document.body, { childList: true, subtree: true })
    }
  }

  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', init)
  else
    init()

  // In a Reveal deck, panes get their final size after Reveal lays out / scales.
  // Re-scan on Reveal's lifecycle events when present (frozen bundle + live).
  if (window.Reveal && typeof window.Reveal.on === 'function') {
    const rescan = () => scanAll(document)
    window.Reveal.on('ready', rescan)
    window.Reveal.on('slidechanged', rescan)
    window.Reveal.on('resize', rescan)
  }
  // Also a deferred pass after first paint, in case Reveal initialised just before
  // this script ran and we missed its 'ready'.
  setTimeout(() => scanAll(document), 0)
})()
