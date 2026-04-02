<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

interface Props {
  count?: number
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  count: 3,
  size: 'md',
})

const containerRef = ref<HTMLElement | null>(null)

const sizeClass = computed(() => props.size ? `size-${props.size}` : '')

onMounted(() => {
  if (!containerRef.value)
    return

  // Get all children
  const children = Array.from(containerRef.value.children)

  // If children are already wrapped in ::column components, no re-wrapping needed
  const columnChildren = children.filter(child => child.classList.contains('column'))
  if (columnChildren.length >= 2)
    return

  // Group children by h3 or h4 headings
  const columns: HTMLElement[][] = []
  let currentColumn: HTMLElement[] = []

  children.forEach((child) => {
    const isHeading = child.tagName === 'H3' || child.tagName === 'H4'
    if (isHeading) {
      // Start a new column
      if (currentColumn.length > 0) {
        columns.push(currentColumn)
      }
      currentColumn = [child as HTMLElement]
    }
    else {
      // Add to current column
      currentColumn.push(child as HTMLElement)
    }
  })

  // Don't forget the last column
  if (currentColumn.length > 0) {
    columns.push(currentColumn)
  }

  // Clear the container
  containerRef.value.innerHTML = ''

  // Create column divs and append grouped content
  columns.forEach((columnElements) => {
    const columnDiv = document.createElement('div')
    columnDiv.className = 'column'
    columnElements.forEach(el => columnDiv.appendChild(el))
    containerRef.value?.appendChild(columnDiv)
  })
})
</script>

<template>
  <div
    ref="containerRef"
    class="columns-container"
    :class="sizeClass"
  >
    <slot />
  </div>
</template>

<style scoped>
.columns-container {
  display: flex;
  gap: 4rem;
  width: 100%;
  align-items: flex-start;
}

.columns-container :deep(.column) {
  flex: 1;
  min-width: 0;
}

.columns-container :deep(.column h3),
.columns-container :deep(.column h4) {
  margin-top: 0;
}

/* Size variants */
.size-md {
  font-size: 1em;
}
.size-xs, .size-md.size-xs {
  font-size: 0.7em;
}

.size-sm, .size-md.size-sm {
  font-size: 0.85em;
}

.size-lg, .size-md.size-lg {
  font-size: 1.15em;
}
</style>
