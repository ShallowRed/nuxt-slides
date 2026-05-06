<script setup lang="ts">
import type { RevealConfig } from '~/types/presentation'
import 'reveal.js/dist/reveal.css'

interface Props {
  theme?: string
  config?: Partial<RevealConfig>
}

const props = withDefaults(defineProps<Props>(), {
  theme: 'dsfr',
})

const revealContainer = ref<HTMLElement | null>(null)

// Theme management
const { loadTheme, unloadTheme, watchTheme } = useTheme(toRef(props, 'theme'))

// Reveal.js instance management - pass config directly
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
  >
    <div class="slides">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.reveal {
  width: 100%;
  height: 100vh;
}
</style>
