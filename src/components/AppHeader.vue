<script setup lang="ts">
import { ROLE_CONFIG } from '#shared/access'
import { useAppSession } from '~/composables/useAppSession'

/**
 * Shared app chrome: title/subtitle slot on the left, identity on the right
 * (avatar + login + role badge, with sign-in / sign-out). One header for the
 * home and admin so identity reads the same everywhere — a logged-in viewer can
 * see they're authenticated and at what access level, which was invisible before.
 */
withDefaults(defineProps<{
  title?: string
  subtitle?: string
  /** Show the "Admin →" shortcut to privileged users (home only). */
  showAdminLink?: boolean
}>(), {
  title: 'Nuxt Slides',
  subtitle: '',
  showAdminLink: false,
})

const { loggedIn, role, user, privileged } = useAppSession()
const roleDisplay = computed(() => ROLE_CONFIG[role.value])
</script>

<template>
  <header class="navbar bg-base-100 shadow-sm rounded-box mb-8 px-4">
    <div class="flex-1">
      <div>
        <NuxtLink
          to="/"
          class="text-xl font-bold text-base-content"
        >
          {{ title }}
        </NuxtLink>
        <p
          v-if="subtitle"
          class="text-sm text-base-content/60"
        >
          {{ subtitle }}
        </p>
      </div>
    </div>

    <div class="flex-none gap-2 items-center">
      <NuxtLink
        v-if="showAdminLink && privileged"
        to="/admin"
        class="btn btn-ghost btn-sm"
      >
        Admin →
      </NuxtLink>

      <!-- Anonymous: invite to sign in -->
      <a
        v-if="!loggedIn"
        href="/auth/github"
        class="btn btn-neutral btn-sm gap-2"
      >
        <svg
          class="w-4 h-4"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
        Sign in
      </a>

      <!-- Logged in: identity dropdown -->
      <div
        v-else
        class="dropdown dropdown-end"
      >
        <div
          tabindex="0"
          role="button"
          class="btn btn-ghost btn-sm gap-2 normal-case"
        >
          <div
            v-if="user?.avatar"
            class="avatar"
          >
            <div class="w-6 rounded-full">
              <img
                :src="user.avatar"
                :alt="user?.login || 'avatar'"
              >
            </div>
          </div>
          <span class="hidden sm:inline">{{ user?.login || user?.name }}</span>
          <span
            class="badge badge-sm gap-1"
            :class="roleDisplay.badge"
          >
            {{ roleDisplay.icon }} {{ roleDisplay.label }}
          </span>
        </div>
        <ul
          tabindex="0"
          class="dropdown-content menu bg-base-100 rounded-box z-10 mt-2 w-52 p-2 shadow"
        >
          <li v-if="privileged">
            <NuxtLink to="/admin">
              Dashboard
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/">
              Public catalog
            </NuxtLink>
          </li>
          <li>
            <a href="/auth/logout">Sign out</a>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>
