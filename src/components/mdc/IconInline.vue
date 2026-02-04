<script setup lang="ts">
/**
 * Inline icon component for MDC markdown (SSR compatible).
 * Usage in markdown: :i{name="ri:home-line"} or :icon{name="ri:arrow-right-line" size="24"}
 *
 * Remix Icons prefix: ri
 * Browse icons at: https://remixicon.com/ or https://icon-sets.iconify.design/ri/
 */
interface Props {
  name: string
  size?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  size: '1.2em',
})
</script>

<template>
  <Icon
    :name="props.name"
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
