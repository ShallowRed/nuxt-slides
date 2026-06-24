/**
 * Get current user session, including the resolved access role so the client
 * (admin route guard, UI) can gate by role without re-deriving it.
 */

import { getActorRole } from '../../utils/actor'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  return {
    user: session.user || null,
    loggedIn: !!session.user,
    role: await getActorRole(event),
  }
})
