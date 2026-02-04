<script setup lang="ts">
import { nextTick, onMounted, ref, useId } from 'vue'

const props = defineProps<{
  theme?: 'default' | 'dark' | 'forest' | 'neutral'
}>()

const container = ref<HTMLElement | null>(null)
const hiddenSlot = ref<HTMLElement | null>(null)
const diagramId = `mermaid-${useId()}`

onMounted(async () => {
  await nextTick()

  if (!container.value || !hiddenSlot.value)
    return

  // Try to find code in pre>code element first (from fenced code block)
  const codeElement = hiddenSlot.value.querySelector('pre code') || hiddenSlot.value.querySelector('code')
  let code = ''

  if (codeElement) {
    code = codeElement.textContent?.trim() || ''
  }
  else {
    // Fallback: get text from pre element
    const preElement = hiddenSlot.value.querySelector('pre')
    if (preElement) {
      code = preElement.textContent?.trim() || ''
    }
    else {
      // Last fallback: direct text content
      code = hiddenSlot.value.textContent?.trim() || ''
    }
  }

  if (!code) {
    console.error('Mermaid: No code found in slot')
    return
  }

  console.log('Mermaid code:', code)

  // Dynamic import to avoid SSR issues
  const mermaid = (await import('mermaid')).default

  // Initialize mermaid with theme
  mermaid.initialize({
    startOnLoad: false,
    theme: props.theme || 'default',
    securityLevel: 'loose',
    fontFamily: 'inherit',
  })

  try {
    // Render the diagram
    const { svg } = await mermaid.render(diagramId, code)
    container.value.innerHTML = svg
  }
  catch (error) {
    console.error('Mermaid rendering error:', error)
    container.value.innerHTML = `<pre class="mermaid-error">${code}</pre>`
  }
})
</script>

<template>
  <div class="mermaid-wrapper">
    <!-- Hidden slot to capture text content -->
    <div
      ref="hiddenSlot"
      style="display: none;"
    >
      <slot />
    </div>
    <!-- Rendered diagram -->
    <div
      ref="container"
      class="mermaid-container"
    />
  </div>
</template>

<style scoped>
.mermaid-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  overflow: auto;
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
</style>
