import type { DeckMeta } from './schema'

/**
 * Named presets for preset-driven decks (the CodiMD route).
 *
 * These were previously **duplicated**: a partial copy in `src/config/presets.ts`
 * (unused) and the authoritative copy inlined inside
 * `server/api/codimd/[noteId].get.ts`. This module is now the single source of
 * truth, faithful to the live server behavior, consumed by `resolveDeck`.
 */

export type PresetMeta = Pick<
  DeckMeta,
  'lang' | 'theme' | 'parser' | 'backgrounds' | 'reveal'
>

export const PRESETS: Record<string, PresetMeta> = {
  dsfr: {
    lang: 'fr',
    theme: 'dsfr',
    parser: 'separator',
    backgrounds: {
      h1: '/backgrounds/slide-bg-default.png',
      h2: '/backgrounds/slide-bg-contrast.png',
      h3: '/backgrounds/slide-bg-subtle.png',
    },
    reveal: {
      slideNumber: true,
      width: 1200,
      height: 800,
    },
  },
  minimal: {
    lang: 'fr',
    theme: 'minimal',
    parser: 'separator',
    reveal: {
      slideNumber: true,
    },
  },
  lee: {
    lang: 'fr',
    theme: 'lee',
    parser: 'separator',
    backgrounds: {
      h1: '/backgrounds/lee-slide-contrast.png',
      h2: '/backgrounds/lee-slide-contrast.png',
      h3: '/backgrounds/lee-slide-subtle.png',
    },
    reveal: {
      slideNumber: true,
      width: 1200,
      height: 800,
    },
  },
}

export const DEFAULT_PRESET = 'dsfr'

export const KNOWN_THEMES = Object.keys(PRESETS)

/**
 * Build the base preset layer for a deck, optionally swapping the visual bits
 * (backgrounds + reveal) to match a theme chosen in the note's frontmatter.
 *
 * Faithful to the original `buildContentWithPreset` preset assembly: when the
 * note picks a different known theme, only its `backgrounds`/`reveal` are swapped
 * in; the note's scalar keys (theme, title…) are layered on afterwards by the
 * caller's deep-merge.
 */
export function buildPresetBase(presetName: string, noteTheme?: unknown): PresetMeta {
  const preset: PresetMeta = { ...(PRESETS[presetName] ?? PRESETS[DEFAULT_PRESET]!) }
  const theme = typeof noteTheme === 'string' ? noteTheme : undefined
  if (theme && theme !== preset.theme && PRESETS[theme]) {
    const themePreset = PRESETS[theme]!
    if (themePreset.backgrounds)
      preset.backgrounds = themePreset.backgrounds
    if (themePreset.reveal)
      preset.reveal = themePreset.reveal
  }
  return preset
}
