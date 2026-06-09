<script setup lang="ts">
import type { PresentationMetadata, Slide } from '~/types/presentation'
import MDCRenderer from '@nuxtjs/mdc/runtime/components/MDCRenderer.vue'
import { useScaledFrame } from '~/composables/useScaledFrame'
import { getLayoutStrategy } from '~/config/layouts'
import { getMediaFit, quicklinkParts } from '~/utils/slide-rendering'
import { buildStoryUrl } from '~/utils/storybook'

const props = defineProps<{
  slide: Slide
  metadata: PresentationMetadata
  mdcComponents: Record<string, any>
}>()

const layoutStrategy = computed(() => getLayoutStrategy(props.slide.layout))

const mediaParts = computed(() => {
  const lp = props.slide.layoutProps
  if (!lp)
    return null
  // Storybook shortcut: `:layout{story="<id>"}` resolves against the
  // frontmatter `storybook` base URL and is embedded as an iframe. Falls
  // back to an explicit `src`/`type` when no story is set.
  const storySrc = lp.story
    ? buildStoryUrl(props.metadata?.storybook, lp.story)
    : undefined
  const src = storySrc ?? lp.src
  if (!src)
    return null
  const type = storySrc ? 'iframe' : lp.type
  const fit = getMediaFit(lp)
  // `previewWidth` (logical desktop px) drives the iframe zoom-out. Disabled
  // with `raw` or `fit="contain"`. MDC may lowercase the attribute key.
  const previewWidthRaw = lp.previewWidth ?? lp.previewwidth
  const previewWidth = previewWidthRaw ? Number.parseInt(previewWidthRaw, 10) : 1440
  const scaled = type === 'iframe' && lp.raw == null && fit !== 'contain'
  return {
    src,
    type,
    title: lp.title || '',
    alt: lp.alt || '',
    fit,
    scaled,
    previewWidth: Number.isFinite(previewWidth) && previewWidth > 0 ? previewWidth : 1440,
    hasLightbox: Boolean(lp.lightbox),
    previewLink: (lp.lightbox && type === 'iframe') ? src : undefined,
    previewImage: (lp.lightbox && type !== 'iframe') ? src : undefined,
  }
})

// Scale the `:layout{story}` iframe to a logical desktop width, like StoryFrame.
const mediaPaneEl = ref<HTMLElement | null>(null)
const mediaPreviewWidth = computed(() => mediaParts.value?.previewWidth ?? 1440)
const mediaScaling = computed(() => Boolean(mediaParts.value?.scaled))
const { frameStyle: mediaFrameStyle } = useScaledFrame(
  mediaPaneEl,
  mediaPreviewWidth,
  mediaScaling,
)

const parsedQuicklink = computed(() => {
  if (!props.slide.quicklink)
    return null
  return {
    ...props.slide.quicklink,
    parts: quicklinkParts(props.slide.quicklink.text),
  }
})
</script>

<template>
  <!-- Full layout: single MDCRenderer covers the whole slide -->
  <template v-if="layoutStrategy === 'full'">
    <MDCRenderer
      :body="slide.body"
      :data="metadata"
      :components="mdcComponents"
    />
  </template>

  <!-- Default + media layouts: header/article with optional media pane -->
  <template v-else>
    <div class="slide-content-pane">
      <!-- hgroup: heading + optional pretitle / subtitle -->
      <hgroup v-if="slide.header?.children?.length && (slide.pretitle || slide.subtitle)">
        <div
          v-if="slide.pretitle"
          class="slide-pretitle"
        >
          <MDCRenderer
            :body="slide.pretitle"
            :data="metadata"
            :components="mdcComponents"
          />
        </div>
        <div class="slide-heading">
          <MDCRenderer
            :body="slide.header"
            :data="metadata"
            :components="mdcComponents"
          />
        </div>
        <div
          v-if="slide.subtitle"
          class="slide-subtitle"
        >
          <MDCRenderer
            :body="slide.subtitle"
            :data="metadata"
            :components="mdcComponents"
          />
        </div>
      </hgroup>

      <!-- Plain header (no pretitle/subtitle) -->
      <header v-else-if="slide.header?.children?.length">
        <MDCRenderer
          :body="slide.header"
          :data="metadata"
          :components="mdcComponents"
        />
      </header>

      <article v-if="slide.body?.children?.length">
        <MDCRenderer
          :body="slide.body"
          :data="metadata"
          :components="mdcComponents"
        />
      </article>
    </div>

    <!-- Media pane (image or iframe) -->
    <aside
      v-if="mediaParts"
      ref="mediaPaneEl"
      class="slide-media-pane"
      :class="[
        `fit-${mediaParts.fit}`,
        { 'has-lightbox': mediaParts.hasLightbox, 'is-scaled': mediaParts.scaled },
      ]"
      :data-preview-link="mediaParts.previewLink"
      :data-preview-image="mediaParts.previewImage"
    >
      <iframe
        v-if="mediaParts.type === 'iframe'"
        :src="mediaParts.src"
        :title="mediaParts.title"
        :style="mediaParts.scaled ? mediaFrameStyle : undefined"
        frameborder="0"
        allowfullscreen
      />
      <img
        v-else
        :src="mediaParts.src"
        :class="`fit-${mediaParts.fit}`"
        :alt="mediaParts.alt"
      >
    </aside>

    <!-- Quick navigation hint pinned to the bottom -->
    <div
      v-if="parsedQuicklink"
      class="slide-quicklink-wrapper"
    >
      <template v-if="parsedQuicklink.parts">
        <span class="slide-quicklink-prefix">{{ parsedQuicklink.parts.prefix }}</span>
        <a
          :href="parsedQuicklink.href"
          class="slide-quicklink"
        >{{ parsedQuicklink.parts.label }} →</a>
      </template>
      <a
        v-else
        :href="parsedQuicklink.href"
        class="slide-quicklink"
      >{{ parsedQuicklink.text }} →</a>
    </div>
  </template>
</template>

<style scoped>
/*
 * No styles here on purpose.
 *
 * The MDC structural bridge (display: contents on wrapper divs) and the
 * `.slide-content-pane` declaration are now part of the engine layer:
 * `themes/shared/_reveal-patches.scss`. They had to be promoted out of this
 * scoped block because they form a contract shared with media-layout rules
 * and can no longer rely on Vue's :deep() tunnel without duplication.
 */
</style>
