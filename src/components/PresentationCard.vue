<script setup lang="ts">
import type { PresentationListItem } from '#shared/presentations'
import { STATUS_CONFIG } from '#shared/presentations'

/**
 * One presentation card, shared by the home and the admin dashboard (the markup
 * was duplicated and had drifted). `variant` toggles the small differences:
 * the public home links via the canonical alias and flags frozen decks; admin
 * shows the filename and a status badge for management.
 */
const props = withDefaults(defineProps<{
  presentation: PresentationListItem
  variant?: 'public' | 'admin'
}>(), {
  variant: 'public',
})

const frozen = computed(() =>
  props.presentation.lifecycle === 'frozen' || props.presentation.lifecycle === 'archived')

const to = computed(() =>
  props.presentation.alias
    ? `/p/${props.presentation.alias}`
    : `/slides/${props.presentation.slug}`)

const statusDisplay = computed(() => STATUS_CONFIG[props.presentation.status])

// Resolve the real NuxtLink component: passing the string 'NuxtLink' to <component
// :is> renders an inert <nuxtlink> HTML element (no navigation) — the click bug.
const NuxtLink = resolveComponent('NuxtLink')
const rootTag = computed(() => (props.variant === 'public' ? NuxtLink : 'div'))
</script>

<template>
  <component
    :is="rootTag"
    :to="variant === 'public' ? to : undefined"
    class="card shadow-lg transition-all duration-300"
    :class="[
      variant === 'public' ? 'hover:shadow-2xl hover:-translate-y-1' : 'hover:shadow-xl',
      frozen ? 'bg-base-200 border-l-4 border-info' : 'bg-base-100',
    ]"
  >
    <div class="card-body">
      <h2 class="card-title text-base-content text-lg">
        {{ presentation.title }}
        <span
          v-if="presentation.lifecycle === 'archived'"
          class="text-xs font-normal opacity-50"
        >· archivée</span>
      </h2>

      <div class="flex flex-wrap gap-2 mt-2">
        <span
          v-if="frozen"
          class="badge badge-info gap-1"
          title="Bundle autoportant — instantané gelé, non éditable en direct (DDR-017)"
        >
          ❄️ Gelée
        </span>
        <span
          v-else
          class="badge gap-1"
          :class="statusDisplay?.badge || 'badge-ghost'"
        >
          {{ statusDisplay?.icon }} {{ statusDisplay?.label || presentation.status }}
        </span>

        <span
          v-if="presentation.unlisted"
          class="badge badge-ghost gap-1"
        >
          👻 Unlisted
        </span>

        <span class="badge badge-outline">
          {{ presentation.theme }}
        </span>
      </div>

      <p
        v-if="variant === 'admin'"
        class="text-sm text-base-content/50 mt-1"
      >
        {{ presentation.filename }}
      </p>

      <div
        v-if="variant === 'admin'"
        class="card-actions justify-end mt-4"
      >
        <NuxtLink
          :to="to"
          class="btn btn-primary btn-sm"
        >
          View
        </NuxtLink>
      </div>
    </div>
  </component>
</template>
