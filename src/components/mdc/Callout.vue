<script setup lang="ts">
interface Props {
  type?: 'tip' | 'info' | 'warning' | 'danger'
  title?: string
  icon?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
})

const config = computed(() => {
  const configs = {
    tip: {
      icon: '💡',
      color: '#10b981',
      background: '#d1fae5',
      border: '#6ee7b7',
    },
    info: {
      icon: 'ℹ️',
      color: '#3b82f6',
      background: '#dbeafe',
      border: '#93c5fd',
    },
    warning: {
      icon: '⚠️',
      color: '#f59e0b',
      background: '#fef3c7',
      border: '#fcd34d',
    },
    danger: {
      icon: '🚨',
      color: '#ef4444',
      background: '#fee2e2',
      border: '#fca5a5',
    },
  }
  return configs[props.type]
})
</script>

<template>
  <div
    class="callout"
    :style="{
      borderLeftColor: config.color,
      background: config.background,
    }"
  >
    <div class="callout-header">
      <span class="callout-icon">{{ props.icon || config.icon }}</span>
      <span
        v-if="props.title"
        class="callout-title"
      >{{ props.title }}</span>
    </div>
    <div class="callout-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.callout {
  position: relative;
  padding: 1.5rem;
  margin: 1.5rem 0;
  border-left: 4px solid;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.callout-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.callout-icon {
  font-size: 1.5em;
  line-height: 1;
}

.callout-title {
  font-weight: 600;
  font-size: 1.1em;
  color: #1a202c;
}

.callout-content {
  color: #2d3748;
  line-height: 1.6;
}

.callout-content :deep(p) {
  margin: 0;
}

.callout-content :deep(p + p) {
  margin-top: 0.5rem;
}
</style>
