import type { NoteSource } from '#shared/deck'
import { splitFrontmatter } from '#shared/deck'
import { gateDeckAccess } from '../../utils/access'
import { resolveDeckForRoute } from '../../utils/deck-resolution'
import { readPresentationContent } from '../../utils/presentations'

/**
 * Serve a deck by slug. Access is enforced by the shared `gateDeckAccess` (the
 * one place per-status gating lives), and the body is resolved by the shared
 * `resolveDeckForRoute`. `/slides` keeps the stub frontmatter fully authoritative
 * (`noteOverride: []`).
 */
export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Slug parameter is required' })
  }

  const result = await readPresentationContent(slug)
  if (!result) {
    throw createError({ statusCode: 404, statusMessage: `Presentation "${slug}" not found` })
  }

  const { content: stub, status } = result
  // The stub frontmatter is the local source of truth for access + provenance.
  const stubMeta = splitFrontmatter(stub).data

  await gateDeckAccess(event, {
    slug,
    status,
    storedHash: stubMeta.accessPassword as string | undefined,
  })

  const { content, editUrl } = await resolveDeckForRoute({
    stub,
    source: stubMeta.source as NoteSource | undefined,
    noteId: stubMeta.noteId as string | undefined,
    noteOverride: [],
  })

  return { content, status, editUrl }
})
