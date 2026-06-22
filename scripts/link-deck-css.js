/**
 * Links every `_nuxt/*.css` chunk into the deck HTML (DDR-017 §2.a-ter). MDC renders
 * slide bodies through a dynamic `<MDCRenderer>`, so those components' CSS escapes
 * `inlineStyles` SSR collection — the chunks exist but are unreferenced, and the
 * Nuxt JS that would load them is gone (noScripts), leaving story iframes unstyled
 * (height 0). We wire the chunks in statically, depth-relative, no duplicates.
 *
 * Usage: node scripts/link-deck-css.js <bundle-out-dir> <slug--standalone>
 */

import { existsSync } from 'node:fs'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import process from 'node:process'

const [bundleOut, standaloneSlug] = process.argv.slice(2)
if (!bundleOut || !standaloneSlug) {
  console.error('Usage: node scripts/link-deck-css.js <bundle-out-dir> <slug--standalone>')
  process.exit(1)
}

const htmlPath = join(bundleOut, 'slides', standaloneSlug, 'index.html')
const nuxtDir = join(bundleOut, '_nuxt')
if (!existsSync(htmlPath) || !existsSync(nuxtDir)) {
  console.error(`❌ Missing ${existsSync(htmlPath) ? '' : htmlPath}${existsSync(nuxtDir) ? '' : ` ${nuxtDir}`}`)
  process.exit(1)
}

// The deck HTML is at slides/<slug>/index.html → two dirs below the bundle root.
const prefix = '../..'
const cssFiles = (await readdir(nuxtDir))
  .filter(f => f.endsWith('.css') && !f.startsWith('error-')) // skip Nuxt error-page CSS
  .sort()

let html = await readFile(htmlPath, 'utf-8')

const links = cssFiles
  .filter(f => !html.includes(`_nuxt/${f}`)) // don't duplicate an already-linked chunk
  .map(f => `<link rel="stylesheet" href="${prefix}/_nuxt/${f}">`)
  .join('\n')

if (links) {
  // Inject right before </head> so component CSS layers over reveal.css/theme.
  html = html.replace('</head>', `${links}\n</head>`)
  await writeFile(htmlPath, html, 'utf-8')
}

console.log(`  → Linked ${links ? links.split('\n').length : 0} of ${cssFiles.length} _nuxt CSS chunk(s) into the deck (MDC component styles)`)
