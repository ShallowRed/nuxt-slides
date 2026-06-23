import type { NoteOverridePolicy } from './merge'
import type { DeckMeta, NoteSource } from './schema'
import { KNOWN_THEMES } from '../theme/tokens'
import { splitFrontmatter, stringifyDocument } from './frontmatter'
import { applyOverridePolicy, deepMerge } from './merge'
import { buildPresetBase } from './presets'
import { parseDeckMeta } from './schema'

/**
 * The single deck resolver (audit §5.1).
 *
 * `resolveDeck` is a **pure** function: it takes already-fetched raw markdown
 * (the I/O lives behind the `ContentSource` port and stays in the handlers) and
 * returns one validated answer to "what is the config of this deck?". The three
 * routes become thin wrappers that differ only by the descriptor they build —
 * precedence divergences become declared *data*, not dispersed code.
 */
export interface ResolveDeckInput {
  /** Raw stub markdown; its frontmatter is authoritative for theme/access/storybook. */
  stub?: string
  /** Preset name (base layer for preset-driven decks, e.g. the CodiMD route). */
  preset?: string
  /** Raw remote note markdown: body source + frontmatter subject to the whitelist. */
  remote?: string
  /** Which note frontmatter keys may override the base (declared precedence). */
  noteOverride?: NoteOverridePolicy
  /** Provider of the remote note (recorded in provenance). */
  source?: NoteSource
  /** Throw on invalid frontmatter instead of warning (tests/tooling). */
  strict?: boolean
  /** Label used in validation messages. */
  label?: string
}

export interface DeckProvenance {
  /** Where the slide body came from. */
  bodyFrom: 'remote' | 'stub' | 'none'
  /** Ordered list of contributing layers, e.g. `['preset:dsfr', 'note']`. */
  layers: string[]
  /** Note overrides actually applied, e.g. `['storybook<-note']`. */
  overrides: string[]
  /** Provider of the remote note, when any. */
  source?: NoteSource
  /** Non-fatal diagnostics (e.g. an unknown theme name). */
  warnings: string[]
}

export interface ResolvedDeck {
  /** Validated, precedence-applied metadata. */
  meta: DeckMeta
  /** Slide body markdown (frontmatter stripped). */
  body: string
  /** Full markdown document (frontmatter + body) for the API/wire contract. */
  content: string
  /** Debuggability: where everything came from. */
  provenance: DeckProvenance
}

export function resolveDeck(input: ResolveDeckInput): ResolvedDeck {
  const { stub, preset, remote, noteOverride, source, strict, label } = input

  const stubDoc = stub != null
    ? splitFrontmatter(stub)
    : { data: {} as Record<string, unknown>, body: '', hasFrontmatter: false }
  const remoteDoc = remote != null ? splitFrontmatter(remote) : null

  const layers: string[] = []
  const overrides: string[] = []

  // 1) Base layer: preset (preset-driven decks) or the stub's own frontmatter.
  let base: Record<string, unknown>
  if (preset !== undefined) {
    base = { ...buildPresetBase(preset, remoteDoc?.data.theme) } as Record<string, unknown>
    layers.push(`preset:${preset}`)
    if (stubDoc.hasFrontmatter) {
      base = deepMerge(base, stubDoc.data)
      layers.push('stub')
    }
  }
  else {
    base = { ...stubDoc.data }
    if (stubDoc.hasFrontmatter)
      layers.push('stub')
  }

  // 2) Note frontmatter override, filtered by the declared whitelist policy.
  if (remoteDoc) {
    const { filtered, applied } = applyOverridePolicy(remoteDoc.data, noteOverride)
    if (applied.length > 0) {
      base = deepMerge(base, filtered)
      layers.push('note')
      for (const key of applied)
        overrides.push(`${key}<-note`)
    }
  }

  // 3) Validate once, derive types, coerce numerics.
  const { meta } = parseDeckMeta(base, { strict, label })

  // 3b) Theme-name traceability (audit §5.5 #5): the link frontmatter ↔ tokens is
  // checked here. Unknown themes are *recorded* (not rejected) so a CSS-only theme
  // with no token entry — or a typo — surfaces in provenance for debugging without
  // taking a production deck dark.
  const warnings: string[] = []
  if (typeof meta.theme === 'string' && !KNOWN_THEMES.includes(meta.theme))
    warnings.push(`unknown theme "${meta.theme}" (no tokens entry)`)

  // 4) Body precedence: remote note wins, else the stub, else nothing.
  let body: string
  let bodyFrom: DeckProvenance['bodyFrom']
  if (remoteDoc) {
    body = remoteDoc.body
    bodyFrom = 'remote'
  }
  else if (stub != null) {
    body = stubDoc.body
    bodyFrom = 'stub'
  }
  else {
    body = ''
    bodyFrom = 'none'
  }

  return {
    meta,
    body,
    content: stringifyDocument(meta as Record<string, unknown>, body),
    provenance: { bodyFrom, layers, overrides, source, warnings },
  }
}
