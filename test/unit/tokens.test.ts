import { describe, expect, it } from 'vitest'
import { buildPresetBase, DEFAULT_PRESET, KNOWN_THEMES, PRESETS } from '../../shared/deck/presets'
import { THEME_BACKGROUNDS, THEME_TOKENS } from '../../shared/theme/tokens'

/**
 * Tokens manifest is the single source of truth (audit §5.5): presets and
 * backgrounds derive from it, so they can never drift apart again.
 */
describe('theme tokens manifest', () => {
  it('derives PRESETS from the tokens manifest', () => {
    for (const name of Object.keys(THEME_TOKENS)) {
      expect(PRESETS[name]).toBeDefined()
      expect(PRESETS[name]!.theme).toBe(name)
      expect(PRESETS[name]!.backgrounds).toEqual(THEME_TOKENS[name]!.backgrounds ?? undefined)
    }
  })

  it('derives THEME_BACKGROUNDS from the same manifest', () => {
    expect(THEME_BACKGROUNDS.lee).toEqual(THEME_TOKENS.lee!.backgrounds)
    expect(THEME_BACKGROUNDS.minimal).toEqual({})
  })

  it('exposes KNOWN_THEMES from the manifest', () => {
    expect(KNOWN_THEMES).toEqual(Object.keys(THEME_TOKENS))
    expect(DEFAULT_PRESET).toBe('dsfr')
  })

  it('swaps backgrounds/reveal when the note picks a different known theme', () => {
    const base = buildPresetBase('dsfr', 'lee')
    expect(base.theme).toBe('dsfr') // scalar theme stays preset until note merge
    expect(base.backgrounds).toEqual(THEME_TOKENS.lee!.backgrounds)
    expect(base.reveal).toEqual(THEME_TOKENS.lee!.reveal)
  })
})
