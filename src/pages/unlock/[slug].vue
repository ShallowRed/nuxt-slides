<script setup lang="ts">
definePageMeta({
  layout: false,
})

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const password = ref('')
const errorMessage = ref('')
const loading = ref(false)
const hasAttempted = ref(false)

async function unlock() {
  loading.value = true
  errorMessage.value = ''
  hasAttempted.value = true

  try {
    // Try to fetch the presentation with the password
    await $fetch(`/api/presentations/${slug.value}?password=${encodeURIComponent(password.value)}`)

    // Success! Redirect to the presentation
    await navigateTo(`/slides/${slug.value}`)
  }
  catch (e: any) {
    if (e.statusCode === 403) {
      errorMessage.value = 'Mot de passe incorrect'
    }
    else if (e.statusCode === 401) {
      errorMessage.value = 'Mot de passe requis'
    }
    else {
      errorMessage.value = e.message || 'Une erreur est survenue'
    }
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div
    class="min-h-screen bg-neutral flex items-center justify-center p-8"
    data-theme="corporate"
  >
    <div class="card bg-base-100 shadow-xl w-full max-w-md">
      <div class="card-body">
        <h1 class="card-title text-xl mb-2">
          🔐 Présentation protégée
        </h1>
        <p class="text-base-content/70 mb-6">
          Cette présentation nécessite un mot de passe.
        </p>

        <form @submit.prevent="unlock">
          <!-- Error message - only show after an attempt -->
          <div
            v-if="hasAttempted && errorMessage"
            class="alert alert-error mb-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{{ errorMessage }}</span>
          </div>

          <!-- Password input -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Mot de passe</span>
            </label>
            <input
              v-model="password"
              type="password"
              placeholder="Entrez le mot de passe"
              class="input input-bordered"
              :disabled="loading"
              autofocus
            >
          </div>

          <!-- Submit button -->
          <div class="form-control mt-6">
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="loading || !password"
            >
              <span
                v-if="loading"
                class="loading loading-spinner loading-sm"
              />
              {{ loading ? 'Vérification...' : 'Déverrouiller' }}
            </button>
          </div>
        </form>

        <div class="divider">
          ou
        </div>

        <NuxtLink
          to="/"
          class="btn btn-ghost btn-sm"
        >
          ← Retour aux présentations
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
