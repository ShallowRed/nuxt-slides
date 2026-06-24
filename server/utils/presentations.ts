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
import { resolveDeckStatus } from '#shared/deck'

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
 * Reserved top-level keys under `presentations/` that are not deck stubs.
 * `archived/` is a lifecycle location (DDR-018), not a publication status, and is
 * sourced via the registry — excluded from catalog discovery.
 */
const NON_STUB_PREFIXES = ['archived']

/** A discovered stub: its slug, raw content, derived status, and storage key. */
interface StubEntry {
  slug: string
  status: PublicationStatus
  content: string
  key: string
}

/**
 * Enumerate every deck stub under `presentations/`, regardless of layout —
 * flattened (`<slug>.md`) or the legacy access folders (`<status>/<slug>.md`).
 * Status is derived from each stub's frontmatter (closed default), so the
 * folder is no longer the source of truth; `archived/` is skipped (registry).
 */
async function listStubEntries(): Promise<StubEntry[]> {
  const storage = presentationsStorage()
  const keys = (await storage.getKeys()).filter(k => k.endsWith('.md'))

  const entries: StubEntry[] = []
  for (const key of keys) {
    // Storage keys are colon-delimited (`<folder>:<slug>.md` or `<slug>.md`).
    const segments = key.split(':')
    const folderHint = segments.length > 1 ? segments[segments.length - 2] : undefined
    if (folderHint && NON_STUB_PREFIXES.includes(folderHint))
      continue
    const slug = segments[segments.length - 1]!.replace(/\.md$/, '')
    const raw = await storage.getItem(key)
    if (raw == null)
      continue
    const content = typeof raw === 'string' ? raw : String(raw)
    entries.push({ slug, status: resolveDeckStatus(content, folderHint), content, key })
  }
  return entries
}

/**
 * Find a presentation by slug. Returns its (frontmatter-derived) status, or null
 * if not found; throws if the same slug exists in more than one stub.
 */
export async function findPresentationBySlug(slug: string): Promise<{
  status: PublicationStatus
} | null> {
  const matches = (await listStubEntries()).filter(e => e.slug === slug)
  if (matches.length === 0)
    return null
  if (matches.length > 1) {
    throw new Error(`Duplicate slug "${slug}" found in: ${matches.map(m => m.key).join(', ')}`)
  }
  return { status: matches[0]!.status }
}

/**
 * List all presentations from a specific status (filtered by frontmatter status,
 * across whatever layout the stubs live in).
 */
export async function listPresentationsByStatus(status: PublicationStatus): Promise<string[]> {
  return (await listStubEntries()).filter(e => e.status === status).map(e => e.slug)
}

/**
 * List all presentations with their (frontmatter-derived) status.
 */
export async function listAllPresentations(): Promise<{ slug: string, status: PublicationStatus }[]> {
  return (await listStubEntries()).map(({ slug, status }) => ({ slug, status }))
}

/**
 * Read presentation content by slug, with its derived status.
 */
export async function readPresentationContent(slug: string): Promise<{
  content: string
  status: PublicationStatus
} | null> {
  const match = (await listStubEntries()).find(e => e.slug === slug)
  if (!match)
    return null
  return { content: match.content, status: match.status }
}

/**
 * Read a stub by slug regardless of which folder (if any) it lives in. Kept for
 * the registry (DDR-018) and the catalog, which previously passed a status to
 * disambiguate folders; status now comes from the frontmatter, so the `access`
 * argument is accepted for source-compat but ignored.
 */
export async function readPresentationContentAt(
  slug: string,
  _access?: PublicationStatus,
): Promise<{ content: string, status: PublicationStatus } | null> {
  return readPresentationContent(slug)
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
