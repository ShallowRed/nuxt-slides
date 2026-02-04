<script setup lang="ts">
// No props needed, purely styling wrapper
</script>

<template>
  <div class="divider-slide">
    <slot />
  </div>
</template>

<style scoped>
.divider-slide {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100%;
  padding: 2rem;
}

.divider-slide :deep(h1),
.divider-slide :deep(h2) {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.divider-slide :deep(p) {
  font-size: 1.5rem;
  opacity: 0.8;
}
</style>
