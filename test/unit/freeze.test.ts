import { describe, expect, it } from 'vitest'
import {
  buildFreezeDescriptor,
  DEFAULT_BUNDLE_OUT,
  DEFAULT_FREEZE_THEME,
  DEFAULT_FROZEN_HOST_DIR,
} from '../../shared/build/freeze'

describe('buildFreezeDescriptor', () => {
  it('derives every value from a minimal entry with defaults', () => {
    const d = buildFreezeDescriptor({ alias: 'atelier-mecenes' })
    expect(d).toEqual({
      alias: 'atelier-mecenes',
      slug: 'atelier-mecenes',
      theme: DEFAULT_FREEZE_THEME,
      standaloneSlug: 'atelier-mecenes--standalone',
      frozenBaseUrl: '/frozen/atelier-mecenes/',
      hostDir: `${DEFAULT_FROZEN_HOST_DIR}/atelier-mecenes`,
      bundleOut: DEFAULT_BUNDLE_OUT,
      servedUrl: '/frozen/atelier-mecenes/slides/atelier-mecenes--standalone/',
      isCollaborative: false,
      steps: [
        { id: 'pull-note', description: expect.any(String), enabled: false },
        { id: 'bundle-frozen', description: expect.any(String), enabled: true },
        { id: 'host-frozen', description: expect.any(String), enabled: true },
        { id: 'flip-lifecycle', description: expect.any(String), enabled: true },
      ],
    })
  })

  it('falls back slug → alias and frozenBundle → alias', () => {
    const d = buildFreezeDescriptor({ alias: 'a' })
    expect(d.slug).toBe('a')
    expect(d.frozenBaseUrl).toBe('/frozen/a/')
    expect(d.hostDir).toBe(`${DEFAULT_FROZEN_HOST_DIR}/a`)
  })

  it('honours an explicit slug for the standalone target and served URL', () => {
    const d = buildFreezeDescriptor({
      alias: 'pistes-vitrine-t3',
      slug: 'pistes-vitrine-t3-2026',
    })
    expect(d.slug).toBe('pistes-vitrine-t3-2026')
    expect(d.standaloneSlug).toBe('pistes-vitrine-t3-2026--standalone')
    // The bundle is hosted under the ALIAS, served under the SLUG's standalone target.
    expect(d.frozenBaseUrl).toBe('/frozen/pistes-vitrine-t3/')
    expect(d.servedUrl).toBe(
      '/frozen/pistes-vitrine-t3/slides/pistes-vitrine-t3-2026--standalone/',
    )
  })

  it('hosts under frozenBundle when it differs from the alias', () => {
    const d = buildFreezeDescriptor({ alias: 'talk', frozenBundle: 'talk-v2' })
    expect(d.frozenBaseUrl).toBe('/frozen/talk-v2/')
    expect(d.hostDir).toBe(`${DEFAULT_FROZEN_HOST_DIR}/talk-v2`)
    expect(d.servedUrl).toBe('/frozen/talk-v2/slides/talk--standalone/')
  })

  it('marks a codimd-sourced deck with a noteId as collaborative (pull-note enabled)', () => {
    const d = buildFreezeDescriptor({ alias: 'live', source: 'codimd', noteId: 'abc123' })
    expect(d.isCollaborative).toBe(true)
    expect(d.steps.find(s => s.id === 'pull-note')?.enabled).toBe(true)
  })

  it('treats a source without a noteId as NOT collaborative', () => {
    const d = buildFreezeDescriptor({ alias: 'half', source: 'codimd' })
    expect(d.isCollaborative).toBe(false)
    expect(d.steps.find(s => s.id === 'pull-note')?.enabled).toBe(false)
  })

  it('treats a noteId without a source as NOT collaborative', () => {
    const d = buildFreezeDescriptor({ alias: 'orphan', noteId: 'abc123' })
    expect(d.isCollaborative).toBe(false)
  })

  it('supports hackmd as a collaborative source', () => {
    const d = buildFreezeDescriptor({ alias: 'hm', source: 'hackmd', noteId: 'xyz' })
    expect(d.isCollaborative).toBe(true)
  })

  it('overrides theme, frozen host dir and bundle out from options', () => {
    const d = buildFreezeDescriptor(
      { alias: 'deck' },
      { theme: 'dsfr', frozenHostDir: '.archive', bundleOut: 'out' },
    )
    expect(d.theme).toBe('dsfr')
    expect(d.hostDir).toBe('.archive/deck')
    expect(d.bundleOut).toBe('out')
  })

  it('always plans the four steps in pipeline order', () => {
    const d = buildFreezeDescriptor({ alias: 'deck' })
    expect(d.steps.map(s => s.id)).toEqual([
      'pull-note',
      'bundle-frozen',
      'host-frozen',
      'flip-lifecycle',
    ])
  })

  it('is pure — does not mutate the input entry or options', () => {
    const entry = { alias: 'deck' }
    const options = {}
    buildFreezeDescriptor(entry, options)
    expect(entry).toEqual({ alias: 'deck' })
    expect(options).toEqual({})
  })
})
