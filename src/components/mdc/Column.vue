<script setup lang="ts">
// Simple wrapper component to group content in a single column
// within ThreeColumns or TwoColumns components
// Usage: ::Column followed by content, then ::
</script>

<template>
  <div class="column-wrapper">
    <slot />
  </div>
</template>

<style scoped>
.column-wrapper {
  /* Keep the wrapper visible so ThreeColumns can detect it */
  flex: 1;
  min-width: 0;
}

.column-wrapper :deep(h3),
.column-wrapper :deep(h4) {
  margin-top: 0;
}

.column-wrapper :deep(h4:not(:first-child)) {
  margin-top: 1em;
}
</style>
