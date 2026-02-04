import { mkdirSync, watch, writeFileSync } from 'node:fs'
import * as sass from 'sass'

export default function themeWatcherPlugin() {
  const themes = [
    {
      name: 'dsfr',
      input: 'themes/dsfr/dsfr.scss',
      output: 'public/themes/dsfr.css',
      watchDir: 'themes/dsfr',
    },
    {
      name: 'minimal',
      input: 'themes/minimal/minimal.scss',
      output: 'public/themes/minimal.css',
      watchDir: 'themes/minimal',
    },
  ]

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
      // Watch theme files in dev mode
      themes.forEach(({ name, input, output, watchDir }) => {
        watch(watchDir, { recursive: true }, (eventType, filename) => {
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
    },
  }
}
