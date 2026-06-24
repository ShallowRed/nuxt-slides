#!/usr/bin/env node
/**
 * Migration: access folders → flat layout + frontmatter status/project.
 *
 * docs/presentation-metadata.md moves the publication status from the
 * `presentations/<status>/` folder into each stub's frontmatter, and adds a
 * `project:` grouping axis. This script performs that one-shot, mechanical move:
 *
 *   presentations/<status>/<slug>.md  →  presentations/<slug>.md
 *      + inject `status: <status>` (from the source folder)
 *      + inject `project: <project>` (from the PROJECT_MAP below)
 *
 * SURGICAL by design: it only INSERTS the two lines into the existing
 * frontmatter block (after `title:` if present, else at the top). It never
 * reserialises the YAML — so the diff is two added lines per file, nothing else.
 *
 * Runs INSIDE the `presentations/` git submodule. Dry-run by default; pass
 * `--apply` to actually move/rewrite. `archived/` is left untouched (registry).
 *
 *   node scripts/migrate-flatten-presentations.js          # preview
 *   node scripts/migrate-flatten-presentations.js --apply  # do it
 */

import { readdir, readFile, rename, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import process from 'node:process'

const ROOT = join(process.cwd(), 'presentations')
const STATUS_FOLDERS = ['public', 'semi-private', 'private', 'draft']
const APPLY = process.argv.includes('--apply')

/**
 * Explicit slug → project mapping (reviewable, deterministic). Slugs not listed
 * fall back to `interne`. Keep in sync with presentations/projects.yml.
 */
const PROJECT_MAP = {
  // Portail RSE
  'analyse-technique-portail-rse': 'portail-rse',
  'portail-rse-lee-integration': 'portail-rse',
  'rse-analyse-produit-brut': 'portail-rse',
  'scenarios-integration-portail-rse': 'portail-rse',
  'rules-as-code-pitch': 'portail-rse',
  // Site vitrine
  'vitrine-hero-options': 'vitrine',
  'vitrine-referentiel-options': 'vitrine',
  'vitrine-t3-candidat-retenu': 'vitrine',
  // Mutualisation simulateurs
  'mutualisation': 'mutualisation',
  'mutualisation-2': 'mutualisation',
  'mutualisation-3': 'mutualisation',
  'simulateurs-opportunites-mutualisation': 'mutualisation',
  'restitution-catalogue': 'mutualisation',
  'intervention-npm': 'mutualisation',
}
const DEFAULT_PROJECT = 'interne'

/** Insert `status:`/`project:` into a frontmatter block without reserialising. */
function injectFrontmatter(content, status, project) {
  const m = content.match(/^---\n([\s\S]*?)\n---/)
  if (!m) {
    // No frontmatter: prepend a minimal block.
    return `---\nstatus: ${status}\nproject: ${project}\n---\n\n${content}`
  }
  const block = m[1]
  const lines = block.split('\n')

  // Drop a pre-existing top-level status/access line (folder is authoritative here).
  const kept = lines.filter(l => !/^(?:status|access):/.test(l))
  const injected = [`status: ${status}`, `project: ${project}`]

  // Insert right after a top-level `title:` line for readability, else at the top.
  const titleIdx = kept.findIndex(l => l.startsWith('title:'))
  if (titleIdx >= 0)
    kept.splice(titleIdx + 1, 0, ...injected)
  else
    kept.unshift(...injected)

  return content.replace(m[0], `---\n${kept.join('\n')}\n---`)
}

async function main() {
  const moves = []
  for (const status of STATUS_FOLDERS) {
    const dir = join(ROOT, status)
    let files
    try {
      files = await readdir(dir)
    }
    catch {
      continue
    }
    for (const file of files) {
      if (!file.endsWith('.md'))
        continue
      const slug = file.replace(/\.md$/, '')
      const project = PROJECT_MAP[slug] ?? DEFAULT_PROJECT
      moves.push({ slug, status, project, from: join(dir, file), to: join(ROOT, file) })
    }
  }

  // Guard: refuse to collide two stubs onto the same flat path.
  const seen = new Map()
  for (const mv of moves) {
    if (seen.has(mv.slug)) {
      console.error(`✗ slug collision: "${mv.slug}" in both ${seen.get(mv.slug)} and ${mv.status}`)
      process.exitCode = 1
      return
    }
    seen.set(mv.slug, mv.status)
  }

  console.log(`${APPLY ? 'APPLYING' : 'DRY-RUN'} — ${moves.length} stub(s)\n`)
  for (const mv of moves) {
    console.log(`  ${mv.status}/${mv.slug}.md → ${mv.slug}.md   [status: ${mv.status}, project: ${mv.project}]`)
    if (!APPLY)
      continue
    const content = await readFile(mv.from, 'utf8')
    await writeFile(mv.from, injectFrontmatter(content, mv.status, mv.project))
    await rename(mv.from, mv.to)
  }

  if (!APPLY)
    console.log('\nRe-run with --apply to move files. (Run inside the presentations/ submodule.)')
  else
    console.log('\n✅ Done. Review `git status` in the submodule, then commit.')
}

main()
