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
</script>

<template>
  <template
    v-for="(section, index) in presentationData.slides"
    :key="index"
  >
    <!-- Horizontal section with vertical slides -->
    <section
      v-if="section.verticalSlides && section.verticalSlides.length > 0"
      :id="slideIdMap[index]?.sectionId"
      :class="section.headingLevel ? `slide-${section.headingLevel}` : ''"
      :data-background-image="getBackground(section)"
    >
      <section
        v-for="(verticalSlide, vIndex) in section.verticalSlides"
        :id="slideIdMap[index]?.verticalIds?.[vIndex]"
        :key="`${index}-${vIndex}`"
        :data-markdown="false"
        :class="[
          verticalSlide.headingLevel ? `slide-${verticalSlide.headingLevel}` : '',
          verticalSlide.layout ? `layout-${verticalSlide.layout}` : '',
        ]"
        :data-background-image="getBackground(verticalSlide)"
      >
        <!-- Special layout: single MDCRenderer for full slide content -->
        <template v-if="verticalSlide.layout">
          <MDCRenderer
            :body="verticalSlide.body"
            :data="presentationData.metadata"
            :components="mdcComponents"
          />
        </template>
        <!-- Default layout: header + article -->
        <template v-else>
          <!-- Header with optional pretitle/subtitle (hgroup) -->
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
      <!-- Special layout: single MDCRenderer for full slide content -->
      <template v-if="section.layout">
        <MDCRenderer
          :body="section.body"
          :data="presentationData.metadata"
          :components="mdcComponents"
        />
      </template>
      <!-- Default layout: header + article -->
      <template v-else>
        <!-- Header with optional pretitle/subtitle (hgroup) -->
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
</style>
