import type { NoteSource } from '#shared/deck'
import type { PublicationStatus } from '../../utils/presentations'
import { resolveDeck } from '#shared/deck'
import { getEditUrl } from '../../utils/codimd'
import { readPresentationContent, readPresentationContentAt } from '../../utils/presentations'
import { resolveAlias } from '../../utils/registry'
import { noteSource } from '../../utils/sources'

/**
 * Stable diffused-presentation endpoint (DDR-018).
 *
 * GET /api/p/:alias resolves an alias through the registry and serves the right
 * content for its lifecycle:
 *   - live            : repo stub frontmatter + body fetched from CodiMD/HackMD
 *   - frozen|archived : the alias maps to a frozen bundle; this API reports the
 *                       lifecycle so the page can hand off to the static bundle.
 *
 * The URL never changes across states — a link shared while `live` keeps working
 * once `frozen`. The live branch is a thin wrapper around `resolveDeck` (audit
 * §5.1): the stub frontmatter wins, except the note may drive `storybook` — that
 * divergence is now declared *data* (`noteOverride: ['storybook']`), not a
 * route-specific `setFrontmatterScalar` patch, which structurally fixes the
 * diverging-Storybook-URL class of bugs (Axe H).
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

  // Frozen / archived: the content lives in a self-contained static bundle,
  // hosted under public/frozen/<bundle>/ (DDR-018 quick-win hosting). Report the
  // bundle target; the page redirects there. The stable alias URL never changes.
  if (entry.lifecycle === 'frozen' || entry.lifecycle === 'archived') {
    const bundle = entry.frozenBundle ?? entry.slug
    return {
      lifecycle: entry.lifecycle,
      frozenUrl: `/frozen/${bundle}/slides/${entry.slug}--standalone/`,
      content: '',
    }
  }

  // Live: repo stub provides frontmatter (theme, storybook, access); body comes
  // from the collaborative note when source/noteId are set. When the registry
  // pins an access folder, read it directly (disambiguates duplicate slugs).
  const result = entry.access
    ? await readPresentationContentAt(entry.slug, entry.access as PublicationStatus)
    : await readPresentationContent(entry.slug)
  if (!result) {
    throw createError({
      statusCode: 404,
      statusMessage: `Stub "${entry.slug}" for alias "${alias}" not found`,
    })
  }

  const stub = result.content
  const source = entry.source as NoteSource | undefined
  const noteId = entry.noteId
  const isCollaborative = (source === 'codimd' || source === 'hackmd') && Boolean(noteId)

  let deck
  if (isCollaborative) {
    const remote = await noteSource(source!).load(noteId!)
    if (remote) {
      // The repo stub keeps a local-dev `storybook` (e.g. http://localhost:6007)
      // for previewing /slides/<slug>. On the diffused /p/<alias> URL we want the
      // PUBLIC Storybook the author set in the live note, so its iframes resolve
      // for everyone — declared as the only whitelisted note override.
      deck = resolveDeck({ stub, remote: remote.raw, noteOverride: ['storybook'], source })
    }
    else {
      console.warn(`[${source}] alias "${alias}": could not fetch note "${noteId}" — using stub body`)
      deck = resolveDeck({ stub })
    }
  }
  else {
    deck = resolveDeck({ stub })
  }

  return {
    lifecycle: entry.lifecycle,
    content: deck.content,
    editUrl: isCollaborative ? getEditUrl(source!, noteId!) : undefined,
  }
})
