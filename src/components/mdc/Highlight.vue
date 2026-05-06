<script setup lang="ts">
interface Props {
  /**
   * Text size preset.
   * - sm: slightly larger than body text
   * - md: default emphasis size
   * - lg: large callout
   * - xl: full-slide statement
   */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /**
   * Visual variant.
   * - default: inherit slide text color, no background
   * - accent: blue-france left border + light background
   * - contrast: dark background, white text
   */
  variant?: 'default' | 'accent' | 'contrast'
  /** Center text horizontally */
  center?: boolean
}

withDefaults(defineProps<Props>(), {
  size: 'md',
  variant: 'default',
  center: false,
})
</script>

<template>
  <div
    class="highlight"
    :class="[
      `highlight--${size}`,
      `highlight--${variant}`,
      { 'highlight--center': center },
    ]"
  >
    <slot />
  </div>
</template>

<style scoped lang="scss">
.highlight {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.4em;
  line-height: 1.3;
  font-weight: 400;
}

.highlight--center {
  text-align: center;
  align-items: center;
}

/* Size presets */
.highlight--sm {
  font-size: 1.3em;
  max-width: 50ch;
  &:deep(p, ul) {
    line-height: 1.5;
  }
}

.highlight--md {
  font-size: 1.6em;
  max-width: 45ch;
  &:deep(p, ul) {
    line-height: 1.7;
  }
}

.highlight--lg {
  font-size: 2em;
  max-width: 40ch;
  &:deep(p, ul) {
    line-height: 1.7;
  }
}

.highlight--xl {
  font-size: 2.6em;
  max-width: 30ch;
  &:deep(p, ul) {
    line-height: 1.7;
  }
}

/* Variant: accent */
.highlight--accent {
  border-left: 4px solid var(--accent, #000091);
  background: var(--accent-bg, #f5f5fe);
  padding: 1em 1.4em;
  border-radius: 0 8px 8px 0;
  text-align: left;
}

.highlight--accent.highlight--center {
  text-align: left;
}

/* Variant: contrast */
.highlight--contrast {
  background: var(--surface-contrast, #161616);
  color: var(--on-contrast, #ffffff);
  padding: 1.2em 1.6em;
  border-radius: 8px;
}

/* Emphasis on strong/em within highlight */
.highlight :deep(strong) {
  color: var(--accent, #000091);
}

.highlight--contrast :deep(strong) {
  color: var(--accent-soft, #e3e3fd);
}

.highlight :deep(em) {
  font-style: normal;
  text-decoration: underline;
  text-decoration-color: var(--accent, #000091);
  text-underline-offset: 4px;
  text-decoration-thickness: 2px;
}

.highlight--contrast :deep(em) {
  text-decoration-color: var(--accent-soft, #e3e3fd);
}
</style>
