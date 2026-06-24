import type { PublicationStatus } from '../access/status'
import type { PresentationListItem } from './list-item'

/**
 * Pure catalog view-model: search / status-filter / sort over a list of
 * `PresentationListItem`. Framework-free (no Vue, no I/O) so the catalog's UX
 * behaviour is unit-tested like the access domain — the page components stay
 * thin and just feed their reactive state through these functions.
 */

export type SortKey = 'title' | 'status' | 'theme'
export type SortDir = 'asc' | 'desc'

export interface CatalogQuery {
  /** Free-text match against title / slug / theme (case-insensitive). */
  search?: string
  /** When set, keep only these statuses; empty/undefined ⇒ all statuses. */
  statuses?: PublicationStatus[]
  /** When set, keep only these project slugs; empty/undefined ⇒ all projects. */
  projects?: string[]
  sortKey?: SortKey
  sortDir?: SortDir
}

/** Bucket key for decks with no `project:` — kept distinct so they're filterable. */
export const UNGROUPED_PROJECT = '__ungrouped__'

/** Status display order (matches the admin grouping & legend). */
const STATUS_ORDER: Record<PublicationStatus, number> = {
  'public': 0,
  'semi-private': 1,
  'private': 2,
  'draft': 3,
}

function matchesSearch(item: PresentationListItem, term: string): boolean {
  const haystack = `${item.title} ${item.slug} ${item.theme}`.toLowerCase()
  return haystack.includes(term)
}

function compare(a: PresentationListItem, b: PresentationListItem, key: SortKey): number {
  if (key === 'status')
    return STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
  const av = (key === 'title' ? a.title : a.theme).toLowerCase()
  const bv = (key === 'title' ? b.title : b.theme).toLowerCase()
  return av.localeCompare(bv)
}

/**
 * Apply a query to a catalog. Pure: returns a new array, never mutates the
 * input. Ties on the chosen key fall back to title so order is deterministic.
 */
export function applyCatalogQuery(
  items: PresentationListItem[],
  query: CatalogQuery = {},
): PresentationListItem[] {
  const term = query.search?.trim().toLowerCase() ?? ''
  const statuses = query.statuses && query.statuses.length > 0 ? new Set(query.statuses) : null
  const projects = query.projects && query.projects.length > 0 ? new Set(query.projects) : null
  const sortKey = query.sortKey ?? 'title'
  const sortDir = query.sortDir ?? 'asc'

  const filtered = items.filter((item) => {
    if (term && !matchesSearch(item, term))
      return false
    if (statuses && !statuses.has(item.status))
      return false
    if (projects && !projects.has(item.project ?? UNGROUPED_PROJECT))
      return false
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    const primary = compare(a, b, sortKey)
    const ordered = primary !== 0 ? primary : compare(a, b, 'title')
    return sortDir === 'desc' ? -ordered : ordered
  })

  return sorted
}

/** Count of items per status (for filter-chip badges). Pure. */
export function countByStatus(items: PresentationListItem[]): Record<PublicationStatus, number> {
  const counts: Record<PublicationStatus, number> = {
    'public': 0,
    'semi-private': 0,
    'private': 0,
    'draft': 0,
  }
  for (const item of items)
    counts[item.status]++
  return counts
}

export interface ProjectGroup {
  /** Project slug, or {@link UNGROUPED_PROJECT} for the no-project bucket. */
  project: string
  items: PresentationListItem[]
}

/**
 * Group a catalog into project buckets. Pure: the bucket order follows
 * `projectOrder` (the `projects.yml` order) when given, with unknown projects
 * appended alphabetically and the ungrouped bucket always last. Within a bucket,
 * input order is preserved (feed it an already-sorted list).
 */
export function groupByProject(
  items: PresentationListItem[],
  projectOrder: string[] = [],
): ProjectGroup[] {
  const buckets = new Map<string, PresentationListItem[]>()
  for (const item of items) {
    const key = item.project ?? UNGROUPED_PROJECT
    if (!buckets.has(key))
      buckets.set(key, [])
    buckets.get(key)!.push(item)
  }

  const rank = new Map(projectOrder.map((slug, i) => [slug, i]))
  return [...buckets.entries()]
    .map(([project, groupItems]): ProjectGroup => ({ project, items: groupItems }))
    .sort((a, b) => {
      if (a.project === UNGROUPED_PROJECT)
        return 1
      if (b.project === UNGROUPED_PROJECT)
        return -1
      const ra = rank.get(a.project) ?? Number.POSITIVE_INFINITY
      const rb = rank.get(b.project) ?? Number.POSITIVE_INFINITY
      if (ra !== rb)
        return ra - rb
      return a.project.localeCompare(b.project)
    })
}
