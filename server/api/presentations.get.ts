import type { PresentationListItem } from '#shared/presentations'
import { canList } from '#shared/access'
import { splitFrontmatter } from '#shared/deck'
import { getActorRole } from '../utils/actor'
import { listAllPresentations, readArchivedStub, readPresentationContentAt } from '../utils/presentations'
import { listRegistry } from '../utils/registry'

/**
 * Catalog endpoint. Visibility is decided by the shared `canList` (same privilege
 * rule as the per-deck gate, so what you can list and what you can view never
 * drift), keyed on the actor's resolved role. Content is read via the Nitro
 * server-asset storage + the shared frontmatter parser — not a cwd-relative
 * `readFile` (which would not resolve on serverless) nor a second markdown parse.
 */
export default defineEventHandler(async (event): Promise<PresentationListItem[]> => {
  const role = await getActorRole(event)

  try {
    const allPresentations = await listAllPresentations()

    // Map stub slug → canonical alias so the home can link to /p/<alias>.
    const registry = await listRegistry()
    const bySlug = new Map(registry.map(e => [e.slug, e]))

    const live = await Promise.all(
      allPresentations.map(async ({ slug, status }) => {
        const read = await readPresentationContentAt(slug, status)
        const data = read ? splitFrontmatter(read.content).data : {}
        const entry = bySlug.get(slug)
        return {
          slug,
          title: (data.title as string) || slug,
          theme: (data.theme as string) || 'dsfr',
          status,
          filename: `${slug}.md`,
          project: (data.project as string) || undefined,
          unlisted: Boolean(data.unlisted),
          alias: entry?.alias,
          lifecycle: entry?.lifecycle,
        } satisfies PresentationListItem
      }),
    )

    // Frozen/archived decks left the access folders for archived/, so
    // listAllPresentations() no longer sees them — source from the registry.
    const livePaths = new Set(allPresentations.map(p => p.slug))
    const frozen = await Promise.all(
      registry
        .filter(e => (e.lifecycle === 'frozen' || e.lifecycle === 'archived') && !livePaths.has(e.slug))
        .map(async (entry) => {
          const stub = await readArchivedStub(entry.slug).catch(() => null)
          const theme = (stub ? splitFrontmatter(stub).data.theme as string : '') || 'dsfr'
          return {
            slug: entry.slug,
            title: entry.title || entry.slug,
            theme,
            status: 'public' as const,
            filename: `${entry.slug}.md`,
            alias: entry.alias,
            lifecycle: entry.lifecycle,
          } satisfies PresentationListItem
        }),
    )

    // One filter, the shared access predicate.
    return [...live, ...frozen].filter(p =>
      canList({ status: p.status, lifecycle: p.lifecycle, role, unlisted: p.unlisted }),
    )
  }
  catch (error) {
    console.error('Error loading presentations:', error)
    return []
  }
})
