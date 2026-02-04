<script setup lang="ts">
import { onMounted, ref } from 'vue'

const container = ref<HTMLElement | null>(null)

onMounted(() => {
  if (!container.value)
    return

  const items = Array.from(container.value.children)
  container.value.innerHTML = ''

  const stepsList = document.createElement('ol')
  stepsList.className = 'steps-list'

  items.forEach((item) => {
    const li = document.createElement('li')
    li.className = 'step-item'
    li.appendChild(item)
    stepsList.appendChild(li)
  })

  container.value.appendChild(stepsList)
})
</script>

<template>
  <div
    ref="container"
    class="steps-list-wrapper"
  >
    <slot />
  </div>
</template>

<style scoped>
.steps-list-wrapper {
  margin: 2rem 0;
}

.steps-list-wrapper :deep(.steps-list) {
  list-style: none;
  counter-reset: step-counter;
  padding: 0;
  margin: 0;
}

.steps-list-wrapper :deep(.step-item) {
  position: relative;
  counter-increment: step-counter;
  padding-left: 4rem;
  margin-bottom: 2rem;
}

.steps-list-wrapper :deep(.step-item::before) {
  content: counter(step-counter);
  position: absolute;
  left: 0;
  top: 0;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 50%;
  font-weight: 700;
  font-size: 1.2em;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.steps-list-wrapper :deep(.step-item:not(:last-child)::after) {
  content: '';
  position: absolute;
  left: 1.25rem;
  top: 2.5rem;
  bottom: -2rem;
  width: 2px;
  background: linear-gradient(to bottom, #667eea, transparent);
}

.steps-list-wrapper :deep(.step-item h3) {
  margin-top: 0;
  font-size: 1.3em;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.steps-list-wrapper :deep(.step-item p) {
  margin: 0;
  color: #4a5568;
  line-height: 1.6;
}
</style>
