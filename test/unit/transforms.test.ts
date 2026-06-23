import type { Slide } from '../../shared/deck/model'
import { describe, expect, it } from 'vitest'
import {
  buildDeckModel,
  collectAssets,
  getMediaFit,
  resolveSlideBackground,
  resolveSlideMedia,
  runTransforms,
} from '../../shared/render/transforms'

describe('resolveSlideMedia (extracted from SlideContent.mediaParts)', () => {
  it('returns null without layoutProps or src', () => {
    expect(resolveSlideMedia(undefined)).toBeNull()
    expect(resolveSlideMedia({ title: 'x' })).toBeNull()
  })

  it('resolves a story id to a scaled, interactive iframe', () => {
    const media = resolveSlideMedia({ story: 'comp--page' }, { storybook: 'https://sb.example' })!
    expect(media.type).toBe('iframe')
    expect(media.src).toBe('https://sb.example/iframe.html?id=comp--page&viewMode=story')
    expect(media.scaled).toBe(true)
    expect(media.interactive).toBe(true) // no lightbox → interactive in place
    expect(media.previewWidth).toBe(1440)
  })

  it('honors preview-width (MDC kebab-case) and disables scaling on fit=contain', () => {
    const media = resolveSlideMedia(
      { 'story': 'c--p', 'preview-width': '1600', 'fit': 'contain' },
      { storybook: 'https://sb' },
    )!
    expect(media.fit).toBe('contain')
    expect(media.scaled).toBe(false)
    expect(media.previewWidth).toBe(1600)
  })

  it('falls back to an explicit image src/type', () => {
    const media = resolveSlideMedia({ src: '/images/x.png', type: 'image' })!
    expect(media.type).toBe('image')
    expect(media.scaled).toBe(false)
  })

  it('exposes lightbox preview link/image', () => {
    const frame = resolveSlideMedia({ story: 'c--p', lightbox: 'true' }, { storybook: 'https://sb' })!
    expect(frame.hasLightbox).toBe(true)
    expect(frame.interactive).toBe(false)
    expect(frame.previewLink).toBe(frame.src)
    const img = resolveSlideMedia({ src: '/images/y.png', type: 'image', lightbox: 'true' })!
    expect(img.previewImage).toBe('/images/y.png')
  })

  it('getMediaFit defaults to cover', () => {
    expect(getMediaFit()).toBe('cover')
    expect(getMediaFit({ fit: 'contain' })).toBe('contain')
  })
})

describe('resolveSlideBackground (precedence preserved)', () => {
  it('slide override wins over everything', () => {
    expect(resolveSlideBackground({ backgroundImage: '/o.png', headingLevel: 'h1' }, 'lee')).toBe('/o.png')
  })

  it('frontmatter custom backgrounds win over theme tokens', () => {
    const r = resolveSlideBackground({ headingLevel: 'h1' }, 'lee', { h1: '/custom.png' })
    expect(r).toBe('/custom.png')
  })

  it('falls back to theme tokens by heading level', () => {
    expect(resolveSlideBackground({ headingLevel: 'h1' }, 'lee')).toBe('/backgrounds/lee-slide-contrast.png')
  })

  it('returns undefined for a theme with no backgrounds', () => {
    expect(resolveSlideBackground({ headingLevel: 'h1' }, 'minimal')).toBeUndefined()
  })
})

describe('collectAssets + pipeline', () => {
  const slides: Slide[] = [
    { body: {}, headingLevel: 'h1', layout: 'media-right', layoutProps: { story: 'c--p' } },
    {
      body: {},
      headingLevel: 'h2',
      verticalSlides: [
        { body: {}, layout: 'media-left', layoutProps: { src: '/images/z.png', type: 'image' } },
      ],
    },
  ]

  it('collects storybook, image, and background assets (deduped)', () => {
    const assets = collectAssets(slides, { storybook: 'https://sb', theme: 'lee' })
    const kinds = assets.map(a => a.kind)
    expect(kinds).toContain('storybook')
    expect(kinds).toContain('image')
    // lee h1 background is collected once.
    expect(assets.some(a => a.url === '/backgrounds/lee-slide-contrast.png')).toBe(true)
  })

  it('buildDeckModel runs the default pipeline and fills assets', () => {
    const model = buildDeckModel({ theme: 'lee', storybook: 'https://sb' }, slides, { parser: 'separator', source: 'codimd' })
    expect(model.assets.length).toBeGreaterThan(0)
    expect(model.provenance).toEqual({ parser: 'separator', source: 'codimd' })
  })

  it('runTransforms applies named steps in order', () => {
    const tagged = runTransforms(
      { meta: {}, slides: [], assets: [] },
      [{ name: 'mark', apply: m => ({ ...m, meta: { ...m.meta, title: 'done' } }) }],
    )
    expect(tagged.meta.title).toBe('done')
  })
})
