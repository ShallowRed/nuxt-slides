/**
 * Server utilities for fetching presentation content from CodiMD or HackMD.
 *
 * Supported sources:
 *   - "codimd"  → self-hosted CodiMD: GET {baseUrl}/:noteId/download
 *   - "hackmd"  → hackmd.io API:     GET https://api.hackmd.io/v1/notes/:noteId
 *
 * The content is cached in-memory with a short TTL so that live collaborative
 * edits propagate quickly while avoiding excessive requests per page load. The
 * TTL is the single shared `createTtlCache` helper (audit §5.7 / P1 #6),
 * configurable via `NUXT_SOURCE_CACHE_TTL_MS`.
 */

import { createTtlCache, DEFAULT_CACHE_TTL_MS, SourceUnreachableError } from '#shared/deck'

export type NoteSource = 'codimd' | 'hackmd'

const HACKMD_API_BASE = 'https://api.hackmd.io/v1'

/** Shared TTL cache; only successful fetches are stored (null is never cached). */
const noteCache = createTtlCache<string>(sourceCacheTtlMs)

function sourceCacheTtlMs(): number {
  const raw = useRuntimeConfig().sourceCacheTtlMs
  const n = typeof raw === 'number' ? raw : Number(raw)
  return Number.isFinite(n) && n > 0 ? n : DEFAULT_CACHE_TTL_MS
}

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

  try {
    // The loader throws on an unreachable/empty source so failures are NOT cached
    // (only successful markdown is memoized for the TTL window). Fail-closed at the
    // cache layer; callers decide whether to degrade to a stub.
    return await noteCache.get(cacheKey, async () => {
      const content = source === 'hackmd'
        ? await fetchFromHackMD(noteId)
        : await fetchFromCodiMD(noteId)
      if (content === null)
        throw new SourceUnreachableError(source, noteId)
      return content
    })
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

// Frontmatter handling now lives in the framework-agnostic deck core
// (`shared/deck/frontmatter.ts`, audit §5.3): parse → operate on objects →
// serialize once via a real YAML library, never by ad-hoc regex. The former
// `stripFrontmatter` / `parseFlatFrontmatter` / `setFrontmatterScalar` helpers
// were removed once the routes converged on `resolveDeck`.
