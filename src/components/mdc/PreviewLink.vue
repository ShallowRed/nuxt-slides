<script setup lang="ts">
interface Props {
  href: string
  label?: string
}

const props = defineProps<Props>()
</script>

<template>
  <a
    :href="props.href"
    data-preview-link
    class="preview-link"
  >
    <slot>{{ props.label || props.href }}</slot>
  </a>
</template>

<style scoped>
.preview-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  padding: 0.5em 1em;
  background: var(--r-link-color, #2a76dd);
  color: white;
  text-decoration: none;
  border-radius: 0.25em;
  font-weight: 500;
  transition: background 0.2s;
}

.preview-link:hover {
  background: var(--r-link-color-hover, #1a5bb8);
  color: white;
}
</style>
