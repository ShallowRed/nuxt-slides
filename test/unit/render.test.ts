import { describe, expect, it } from 'vitest'
import {
  DEFAULT_REVEAL_CONFIG,
  EMBED_SANDBOX,
  mergeRevealConfig,
  rebaseAssetUrls,
} from '../../shared/render/reveal'

describe('mergeRevealConfig', () => {
  it('returns the defaults when no deck config is given', () => {
    expect(mergeRevealConfig()).toEqual(DEFAULT_REVEAL_CONFIG)
  })

  it('overrides defaults with the deck reveal frontmatter', () => {
    const merged = mergeRevealConfig({ margin: 0.2, width: 1200 })
    expect(merged.margin).toBe(0.2)
    expect(merged.width).toBe(1200)
    expect(merged.hash).toBe(true) // default preserved
  })
})

describe('eMBED_SANDBOX', () => {
  it('omits top-navigation so embeds cannot hijack the window', () => {
    expect(EMBED_SANDBOX).not.toContain('allow-top-navigation')
    expect(EMBED_SANDBOX).toContain('allow-scripts')
    expect(EMBED_SANDBOX).toContain('allow-same-origin')
  })
})

describe('rebaseAssetUrls', () => {
  it('rebases root-absolute asset URLs to the bundle-relative prefix', () => {
    const html = '<img src="/images/x.png"><a href="/backgrounds/y.png">'
    expect(rebaseAssetUrls(html, '../..')).toBe(
      '<img src="../../images/x.png"><a href="../../backgrounds/y.png">',
    )
  })

  it('covers data-preview-link (lightbox) and _storybook assets', () => {
    const html = '<a data-preview-link="/_storybook/iframe.html">'
    expect(rebaseAssetUrls(html, '../..')).toBe(
      '<a data-preview-link="../../_storybook/iframe.html">',
    )
  })

  it('leaves non-asset and remote URLs untouched', () => {
    const html = '<a href="/slides/foo"><img src="https://cdn/x/images/z.png">'
    expect(rebaseAssetUrls(html, '../..')).toBe(html)
  })
})
