/**
 * Server utilities for presentation discovery and access control.
 *
 * Content is read through Nitro's server assets (`useStorage('assets:presentations')`)
 * rather than the raw filesystem. The `presentations/` folder is registered as a
 * server asset in nuxt.config, so Nitro bundles it into the deployed function and
 * the same access works in dev, on a Node server, and on serverless (Vercel) —
 * where a cwd-relative path would not resolve.
 */

import type { PublicationStatus } from '#shared/access'
import { PUBLICATION_STATUSES } from '#shared/access'

/**
 * Valid publication status folders. The canonical definition lives in the access
 * domain (`shared/access`, zod-validated); re-exported here (local binding, not a
 * bare `export … from`, so it survives Nitro's bundling) for existing imports.
 */
export type { PublicationStatus }
export { PUBLICATION_STATUSES }

/**
 * The Nitro storage mount that exposes the bundled `presentations/` folder.
 */
export function presentationsStorage() {
  return useStorage('assets:presentations')
}

/**
 * Find a presentation by slug across all status folders
 * Returns null if not found, throws if duplicate slugs exist
 */
export async function findPresentationBySlug(slug: string): Promise<{
  status: PublicationStatus
} | null> {
  const matches: PublicationStatus[] = []

  for (const status of PUBLICATION_STATUSES) {
    if (await readPresentationContentAt(slug, status))
      matches.push(status)
  }

  if (matches.length === 0) {
    return null
  }

  if (matches.length > 1) {
    throw new Error(`Duplicate slug "${slug}" found in multiple folders: ${matches.join(', ')}`)
  }

  return { status: matches[0]! }
}

/**
 * List all presentations from a specific status folder
 */
export async function listPresentationsByStatus(status: PublicationStatus): Promise<string[]> {
  const keys = await presentationsStorage().getKeys(status)
  return keys
    .filter((key: string) => key.endsWith('.md'))
    .map((key: string) => key.slice(key.lastIndexOf(':') + 1).replace(/\.md$/, ''))
}

/**
 * List all presentations across all status folders
 */
export async function listAllPresentations(): Promise<{ slug: string, status: PublicationStatus }[]> {
  const results: { slug: string, status: PublicationStatus }[] = []

  for (const status of PUBLICATION_STATUSES) {
    const slugs = await listPresentationsByStatus(status)
    for (const slug of slugs) {
      results.push({ slug, status })
    }
  }

  return results
}

/**
 * Read presentation content by slug
 */
export async function readPresentationContent(slug: string): Promise<{
  content: string
  status: PublicationStatus
} | null> {
  const found = await findPresentationBySlug(slug)
  if (!found) {
    return null
  }

  return readPresentationContentAt(slug, found.status)
}

/**
 * Read presentation content from a specific access folder. Used by the registry
 * (DDR-018) to disambiguate when the same slug exists in several folders.
 */
export async function readPresentationContentAt(
  slug: string,
  access: PublicationStatus,
): Promise<{ content: string, status: PublicationStatus } | null> {
  const raw = await presentationsStorage().getItem(`${access}:${slug}.md`)
  if (raw == null)
    return null
  return { content: typeof raw === 'string' ? raw : String(raw), status: access }
}

/**
 * Read a frozen/archived deck's stub from `presentations/archived/`. Archived is
 * a lifecycle location, not a publication status, so it has its own reader (used
 * by the catalog to source a frozen deck's theme).
 */
export async function readArchivedStub(slug: string): Promise<string | null> {
  const raw = await presentationsStorage().getItem(`archived:${slug}.md`)
  return raw == null ? null : (typeof raw === 'string' ? raw : String(raw))
}
