<script setup lang="ts">
import { ROLE_CONFIG } from '#shared/access'
import { useAppSession } from '~/composables/useAppSession'

/**
 * Shared app chrome: title/subtitle on the left, identity on the right (avatar +
 * login + role badge, with sign-in / sign-out). One header for the home and
 * admin so identity reads the same everywhere — a logged-in viewer can see
 * they're authenticated and at what access level, which was invisible before.
 */
withDefaults(defineProps<{
  title?: string
  subtitle?: string
  /** Show the "Admin" shortcut to privileged users (home only). */
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
  <header class="navbar bg-base-100 border border-base-300 shadow-sm rounded-2xl mb-8 px-4 sm:px-6 py-3">
    <div class="flex-1 flex items-center gap-3">
      <div class="grid place-items-center w-9 h-9 rounded-xl bg-primary/10 text-primary shrink-0">
        <Icon
          name="ri:slideshow-3-line"
          size="1.25rem"
        />
      </div>
      <div>
        <NuxtLink
          to="/"
          class="text-lg font-bold text-base-content leading-tight"
        >
          {{ title }}
        </NuxtLink>
        <p
          v-if="subtitle"
          class="text-sm text-base-content/50 leading-tight"
        >
          {{ subtitle }}
        </p>
      </div>
    </div>

    <div class="flex-none gap-2 items-center">
      <NuxtLink
        v-if="showAdminLink && privileged"
        to="/admin"
        class="btn btn-ghost btn-sm gap-1"
      >
        <Icon
          name="ri:dashboard-line"
          size="1.1rem"
        />
        <span class="hidden sm:inline">Admin</span>
      </NuxtLink>

      <!-- Anonymous: invite to sign in -->
      <a
        v-if="!loggedIn"
        href="/auth/github"
        class="btn btn-neutral btn-sm gap-2"
      >
        <Icon
          name="ri:github-fill"
          size="1.1rem"
        />
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
            <div class="w-6 rounded-full ring-1 ring-base-300">
              <img
                :src="user.avatar"
                :alt="user?.login || 'avatar'"
              >
            </div>
          </div>
          <span class="hidden sm:inline font-medium">{{ user?.login || user?.name }}</span>
          <span
            class="badge badge-sm gap-1"
            :class="roleDisplay.badge"
          >
            <Icon
              :name="roleDisplay.icon"
              size="0.85rem"
            />
            {{ roleDisplay.label }}
          </span>
        </div>
        <ul
          tabindex="0"
          class="dropdown-content menu bg-base-100 border border-base-300 rounded-xl z-10 mt-2 w-52 p-2 shadow-lg"
        >
          <li v-if="privileged">
            <NuxtLink to="/admin">
              <Icon name="ri:dashboard-line" />
              Dashboard
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/">
              <Icon name="ri:slideshow-3-line" />
              Catalogue public
            </NuxtLink>
          </li>
          <li>
            <a href="/auth/logout">
              <Icon name="ri:logout-box-r-line" />
              Se déconnecter
            </a>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>
