<script setup lang="ts">
import type { PresentationListItem } from '#shared/presentations'
import { STATUS_CONFIG } from '#shared/presentations'

/**
 * One presentation card, shared by the home and the admin dashboard (the markup
 * was duplicated and had drifted). `variant` toggles the small differences:
 * the public home links via the canonical alias and flags frozen decks; admin
 * shows the filename and a manage action.
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
    class="group card bg-base-100 border border-base-300 shadow-sm transition-all duration-200 overflow-hidden"
    :class="variant === 'public'
      ? 'hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5 cursor-pointer'
      : ''"
  >
    <!-- Status accent strip -->
    <div
      class="h-1 w-full"
      :class="frozen ? 'bg-info' : {
        'public': 'bg-success',
        'semi-private': 'bg-warning',
        'private': 'bg-info',
        'draft': 'bg-base-300',
      }[presentation.status]"
    />

    <div class="card-body gap-3 p-5">
      <div class="flex items-start justify-between gap-3">
        <h2 class="font-semibold text-base-content leading-snug line-clamp-2">
          {{ presentation.title }}
        </h2>
        <Icon
          v-if="variant === 'public'"
          name="ri:arrow-right-up-line"
          class="shrink-0 text-base-content/30 group-hover:text-primary transition-colors mt-0.5"
          size="1.1rem"
        />
      </div>

      <div class="flex flex-wrap items-center gap-1.5">
        <span
          v-if="frozen"
          class="badge badge-info badge-sm gap-1 font-medium"
          title="Bundle autoportant — instantané gelé, non éditable en direct (DDR-017)"
        >
          <Icon
            name="ri:snowflake-line"
            size="0.85rem"
          />
          {{ presentation.lifecycle === 'archived' ? 'Archivée' : 'Gelée' }}
        </span>
        <span
          v-else
          class="badge badge-sm gap-1 font-medium"
          :class="statusDisplay?.badge || 'badge-ghost'"
        >
          <Icon
            :name="statusDisplay?.icon || 'ri:file-line'"
            size="0.85rem"
          />
          {{ statusDisplay?.label || presentation.status }}
        </span>

        <span
          v-if="presentation.unlisted"
          class="badge badge-sm badge-ghost gap-1"
        >
          <Icon
            name="ri:eye-off-line"
            size="0.85rem"
          />
          Unlisted
        </span>

        <span class="badge badge-sm badge-outline gap-1 text-base-content/60">
          <Icon
            name="ri:palette-line"
            size="0.85rem"
          />
          {{ presentation.theme }}
        </span>
      </div>

      <template v-if="variant === 'admin'">
        <p class="text-xs text-base-content/40 font-mono flex items-center gap-1">
          <Icon
            name="ri:file-text-line"
            size="0.85rem"
          />
          {{ presentation.filename }}
        </p>
        <div class="card-actions justify-end pt-1">
          <NuxtLink
            :to="to"
            class="btn btn-primary btn-sm gap-1"
          >
            <Icon
              name="ri:eye-line"
              size="1rem"
            />
            Ouvrir
          </NuxtLink>
        </div>
      </template>
    </div>
  </component>
</template>
