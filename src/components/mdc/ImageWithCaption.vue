<script setup lang="ts">
interface Props {
  src: string
  alt?: string
  width?: string
  height?: string
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  width: '100%',
  height: 'auto',
})
</script>

<template>
  <figure class="image-with-caption">
    <img
      :src="props.src"
      :alt="props.alt"
      :style="{ width: props.width, height: props.height }"
    >
    <figcaption v-if="$slots.default">
      <slot />
    </figcaption>
  </figure>
</template>

<style scoped>
.image-with-caption {
  margin: 2rem 0;
  text-align: center;
}

.image-with-caption img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.image-with-caption figcaption {
  margin-top: 1rem;
  font-size: 0.9em;
  color: #666;
  font-style: italic;
}
</style>
