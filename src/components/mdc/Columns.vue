<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

interface Props {
  /**
   * Number of columns to display when auto-splitting by headings.
   * When explicit `::column` children are used this prop is ignored
   * (column count is driven by the content itself).
   */
  count?: number
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  count: 2,
  size: 'md',
})

const container = ref<HTMLElement | null>(null)

const sizeClass = computed(() => `size-${props.size}`)

onMounted(() => {
  if (!container.value)
    return

  const children = Array.from(container.value.children)
  if (children.length === 0)
    return

  // If children are already wrapped in explicit ::column components, nothing to do.
  const columnChildren = children.filter(child => child.classList.contains('column'))
  if (columnChildren.length >= 2)
    return

  // TwoColumns-style: look for an HR separator as an explicit split point.
  const hrIndex = children.findIndex(child => child.tagName === 'HR')

  let columns: HTMLElement[][] = []

  if (hrIndex !== -1) {
    // Explicit HR split (TwoColumns behaviour)
    columns = [
      children.slice(0, hrIndex) as HTMLElement[],
      children.slice(hrIndex + 1) as HTMLElement[],
    ]
  }
  else {
    // Auto-split on H3/H4 headings (both TwoColumns and ThreeColumns behaviour)
    let currentColumn: HTMLElement[] = []

    for (const child of children) {
      const isHeading = child.tagName === 'H3' || child.tagName === 'H4'

      if (isHeading && currentColumn.length > 0) {
        columns.push(currentColumn)
        currentColumn = []
      }

      currentColumn.push(child as HTMLElement)
    }

    if (currentColumn.length > 0)
      columns.push(currentColumn)
  }

  if (columns.length < 2)
    return

  container.value.innerHTML = ''

  columns.forEach((colChildren) => {
    const div = document.createElement('div')
    div.className = 'column'
    colChildren.forEach(child => div.appendChild(child))
    container.value!.appendChild(div)
  })
})
</script>

<template>
  <div
    ref="container"
    class="columns"
    :class="sizeClass"
  >
    <slot />
  </div>
</template>

<style scoped>
.columns {
  display: flex;
  gap: 4rem;
  width: 100%;
  align-items: flex-start;
}

.columns :deep(.column) {
  flex: 1;
  min-width: 0;
}

.columns :deep(.column h3),
.columns :deep(.column h4) {
  margin-top: 0;
}

@media (max-width: 768px) {
  .columns {
    flex-direction: column;
    gap: 1.5rem;
  }
}

/* Size variants */
.size-xs { font-size: 0.7em; }
.size-sm { font-size: 0.85em; }
.size-md { font-size: 1em; }
.size-lg { font-size: 1.15em; }
</style>
