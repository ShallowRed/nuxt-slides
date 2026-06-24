<script setup lang="ts">
import type { PublicationStatus } from '#shared/access'
import type { CatalogQuery, PresentationListItem } from '#shared/presentations'
import { PUBLICATION_STATUSES } from '#shared/access'
import { applyCatalogQuery, STATUS_CONFIG } from '#shared/presentations'

definePageMeta({
  layout: false,
  middleware: 'admin',
})

const { data: presentations, status, error } = await useAsyncData(
  'admin-presentations',
  () => $fetch<PresentationListItem[]>('/api/presentations'),
  { default: () => [] },
)

const query = ref<CatalogQuery>({ search: '', statuses: [], sortKey: 'title', sortDir: 'asc' })

// Search/sort apply across all statuses; the status *filter* is handled by the
// grouping below, so the toolbar's own status chips are hidden here.
const visible = computed(() => applyCatalogQuery(presentations.value, { ...query.value, statuses: [] }))

const grouped = computed(() => {
  const groups = Object.fromEntries(
    PUBLICATION_STATUSES.map(s => [s, [] as PresentationListItem[]]),
  ) as Record<PublicationStatus, PresentationListItem[]>
  for (const p of visible.value)
    groups[p.status]?.push(p)
  return groups
})
</script>

<template>
  <div
    class="min-h-screen bg-neutral p-8"
    data-theme="corporate"
  >
    <div class="max-w-6xl mx-auto">
      <AppHeader
        title="Admin Dashboard"
        subtitle="Gérez vos présentations"
      />

      <main>
        <CatalogState
          v-if="status === 'pending'"
          state="pending"
        />
        <CatalogState
          v-else-if="error"
          state="error"
          :message="error.message"
        />

        <template v-else>
          <CatalogToolbar
            v-model="query"
            :items="presentations"
            :show-status-filter="false"
          />

          <div
            v-for="statusKey in PUBLICATION_STATUSES"
            :key="statusKey"
            class="mb-8"
          >
            <h2 class="text-lg font-semibold text-base-content mb-4 flex items-center gap-2">
              <span>{{ STATUS_CONFIG[statusKey].icon }}</span>
              <span>{{ STATUS_CONFIG[statusKey].label }}</span>
              <span class="badge badge-sm">{{ grouped[statusKey]?.length || 0 }}</span>
            </h2>

            <div
              v-if="grouped[statusKey]?.length"
              class="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
            >
              <PresentationCard
                v-for="presentation in grouped[statusKey]"
                :key="presentation.slug"
                :presentation="presentation"
                variant="admin"
              />
            </div>

            <div
              v-else
              class="card bg-base-100/50 border-2 border-dashed border-base-300"
            >
              <div class="card-body items-center text-center py-6">
                <p class="text-base-content/50 text-sm">
                  Aucune présentation {{ STATUS_CONFIG[statusKey].label.toLowerCase() }}
                </p>
              </div>
            </div>
          </div>
        </template>
      </main>
    </div>
  </div>
</template>
