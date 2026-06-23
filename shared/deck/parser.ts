import type { Slide } from './model'
import type { DeckMeta } from './schema'

/**
 * Parser port (audit §5.8 / Axe G) — Pandoc's *reader* role.
 *
 * The two existing parsers (heading-based and separator-based) live in
 * `src/utils/slide-ast.ts` and depend on the MDC runtime, so the *implementations*
 * stay there; this port is the framework-agnostic *contract* they conform to, so
 * `resolveDeck`/renderers/tests can depend on the interface, and a future parser
 * is one more implementation behind the same shape.
 */
export type ParserId = 'heading' | 'separator'

export interface DeckParser {
  /** Stable identifier, matching the deck's `meta.parser`. */
  readonly id: ParserId
  /** Parse raw markdown (+ resolved meta) into slides. May be async (MDC). */
  parse: (raw: string, meta: DeckMeta) => Slide[] | Promise<Slide[]>
}

/** Choose the parser id for a deck, defaulting to the heading parser. */
export function parserIdFor(meta: Pick<DeckMeta, 'parser'>): ParserId {
  return meta.parser === 'separator' ? 'separator' : 'heading'
}
