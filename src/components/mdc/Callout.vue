<script setup lang="ts">
interface Props {
  type?: 'info' | 'tip' | 'warning' | 'danger'
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
})

const icons: Record<string, string> = {
  info: 'ℹ',
  tip: '✓',
  warning: '⚠',
  danger: '✕',
}

const icon = computed(() => icons[props.type])
</script>

<template>
  <aside
    class="callout"
    :class="`callout--${props.type}`"
    :role="props.type === 'warning' || props.type === 'danger' ? 'alert' : 'note'"
  >
    <div
      class="callout__icon"
      aria-hidden="true"
    >
      {{ icon }}
    </div>
    <div class="callout__body">
      <p
        v-if="props.title"
        class="callout__title"
      >
        {{ props.title }}
      </p>
      <slot />
    </div>
  </aside>
</template>

<style scoped>
.callout {
  display: flex;
  gap: 1rem;
  margin: 1.5rem 0;
  padding: 1rem 1.25rem;
  border-radius: var(--callout-radius, 8px);
  border-left: 4px solid var(--callout-border);
  background: var(--callout-bg);
  color: var(--callout-color, inherit);
  font-size: 0.95em;
  line-height: 1.6;
}

.callout__icon {
  flex-shrink: 0;
  font-size: 1.2em;
  line-height: 1.4;
  color: var(--callout-border);
}

.callout__body {
  flex: 1;
  min-width: 0;
}

.callout__title {
  font-weight: 600;
  margin: 0 0 0.4rem;
}

/* Type tokens — override with theme CSS variables for DSFR colours, etc. */
.callout--info {
  --callout-bg: var(--callout-info-bg, #e8f4fd);
  --callout-border: var(--callout-info-border, #2196f3);
}

.callout--tip {
  --callout-bg: var(--callout-tip-bg, #e8f5e9);
  --callout-border: var(--callout-tip-border, #4caf50);
}

.callout--warning {
  --callout-bg: var(--callout-warning-bg, #fff8e1);
  --callout-border: var(--callout-warning-border, #ff9800);
}

.callout--danger {
  --callout-bg: var(--callout-danger-bg, #fdecea);
  --callout-border: var(--callout-danger-border, #f44336);
}
</style>
