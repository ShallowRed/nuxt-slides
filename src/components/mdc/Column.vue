<template>
  <div class="column">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.column {

  &.size-md {
    font-size: 1em;
  }

  &.size-xs,
  .size-md.size-xs {
    font-size: 0.7em;
  }

  &.size-sm,
  .size-md.size-sm {
    font-size: 0.85em;
  }

  &.size-lg,
  .size-md.size-lg {
    font-size: 1.15em;
  }

  &.size-xl,
  .size-md.size-xl {
    font-size: 1.3em;
    // display: flex;
    // align-items: center;
    // justify-content: center;
    &:deep(p) {
      max-width: 50ch;
      line-height: 1.7;
    }
  }
}
</style>
