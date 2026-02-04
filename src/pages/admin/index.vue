<script setup lang="ts">
interface Presentation {
  slug: string
  title: string
  theme: string
  status: 'public' | 'draft' | 'private' | 'semi-private'
  filename: string
}

interface SessionResponse {
  user: { id: number, login: string, name: string, avatar: string } | null
  loggedIn: boolean
}

definePageMeta({
  layout: false,
})

// Check authentication
const { data: session } = await useFetch<SessionResponse>('/api/auth/session')

// Redirect to login if not authenticated
if (!session.value?.loggedIn) {
  await navigateTo('/login')
}

// Fetch all presentations (including protected ones since we're authenticated)
const { data: presentations, status, error } = await useAsyncData(
  'admin-presentations',
  () => $fetch<Presentation[]>('/api/presentations'),
  {
    default: () => [],
  },
)

// Group presentations by status
const groupedPresentations = computed(() => {
  const groups: Record<string, Presentation[]> = {
    'public': [],
    'semi-private': [],
    'private': [],
    'draft': [],
  }

  presentations.value?.forEach((p) => {
    groups[p.status]?.push(p)
  })

  return groups
})

const statusConfig = {
  'public': { badge: 'badge-success', label: 'Public', icon: '🌐' },
  'semi-private': { badge: 'badge-warning', label: 'Password', icon: '🔑' },
  'private': { badge: 'badge-info', label: 'Private', icon: '🔒' },
  'draft': { badge: 'badge-ghost', label: 'Draft', icon: '📝' },
}
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-primary to-secondary p-8"
    data-theme="corporate"
  >
    <header class="max-w-6xl mx-auto mb-8 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-primary-content">
          Admin Dashboard
        </h1>
        <p class="text-primary-content/70">
          Manage your presentations
        </p>
      </div>
      <div class="flex gap-2">
        <NuxtLink
          to="/"
          class="btn btn-ghost btn-sm text-primary-content"
        >
          ← Public View
        </NuxtLink>
        <a
          href="/auth/logout"
          class="btn btn-outline btn-sm text-primary-content border-primary-content/30"
        >
          Sign Out
        </a>
      </div>
    </header>

    <main class="max-w-6xl mx-auto">
      <!-- Loading state -->
      <div
        v-if="status === 'pending'"
        class="card bg-base-100 shadow-xl"
      >
        <div class="card-body items-center">
          <span class="loading loading-spinner loading-lg text-primary" />
          <p class="mt-4">
            Loading presentations...
          </p>
        </div>
      </div>

      <!-- Error state -->
      <div
        v-else-if="error"
        class="alert alert-error"
      >
        <span>{{ error.message }}</span>
      </div>

      <!-- Presentations grouped by status -->
      <template v-else>
        <div
          v-for="statusKey in ['public', 'semi-private', 'private', 'draft']"
          :key="statusKey"
          class="mb-8"
        >
          <h2 class="text-xl font-semibold text-primary-content mb-4 flex items-center gap-2">
            <span>{{ statusConfig[statusKey as keyof typeof statusConfig].icon }}</span>
            <span>{{ statusConfig[statusKey as keyof typeof statusConfig].label }}</span>
            <span class="badge badge-sm">{{ groupedPresentations[statusKey]?.length || 0 }}</span>
          </h2>

          <div
            v-if="groupedPresentations[statusKey]?.length"
            class="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            <div
              v-for="presentation in groupedPresentations[statusKey]"
              :key="presentation.slug"
              class="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div class="card-body">
                <h3 class="card-title text-lg">
                  {{ presentation.title }}
                </h3>
                <div class="flex gap-2 mb-2">
                  <span
                    class="badge"
                    :class="[statusConfig[presentation.status].badge]"
                  >
                    {{ statusConfig[presentation.status].label }}
                  </span>
                  <span class="badge badge-outline">
                    {{ presentation.theme }}
                  </span>
                </div>
                <p class="text-sm text-base-content/60">
                  {{ presentation.filename }}
                </p>
                <div class="card-actions justify-end mt-4">
                  <NuxtLink
                    :to="`/slides/${presentation.slug}`"
                    class="btn btn-primary btn-sm"
                  >
                    View
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>

          <div
            v-else
            class="card bg-base-100/50 border-2 border-dashed border-base-300"
          >
            <div class="card-body items-center text-center py-8">
              <p class="text-base-content/50">
                No {{ statusKey }} presentations yet
              </p>
              <p class="text-sm text-base-content/40">
                Add .md files to <code class="bg-base-200 px-1 rounded">presentations/{{ statusKey }}/</code>
              </p>
            </div>
          </div>
        </div>
      </template>
    </main>
  </div>
</template>
