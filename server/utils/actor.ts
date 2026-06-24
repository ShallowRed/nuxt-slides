import type { Role } from '#shared/access'
import type { H3Event } from 'h3'

/**
 * The single bridge between the framework session and the pure access domain.
 *
 * Every access decision needs the actor's `Role`; this is the one place that
 * reads it off the session (set at login by the GitHub OAuth handler). Returns
 * `anonymous` when there is no session, so callers always get a concrete role to
 * feed `decideAccess` / `canList`.
 */
export async function getActorRole(event: H3Event): Promise<Role> {
  const session = await getUserSession(event).catch(() => null)
  const role = (session?.user as { role?: Role } | undefined)?.role
  return role ?? 'anonymous'
}
