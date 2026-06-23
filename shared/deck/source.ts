import type { NoteSource } from './schema'

/**
 * Content source port (audit §5.2 / Axe B).
 *
 * A single interface for every way of obtaining a deck's raw markdown — local
 * storage, CodiMD `/download`, the HackMD API, and (later) an integrated editor.
 * Adding a source becomes one implementation instead of touching N handlers;
 * caching and error handling are factored behind the port rather than duplicated.
 *
 * The port lives in the framework-agnostic core so `resolveDeck` and tests can
 * depend on the contract while the server provides the concrete adapters (which
 * use `useStorage` / `$fetch`). In tests the port is satisfied by in-memory fakes.
 */
export interface ContentSource {
  /** Stable identifier of the provider. */
  readonly id: NoteSource | 'file'
  /**
   * Load the raw markdown for a reference (slug, alias, or noteId), or `null`
   * when it cannot be reached. Implementations decide caching/TTL internally.
   */
  load: (ref: string) => Promise<{ raw: string } | null>
}

/** A registry of sources keyed by id, injected into server orchestration. */
export type ContentSources = Partial<Record<ContentSource['id'], ContentSource>>
