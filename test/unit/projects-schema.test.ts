import { describe, expect, it } from 'vitest'
import { parseProjects } from '../../shared/projects/schema'

describe('parseProjects', () => {
  it('maps slug → metadata and sorts by order then title', () => {
    const projects = parseProjects({
      'vitrine': { title: 'Site vitrine', order: 2 },
      'portail-rse': { title: 'Portail RSE', order: 1, color: '#fff' },
    })
    expect(projects.map(p => p.slug)).toEqual(['portail-rse', 'vitrine'])
    expect(projects[0]).toMatchObject({ slug: 'portail-rse', title: 'Portail RSE', order: 1, color: '#fff' })
  })

  it('orders unset order last, ties broken by title (falling back to slug)', () => {
    const projects = parseProjects({
      zeta: { order: 1 },
      beta: {}, // no order, no title → uses slug
      alpha: {}, // no order, no title → uses slug
    })
    expect(projects.map(p => p.slug)).toEqual(['zeta', 'alpha', 'beta'])
  })

  it('coerces a numeric-string order', () => {
    const projects = parseProjects({ a: { order: '3' }, b: { order: '1' } })
    expect(projects.map(p => p.slug)).toEqual(['b', 'a'])
  })

  it('returns an empty list for nullish or malformed input (non-throwing)', () => {
    expect(parseProjects(null)).toEqual([])
    expect(parseProjects(undefined)).toEqual([])
    // A non-object value fails schema validation → empty, never throws.
    expect(parseProjects('nope')).toEqual([])
  })
})
