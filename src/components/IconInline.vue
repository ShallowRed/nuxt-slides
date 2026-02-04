<script setup lang="ts">
/**
 * Inline icon component for MDC markdown.
 * Usage in markdown: :icon-inline{name="ri:home-line"}
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

// Dynamically import Icon component for client-side only
const IconifyIcon = defineAsyncComponent(() =>
  import('@iconify/vue').then(m => m.Icon),
)
</script>

<template>
  <ClientOnly>
    <IconifyIcon
      :icon="props.name"
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
