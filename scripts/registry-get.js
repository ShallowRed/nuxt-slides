/**
 * registry-get.js — print a field of a registry entry, for Makefile wiring.
 *
 * Usage: node scripts/registry-get.js <alias> <field>
 * Example: node scripts/registry-get.js pistes-vitrine-t3 slug  →  pistes-vitrine-t3-2026
 *
 * Falls back to the alias itself for `slug` when unset, mirroring the server.
 *
 * Special field `theme`: the deck theme lives in the STUB FRONTMATTER (DDR-018 —
 * the .md frontmatter stays the source of truth for theme/storybook), not the
 * registry. This resolves slug + access, reads `theme:` from the stub, and falls
 * back to `lee`. Lets the freeze flow pick the right theme automatically.
 *
 * Exits 1 (empty stdout) when the alias is unknown or the field is unset.
 */

import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import process from 'node:process'
import { load as parseYaml } from 'js-yaml'

const [alias, field] = process.argv.slice(2)
if (!alias || !field) {
  console.error('Usage: node scripts/registry-get.js <alias> <field>')
  process.exit(1)
}

const presentationsDir = join(process.cwd(), 'presentations')
const doc = parseYaml(await readFile(join(presentationsDir, 'registry.yml'), 'utf-8')) || {}
const entry = doc[alias]
if (!entry) {
  process.exit(1)
}

const slug = entry.slug || alias

// `theme` is read from the stub's frontmatter, not the registry.
if (field === 'theme') {
  const folders = entry.access ? [entry.access] : ['public', 'draft', 'private', 'semi-private']
  let theme
  for (const folder of folders) {
    const stub = join(presentationsDir, folder, `${slug}.md`)
    if (!existsSync(stub))
      continue
    const raw = await readFile(stub, 'utf-8')
    const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
    const m = fm?.[1].match(/^theme:(.+)$/m)
    if (m) {
      theme = m[1].trim().replace(/^['"]|['"]$/g, '')
      break
    }
  }
  process.stdout.write(theme || 'lee')
  process.exit(0)
}

// `--entry-yaml` dumps the whole registry entry (for a frozen bundle's provenance).
if (field === '--entry-yaml') {
  const { dump } = await import('js-yaml')
  process.stdout.write(dump({ [alias]: entry }))
  process.exit(0)
}

const value = field === 'slug' ? slug : entry[field]
if (value === undefined || value === null)
  process.exit(1)

process.stdout.write(String(value))
