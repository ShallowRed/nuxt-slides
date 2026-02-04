import type { PublicationStatus } from '../utils/presentations'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import process from 'node:process'
import { parseMarkdown } from '@nuxtjs/mdc/runtime'
import { listAllPresentations } from '../utils/presentations'

interface PresentationListItem {
  slug: string
  title: string
  theme: string
  status: PublicationStatus
  filename: string
}

export default defineEventHandler(async (event): Promise<PresentationListItem[]> => {
  // Check if user is authenticated (for showing all presentations)
  const session = await getUserSession(event).catch(() => null)
  const isOwner = !!session?.user

  try {
    const allPresentations = await listAllPresentations()
    const baseDir = join(process.cwd(), 'presentations')

    const presentations = await Promise.all(
      allPresentations
        // Filter based on auth status
        .filter(({ status }) => {
          // Public and semi-private are always visible in list
          if (status === 'public' || status === 'semi-private')
            return true
          // Draft and private only visible to owner
          return isOwner
        })
        .map(async ({ slug, status }) => {
          const filePath = join(baseDir, status, `${slug}.md`)
          const content = await readFile(filePath, 'utf-8')

          // Parse frontmatter to get title and theme
          const ast = await parseMarkdown(content)
          const title = ast.data?.title || slug
          const theme = ast.data?.theme || 'dsfr'

          return {
            slug,
            title,
            theme,
            status,
            filename: `${slug}.md`,
          }
        }),
    )

    return presentations
  }
  catch (error) {
    console.error('Error loading presentations:', error)
    return []
  }
})
