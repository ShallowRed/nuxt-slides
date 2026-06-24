import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { resolveDeckStatus } from '../deck/status-resolve'

/**
 * Build-time discovery of PUBLIC deck slugs for prerendering (SSG).
 *
 * Status used to be the access folder, so the prerender hook just listed
 * `presentations/public/`. Now status lives in the frontmatter
 * (docs/presentation-metadata.md), so we walk every stub under `presentations/`
 * (flattened or still in legacy access folders) and keep those whose
 * frontmatter `status:`/`access:` resolves to `public` — falling back to the
 * legacy `public/` folder for un-migrated stubs.
 *
 * Pure-ish (filesystem only, no Nuxt): callable from `nuxt.config.ts`.
 */

/** Lifecycle folder that is not a deck source (registry-served). */
const SKIP_DIRS = new Set(['archived'])

/**
 * Return the slugs of all public decks under `presentationsDir`. Scans the root
 * (flattened layout) and one level of access-folder subdirectories (legacy).
 */
export async function discoverPublicSlugs(presentationsDir: string): Promise<string[]> {
  const slugs: string[] = []

  async function scan(dir: string, folderHint?: string): Promise<void> {
    let dirents
    try {
      dirents = await readdir(dir, { withFileTypes: true })
    }
    catch {
      return
    }
    for (const dirent of dirents) {
      const full = join(dir, dirent.name)
      if (dirent.isDirectory()) {
        // Only descend one level (the legacy access folders); skip lifecycle dirs.
        if (!folderHint && !SKIP_DIRS.has(dirent.name))
          await scan(full, dirent.name)
        continue
      }
      if (!dirent.name.endsWith('.md'))
        continue
      const content = await readFile(full, 'utf8').catch(() => '')
      if (content && resolveDeckStatus(content, folderHint) === 'public')
        slugs.push(dirent.name.replace(/\.md$/, ''))
    }
  }

  await scan(presentationsDir)
  return [...new Set(slugs)]
}
