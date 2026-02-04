<script setup lang="ts">
import { onMounted, ref } from 'vue'

const container = ref<HTMLElement | null>(null)

onMounted(() => {
  if (!container.value)
    return

  const items = Array.from(container.value.children)
  container.value.innerHTML = ''

  const timeline = document.createElement('div')
  timeline.className = 'timeline-track'
  container.value.appendChild(timeline)

  items.forEach((item) => {
    const timelineItem = document.createElement('div')
    timelineItem.className = 'timeline-item'

    const dot = document.createElement('div')
    dot.className = 'timeline-dot'

    const content = document.createElement('div')
    content.className = 'timeline-content'
    content.appendChild(item)

    timelineItem.appendChild(dot)
    timelineItem.appendChild(content)
    timeline.appendChild(timelineItem)
  })
})
</script>

<template>
  <div
    ref="container"
    class="timeline"
  >
    <slot />
  </div>
</template>

<style scoped>
.timeline {
  position: relative;
  padding: 2rem 0;
}

.timeline :deep(.timeline-track) {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.timeline :deep(.timeline-track::before) {
  content: '';
  position: absolute;
  left: 20px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, #667eea, #764ba2);
}

.timeline :deep(.timeline-item) {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
}

.timeline :deep(.timeline-dot) {
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: 4px solid white;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.2);
}

.timeline :deep(.timeline-content) {
  flex: 1;
  padding: 1rem 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.timeline :deep(.timeline-content h3) {
  margin-top: 0;
  font-size: 1.3em;
  color: #667eea;
  margin-bottom: 0.5rem;
}

.timeline :deep(.timeline-content p) {
  margin: 0;
  color: #4a5568;
}

@media (max-width: 768px) {
  .timeline :deep(.timeline-track::before) {
    left: 15px;
  }

  .timeline :deep(.timeline-dot) {
    width: 30px;
    height: 30px;
  }
}
</style>
