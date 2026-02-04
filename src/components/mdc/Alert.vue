<script setup lang="ts">
interface Props {
  type?: 'info' | 'warning' | 'error' | 'success'
}

withDefaults(defineProps<Props>(), {
  type: 'info',
})
</script>

<template>
  <div
    class="alert"
    :class="`alert-${type}`"
  >
    <slot />
  </div>
</template>

<style scoped>
.alert {
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  border-left: 4px solid;
  margin: 1rem 0;
}

.alert-info {
  background-color: #e7f3ff;
  border-left-color: #2196F3;
  color: #0d47a1;
}

.alert-success {
  background-color: #e8f5e9;
  border-left-color: #4CAF50;
  color: #1b5e20;
}

.alert-warning {
  background-color: #fff3e0;
  border-left-color: #FF9800;
  color: #e65100;
}

.alert-error {
  background-color: #ffebee;
  border-left-color: #f44336;
  color: #b71c1c;
}
</style>
