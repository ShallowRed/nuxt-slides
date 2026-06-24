import { describe, expect, it } from 'vitest'
import { readRoleMap, resolveRole } from '../../shared/access/resolve-role'

describe('readRoleMap', () => {
  it('parses comma-separated logins, trimmed and lowercased', () => {
    expect(readRoleMap({ NUXT_OWNER_LOGINS: 'Alice, BOB ', NUXT_EDITOR_LOGINS: 'carol' }))
      .toEqual({ owner: ['alice', 'bob'], editor: ['carol'] })
  })

  it('returns empty lists when env is unset', () => {
    expect(readRoleMap({})).toEqual({ owner: [], editor: [] })
  })

  it('drops empty entries', () => {
    expect(readRoleMap({ NUXT_OWNER_LOGINS: 'a,,b, ' }).owner).toEqual(['a', 'b'])
  })
})

describe('resolveRole', () => {
  const map = { owner: ['alice'], editor: ['carol'] }

  it('maps a null/empty login to anonymous', () => {
    expect(resolveRole(null, map)).toBe('anonymous')
    expect(resolveRole(undefined, map)).toBe('anonymous')
    expect(resolveRole('', map)).toBe('anonymous')
  })

  it('resolves owner and editor by login (case-insensitive)', () => {
    expect(resolveRole('alice', map)).toBe('owner')
    expect(resolveRole('ALICE', map)).toBe('owner')
    expect(resolveRole('Carol', map)).toBe('editor')
  })

  it('maps an unknown authenticated login to viewer', () => {
    expect(resolveRole('mallory', map)).toBe('viewer')
  })

  it('lets owner win over editor when a login is in both lists', () => {
    expect(resolveRole('dave', { owner: ['dave'], editor: ['dave'] })).toBe('owner')
  })
})
