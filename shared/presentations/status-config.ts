import type { PublicationStatus } from '../access/status'

/**
 * Presentation-status display config (badge class, label, icon) — the catalog's
 * visual vocabulary. It was hardcoded identically in both `index.vue` and
 * `admin/index.vue`; defined once here and consumed by both. Framework-free data
 * (DaisyUI class strings are presentation data, not logic).
 */
export interface StatusDisplay {
  badge: string
  label: string
  icon: string
}

export const STATUS_CONFIG: Record<PublicationStatus, StatusDisplay> = {
  'public': { badge: 'badge-success', label: 'Public', icon: '🌐' },
  'semi-private': { badge: 'badge-warning', label: 'Password', icon: '🔑' },
  'private': { badge: 'badge-info', label: 'Private', icon: '🔒' },
  'draft': { badge: 'badge-ghost', label: 'Draft', icon: '📝' },
}
