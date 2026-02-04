<script setup lang="ts">
// Centers content vertically and horizontally
</script>

<template>
  <div class="centered-content">
    <slot />
  </div>
</template>

<style scoped>
.centered-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100%;
  width: 100%;
}
</style>
