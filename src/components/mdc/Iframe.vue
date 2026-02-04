<script setup lang="ts">
interface Props {
  src: string
  title?: string
  width?: string
  height?: string
  allow?: string
  frameborder?: string
  fullwidth?: boolean
  lightbox?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  width: '100%',
  height: '500px',
  allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
  frameborder: '0',
  fullwidth: true,
  lightbox: false,
})
</script>

<template>
  <div
    class="iframe-container"
    :class="{ fullwidth: props.fullwidth }"
  >
    <!-- With lightbox: wrap in anchor for Reveal.js native lightbox -->
    <a
      v-if="props.lightbox"
      :href="props.src"
      data-preview-link
      class="iframe-lightbox-link"
    >
      <iframe
        :src="props.src"
        :title="props.title"
        :style="{ width: props.width, height: props.height }"
        :allow="props.allow"
        :frameborder="props.frameborder"
        data-preload
      />
      <div class="expand-hint">
        <span>Cliquer pour agrandir</span>
      </div>
    </a>
    <!-- Without lightbox -->
    <iframe
      v-else
      :src="props.src"
      :title="props.title"
      :style="{ width: props.width, height: props.height }"
      :allow="props.allow"
      :frameborder="props.frameborder"
      allowfullscreen
      data-preload
    />
  </div>
</template>

<style scoped>
.iframe-container {
  position: relative;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.iframe-container.fullwidth {
  /* Break out of Reveal.js scaling constraints */
  width: 100%;
  border-radius: 0;
}

.iframe-container iframe {
  display: block;
  border: none;
  min-width: 100%;
}

.iframe-lightbox-link {
  display: block;
  position: relative;
  cursor: pointer;
}

.iframe-lightbox-link iframe {
  pointer-events: none;
}

.iframe-lightbox-link:hover .expand-hint {
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
</style>
