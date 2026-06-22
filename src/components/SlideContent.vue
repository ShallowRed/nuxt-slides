<script setup lang="ts">
import type { PresentationMetadata, Slide } from '~/types/presentation'
import MDCRenderer from '@nuxtjs/mdc/runtime/components/MDCRenderer.vue'
import { getLayoutStrategy } from '~/config/layouts'
import { getMediaFit, quicklinkParts } from '~/utils/slide-rendering'
import { buildStoryUrl, EMBED_SANDBOX } from '~/utils/storybook'

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
  // with `raw` or `fit="contain"`. MDC kebab-cases camelCase attribute keys, so
  // `previewWidth="1600"` arrives as `preview-width` — check that first, with the
  // camel/lower forms as fallbacks.
  const previewWidthRaw = lp['preview-width'] ?? lp.previewWidth ?? lp.previewwidth
  const previewWidth = previewWidthRaw ? Number.parseInt(previewWidthRaw, 10) : 1440
  const scaled = type === 'iframe' && lp.raw == null && fit !== 'contain'
  const hasLightbox = Boolean(lp.lightbox)
  return {
    src,
    type,
    title: lp.title || '',
    alt: lp.alt || '',
    fit,
    scaled,
    // Without a lightbox, a scaled story embed is interactive in place: clicks
    // browse *inside* the iframe (sandboxed, so it can't escape the slides).
    interactive: scaled && !hasLightbox,
    previewWidth: Number.isFinite(previewWidth) && previewWidth > 0 ? previewWidth : 1440,
    hasLightbox,
    hint: lp.hint || undefined,
    previewLink: (lp.lightbox && type === 'iframe') ? src : undefined,
    previewImage: (lp.lightbox && type !== 'iframe') ? src : undefined,
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

      <p
        v-if="mediaParts?.hint"
        class="slide-media-hint"
      >
        {{ mediaParts.hint }}
      </p>
    </div>

    <!-- Media pane (image or iframe) -->
    <aside
      v-if="mediaParts"
      class="slide-media-pane"
      :class="[
        `fit-${mediaParts.fit}`,
        { 'has-lightbox': mediaParts.hasLightbox, 'is-scaled': mediaParts.scaled, 'is-interactive': mediaParts.interactive },
      ]"
      :style="mediaParts.scaled ? { '--preview-width': `${mediaParts.previewWidth}px` } : undefined"
      :data-preview-link="mediaParts.previewLink"
      :data-preview-image="mediaParts.previewImage"
    >
      <iframe
        v-if="mediaParts.type === 'iframe'"
        :src="mediaParts.src"
        :title="mediaParts.title"
        :sandbox="EMBED_SANDBOX"
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
