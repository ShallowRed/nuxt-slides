import type { NoteOverridePolicy, NoteSource } from '#shared/deck'
import { resolveDeck } from '#shared/deck'
import { getEditUrl } from './codimd'
import { noteSource } from './sources'

/**
 * Resolve a deck's content for a route — the note-fetch-or-fallback dance that
 * `/api/presentations/:slug` and `/api/p/:alias` both performed verbatim.
 *
 * The one intentional difference between the routes stays a parameter, not forked
 * code: the `noteOverride` whitelist (precedence-as-data, audit §5.4). `/slides`
 * passes `[]` (stub frontmatter fully wins); `/p` passes `['storybook']` so the
 * diffused URL uses the public Storybook the author set in the live note.
 */
export interface DeckResolutionInput {
  /** The repo stub markdown (frontmatter is the local source of truth). */
  stub: string
  source?: NoteSource
  noteId?: string
  /** Which note frontmatter keys may override the stub (declared precedence). */
  noteOverride: NoteOverridePolicy
}

export interface DeckResolutionResult {
  content: string
  editUrl?: string
  isCollaborative: boolean
}

export async function resolveDeckForRoute(input: DeckResolutionInput): Promise<DeckResolutionResult> {
  const { stub, source, noteId, noteOverride } = input
  const isCollaborative = (source === 'codimd' || source === 'hackmd') && Boolean(noteId)

  if (!isCollaborative)
    return { content: resolveDeck({ stub }).content, isCollaborative: false }

  const remote = await noteSource(source!).load(noteId!)
  if (!remote) {
    console.warn(`[${source}] could not fetch note "${noteId}" — using stub body`)
    return { content: resolveDeck({ stub }).content, isCollaborative: false }
  }

  const deck = resolveDeck({ stub, remote: remote.raw, noteOverride, source })
  return {
    content: deck.content,
    editUrl: getEditUrl(source!, noteId!),
    isCollaborative: true,
  }
}
