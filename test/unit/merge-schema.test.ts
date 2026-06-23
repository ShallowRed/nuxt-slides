import { describe, expect, it } from 'vitest'
import { applyOverridePolicy, deepMerge } from '../../shared/deck/merge'
import { parseDeckMeta } from '../../shared/deck/schema'

describe('deepMerge', () => {
  it('merges plain objects deeply', () => {
    expect(deepMerge({ reveal: { margin: 0.1, width: 100 } }, { reveal: { margin: 0.2 } }))
      .toEqual({ reveal: { margin: 0.2, width: 100 } })
  })

  it('ignores null/undefined overrides so a stray key cannot wipe a default', () => {
    expect(deepMerge({ theme: 'lee' }, { theme: null as any, title: undefined as any }))
      .toEqual({ theme: 'lee' })
  })

  it('replaces arrays and scalars', () => {
    expect(deepMerge({ a: [1, 2], b: 1 }, { a: [3], b: 2 })).toEqual({ a: [3], b: 2 })
  })
})

describe('applyOverridePolicy (declared precedence)', () => {
  const note = { storybook: 'https://public.example', theme: 'lee', access: 'private' }

  it('"all" lets the note override everything (CodiMD preset route)', () => {
    const { filtered, applied } = applyOverridePolicy(note, 'all')
    expect(filtered).toEqual(note)
    expect(applied.sort()).toEqual(['access', 'storybook', 'theme'])
  })

  it('whitelist keeps only listed keys (/p/<alias> → storybook only)', () => {
    const { filtered, applied } = applyOverridePolicy(note, ['storybook'])
    expect(filtered).toEqual({ storybook: 'https://public.example' })
    expect(applied).toEqual(['storybook'])
  })

  it('empty/undefined policy contributes nothing (/slides → body only)', () => {
    expect(applyOverridePolicy(note, []).filtered).toEqual({})
    expect(applyOverridePolicy(note, undefined).applied).toEqual([])
  })
})

describe('parseDeckMeta', () => {
  it('coerces numeric reveal options coming from strings', () => {
    const { meta, valid } = parseDeckMeta({ reveal: { margin: '0.2', width: '1200' } })
    expect(valid).toBe(true)
    expect(meta.reveal).toMatchObject({ margin: 0.2, width: 1200 })
  })

  it('passes unknown keys through', () => {
    const { meta } = parseDeckMeta({ theme: 'lee', custom: 'x' })
    expect((meta as any).custom).toBe('x')
  })

  it('flags a parser typo but is non-destructive by default', () => {
    const { valid, issues, meta } = parseDeckMeta({ parser: 'lea' })
    expect(valid).toBe(false)
    expect(issues.join()).toContain('parser')
    expect((meta as any).parser).toBe('lea')
  })

  it('throws in strict mode on invalid frontmatter', () => {
    expect(() => parseDeckMeta({ parser: 'lea' }, { strict: true })).toThrow(/parser/)
  })
})
