<script setup lang="ts">
import type { PresentationData } from '~/types/presentation'
import { MDC_COMPONENTS } from '~/config/presentation'
import { getSlideClasses, resolveSlideBackground } from '~/utils/slide-rendering'

const props = defineProps<{ presentationData: PresentationData }>()

const { slideIdMap, getVerticalId } = useSlideIds(
  computed(() => props.presentationData.slides),
)

// Resolve auto-imported MDC components once at setup time
const mdcComponents: Record<string, any> = Object.fromEntries(
  Object.entries(MDC_COMPONENTS).map(([key, componentName]) => [
    key,
    resolveComponent(componentName),
  ]),
)

function getBackground(slide: { headingLevel?: string, backgroundImage?: string }) {
  return resolveSlideBackground(
    slide,
    props.presentationData.metadata.theme || 'minimal',
    props.presentationData.metadata.backgrounds,
  )
}
</script>

<template>
  <template
    v-for="(section, index) in presentationData.slides"
    :key="index"
  >
    <!-- Horizontal section with vertical slides -->
    <section
      v-if="section.verticalSlides && section.verticalSlides.length > 0"
      :class="section.headingLevel ? `slide-${section.headingLevel}` : ''"
      :data-background-image="getBackground(section)"
    >
      <section
        v-for="(verticalSlide, vIndex) in section.verticalSlides"
        :id="getVerticalId(index, vIndex)"
        :key="`${index}-${vIndex}`"
        :data-markdown="false"
        :class="getSlideClasses(verticalSlide)"
        :data-background-image="getBackground(verticalSlide)"
      >
        <SlideContent
          :slide="verticalSlide"
          :metadata="presentationData.metadata"
          :mdc-components="mdcComponents"
        />
      </section>
    </section>

    <!-- Single horizontal slide -->
    <section
      v-else
      :id="slideIdMap[index]?.sectionId"
      :data-markdown="false"
      :class="getSlideClasses(section)"
      :data-background-image="getBackground(section)"
    >
      <SlideContent
        :slide="section"
        :metadata="presentationData.metadata"
        :mdc-components="mdcComponents"
      />
    </section>
  </template>
</template>

<style>
/**
 * Media layout: two-column grid with content on one side and media on the other.
 * Global (unscoped) to override Reveal.js and theme display:flex.
 */
.reveal .slides section[class*="layout-media"] {
  display: grid !important;
  grid-template-columns: 1fr 1.5fr;
  gap: 2rem;
  align-items: stretch;
}

.reveal .slides section.layout-media-left {
  grid-template-columns: 1.5fr 1fr;
}

.reveal .slides section.layout-media-right-wide {
  grid-template-columns: 0.8fr 1.7fr;
}

.reveal .slides section.layout-media-left-wide {
  grid-template-columns: 1.7fr 0.8fr;
}

.reveal .slides section[class*="layout-media-left"] > .slide-content-pane {
  order: 2;
}

.reveal .slides section[class*="layout-media-left"] > .slide-media-pane {
  order: 1;
}

.reveal .slides section[class*="layout-media"] > .slide-content-pane {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: left;
  min-width: 0;
}

.reveal .slides section[class*="layout-media"][class*="-wide"] > .slide-content-pane {
  font-size: 0.75em;
}

.reveal .slides section[class*="layout-media"][class*="-wide"] > .slide-content-pane > header :is(h1, h2, h3, h4, h5, h6),
.reveal .slides section[class*="layout-media"][class*="-wide"] > .slide-content-pane > hgroup .slide-heading :is(h1, h2, h3, h4, h5, h6) {
  font-size: 1.75em;
}

.reveal .slides section[class*="layout-media"] > .slide-content-pane > header,
.reveal .slides section[class*="layout-media"] > .slide-content-pane > hgroup {
  height: auto;
  flex-shrink: 0;
}

.reveal .slides section[class*="layout-media"] > .slide-content-pane > article {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.reveal .slides section[class*="layout-media"] > .slide-media-pane {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  min-width: 0;
  border: none;
  background: transparent;
  box-shadow: none;
}

.reveal .slides section[class*="layout-media"] > .slide-media-pane:not(.fit-contain) {
  border: solid 1px var(--fr-border-color, #ccc);
  box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.1);
}

.reveal .slides section[class*="layout-media"] > .slide-media-pane.fit-contain {
  overflow: visible;
  background: transparent;
}

.reveal .slides section[class*="layout-media"] > .slide-media-pane iframe {
  width: 100%;
  height: 100%;
  border: none;
  pointer-events: none;
}

.reveal .slides section[class*="layout-media"] > .slide-media-pane img {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  background: transparent;
}

.reveal .slides section[class*="layout-media"] > .slide-media-pane img.fit-cover {
  object-fit: cover;
}

.reveal .slides section[class*="layout-media"] > .slide-media-pane img.fit-contain {
  display: block;
  width: auto;
  object-fit: contain;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  border-radius: 0;
  border: solid 1px var(--fr-border-color, #ccc);
  box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.1);
}

/* Lightbox: enable click-through and show pointer cursor */
.reveal .slides section[class*="layout-media"] > .slide-media-pane.has-lightbox {
  cursor: pointer;
}

.reveal .slides section[class*="layout-media"] > .slide-media-pane.has-lightbox iframe {
  pointer-events: none;
}

/**
 * Quicklink: small navigation hint pinned to the bottom of a slide.
 * Prefix (e.g. "Pressé·e ?") is plain muted text; the link is styled distinctly.
 */
.reveal .slides section > .slide-quicklink-wrapper {
  position: absolute;
  bottom: 0.5em;
  left: 0;
  font-size: 0.85em;
  white-space: nowrap;
  opacity: 0.75;
  transition: opacity 0.2s;
}

.reveal .slides section > .slide-quicklink-wrapper:hover {
  opacity: 1;
}

.reveal .slides section > .slide-quicklink-wrapper .slide-quicklink-prefix {
  color: var(--r-main-color, #3a3a3a);
  margin-right: 0.4em;
}

.reveal .slides section > .slide-quicklink-wrapper .slide-quicklink {
  color: var(--r-link-color, #000091);
  text-decoration: underline;
  text-underline-offset: 2px;
}
</style>
