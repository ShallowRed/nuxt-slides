<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /**
   * Relative weight in the columns row (e.g. span=2 vs span=1 => 2/3 + 1/3).
   */
  span?: number | string
  /**
   * Explicit width ratio for this column (e.g. "2/3", "1/4").
   */
  ratio?: string
}

const props = defineProps<Props>()

const parsedSpan = computed(() => {
  if (props.span === undefined || props.span === null || props.span === '')
    return undefined
  const value = typeof props.span === 'number' ? props.span : Number.parseFloat(props.span)
  if (!Number.isFinite(value) || value <= 0)
    return undefined
  return value
})

const ratioBasis = computed(() => {
  if (!props.ratio)
    return undefined
  const match = props.ratio.trim().match(/^(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)$/)
  if (!match)
    return undefined
  const numerator = Number.parseFloat(match[1])
  const denominator = Number.parseFloat(match[2])
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || numerator <= 0 || denominator <= 0)
    return undefined
  return `${(numerator / denominator) * 100}%`
})

const columnStyle = computed(() => {
  const style: Record<string, string> = {}

  if (parsedSpan.value !== undefined)
    style['--column-grow'] = String(parsedSpan.value)

  if (ratioBasis.value) {
    style.flex = `0 0 ${ratioBasis.value}`
    style.maxWidth = ratioBasis.value
  }

  return style
})
</script>

<template>
  <div
    class="column"
    :style="columnStyle"
  >
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
