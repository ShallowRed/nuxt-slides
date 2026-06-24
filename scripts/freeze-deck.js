/**
 * freeze-deck.js
 *
 * Prototype for DDR-017 (mécanisme C — bundle réduit). Resolves which Storybook
 * stories a deck actually embeds, so a freeze can bundle *only* those stories
 * instead of the whole `storybook-static/`.
 *
 * It does NOT build anything by itself. It:
 *   1. Extracts story ids from a deck (.md) — `story="…"` annotations and
 *      `<StoryFrame story="…">` components.
 *   2. Cross-checks them against a built Storybook `index.json` (the authoritative
 *      id → importPath map), reporting any **broken reference** (id absent from
 *      the current Storybook — the exact fragility DDR-017 guards against).
 *   3. Emits the minimal set of source story files to keep in a reduced build,
 *      and a JSON report.
 *
 * Why `index.json` rather than re-deriving ids from titles: Storybook owns the
 * id-generation rules (title slugification, name normalisation). Reading the
 * built index keeps this resolver correct across Storybook upgrades and makes
 * broken-reference detection a free side effect.
 *
 * Usage:
 *   node scripts/freeze-deck.js <deck.md> <storybook-static-dir> [--json out.json] [--globs-only]
 *
 * `--globs-only` prints just the `stories` globs (one per resolved file, relative
 * to `.storybook/`, comma-separated) to stdout and suppresses the human summary —
 * meant to feed `STORYBOOK_STORIES_GLOBS` for a reduced build. Broken refs still
 * set exit code 2 (and are reported on stderr), so a Makefile can fail the freeze.
 *
 * Exit codes:
 *   0  all referenced ids resolve
 *   2  at least one referenced id is missing from the Storybook index
 *   1  usage / IO error
 */

import { existsSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { join, relative, resolve } from 'node:path'
import process from 'node:process'

const args = process.argv.slice(2)
const positional = args.filter(a => !a.startsWith('--'))
const [deckPath, storybookDir] = positional
const jsonFlagIdx = args.indexOf('--json')
const jsonOut = jsonFlagIdx !== -1 ? args[jsonFlagIdx + 1] : undefined
const globsOnly = args.includes('--globs-only')

if (!deckPath || !storybookDir) {
  console.error('Usage: node scripts/freeze-deck.js <deck.md> <storybook-static-dir> [--json out.json]')
  process.exit(1)
}

const indexPath = join(storybookDir, 'index.json')
if (!existsSync(deckPath)) {
  console.error(`❌ Deck not found: ${deckPath}`)
  process.exit(1)
}
if (!existsSync(indexPath)) {
  console.error(`❌ Storybook index not found: ${indexPath}`)
  console.error('   Build Storybook first (pnpm build-storybook) so index.json exists.')
  process.exit(1)
}

/**
 * Extracts every Storybook story id referenced by a deck.
 *
 * Both forms carry the id in a `story="…"` attribute — the MDC layout annotation
 * (`:layout{… story="…"}`) and the `<StoryFrame story="…">` component — so one
 * pattern covers both. Ids are returned de-duplicated, in first-seen order.
 */
function extractStoryIds(markdown) {
  const ids = []
  const seen = new Set()
  const re = /\bstory=["']([^"']+)["']/g
  let m = re.exec(markdown)
  while (m !== null) {
    const id = m[1]
    if (!seen.has(id)) {
      seen.add(id)
      ids.push(id)
    }
    m = re.exec(markdown)
  }
  return ids
}

const deck = await readFile(deckPath, 'utf-8')
const index = JSON.parse(await readFile(indexPath, 'utf-8'))
// Storybook 7+ uses { v, entries: { [id]: { id, title, importPath, … } } }.
const entries = index.entries ?? index.stories ?? {}

const referenced = extractStoryIds(deck)

const resolved = []
const broken = []
for (const id of referenced) {
  const entry = entries[id]
  if (entry?.importPath)
    resolved.push({ id, importPath: entry.importPath, title: entry.title })
  else
    broken.push(id)
}

// The reduced build keeps only the source files behind the resolved ids.
// importPath looks like "./stories/candidats/.../X.stories.tsx" — normalise to a
// glob-friendly relative path from the storybook project root.
const keepFiles = [...new Set(resolved.map(r => r.importPath.replace(/^\.\//, '')))].sort()

const report = {
  deck: relative(process.cwd(), resolve(deckPath)),
  storybook: relative(process.cwd(), resolve(storybookDir)),
  referencedCount: referenced.length,
  resolvedCount: resolved.length,
  brokenCount: broken.length,
  keepFiles,
  resolved,
  broken,
}

// ── Globs-only mode: emit the `stories` globs for a reduced build ────────────
// `.storybook/main.ts` resolves globs relative to itself (the `.storybook/`
// folder), while importPath is relative to the storybook project root — so we
// prefix `../`. Broken refs are still surfaced on stderr and via the exit code.
if (globsOnly) {
  if (broken.length > 0) {
    console.error(`✗ ${broken.length} broken reference(s): ${broken.join(', ')}`)
    process.exit(2)
  }
  const globs = keepFiles.map(f => `../${f}`).join(',')
  process.stdout.write(globs)
  process.exit(0)
}

// ── Human-readable summary ──────────────────────────────────────────────────
console.log(`\n📊 Deck: ${report.deck}`)
console.log(`   Referenced stories : ${referenced.length}`)
console.log(`   Resolved           : ${resolved.length}`)
console.log(`   Source files to keep (reduced build):`)
for (const f of keepFiles)
  console.log(`     • ${f}`)

if (broken.length > 0) {
  console.error(`\n⚠️  BROKEN references (${broken.length}) — absent from the current Storybook index:`)
  for (const id of broken)
    console.error(`     ✗ ${id}`)
  console.error('\n   These slides will render empty. Fix the deck ids, or re-promote the screens,')
  console.error('   before freezing — a frozen bundle would otherwise preserve broken embeds.')
}

if (jsonOut) {
  await writeFile(jsonOut, `${JSON.stringify(report, null, 2)}\n`, 'utf-8')
  console.log(`\n📝 Report written: ${jsonOut}`)
}

process.exit(broken.length > 0 ? 2 : 0)
