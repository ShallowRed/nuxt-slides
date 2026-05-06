import { mkdirSync, watch, writeFileSync } from 'node:fs'
import * as sass from 'sass'
import { themes } from '../themes/themes.config.js'

export default function themeWatcherPlugin() {
  function compileTheme({ name, input, output }) {
    try {
      const result = sass.compile(input, {
        style: 'expanded',
        sourceMap: false,
      })

      mkdirSync('public/themes', { recursive: true })
      writeFileSync(output, result.css)
      console.log(`✓ ${name} theme compiled`)
    }
    catch (error) {
      console.error(`✗ Error compiling ${name} theme:`, error.message)
    }
  }

  return {
    name: 'theme-watcher',

    buildStart() {
      // Compile all themes on start
      themes.forEach(compileTheme)
    },

    configureServer(server) {
      // Watch theme files in dev mode (own folder + any extra shared/preset dirs)
      themes.forEach(({ name, input, output, watchDir, watchExtraDirs }) => {
        const dirs = [watchDir, ...(watchExtraDirs ?? [])]

        dirs.forEach((dir) => {
          watch(dir, { recursive: true }, (eventType, filename) => {
            if (filename && filename.endsWith('.scss')) {
              console.log(`\n📝 ${name} theme changed, recompiling...`)
              compileTheme({ name, input, output })

              // Trigger HMR for any pages using this theme
              server.ws.send({
                type: 'full-reload',
                path: '*',
              })
            }
          })
        })
      })
    },
  }
}
