/**
 * Server utilities for presentation discovery and access control
 */

import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import process from 'node:process'

/**
 * Valid publication status folders
 */
export type PublicationStatus = 'public' | 'draft' | 'private' | 'semi-private'

export const PUBLICATION_STATUSES: PublicationStatus[] = ['public', 'draft', 'private', 'semi-private']

/**
 * Get the presentations base directory
 */
export function getPresentationsDir(): string {
  // In production build, presentations are in server/presentations
  // In dev, they're in the project root
  const cwd = process.cwd()

  // Check if we're in .output directory (production build)
  if (cwd.includes('.output')) {
    return join(cwd, 'server', 'presentations')
  }

  return join(cwd, 'presentations')
}

/**
 * Find a presentation by slug across all status folders
 * Returns null if not found, throws if duplicate slugs exist
 */
export async function findPresentationBySlug(slug: string): Promise<{
  filePath: string
  status: PublicationStatus
} | null> {
  const baseDir = getPresentationsDir()
  const matches: { filePath: string, status: PublicationStatus }[] = []

  for (const status of PUBLICATION_STATUSES) {
    const filePath = join(baseDir, status, `${slug}.md`)
    try {
      await readFile(filePath, 'utf-8')
      matches.push({ filePath, status })
    }
    catch {
      // File doesn't exist in this folder, continue
    }
  }

  if (matches.length === 0) {
    return null
  }

  if (matches.length > 1) {
    throw new Error(`Duplicate slug "${slug}" found in multiple folders: ${matches.map(m => m.status).join(', ')}`)
  }

  return matches[0]!
}

/**
 * List all presentations from a specific status folder
 */
export async function listPresentationsByStatus(status: PublicationStatus): Promise<string[]> {
  const dir = join(getPresentationsDir(), status)
  try {
    const files = await readdir(dir)
    return files
      .filter((file: string) => file.endsWith('.md'))
      .map((file: string) => file.replace('.md', ''))
  }
  catch {
    // Folder may not exist
    return []
  }
}

/**
 * List all presentations across all status folders
 */
export async function listAllPresentations(): Promise<{ slug: string, status: PublicationStatus }[]> {
  const results: { slug: string, status: PublicationStatus }[] = []

  for (const status of PUBLICATION_STATUSES) {
    const slugs = await listPresentationsByStatus(status)
    for (const slug of slugs) {
      results.push({ slug, status })
    }
  }

  return results
}

/**
 * Read presentation content by slug
 */
export async function readPresentationContent(slug: string): Promise<{
  content: string
  status: PublicationStatus
} | null> {
  const found = await findPresentationBySlug(slug)
  if (!found) {
    return null
  }

  const content = await readFile(found.filePath, 'utf-8')
  return { content, status: found.status }
}
