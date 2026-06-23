import type { NoteSource } from '#shared/deck'
import process from 'node:process'
import { resolveDeck, splitFrontmatter } from '#shared/deck'
import { getEditUrl } from '../../utils/codimd'
import { verifyAccessPassword } from '../../utils/password'
import { readPresentationContent } from '../../utils/presentations'
import { noteSource } from '../../utils/sources'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Slug parameter is required',
    })
  }

  // Find presentation across all status folders
  const result = await readPresentationContent(slug)

  if (!result) {
    throw createError({
      statusCode: 404,
      statusMessage: `Presentation "${slug}" not found`,
    })
  }

  const { content: stub, status } = result

  // The stub frontmatter is the local source of truth for access + provenance.
  const stubMeta = splitFrontmatter(stub).data

  // Access control based on status
  if (status === 'draft' || status === 'private') {
    // Require owner authentication
    const session = await getUserSession(event).catch(() => null)
    if (!session?.user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required',
      })
    }
  }

  if (status === 'semi-private') {
    // Check for password in query or cookie
    const query = getQuery(event)
    const password = query.password as string | undefined

    const storedHash = stubMeta.accessPassword as string | undefined

    if (storedHash) {
      // Check password cookie first
      const accessCookie = getCookie(event, `access_${slug}`)

      if (accessCookie !== 'granted') {
        // No valid cookie, check password query param
        if (!password) {
          throw createError({
            statusCode: 401,
            statusMessage: 'Password required',
            data: { requiresPassword: true },
          })
        }

        // Verify password
        const isValid = await verifyAccessPassword(password, storedHash)
        if (!isValid) {
          throw createError({
            statusCode: 403,
            statusMessage: 'Invalid password',
            data: { requiresPassword: true },
          })
        }

        // Set access cookie (valid for 24 hours)
        setCookie(event, `access_${slug}`, 'granted', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24, // 24 hours
        })
      }
    }
  }

  // If the presentation sources its body from a collaborative editor, fetch it.
  // The stub frontmatter always wins (the note contributes its body only); this
  // is the declared precedence for /slides, expressed as data (noteOverride: []).
  const source = stubMeta.source as NoteSource | undefined
  const noteId = stubMeta.noteId as string | undefined
  const isCollaborative = (source === 'codimd' || source === 'hackmd') && Boolean(noteId)

  let deck
  if (isCollaborative) {
    const remote = await noteSource(source!).load(noteId!)
    if (remote) {
      deck = resolveDeck({ stub, remote: remote.raw, noteOverride: [], source })
    }
    else {
      console.warn(`[${source}] Could not fetch note "${noteId}" for slug "${slug}" — falling back to local content`)
      deck = resolveDeck({ stub })
    }
  }
  else {
    deck = resolveDeck({ stub })
  }

  return {
    content: deck.content,
    status,
    editUrl: isCollaborative ? getEditUrl(source!, noteId!) : undefined,
  }
})
