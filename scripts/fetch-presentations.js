/**
 * Fetch presentations from private repository during build
 * This script runs before the build on Vercel to sync private/protected content
 */

import { execSync } from 'node:child_process'
import { existsSync, mkdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'

const PRESENTATIONS_DIR = join(process.cwd(), 'presentations')
const TEMP_CLONE_DIR = join(process.cwd(), '.presentations-temp')

/**
 * Configuration from environment variables
 */
const config = {
  // GitHub repo containing presentations (format: "owner/repo")
  repo: process.env.PRESENTATIONS_REPO || 'ShallowRed/nuxt-slides-content',
  // GitHub token for private repo access
  token: process.env.PRESENTATIONS_REPO_TOKEN,
  // Branch to clone
  branch: process.env.PRESENTATIONS_BRANCH || 'main',
  // Folders to sync (comma-separated)
  folders: (process.env.PRESENTATIONS_FOLDERS || 'private,semi-private,draft').split(','),
}

/**
 * Main function
 */
async function fetchPresentations() {
  console.log('🔄 Fetching presentations from private repository...')

  // Skip if no token provided (local dev without private content)
  if (!config.token) {
    console.log('⚠️  No PRESENTATIONS_REPO_TOKEN found - skipping private content sync')
    console.log('   (This is normal for local development)')
    return
  }

  try {
    // Clean up temp directory if exists
    if (existsSync(TEMP_CLONE_DIR)) {
      rmSync(TEMP_CLONE_DIR, { recursive: true, force: true })
    }

    // Clone the private repo
    const cloneUrl = `https://x-access-token:${config.token}@github.com/${config.repo}.git`
    console.log(`📥 Cloning ${config.repo}...`)
    execSync(`git clone --depth 1 --branch ${config.branch} ${cloneUrl} ${TEMP_CLONE_DIR}`, {
      stdio: 'inherit',
    })

    // Sync each configured folder
    for (const folder of config.folders) {
      const sourceDir = join(TEMP_CLONE_DIR, 'presentations', folder)
      const targetDir = join(PRESENTATIONS_DIR, folder)

      if (!existsSync(sourceDir)) {
        console.log(`⚠️  Folder not found: presentations/${folder} (skipping)`)
        continue
      }

      // Remove target folder if exists
      if (existsSync(targetDir)) {
        rmSync(targetDir, { recursive: true, force: true })
      }

      // Create target directory
      mkdirSync(targetDir, { recursive: true })

      // Copy files (using cp command for simplicity)
      execSync(`cp -r "${sourceDir}/." "${targetDir}/"`, { stdio: 'inherit' })
      console.log(`✅ Synced presentations/${folder}`)
    }

    // Clean up temp directory
    rmSync(TEMP_CLONE_DIR, { recursive: true, force: true })

    console.log('✨ Successfully fetched all presentations!')
  }
  catch (error) {
    console.error('❌ Failed to fetch presentations:', error.message)
    // Don't fail the build - continue without private content
    console.log('   Continuing build without private content...')
  }
}

// Run
fetchPresentations()
