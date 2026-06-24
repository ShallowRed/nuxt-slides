<script setup lang="ts">
definePageMeta({
  layout: false,
})

const route = useRoute()
const error = computed(() => route.query.error as string | undefined)

// Carry the intended destination across the OAuth round-trip: stash it in a
// short-lived cookie the GitHub onSuccess handler reads to redirect back.
const redirectCookie = useCookie('auth_redirect', { maxAge: 600, sameSite: 'lax' })
const redirect = computed(() => route.query.redirect as string | undefined)
onMounted(() => {
  if (redirect.value && redirect.value.startsWith('/'))
    redirectCookie.value = redirect.value
})

const errorMessage = computed(() => {
  switch (error.value) {
    case 'oauth_failed':
      return 'L\'authentification GitHub a échoué. Veuillez réessayer.'
    default:
      return error.value ? 'Authentification impossible. Veuillez réessayer.' : ''
  }
})
</script>

<template>
  <div
    class="min-h-screen bg-neutral flex items-center justify-center p-8"
    data-theme="corporate"
  >
    <div class="card bg-base-100 shadow-xl w-full max-w-md">
      <div class="card-body items-center text-center">
        <div class="grid place-items-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-2">
          <Icon
            name="ri:slideshow-3-line"
            size="1.75rem"
          />
        </div>
        <h1 class="card-title text-2xl mb-1">
          Nuxt Slides
        </h1>
        <p class="text-base-content/60 mb-6">
          Connectez-vous pour gérer vos présentations
        </p>

        <div
          v-if="errorMessage"
          role="alert"
          class="alert alert-error mb-4"
        >
          <Icon
            name="ri:error-warning-line"
            size="1.25rem"
          />
          <span>{{ errorMessage }}</span>
        </div>

        <a
          href="/auth/github"
          class="btn btn-neutral w-full gap-2"
        >
          <Icon
            name="ri:github-fill"
            size="1.25rem"
          />
          Se connecter avec GitHub
        </a>

        <div class="divider">
          ou
        </div>

        <NuxtLink
          to="/"
          class="btn btn-ghost btn-sm gap-1"
        >
          <Icon
            name="ri:arrow-left-line"
            size="1rem"
          />
          Retour aux présentations
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
