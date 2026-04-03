<script setup lang="ts">
interface Props {
  src: string
  type?: 'iframe' | 'image'
  alt?: string
  title?: string
  reverse?: boolean
  lightbox?: boolean
  ratio?: '1:1' | '1:2' | '2:1' | '1:3' | '3:1'
  fit?: 'cover' | 'contain'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'iframe',
  alt: '',
  title: '',
  reverse: false,
  lightbox: false,
  ratio: '1:2',
  fit: 'cover',
})
</script>

<template>
  <div
    class="split-slide-wrapper"
    :class="[{ reverse: props.reverse }, `ratio-${props.ratio.replace(':', '-')}`]"
  >
    <div class="split-content">
      <slot />
    </div>
    <div class="split-media">
      <!-- Use Reveal.js native lightbox with data-preview-link -->
      <a
        v-if="props.lightbox"
        :href="props.src"
        :data-preview-link="props.type === 'iframe' ? '' : undefined"
        :data-preview-image="props.type === 'image' ? '' : undefined"
        class="media-link"
      >
        <iframe
          v-if="props.type === 'iframe'"
          :src="props.src"
          :title="props.title"
          frameborder="0"
        />
        <img
          v-else
          :src="props.src"
          :class="`fit-${props.fit}`"
          :alt="props.alt"
        >
        <div class="expand-hint">
          <span>Cliquer pour agrandir</span>
        </div>
      </a>
      <!-- No lightbox -->
      <template v-else>
        <iframe
          v-if="props.type === 'iframe'"
          :src="props.src"
          :title="props.title"
          frameborder="0"
          allowfullscreen
        />
        <img
          v-else
          :src="props.src"
          :class="`fit-${props.fit}`"
          :alt="props.alt"
        >
      </template>
    </div>
  </div>
</template>

<style scoped>
.split-slide-wrapper {
  display: grid;
  gap: 2rem;
  width: 100%;
  align-items: stretch;
  box-sizing: border-box;
  height: 100%;
}

/* Ratios without reverse (content left, media right) */
.split-slide-wrapper.ratio-1-1 { grid-template-columns: 1fr 1fr; }
.split-slide-wrapper.ratio-1-2 { grid-template-columns: 1fr 2fr; }
.split-slide-wrapper.ratio-2-1 { grid-template-columns: 2fr 1fr; }
.split-slide-wrapper.ratio-1-3 { grid-template-columns: 1fr 3fr; }
.split-slide-wrapper.ratio-3-1 { grid-template-columns: 3fr 1fr; }

/* Ratios with reverse (media left, content right) */
.split-slide-wrapper.reverse.ratio-1-1 { grid-template-columns: 1fr 1fr; }
.split-slide-wrapper.reverse.ratio-1-2 { grid-template-columns: 2fr 1fr; }
.split-slide-wrapper.reverse.ratio-2-1 { grid-template-columns: 1fr 2fr; }
.split-slide-wrapper.reverse.ratio-1-3 { grid-template-columns: 3fr 1fr; }
.split-slide-wrapper.reverse.ratio-3-1 { grid-template-columns: 1fr 3fr; }

.split-slide-wrapper.reverse .split-content {
  order: 2;
}

.split-slide-wrapper.reverse .split-media {
  order: 1;
}

.split-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: left;
  padding: 1rem;
}

.split-content :deep(h3),
.split-content :deep(h4) {
  margin-top: 0;
  margin-bottom: 1rem;
}

.split-content :deep(p) {
  margin: 0.5rem 0;
}

.split-content :deep(ul),
.split-content :deep(ol) {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

.split-media {
  display: flex;
  background: white;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  position: relative;
}

.media-link {
  display: block;
  width: 100%;
  height: 100%;
  position: relative;
  cursor: pointer;
}

.media-link:hover .expand-hint {
  opacity: 1;
}

.expand-hint {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
  padding: 1rem;
  text-align: center;
  font-size: 0.9em;
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
  z-index: 10;
}

.split-media iframe {
  width: 100%;
  height: 100%;
  min-height: 400px;
  border: none;
  pointer-events: none;
}

.split-media img {
  width: 100%;
  height: 100%;
}

.split-media img.fit-cover {
  object-fit: cover;
}

.split-media img.fit-contain {
  object-fit: contain;
}
</style>
