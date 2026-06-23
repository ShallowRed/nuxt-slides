/**
 * Initialize the presentations content during CI builds (Vercel).
 *
 * Locally the content is a git submodule cloned via `git submodule update --init`.
 * On Vercel, where the private repo can't be cloned without a token, this script
 * clones it directly into the presentations/ directory.
 *
 * The source is now DECLARED once (audit §5.7 / Axe F): `readContentSourceConfig`
 * interprets the env into a typed config, and `decideFetchAction` makes the
 * fail-closed policy an explicit, tested decision instead of branching buried in
 * this script. Shipping an empty presentations/ on CI is refused loudly — that
 * silent-empty deploy was the worst past failure mode.
 */

import { execSync } from 'node:child_process'
import { existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'
import { decideFetchAction, readContentSourceConfig } from '../shared/content/source-config.ts'

const PRESENTATIONS_DIR = join(process.cwd(), 'presentations')

/** Is the content already checked out locally (submodule populated)? */
function isPopulated() {
  const publicDir = join(PRESENTATIONS_DIR, 'public')
  if (!existsSync(publicDir))
    return false
  return readdirSync(publicDir).some(f => f.endsWith('.md'))
}

async function fetchPresentations() {
  const config = readContentSourceConfig()
  const decision = decideFetchAction(config, isPopulated())

  switch (decision.action) {
    case 'skip':
      console.log(`✅ Presentations: ${decision.reason} — skipping fetch`)
      return

    case 'fail':
      console.error(`❌ ${decision.reason}`)
      console.error('   Set PRESENTATIONS_REPO_TOKEN in the CI environment.')
      process.exit(1)
      return

    case 'clone':
      console.log(`📥 Cloning ${decision.repo}@${decision.branch} into presentations/...`)
      try {
        const cloneUrl = `https://x-access-token:${process.env.PRESENTATIONS_REPO_TOKEN}@github.com/${decision.repo}.git`
        // Remove empty submodule placeholder and clone fresh
        execSync(`rm -rf "${PRESENTATIONS_DIR}"`, { stdio: 'inherit' })
        execSync(
          `git clone --depth 1 --branch ${decision.branch} ${cloneUrl} "${PRESENTATIONS_DIR}"`,
          { stdio: 'inherit' },
        )
        // Remove .git from cloned dir so Nuxt doesn't get confused
        execSync(`rm -rf "${join(PRESENTATIONS_DIR, '.git')}"`, { stdio: 'inherit' })
        console.log('✨ Presentations fetched successfully!')
      }
      catch (error) {
        console.error('❌ Failed to fetch presentations:', error.message)
        if (config.failClosed) {
          console.error('   Likely an expired/invalid PRESENTATIONS_REPO_TOKEN. Rotate it in Vercel env.')
          console.error('   Refusing to deploy a site without its presentations.')
          process.exit(1)
        }
        console.log('   Continuing build without private content...')
      }
  }
}

fetchPresentations()
