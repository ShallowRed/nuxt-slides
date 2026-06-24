import type { Role } from '#shared/access'
import { isPrivileged } from '#shared/access'

/**
 * Route guard for owner/editor-only pages (e.g. /admin). Replaces the auth check
 * that lived inside the admin component. Not logged in → /login; logged in but
 * not privileged (a viewer) → / (the public catalog).
 *
 * This is UX/defense-in-depth: the API handlers remain the real enforcement
 * boundary (they gate by role server-side regardless of navigation).
 */
export default defineNuxtRouteMiddleware(async () => {
  const session = await $fetch<{ loggedIn: boolean, role: Role }>('/api/auth/session')
    .catch(() => null)

  if (!session?.loggedIn)
    return navigateTo('/login')

  if (!isPrivileged(session.role))
    return navigateTo('/')
})
