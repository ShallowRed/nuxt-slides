import type { NoteSource } from '../../utils/codimd'
import process from 'node:process'
import { parseMarkdown } from '@nuxtjs/mdc/runtime'
import { fetchCollaborativeNote, getEditUrl, stripFrontmatter } from '../../utils/codimd'
import { verifyAccessPassword } from '../../utils/password'
import { readPresentationContent } from '../../utils/presentations'

/**
 * Build the final markdown content for a CodiMD-sourced presentation.
 * The local stub's frontmatter is preserved (access control, theme, etc.)
 * while the slide body comes from CodiMD.
 */
function mergeCodiMDContent(localContent: string, codimdMarkdown: string): string {
  // Extract local frontmatter block
  const fmMatch = localContent.match(/^(---\r?\n[\s\S]*?\r?\n---)\r?\n?/)
  const localFrontmatter = fmMatch ? fmMatch[1] : ''

  // Use only the body from CodiMD (strip its own frontmatter if any)
  const codimdBody = stripFrontmatter(codimdMarkdown)

  return localFrontmatter ? `${localFrontmatter}\n\n${codimdBody}` : codimdBody
}

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

  let { content } = result
  const { status } = result

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

    // Parse frontmatter to get stored password hash
    const ast = await parseMarkdown(content)
    const storedHash = ast.data?.accessPassword as string | undefined

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

  // If the presentation sources its content from a collaborative editor, fetch it
  const ast = await parseMarkdown(content)
  const source = ast.data?.source as NoteSource | undefined
  const noteId = ast.data?.noteId as string | undefined
  const isCollaborative = (source === 'codimd' || source === 'hackmd') && noteId

  if (isCollaborative) {
    const remoteContent = await fetchCollaborativeNote(source, noteId)
    if (remoteContent) {
      content = mergeCodiMDContent(content, remoteContent)
    }
    else {
      console.warn(`[${source}] Could not fetch note "${noteId}" for slug "${slug}" — falling back to local content`)
    }
  }

  return {
    content,
    status,
    editUrl: isCollaborative ? getEditUrl(source, noteId) : undefined,
  }
})
