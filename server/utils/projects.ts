/**
 * Project registry loader (docs/presentation-metadata.md).
 *
 * Loads `presentations/projects.yml` (the catalog's grouping axis) through the
 * same Nitro server-asset storage + shared TTL cache as the deck registry
 * (`registry.ts`), and validates it with the pure `parseProjects`
 * (`#shared/projects`). The YAML is the single source of truth for a project's
 * display title / order / color; a deck opts into a project via its frontmatter
 * `project:` slug.
 */

import type { Project } from '#shared/projects'
import { createTtlCache, DEFAULT_CACHE_TTL_MS } from '#shared/deck'
import { parseProjects } from '#shared/projects'
import { load as parseYaml } from 'js-yaml'
import { presentationsStorage } from './presentations'

/** Shared TTL cache (audit §5.7) — same helper as registry/note source. */
const projectsCache = createTtlCache<Project[]>(
  () => {
    const raw = useRuntimeConfig().sourceCacheTtlMs
    const n = typeof raw === 'number' ? raw : Number(raw)
    return Number.isFinite(n) && n > 0 ? n : DEFAULT_CACHE_TTL_MS
  },
)

/**
 * Load, validate and order the project registry. A missing file yields an empty
 * list (the catalog simply shows no project grouping); a malformed one is logged
 * and also yields an empty list — never throws into a request path.
 */
export async function listProjects(): Promise<Project[]> {
  return projectsCache.get('projects', async () => {
    try {
      const stored = await presentationsStorage().getItem('projects.yml')
      if (stored == null)
        return []
      const raw = typeof stored === 'string' ? stored : String(stored)
      return parseProjects(parseYaml(raw))
    }
    catch (error: any) {
      if (error?.code !== 'ENOENT')
        console.error('[projects] Failed to load projects.yml:', error?.message || error)
      return []
    }
  })
}

/** Resolve a single project slug to its metadata, or null. */
export async function resolveProject(slug: string): Promise<Project | null> {
  const projects = await listProjects()
  return projects.find(p => p.slug === slug) ?? null
}
