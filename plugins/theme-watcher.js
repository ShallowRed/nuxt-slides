import { mkdirSync, watch, writeFileSync } from 'node:fs'
import * as sass from 'sass'
import { themes } from '../themes/themes.config.js'

/**
 * Dev theme watcher — watch only, no startup compile.
 *
 * Compiling every theme on each startup is implicit work the dev server doesn't
 * need: the compiled `public/themes/*.css` are committed, so `nuxt dev` runs
 * against them as-is. Theme compilation is **opt-in**, owned by the script layer
 * (`pnpm build:themes`, or `pnpm dev:themes` which runs it before `nuxt dev`) —
 * not by this plugin's `buildStart`, which Nuxt fires once per Vite build
 * (client + Nitro, in separate processes) and so can't dedupe to a single pass.
 *
 * What stays automatic in dev is the *watch*: editing a theme's SCSS recompiles
 * just that theme and triggers HMR. That is genuine dev feedback, not startup
 * boilerplate.
 */
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
