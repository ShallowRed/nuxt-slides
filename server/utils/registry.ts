/**
 * Registry of diffused presentations (DDR-018).
 *
 * Loads `presentations/registry.yml` and resolves a stable alias to its
 * lifecycle + source. The registry is the source of truth for the `/p/<alias>`
 * route: an alias keeps the same URL across live → frozen → archived, so a link
 * that has already been shared stays reachable for good.
 *
 * Per-file `.md` frontmatter remains the source of truth for theme / storybook /
 * access — the registry only adds the lifecycle axis and the alias mapping.
 */

import { load as parseYaml } from 'js-yaml'
import { presentationsStorage } from './presentations'

export type Lifecycle = 'live' | 'frozen' | 'archived'

export interface RegistryEntry {
  /** The stable alias (key in the registry). */
  alias: string
  title?: string
  lifecycle: Lifecycle
  /** Stub file slug under presentations/<access>/<slug>.md. Defaults to alias. */
  slug: string
  source?: 'codimd' | 'hackmd'
  noteId?: string
  /** Bundle folder served when lifecycle is frozen/archived. */
  frozenBundle?: string
  /**
   * Access folder of the stub (public/draft/private/semi-private). Disambiguates
   *  when the same slug exists in several folders.
   */
  access?: string
  /** Historical paths redirected to this alias (already-diffused links). */
  aliases?: string[]
}

const CACHE_TTL_MS = 10_000
let cache: { entries: Map<string, RegistryEntry>, fetchedAt: number } | null = null

/**
 * Load and index the registry. Builds a lookup that resolves both the canonical
 * alias and any historical `aliases` to the same entry.
 */
async function loadRegistry(): Promise<Map<string, RegistryEntry>> {
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS)
    return cache.entries

  const entries = new Map<string, RegistryEntry>()

  try {
    const stored = await presentationsStorage().getItem('registry.yml')
    const raw = typeof stored === 'string' ? stored : stored == null ? '' : String(stored)
    const doc = (parseYaml(raw) || {}) as Record<string, Omit<RegistryEntry, 'alias'>>

    for (const [alias, value] of Object.entries(doc)) {
      const entry: RegistryEntry = {
        alias,
        slug: value.slug || alias,
        lifecycle: value.lifecycle || 'live',
        ...value,
      }
      entries.set(alias, entry)
      // Also index the stub slug, so /slides/<slug> converges on /p/<alias>
      // (avoids two URLs serving the same deck — single source of truth).
      if (entry.slug && entry.slug !== alias)
        entries.set(entry.slug, entry)
      // Map historical aliases (normalised without leading slash) to the same entry.
      for (const a of entry.aliases ?? [])
        entries.set(a.replace(/^\/+/, ''), entry)
    }
  }
  catch (error: any) {
    if (error?.code !== 'ENOENT')
      console.error('[registry] Failed to load registry.yml:', error?.message || error)
  }

  cache = { entries, fetchedAt: Date.now() }
  return entries
}

/**
 * Resolve an alias (canonical or historical) to its registry entry, or null.
 */
export async function resolveAlias(alias: string): Promise<RegistryEntry | null> {
  const entries = await loadRegistry()
  return entries.get(alias) ?? entries.get(alias.replace(/^\/+/, '')) ?? null
}

/**
 * List all registry entries (for index/navigation). `archived` entries are kept
 * resolvable but callers may choose to hide them.
 */
export async function listRegistry(): Promise<RegistryEntry[]> {
  const entries = await loadRegistry()
  // De-duplicate: only canonical aliases (where key === entry.alias).
  return [...entries.values()].filter((e, i, arr) => arr.indexOf(e) === i)
}
