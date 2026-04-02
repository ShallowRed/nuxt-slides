<script setup lang="ts">
interface Props {
  src: string
  alt?: string
  width?: string
  height?: string
  fit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  position?: string
  rounded?: boolean
  shadow?: boolean
  /** Enable Reveal.js lightbox. Pass `true` to use `src` as preview, or a URL for a distinct thumbnail. */
  preview?: boolean | string
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  width: 'auto',
  height: 'auto',
  fit: 'contain',
  position: 'center',
  rounded: true,
  shadow: true,
})

// Resolve value for data-preview-image attribute (Reveal.js lightbox trigger)
const previewSrc = computed(() => {
  if (!props.preview)
    return null
  return typeof props.preview === 'string' ? props.preview : props.src
})
</script>

<template>
  <figure class="image-figure">
    <img
      :src="props.src"
      :alt="props.alt"
      v-bind="previewSrc ? { 'data-preview-image': previewSrc } : {}"
      :class="{
        rounded: props.rounded,
        shadow: props.shadow,
      }"
      :style="{
        width: props.width,
        height: props.height,
        objectFit: props.fit,
        objectPosition: props.position,
      }"
    >
    <figcaption v-if="$slots.default">
      <slot />
    </figcaption>
  </figure>
</template>

<style scoped>
.image-figure {
  margin: 1.5rem 0;
  text-align: center;
}

.image-figure img {
  max-width: 100%;
  display: block;
  margin: 0 auto;
}

.image-figure img.rounded {
  border-radius: 8px;
}

.image-figure img.shadow {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.image-figure figcaption {
  margin-top: 0.75rem;
  font-size: 0.9em;
  color: #666;
  font-style: italic;
}
</style>
