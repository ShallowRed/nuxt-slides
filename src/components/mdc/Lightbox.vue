<script setup lang="ts">
interface Props {
  src: string
  preview?: string
  alt?: string
  width?: string
  height?: string
  fit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  rounded?: boolean
  shadow?: boolean
  bordered?: boolean
  caption?: string
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  width: 'auto',
  height: 'auto',
  fit: 'contain',
  rounded: false,
  shadow: true,
  bordered: false,
})

// Use preview image if provided, otherwise use the same src
const previewSrc = computed(() => props.preview || props.src)
</script>

<template>
  <figure
    class="lightbox-figure"
    :class="{
      rounded: props.rounded,
      shadow: props.shadow,
      bordered: props.bordered,
    }"
  >
    <img
      :src="props.src"
      :alt="props.alt"
      :data-preview-image="previewSrc"
      :style="{
        width: props.width,
        height: props.height,
        objectFit: props.fit,
      }"
      class="lightbox-image"
    >
    <figcaption v-if="props.caption || $slots.default">
      <slot>{{ props.caption }}</slot>
    </figcaption>
  </figure>
</template>

<style scoped>
.lightbox-figure {
  margin: 0;
  display: inline-block;
  text-align: center;
}

.lightbox-image {
  max-width: 100%;
  cursor: zoom-in;
  transition: transform 0.2s ease;
}

.lightbox-image:hover {
  transform: scale(1.02);
}

.lightbox-figure.rounded .lightbox-image {
  border-radius: 8px;
}

.lightbox-figure.shadow .lightbox-image {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.lightbox-figure.bordered .lightbox-image {
  border: 1px solid var(--border-color, #e0e0e0);
}

figcaption {
  margin-top: 0.5rem;
  font-size: 0.875em;
  color: var(--text-muted, #666);
  font-style: italic;
}
</style>
