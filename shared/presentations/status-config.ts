import type { PublicationStatus } from '../access/status'

/**
 * Presentation-status display config (badge class, label, icon) — the catalog's
 * visual vocabulary. It was hardcoded identically in both `index.vue` and
 * `admin/index.vue`; defined once here and consumed by both. Framework-free data
 * (DaisyUI class strings + Remix-icon names are presentation data, not logic).
 *
 * `icon` is a Remix-icon name (`ri:*`) rendered via `<Icon>` (@nuxt/icon) — not an
 * emoji — so the catalog reads as a designed product rather than glyph soup.
 */
export interface StatusDisplay {
  badge: string
  label: string
  icon: string
}

export const STATUS_CONFIG: Record<PublicationStatus, StatusDisplay> = {
  'public': { badge: 'badge-success', label: 'Public', icon: 'ri:global-line' },
  'semi-private': { badge: 'badge-warning', label: 'Password', icon: 'ri:lock-password-line' },
  'private': { badge: 'badge-info', label: 'Private', icon: 'ri:lock-line' },
  'draft': { badge: 'badge-ghost', label: 'Draft', icon: 'ri:draft-line' },
}
