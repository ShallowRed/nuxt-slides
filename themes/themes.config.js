/**
 * Single source of truth for the list of themes compiled by this project.
 *
 * Used by:
 *   - scripts/build-themes.js    (CLI: `pnpm build:themes` and `--watch`)
 *   - plugins/theme-watcher.js   (Vite plugin: dev-time HMR)
 *
 * Paths are intentionally written as project-root-relative POSIX paths so
 * both consumers can resolve them against the project root with `path.join`.
 *
 * `watchDir` controls which directory the watchers monitor. When a theme
 * @use's files outside its own folder (e.g. themes/shared/, themes/presets/),
 * extend `watchExtraDirs` so saved changes still trigger a rebuild.
 */
export const themes = [
  {
    name: 'dsfr',
    input: 'themes/dsfr/dsfr.scss',
    output: 'public/themes/dsfr.css',
    watchDir: 'themes/dsfr',
    watchExtraDirs: ['themes/shared', 'themes/presets'],
  },
  {
    name: 'dsfr-standalone',
    input: 'themes/dsfr/dsfr-standalone.scss',
    output: 'public/themes/dsfr-standalone.css',
    watchDir: 'themes/dsfr',
    watchExtraDirs: [],
  },
  {
    name: 'minimal',
    input: 'themes/minimal/minimal.scss',
    output: 'public/themes/minimal.css',
    watchDir: 'themes/minimal',
    watchExtraDirs: ['themes/shared'],
  },
]
