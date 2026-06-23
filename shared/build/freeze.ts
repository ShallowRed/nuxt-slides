/**
 * Declarative freeze descriptor (audit §7 P2 #9 / Axe E).
 *
 * Freezing a deck was a multi-target Makefile pipeline whose values were derived
 * across scattered `make` variables and shell sub-shells (slug, theme, base URLs,
 * bundle/host paths). This module turns that derivation into ONE typed, pure
 * object built from a registry entry — the single declarative description of a
 * freeze job that `scripts/freeze.js` (the one-command driver) consumes, and that
 * is directly unit-testable without running a build.
 *
 * Framework-free on purpose: it models only the minimal registry fields it needs,
 * so it does not depend on the server runtime.
 */

/** The minimal registry-entry shape a freeze needs (mirrors server RegistryEntry). */
export interface FreezeRegistryEntry {
  alias: string
  /** Stub slug under presentations/<access>/<slug>.md (defaults to alias). */
  slug?: string
  /** Collaborative provider, when the deck's body is sourced live. */
  source?: 'codimd' | 'hackmd'
  noteId?: string
  /** Bundle folder name to host under .frozen/ (defaults to alias). */
  frozenBundle?: string
}

export interface FreezeOptions {
  /** Theme to freeze with (resolved from the stub frontmatter; defaults to lee). */
  theme?: string
  /** Root dir under which frozen bundles are hosted (defaults to `.frozen`). */
  frozenHostDir?: string
  /** Build output dir produced by the standalone bundle (defaults to dist-standalone). */
  bundleOut?: string
}

/** A single named step of the freeze plan. */
export interface FreezeStep {
  id: 'pull-note' | 'bundle-frozen' | 'host-frozen' | 'flip-lifecycle'
  description: string
  /** Whether this step runs for the given entry (e.g. pull-note needs a note). */
  enabled: boolean
}

/** The fully-derived, declarative description of a freeze job. */
export interface FreezeDescriptor {
  alias: string
  slug: string
  theme: string
  /** The prerender slug the bundle targets (`<slug>--standalone`). */
  standaloneSlug: string
  /** Base URL the frozen bundle is served under (its own origin path). */
  frozenBaseUrl: string
  /** Folder the bundle is hosted in, served by Nitro at `/frozen/<bundle>/`. */
  hostDir: string
  /** Build output dir the bundle is produced into. */
  bundleOut: string
  /** Public URL the alias resolves to once frozen. */
  servedUrl: string
  /** Whether the deck sources its body from a collaborative note. */
  isCollaborative: boolean
  /** The ordered, named plan — declarative, with per-step enablement. */
  steps: FreezeStep[]
}

export const DEFAULT_FREEZE_THEME = 'lee'
export const DEFAULT_FROZEN_HOST_DIR = '.frozen'
export const DEFAULT_BUNDLE_OUT = 'dist-standalone'

/**
 * Build the declarative freeze descriptor for a registry entry. Pure: every value
 * the Makefile used to derive inline (slug fallback, `--standalone` slug, base
 * URLs, host/output paths, which steps run) becomes a field of one object.
 */
export function buildFreezeDescriptor(
  entry: FreezeRegistryEntry,
  options: FreezeOptions = {},
): FreezeDescriptor {
  const slug = entry.slug || entry.alias
  const bundle = entry.frozenBundle || entry.alias
  const theme = options.theme || DEFAULT_FREEZE_THEME
  const hostRoot = options.frozenHostDir || DEFAULT_FROZEN_HOST_DIR
  const frozenBaseUrl = `/frozen/${bundle}/`
  const standaloneSlug = `${slug}--standalone`
  const isCollaborative
    = (entry.source === 'codimd' || entry.source === 'hackmd') && Boolean(entry.noteId)

  const steps: FreezeStep[] = [
    {
      id: 'pull-note',
      description: 'Rapatriate the live note body into the repo stub (keeps frontmatter)',
      enabled: isCollaborative,
    },
    {
      id: 'bundle-frozen',
      description: `Freeze the deck into a self-contained Reveal-only bundle (theme '${theme}')`,
      enabled: true,
    },
    {
      id: 'host-frozen',
      description: `Host the bundle under ${hostRoot}/${bundle}/`,
      enabled: true,
    },
    {
      id: 'flip-lifecycle',
      description: `Set lifecycle: frozen (+ frozenBundle: ${bundle}) for '${entry.alias}' in registry.yml`,
      enabled: true,
    },
  ]

  return {
    alias: entry.alias,
    slug,
    theme,
    standaloneSlug,
    frozenBaseUrl,
    hostDir: `${hostRoot}/${bundle}`,
    bundleOut: options.bundleOut || DEFAULT_BUNDLE_OUT,
    servedUrl: `/frozen/${bundle}/slides/${standaloneSlug}/`,
    isCollaborative,
    steps,
  }
}
