/**
 * Makes a frozen Storybook self-contained (DDR-017 §2.a-ter). Embedded stories
 * reference staticDir assets root-absolute (`/vitrine/x.jpg`), which only resolve
 * if mirrored to the origin root — a mirror that pollutes public/ and gets
 * re-aspirated by the next `nuxt generate`. The assets already live in the bundle
 * under `_storybook/<dir>/`, so we rewrite the root-absolute URLs to relative
 * (`/vitrine/x` → `vitrine/x`): iframe.html has `<base target="_parent">` (no href),
 * so they resolve against the iframe location — exactly where the asset is. Only
 * rewrites URLs whose top segment is a real static-asset dir (never `/assets`, `/sb-*`).
 * Idempotent.
 *
 * Usage: node scripts/rebase-storybook-assets.js <built-storybook-dir> [--dry]
 */

import { existsSync } from 'node:fs'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import process from 'node:process'

const [storybookDir, ...flags] = process.argv.slice(2)
const DRY = flags.includes('--dry')

if (!storybookDir || !existsSync(storybookDir)) {
  console.error('Usage: node scripts/rebase-storybook-assets.js <built-storybook-dir> [--dry]')
  process.exit(1)
}

// Storybook's own runtime — never a rewrite target.
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

// Top-level static-asset names present in the bundle (dirs + loose files).
// A root-absolute URL whose first segment is one of these is a staticDir asset
// we can safely rebase to relative.
const topLevel = await readdir(storybookDir, { withFileTypes: true })
const assetRoots = new Set(
  topLevel
    .filter(e => !RUNTIME.has(e.name) && !e.name.startsWith('.') && !e.name.endsWith('.js') && !e.name.endsWith('.json'))
    .map(e => e.name),
)

if (assetRoots.size === 0) {
  console.log('  → No static-asset roots to rebase (already self-contained).')
  process.exit(0)
}

// Build a regex that matches `/<root>/…` (or bare `/<file>` for loose files)
// when preceded by a string/template/url() opener, capturing the opener so we
// can keep it. The leading slash is dropped in the replacement → relative URL.
const rootsAlt = [...assetRoots]
  .map(r => r.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  .join('|')
const re = new RegExp(`(["'\`(]\\s*)/((?:${rootsAlt})(?:/[^"'\`)\\s]*)?)`, 'g')

const SCAN_DIR = join(storybookDir, 'assets')
const scanFiles = []
async function collect(dir) {
  if (!existsSync(dir))
    return
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const abs = join(dir, e.name)
    if (e.isDirectory())
      await collect(abs)
    else if (/\.(?:js|mjs|cjs|css|map)$/.test(e.name))
      scanFiles.push(abs)
  }
}
await collect(SCAN_DIR)
// Also rewrite iframe.html / index.html in case they carry root-absolute refs.
for (const html of ['iframe.html', 'index.html']) {
  const p = join(storybookDir, html)
  if (existsSync(p))
    scanFiles.push(p)
}

let filesChanged = 0
let urlsRewritten = 0

for (const file of scanFiles) {
  const text = await readFile(file, 'utf-8')
  let count = 0
  // The asset files live at `_storybook/<root>/…`. The replacement prefix depends
  // on the RESOLUTION CONTEXT of the reference, not just the file type:
  //   • CSS `url(/fonts/x)`  → resolved against the STYLESHEET URL
  //     (`_storybook/assets/iframe.css`) → needs `../fonts/x`.
  //   • JS string literal `/vitrine/x` → becomes an `<img src>` resolved against
  //     the DOCUMENT URL (`_storybook/iframe.html`) → needs `vitrine/x` (no prefix).
  // Both bundles sit in `assets/`, but CSS references itself-relative while JS
  // strings become DOM attrs resolved doc-relative. A single rule can't serve
  // both — so prefix per file type.
  const isCss = /\.css$/.test(file)
  const prefix = isCss ? '../' : ''
  const out = text.replace(re, (_m, opener, rel) => {
    count++
    return `${opener}${prefix}${rel}` // root-absolute → context-correct relative
  })
  if (count > 0) {
    urlsRewritten += count
    filesChanged++
    if (!DRY)
      await writeFile(file, out, 'utf-8')
  }
}

console.log(`  → ${DRY ? '[dry] would rebase' : 'Rebased'} ${urlsRewritten} root-absolute asset URL(s) to relative across ${filesChanged} file(s)`)
console.log(`  → asset roots made self-contained: ${[...assetRoots].join(', ')}`)
