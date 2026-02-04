<script setup lang="ts">
import { onMounted, ref } from 'vue'

const container = ref<HTMLElement | null>(null)
const items = ref<Array<{ title: string, content: HTMLElement, isOpen: boolean }>>([])

function toggleItem(index: number) {
  items.value[index].isOpen = !items.value[index].isOpen
}

onMounted(() => {
  if (!container.value)
    return

  const elements = Array.from(container.value.children)
  items.value = elements.map((element) => {
    const heading = element.querySelector('h3')
    const title = heading?.textContent || 'Item'
    heading?.remove()

    return {
      title,
      content: element as HTMLElement,
      isOpen: false,
    }
  })
})
</script>

<template>
  <div class="accordion-list">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="accordion-item"
      :class="{ open: item.isOpen }"
    >
      <button
        class="accordion-header"
        @click="toggleItem(index)"
      >
        <span class="accordion-title">{{ item.title }}</span>
        <span class="accordion-icon">{{ item.isOpen ? '−' : '+' }}</span>
      </button>
      <div
        v-show="item.isOpen"
        class="accordion-content"
      >
        <div ref="container">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.accordion-list {
  margin: 2rem 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.accordion-item {
  background: white;
  border-bottom: 1px solid #e2e8f0;
}

.accordion-item:last-child {
  border-bottom: none;
}

.accordion-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  background: white;
  border: none;
  cursor: pointer;
  font-size: 1.1em;
  font-weight: 600;
  color: #1a202c;
  text-align: left;
  transition: background 0.2s;
}

.accordion-header:hover {
  background: #f7fafc;
}

.accordion-item.open .accordion-header {
  background: #edf2f7;
  color: #667eea;
}

.accordion-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  font-size: 1.5em;
  color: #667eea;
  font-weight: 300;
}

.accordion-content {
  padding: 1.5rem;
  background: #f8f9fa;
  animation: slideDown 0.3s;
}

@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 500px;
  }
}
</style>
