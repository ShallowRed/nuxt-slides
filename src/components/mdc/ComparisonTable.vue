<script setup lang="ts">
</script>

<template>
  <div class="comparison-table">
    <slot />
  </div>
</template>

<style scoped>
.comparison-table {
  margin: 2rem 0;
  overflow-x: auto;
}

.comparison-table :deep(table) {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.comparison-table :deep(thead) {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.comparison-table :deep(th) {
  padding: 1rem 1.5rem;
  text-align: left;
  font-weight: 600;
  font-size: 1.1em;
}

.comparison-table :deep(td) {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.comparison-table :deep(tbody tr:hover) {
  background: #f7fafc;
}

.comparison-table :deep(tbody tr:nth-child(even)) {
  background: #f8f9fa;
}

.comparison-table :deep(tbody tr:nth-child(even):hover) {
  background: #e9ecef;
}

@media (max-width: 768px) {
  .comparison-table :deep(th),
  .comparison-table :deep(td) {
    padding: 0.75rem 1rem;
    font-size: 0.9em;
  }
}
</style>
