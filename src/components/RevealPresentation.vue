<script setup lang="ts">
import type { RevealConfig } from '~/types/presentation'
import { buildPrintPdfUrl, mergeRevealConfig, PRINT_PDF_QUERY } from '#shared/render'
import 'reveal.js/dist/reveal.css'
// Reveal's print stylesheet: when the URL carries `?print-pdf`, Reveal adds the
// `reveal-print` class to <html> and this CSS lays the deck out one slide per
// page (audit §5.8 / #14 — the print/PDF writer's stylesheet half).
import 'reveal.js/css/print/pdf.scss'

interface Props {
  theme?: string
  config?: Partial<RevealConfig>
}

const props = withDefaults(defineProps<Props>(), {
  theme: 'dsfr',
})

const revealContainer = ref<HTMLElement | null>(null)

// When the deck is already loaded in `?print-pdf` mode, Reveal switches to its
// print layout — the on-screen "Print / PDF" affordance is then irrelevant.
const isPrintMode = ref(false)

/**
 * Open the current deck in Reveal's native print/PDF view. Reuses the shared
 * `buildPrintPdfUrl` writer (one definition of the print entry, audit §5.8 / #14)
 * so the URL shape matches the frozen bundle and tests. The browser's print
 * dialog (Save as PDF) is left to the user — Reveal lays out the pages.
 */
function openPrintView() {
  window.location.href = buildPrintPdfUrl(window.location.href)
}

// Serialised onto `.reveal` so it survives into the prerendered HTML: the frozen
// bundle reads `data-reveal-config` to init Reveal with the deck's frontmatter
// `reveal:` (margin/width), not just defaults. DDR-017 §2.a-ter. Uses the shared
// merge so live and frozen agree on the defaults.
const resolvedRevealConfig = computed(() =>
  JSON.stringify(mergeRevealConfig(props.config)))

// Theme management
const { loadTheme, unloadTheme, watchTheme } = useTheme(toRef(props, 'theme'))

const { initialize, destroy, getInstance, sync } = useReveal(revealContainer, props.config || {})

// Provide Reveal.js sync function to child components
// This allows MDC components to trigger a sync after dynamic content changes
provide('revealSync', sync)
provide('revealInstance', getInstance)

/**
 * Intercept clicks on markdown anchor links (href="#slug") and translate them
 * into Reveal.js hash navigation (#/slug), which navigates to the matching
 * <section id="slug"> slide.  This makes standard markdown heading anchors
 * written in the sommaire work as slide navigation links.
 */
function handleAnchorClick(event: MouseEvent) {
  const link = (event.target as Element).closest('a[href^="#"]')
  if (!link)
    return
  const href = link.getAttribute('href')
  if (!href || href === '#')
    return
  const slug = href.slice(1) // strip leading #
  // Only intercept if there is a matching slide section
  const target = revealContainer.value?.querySelector(`section[id="${CSS.escape(slug)}"]`)
  if (!target)
    return
  event.preventDefault()
  // Reveal.js (hash: true) navigates to a named slide via the #/id hash format
  window.location.hash = `/${slug}`
}

onMounted(async () => {
  isPrintMode.value = new RegExp(PRINT_PDF_QUERY, 'i').test(window.location.search)
  loadTheme(props.theme)
  watchTheme()
  await initialize()
  revealContainer.value?.addEventListener('click', handleAnchorClick)
})

onUnmounted(() => {
  revealContainer.value?.removeEventListener('click', handleAnchorClick)
  destroy()
  unloadTheme()
})
</script>

<template>
  <div
    ref="revealContainer"
    v-french-typography
    class="reveal"
    :data-reveal-config="resolvedRevealConfig"
  >
    <div class="slides">
      <slot />
    </div>
    <button
      v-if="!isPrintMode"
      type="button"
      class="print-pdf-button"
      title="Imprimer / exporter en PDF"
      aria-label="Imprimer ou exporter en PDF"
      @click="openPrintView"
    >
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        aria-hidden="true"
        focusable="false"
      >
        <path
          fill="currentColor"
          d="M16 3a1 1 0 0 1 1 1v3h2a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-2v2a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2V4a1 1 0 0 1 1-1zm-1 14H9v3h6zm4-8H5v6h2v-1a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v1h2zm-2 1.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2M15 5H9v2h6z"
        />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.reveal {
  width: 100%;
  height: 100vh;
}

.print-pdf-button {
  position: fixed;
  top: 0.75rem;
  right: 0.75rem;
  z-index: 50;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  padding: 0;
  color: #fff;
  background: rgba(0, 0, 0, 0.45);
  border: none;
  border-radius: 0.4rem;
  cursor: pointer;
  opacity: 0.35;
  transition: opacity 0.15s ease, background 0.15s ease;
}

.print-pdf-button:hover,
.print-pdf-button:focus-visible {
  opacity: 1;
  background: rgba(0, 0, 0, 0.7);
}

/* Never let the on-screen control bleed into a print/PDF render. */
@media print {
  .print-pdf-button {
    display: none !important;
  }
}
</style>
