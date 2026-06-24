import type { AccessInput } from '../../shared/access/decide'
import type { Role } from '../../shared/access/roles'
import type { PublicationStatus } from '../../shared/access/status'
import { describe, expect, it } from 'vitest'
import { canList, decideAccess } from '../../shared/access/decide'

const ROLES: Role[] = ['anonymous', 'viewer', 'editor', 'owner']
const STATUSES: PublicationStatus[] = ['public', 'draft', 'private', 'semi-private']

function input(over: Partial<AccessInput> & Pick<AccessInput, 'status' | 'role'>): AccessInput {
  return { hasPassword: false, passwordGranted: false, ...over }
}

describe('decideAccess — view matrix', () => {
  it('lets privileged roles view every status', () => {
    for (const role of ['owner', 'editor'] as Role[]) {
      for (const status of STATUSES)
        expect(decideAccess(input({ status, role })).outcome).toBe('allow')
    }
  })

  it('lets anyone view public', () => {
    for (const role of ROLES)
      expect(decideAccess(input({ status: 'public', role })).outcome).toBe('allow')
  })

  it('denies draft/private to anonymous as auth-required', () => {
    for (const status of ['draft', 'private'] as PublicationStatus[]) {
      expect(decideAccess(input({ status, role: 'anonymous' })))
        .toEqual({ outcome: 'deny', reason: 'auth-required' })
    }
  })

  it('denies draft/private to an authenticated viewer as forbidden (403, not 401)', () => {
    for (const status of ['draft', 'private'] as PublicationStatus[]) {
      expect(decideAccess(input({ status, role: 'viewer' })))
        .toEqual({ outcome: 'deny', reason: 'forbidden' })
    }
  })
})

describe('decideAccess — semi-private password gate', () => {
  it('allows when no password hash is declared (no gate)', () => {
    expect(decideAccess(input({ status: 'semi-private', role: 'anonymous', hasPassword: false })).outcome)
      .toBe('allow')
  })

  it('needs password when a hash is declared and not yet granted', () => {
    expect(decideAccess(input({ status: 'semi-private', role: 'viewer', hasPassword: true, passwordGranted: false })))
      .toEqual({ outcome: 'needs-password' })
  })

  it('allows once the password is granted', () => {
    expect(decideAccess(input({ status: 'semi-private', role: 'anonymous', hasPassword: true, passwordGranted: true })).outcome)
      .toBe('allow')
  })

  it('lets privileged roles skip the password gate', () => {
    expect(decideAccess(input({ status: 'semi-private', role: 'owner', hasPassword: true, passwordGranted: false })).outcome)
      .toBe('allow')
  })
})

describe('decideAccess — admin/edit actions', () => {
  it('allows admin/edit only for privileged roles', () => {
    for (const action of ['admin', 'edit'] as const) {
      expect(decideAccess(input({ status: 'public', role: 'owner', action })).outcome).toBe('allow')
      expect(decideAccess(input({ status: 'public', role: 'editor', action })).outcome).toBe('allow')
      expect(decideAccess(input({ status: 'public', role: 'viewer', action })))
        .toEqual({ outcome: 'deny', reason: 'forbidden' })
      expect(decideAccess(input({ status: 'public', role: 'anonymous', action })))
        .toEqual({ outcome: 'deny', reason: 'auth-required' })
    }
  })
})

describe('canList', () => {
  it('shows everything to privileged roles', () => {
    for (const status of STATUSES) {
      expect(canList({ status, role: 'owner', unlisted: true, lifecycle: 'archived' })).toBe(true)
      expect(canList({ status, role: 'editor' })).toBe(true)
    }
  })

  it('shows public + semi-private to non-privileged, hides draft/private', () => {
    for (const role of ['anonymous', 'viewer'] as Role[]) {
      expect(canList({ status: 'public', role })).toBe(true)
      expect(canList({ status: 'semi-private', role })).toBe(true)
      expect(canList({ status: 'draft', role })).toBe(false)
      expect(canList({ status: 'private', role })).toBe(false)
    }
  })

  it('hides unlisted and archived decks from non-privileged', () => {
    expect(canList({ status: 'public', role: 'anonymous', unlisted: true })).toBe(false)
    expect(canList({ status: 'public', role: 'viewer', lifecycle: 'archived' })).toBe(false)
  })
})
