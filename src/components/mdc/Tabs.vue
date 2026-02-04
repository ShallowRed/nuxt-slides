<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref(0)

function setActiveTab(index: number) {
  activeTab.value = index
}

const container = ref<HTMLElement | null>(null)
const tabs = ref<Array<{ title: string, content: HTMLElement }>>([])

onMounted(() => {
  if (!container.value)
    return

  const items = Array.from(container.value.children)
  tabs.value = items.map((item) => {
    const heading = item.querySelector('h3')
    const title = heading?.textContent || `Tab ${items.indexOf(item) + 1}`
    heading?.remove()

    return {
      title,
      content: item as HTMLElement,
    }
  })
})
</script>

<template>
  <div class="tabs">
    <div class="tabs-header">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        class="tab-button"
        :class="{ active: activeTab === index }"
        @click="setActiveTab(index)"
      >
        {{ tab.title }}
      </button>
    </div>
    <div class="tabs-content">
      <div
        v-for="(tab, index) in tabs"
        v-show="activeTab === index"
        :key="index"
        class="tab-panel"
      >
        <div ref="container">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tabs {
  margin: 2rem 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.tabs-header {
  display: flex;
  background: #f7fafc;
  border-bottom: 2px solid #e2e8f0;
}

.tab-button {
  flex: 1;
  padding: 1rem 1.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1em;
  font-weight: 500;
  color: #718096;
  transition: all 0.2s;
  border-bottom: 3px solid transparent;
}

.tab-button:hover {
  background: #edf2f7;
  color: #4a5568;
}

.tab-button.active {
  color: #667eea;
  border-bottom-color: #667eea;
  background: white;
}

.tabs-content {
  background: white;
  padding: 2rem;
}

.tab-panel {
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
