import type { Lifecycle, PublicationStatus } from '../access/status'

/**
 * The catalog list-item — the wire contract between `GET /api/presentations` and
 * the home + admin pages.
 *
 * This shape was defined FOUR times and had drifted (the API returned `alias`,
 * `lifecycle`, `unlisted` that the client type omitted). Canonical here; the API
 * returns it and both pages import it, so the contract can't silently diverge.
 */
export interface PresentationListItem {
  slug: string
  title: string
  theme: string
  status: PublicationStatus
  filename: string
  /** Frontmatter flag: hidden from the catalog for non-privileged actors. */
  unlisted?: boolean
  /** Stable alias (DDR-018) — link to `/p/<alias>` when present. */
  alias?: string
  /** Registry lifecycle (DDR-018): frozen/archived serve a static bundle. */
  lifecycle?: Lifecycle
}
