<script setup lang="ts">
import { onMounted, ref } from 'vue'

const container = ref<HTMLElement | null>(null)

onMounted(() => {
  if (!container.value)
    return

  const children = Array.from(container.value.children)
  if (children.length === 0)
    return

  // Check if there's an explicit separator (HR element from ---)
  const hrIndex = children.findIndex(child => child.tagName === 'HR')

  let columns: HTMLElement[][] = []

  if (hrIndex !== -1) {
    // Explicit separator mode: split on HR
    const leftColumn = children.slice(0, hrIndex) as HTMLElement[]
    const rightColumn = children.slice(hrIndex + 1) as HTMLElement[]
    columns = [leftColumn, rightColumn]
  }
  else {
    // Default mode: split on headings (h3 or h4)
    let currentColumn: HTMLElement[] = []

    for (const child of children) {
      const isHeading = child.tagName === 'H3' || child.tagName === 'H4'

      // Start a new column on each heading (except the first one)
      if (isHeading && currentColumn.length > 0) {
        columns.push(currentColumn)
        currentColumn = []
      }

      currentColumn.push(child as HTMLElement)
    }

    // Add the last column
    if (currentColumn.length > 0) {
      columns.push(currentColumn)
    }
  }

  // If we have exactly 2 columns, wrap them in divs
  if (columns.length === 2) {
    container.value.innerHTML = ''

    columns.forEach((columnChildren) => {
      const columnDiv = document.createElement('div')
      columnDiv.className = 'column'
      columnChildren.forEach(child => columnDiv.appendChild(child))
      container.value!.appendChild(columnDiv)
    })
  }
  // Otherwise, leave content as-is (grid will distribute naturally)
})
</script>

<template>
  <div
    ref="container"
    class="two-columns"
  >
    <slot />
  </div>
</template>

<style scoped>
.two-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;
}

.two-columns :deep(.column) {
  min-width: 0;
}

@media (max-width: 768px) {
  .two-columns {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>
