import type { PresentationListItem } from '../../shared/presentations/list-item'
import { describe, expect, it } from 'vitest'
import { applyCatalogQuery, countByStatus } from '../../shared/presentations/catalog-view'

function item(partial: Partial<PresentationListItem> & { slug: string }): PresentationListItem {
  return {
    title: partial.slug,
    theme: 'dsfr',
    status: 'public',
    filename: `${partial.slug}.md`,
    ...partial,
  }
}

const catalog: PresentationListItem[] = [
  item({ slug: 'zeta', title: 'Zeta deck', theme: 'corporate', status: 'public' }),
  item({ slug: 'alpha', title: 'Alpha intro', theme: 'dsfr', status: 'draft' }),
  item({ slug: 'mid', title: 'Mid talk', theme: 'dsfr', status: 'semi-private' }),
  item({ slug: 'priv', title: 'Private notes', theme: 'dsfr', status: 'private' }),
]

describe('applyCatalogQuery', () => {
  it('returns all items sorted by title asc by default', () => {
    expect(applyCatalogQuery(catalog).map(p => p.slug))
      .toEqual(['alpha', 'mid', 'priv', 'zeta'])
  })

  it('does not mutate the input array', () => {
    const before = catalog.map(p => p.slug)
    applyCatalogQuery(catalog, { sortDir: 'desc' })
    expect(catalog.map(p => p.slug)).toEqual(before)
  })

  it('search matches title, slug and theme, case-insensitively', () => {
    expect(applyCatalogQuery(catalog, { search: 'ZETA' }).map(p => p.slug)).toEqual(['zeta'])
    expect(applyCatalogQuery(catalog, { search: 'corporate' }).map(p => p.slug)).toEqual(['zeta'])
    expect(applyCatalogQuery(catalog, { search: 'priv' }).map(p => p.slug)).toEqual(['priv'])
  })

  it('filters by status set; empty set means all', () => {
    expect(applyCatalogQuery(catalog, { statuses: ['public', 'draft'] }).map(p => p.slug))
      .toEqual(['alpha', 'zeta'])
    expect(applyCatalogQuery(catalog, { statuses: [] }).map(p => p.slug))
      .toEqual(['alpha', 'mid', 'priv', 'zeta'])
  })

  it('sorts by status in canonical order, ties broken by title', () => {
    expect(applyCatalogQuery(catalog, { sortKey: 'status' }).map(p => p.status))
      .toEqual(['public', 'semi-private', 'private', 'draft'])
  })

  it('reverses with sortDir desc', () => {
    expect(applyCatalogQuery(catalog, { sortKey: 'title', sortDir: 'desc' }).map(p => p.slug))
      .toEqual(['zeta', 'priv', 'mid', 'alpha'])
  })

  it('combines search + filter + sort', () => {
    const big: PresentationListItem[] = [
      item({ slug: 'd1', title: 'Demo one', status: 'public' }),
      item({ slug: 'd2', title: 'Demo two', status: 'draft' }),
      item({ slug: 'x', title: 'Other', status: 'public' }),
    ]
    expect(applyCatalogQuery(big, { search: 'demo', statuses: ['public'], sortKey: 'title', sortDir: 'desc' })
      .map(p => p.slug)).toEqual(['d1'])
  })
})

describe('countByStatus', () => {
  it('counts each status, zero for absent', () => {
    expect(countByStatus(catalog)).toEqual({
      'public': 1,
      'semi-private': 1,
      'private': 1,
      'draft': 1,
    })
    expect(countByStatus([])).toEqual({ 'public': 0, 'semi-private': 0, 'private': 0, 'draft': 0 })
  })
})
