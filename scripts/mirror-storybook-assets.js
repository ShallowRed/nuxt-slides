/**
 * mirror-storybook-assets.js
 *
 * Embedded Storybook stories reference their `staticDirs` assets with
 * root-absolute URLs (e.g. `/vitrine/...`, `/fonts/...`). Inside the bundle those
 * files live under `/_storybook/`, so the iframe — whatever sub-path it is served
 * at — requests them at the server root and 404s.
 *
 * Fix: mirror the Storybook static asset folders to the bundle root, so a
 * root-absolute `/vitrine/...` resolves. We copy every top-level entry of the
 * built Storybook that is NOT Storybook's own runtime (its JS/HTML/manifests),
 * and only when the bundle root doesn't already own that name — Nuxt's own assets
 * always win, Storybook merely fills the gaps.
 *
 * Usage:
 *   node scripts/mirror-storybook-assets.js <storybook-static-dir> <bundle-out-dir>
 */

import { existsSync } from 'node:fs'
import { cp, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import process from 'node:process'

const [storybookDir, bundleOut] = process.argv.slice(2)
if (!storybookDir || !bundleOut) {
  console.error('Usage: node scripts/mirror-storybook-assets.js <storybook-static-dir> <bundle-out-dir>')
  process.exit(1)
}

// Storybook's own build output — never mirror these to the root.
const STORYBOOK_RUNTIME = new Set([
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

const entries = await readdir(storybookDir, { withFileTypes: true })
const mirrored = []
const skipped = []

for (const entry of entries) {
  const name = entry.name
  if (STORYBOOK_RUNTIME.has(name) || name.endsWith('.js') || name.endsWith('.json')) {
    continue
  }
  const dest = join(bundleOut, name)
  if (existsSync(dest)) {
    // Nuxt already owns this name at the root — don't clobber it.
    skipped.push(name)
    continue
  }
  await cp(join(storybookDir, name), dest, { recursive: true })
  mirrored.push(name)
}

console.log(`  → Mirrored ${mirrored.length} asset entr${mirrored.length === 1 ? 'y' : 'ies'} to bundle root: ${mirrored.join(', ') || '(none)'}`)
if (skipped.length > 0)
  console.log(`  → Skipped ${skipped.length} already present at root: ${skipped.join(', ')}`)
