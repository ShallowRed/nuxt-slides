import { z } from 'zod'

/**
 * Actor roles (app-layer access domain).
 *
 * The app used to treat "any authenticated GitHub user" as the owner, with the
 * read gate expressed as an ad-hoc `isOwner = !!session.user` boolean scattered
 * across handlers. This makes the role a first-class, validated value, resolved
 * once at login (see `resolve-role.ts`) and carried in the session.
 *
 * `anonymous` models "no session" so the capability matrix can treat it as a real
 * row instead of a special case. `viewer` is an authenticated user with no extra
 * privileges (same read rights as anonymous, by product decision).
 */
export const RoleSchema = z.enum(['owner', 'editor', 'viewer', 'anonymous'])
export type Role = z.infer<typeof RoleSchema>

/** Roles allowed to see drafts/private decks, edit, and reach the admin area. */
export function isPrivileged(role: Role): boolean {
  return role === 'owner' || role === 'editor'
}
