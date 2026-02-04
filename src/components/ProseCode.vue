<script setup lang="ts">
import { computed, onMounted, ref, useId } from 'vue'

const props = defineProps<{
  code?: string
  language?: string
  filename?: string
  highlights?: number[]
  meta?: string
}>()

const container = ref<HTMLElement | null>(null)
const diagramId = `mermaid-${useId()}`
const svgContent = ref<string>('')
const error = ref<string>('')

const isMermaid = computed(() => props.language === 'mermaid')

onMounted(async () => {
  if (!isMermaid.value || !props.code)
    return

  // Dynamic import to avoid SSR issues
  const mermaid = (await import('mermaid')).default

  // Initialize mermaid with theme
  mermaid.initialize({
    startOnLoad: false,
    theme: 'default',
    securityLevel: 'loose',
    fontFamily: 'inherit',
  })

  try {
    const { svg } = await mermaid.render(diagramId, props.code)
    svgContent.value = svg
  }
  catch (err) {
    console.error('Mermaid rendering error:', err)
    error.value = String(err)
  }
})
</script>

<template>
  <div
    v-if="isMermaid"
    ref="container"
    class="mermaid-container"
  >
    <div
      v-if="svgContent"
      v-html="svgContent"
    />
    <pre
      v-else-if="error"
      class="mermaid-error"
    >{{ code }}</pre>
    <div
      v-else
      class="mermaid-loading"
    >
      Chargement du diagramme...
    </div>
  </div>
  <pre
    v-else
    :class="[`language-${language}`]"
  ><code>{{ code }}</code></pre>
</template>

<style scoped>
.mermaid-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  overflow: auto;
  padding: 1rem;
}

.mermaid-container :deep(svg) {
  max-width: 100%;
  height: auto;
}

.mermaid-error {
  background: #fee;
  color: #c00;
  padding: 1rem;
  border-radius: 4px;
  font-size: 0.875rem;
  white-space: pre-wrap;
}

.mermaid-loading {
  color: #666;
  font-style: italic;
}

pre:not(.mermaid-error) {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  font-size: 0.875rem;
}

pre code {
  font-family: 'Fira Code', 'Consolas', monospace;
}
</style>
