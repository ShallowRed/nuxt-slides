<script setup lang="ts">
import { STORYBOOK_BASE } from '~/config/injection-keys'
import { buildStoryUrl, EMBED_SANDBOX, resolveAspectRatio } from '~/utils/storybook'

/**
 * StoryFrame — a single embedded screen for a slide.
 *
 * Embeds either a live Storybook story (by id, resolved against the deck's
 * frontmatter `storybook` root) or an arbitrary iframe / image. Works on its
 * own in a slide body or as a child of `<Screens>` for side-by-side galleries.
 *
 * Iframes are rendered at a logical desktop width (`previewWidth`) and scaled
 * down to fit the frame, so the *whole* page is visible instead of the
 * top-left corner at 1:1. Raise `previewWidth` to show more, lower it to zoom in.
 *
 * Examples (markdown):
 *   ::StoryFrame{story="vitrine-accueil-scenario-a--page" label="A · Acquisition"}
 *   ::
 *   ::StoryFrame{src="/shots/home.png" type="image" ratio="desktop" lightbox}
 *   ::
 */
interface Props {
  /** Storybook story id (`<componentId>--<storyName>`). */
  story?: string
  /** Explicit URL (used when `story` is absent). */
  src?: string
  /** Media kind. Defaults to iframe when a story/url is embedded. */
  type?: 'iframe' | 'image'
  /** `cover` fills the frame (default); `contain` shows the whole media. */
  fit?: 'cover' | 'contain'
  /** Aspect ratio: named (`desktop`, `wide`, `mobile`…) or raw `16/9`. */
  ratio?: string
  /**
   * Logical width (px) the iframe renders at before being scaled to fit.
   * Higher = "zoom out" (more of the page visible). Default 1440 (desktop).
   */
  previewWidth?: string | number
  /** Disable scaling — render the iframe at the frame's native size (1:1). */
  raw?: boolean
  /** Caption shown under the frame (overrides the default slot). */
  label?: string
  /** Click to open the media full-screen (Reveal lightbox). */
  lightbox?: boolean
  /** Accessible title for the iframe / alt for the image. */
  title?: string
  /** Let the frame grow to fill the available height (galleries). */
  grow?: boolean
  /** Short incentive text shown beside the frame to invite interaction. */
  hint?: string
}

const props = withDefaults(defineProps<Props>(), {
  fit: 'cover',
  previewWidth: 1440,
  raw: false,
  lightbox: false,
  grow: false,
})

const storybookBase = inject(STORYBOOK_BASE, undefined)

const resolvedSrc = computed(() => {
  if (props.story)
    return buildStoryUrl(storybookBase?.value, props.story) ?? props.src
  return props.src
})

const isIframe = computed(() => {
  if (props.type)
    return props.type === 'iframe'
  // Stories and bare URLs default to iframe embeds.
  return Boolean(props.story) || /^https?:\/\//.test(props.src ?? '')
})

const aspect = computed(() => resolveAspectRatio(props.ratio))
const missing = computed(() => !resolvedSrc.value)

// Iframe scaling: render at a logical desktop width, shrink to fit. The width is
// exposed as `--preview-width`; scaled-frame.js reads it and sizes the iframe
// (cross-browser, unlike CSS cqh in Firefox — see _media-layouts.scss).
const previewWidthNum = computed(() => {
  const n = typeof props.previewWidth === 'string'
    ? Number.parseInt(props.previewWidth, 10)
    : props.previewWidth
  return n && Number.isFinite(n) && n > 0 ? n : 1440
})
const scalingEnabled = computed(() => isIframe.value && !props.raw)
const scaledFrameStyle = computed(() =>
  scalingEnabled.value ? { '--preview-width': `${previewWidthNum.value}px` } : undefined)
</script>

<template>
  <figure
    class="story-frame"
    :class="[`fit-${props.fit}`, { 'grow': props.grow, 'has-lightbox': props.lightbox }]"
  >
    <div
      class="story-frame__media"
      :class="{ 'is-scaled': scalingEnabled }"
      :style="[aspect ? { aspectRatio: aspect } : {}, scaledFrameStyle || {}]"
    >
      <p
        v-if="missing"
        class="story-frame__missing"
      >
        Aucune source : renseigner <code>story</code> (+ <code>storybook</code> en frontmatter) ou <code>src</code>.
      </p>

      <!-- Iframe with lightbox: wrap in a preview-link anchor -->
      <a
        v-else-if="isIframe && props.lightbox"
        :href="resolvedSrc"
        data-preview-link
        class="story-frame__lightbox"
      >
        <iframe
          :src="resolvedSrc"
          :title="props.title || props.label || 'Story'"
          :sandbox="EMBED_SANDBOX"
          frameborder="0"
          data-preload
        />
        <span class="story-frame__hint">Cliquer pour agrandir</span>
      </a>

      <!-- Plain interactive iframe -->
      <iframe
        v-else-if="isIframe"
        :src="resolvedSrc"
        :title="props.title || props.label || 'Story'"
        :sandbox="EMBED_SANDBOX"
        frameborder="0"
        allowfullscreen
        data-preload
      />

      <!-- Image (optionally clickable for the lightbox) -->
      <img
        v-else
        :src="resolvedSrc"
        :alt="props.title || props.label || ''"
        :class="`fit-${props.fit}`"
        :data-preview-image="props.lightbox ? resolvedSrc : undefined"
      >
    </div>

    <p
      v-if="props.hint"
      class="story-frame__hint-beside"
    >
      {{ props.hint }}
    </p>

    <figcaption
      v-if="props.label || $slots.default"
      class="story-frame__caption"
    >
      <template v-if="props.label">
        {{ props.label }}
      </template>
      <slot v-else />
    </figcaption>
  </figure>
</template>

<style scoped>
.story-frame {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0;
  min-width: 0;
  min-height: 0;
}

.story-frame.grow {
  flex: 1 1 0;
  height: 100%;
}

.story-frame__media {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 10px;
  background: var(--surface, #fff);
  border: 1px solid var(--fr-border-color, rgba(0, 0, 0, 0.12));
  box-shadow: 0 0.6rem 1.6rem rgba(0, 0, 18, 0.12);
}

/* When no explicit ratio and growing, fill remaining height */
.story-frame.grow .story-frame__media {
  flex: 1 1 0;
  height: 100%;
}

/* Non-scaled iframes fill the frame natively (raw mode / fallback). */
.story-frame__media iframe {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 100%;
  border: none;
}

/* Scaled iframes — sized by scaled-frame.js, not CSS (see _media-layouts.scss for
   why). This block only sets the clip box + anchor; the script sets the transform. */
.story-frame__media.is-scaled {
  --preview-width: 1440px;
  position: relative;
  overflow: hidden;
}
.story-frame__media.is-scaled iframe {
  position: absolute;
  top: 0;
  left: 0;
  /* Pre-paint fallback before scaled-frame.js runs (avoids an unscaled flash). */
  width: 100%;
  height: 100%;
  min-height: 0;
  transform-origin: top left;
}

/* Story canvases render at desktop width — scale them down to fit the frame
   while keeping the layout faithful (transform-based "zoom out"). */
.story-frame.fit-contain .story-frame__media {
  background: transparent;
  border: none;
  box-shadow: none;
}

.story-frame__media img {
  display: block;
  width: 100%;
  height: 100%;
}

.story-frame__media img.fit-cover {
  object-fit: cover;
}

.story-frame__media img.fit-contain {
  object-fit: contain;
}

.story-frame__lightbox {
  display: block;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.story-frame__lightbox iframe {
  pointer-events: none;
}

.story-frame__hint {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.6rem;
  text-align: center;
  font-size: 0.6em;
  color: #fff;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.65));
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 2;
}

.story-frame__lightbox:hover .story-frame__hint {
  opacity: 1;
}

.story-frame__caption {
  font-size: 0.6em;
  line-height: 1.3;
  color: var(--text-mention, #6b6b6b);
  text-align: center;
}

.story-frame__hint-beside {
  margin: 0.3rem 0 0;
  font-size: 0.55em;
  line-height: 1.35;
  color: var(--text-mention, #6b6b6b);
  text-align: center;
  pointer-events: none;
}

.story-frame__hint-beside::before {
  content: '↑ ';
  opacity: 0.7;
}

.story-frame__missing {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 1rem;
  font-size: 0.55em;
  color: var(--text-mention, #888);
}
</style>
