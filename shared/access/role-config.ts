import type { Role } from './roles'

/**
 * Role display config (badge class, label, icon) — the identity vocabulary shown
 * in the app header. Framework-free data (DaisyUI class strings + Remix-icon
 * names), the role-level analogue of `STATUS_CONFIG` for the catalog.
 *
 * `icon` is a Remix-icon name (`ri:*`) rendered via `<Icon>` (@nuxt/icon).
 */
export interface RoleDisplay {
  badge: string
  label: string
  icon: string
}

export const ROLE_CONFIG: Record<Role, RoleDisplay> = {
  owner: { badge: 'badge-primary', label: 'Owner', icon: 'ri:vip-crown-line' },
  editor: { badge: 'badge-secondary', label: 'Editor', icon: 'ri:quill-pen-line' },
  viewer: { badge: 'badge-ghost', label: 'Viewer', icon: 'ri:eye-line' },
  anonymous: { badge: 'badge-ghost', label: 'Guest', icon: 'ri:user-line' },
}
