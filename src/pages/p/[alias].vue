<script setup lang="ts">
definePageMeta({
  layout: 'presentation',
})

const route = useRoute()
const alias = route.params.alias as string

// Resolve lifecycle first: a frozen/archived alias redirects to its static bundle
// (DDR-018), a live one renders here. The redirect happens server-side during SSR
// and client-side on hydration, so the stable URL hands off transparently.
const { data: resolved } = await useAsyncData(`p-resolve-${alias}`, () =>
  $fetch<{ lifecycle: string, frozenUrl?: string }>(`/api/p/${alias}`))

if (resolved.value?.frozenUrl) {
  await navigateTo(resolved.value.frozenUrl, { external: true, redirectCode: 302 })
}

// Live: render through the shared composable (frontmatter from repo stub + body
// from CodiMD). Skipped when redirecting above.
const { presentationData, error } = usePresentation(`p-${alias}`, `/api/p/${alias}`)

const editUrl = computed(() => presentationData.value?.editUrl || null)
</script>

<template>
  <div class="presentation-page">
    <!-- No <ClientOnly> (DDR-017 §2.a-ter): SSR-safe markup prerenders, so the live
         /p/<alias> route and the frozen bundle share one render path. -->
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
  display: flex;
  justify-content: center;
  align-items: center;
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
  margin-top: 2rem;
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.5rem;
  color: #666;
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
