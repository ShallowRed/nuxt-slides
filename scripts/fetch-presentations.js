/**
 * Initialize the presentations submodule during CI builds (Vercel).
 *
 * Locally the submodule is cloned normally via `git submodule update --init`.
 * On Vercel, where the private submodule can't be cloned without a token,
 * this script clones it directly into the presentations/ directory.
 */

import { execSync } from 'node:child_process'
import { existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'

const PRESENTATIONS_DIR = join(process.cwd(), 'presentations')

const config = {
  repo: process.env.PRESENTATIONS_REPO || 'ShallowRed/nuxt-slides-content',
  token: process.env.PRESENTATIONS_REPO_TOKEN,
  branch: process.env.PRESENTATIONS_BRANCH || 'main',
}

async function fetchPresentations() {
  // Check if submodule is already populated (local dev)
  if (existsSync(join(PRESENTATIONS_DIR, 'public'))) {
    const files = readdirSync(join(PRESENTATIONS_DIR, 'public'))
    if (files.some(f => f.endsWith('.md'))) {
      console.log('✅ Presentations submodule already initialized — skipping fetch')
      return
    }
  }

  if (!config.token) {
    console.log('⚠️  No PRESENTATIONS_REPO_TOKEN — run: git submodule update --init')
    return
  }

  console.log(`📥 Cloning ${config.repo} into presentations/...`)

  try {
    const cloneUrl = `https://x-access-token:${config.token}@github.com/${config.repo}.git`
    // Remove empty submodule placeholder and clone fresh
    execSync(`rm -rf "${PRESENTATIONS_DIR}"`, { stdio: 'inherit' })
    execSync(
      `git clone --depth 1 --branch ${config.branch} ${cloneUrl} "${PRESENTATIONS_DIR}"`,
      { stdio: 'inherit' },
    )
    // Remove .git from cloned dir so Nuxt doesn't get confused
    execSync(`rm -rf "${join(PRESENTATIONS_DIR, '.git')}"`, { stdio: 'inherit' })
    console.log('✨ Presentations fetched successfully!')
  }
  catch (error) {
    console.error('❌ Failed to fetch presentations:', error.message)
    console.log('   Continuing build without private content...')
  }
}

fetchPresentations()
