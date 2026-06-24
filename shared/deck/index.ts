/**
 * Deck core (audit §5) — framework-agnostic, I/O-free, unit- and golden-testable.
 *
 * The single home for "what is the config of this deck?":
 *   - `schema`      : zod `DeckMetaSchema` (single source of truth + derived types)
 *   - `components`  : the single component & syntax contract (annotations, components, icons)
 *   - `frontmatter` : parse/serialize YAML once (no more ad-hoc regex)
 *   - `merge`       : one deep-merge + declared precedence (note whitelist)
 *   - `presets`     : single preset source (derived from the theme tokens manifest)
 *   - `source`      : the `ContentSource` port (sourcing behind one interface)
 *   - `cache`/`errors`: one TTL cache + typed source errors (fail-closed worthy)
 *   - `resolve`     : `resolveDeck()` — the pivot the 3 routes converge on
 */
export * from './cache'
export * from './components'
export * from './errors'
export * from './frontmatter'
export * from './merge'
export * from './model'
export * from './parser'
export * from './presets'
export * from './resolve'
export * from './schema'
export * from './source'
export * from './status-resolve'
