import type { NoteSource } from '#shared/deck'
import { resolveDeck } from '#shared/deck'
import { getEditUrl } from '../../utils/codimd'
import { noteSource } from '../../utils/sources'

/**
 * Dynamic CodiMD presentation endpoint.
 * Fetches any CodiMD note and serves it with a preset's frontmatter.
 *
 * GET /api/codimd/:noteId?preset=dsfr&source=codimd
 *
 * Thin wrapper around the single `resolveDeck` (audit §5.1): it builds a
 * descriptor (preset base + remote note as the author's source of truth) and the
 * resolver applies the declared precedence and validates once. The old inlined
 * preset definitions + hand-rolled deep-merge/YAML serializer are gone.
 */
export default defineEventHandler(async (event) => {
  const noteId = getRouterParam(event, 'noteId')

  if (!noteId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'noteId parameter is required',
    })
  }

  const query = getQuery(event)
  const source: NoteSource = (query.source as NoteSource) || 'codimd'
  const preset = (query.preset as string) || 'dsfr'

  // Validate source
  if (source !== 'codimd' && source !== 'hackmd') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid source. Must be "codimd" or "hackmd".',
    })
  }

  // Fetch remote content through the ContentSource port.
  const remote = await noteSource(source).load(noteId)

  if (!remote) {
    throw createError({
      statusCode: 502,
      statusMessage: `Could not fetch note "${noteId}" from ${source}`,
    })
  }

  // The note is the author's source of truth here: its frontmatter (including
  // nested `reveal`/`backgrounds`) overrides the preset base. `resolveDeck` reads
  // nested keys faithfully, so a deck's `reveal.margin` set in CodiMD is honored
  // (the margins bug is structurally fixed).
  const deck = resolveDeck({
    preset,
    remote: remote.raw,
    noteOverride: 'all',
    source,
  })

  return {
    content: deck.content,
    status: 'public' as const,
    editUrl: getEditUrl(source, noteId),
  }
})
