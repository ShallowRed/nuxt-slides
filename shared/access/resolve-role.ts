import type { Role } from './roles'
import process from 'node:process'

/**
 * Declared login→role resolution (app-layer access domain).
 *
 * Roles are assigned at GitHub login from a declared env map, not a database —
 * the same "config as data" approach as `readContentSourceConfig`
 * (`shared/content/source-config.ts`). Owners and editors are listed by GitHub
 * login; any other authenticated login is a `viewer`; no session is `anonymous`.
 *
 * Pure (env injected) so it is unit-testable without a runtime.
 */
export interface RoleMap {
  /** GitHub logins (lowercased) with the owner role. */
  owner: string[]
  /** GitHub logins (lowercased) with the editor role. */
  editor: string[]
}

/** Parse a comma-separated env list into lowercased, trimmed logins. */
function parseLogins(value: string | undefined): string[] {
  return value
    ? value.split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
    : []
}

/**
 * Read the role map from an environment map (defaults to `process.env`):
 * `NUXT_OWNER_LOGINS` / `NUXT_EDITOR_LOGINS`, comma-separated GitHub logins.
 */
export function readRoleMap(env: NodeJS.ProcessEnv = process.env): RoleMap {
  return {
    owner: parseLogins(env.NUXT_OWNER_LOGINS),
    editor: parseLogins(env.NUXT_EDITOR_LOGINS),
  }
}

/**
 * Resolve a GitHub login to its role. `null`/empty → `anonymous`. Owner wins over
 * editor if a login appears in both. Unknown authenticated login → `viewer`.
 */
export function resolveRole(login: string | null | undefined, map: RoleMap): Role {
  if (!login)
    return 'anonymous'
  const key = login.toLowerCase()
  if (map.owner.includes(key))
    return 'owner'
  if (map.editor.includes(key))
    return 'editor'
  return 'viewer'
}
