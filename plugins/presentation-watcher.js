import { watch } from 'node:fs'
import { resolve } from 'node:path'

/**
 * Vite plugin to watch presentation markdown files and trigger HMR
 * When a .md or .yaml file in the presentations folder changes,
 * it sends a custom HMR event that the client can listen to for refreshing data
 */
export default function presentationWatcherPlugin() {
  const presentationsDir = 'presentations'

  return {
    name: 'presentation-watcher',

    configureServer(server) {
      const watchPath = resolve(process.cwd(), presentationsDir)

      watch(watchPath, { recursive: true }, (eventType, filename) => {
        if (filename && (filename.endsWith('.md') || filename.endsWith('.yaml'))) {
          // Extract slug from filename (remove extension and path)
          const slug = filename
            .replace(/^(public|private|semi-private|draft)\//, '')
            .replace(/\.(md|yaml)$/, '')

          console.log(`\n📝 Presentation changed: ${filename}`)

          // Send custom HMR event with the slug
          server.ws.send({
            type: 'custom',
            event: 'presentation-update',
            data: { slug, filename },
          })
        }
      })

      console.log(`👀 Watching presentations in ${watchPath}`)
    },
  }
}
