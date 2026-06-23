import { describe, expect, it } from 'vitest'
import {
  ANNOTATION_TAGS,
  BACKGROUND_ANNOTATION_TAG,
  buildComponentMap,
  DECK_ANNOTATIONS,
  DECK_COMPONENTS,
  FULL_SLIDE_COMPONENT_NAMES,
  normalizeIconName,
  STRIPPED_ANNOTATION_TAGS,
} from '../../shared/deck/components'

describe('annotation contract', () => {
  it('exposes the tags as a flat array matching the annotation list', () => {
    expect(ANNOTATION_TAGS).toEqual(DECK_ANNOTATIONS.map(a => a.tag))
  })

  it('includes every slide annotation the parser extracts', () => {
    expect(ANNOTATION_TAGS).toEqual([
      'slide-background',
      'pretitle',
      'subtitle',
      'layout',
      'quicklink',
    ])
  })

  it('strips every annotation except the background one (handled separately)', () => {
    expect(STRIPPED_ANNOTATION_TAGS).not.toContain(BACKGROUND_ANNOTATION_TAG)
    expect(STRIPPED_ANNOTATION_TAGS).toEqual(['pretitle', 'subtitle', 'layout', 'quicklink'])
  })

  it('names the background annotation tag', () => {
    expect(BACKGROUND_ANNOTATION_TAG).toBe('slide-background')
    expect(ANNOTATION_TAGS).toContain(BACKGROUND_ANNOTATION_TAG)
  })
})

describe('buildComponentMap', () => {
  const map = buildComponentMap()

  it('maps every canonical name to its component', () => {
    expect(map.Quote).toBe('Quote')
    expect(map.IconInline).toBe('IconInline')
    expect(map.Columns).toBe('Columns')
  })

  it('resolves aliases to the same component as the canonical name', () => {
    expect(map.i).toBe('IconInline')
    expect(map.TwoColumns).toBe('Columns')
    expect(map.ThreeColumns).toBe('Columns')
    expect(map['full-screen-image']).toBe('FullScreenImage')
  })

  it('covers exactly the canonical names plus all aliases', () => {
    const expected = DECK_COMPONENTS.flatMap(c => [c.name, ...(c.aliases || [])])
    expect(Object.keys(map).sort()).toEqual(expected.sort())
  })

  it('does not register slide-background (it is an annotation, not a component)', () => {
    expect(map['slide-background']).toBeUndefined()
  })
})

describe('fULL_SLIDE_COMPONENT_NAMES', () => {
  it('lists the full-slide components with their aliases', () => {
    expect(FULL_SLIDE_COMPONENT_NAMES).toEqual(['FullScreenImage', 'full-screen-image'])
  })
})

describe('normalizeIconName', () => {
  it('passes through Iconify format unchanged', () => {
    expect(normalizeIconName('ri:home-line')).toBe('ri:home-line')
    expect(normalizeIconName('mdi:account')).toBe('mdi:account')
  })

  it('converts the Remix CSS-class form (first hyphen → colon)', () => {
    expect(normalizeIconName('ri-home-line')).toBe('ri:home-line')
    expect(normalizeIconName('ri-arrow-right-line')).toBe('ri:arrow-right-line')
  })

  it('only converts the first hyphen', () => {
    expect(normalizeIconName('ri-a-b-c')).toBe('ri:a-b-c')
  })
})
