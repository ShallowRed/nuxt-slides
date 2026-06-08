<script setup lang="ts">
/**
 * Screens — a responsive gallery of media frames on a single slide.
 *
 * Lays out its children (typically `<StoryFrame>`, but any media works) in an
 * even row, so several screens can be compared side by side. Pairs with the
 * `media-cover` / full-width philosophy: the heading + intro stay compact and
 * the screens claim the rest of the slide.
 *
 * Example (markdown):
 *   :::Screens{cols="3"}
 *   ::StoryFrame{story="vitrine-accueil-scenario-a--page" label="A · Acquisition"}
 *   ::
 *   ::StoryFrame{story="vitrine-accueil-scenario-b--page" label="B · Aiguillage"}
 *   ::
 *   ::StoryFrame{story="vitrine-accueil-scenario-c--page" label="C · Hub"}
 *   ::
 *   :::
 */
interface Props {
  /** Number of columns. Defaults to an even auto-fit row. */
  cols?: string | number
  /** Gap between screens (CSS length). */
  gap?: string
  /** Vertical alignment of uneven-height screens. */
  align?: 'start' | 'center' | 'stretch'
}

const props = withDefaults(defineProps<Props>(), {
  align: 'stretch',
})

const columns = computed(() => {
  const n = typeof props.cols === 'string' ? Number.parseInt(props.cols, 10) : props.cols
  return n && Number.isFinite(n) && n > 0 ? n : undefined
})

const gridStyle = computed(() => ({
  gridTemplateColumns: columns.value
    ? `repeat(${columns.value}, minmax(0, 1fr))`
    : 'repeat(auto-fit, minmax(0, 1fr))',
  gap: props.gap || '1.5rem',
  alignItems: props.align,
}))
</script>

<template>
  <div
    class="screens"
    :style="gridStyle"
  >
    <slot />
  </div>
</template>

<style scoped>
.screens {
  display: grid;
  width: 100%;
  min-height: 0;
}

/* Galleries should fill the slide height when they are the main content. */
.screens :deep(.story-frame) {
  height: 100%;
}
</style>
