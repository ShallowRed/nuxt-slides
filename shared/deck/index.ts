/**
 * Deck core (audit §5) — framework-agnostic, I/O-free, unit- and golden-testable.
 *
 * The single home for "what is the config of this deck?":
 *   - `schema`      : zod `DeckMetaSchema` (single source of truth + derived types)
 *   - `frontmatter` : parse/serialize YAML once (no more ad-hoc regex)
 *   - `merge`       : one deep-merge + declared precedence (note whitelist)
 *   - `presets`     : single preset source (was duplicated client/server)
 *   - `source`      : the `ContentSource` port (sourcing behind one interface)
 *   - `resolve`     : `resolveDeck()` — the pivot the 3 routes converge on
 */
export * from './frontmatter'
export * from './merge'
export * from './presets'
export * from './resolve'
export * from './schema'
export * from './source'
