import { z } from 'zod'

/**
 * Deck visibility & lifecycle — the canonical home for two axes that were defined
 * in several places and could drift:
 *   - `PublicationStatus` (the access-folder axis): was duplicated in
 *     `server/utils/presentations.ts` and `src/types/presentation.ts`.
 *   - `Lifecycle` (the registry/DDR-018 axis): lived only on the server.
 *
 * Both become zod enums here; the old locations re-export these so existing
 * imports keep working. Validation + derived types in one place, à la
 * `shared/deck/schema.ts`.
 */

/** Where a deck lives: the access folder under `presentations/`. */
export const PublicationStatusSchema = z.enum(['public', 'draft', 'private', 'semi-private'])
export type PublicationStatus = z.infer<typeof PublicationStatusSchema>
export const PUBLICATION_STATUSES = PublicationStatusSchema.options

/** Registry state (DDR-018): live decks vs frozen/archived static bundles. */
export const LifecycleSchema = z.enum(['live', 'frozen', 'archived'])
export type Lifecycle = z.infer<typeof LifecycleSchema>
