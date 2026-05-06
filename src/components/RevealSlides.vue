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

<!--
  No styles here on purpose.
  Engine-level slide structure (media layouts, quicklink positioning,
  MDC bridge) lives in `themes/shared/` so it is compiled into every theme
  and stays a single source of truth.
-->
