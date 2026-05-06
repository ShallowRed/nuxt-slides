/**
 * Server utilities for fetching presentation content from CodiMD or HackMD.
 *
 * Supported sources:
 *   - "codimd"  → self-hosted CodiMD: GET {baseUrl}/:noteId/download
 *   - "hackmd"  → hackmd.io API:     GET https://api.hackmd.io/v1/notes/:noteId
 *
 * The content is cached in-memory with a short TTL so that live collaborative
 * edits propagate quickly while avoiding excessive requests per page load.
 */

export type NoteSource = 'codimd' | 'hackmd'

const CACHE_TTL_MS = 10_000 // 10 seconds
const HACKMD_API_BASE = 'https://api.hackmd.io/v1'

interface CacheEntry {
  content: string
  fetchedAt: number
}

const cache = new Map<string, CacheEntry>()

function getConfig() {
  const config = useRuntimeConfig()
  return {
    codimdUrl: (config.codimdUrl as string || '').replace(/\/+$/, ''),
    hackmdApiToken: config.hackmdApiToken as string || '',
  }
}

/**
 * Fetch raw markdown from a self-hosted CodiMD instance.
 */
async function fetchFromCodiMD(noteId: string): Promise<string | null> {
  const { codimdUrl } = getConfig()
  if (!codimdUrl) {
    console.warn('[codimd] NUXT_CODIMD_URL is not configured — skipping fetch')
    return null
  }

  const url = `${codimdUrl}/${encodeURIComponent(noteId)}/download`
  const content = await $fetch<string>(url, {
    headers: { Accept: 'text/markdown, text/plain' },
    responseType: 'text',
  })
  return content
}

/**
 * Fetch raw markdown from the official HackMD.io API.
 * Requires a Bearer token set via NUXT_HACKMD_API_TOKEN.
 */
async function fetchFromHackMD(noteId: string): Promise<string | null> {
  const { hackmdApiToken } = getConfig()
  if (!hackmdApiToken) {
    console.warn('[hackmd] NUXT_HACKMD_API_TOKEN is not configured — skipping fetch')
    return null
  }

  const url = `${HACKMD_API_BASE}/notes/${encodeURIComponent(noteId)}`
  const data = await $fetch<{ content: string }>(url, {
    headers: { Authorization: `Bearer ${hackmdApiToken}` },
  })
  return data.content
}

/**
 * Fetch the raw markdown content of a collaborative note.
 *
 * @param source  The provider: "codimd" (self-hosted) or "hackmd" (hackmd.io)
 * @param noteId  The note id or alias
 * @returns       The markdown string, or `null` when the note cannot be reached.
 */
export async function fetchCollaborativeNote(source: NoteSource, noteId: string): Promise<string | null> {
  const cacheKey = `${source}:${noteId}`

  // Return cached value if still fresh
  const cached = cache.get(cacheKey)
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return cached.content
  }

  try {
    const content = source === 'hackmd'
      ? await fetchFromHackMD(noteId)
      : await fetchFromCodiMD(noteId)

    if (content !== null) {
      cache.set(cacheKey, { content, fetchedAt: Date.now() })
    }
    return content
  }
  catch (error: any) {
    console.error(`[${source}] Failed to fetch note "${noteId}":`, error?.message || error)
    return null
  }
}

/**
 * Build the public edit URL for a collaborative note.
 */
export function getEditUrl(source: NoteSource, noteId: string): string | null {
  if (source === 'hackmd') {
    return `https://hackmd.io/${noteId}`
  }
  const { codimdUrl } = getConfig()
  return codimdUrl ? `${codimdUrl}/${noteId}` : null
}

/**
 * Strip YAML frontmatter from a markdown string.
 * Returns the body without the leading `---…---` block.
 */
export function stripFrontmatter(markdown: string): string {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!match)
    return markdown
  return markdown.slice(match[0].length)
}

/**
 * Parse flat (non-nested) key: value pairs from a YAML frontmatter block.
 * Handles quoted and unquoted string values. Ignores nested objects/arrays.
 * Returns an empty object when there is no frontmatter.
 */
export function parseFlatFrontmatter(markdown: string): Record<string, string> {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!match)
    return {}
  const result: Record<string, string> = {}
  for (const line of match[1]!.split(/\r?\n/)) {
    // Match `key: value` or `key: "value"` — skip indented (nested) lines.
    // Regex is deliberately non-backtracking: key segment, literal ': ',
    // then an optional opening quote, a run of non-quote/non-newline chars,
    // and an optional closing quote.
    const colonIdx = line.indexOf(': ')
    if (colonIdx < 1)
      continue
    const key = line.slice(0, colonIdx)
    if (!/^\w[\w-]*$/.test(key))
      continue
    let val = line.slice(colonIdx + 2).trim()
    if (val.startsWith('"') && val.endsWith('"'))
      val = val.slice(1, -1)
    result[key] = val
  }
  return result
}
