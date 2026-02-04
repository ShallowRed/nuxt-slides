<script setup lang="ts">
import type { PresentationData } from '~/types/presentation'
import MDCRenderer from '@nuxtjs/mdc/runtime/components/MDCRenderer.vue'
import { getSlideBackground, MDC_COMPONENTS } from '~/config/presentation'

const props = defineProps<{ presentationData: PresentationData }>()

// Map MDC components - using resolveComponent for auto-imported components
const mdcComponents: Record<string, any> = Object.fromEntries(
  Object.entries(MDC_COMPONENTS).map(([key, componentName]) => [
    key,
    resolveComponent(componentName),
  ]),
)

// Helper to get background for a slide
function getBackground(headingLevel?: string) {
  return getSlideBackground(
    props.presentationData.metadata.theme || 'minimal',
    headingLevel,
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
      :data-background-image="getBackground(section.headingLevel)"
    >
      <section
        v-for="(verticalSlide, vIndex) in section.verticalSlides"
        :key="`${index}-${vIndex}`"
        :data-markdown="false"
        :class="[
          verticalSlide.headingLevel ? `slide-${verticalSlide.headingLevel}` : '',
          verticalSlide.layout ? `layout-${verticalSlide.layout}` : '',
        ]"
        :data-background-image="getBackground(verticalSlide.headingLevel)"
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
          <!-- Header with optional subtitle (hgroup) -->
          <hgroup v-if="verticalSlide.header?.children?.length && verticalSlide.subtitle">
            <MDCRenderer
              :body="verticalSlide.header"
              :data="presentationData.metadata"
              :components="mdcComponents"
            />
            <MDCRenderer
              :body="verticalSlide.subtitle"
              :data="presentationData.metadata"
              :components="mdcComponents"
            />
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
      :data-markdown="false"
      :class="[
        section.headingLevel ? `slide-${section.headingLevel}` : '',
        section.layout ? `layout-${section.layout}` : '',
      ]"
      :data-background-image="getBackground(section.headingLevel)"
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
        <!-- Header with optional subtitle (hgroup) -->
        <hgroup v-if="section.header?.children?.length && section.subtitle">
          <MDCRenderer
            :body="section.header"
            :data="presentationData.metadata"
            :components="mdcComponents"
          />
          <MDCRenderer
            :body="section.subtitle"
            :data="presentationData.metadata"
            :components="mdcComponents"
          />
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
:deep(.layout-split>div),
header :deep(> div),
article :deep(> div) {
  display: contents;
}
</style>
