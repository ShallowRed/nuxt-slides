<script setup lang="ts">
interface Props {
  value: string | number
  label: string
  trend?: 'up' | 'down' | 'neutral'
  icon?: string
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  trend: 'neutral',
  color: '#667eea',
})

const trendIcon = computed(() => {
  switch (props.trend) {
    case 'up':
      return '↗'
    case 'down':
      return '↘'
    default:
      return '→'
  }
})

const trendColor = computed(() => {
  switch (props.trend) {
    case 'up':
      return '#10b981'
    case 'down':
      return '#ef4444'
    default:
      return '#6b7280'
  }
})
</script>

<template>
  <div
    class="stat-card"
    :style="{ borderTopColor: props.color }"
  >
    <div
      v-if="props.icon"
      class="stat-icon"
    >
      {{ props.icon }}
    </div>
    <div class="stat-value">
      {{ props.value }}
    </div>
    <div class="stat-label">
      {{ props.label }}
    </div>
    <div
      v-if="props.trend !== 'neutral'"
      class="stat-trend"
      :style="{ color: trendColor }"
    >
      <span class="trend-icon">{{ trendIcon }}</span>
    </div>
  </div>
</template>

<style scoped>
.stat-card {
  position: relative;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  border-top: 4px solid;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  font-size: 2.5em;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 3em;
  font-weight: 700;
  color: #1a202c;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 1.1em;
  color: #718096;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-trend {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.5em;
  font-weight: 700;
}

.trend-icon {
  display: inline-block;
}
</style>
