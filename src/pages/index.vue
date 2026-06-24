<script setup lang="ts">
import type { CatalogQuery, PresentationListItem } from '#shared/presentations'
import { applyCatalogQuery } from '#shared/presentations'

const { data: presentations, status, error } = await useAsyncData(
  'presentations',
  () => $fetch<PresentationListItem[]>('/api/presentations'),
  { default: () => [] },
)

const query = ref<CatalogQuery>({ search: '', statuses: [], sortKey: 'title', sortDir: 'asc' })

const visible = computed(() => applyCatalogQuery(presentations.value, query.value))
</script>

<template>
  <div
    class="min-h-screen bg-neutral p-8"
    data-theme="corporate"
  >
    <div class="max-w-6xl mx-auto">
      <AppHeader
        subtitle="Sélectionnez une présentation"
        show-admin-link
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
        <CatalogState
          v-else-if="presentations.length === 0"
          state="empty"
        />

        <template v-else>
          <CatalogToolbar
            v-model="query"
            :items="presentations"
            show-status-filter
          />

          <div
            v-if="visible.length === 0"
            class="text-center text-base-content/50 py-12"
          >
            Aucune présentation ne correspond à votre recherche.
          </div>
          <div
            v-else
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <PresentationCard
              v-for="presentation in visible"
              :key="presentation.slug"
              :presentation="presentation"
              variant="public"
            />
          </div>
        </template>
      </main>
    </div>
  </div>
</template>
