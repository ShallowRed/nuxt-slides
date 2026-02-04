<script setup lang="ts">
interface Presentation {
  slug: string
  title: string
  theme: string
  status: 'public' | 'draft' | 'private' | 'semi-private'
  filename: string
}

const { data: presentations, status, error } = await useAsyncData(
  'presentations',
  () => $fetch<Presentation[]>('/api/presentations'),
  {
    default: () => [],
  },
)

const statusConfig: Record<string, { badge: string, label: string, icon: string }> = {
  'public': { badge: 'badge-success', label: 'Public', icon: '🌐' },
  'semi-private': { badge: 'badge-warning', label: 'Password', icon: '🔑' },
  'private': { badge: 'badge-info', label: 'Private', icon: '🔒' },
  'draft': { badge: 'badge-ghost', label: 'Draft', icon: '📝' },
}
</script>

<template>
  <div
    class="min-h-screen bg-neutral p-8"
    data-theme="corporate"
  >
    <header class="text-center text-primary-content mb-12">
      <h1 class="text-5xl font-bold mb-2">
        Nuxt Slides
      </h1>
      <p class="text-xl opacity-90">
        Select a presentation to view
      </p>
      <NuxtLink
        to="/login"
        class="btn btn-ghost btn-sm mt-4 text-primary-content/70"
      >
        Admin →
      </NuxtLink>
    </header>

    <main class="max-w-6xl mx-auto">
      <!-- Loading state -->
      <div
        v-if="status === 'pending'"
        class="card bg-base-100 shadow-xl"
      >
        <div class="card-body items-center">
          <span class="loading loading-spinner loading-lg text-primary" />
          <p class="text-base-content/70">
            Loading presentations...
          </p>
        </div>
      </div>

      <!-- Error state -->
      <div
        v-else-if="error"
        role="alert"
        class="alert alert-error"
      >
        <span>Failed to load presentations: {{ error.message }}</span>
      </div>

      <!-- Empty state -->
      <div
        v-else-if="presentations.length === 0"
        class="card bg-base-100 shadow-xl"
      >
        <div class="card-body items-center text-center">
          <p class="text-base-content/70">
            No presentations found.
          </p>
          <p class="text-sm text-base-content/50">
            Add .md files to the presentations/ directory.
          </p>
        </div>
      </div>

      <!-- Presentations grid -->
      <div
        v-else
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <NuxtLink
          v-for="presentation in presentations"
          :key="presentation.slug"
          :to="`/slides/${presentation.slug}`"
          class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
        >
          <div class="card-body">
            <h2 class="card-title text-base-content">
              {{ presentation.title }}
            </h2>
            <div class="card-actions justify-start mt-4">
              <div
                class="badge"
                :class="statusConfig[presentation.status]?.badge || 'badge-ghost'"
              >
                {{ statusConfig[presentation.status]?.icon }} {{ statusConfig[presentation.status]?.label || presentation.status }}
              </div>
              <div class="badge badge-outline">
                {{ presentation.theme }}
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>
    </main>
  </div>
</template>
