import type { ContentSource } from '../../shared/deck'
import { describe, expect, it } from 'vitest'
import { resolveDeck } from '../../shared/deck'

/**
 * Port-contract / integration test (audit §6 "les 3 routes renvoient le même
 * DeckModel pour la même entrée").
 *
 * A `ContentSource` is satisfied by an in-memory fake, proving the resolver is
 * I/O-free and injectable: the same note, fed through the descriptors the three
 * routes build, yields a consistent body and validated meta — no real CodiMD,
 * no `useStorage`, no `$fetch`.
 */
function fakeSource(map: Record<string, string>): ContentSource {
  return {
    id: 'codimd',
    load: async ref => (ref in map ? { raw: map[ref]! } : null),
  }
}

describe('content source port + resolveDeck (injectable, I/O-free)', () => {
  const note = '---\ntheme: lee\nstorybook: https://public.example\nreveal:\n  margin: 0.2\n---\n\n# Body'
  const stub = '---\ntheme: dsfr\nstorybook: http://localhost:6007\naccess: public\nsource: codimd\nnoteId: abc\n---\n\n# Stub'
  const source = fakeSource({ abc: note })

  it('returns null for an unknown ref (fail-closed friendly)', async () => {
    expect(await source.load('missing')).toBeNull()
  })

  it('feeds resolveDeck and yields the same body across route descriptors', async () => {
    const remote = (await source.load('abc'))!.raw

    const codimd = resolveDeck({ preset: 'dsfr', remote, noteOverride: 'all', source: 'codimd' })
    const alias = resolveDeck({ stub, remote, noteOverride: ['storybook'], source: 'codimd' })
    const slides = resolveDeck({ stub, remote, noteOverride: [], source: 'codimd' })

    // Same body regardless of route.
    expect(codimd.body).toBe('\n# Body')
    expect(alias.body).toBe('\n# Body')
    expect(slides.body).toBe('\n# Body')

    // Declared precedence differentiates only the meta, predictably.
    expect(codimd.meta.theme).toBe('lee') // note is source of truth
    expect(alias.meta.theme).toBe('dsfr') // stub wins, note.theme not whitelisted
    expect(alias.meta.storybook).toBe('https://public.example') // whitelisted
    expect(slides.meta.storybook).toBe('http://localhost:6007') // note contributes body only
  })
})
