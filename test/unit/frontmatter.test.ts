import { describe, expect, it } from 'vitest'
import {
  serializeFrontmatter,
  splitFrontmatter,
  stringifyDocument,
  stripFrontmatter,
} from '../../shared/deck/frontmatter'

describe('splitFrontmatter', () => {
  it('parses nested keys the legacy flat parser dropped (margins bug)', () => {
    const md = '---\ntheme: lee\nreveal:\n  margin: 0.2\n  width: 1200\n---\n\n# Slide'
    const { data, body, hasFrontmatter } = splitFrontmatter(md)
    expect(hasFrontmatter).toBe(true)
    expect(data).toEqual({ theme: 'lee', reveal: { margin: 0.2, width: 1200 } })
    expect(body).toBe('\n# Slide')
  })

  it('handles documents without frontmatter', () => {
    const { data, body, hasFrontmatter } = splitFrontmatter('# Just a title')
    expect(hasFrontmatter).toBe(false)
    expect(data).toEqual({})
    expect(body).toBe('# Just a title')
  })

  it('parses arrays', () => {
    const md = '---\naliases:\n  - /old\n  - /older\n---\nbody'
    expect(splitFrontmatter(md).data).toEqual({ aliases: ['/old', '/older'] })
  })
})

describe('stripFrontmatter', () => {
  it('keeps the blank line after the fence, like the legacy helper', () => {
    expect(stripFrontmatter('---\ntheme: lee\n---\n\n# x')).toBe('\n# x')
  })
})

describe('serializeFrontmatter / stringifyDocument round-trips', () => {
  it('round-trips through YAML preserving nested structure', () => {
    const data = { theme: 'lee', reveal: { margin: 0.2, width: 1200 }, backgrounds: { h1: '/a.png' } }
    const yaml = serializeFrontmatter(data)
    expect(splitFrontmatter(`---\n${yaml}---\n\nbody`).data).toEqual(data)
  })

  it('emits the existing on-the-wire shape', () => {
    const out = stringifyDocument({ theme: 'lee' }, '# Slide')
    expect(out.startsWith('---\n')).toBe(true)
    expect(out).toContain('\n---\n\n# Slide')
  })

  it('returns body only when there is no frontmatter', () => {
    expect(stringifyDocument({}, '# Slide')).toBe('# Slide')
  })
})
