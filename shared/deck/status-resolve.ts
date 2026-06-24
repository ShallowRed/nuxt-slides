import type { PublicationStatus } from '../access/status'
import { PublicationStatusSchema } from '../access/status'
import { splitFrontmatter } from './frontmatter'

/**
 * The closed default for a deck whose frontmatter declares no (or an invalid)
 * `status:`. Per docs/presentation-metadata.md, status now lives in the
 * frontmatter; a missing value MUST fail closed — `private` denies every
 * non-privileged actor. Never default to a more open status.
 */
export const DEFAULT_STATUS: PublicationStatus = 'private'

/**
 * Derive a deck's publication status from its markdown — the single source of
 * truth shared by the server catalog (`server/utils/presentations.ts`) and the
 * build-time SSG discovery (`shared/build/public-decks.ts`).
 *
 * Order of precedence:
 *   1. frontmatter `status:` (zod-validated),
 *   2. legacy `access:` alias (pre-migration stubs),
 *   3. `folderHint` — the access folder a still-un-migrated stub was read from,
 *   4. the closed {@link DEFAULT_STATUS}.
 *
 * Anything unrecognised at every step falls back to `private` (fail-closed).
 */
export function resolveDeckStatus(content: string, folderHint?: string): PublicationStatus {
  const data = splitFrontmatter(content).data as Record<string, unknown>
  const declared = data.status ?? data.access
  const parsed = PublicationStatusSchema.safeParse(declared)
  if (parsed.success)
    return parsed.data
  const hinted = PublicationStatusSchema.safeParse(folderHint)
  return hinted.success ? hinted.data : DEFAULT_STATUS
}
