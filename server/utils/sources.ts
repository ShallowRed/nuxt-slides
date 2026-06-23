import type { ContentSource, NoteSource } from '#shared/deck'
import { fetchCollaborativeNote } from './codimd'
import { readPresentationContent } from './presentations'

/**
 * Server adapters implementing the framework-agnostic `ContentSource` port
 * (audit §5.2). They are the only place that knows *how* to reach a given
 * provider; `resolveDeck` and the route handlers depend on the interface, not on
 * `$fetch`/`useStorage`. Adding a source (Google Docs, integrated editor…) is one
 * adapter here, not a change across N handlers.
 */

export const codimdSource: ContentSource = {
  id: 'codimd',
  async load(noteId) {
    const raw = await fetchCollaborativeNote('codimd', noteId)
    return raw == null ? null : { raw }
  },
}

export const hackmdSource: ContentSource = {
  id: 'hackmd',
  async load(noteId) {
    const raw = await fetchCollaborativeNote('hackmd', noteId)
    return raw == null ? null : { raw }
  },
}

export const fileSource: ContentSource = {
  id: 'file',
  async load(slug) {
    const result = await readPresentationContent(slug)
    return result == null ? null : { raw: result.content }
  },
}

/** Pick the collaborative-note adapter for a provider. */
export function noteSource(source: NoteSource): ContentSource {
  return source === 'hackmd' ? hackmdSource : codimdSource
}
