import type { ThemeTokens } from '../theme/tokens'
import type { DeckMeta } from './schema'
import { KNOWN_THEMES, THEME_TOKENS } from '../theme/tokens'

/**
 * Named presets for preset-driven decks (the CodiMD route).
 *
 * Previously the preset definitions were **duplicated**: a partial copy in
 * `src/config/presets.ts` (unused) and the authoritative copy inlined inside
 * `server/api/codimd/[noteId].get.ts`. Presets are now **derived from the single
 * theme tokens manifest** (`shared/theme/tokens.ts`, audit §5.5): a preset is
 * just a theme's tokens projected into deck metadata.
 */

export type PresetMeta = Pick<
  DeckMeta,
  'lang' | 'theme' | 'parser' | 'backgrounds' | 'reveal'
>

function presetFromTokens(tokens: ThemeTokens): PresetMeta {
  const preset: PresetMeta = { theme: tokens.name }
  if (tokens.lang)
    preset.lang = tokens.lang
  if (tokens.parser)
    preset.parser = tokens.parser
  if (tokens.backgrounds)
    preset.backgrounds = tokens.backgrounds
  if (tokens.reveal)
    preset.reveal = tokens.reveal
  return preset
}

export const PRESETS: Record<string, PresetMeta> = Object.fromEntries(
  Object.values(THEME_TOKENS).map(t => [t.name, presetFromTokens(t)]),
)

export const DEFAULT_PRESET = 'dsfr'

export { KNOWN_THEMES }

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
