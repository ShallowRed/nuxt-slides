<script setup lang="ts">
interface Props {
  src: string
  alt?: string
  overlay?: string | number
  position?: string
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  overlay: '0',
  position: 'center',
})

const overlayOpacity = computed(() => {
  const value = typeof props.overlay === 'string' ? Number.parseFloat(props.overlay) : props.overlay
  return Math.max(0, Math.min(1, value))
})
</script>

<template>
  <div
    class="full-screen-image"
    :style="{ backgroundImage: `url(${props.src})`, backgroundPosition: props.position }"
  >
    <div
      v-if="overlayOpacity > 0"
      class="image-overlay"
      :style="{ opacity: overlayOpacity }"
    />
    <div
      v-if="$slots.default"
      class="image-content"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped>
.full-screen-image {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: black;
  pointer-events: none;
}

.image-content {
  position: relative;
  z-index: 1;
  color: white;
  text-align: center;
  padding: 2rem;
  max-width: 80%;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.image-content :deep(h1),
.image-content :deep(h2),
.image-content :deep(h3) {
  margin: 0;
  color: white;
}

.image-content :deep(p) {
  font-size: 1.3em;
  margin: 1rem 0 0;
}
</style>
