/**
 * Storybook embed-source port (audit §5.9 / Axe H, P1bis #15).
 *
 * Storybook is an external embed dependency that the freeze pipeline used to
 * re-handle in four scripts (`mirror` / `prune` / `rebase` / `link`), each of
 * which re-declared the same two pieces of knowledge:
 *
 *   - WHICH built files are Storybook's own runtime (never a static asset), and
 *   - WHICH top-level entries are therefore re-baseable static-asset roots.
 *
 * That duplication is exactly the inter-repo coupling Axe H flags (annex #19):
 * three identical `RUNTIME` sets + two near-identical asset-root detectors. This
 * module is the single, pure, framework-free definition the four scripts now
 * consume — the "EmbedSource" half of the render hexagon, alongside the embed URL
 * shape in `./storybook` and the asset-URL rebasing in `./reveal`.
 *
 * Pure on purpose: no fs, no process — it classifies names and declares the
 * pipeline, so it is unit-testable without a built Storybook.
 */

/**
 * Storybook's own build output: its HTML shell, manifests, and bundled runtime
 * dirs. These are the app itself, never staticDir assets — so they are never
 * mirrored to the bundle root, never pruned, never rebased.
 *
 * The single definition; previously copied verbatim into mirror/prune/rebase.
 */
export const STORYBOOK_RUNTIME: ReadonlySet<string> = new Set([
  'index.html',
  'iframe.html',
  'index.json',
  'project.json',
  'nunjucks-env.js',
  'vite-inject-mocker-entry.js',
  'assets',
  'sb-addons',
  'sb-common-assets',
  'sb-manager',
  'sb-preview',
  '.well-known',
])

/**
 * True when a top-level built-Storybook entry is part of Storybook's own runtime
 * (the shell/manifests/bundle dirs, plus any `.js`/`.json` file) rather than a
 * static asset. The one rule the four freeze scripts share for "skip this".
 */
export function isStorybookRuntime(name: string): boolean {
  return STORYBOOK_RUNTIME.has(name) || name.endsWith('.js') || name.endsWith('.json')
}

/**
 * From the top-level entries of a built Storybook, the names that are re-baseable
 * static-asset roots: everything that is not Storybook runtime and not a hidden
 * dotfile. A root-absolute URL whose first segment is one of these (`/vitrine/…`)
 * points at a staticDir asset the bundle carries under `_storybook/<root>/`.
 *
 * Pure: takes the names, returns the asset roots — the caller does the `readdir`.
 */
export function detectAssetRoots(entryNames: Iterable<string>): string[] {
  const roots: string[] = []
  for (const name of entryNames) {
    if (isStorybookRuntime(name) || name.startsWith('.'))
      continue
    roots.push(name)
  }
  return roots
}

/** A single named step of the Storybook freeze embed pipeline. */
export interface StorybookFreezeStep {
  id: 'prune' | 'mirror' | 'rebase' | 'link'
  /** The script that implements the step (the freeze adapter's mechanism). */
  script: string
  description: string
}

/**
 * The declarative description of the Storybook freeze embed pipeline — the four
 * passes that turn a built Storybook into a self-contained bundle embed, in the
 * order the freeze adapter runs them. Materializes Axe H's "four scripts become
 * one declared adapter step" so the orchestration is data, not Makefile prose.
 */
export const STORYBOOK_FREEZE_STEPS: readonly StorybookFreezeStep[] = [
  {
    id: 'prune',
    script: 'scripts/prune-storybook-assets.js',
    description: 'Prune the built Storybook\'s staticDir assets to the set its stories reference',
  },
  {
    id: 'rebase',
    script: 'scripts/rebase-storybook-assets.js',
    description: 'Rebase root-absolute asset URLs to bundle-relative so the iframe self-resolves',
  },
  {
    id: 'mirror',
    script: 'scripts/mirror-storybook-assets.js',
    description: 'Mirror remaining asset roots to the origin-root safety net (non-rebased consumers)',
  },
  {
    id: 'link',
    script: 'scripts/link-deck-css.js',
    description: 'Link the _nuxt CSS chunks into the deck HTML so MDC component styles apply',
  },
]
