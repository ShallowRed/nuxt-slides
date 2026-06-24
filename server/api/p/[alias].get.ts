import type { NoteSource } from '#shared/deck'
import type { PublicationStatus } from '../../utils/presentations'
import { splitFrontmatter } from '#shared/deck'
import { gateDeckAccess } from '../../utils/access'
import { resolveDeckForRoute } from '../../utils/deck-resolution'
import { readPresentationContent, readPresentationContentAt } from '../../utils/presentations'
import { resolveAlias } from '../../utils/registry'

/**
 * Stable diffused-presentation endpoint (DDR-018).
 *
 * GET /api/p/:alias resolves an alias through the registry and serves the right
 * content for its lifecycle:
 *   - live            : repo stub frontmatter + body fetched from CodiMD/HackMD
 *   - frozen|archived : the alias maps to a frozen bundle; this API reports the
 *                       lifecycle so the page can hand off to the static bundle.
 *
 * Access is enforced by the shared `gateDeckAccess` — the SAME gate as
 * `/api/presentations/:slug`. Previously this route had NO access check, so a
 * draft/private/semi-private deck was world-readable via its alias; the gate runs
 * before the frozen short-circuit so a frozen private deck isn't leaked either.
 *
 * The body resolution uses the shared `resolveDeckForRoute`; the one declared
 * difference from `/slides` stays a parameter — `noteOverride: ['storybook']`, so
 * the diffused URL uses the PUBLIC Storybook the author set in the live note
 * (audit §5.4, Axe H), not the stub's local-dev one.
 */
export default defineEventHandler(async (event) => {
  const alias = getRouterParam(event, 'alias')
  if (!alias) {
    throw createError({ statusCode: 400, statusMessage: 'alias parameter is required' })
  }

  const entry = await resolveAlias(alias)
  if (!entry) {
    throw createError({ statusCode: 404, statusMessage: `Unknown presentation alias "${alias}"` })
  }

  // Read the stub (frontmatter = access + provenance source of truth). When the
  // registry pins an access folder, read it directly (disambiguates duplicate
  // slugs); else search the folders.
  const result = entry.access
    ? await readPresentationContentAt(entry.slug, entry.access as PublicationStatus)
    : await readPresentationContent(entry.slug)
  if (!result) {
    throw createError({
      statusCode: 404,
      statusMessage: `Stub "${entry.slug}" for alias "${alias}" not found`,
    })
  }

  const { content: stub, status } = result
  const stubMeta = splitFrontmatter(stub).data

  // Enforce access BEFORE the frozen short-circuit — a frozen private deck must
  // not be served just because it has a bundle.
  await gateDeckAccess(event, {
    slug: entry.slug,
    status,
    lifecycle: entry.lifecycle,
    storedHash: stubMeta.accessPassword as string | undefined,
  })

  // Frozen / archived: content lives in a self-contained static bundle hosted
  // under public/frozen/<bundle>/. Report the target; the page redirects there.
  if (entry.lifecycle === 'frozen' || entry.lifecycle === 'archived') {
    const bundle = entry.frozenBundle ?? entry.slug
    return {
      lifecycle: entry.lifecycle,
      frozenUrl: `/frozen/${bundle}/slides/${entry.slug}--standalone/`,
      content: '',
    }
  }

  // Live: stub frontmatter + body from the collaborative note when configured.
  const { content, editUrl } = await resolveDeckForRoute({
    stub,
    source: entry.source as NoteSource | undefined,
    noteId: entry.noteId,
    noteOverride: ['storybook'],
  })

  return { lifecycle: entry.lifecycle, content, editUrl }
})
