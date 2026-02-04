/**
 * GitHub OAuth handler
 * Requires environment variables:
 * - NUXT_OAUTH_GITHUB_CLIENT_ID
 * - NUXT_OAUTH_GITHUB_CLIENT_SECRET
 */

export default defineOAuthGitHubEventHandler({
  config: {
    // Restrict to owner's GitHub username for single-owner mode
    // You can add emailRequired: true if you want to check email
  },
  async onSuccess(event, { user }) {
    // Set user session
    await setUserSession(event, {
      user: {
        id: user.id,
        login: user.login,
        name: user.name,
        avatar: user.avatar_url,
      },
    })

    // Redirect to admin dashboard
    return sendRedirect(event, '/admin')
  },
  onError(event, error) {
    console.error('GitHub OAuth error:', error)
    return sendRedirect(event, '/login?error=oauth_failed')
  },
})
