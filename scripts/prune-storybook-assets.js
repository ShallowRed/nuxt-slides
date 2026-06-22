/**
 * Prunes a built Storybook's staticDir assets (~87 Mo of apps/web/public) down to
 * the set its stories actually reference (DDR-017 §2.a). Scans the BUILT JS/CSS/HTML
 * for root-absolute asset URLs — post-bundling every transitive import is an inlined
 * string literal, so this catches what static source-scanning misses. Keeps the
 * Storybook runtime (assets/, sb-*, iframe.html…) and referenced assets; removes the
 * rest.
 *
 * Usage: node scripts/prune-storybook-assets.js <built-storybook-dir> [--dry]
 */

import { existsSync } from 'node:fs'
import { readdir, readFile, rm, stat } from 'node:fs/promises'
import { join, relative } from 'node:path'
import process from 'node:process'

const [storybookDir, ...flags] = process.argv.slice(2)
const DRY = flags.includes('--dry')

if (!storybookDir || !existsSync(storybookDir)) {
  console.error('Usage: node scripts/prune-storybook-assets.js <built-storybook-dir> [--dry]')
  process.exit(1)
}

// Storybook's own runtime — never prune; these ARE the app, not static assets.
const RUNTIME = new Set([
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

// Text files whose contents we scan for asset references.
const TEXT_EXT = /\.(?:js|mjs|cjs|css|html|json|svg|map)$/i
// Files we treat as referenceable static assets (root-absolute URL targets).
const ASSET_EXT = /\.(?:jpe?g|png|webp|gif|avif|svg|woff2?|ttf|otf|eot|mp4|webm|mp3|wav|ico|json|geojson|pdf|xlsx?)$/i

/** Recursively list every file under a dir, as paths relative to `root`. */
async function listFiles(dir, root, out = []) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const abs = join(dir, e.name)
    if (e.isDirectory())
      await listFiles(abs, root, out)
    else
      out.push(relative(root, abs))
  }
  return out
}

/** Collect every root-absolute asset URL referenced by the built text files. */
async function collectReferences(root) {
  const refs = new Set()
  // Scan Storybook's own runtime text (assets/, iframe.html, index.html) — that
  // is where bundled story code and its inlined asset strings live.
  const scanRoots = ['assets', 'iframe.html', 'index.html', 'sb-preview', 'sb-manager']
  // Match a root-absolute asset URL preceded by any string/template/url() opener:
  // " ' ` ( — the backtick is essential, data files emit photo paths as template
  // literals (`/vitrine/.../x.jpg`) and missing it would prune assets a deck needs.
  const urlRe = /["'`(]\s*(\/[a-z0-9][\w/.@-]*\.[a-z0-9]{2,5})\b/gi

  for (const entry of scanRoots) {
    const abs = join(root, entry)
    if (!existsSync(abs))
      continue
    const isDir = (await stat(abs)).isDirectory()
    const files = isDir ? await listFiles(abs, root) : [entry]
    for (const rel of files) {
      if (!TEXT_EXT.test(rel))
        continue
      let text
      try {
        text = await readFile(join(root, rel), 'utf-8')
      }
      catch {
        continue
      }
      for (const match of text.matchAll(urlRe)) {
        const url = match[1].split('?')[0].split('#')[0]
        if (ASSET_EXT.test(url))
          refs.add(url.replace(/^\/+/, '')) // store relative to root
      }
    }
  }
  return refs
}

const refs = await collectReferences(storybookDir)

// Walk top-level entries; for each non-runtime entry, keep only referenced files.
const topEntries = await readdir(storybookDir, { withFileTypes: true })
let removedFiles = 0
let removedBytes = 0
let keptFiles = 0

async function pruneEntry(name) {
  const abs = join(storybookDir, name)
  const files = await listFiles(abs, storybookDir)
  for (const rel of files) {
    if (refs.has(rel)) {
      keptFiles++
      continue
    }
    const s = await stat(join(storybookDir, rel)).catch(() => null)
    if (s)
      removedBytes += s.size
    removedFiles++
    if (!DRY)
      await rm(join(storybookDir, rel), { force: true })
  }
}

for (const e of topEntries) {
  if (RUNTIME.has(e.name) || e.name.endsWith('.js') || e.name.endsWith('.json'))
    continue
  if (e.isDirectory()) {
    await pruneEntry(e.name)
  }
  else {
    // Top-level static file (e.g. /favicon.ico): keep only if referenced.
    if (refs.has(e.name)) {
      keptFiles++
      continue
    }
    const s = await stat(join(storybookDir, e.name)).catch(() => null)
    if (s)
      removedBytes += s.size
    removedFiles++
    if (!DRY)
      await rm(join(storybookDir, e.name), { force: true })
  }
}

// Remove now-empty directories left behind by pruning.
async function pruneEmptyDirs(dir) {
  if (!existsSync(dir))
    return
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      const sub = join(dir, e.name)
      await pruneEmptyDirs(sub)
      const left = await readdir(sub).catch(() => [])
      if (left.length === 0 && !DRY)
        await rm(sub, { recursive: true, force: true })
    }
  }
}
if (!DRY)
  await pruneEmptyDirs(storybookDir)

const mb = n => (n / 1024 / 1024).toFixed(1)
console.log(`  → ${DRY ? '[dry] would keep' : 'Kept'} ${keptFiles} referenced asset(s), ${refs.size} distinct URL(s)`)
console.log(`  → ${DRY ? '[dry] would remove' : 'Removed'} ${removedFiles} unreferenced file(s), freeing ${mb(removedBytes)} Mo`)
