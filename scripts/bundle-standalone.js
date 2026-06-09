/**
 * bundle-standalone.js
 *
 * Produces a self-contained static site where Storybook and the Nuxt
 * presentation live at the same origin, so iframe embeds work without a
 * running Storybook dev server.
 *
 * Steps:
 *   1. Copy the pre-built storybook-static/ into presentations/public/ as a
 *      temporary asset so nuxt generate can pick it up. It will end up at
 *      /_storybook/ in the final output.
 *   2. Write a patched copy of the target presentation with the storybook
 *      frontmatter URL replaced by the bundled relative path.
 *   3. Run `nuxt generate` (the caller is responsible for this — this script
 *      only sets things up and tears them down).
 *
 * Usage (called from Makefile):
 *   node scripts/bundle-standalone.js <presentation-slug> <storybook-dir> [storybook-url-in-bundle]
 *
 * Arguments:
 *   presentation-slug   Filename without .md, e.g. pistes-vitrine-t3-2026
 *   storybook-dir       Absolute path to the built storybook-static folder
 *   storybook-url       URL the bundled Storybook will be served at (default: /_storybook)
 */

import { cp, copyFile, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import process from 'node:process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

const [slug, storybookDir, storybookUrl = '/_storybook', , command = 'setup'] = process.argv.slice(2)

if (!slug || !storybookDir) {
  console.error('Usage: node scripts/bundle-standalone.js <slug> <storybook-dir> [storybook-url]')
  process.exit(1)
}

const srcPres = join(ROOT, 'presentations', 'public', `${slug}.md`)
const patchedPres = join(ROOT, 'presentations', 'public', `${slug}--standalone.md`)
const storybookDest = join(ROOT, 'presentations', 'public', '_storybook-bundle')

if (!existsSync(srcPres)) {
  console.error(`❌ Presentation not found: ${srcPres}`)
  process.exit(1)
}

if (!existsSync(storybookDir)) {
  console.error(`❌ Storybook build not found: ${storybookDir}`)
  process.exit(1)
}

async function setup() {
  console.log(`📦 Bundling standalone: ${slug}`)

  // 1. Copy storybook-static into presentations/public/_storybook-bundle
  //    Nuxt's public asset copy will pick it up and serve it at /_storybook-bundle
  //    We rename it at output time via the nuxt hook, but for simplicity we just
  //    copy it to .output/public/_storybook after generate.
  //    Here we stage it in a temp location for the generate step.
  console.log(`  → Copying storybook from ${storybookDir}`)
  if (existsSync(storybookDest))
    await rm(storybookDest, { recursive: true })
  await cp(storybookDir, storybookDest, { recursive: true })

  // 2. Patch the presentation: replace `storybook: http://...` with the bundled URL
  console.log(`  → Patching presentation frontmatter`)
  const original = await readFile(srcPres, 'utf-8')
  const baseUrl = process.env.NUXT_APP_BASE_URL || '/'
  const resolvedStorybookUrl = baseUrl !== '/'
    ? baseUrl.replace(/\/$/, '') + storybookUrl
    : storybookUrl
  const patched = original.replace(
    /^(storybook:\s*)https?:\/\/[^\n]*/m,
    `$1${resolvedStorybookUrl}`,
  )
  if (patched === original) {
    console.warn('  ⚠️  No storybook: frontmatter found — presentation unchanged')
  }
  await writeFile(patchedPres, patched, 'utf-8')

  console.log(`  ✅ Setup done. Run nuxt generate then call teardown.`)
}

async function teardown() {
  console.log(`🧹 Teardown standalone bundle`)
  if (existsSync(patchedPres))
    await rm(patchedPres)
  if (existsSync(storybookDest))
    await rm(storybookDest, { recursive: true })
  console.log(`  ✅ Cleaned up temp files.`)
}

if (command === 'teardown')
  await teardown()
else
  await setup()
