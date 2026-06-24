<script setup lang="ts">
definePageMeta({
  layout: 'presentation',
})

const route = useRoute()
const slug = route.params.slug as string

// Load presentation data
const { presentationData, error } = usePresentation(slug)

// Collaborative edit link (CodiMD or HackMD)
const editUrl = computed(() => presentationData.value?.editUrl || null)

// Check if error requires password and redirect to unlock page
const requiresPassword = computed(() => {
  if (!error.value)
    return false
  const err = error.value as any
  // Check various error formats
  return err?.data?.requiresPassword
    || err?.statusCode === 401
    || err?.message?.includes('Password required')
    || err?.message?.includes('401')
})

// Handle access control errors - redirect to unlock page for password-protected
// presentations, telling it to return here once unlocked.
//
// `replace: true` so this redirect does NOT push a history entry: /slides/<slug>
// only ever bounces to /unlock, so leaving it in history traps Back (Back lands
// here, the watch re-fires, and bounces forward to /unlock again). Replacing it
// means Back from /unlock returns straight to the catalog.
watch(requiresPassword, (needsPassword) => {
  if (needsPassword)
    navigateTo(`/unlock/${slug}?return=/slides/${slug}`, { replace: true })
}, { immediate: true })
</script>

<template>
  <div class="presentation-page">
    <!-- No <ClientOnly> (DDR-017 §2.a-ter): the markup is SSR-safe and must prerender
         for the frozen bundle. Reveal init stays client-only (onMounted). -->
    <template v-if="presentationData && presentationData.slides.length > 0">
      <RevealPresentation
        :theme="presentationData.metadata.theme"
        :config="presentationData.metadata.reveal"
      >
        <RevealSlides :presentation-data="presentationData" />
      </RevealPresentation>

      <a
        v-if="editUrl"
        :href="editUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="codimd-edit-link"
        title="Edit collaboratively"
      >
        Edit
      </a>
    </template>

    <DeckError
      v-else-if="error && !requiresPassword"
      :message="error.message"
    />
  </div>
</template>

<style scoped>
.presentation-page {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.codimd-edit-link {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 100;
  padding: 0.4rem 0.8rem;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  border-radius: 0.4rem;
  font-size: 0.85rem;
  text-decoration: none;
  opacity: 0.3;
  transition: opacity 0.2s;
}

.codimd-edit-link:hover {
  opacity: 1;
}
</style>
