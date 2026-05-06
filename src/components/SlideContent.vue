<script setup lang="ts">
import type { PresentationMetadata, Slide } from '~/types/presentation'
import MDCRenderer from '@nuxtjs/mdc/runtime/components/MDCRenderer.vue'
import { getLayoutStrategy } from '~/config/layouts'
import { getMediaFit, quicklinkParts } from '~/utils/slide-rendering'

const props = defineProps<{
  slide: Slide
  metadata: PresentationMetadata
  mdcComponents: Record<string, any>
}>()

const layoutStrategy = computed(() => getLayoutStrategy(props.slide.layout))

const mediaParts = computed(() => {
  const lp = props.slide.layoutProps
  if (!lp?.src)
    return null
  const fit = getMediaFit(lp)
  return {
    src: lp.src,
    type: lp.type,
    title: lp.title || '',
    alt: lp.alt || '',
    fit,
    hasLightbox: Boolean(lp.lightbox),
    previewLink: (lp.lightbox && lp.type === 'iframe') ? lp.src : undefined,
    previewImage: (lp.lightbox && lp.type !== 'iframe') ? lp.src : undefined,
  }
})

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
      class="slide-media-pane"
      :class="[
        `fit-${mediaParts.fit}`,
        { 'has-lightbox': mediaParts.hasLightbox },
      ]"
      :data-preview-link="mediaParts.previewLink"
      :data-preview-image="mediaParts.previewImage"
    >
      <iframe
        v-if="mediaParts.type === 'iframe'"
        :src="mediaParts.src"
        :title="mediaParts.title"
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
