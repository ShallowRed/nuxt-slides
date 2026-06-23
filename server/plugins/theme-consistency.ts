/**
 * Boot-time theme-consistency warning (audit §7 quick win).
 *
 * Cross-checks, once at server startup, the three places a theme is declared —
 * the TS tokens manifest, the compiled `public/themes/*.css`, and the SCSS
 * source dirs under `themes/` — and logs any drift (e.g. a tokens theme whose
 * CSS is missing, which would make decks link a 404 stylesheet). The comparison
 * itself lives in the pure, tested `checkThemeConsistency`; this plugin only does
 * the filesystem reads and the logging.
 *
 * Non-fatal by design: it never throws (a deck must still render), and it
 * silently no-ops if the directories aren't present (e.g. a minimal bundle).
 */

import { existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'
import { checkThemeConsistency } from '#shared/theme'

export default defineNitroPlugin(() => {
  // Validate from the project root. Guarded so a deployment without these dirs
  // (or a non-Node runtime) just skips the check.
  let cwd: string
  try {
    cwd = process.cwd()
  }
  catch {
    return
  }

  const publicThemes = join(cwd, 'public', 'themes')
  if (!existsSync(publicThemes))
    return

  const cssFiles = safeReaddir(publicThemes)
    .filter(f => f.endsWith('.css'))
    .map(f => f.slice(0, -'.css'.length))

  const themesSrc = join(cwd, 'themes')
  const sourceDirs = existsSync(themesSrc)
    ? safeReaddir(themesSrc, { withFileTypes: true })
        .filter(e => e.isDirectory())
        .map(e => e.name)
    : undefined

  const report = checkThemeConsistency({ cssFiles, sourceDirs })
  if (!report.ok) {
    console.warn(
      `[theme-consistency] ${report.warnings.length} theme issue(s) found:\n  - ${report.warnings.join('\n  - ')}`,
    )
  }
})

function safeReaddir(dir: string): string[]
function safeReaddir(dir: string, opts: { withFileTypes: true }): import('node:fs').Dirent[]
function safeReaddir(dir: string, opts?: { withFileTypes: true }): unknown[] {
  try {
    return opts ? readdirSync(dir, opts) : readdirSync(dir)
  }
  catch {
    return []
  }
}
