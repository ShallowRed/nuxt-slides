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
    <Icon
      name="ri:error-warning-line"
      size="1.25rem"
    />
    <span>{{ message || 'Échec du chargement des présentations.' }}</span>
  </div>

  <div
    v-else
    class="card bg-base-100 border border-base-300"
  >
    <div class="card-body items-center text-center py-12">
      <div class="grid place-items-center w-14 h-14 rounded-2xl bg-base-200 text-base-content/40 mb-2">
        <Icon
          name="ri:slideshow-3-line"
          size="1.75rem"
        />
      </div>
      <p class="text-base-content/70 font-medium">
        {{ message || 'Aucune présentation trouvée.' }}
      </p>
      <p class="text-sm text-base-content/50">
        Ajoutez des fichiers .md dans le dossier presentations/.
      </p>
    </div>
  </div>
</template>
