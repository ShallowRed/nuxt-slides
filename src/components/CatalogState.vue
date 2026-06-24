<script setup lang="ts">
/**
 * Shared loading / error / empty placeholder for the catalog views, so both the
 * home and admin render those states identically instead of hand-rolling each.
 */
defineProps<{
  state: 'pending' | 'error' | 'empty'
  message?: string
}>()
</script>

<template>
  <div
    v-if="state === 'pending'"
    class="card bg-base-100 shadow-xl"
  >
    <div class="card-body items-center">
      <span class="loading loading-spinner loading-lg text-primary" />
      <p class="mt-2 text-base-content/70">
        Chargement des présentations…
      </p>
    </div>
  </div>

  <div
    v-else-if="state === 'error'"
    role="alert"
    class="alert alert-error"
  >
    <span>{{ message || 'Échec du chargement des présentations.' }}</span>
  </div>

  <div
    v-else
    class="card bg-base-100 shadow-xl"
  >
    <div class="card-body items-center text-center">
      <p class="text-base-content/70">
        {{ message || 'Aucune présentation trouvée.' }}
      </p>
      <p class="text-sm text-base-content/50">
        Ajoutez des fichiers .md dans le dossier presentations/.
      </p>
    </div>
  </div>
</template>
