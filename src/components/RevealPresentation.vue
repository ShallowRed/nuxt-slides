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

onMounted(async () => {
  loadTheme(props.theme)
  watchTheme()
  await initialize()
})

onUnmounted(() => {
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
