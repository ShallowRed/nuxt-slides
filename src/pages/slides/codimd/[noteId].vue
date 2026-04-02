<script setup lang="ts">
definePageMeta({
  layout: 'presentation',
})

const route = useRoute()
const noteId = route.params.noteId as string
const preset = (route.query.preset as string) || 'dsfr'
const source = (route.query.source as string) || 'codimd'

// Build API URL with query params
const apiUrl = computed(() => {
  const params = new URLSearchParams({ preset, source })
  return `/api/codimd/${noteId}?${params}`
})

// Reuse the same composable with a custom API URL
const { data: presentationData, error } = usePresentation(
  `codimd-${noteId}`,
  apiUrl.value,
)

const editUrl = computed(() => presentationData.value?.editUrl || null)
</script>

<template>
  <div class="presentation-page">
    <ClientOnly>
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
          ✏️ Edit
        </a>
      </template>

      <template #fallback>
        <div class="loading">
          <p>Initializing presentation...</p>
        </div>
      </template>
    </ClientOnly>

    <div
      v-if="error"
      class="error-message"
    >
      <h1>Error Loading Presentation</h1>
      <p>{{ error.message || 'Failed to load presentation' }}</p>
      <NuxtLink to="/">
        ← Back to presentations
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.presentation-page {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.error-message {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
  padding: 2rem;
}

.error-message h1 {
  color: #e53e3e;
  margin-bottom: 1rem;
}

.error-message a {
  margin-top: 1rem;
  color: #4299e1;
}

.codimd-edit-link {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 100;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-size: 0.85rem;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.codimd-edit-link:hover {
  opacity: 1;
}
</style>
