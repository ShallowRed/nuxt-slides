<script setup lang="ts">
import type { CatalogQuery, PresentationListItem } from '#shared/presentations'
import type { Project } from '#shared/projects'
import { applyCatalogQuery } from '#shared/presentations'

const { data: presentations, status, error } = await useAsyncData(
  'presentations',
  () => $fetch<PresentationListItem[]>('/api/presentations'),
  { default: () => [] },
)

const { data: projects } = await useAsyncData(
  'projects',
  () => $fetch<Project[]>('/api/projects'),
  { default: () => [] },
)

const query = ref<CatalogQuery>({ search: '', statuses: [], projects: [], sortKey: 'title', sortDir: 'asc' })

const visible = computed(() => applyCatalogQuery(presentations.value, query.value))
</script>

<template>
  <div
    class="min-h-screen bg-base-200 p-6 sm:p-8"
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
            :projects="projects"
            show-status-filter
          />

          <div
            v-if="visible.length === 0"
            class="flex flex-col items-center text-center text-base-content/50 py-16 gap-2"
          >
            <Icon
              name="ri:search-eye-line"
              size="2rem"
              class="opacity-50"
            />
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
