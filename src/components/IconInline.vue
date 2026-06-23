<script setup lang="ts">
/**
 * Inline icon component for MDC markdown.
 * Usage in markdown: :i{name="ri:home-line"} or :i{name="ri-home-line"}
 *
 * Accepts both Iconify format (ri:home-line) and Remix CSS class format (ri-home-line).
 * Remix Icons prefix: ri
 * Browse icons at: https://remixicon.com/ or https://icon-sets.iconify.design/ri/
 */
import { normalizeIconName } from '#shared/deck'

interface Props {
  name: string
  size?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  size: '1.2em',
})

// Single icon-name rule (audit §5.8 / #13): ri-home-line → ri:home-line.
const iconName = computed(() => normalizeIconName(props.name))

// Dynamically import Icon component for client-side only
const IconifyIcon = defineAsyncComponent(() =>
  import('@iconify/vue').then(m => m.Icon),
)
</script>

<template>
  <ClientOnly>
    <IconifyIcon
      :icon="iconName"
      :width="String(props.size)"
      :height="String(props.size)"
      class="inline-icon"
    />
    <template #fallback>
      <span class="inline-icon-placeholder" />
    </template>
  </ClientOnly>
</template>

<style scoped>
.inline-icon {
  display: inline-block;
  vertical-align: -0.125em;
}
.inline-icon-placeholder {
  display: inline-block;
  width: 1.2em;
  height: 1.2em;
}
</style>
