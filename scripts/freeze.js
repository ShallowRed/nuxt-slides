/**
 * freeze.js — one-command, DECLARATIVE driver for the deck-freeze pipeline
 * (audit §7 P2 #9 / Axe E).
 *
 * Freezing a deck used to be four nested Makefile targets
 * (`freeze-presentation` → `bundle-frozen` → `bundle-standalone` → `host-frozen`)
 * whose values (slug, theme, base URLs, bundle/host paths, which steps run) were
 * derived inline across scattered `make` variables and shell sub-shells. That
 * derivation now lives in ONE pure object — `buildFreezeDescriptor` from
 * `shared/build/freeze.ts`, fully unit-tested without a build.
 *
 * This driver is the imperative shell around that pure core:
 *   1. read the registry entry (presentations/registry.yml, via js-yaml),
 *   2. resolve the deck theme the way the Makefile does (stub frontmatter),
 *   3. build the descriptor,
 *   4. PRINT the plan — the named steps and every derived value — with --dry-run,
 *   5. EXECUTE the enabled steps otherwise.
 *
 * Non-destructive by design: it does NOT re-implement the freeze mechanism. Each
 * step delegates to the existing, battle-tested Makefile targets (`pull-note`,
 * `bundle-frozen`, `host-frozen`), so the Makefile remains the single source of
 * the *how*; this script is the single source of the *what* and the *plan*.
 *
 * Usage:
 *   node scripts/freeze.js <alias> [--dry-run] [--no-pull] [--theme <t>]
 *
 * Examples:
 *   node scripts/freeze.js atelier-mecenes --dry-run   # show the plan, run nothing
 *   node scripts/freeze.js atelier-mecenes             # rapatriate + freeze + host
 *   node scripts/freeze.js atelier-mecenes --no-pull   # repo stub is authoritative
 */

import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'
import { load as parseYaml } from 'js-yaml'
import { buildFreezeDescriptor } from '../shared/build/freeze.ts'

const args = process.argv.slice(2)
const alias = args.find(a => !a.startsWith('--'))
const dryRun = args.includes('--dry-run')
const noPull = args.includes('--no-pull')
const themeOverride = argVal('--theme')

function argVal(flag) {
  const i = args.indexOf(flag)
  return i !== -1 ? args[i + 1] : undefined
}

if (!alias) {
  console.error('Usage: node scripts/freeze.js <alias> [--dry-run] [--no-pull] [--theme <t>]')
  process.exit(1)
}

const ROOT = process.cwd()
const registryPath = join(ROOT, 'presentations', 'registry.yml')
if (!existsSync(registryPath)) {
  console.error(`❌ Registry not found: ${registryPath}`)
  process.exit(1)
}

const registry = parseYaml(readFileSync(registryPath, 'utf-8')) || {}
const entry = registry[alias]
if (!entry) {
  console.error(`❌ Alias "${alias}" not in registry.`)
  process.exit(1)
}

// Theme is read from the stub frontmatter (DDR-018), exactly as the Makefile does
// — reuse registry-get.js so there is one definition of "the deck's theme".
const theme = themeOverride || resolveTheme(alias)

const descriptor = buildFreezeDescriptor({ ...entry, alias }, { theme })

// `--no-pull` forces the rapatriation step off even for a collaborative deck
// (the repo stub is already authoritative).
if (noPull)
  setStep('pull-note', false)

printPlan(descriptor, { dryRun, noPull })

if (dryRun) {
  console.log('\n(dry run — nothing executed)')
  process.exit(0)
}

// ─── Execute the enabled steps in order ──────────────────────────────────────
for (const step of descriptor.steps.filter(s => s.enabled)) {
  console.log(`\n▶  ${step.id} — ${step.description}`)
  runStep(step.id, descriptor)
}

console.log(`\n✅ Freeze plan executed for "${alias}".`)
console.log(`   Served at ${descriptor.servedUrl}`)

// ─── Helpers ─────────────────────────────────────────────────────────────────

function resolveTheme(aliasArg) {
  try {
    return execFileSync('node', ['scripts/registry-get.js', aliasArg, 'theme'], {
      cwd: ROOT,
      encoding: 'utf-8',
    }).trim() || undefined
  }
  catch {
    return undefined // descriptor falls back to its DEFAULT_FREEZE_THEME
  }
}

function setStep(id, enabled) {
  const step = descriptor.steps.find(s => s.id === id)
  if (step)
    step.enabled = enabled
}

function printPlan(d, { dryRun: dry, noPull: skipPull }) {
  console.log(`Freeze plan for "${d.alias}"${dry ? ' (dry run)' : ''}`)
  console.log(`  slug            ${d.slug}`)
  console.log(`  theme           ${d.theme}`)
  console.log(`  standaloneSlug  ${d.standaloneSlug}`)
  console.log(`  frozenBaseUrl   ${d.frozenBaseUrl}`)
  console.log(`  bundleOut       ${d.bundleOut}`)
  console.log(`  hostDir         ${d.hostDir}`)
  console.log(`  servedUrl       ${d.servedUrl}`)
  console.log(`  collaborative   ${d.isCollaborative}${skipPull ? ' (pull skipped: --no-pull)' : ''}`)
  console.log('  steps:')
  for (const step of d.steps)
    console.log(`    [${step.enabled ? 'x' : ' '}] ${step.id} — ${step.description}`)
}

/**
 * Delegate a single step to the existing Makefile target that implements it.
 * The Makefile stays the single source of the freeze *mechanism* (the 6 scripts);
 * this driver only decides which steps run and with what derived values.
 */
function runStep(id, d) {
  switch (id) {
    case 'pull-note':
      make('pull-note', { ALIAS: d.alias })
      break
    case 'bundle-frozen':
      make('bundle-frozen', {
        BUNDLE_SLUG: d.slug,
        BUNDLE_THEME: d.theme,
        FROZEN_BASE_URL: d.frozenBaseUrl,
      })
      break
    case 'host-frozen':
      make('host-frozen', { ALIAS: d.alias })
      break
    case 'flip-lifecycle':
      // Declarative reminder only — flipping `lifecycle: frozen` is a reviewed
      // registry edit (DDR-018), never an automatic mutation.
      console.log(`   → Set 'lifecycle: frozen' (+ frozenBundle: ${d.alias}) for "${d.alias}" in presentations/registry.yml`)
      console.log(`   /p/${d.alias} then redirects to ${d.frozenBaseUrl} — CodiMD no longer needed, URL unchanged.`)
      break
    default:
      throw new Error(`Unknown freeze step: ${id}`)
  }
}

function make(target, vars) {
  const assignments = Object.entries(vars).map(([k, v]) => `${k}=${v}`)
  execFileSync('make', ['--no-print-directory', target, ...assignments], {
    cwd: ROOT,
    stdio: 'inherit',
  })
}
