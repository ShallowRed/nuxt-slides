#!/usr/bin/env node

import { mkdirSync, watch, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import * as sass from 'sass'
import { themes as themesConfig } from '../themes/themes.config.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

// Parse command line arguments
const args = process.argv.slice(2)
const watchMode = args.includes('--watch') || args.includes('-w')
const themeName = args.find(arg => !arg.startsWith('-'))

// Resolve theme paths against the project root
const allThemes = themesConfig.map(theme => ({
  ...theme,
  input: join(projectRoot, theme.input),
  output: join(projectRoot, theme.output),
  watchDir: join(projectRoot, theme.watchDir),
  watchExtraDirs: (theme.watchExtraDirs ?? []).map(d => join(projectRoot, d)),
}))

// Filter themes if specific theme requested
const themes = themeName
  ? allThemes.filter(t => t.name === themeName)
  : allThemes

if (themeName && themes.length === 0) {
  console.error(`✗ Theme "${themeName}" not found. Available themes: ${allThemes.map(t => t.name).join(', ')}`)
  process.exit(1)
}

// Ensure output directory exists
mkdirSync(join(projectRoot, 'public/themes'), { recursive: true })

// Compile a single theme
function compileTheme({ name, input, output }) {
  console.log(`\nCompiling ${name} theme...`)
  console.log('Input:', input)
  console.log('Output:', output)

  try {
    // Compile SCSS to CSS
    const result = sass.compile(input, {
      style: 'expanded',
      sourceMap: false,
    })

    // Write the compiled CSS
    writeFileSync(output, result.css)

    console.log(`✓ ${name} theme compiled successfully!`)
  }
  catch (error) {
    console.error(`✗ Error compiling ${name} theme:`, error.message)
    if (!watchMode) {
      process.exit(1)
    }
  }
}

// Compile all selected themes
themes.forEach(compileTheme)

// Watch mode
if (watchMode) {
  console.log('\n👀 Watching for changes...\n')

  themes.forEach(({ name, input, output, watchDir, watchExtraDirs }) => {
    const dirs = [watchDir, ...(watchExtraDirs ?? [])]
    console.log(`Watching ${name} theme at ${dirs.join(', ')}`)

    dirs.forEach((dir) => {
      watch(dir, { recursive: true }, (eventType, filename) => {
        if (filename && filename.endsWith('.scss')) {
          console.log(`\n📝 Change detected in ${name} (${filename})`)
          compileTheme({ name, input, output })
        }
      })
    })
  })

  console.log('\nPress Ctrl+C to stop watching\n')
}
