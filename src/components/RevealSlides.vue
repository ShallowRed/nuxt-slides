<script setup lang="ts">
import type { PresentationData } from '~/types/presentation'
import MDCRenderer from '@nuxtjs/mdc/runtime/components/MDCRenderer.vue'
import { getSlideBackground, MDC_COMPONENTS } from '~/config/presentation'
import { getTextContent, slugify } from '~/utils/slugify'

const props = defineProps<{ presentationData: PresentationData }>()

/**
 * Pre-computed deduplicated ids for every slide, indexed by position.
 * Duplicates get a numeric suffix: "en-resume", "en-resume-1", "en-resume-2", …
 */
const slideIdMap = computed(() => {
  const counts = new Map<string, number>()

  function register(slide: { header?: any }): string | undefined {
    if (!slide?.header?.children?.length)
      return undefined
    const text = getTextContent(slide.header)
    const base = slugify(text, { lower: true, strict: true })
    if (!base)
      return undefined
    const n = counts.get(base) || 0
    counts.set(base, n + 1)
    return n === 0 ? base : `${base}-${n}`
  }

  return props.presentationData.slides.map((section) => {
    if (section.verticalSlides?.length) {
      const verticalIds = section.verticalSlides.map(vs => register(vs))
      return { sectionId: verticalIds[0], verticalIds }
    }
    return { sectionId: register(section) }
  })
})

// Map MDC components - using resolveComponent for auto-imported components
const mdcComponents: Record<string, any> = Object.fromEntries(
  Object.entries(MDC_COMPONENTS).map(([key, componentName]) => [
    key,
    resolveComponent(componentName),
  ]),
)

/**
 * Returns the HTML id for a vertical slide within a section.
 * - inner[0] (H2 intercalaire): no id — not directly hash-navigable
 * - inner[1] (résumé / first content): gets sectionId (H2 slug, e.g. "ce-qui-a-change")
 *   → clicking #ce-qui-a-change jumps directly here, bypassing the intercalaire
 * - inner[2+]: their own heading-based id
 */
function getVerticalId(sectionIndex: number, vIndex: number): string | undefined {
  if (vIndex === 0)
    return undefined
  if (vIndex === 1)
    return slideIdMap.value[sectionIndex]?.sectionId
  return slideIdMap.value[sectionIndex]?.verticalIds?.[vIndex]
}

/**
 * Splits a quicklink text like "Pressé·e ? Ce qui a changé" into
 * { prefix: "Pressé·e ?", label: "Ce qui a changé" }.
 * Returns null when no " ? " separator is found.
 */
function quicklinkParts(text: string): { prefix: string, label: string } | null {
  const idx = text.indexOf(' ? ')
  if (idx === -1)
    return null
  return { prefix: text.slice(0, idx + 2), label: text.slice(idx + 3) }
}

// Helper to get background for a slide
function getBackground(slide: { headingLevel?: string, backgroundImage?: string }) {
  if (slide.backgroundImage)
    return slide.backgroundImage
  return getSlideBackground(
    props.presentationData.metadata.theme || 'minimal',
    slide.headingLevel,
    props.presentationData.metadata.backgrounds,
  )
}

function getMediaFit(layoutProps?: Record<string, string>) {
  return layoutProps?.fit === 'contain' ? 'contain' : 'cover'
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
        :class="[
          verticalSlide.headingLevel ? `slide-${verticalSlide.headingLevel}` : '',
          verticalSlide.layout ? `layout-${verticalSlide.layout}` : '',
        ]"
        :data-background-image="getBackground(verticalSlide)"
      >
        <!-- Full-component layout: single MDCRenderer for full slide content -->
        <template v-if="verticalSlide.layout === 'full'">
          <MDCRenderer
            :body="verticalSlide.body"
            :data="presentationData.metadata"
            :components="mdcComponents"
          />
        </template>
        <!-- Default + media layouts: header/article with optional media pane -->
        <template v-else>
          <div class="slide-content-pane">
            <hgroup v-if="verticalSlide.header?.children?.length && (verticalSlide.pretitle || verticalSlide.subtitle)">
              <div
                v-if="verticalSlide.pretitle"
                class="slide-pretitle"
              >
                <MDCRenderer
                  :body="verticalSlide.pretitle"
                  :data="presentationData.metadata"
                  :components="mdcComponents"
                />
              </div>
              <div class="slide-heading">
                <MDCRenderer
                  :body="verticalSlide.header"
                  :data="presentationData.metadata"
                  :components="mdcComponents"
                />
              </div>
              <div
                v-if="verticalSlide.subtitle"
                class="slide-subtitle"
              >
                <MDCRenderer
                  :body="verticalSlide.subtitle"
                  :data="presentationData.metadata"
                  :components="mdcComponents"
                />
              </div>
            </hgroup>
            <header v-else-if="verticalSlide.header?.children?.length">
              <MDCRenderer
                :body="verticalSlide.header"
                :data="presentationData.metadata"
                :components="mdcComponents"
              />
            </header>
            <article v-if="verticalSlide.body?.children?.length">
              <MDCRenderer
                :body="verticalSlide.body"
                :data="presentationData.metadata"
                :components="mdcComponents"
              />
            </article>
          </div>
          <aside
            v-if="verticalSlide.layoutProps?.src"
            class="slide-media-pane"
            :class="[
              `fit-${getMediaFit(verticalSlide.layoutProps)}`,
              { 'has-lightbox': verticalSlide.layoutProps.lightbox },
            ]"
            :data-preview-link="(verticalSlide.layoutProps.lightbox && verticalSlide.layoutProps.type === 'iframe') ? verticalSlide.layoutProps.src : undefined"
            :data-preview-image="(verticalSlide.layoutProps.lightbox && verticalSlide.layoutProps.type !== 'iframe') ? verticalSlide.layoutProps.src : undefined"
          >
            <iframe
              v-if="verticalSlide.layoutProps.type === 'iframe'"
              :src="verticalSlide.layoutProps.src"
              :title="verticalSlide.layoutProps.title || ''"
              frameborder="0"
              allowfullscreen
            />
            <img
              v-else
              :src="verticalSlide.layoutProps.src"
              :class="`fit-${getMediaFit(verticalSlide.layoutProps)}`"
              :alt="verticalSlide.layoutProps.alt || ''"
            >
          </aside>
          <div
            v-if="verticalSlide.quicklink"
            class="slide-quicklink-wrapper"
          >
            <template v-if="quicklinkParts(verticalSlide.quicklink.text)">
              <span class="slide-quicklink-prefix">{{ quicklinkParts(verticalSlide.quicklink.text)!.prefix }}</span>
              <a
                :href="verticalSlide.quicklink.href"
                class="slide-quicklink"
              >{{ quicklinkParts(verticalSlide.quicklink.text)!.label }} →</a>
            </template>
            <a
              v-else
              :href="verticalSlide.quicklink.href"
              class="slide-quicklink"
            >{{ verticalSlide.quicklink.text }} →</a>
          </div>
        </template>
      </section>
    </section>

    <!-- Single horizontal slide -->
    <section
      v-else
      :id="slideIdMap[index]?.sectionId"
      :data-markdown="false"
      :class="[
        section.headingLevel ? `slide-${section.headingLevel}` : '',
        section.layout ? `layout-${section.layout}` : '',
      ]"
      :data-background-image="getBackground(section)"
    >
      <!-- Full-component layout: single MDCRenderer for full slide content -->
      <template v-if="section.layout === 'full'">
        <MDCRenderer
          :body="section.body"
          :data="presentationData.metadata"
          :components="mdcComponents"
        />
      </template>
      <!-- Default + media layouts: header/article with optional media pane -->
      <template v-else>
        <div class="slide-content-pane">
          <hgroup v-if="section.header?.children?.length && (section.pretitle || section.subtitle)">
            <div
              v-if="section.pretitle"
              class="slide-pretitle"
            >
              <MDCRenderer
                :body="section.pretitle"
                :data="presentationData.metadata"
                :components="mdcComponents"
              />
            </div>
            <div class="slide-heading">
              <MDCRenderer
                :body="section.header"
                :data="presentationData.metadata"
                :components="mdcComponents"
              />
            </div>
            <div
              v-if="section.subtitle"
              class="slide-subtitle"
            >
              <MDCRenderer
                :body="section.subtitle"
                :data="presentationData.metadata"
                :components="mdcComponents"
              />
            </div>
          </hgroup>
          <header v-else-if="section.header?.children?.length">
            <MDCRenderer
              :body="section.header"
              :data="presentationData.metadata"
              :components="mdcComponents"
            />
          </header>
          <article v-if="section.body?.children?.length">
            <MDCRenderer
              :body="section.body"
              :data="presentationData.metadata"
              :components="mdcComponents"
            />
          </article>
        </div>
        <aside
          v-if="section.layoutProps?.src"
          class="slide-media-pane"
          :class="[
            `fit-${getMediaFit(section.layoutProps)}`,
            { 'has-lightbox': section.layoutProps.lightbox },
          ]"
          :data-preview-link="(section.layoutProps.lightbox && section.layoutProps.type === 'iframe') ? section.layoutProps.src : undefined"
          :data-preview-image="(section.layoutProps.lightbox && section.layoutProps.type !== 'iframe') ? section.layoutProps.src : undefined"
        >
          <iframe
            v-if="section.layoutProps.type === 'iframe'"
            :src="section.layoutProps.src"
            :title="section.layoutProps.title || ''"
            frameborder="0"
            allowfullscreen
          />
          <img
            v-else
            :src="section.layoutProps.src"
            :class="`fit-${getMediaFit(section.layoutProps)}`"
            :alt="section.layoutProps.alt || ''"
          >
        </aside>
        <div
          v-if="section.quicklink"
          class="slide-quicklink-wrapper"
        >
          <template v-if="quicklinkParts(section.quicklink.text)">
            <span class="slide-quicklink-prefix">{{ quicklinkParts(section.quicklink.text)!.prefix }}</span>
            <a
              :href="section.quicklink.href"
              class="slide-quicklink"
            >{{ quicklinkParts(section.quicklink.text)!.label }} →</a>
          </template>
          <a
            v-else
            :href="section.quicklink.href"
            class="slide-quicklink"
          >{{ section.quicklink.text }} →</a>
        </div>
      </template>
    </section>
  </template>
</template>

<style scoped>
/**
  * MDC wraps rendered content in divs, which can break semantic structure.
  * This style makes those divs behave like their parent elements.
 */
:deep(.layout-full>div),
header :deep(> div),
article :deep(> div),
hgroup :deep(.slide-pretitle > div),
hgroup :deep(.slide-heading > div),
hgroup :deep(.slide-subtitle > div) {
  display: contents;
}

/**
 * Wrapper div for header + article.
 * Transparent (display: contents) for default layouts.
 * Becomes the content column for media layouts via the global styles below.
 */
.slide-content-pane {
  display: contents;
}
</style>

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
