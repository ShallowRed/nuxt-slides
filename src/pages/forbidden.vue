<script setup lang="ts">
import { ROLE_CONFIG } from '#shared/access'
import { useAppSession } from '~/composables/useAppSession'

definePageMeta({
  layout: false,
})

/**
 * Shown when a logged-in but non-privileged actor (a viewer) tries to reach an
 * owner/editor-only page. Explains why rather than silently bouncing — the API
 * remains the real enforcement boundary; this is just honest UX.
 */
const { role, user } = useAppSession()
const roleDisplay = computed(() => ROLE_CONFIG[role.value])
</script>

<template>
  <div
    class="min-h-screen bg-neutral flex items-center justify-center p-8"
    data-theme="corporate"
  >
    <div class="card bg-base-100 shadow-xl w-full max-w-md">
      <div class="card-body items-center text-center">
        <div class="text-5xl mb-2">
          🚫
        </div>
        <h1 class="card-title text-2xl">
          Accès refusé
        </h1>
        <p class="text-base-content/70">
          Cette page est réservée aux propriétaires et éditeurs.
        </p>

        <div class="flex items-center gap-2 my-2 text-sm text-base-content/60">
          <span v-if="user?.login">Connecté en tant que <strong>{{ user.login }}</strong></span>
          <span
            class="badge badge-sm gap-1"
            :class="roleDisplay.badge"
          >
            {{ roleDisplay.icon }} {{ roleDisplay.label }}
          </span>
        </div>

        <p class="text-sm text-base-content/50 mb-4">
          Demandez à un propriétaire de vous accorder le rôle approprié.
        </p>

        <div class="flex gap-2">
          <NuxtLink
            to="/"
            class="btn btn-primary btn-sm"
          >
            ← Retour aux présentations
          </NuxtLink>
          <a
            href="/auth/logout"
            class="btn btn-ghost btn-sm"
          >
            Se déconnecter
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
