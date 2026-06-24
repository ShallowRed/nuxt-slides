<script setup lang="ts">
/**
 * Full-screen error placeholder for the deck routes (/slides, /p), replacing the
 * inline error markup that was copy-pasted into both pages. Self-contained so it
 * works inside the bare `presentation` layout.
 */
defineProps<{
  message?: string
}>()
</script>

<template>
  <div class="deck-error">
    <div class="deck-error__icon">
      ⚠️
    </div>
    <h1>Présentation indisponible</h1>
    <p>{{ message || 'Impossible de charger la présentation.' }}</p>
    <NuxtLink
      to="/"
      class="deck-error__back"
    >
      ← Retour aux présentations
    </NuxtLink>
  </div>
</template>

<style scoped>
.deck-error {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
  padding: 2rem;
  color: #e2e8f0;
  background: #0f172a;
  width: 100vw;
}

.deck-error__icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.deck-error h1 {
  color: #f87171;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
}

.deck-error__back {
  margin-top: 2rem;
  color: #93c5fd;
  text-decoration: none;
  font-weight: 600;
}

.deck-error__back:hover {
  text-decoration: underline;
}
</style>
