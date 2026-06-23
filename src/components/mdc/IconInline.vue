<script setup lang="ts">
/**
 * Inline icon component for MDC markdown (SSR compatible).
 * Usage in markdown: :i{name="ri:home-line"} or :i{name="ri-home-line"}
 *
 * Accepts both Iconify (`ri:home-line`) and Remix CSS-class (`ri-home-line`)
 * forms via the shared `normalizeIconName` — the single icon-name rule
 * (audit §5.8 / #13), shared with the CodiMD preview to end the `ri:`/`ri-` drift.
 */
import { normalizeIconName } from '#shared/deck'

interface Props {
  name: string
  size?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  size: '1.2em',
})

const iconName = computed(() => normalizeIconName(props.name))
</script>

<template>
  <Icon
    :name="iconName"
    :size="String(props.size)"
    class="inline-icon"
    mode="svg"
  />
</template>

<style scoped>
.inline-icon {
  display: inline;
  width: .85em;
  height: .85em;
  vertical-align: -0.125em;
}
</style>
