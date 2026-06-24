/**
 * GitHub OAuth handler
 * Requires environment variables:
 * - NUXT_OAUTH_GITHUB_CLIENT_ID
 * - NUXT_OAUTH_GITHUB_CLIENT_SECRET
 *
 * The actor's role is resolved here from the declared env login→role map
 * (`NUXT_OWNER_LOGINS` / `NUXT_EDITOR_LOGINS`) and stored in the session — so the
 * app no longer treats every authenticated GitHub user as the owner. Unknown
 * logins become `viewer` (public-only rights).
 */

import { readRoleMap, resolveRole } from '#shared/access'

export default defineOAuthGitHubEventHandler({
  config: {},
  async onSuccess(event, { user }) {
    const role = resolveRole(user.login, readRoleMap())

    await setUserSession(event, {
      user: {
        id: user.id,
        login: user.login,
        name: user.name,
        avatar: user.avatar_url,
        role,
      },
    })

    // Honour an intended destination stashed before the OAuth round-trip (only
    // same-origin paths, to avoid an open-redirect), then clear it. Otherwise
    // privileged users land on the dashboard; viewers go back to the catalog.
    const intended = getCookie(event, 'auth_redirect')
    deleteCookie(event, 'auth_redirect')
    const isSafe = intended && intended.startsWith('/') && !intended.startsWith('//')
    const fallback = role === 'viewer' ? '/' : '/admin'
    return sendRedirect(event, isSafe ? intended : fallback)
  },
  onError(event, error) {
    console.error('GitHub OAuth error:', error)
    return sendRedirect(event, '/login?error=oauth_failed')
  },
})
