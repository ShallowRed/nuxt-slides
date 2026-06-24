<script setup lang="ts">
import type { PublicationStatus } from '#shared/access'
import type { CatalogQuery, PresentationListItem, SortKey } from '#shared/presentations'
import type { Project } from '#shared/projects'
import { PUBLICATION_STATUSES } from '#shared/access'
import { countByStatus, STATUS_CONFIG, UNGROUPED_PROJECT } from '#shared/presentations'

/**
 * Catalog controls — free-text search, sort, and status filter chips. Owns no
 * filtering logic itself: it edits a `CatalogQuery` via v-model and the page
 * feeds that through the pure `applyCatalogQuery`. Status counts come from the
 * pure `countByStatus` over the *unfiltered* list so chips show totals.
 */
const props = defineProps<{
  items: PresentationListItem[]
  /** When false, hide the status filter (e.g. a single-status view). */
  showStatusFilter?: boolean
  /** Project registry (projects.yml) for the project filter chips' labels/order. */
  projects?: Project[]
}>()

const query = defineModel<CatalogQuery>({ required: true })

const counts = computed(() => countByStatus(props.items))

/**
 * Project chips to show: every project slug present in the catalog, ordered by
 * the registry (`projects.yml`), plus an "ungrouped" chip when some deck has no
 * project. Counts come from the unfiltered items so chips show totals.
 */
const projectChips = computed(() => {
  const present = new Map<string, number>()
  let ungrouped = 0
  for (const item of props.items) {
    if (item.project)
      present.set(item.project, (present.get(item.project) ?? 0) + 1)
    else
      ungrouped++
  }
  const order = (props.projects ?? []).map(p => p.slug)
  const titleOf = new Map((props.projects ?? []).map(p => [p.slug, p.title ?? p.slug]))
  const colorOf = new Map((props.projects ?? []).map(p => [p.slug, p.color]))

  const slugs = [...present.keys()].sort((a, b) => {
    const ra = order.indexOf(a)
    const rb = order.indexOf(b)
    if (ra !== rb)
      return (ra < 0 ? Infinity : ra) - (rb < 0 ? Infinity : rb)
    return a.localeCompare(b)
  })

  const chips = slugs.map(slug => ({
    value: slug,
    label: titleOf.get(slug) ?? slug,
    color: colorOf.get(slug),
    count: present.get(slug)!,
  }))
  if (ungrouped > 0)
    chips.push({ value: UNGROUPED_PROJECT, label: 'Sans projet', color: undefined, count: ungrouped })
  return chips
})

const showProjectFilter = computed(() => projectChips.value.length > 1)

function toggleProject(value: string) {
  const current = query.value.projects ?? []
  query.value = {
    ...query.value,
    projects: current.includes(value)
      ? current.filter(p => p !== value)
      : [...current, value],
  }
}

function isProjectActive(value: string) {
  return query.value.projects?.includes(value) ?? false
}

const sortOptions: { key: SortKey, label: string }[] = [
  { key: 'title', label: 'Titre' },
  { key: 'status', label: 'Statut' },
  { key: 'theme', label: 'Thème' },
]

function toggleStatus(status: PublicationStatus) {
  const current = query.value.statuses ?? []
  query.value = {
    ...query.value,
    statuses: current.includes(status)
      ? current.filter(s => s !== status)
      : [...current, status],
  }
}

function isActive(status: PublicationStatus) {
  return query.value.statuses?.includes(status) ?? false
}

function toggleDir() {
  query.value = { ...query.value, sortDir: query.value.sortDir === 'desc' ? 'asc' : 'desc' }
}
</script>

<template>
  <div class="flex flex-col gap-4 mb-8">
    <div class="flex flex-wrap gap-2 items-center">
      <!-- Search -->
      <label class="input input-bordered flex items-center gap-2 flex-1 min-w-56 bg-base-100">
        <Icon
          name="ri:search-line"
          class="text-base-content/40"
          size="1.1rem"
        />
        <input
          :value="query.search ?? ''"
          type="search"
          class="grow"
          placeholder="Rechercher (titre, slug, thème)…"
          @input="query = { ...query, search: ($event.target as HTMLInputElement).value }"
        >
      </label>

      <!-- Sort -->
      <select
        :value="query.sortKey ?? 'title'"
        class="select select-bordered bg-base-100"
        aria-label="Trier par"
        @change="query = { ...query, sortKey: ($event.target as HTMLSelectElement).value as SortKey }"
      >
        <option
          v-for="opt in sortOptions"
          :key="opt.key"
          :value="opt.key"
        >
          {{ opt.label }}
        </option>
      </select>
      <button
        type="button"
        class="btn btn-square btn-ghost border border-base-300 bg-base-100"
        :title="query.sortDir === 'desc' ? 'Décroissant' : 'Croissant'"
        @click="toggleDir"
      >
        <Icon
          :name="query.sortDir === 'desc' ? 'ri:sort-desc' : 'ri:sort-asc'"
          size="1.2rem"
        />
      </button>
    </div>

    <!-- Status filter chips -->
    <div
      v-if="showStatusFilter"
      class="flex flex-wrap gap-2"
    >
      <button
        v-for="status in PUBLICATION_STATUSES"
        :key="status"
        type="button"
        class="badge badge-lg gap-1.5 cursor-pointer transition-all"
        :class="isActive(status)
          ? STATUS_CONFIG[status].badge
          : 'badge-outline border-base-300 text-base-content/60 hover:border-base-content/40'"
        @click="toggleStatus(status)"
      >
        <Icon
          :name="STATUS_CONFIG[status].icon"
          size="0.9rem"
        />
        {{ STATUS_CONFIG[status].label }}
        <span class="opacity-70 tabular-nums">{{ counts[status] }}</span>
      </button>
    </div>

    <!-- Project filter chips -->
    <div
      v-if="showProjectFilter"
      class="flex flex-wrap gap-2"
    >
      <button
        v-for="chip in projectChips"
        :key="chip.value"
        type="button"
        class="badge badge-lg gap-1.5 cursor-pointer transition-all"
        :class="isProjectActive(chip.value)
          ? 'badge-neutral'
          : 'badge-outline border-base-300 text-base-content/60 hover:border-base-content/40'"
        :style="isProjectActive(chip.value) && chip.color
          ? { backgroundColor: chip.color, borderColor: chip.color, color: '#fff' }
          : undefined"
        @click="toggleProject(chip.value)"
      >
        <Icon
          name="ri:folder-2-line"
          size="0.9rem"
        />
        {{ chip.label }}
        <span class="opacity-70 tabular-nums">{{ chip.count }}</span>
      </button>
    </div>
  </div>
</template>
