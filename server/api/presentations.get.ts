import type { PublicationStatus } from '../utils/presentations'
import type { Lifecycle } from '../utils/registry'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import process from 'node:process'
import { parseMarkdown } from '@nuxtjs/mdc/runtime'
import { listAllPresentations } from '../utils/presentations'
import { listRegistry } from '../utils/registry'

interface PresentationListItem {
  slug: string
  title: string
  theme: string
  status: PublicationStatus
  filename: string
  unlisted?: boolean
  /**
   * Stable alias when this deck is in the registry (DDR-018). The home links to
   *  `/p/<alias>` so the SAME canonical URL is used in client navigation and on
   *  reload — otherwise a legacy `/slides/<slug>` link only converges server-side
   *  (on reload), not in SPA navigation.
   */
  alias?: string
  /**
   * Registry lifecycle (DDR-018). Frozen/archived decks no longer live in an
   *  access folder — their stub sits in presentations/archived/ — so the home
   *  sources them from the registry and flags them visually.
   */
  lifecycle?: Lifecycle
}

export default defineEventHandler(async (event): Promise<PresentationListItem[]> => {
  // Check if user is authenticated (for showing all presentations)
  const session = await getUserSession(event).catch(() => null)
  const isOwner = !!session?.user

  try {
    const allPresentations = await listAllPresentations()
    const baseDir = join(process.cwd(), 'presentations')

    // Map stub slug → canonical alias so the home can link to /p/<alias>.
    const registry = await listRegistry()
    const bySlug = new Map(registry.map(e => [e.slug, e]))

    const live = await Promise.all(
      allPresentations
        // Filter based on auth status
        .filter(({ status }) => {
          // Only public presentations are listed
          if (status === 'public')
            return true
          // All other statuses only visible to authenticated owner
          return isOwner
        })
        .map(async ({ slug, status }) => {
          const filePath = join(baseDir, status, `${slug}.md`)
          const content = await readFile(filePath, 'utf-8')

          // Parse frontmatter to get title and theme
          const ast = await parseMarkdown(content)
          const title = ast.data?.title || slug
          const theme = ast.data?.theme || 'dsfr'
          const unlisted = !!ast.data?.unlisted
          const entry = bySlug.get(slug)

          return {
            slug,
            title,
            theme,
            status,
            filename: `${slug}.md`,
            unlisted,
            alias: entry?.alias,
            lifecycle: entry?.lifecycle,
          } satisfies PresentationListItem
        }),
    )

    // Frozen/archived decks: their stub left the access folders for archived/, so
    // listAllPresentations() no longer sees them. Source them from the registry —
    // title from the entry, theme from the archived stub frontmatter when present.
    const livePaths = new Set(allPresentations.map(p => p.slug))
    const frozen = await Promise.all(
      registry
        .filter(e => (e.lifecycle === 'frozen' || e.lifecycle === 'archived') && !livePaths.has(e.slug))
        .map(async (entry) => {
          let theme = 'dsfr'
          try {
            const stub = await readFile(join(baseDir, 'archived', `${entry.slug}.md`), 'utf-8')
            theme = (await parseMarkdown(stub)).data?.theme || theme
          }
          catch {
            // Stub may be gone; the bundle stays reachable via /p/<alias> regardless.
          }
          return {
            slug: entry.slug,
            title: entry.title || entry.slug,
            theme,
            status: 'public' as PublicationStatus,
            filename: `${entry.slug}.md`,
            alias: entry.alias,
            lifecycle: entry.lifecycle,
          } satisfies PresentationListItem
        }),
    )

    // Hide unlisted presentations from non-owners; hide archived decks from them too.
    const items = [...live, ...frozen]
    return isOwner ? items : items.filter(p => !p.unlisted && p.lifecycle !== 'archived')
  }
  catch (error) {
    console.error('Error loading presentations:', error)
    return []
  }
})
