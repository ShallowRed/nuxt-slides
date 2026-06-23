import { describe, expect, it } from 'vitest'
import { splitFrontmatter } from '../../shared/deck/frontmatter'
import { resolveDeck } from '../../shared/deck/resolve'

/**
 * Golden / characterization of `resolveDeck` (audit §6).
 *
 * One resolver, parameterized by declared precedence data, must reproduce the
 * three routes' behavior — and turn each past incident into a regression test:
 *   - nested `reveal.margin` preserved (the margins bug)
 *   - the "effective" Storybook URL identical regardless of route (whitelist)
 *   - body precedence (remote note vs stub)
 */

describe('resolveDeck — CodiMD preset route (noteOverride: "all")', () => {
  it('preserves nested reveal.margin from the note (margins bug → regression test)', () => {
    const remote = [
      '---',
      'theme: lee',
      'reveal:',
      '  margin: 0.2',
      '---',
      '',
      '# Remote slide',
    ].join('\n')

    const deck = resolveDeck({ preset: 'dsfr', remote, noteOverride: 'all', source: 'codimd' })

    // Theme swapped to lee, lee backgrounds applied, margin honored.
    expect(deck.meta.theme).toBe('lee')
    expect(deck.meta.reveal).toMatchObject({ margin: 0.2, width: 1200, height: 800, slideNumber: true })
    expect(deck.meta.backgrounds).toEqual({
      h1: '/backgrounds/lee-slide-contrast.png',
      h2: '/backgrounds/lee-slide-contrast.png',
      h3: '/backgrounds/lee-slide-subtle.png',
    })
    expect(deck.provenance).toMatchObject({ bodyFrom: 'remote', layers: ['preset:dsfr', 'note'], source: 'codimd' })
    expect(deck.body).toBe('\n# Remote slide')
  })

  it('falls back to the dsfr preset when the note has no theme', () => {
    const remote = '---\ntitle: Hello\n---\n\nbody'
    const deck = resolveDeck({ preset: 'dsfr', remote, noteOverride: 'all' })
    expect(deck.meta.theme).toBe('dsfr')
    expect(deck.meta.title).toBe('Hello')
    expect(deck.meta.backgrounds).toMatchObject({ h1: '/backgrounds/slide-bg-default.png' })
  })
})

describe('resolveDeck — /p/<alias> (noteOverride: ["storybook"])', () => {
  const stub = [
    '---',
    'theme: lee',
    'storybook: http://localhost:6007',
    'access: public',
    '---',
    '',
    '# Stub body',
  ].join('\n')
  const remote = [
    '---',
    'storybook: https://public.example',
    'theme: minimal',
    '---',
    '',
    '# Remote body',
  ].join('\n')

  it('lets the note drive storybook only, keeping the stub theme/access', () => {
    const deck = resolveDeck({ stub, remote, noteOverride: ['storybook'], source: 'codimd' })
    expect(deck.meta.storybook).toBe('https://public.example')
    expect(deck.meta.theme).toBe('lee') // stub wins, note.theme is NOT whitelisted
    expect(deck.meta.access).toBe('public')
    expect(deck.provenance.overrides).toEqual(['storybook<-note'])
    expect(deck.provenance.bodyFrom).toBe('remote')
    expect(deck.body).toBe('\n# Remote body')
  })

  it('keeps the stub storybook when the note has none', () => {
    const remoteNoSb = '---\ntheme: minimal\n---\n\nbody'
    const deck = resolveDeck({ stub, remote: remoteNoSb, noteOverride: ['storybook'] })
    expect(deck.meta.storybook).toBe('http://localhost:6007')
    expect(deck.provenance.overrides).toEqual([])
  })
})

describe('resolveDeck — /slides & /api/presentations (noteOverride: [])', () => {
  const stub = '---\ntheme: dsfr\naccess: public\n---\n\n# Stub body'

  it('uses the stub frontmatter and the remote body (collaborative)', () => {
    const remote = '---\ntheme: minimal\nstorybook: https://x\n---\n\n# Remote body'
    const deck = resolveDeck({ stub, remote, noteOverride: [] })
    expect(deck.meta.theme).toBe('dsfr') // note frontmatter never leaks in
    expect((deck.meta as any).storybook).toBeUndefined()
    expect(deck.body).toBe('\n# Remote body')
    expect(deck.provenance).toMatchObject({ bodyFrom: 'remote', layers: ['stub'], overrides: [] })
  })

  it('uses the stub body when there is no remote note', () => {
    const deck = resolveDeck({ stub })
    expect(deck.meta.theme).toBe('dsfr')
    expect(deck.body).toBe('\n# Stub body')
    expect(deck.provenance.bodyFrom).toBe('stub')
  })
})

describe('resolveDeck — wire content is parseable back to the same meta', () => {
  it('content round-trips: client re-parsing yields the resolved meta', () => {
    const remote = '---\ntheme: lee\nreveal:\n  margin: 0.2\n---\n\n# x'
    const deck = resolveDeck({ preset: 'dsfr', remote, noteOverride: 'all' })
    const reparsed = splitFrontmatter(deck.content).data
    expect(reparsed.theme).toBe('lee')
    expect((reparsed.reveal as any).margin).toBe(0.2)
  })
})
