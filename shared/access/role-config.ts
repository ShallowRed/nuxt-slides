import type { Role } from './roles'

/**
 * Role display config (badge class, label, icon) — the identity vocabulary shown
 * in the app header. Framework-free data (DaisyUI class strings), the role-level
 * analogue of `STATUS_CONFIG` for the catalog.
 */
export interface RoleDisplay {
  badge: string
  label: string
  icon: string
}

export const ROLE_CONFIG: Record<Role, RoleDisplay> = {
  owner: { badge: 'badge-primary', label: 'Owner', icon: '👑' },
  editor: { badge: 'badge-secondary', label: 'Editor', icon: '✏️' },
  viewer: { badge: 'badge-ghost', label: 'Viewer', icon: '👁️' },
  anonymous: { badge: 'badge-ghost', label: 'Guest', icon: '👤' },
}
