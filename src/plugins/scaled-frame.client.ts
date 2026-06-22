/**
 * Loads the framework-agnostic iframe scaler (`public/scaled-frame.js`) in the
 * live app. The same script is injected into the frozen Reveal-only bundle by the
 * nuxtout-deck Nitro plugin, so scaling behaves identically in both. Client-only —
 * it touches the DOM and a ResizeObserver. See DDR-017 §2.a-ter for why this is JS
 * and not pure CSS (Firefox `cqh` on grid items is unreliable).
 */
export default defineNuxtPlugin(() => {
  if (document.getElementById('scaled-frame-js'))
    return
  const s = document.createElement('script')
  s.id = 'scaled-frame-js'
  s.src = '/scaled-frame.js'
  s.defer = true
  document.head.appendChild(s)
})
